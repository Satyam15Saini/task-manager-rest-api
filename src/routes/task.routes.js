const express = require('express');
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} = require('../controllers/task.controller');
const { authenticate } = require('../middlewares/auth');

const { taskCreateValidator, taskUpdateValidator } = require('../validators/taskValidator');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.use(authenticate);

router.post('/', taskCreateValidator, validate, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.patch('/:id', taskUpdateValidator, validate, updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
