const { body } = require('express-validator');

const taskCreateValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Must be a valid ISO date'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be either pending or completed'),
  body('categoryId').optional().isMongoId().withMessage('Invalid Category ID'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isMongoId().withMessage('Invalid Tag ID'),
];

const taskUpdateValidator = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty if provided'),
  body('description').optional().isString(),
  body('dueDate').optional().isISO8601().withMessage('Must be a valid ISO date'),
  body('status').optional().isIn(['pending', 'completed']).withMessage('Status must be either pending or completed'),
  body('categoryId').optional().isMongoId().withMessage('Invalid Category ID'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('tags.*').optional().isMongoId().withMessage('Invalid Tag ID'),
];

module.exports = {
  taskCreateValidator,
  taskUpdateValidator,
};
