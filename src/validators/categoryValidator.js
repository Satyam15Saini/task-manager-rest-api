const { body } = require('express-validator');

const categoryCreateValidator = [
  body('name').notEmpty().withMessage('Category name is required').isString()
];

const categoryUpdateValidator = [
  body('name').notEmpty().withMessage('Category name cannot be empty').isString()
];

module.exports = {
  categoryCreateValidator,
  categoryUpdateValidator
};
