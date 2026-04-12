const express = require('express');
const { register, login, getProfile } = require('../controllers/auth.controller');
const { authenticate } = require('../middlewares/auth');

const { registerValidator, loginValidator } = require('../validators/authValidator');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/profile', authenticate, getProfile);

module.exports = router;
