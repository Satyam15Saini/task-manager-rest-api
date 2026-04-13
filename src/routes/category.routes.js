const express = require('express');
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/category.controller');
const { authenticate } = require('../middlewares/auth');
const { categoryCreateValidator, categoryUpdateValidator } = require('../validators/categoryValidator');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.use(authenticate);

router.post('/', categoryCreateValidator, validate, createCategory);
router.get('/', getCategories);
router.patch('/:id', categoryUpdateValidator, validate, updateCategory);
router.delete('/:id', deleteCategory);

module.exports = router;
