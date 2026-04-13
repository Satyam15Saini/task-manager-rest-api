const Task = require('../models/Task');
const { reminderQueue } = require('../queues/reminder.queue');
const { webhookQueue } = require('../queues/webhook.queue');

// Helper to schedule reminder
const scheduleReminder = async (task) => {
  // Remove existing job if any
  try {
    await reminderQueue.remove(task._id.toString());
  } catch (err) {
    console.error(`Error removing job from reminderQueue:`, err.message);
  }

  if (task.status === 'completed' || !task.dueDate) return;

  const reminderTime = new Date(task.dueDate).getTime() - (60 * 60 * 1000); // 1 hour before
  const delay = reminderTime - Date.now();

  if (delay > 0) {
    // Schedule for the future
    await reminderQueue.add('reminder', {
      taskId: task._id,
      title: task.title,
      dueDate: task.dueDate,
      userId: task.userId
    }, {
      jobId: task._id.toString(),
      delay
    });
  } else if (delay <= 0 && reminderTime > Date.now() - (60 * 60 * 1000)) {
    // It's already within the 1-hour window, trigger immediately
    await reminderQueue.add('reminder', {
      taskId: task._id,
      title: task.title,
      dueDate: task.dueDate,
      userId: task.userId
    }, {
      jobId: task._id.toString()
    });
  }
};

const triggerWebhookIfCompleted = async (task, oldStatus) => {
  if (task.status === 'completed' && oldStatus !== 'completed') {
    await webhookQueue.add('webhook', {
      taskId: task._id,
      title: task.title,
      completionDate: new Date(),
      userId: task.userId
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 }
    });
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id,
    });

    await task.save();

    await scheduleReminder(task);
    await triggerWebhookIfCompleted(task, 'pending');

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const { categoryId, tags } = req.query;
    let query = { userId: req.user.id };

    if (categoryId) query.categoryId = categoryId;
    if (tags) {
      // Tags can be a comma-separated list of IDs
      const tagIds = Array.isArray(tags) ? tags : tags.split(',');
      query.tags = { $all: tagIds };
    }

    const tasks = await Task.find(query)
      .sort({ createdAt: -1 })
      .populate('categoryId')
      .populate('tags');
      
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('categoryId')
      .populate('tags');
      
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const oldTask = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!oldTask) return res.status(404).json({ error: 'Task not found or unauthorized' });

    const oldStatus = oldTask.status;

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // Update schedules
    await scheduleReminder(task);
    await triggerWebhookIfCompleted(task, oldStatus);

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) return res.status(404).json({ error: 'Task not found or unauthorized' });
    
    // Remove the reminder if exists
    try {
      await reminderQueue.remove(task._id.toString());
    } catch (err) {
      console.error(`Error removing job from reminderQueue on delete:`, err.message);
    }
    
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
