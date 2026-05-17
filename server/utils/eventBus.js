const { redisClient, redisSubscriber } = require('../config/redis');

// Centralize Redis Pub/Sub for specific internal micro-services/events if needed.
// Note: Socket.io uses @socket.io/redis-adapter which automatically handles
// client-facing pub/sub. This module is for backend-to-backend pub/sub.

const publishEvent = (channel, message) => {
  redisClient.publish(channel, JSON.stringify(message));
};

const subscribeToEvent = (channel, callback) => {
  redisSubscriber.subscribe(channel, (err, count) => {
    if (err) {
      console.error(`Failed to subscribe to ${channel}:`, err);
    } else {
      console.log(`Subscribed to ${channel} (Total subscriptions: ${count})`);
    }
  });

  redisSubscriber.on('message', (subChannel, message) => {
    if (subChannel === channel) {
      try {
        const parsedMessage = JSON.parse(message);
        callback(parsedMessage);
      } catch (err) {
        console.error(`Error parsing message on channel ${channel}:`, err);
      }
    }
  });
};

module.exports = {
  publishEvent,
  subscribeToEvent
};
