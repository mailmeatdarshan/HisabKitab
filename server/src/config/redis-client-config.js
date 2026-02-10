const { createClient } = require("redis");
const { REDIS_URL } = require("./server-config");

let redisClient = null;

async function connectRedis() {
  if (!REDIS_URL) {
    console.warn("⚠️  REDIS_URL not set — Redis features will be unavailable");
    return null;
  }

  try {
    redisClient = createClient({ url: REDIS_URL });

    redisClient.on("error", (err) =>
      console.error("Redis Error:", err.message)
    );

    await redisClient.connect();
    console.log("Connected to Redis");
    return redisClient;
  } catch (error) {
    console.warn("⚠️  Failed to connect to Redis:", error.message);
    console.warn("⚠️  Server will continue without Redis — session/cache features unavailable");
    redisClient = null;
    return null;
  }
}

function getRedisClient() {
  return redisClient;
}

module.exports = { connectRedis, getRedisClient };