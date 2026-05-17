const { redisClient } = require('../config/redis');

// Middleware to cache API responses
// Duration is in seconds
const cacheRoute = (duration) => {
  return async (req, res, next) => {
    if (req.method !== 'GET') {
      console.error('Cannot cache non-GET methods');
      return next();
    }

    // Include user role or ID if cache should be user-specific
    const key = `__express__${req.originalUrl || req.url}_${req.user?._id || 'guest'}`;

    try {
      const cachedResponse = await redisClient.get(key);
      if (cachedResponse) {
        return res.status(200).json(JSON.parse(cachedResponse));
      } else {
        // Intercept res.json to cache the response before sending it
        const originalJson = res.json.bind(res);
        res.json = (body) => {
          // Only cache successful responses
          if (res.statusCode >= 200 && res.statusCode < 300) {
            redisClient.set(key, JSON.stringify(body), 'EX', duration).catch(err => {
              console.error('Redis cache set error:', err);
            });
          }
          originalJson(body);
        };
        next();
      }
    } catch (error) {
      console.error('Redis cache get error:', error);
      next(); // Fallback to database on redis error
    }
  };
};

// Function to invalidate specific cache patterns (e.g. after POST/PUT)
const invalidateCachePattern = async (pattern) => {
  try {
    const keys = await redisClient.keys(`*${pattern}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
    }
  } catch (error) {
    console.error('Redis cache invalidation error:', error);
  }
};

module.exports = { cacheRoute, invalidateCachePattern };
