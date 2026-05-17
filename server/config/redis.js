const Redis = require('ioredis');

// Global config for ioredis
const redisOptions = {
  host: process.env.REDIS_HOST || '127.0.0.1',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  maxRetriesPerRequest: null,
};

// Main Redis Client for general caching and data
const redisClient = new Redis(redisOptions);

// Redis Client for BullMQ (Subscriber requires a separate connection)
const redisSubscriber = new Redis(redisOptions);

redisClient.on('connect', () => {
  console.log('✅ Redis Client Connected');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis Client Error:', err);
});

module.exports = {
  redisClient,
  redisSubscriber,
  redisOptions
};
