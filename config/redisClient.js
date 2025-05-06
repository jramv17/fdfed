const redis = require('redis');
const env_variables = require('../utils/envutils');
const redisClient = redis.createClient({
  username: 'default',
  password: env_variables.REDIS_PASSWORD,
  socket: {
      host: env_variables.REDIS_HOST,
      port: env_variables.REDIS_PORT
  }
});


redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});


module.exports = {redisClient};





