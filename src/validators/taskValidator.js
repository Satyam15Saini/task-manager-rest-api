const { body } = require('express-validator');

const taskCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Must be a valid ISO date'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be either pending or completed'),
];

const taskUpdateValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Must be a valid ISO date'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be either pending or completed'),
];

module.exports = {
  taskCreateValidator,
  taskUpdateValidator,
};
