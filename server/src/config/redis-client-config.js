const { createClient } = require("redis");
const {REDIS_URL} = require('./server-config');
const redisClient = createClient({
  url: REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis Error:', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis Cloud');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
  }
})();

module.exports = redisClient;