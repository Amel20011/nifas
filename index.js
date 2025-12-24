const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion, getAggregateVotesInPollMessage } = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const fs = require('fs-extra');
const path = require('path');
const qrcode = require('qrcode-terminal');
const config = require('./config');
const P = require('pino');

// Import Commands
const commands = require('./commands');

// Import Database
const db = require('./lib/database');

// Import Utils
const utils = require('./lib/utils');

// Session Management
async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('./sessions');
    const { version } = await fetchLatestBaileysVersion();
    
    const sock = makeWASocket({
        version,
        logger: P({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['Ubuntu', 'Chrome', '20.0.04'],
        markOnlineOnConnect: true,
        generateHighQualityLinkPreview: true,
        getMessage: async (key) => {
            return {
                conversation: "Message not found"
            }
        }
    });

    // Store Session
    store.bind(sock.ev);

    // Connection Update Handler
    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;
        
        if (qr) {
            qrcode.generate(qr, { small: true });
            console.log(config.EMOJI.FLOWER + ' Scan QR Code di atas!');
        }

        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut);
            console.log(config.EMOJI.CLOVER + ' Koneksi terputus, reconnecting...');
            
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log(config.EMOJI.HEART + ' Bot telah terhubung!');
            console.log(config.EMOJI.CANDY + ` Bot Name: ${config.BOT_NAME}`);
            console.log(config.EMOJI.MAPLE + ` Owner: ${config.OWNER_NUMBER}`);
        }
    });

    // Save Credentials
    sock.ev.on('creds.update', saveCreds);

    // Message Handler
    sock.ev.on('messages.upsert', async (m) => {
        const msg = m.messages[0];
        
        // Skip if no message or from status
        if (!msg.message || msg.key.remoteJid === 'status@broadcast') return;

        const from = msg.key.remoteJid;
        const isGroup = from.endsWith('@g.us');
        const sender = isGroup ? msg.key.participant : from;
        const pushName = msg.pushName || 'User';
        const messageType = Object.keys(msg.message)[0];
        const isCommand = msg.message.conversation?.startsWith(config.PREFIX) || 
                         msg.message.extendedTextMessage?.text?.startsWith(config.PREFIX);
        
        // Extract Message Text
        let body = '';
        if (messageType === 'conversation') {
            body = msg.message.conversation;
        } else if (messageType === 'extendedTextMessage') {
            body = msg.message.extendedTextMessage.text;
        } else if (msg.message.imageMessage?.caption) {
            body = msg.message.imageMessage.caption;
        } else if (msg.message.videoMessage?.caption) {
            body = msg.message.videoMessage.caption;
        }

        // Handle Commands
        if (isCommand && body) {
            const command = body.slice(config.PREFIX.length).split(' ')[0].toLowerCase();
            const args = body.slice(config.PREFIX.length + command.length).trim().split(' ');
            
            console.log(`${config.EMOJI.NOTE} Command: ${command} | From: ${pushName} | Group: ${isGroup}`);
            
            // Execute Command
            await handleCommand(sock, msg, command, args, from, sender, isGroup, pushName);
        }

        // Auto Read Messages
        if (config.FEATURES.AUTO_READ) {
            await sock.readMessages([msg.key]);
        }

        // Welcome Message for New Group Members
        if (config.FEATURES.WELCOME_MESSAGE && msg.message?.protocolMessage?.type === 0 && isGroup) {
            const participant = msg.message.protocolMessage.key.participant;
            const welcomeMsg = config.MESSAGES.WELCOME.replace('{botname}', config.BOT_NAME);
            
            await sock.sendMessage(from, {
                text: `${config.EMOJI.FLOWER} ${welcomeMsg}`,
                mentions: [participant]
            });
        }
    });

    // Group Update Handler
    sock.ev.on('group-participants.update', async (update) => {
        const { id, participants, action } = update;
        
        if (config.FEATURES.WELCOME_MESSAGE && action === 'add') {
            const welcomeMsg = config.MESSAGES.WELCOME.replace('{botname}', config.BOT_NAME);
            
            for (const participant of participants) {
                await sock.sendMessage(id, {
                    text: `${config.EMOJI.FLOWER} ${welcomeMsg}`,
                    mentions: [participant]
                });
            }
        }
        
        if (config.FEATURES.GOODBYE_MESSAGE && action === 'remove') {
            for (const participant of participants) {
                await sock.sendMessage(id, {
                    text: `${config.EMOJI.MAPLE} ${config.MESSAGES.GOODBYE}`,
                    mentions: [participant]
                });
            }
        }
    });

    return sock;
}

