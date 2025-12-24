const config = require('../config');
const moment = require('moment-timezone');

module.exports = {
    // Format waktu Indonesia
    formatTime: (date = new Date()) => {
        return moment(date).tz('Asia/Jakarta').format('DD/MM/YYYY HH:mm:ss');
    },
    
    // Format durasi
    formatUptime: (seconds) => {
        const days = Math.floor(seconds / (3600 * 24));
        const hours = Math.floor((seconds % (3600 * 24)) / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);
        
        return `${days}d ${hours}h ${minutes}m ${secs}s`;
    },
    
    // Format memory usage
    formatMemoryUsage: () => {
        const used = process.memoryUsage();
        return `${Math.round(used.heapUsed / 1024 / 1024 * 100) / 100} MB`;
    },
    
    // Cek apakah hari yang sama
    isSameDay: (date1, date2) => {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
    },
    
    // Generate random ID
    generateId: (length = 8) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    },
    
    // Format number dengan koma
    formatNumber: (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    
    // Delay function
    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms)),
    
    // Validasi URL
    isValidUrl: (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    },
    
    // Extract number from string
    extractNumber: (text) => {
        const match = text.match(/\d+/g);
        return match ? match.join('') : '';
    },
    
    // Create progress bar
    createProgressBar: (current, total, length = 20) => {
        const percentage = current / total;
        const progress = Math.round(percentage * length);
        const empty = length - progress;
        
        const bar = '█'.repeat(progress) + '░'.repeat(empty);
        return `[${bar}] ${Math.round(percentage * 100)}%`;
    },
    
    // Aesthetic text generator
    aestheticText: (text, style = 'normal') => {
        const styles = {
            normal: (t) => `*${t}*`,
            flower: (t) => `${config.EMOJI.FLOWER} ${t} ${config.EMOJI.FLOWER}`,
            heart: (t) => `${config.EMOJI.HEART} ${t} ${config.EMOJI.HEART}`,
            border: (t) => `┌──「 ${t} 」\n│\n└──`
        };
        
        return styles[style] ? styles[style](text) : text;
    }
};
