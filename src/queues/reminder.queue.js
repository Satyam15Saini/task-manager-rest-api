const { Queue, Worker } = require('bullmq');
const { redisConnection } = require('./redis');

const reminderQueue = new Queue('reminder-queue', { connection: redisConnection });

const reminderWorker = new Worker('reminder-queue', async (job) => {
  const { taskId, title, dueDate, userId } = job.data;
  
  // Simulated Notification - we log this to console as requested
  console.log(`\n==============================================`);
  console.log(`[REMINDER] Task Due Soon!`);
  console.log(`User ID: ${userId}`);
  console.log(`Task: ${title} (ID: ${taskId})`);
  console.log(`Due Date: ${new Date(dueDate).toLocaleString()}`);
  console.log(`==============================================\n`);

}, { connection: redisConnection });

reminderWorker.on('failed', (job, err) => {
  console.error(`Reminder job ${job.id} failed:`, err);
});

module.exports = {
  reminderQueue
};
