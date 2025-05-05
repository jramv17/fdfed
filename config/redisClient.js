const redis = require('redis');

const redisClient = redis.createClient(); // left it blank as of running in localhost as of now

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

redisClient.connect(); 

module.exports = redisClient;
