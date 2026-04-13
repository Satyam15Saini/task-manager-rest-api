const { body } = require('express-validator');

const tagCreateValidator = [
  body('name').notEmpty().withMessage('Tag name is required').isString()
];

const tagUpdateValidator = [
  body('name').notEmpty().withMessage('Tag name cannot be empty').isString()
];

module.exports = {
  tagCreateValidator,
  tagUpdateValidator
};
