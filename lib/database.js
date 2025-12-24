const fs = require('fs-extra');
const path = require('path');

class Database {
    constructor() {
        this.dbPath = path.join(__dirname, '../sessions/database.json');
        this.init();
    }
    
    async init() {
        try {
            await fs.ensureFile(this.dbPath);
            const data = await fs.readFile(this.dbPath, 'utf8');
            this.data = data ? JSON.parse(data) : { users: {}, groups: {} };
        } catch (error) {
            this.data = { users: {}, groups: {} };
            await this.save();
        }
    }
    
    async save() {
        await fs.writeFile(this.dbPath, JSON.stringify(this.data, null, 2));
    }
    
    // User Methods
    async getUser(userId) {
        return this.data.users[userId] || null;
    }
    
    async saveUser(userId, userData) {
        this.data.users[userId] = userData;
        await this.save();
    }
    
    async updateUser(userId, updates) {
        if (this.data.users[userId]) {
            this.data.users[userId] = { ...this.data.users[userId], ...updates };
            await this.save();
        }
    }
    
    async getAllUsers() {
        return this.data.users;
    }
    
    // Group Methods
    async getGroup(groupId) {
        return this.data.groups[groupId] || null;
    }
    
    async saveGroup(groupId, groupData) {
        this.data.groups[groupId] = groupData;
        await this.save();
    }
    
    // Premium Methods
    async addPremium(userId, days) {
        const user = await this.getUser(userId);
        if (user) {
            const expired = new Date();
            expired.setDate(expired.getDate() + days);
            
            user.premium = true;
            user.premiumExpired = expired.toISOString();
            user.limit += 100; // Bonus limit untuk premium
            
            await this.saveUser(userId, user);
            return true;
        }
        return false;
    }
    
    async removePremium(userId) {
        const user = await this.getUser(userId);
        if (user) {
            user.premium = false;
            user.premiumExpired = null;
            await this.saveUser(userId, user);
            return true;
        }
        return false;
    }
    
    // Stats Methods
    async getStats() {
        const totalUsers = Object.keys(this.data.users).length;
        const totalGroups = Object.keys(this.data.groups).length;
        const premiumUsers = Object.values(this.data.users).filter(u => u.premium).length;
        
        return { totalUsers, totalGroups, premiumUsers };
    }
}

module.exports = new Database();
