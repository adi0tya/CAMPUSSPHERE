const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const { redisClient } = require('../config/redis');

// Function to create a custom rate limiter with Redis store
const createRateLimiter = (windowMs, maxRequests, message) => {
  return rateLimit({
    windowMs,
    max: maxRequests,
    message: { success: false, message: message || 'Too many requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      // Use the global ioredis instance
      sendCommand: (...args) => redisClient.call(...args),
    }),
  });
};

// Common limiters
const authLimiter = createRateLimiter(15 * 60 * 1000, 10, 'Too many login attempts, please try again after 15 minutes.');
const apiLimiter = createRateLimiter(5 * 60 * 1000, 100, 'Too many requests from this IP, please try again after 5 minutes.');
const OTPRequestLimiter = createRateLimiter(60 * 60 * 1000, 5, 'Too many OTP requests from this IP, please try again after an hour.');

module.exports = {
  createRateLimiter,
  authLimiter,
  apiLimiter,
  OTPRequestLimiter
};
