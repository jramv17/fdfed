const mongoose = require('mongoose');


class DbConfig {
    constructor(mongoUri) {
        this.mongoUri = mongoUri;
    }
    async DbConnect() {
        try {
            await mongoose.connect(this.mongoUri);
            console.log(`Connected to Mongodb Database`);


        } catch (error) {
            console.log(`Failed to connect to Mongodb`);
        }
    }
}
module.exports = DbConfig;
