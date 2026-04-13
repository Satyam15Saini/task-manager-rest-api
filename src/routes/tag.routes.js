const express = require('express');
const {
  createTag,
  getTags,
  updateTag,
  deleteTag,
} = require('../controllers/tag.controller');
const { authenticate } = require('../middlewares/auth');
const { tagCreateValidator, tagUpdateValidator } = require('../validators/tagValidator');
const { validate } = require('../middlewares/validate');

const router = express.Router();

router.use(authenticate);

router.post('/', tagCreateValidator, validate, createTag);
router.get('/', getTags);
router.patch('/:id', tagUpdateValidator, validate, updateTag);
router.delete('/:id', deleteTag);

module.exports = router;