// Command Handler Function
async function handleCommand(sock, msg, command, args, from, sender, isGroup, pushName) {
    try {
        // Check if user is registered (for certain commands)
        const userData = await db.getUser(sender);
        const isOwner = sender === config.OWNER_NUMBER + '@s.whatsapp.net';
        const isPremium = userData?.premium || false;
        
        // Main Menu Commands
        switch(command) {
            case 'menu':
            case 'help':
                await commands.main.menu(sock, from, sender, pushName);
                break;
                
            case 'allmenu':
                await commands.main.allmenu(sock, from);
                break;
                
            case 'infobot':
                await commands.main.infobot(sock, from);
                break;
                
            case 'ping':
                await commands.main.ping(sock, from, msg);
                break;
                
            case 'owner':
                await commands.main.owner(sock, from);
                break;
                
            // User Commands
            case 'profile':
                await commands.user.profile(sock, from, sender, pushName, userData);
                break;
                
            case 'register':
                await commands.user.register(sock, from, sender, pushName);
                break;
                
            case 'claim':
                await commands.user.claim(sock, from, sender, userData);
                break;
                
            case 'limit':
                await commands.user.limit(sock, from, sender, userData);
                break;
                
            case 'premium':
                await commands.user.premium(sock, from, sender, userData);
                break;
                
            // Download Commands
            case 'ytmp3':
                if (args[0]) await commands.download.ytmp3(sock, from, args[0]);
                break;
                
            case 'ytmp4':
                if (args[0]) await commands.download.ytmp4(sock, from, args[0]);
                break;
                
            case 'tiktok':
                if (args[0]) await commands.download.tiktok(sock, from, args[0]);
                break;
                
            // Search Commands
            case 'google':
                if (args[0]) await commands.search.google(sock, from, args.join(' '));
                break;
                
            case 'pinterest':
                if (args[0]) await commands.search.pinterest(sock, from, args.join(' '));
                break;
                
            // Fun Commands
            case 'quotes':
                await commands.fun.quotes(sock, from);
                break;
                
            case 'truth':
                await commands.fun.truth(sock, from);
                break;
                
            case 'dare':
                await commands.fun.dare(sock, from);
                break;
                
            // Tools Commands
            case 'sticker':
                if (msg.message.imageMessage || msg.message.videoMessage) {
                    await commands.tools.sticker(sock, from, msg);
                }
                break;
                
            case 'translate':
                if (args[0]) await commands.tools.translate(sock, from, args.join(' '));
                break;
                
            // Owner Commands
            case 'addprem':
                if (isOwner && args[0]) await commands.owner.addprem(sock, from, args[0]);
                break;
                
            case 'delprem':
                if (isOwner && args[0]) await commands.owner.delprem(sock, from, args[0]);
                break;
                
            case 'broadcast':
                if (isOwner && args[0]) await commands.owner.broadcast(sock, args.join(' '));
                break;
                
            case 'restart':
                if (isOwner) await commands.owner.restart(sock, from);
                break;
                
            case 'setmenu':
                if (isOwner) await commands.owner.setmenu(sock, from);
                break;
                
            default:
                await sock.sendMessage(from, {
                    text: `${config.EMOJI.CLOVER} Command tidak dikenali!\n\nKetik *${config.PREFIX}menu* untuk melihat daftar command.`
                });
        }
        
    } catch (error) {
        console.error(error);
        await sock.sendMessage(from, {
            text: `${config.EMOJI.CLOVER} ${config.MESSAGES.ERROR}\n\nError: ${error.message}`
        });
    }
}

// Start Bot
connectToWhatsApp();

// Handle process exit
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('SIGINT', () => {
    console.log(config.EMOJI.FLOWER + ' Bot dimatikan...');
    process.exit(0);
});
