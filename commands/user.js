const config = require('../config');
const db = require('../lib/database');

module.exports = {
    profile: async (sock, from, sender, pushName, userData) => {
        if (!userData) {
            return await sock.sendMessage(from, {
                text: `${config.EMOJI.CLOVER} Anda belum terdaftar!\n\nKetik *${config.PREFIX}register* untuk mendaftar.`
            });
        }
        
        const joinDate = new Date(userData.registeredAt).toLocaleDateString('id-ID');
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.FLOWER} *PROFILE USER*\n\n` +
                  `${config.EMOJI.HEART} *Nama:* ${pushName}\n` +
                  `${config.EMOJI.CANDY} *Nomor:* ${sender.split('@')[0]}\n` +
                  `${config.EMOJI.CLOVER} *Status:* ${userData.premium ? '🌟 Premium User' : '👤 Regular User'}\n` +
                  `${config.EMOJI.MAPLE} *Limit:* ${userData.limit}/50\n` +
                  `${config.EMOJI.FLOWER} *Registered:* ${joinDate}\n` +
                  `${config.EMOJI.HEART} *Expired:* ${userData.premiumExpired || 'Tidak ada'}\n\n` +
                  `${config.EMOJI.CANDY} *User ID:* ${userData.userId}`
        });
    },
    
    register: async (sock, from, sender, pushName) => {
        const existingUser = await db.getUser(sender);
        
        if (existingUser) {
            return await sock.sendMessage(from, {
                text: `${config.EMOJI.CANDY} Anda sudah terdaftar sebelumnya!`
            });
        }
        
        const userId = 'USER' + Date.now().toString().slice(-6);
        const userData = {
            userId,
            name: pushName,
            number: sender,
            limit: 50,
            premium: false,
            registeredAt: new Date().toISOString(),
            lastClaim: null
        };
        
        await db.saveUser(sender, userData);
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.HEART} *REGISTRASI BERHASIL!*\n\n` +
                  `${config.EMOJI.FLOWER} Selamat datang ${pushName}!\n` +
                  `${config.EMOJI.CANDY} User ID: ${userId}\n` +
                  `${config.EMOJI.CLOVER} Limit awal: 50\n` +
                  `${config.EMOJI.MAPLE} Status: Regular User\n\n` +
                  `${config.EMOJI.HEART} Gunakan bot dengan bijak ya!`
        });
    },
    
    claim: async (sock, from, sender, userData) => {
        if (!userData) {
            return await sock.sendMessage(from, {
                text: `${config.EMOJI.CLOVER} Anda belum terdaftar!\n\nKetik *${config.PREFIX}register* untuk mendaftar.`
            });
        }
        
        const now = new Date();
        const lastClaim = userData.lastClaim ? new Date(userData.lastClaim) : null;
        
        if (lastClaim && utils.isSameDay(lastClaim, now)) {
            return await sock.sendMessage(from, {
                text: `${config.EMOJI.CANDY} Anda sudah melakukan claim hari ini!\n\nClaim lagi besok ya!`
            });
        }
        
        const addedLimit = userData.premium ? 30 : 15;
        userData.limit += addedLimit;
        userData.lastClaim = now.toISOString();
        
        await db.saveUser(sender, userData);
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.HEART} *CLAIM BERHASIL!*\n\n` +
                  `${config.EMOJI.FLOWER} Anda mendapatkan ${addedLimit} limit!\n` +
                  `${config.EMOJI.CANDY} Total limit sekarang: ${userData.limit}\n` +
                  `${config.EMOJI.CLOVER} Claim selanjutnya: Besok\n\n` +
                  `${config.EMOJI.MAPLE} ${userData.premium ? '🌟 Premium bonus aktif!' : 'Upgrade premium untuk bonus lebih!'}`
        });
    },
    
    limit: async (sock, from, sender, userData) => {
        if (!userData) {
            return await sock.sendMessage(from, {
                text: `${config.EMOJI.CLOVER} Anda belum terdaftar!\n\nKetik *${config.PREFIX}register* untuk mendaftar.`
            });
        }
        
        await sock.sendMessage(from, {
            text: `${config.EMOJI.FLOWER} *INFORMASI LIMIT*\n\n` +
                  `${config.EMOJI.HEART} *Limit tersisa:* ${userData.limit}\n` +
                  `${config.EMOJI.CANDY} *Status:* ${userData.premium ? '🌟 Premium' : '👤 Regular'}\n` +
                  `${config.EMOJI.CLOVER} *Daily Claim:* ${userData.lastClaim ? 'Sudah' : 'Belum'}\n\n` +
                  `${config.EMOJI.MAPLE} *Cara dapat limit:*\n` +
                  `1. Daily claim (.claim)\n` +
                  `2. Upgrade premium\n` +
                  `3. Invite teman (coming soon)`
        });
    },
    
    premium: async (sock, from, sender, userData) => {
        const priceList = `🌟 *DAFTAR HARGA PREMIUM* 🌟\n\n` +
                         `${config.EMOJI.HEART} *1 Minggu:* Rp 5.000\n` +
                         `${config.EMOJI.CANDY} *1 Bulan:* Rp 15.000\n` +
                         `${config.EMOJI.FLOWER} *3 Bulan:* Rp 40.000\n` +
                         `${config.EMOJI.CLOVER} *1 Tahun:* Rp 100.000\n\n` +
                         `${config.EMOJI.MAPLE} *Benefit Premium:*\n` +
                         `• Limit 2x lebih besar\n` +
                         `• Priority support\n` +
                         `• Fitur eksklusif\n` +
                         `• No ads\n\n` +
                         `${config.EMOJI.HEART} *Cara Order:*\n` +
                         `Chat owner: wa.me/${config.OWNER_NUMBER}\n` +
                         `Kirim bukti transfer setelah pembayaran.`;
        
        await sock.sendMessage(from, { text: priceList });
    }
};
