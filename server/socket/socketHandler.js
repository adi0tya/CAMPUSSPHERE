const User = require('../models/User');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join shipment tracking room
    socket.on('shipment:join', (trackingId) => {
      socket.join(`shipment:${trackingId}`);
      console.log(`Socket ${socket.id} joined shipment:${trackingId}`);
    });

    // Leave shipment tracking room
    socket.on('shipment:leave', (trackingId) => {
      socket.leave(`shipment:${trackingId}`);
    });

    // Employee location update
    socket.on('employee:location:update', async (data) => {
      try {
        const { userId, lat, lng } = data;
        await User.findByIdAndUpdate(userId, {
          currentLocation: { lat, lng, updatedAt: new Date() }
        });
        // Broadcast to admin dashboard
        io.emit('employee:location:broadcast', { userId, lat, lng, timestamp: new Date() });
      } catch (error) {
        console.error('Location update error:', error);
      }
    });

    // Shipment status update broadcast
    socket.on('shipment:status:update', (data) => {
      const { trackingId, status, location, timestamp } = data;
      io.to(`shipment:${trackingId}`).emit('shipment:status:changed', { trackingId, status, location, timestamp });
      io.emit('shipment:global:update', { trackingId, status, timestamp });
    });

    // Live location broadcast for specific shipment
    socket.on('shipment:location:broadcast', (data) => {
      const { trackingId, lat, lng } = data;
      io.to(`shipment:${trackingId}`).emit('shipment:location:update', { trackingId, lat, lng, timestamp: new Date() });
    });

    // Notification
    socket.on('notification:send', (data) => {
      const { userId, notification } = data;
      io.emit(`notification:${userId}`, notification);
    });

    // Join user room for notifications
    socket.on('user:join', (userId) => {
      socket.join(`user:${userId}`);
    });

    // New notification to specific user
    socket.on('notification:new', (data) => {
      io.to(`user:${data.userId}`).emit('notification:received', data.notification);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = socketHandler;
