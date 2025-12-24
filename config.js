module.exports = {
    // Bot Configuration
    BOT_NAME: "Liviaa Chantika Bot",
    OWNER_NUMBER: "6285182359268",
    PREFIX: ".",
    
    // Emoji Themes
    EMOJI: {
        HEART: "💗",
        CANDY: "🍬",
        FLOWER: "🌷",
        CLOVER: "☘️",
        MAPLE: "🍁",
        SPARKLE: "✨",
        NOTE: "🎀"
    },
    
    // Database Settings
    DATABASE: {
        TYPE: "json", // json or mongo
        PATH: "./sessions/database.json"
    },
    
    // Feature Settings
    FEATURES: {
        AUTO_READ: true,
        AUTO_TYPING: true,
        ANTI_DELETE: false,
        WELCOME_MESSAGE: true,
        GOODBYE_MESSAGE: true
    },
    
    // API Keys (isi dengan API key Anda)
    API_KEYS: {
        OPENAI: "",
        YOUTUBE: "",
        TIKTOK: "",
        INSTAGRAM: ""
    },
    
    // Message Configuration
    MESSAGES: {
        WELCOME: "🌸 Selamat datang di grup! 🌸\n\nSaya adalah {botname} 🤖\nGunakan .menu untuk melihat fitur saya!",
        GOODBYE: "👋 Semoga kita berjumpa lagi!",
        ERROR: "❌ Terjadi kesalahan, coba lagi nanti.",
        SUCCESS: "✅ Berhasil!",
        LOADING: "⏳ Sedang memproses..."
    },
    
    // Group Settings
    GROUP: {
        MAX_MEMBERS: 100,
        MIN_MEMBERS_FOR_FEATURES: 5,
        ADMIN_ONLY_COMMANDS: ['addprem', 'delprem', 'broadcast', 'kick', 'promote']
    }
};
