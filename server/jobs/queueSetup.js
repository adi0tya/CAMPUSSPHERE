const { Queue } = require('bullmq');
const { redisOptions } = require('../config/redis');

// Centralize connection for BullMQ
const connection = redisOptions;

// Email Sending Queue
const emailQueue = new Queue('email-queue', { connection });

// Background Tasks Queue (Notifications, etc.)
const taskQueue = new Queue('task-queue', { connection });

const addEmailJob = async (emailData) => {
  await emailQueue.add('send-email', emailData, {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  });
};

const addTaskJob = async (taskName, taskData) => {
  await taskQueue.add(taskName, taskData, {
    removeOnComplete: true,
    removeOnFail: false,
  });
};

module.exports = {
  emailQueue,
  taskQueue,
  addEmailJob,
  addTaskJob
};
