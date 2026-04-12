const { validationResult } = require('express-validator');

// Central validation middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Format error message to be consistent with previous Joi structure for the UI
    return res.status(400).json({ error: errors.array()[0].msg });
  }
  next();
};

module.exports = { validate };
