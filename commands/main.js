const config = require('../config');
const utils = require('../lib/utils');

module.exports = {
    menu: async (sock, from, sender, pushName) => {
        await sock.sendMessage(from, {
            text: `Hallo Sahabat ${pushName} ${config.EMOJI.HEART} Terimakasih Telah menggunakan kami. ${config.EMOJI.FLOWER} Silahkan pilih menu di bawah ini! ${config.EMOJI.CLOVER}\n\n` +
                  `*${config.EMOJI.HEART}${config.EMOJI.CANDY}${config.EMOJI.FLOWER}${config.EMOJI.CLOVER}${config.EMOJI.MAPLE}*\n` +
                  `      *ALL MENU*\n` +
                  `  *${config.BOT_NAME}*\n` +
                  `*${config.EMOJI.HEART}${config.EMOJI.CANDY}${config.EMOJI.FLOWER}${config.EMOJI.CLOVER}${config.EMOJI.MAPLE}*\n\n` +
                  `${config.EMOJI.FLOWER} *Halo Sahabat ${pushName}* ${config.EMOJI.HEART}\n` +
                  `Berikut daftar fitur yang tersedia\n` +
                  `Silahkan gunakan dengan bijak ya ${config.EMOJI.CLOVER}`,
            footer: config.BOT_NAME,
            title: '🌸 MENU UTAMA 🌸',
            buttonText: '📱 Buka Menu',
            sections: [
                {
                    title: `${config.EMOJI.HEART} MAIN MENU`,
                    rows: [
                        { title: `${config.EMOJI.CANDY} .menu`, rowId: ".menu", description: "Menu utama bot" },
                        { title: `${config.EMOJI.FLOWER} .allmenu`, rowId: ".allmenu", description: "Semua menu dalam text" },
                        { title: `${config.EMOJI.CLOVER} .infobot`, rowId: ".infobot", description: "Informasi bot" },
                        { title: `${config.EMOJI.MAPLE} .ping`, rowId: ".ping", description: "Cek kecepatan bot" },
                        { title: `${config.EMOJI.HEART} .owner`, rowId: ".owner", description: "Informasi owner" }
                    ]
                },
                {
                    title: `🌸 USER MENU`,
                    rows: [
                        { title: `${config.EMOJI.CANDY} .profile`, rowId: ".profile", description: "Lihat profile anda" },
                        { title: `${config.EMOJI.FLOWER} .register`, rowId: ".register", description: "Daftar sebagai user" },
                        { title: `${config.EMOJI.CLOVER} .claim`, rowId: ".claim", description: "Claim limit harian" },
                        { title: `${config.EMOJI.MAPLE} .limit`, rowId: ".limit", description: "Cek limit anda" },
                        { title: `${config.EMOJI.HEART} .premium`, rowId: ".premium", description: "Informasi premium" }
                    ]
                },
                {
                    title: `${config.EMOJI.MAPLE} DOWNLOAD MENU`,
                    rows: [
                        { title: `${config.EMOJI.FLOWER} .ytmp3`, rowId: ".ytmp3", description: "Download YouTube MP3" },
                        { title: `${config.EMOJI.CANDY} .ytmp4`, rowId: ".ytmp4", description: "Download YouTube MP4" },
                        { title: `${config.EMOJI.CLOVER} .tiktok`, rowId: ".tiktok", description: "Download TikTok" },
                        { title: `${config.EMOJI.MAPLE} .instagram`, rowId: ".instagram", description: "Download Instagram" },
                        { title: `${config.EMOJI.HEART} .facebook`, rowId: ".facebook", description: "Download Facebook" }
                    ]
                },
                {
                    title: `${config.EMOJI.FLOWER} SEARCH MENU`,
                    rows: [
                        { title: `${config.EMOJI.CANDY} .google`, rowId: ".google", description: "Search Google" },
                        { title: `${config.EMOJI.FLOWER} .pinterest`, rowId: ".pinterest", description: "Search Pinterest" },
                        { title: `${config.EMOJI.CLOVER} .wikipedia`, rowId: ".wikipedia", description: "Search Wikipedia" },
                        { title: `${config.EMOJI.MAPLE} .lyrics`, rowId: ".lyrics", description: "Cari lirik lagu" },
                        { title: `${config.EMOJI.HEART} .image`, rowId: ".image", description: "Cari gambar" }
                    ]
                },
                {
                    title: `${config.EMOJI.HEART} FUN MENU`,
                    rows: [
                        { title: `${config.EMOJI.FLOWER} .quotes`, rowId: ".quotes", description: "Dapatkan quotes" },
                        { title: `${config.EMOJI.CANDY} .truth`, rowId: ".truth", description: "Truth challenge" },
                        { title: `${config.EMOJI.CLOVER} .dare`, rowId: ".dare", description: "Dare challenge" },
                        { title: `${config.EMOJI.MAPLE} .tebakkata`, rowId: ".tebakkata", description: "Tebak kata" },
                        { title: `${config.EMOJI.HEART} .tebakgambar`, rowId: ".tebakgambar", description: "Tebak gambar" }
                    ]
                },
                {
                    title: `${config.EMOJI.CLOVER} TOOLS MENU`,
                    rows: [
                        { title: `${config.EMOJI.CANDY} .translate`, rowId: ".translate", description: "Translate text" },
                        { title: `${config.EMOJI.FLOWER} .sticker`, rowId: ".sticker", description: "Buat sticker" },
                        { title: `${config.EMOJI.CLOVER} .toimg`, rowId: ".toimg", description: "Sticker ke gambar" },
                        { title: `${config.EMOJI.MAPLE} .tourl`, rowId: ".tourl", description: "Media ke URL" },
                        { title: `${config.EMOJI.HEART} .tts`, rowId: ".tts", description: "Text to speech" }
                    ]
                },
                {
                    title: `${config.EMOJI.MAPLE} OWNER MENU`,
                    rows: [
                        { title: `${config.EMOJI.FLOWER} .addprem`, rowId: ".addprem", description: "Tambah premium" },
                        { title: `${config.EMOJI.CANDY} .delprem`, rowId: ".delprem", description: "Hapus premium" },
                        { title: `${config.EMOJI.CLOVER} .broadcast`, rowId: ".broadcast", description: "Broadcast pesan" },
                        { title: `${config.EMOJI.MAPLE} .restart`, rowId: ".restart", description: "Restart bot" },
                        { title: `${config.EMOJI.HEART} .setmenu`, rowId: ".setmenu", description: "Setting menu" }
                    ]
                }
            ]
        });
    },
    
    allmenu: async (sock, from) => {
        const text = `*${config.EMOJI.HEART}${config.EMOJI.CANDY}${config.EMOJI.FLOWER}${config.EMOJI.CLOVER}${config.EMOJI.MAPLE}*\n` +
              `      *ALL MENU*\n` +
              `  *${config.BOT_NAME}*\n` +
              `*${config.EMOJI.HEART}${config.EMOJI.CANDY}${config.EMOJI.FLOWER}${config.EMOJI.CLOVER}${config.EMOJI.MAPLE}*\n\n` +
              `${config.EMOJI.FLOWER} *Halo Sahabat Liviaa* ${config.EMOJI.HEART}\n` +
              `Berikut daftar fitur yang tersedia\n` +
              `Silahkan gunakan dengan bijak ya ${config.EMOJI.CLOVER}\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.HEART} *MAIN MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.CANDY} .menu\n` +
              `${config.EMOJI.FLOWER} .allmenu\n` +
              `${config.EMOJI.CLOVER} .infobot\n` +
              `${config.EMOJI.MAPLE} .ping\n` +
              `${config.EMOJI.HEART} .owner\n\n` +
              `────────────────────\n` +
              `🌸 *USER MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.CANDY} .profile\n` +
              `${config.EMOJI.FLOWER} .register\n` +
              `${config.EMOJI.CLOVER} .claim\n` +
              `${config.EMOJI.MAPLE} .limit\n` +
              `${config.EMOJI.HEART} .premium\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.MAPLE} *DOWNLOAD MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.FLOWER} .ytmp3\n` +
              `${config.EMOJI.CANDY} .ytmp4\n` +
              `${config.EMOJI.CLOVER} .tiktok\n` +
              `${config.EMOJI.MAPLE} .instagram\n` +
              `${config.EMOJI.HEART} .facebook\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.FLOWER} *SEARCH MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.CANDY} .google\n` +
              `${config.EMOJI.FLOWER} .pinterest\n` +
              `${config.EMOJI.CLOVER} .wikipedia\n` +
              `${config.EMOJI.MAPLE} .lyrics\n` +
              `${config.EMOJI.HEART} .image\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.HEART} *FUN MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.FLOWER} .quotes\n` +
              `${config.EMOJI.CANDY} .truth\n` +
              `${config.EMOJI.CLOVER} .dare\n` +
              `${config.EMOJI.MAPLE} .tebakkata\n` +
              `${config.EMOJI.HEART} .tebakgambar\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.CLOVER} *TOOLS MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.CANDY} .translate\n` +
              `${config.EMOJI.FLOWER} .sticker\n` +
              `${config.EMOJI.CLOVER} .toimg\n` +
              `${config.EMOJI.MAPLE} .tourl\n` +
              `${config.EMOJI.HEART} .tts\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.MAPLE} *OWNER MENU*\n` +
              `────────────────────\n` +
              `${config.EMOJI.FLOWER} .addprem\n` +
              `${config.EMOJI.CANDY} .delprem\n` +
              `${config.EMOJI.CLOVER} .broadcast\n` +
              `${config.EMOJI.MAPLE} .restart\n` +
              `${config.EMOJI.HEART} .setmenu\n\n` +
              `────────────────────\n` +
              `${config.EMOJI.FLOWER} *${config.BOT_NAME}*\n` +
              `${config.EMOJI.HEART} Simple • Soft • Aesthetic\n` +
              `${config.EMOJI.CLOVER} Owner: ${config.OWNER_NUMBER}\n` +
              `${config.EMOJI.MAPLE} Powered By Baileys\n` +
              `────────────────────`;
              
        await sock.sendMessage(from, { text });
    },
    
    infobot: async (sock, from) => {
        const uptime = utils.formatUptime(process.uptime());
        const memory = utils.formatMemoryUsage();
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.FLOWER} *INFORMASI BOT*\n\n` +
                  `${config.EMOJI.HEART} *Nama:* ${config.BOT_NAME}\n` +
                  `${config.EMOJI.CANDY} *Versi:* 2.0.0\n` +
                  `${config.EMOJI.CLOVER} *Owner:* ${config.OWNER_NUMBER}\n` +
                  `${config.EMOJI.MAPLE} *Library:* Baileys Multi Device\n` +
                  `${config.EMOJI.FLOWER} *Uptime:* ${uptime}\n` +
                  `${config.EMOJI.HEART} *Memory:* ${memory}\n` +
                  `${config.EMOJI.CANDY} *Total Users:* 150\n` +
                  `${config.EMOJI.CLOVER} *Total Groups:* 25\n\n` +
                  `${config.EMOJI.MAPLE} *Deskripsi:*\nBot WhatsApp dengan tema aesthetic yang menyediakan berbagai fitur menarik untuk kebutuhan sehari-hari.`
        });
    },
    
    ping: async (sock, from, msg) => {
        const timestamp = Date.now();
        const latency = timestamp - msg.messageTimestamp * 1000;
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.CANDY} *PONG!* ${config.EMOJI.HEART}\n\n` +
                  `${config.EMOJI.CLOVER} *Latency:* ${latency}ms\n` +
                  `${config.EMOJI.MAPLE} *Speed:* ${latency < 1000 ? '🚀 Super Fast' : '⚡ Fast'}\n` +
                  `${config.EMOJI.FLOWER} *Status:* Online ✅`
        });
    },
    
    owner: async (sock, from) => {
        await sock.sendMessage(from, {
            text: `${config.EMOJI.HEART} *INFORMASI OWNER*\n\n` +
                  `${config.EMOJI.CANDY} *Nama:* Liviaa Chantika\n` +
                  `${config.EMOJI.FLOWER} *Nomor:* ${config.OWNER_NUMBER}\n` +
                  `${config.EMOJI.CLOVER} *Instagram:* @liviaachantika_\n` +
                  `${config.EMOJI.MAPLE} *YouTube:* Liviaa Chantika\n\n` +
                  `${config.EMOJI.HEART} *Contact Owner:*\nhttps://wa.me/${config.OWNER_NUMBER}\n\n` +
                  `${config.EMOJI.CANDY} *Note:*\nUntuk kerjasama atau request fitur bisa langsung chat owner ya!`
        });
    }
};
