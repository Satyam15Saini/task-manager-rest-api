const { Queue, Worker } = require('bullmq');
const { redisConnection } = require('./redis');
const axios = require('axios');

const webhookQueue = new Queue('webhook-queue', { connection: redisConnection });

const webhookWorker = new Worker('webhook-queue', async (job) => {
  const { taskId, title, completionDate, userId } = job.data;
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn('WEBHOOK_URL not configured. Skipping webhook delivery.');
    return;
  }

  const payload = {
    taskId,
    title,
    completionDate,
    userId,
    event: 'task_completed'
  };

  console.log(`[WEBHOOK] Sending task completion payload for Task ${taskId}...`);
  await axios.post(webhookUrl, payload);
  console.log(`[WEBHOOK] Payload sent successfully for Task ${taskId}.`);

}, { connection: redisConnection });

webhookWorker.on('failed', (job, err) => {
  console.error(`Webhook job ${job.id} failed (attempt ${job.attemptsMade}):`, err.message);
});

module.exports = {
  webhookQueue
};
