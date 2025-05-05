const mongoose = require("mongoose");
const redisClient = require('./redisClient');

class DbConfig {
  constructor(mongoUri) {
    this.mongoUri = mongoUri;
  }
  async DbConnect() {
    try {
      await mongoose.connect(this.mongoUri);
      console.log(`Connected to Mongodb Database`);
      await redisClient.connect();
      console.log(`Connected to Redis`);
    } catch (error) {
      console.log(error);
      console.log(`Failed to connect to Mongodb`);
    }
  }
}
module.exports = DbConfig;
