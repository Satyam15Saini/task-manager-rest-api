const Task = require('../models/Task');

const createTask = async (req, res, next) => {
  try {
    const task = new Task({
      ...req.body,
      userId: req.user.id,
    });

    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    next(err);
  }
};

const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ tasks });
  } catch (err) {
    next(err);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.status(200).json({ task });
  } catch (err) {
    next(err);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
    }

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (err) {
    next(err);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or unauthorized' });
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
