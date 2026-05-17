const { Worker } = require('bullmq');
const { redisOptions } = require('../config/redis');
const sendEmail = require('../utils/sendEmail');

const startEmailWorker = () => {
  const worker = new Worker(
    'email-queue',
    async (job) => {
      console.log(`Processing email job ${job.id} to ${job.data.email}`);
      const success = await sendEmail(job.data);
      if (!success) {
        throw new Error('Email sending failed');
      }
      return { success: true };
    },
    { connection: redisOptions }
  );

  worker.on('completed', (job) => {
    console.log(`✅ Email job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    console.error(`❌ Email job ${job.id} failed with error: ${err.message}`);
  });

  return worker;
};

module.exports = startEmailWorker;
