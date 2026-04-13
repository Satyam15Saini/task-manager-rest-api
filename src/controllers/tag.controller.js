const Tag = require('../models/Tag');

exports.createTag = async (req, res, next) => {
  try {
    const tag = new Tag({
      name: req.body.name,
      userId: req.user.id
    });
    await tag.save();
    res.status(201).json({ message: 'Tag created', tag });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Tag name already exists' });
    next(err);
  }
};

exports.getTags = async (req, res, next) => {
  try {
    const tags = await Tag.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json({ tags });
  } catch (err) {
    next(err);
  }
};

exports.updateTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.status(200).json({ message: 'Tag updated', tag });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Tag name already exists' });
    next(err);
  }
};

exports.deleteTag = async (req, res, next) => {
  try {
    const tag = await Tag.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!tag) return res.status(404).json({ error: 'Tag not found' });
    res.status(200).json({ message: 'Tag deleted' });
  } catch (err) {
    next(err);
  }
};
