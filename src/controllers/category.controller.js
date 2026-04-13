const Category = require('../models/Category');

exports.createCategory = async (req, res, next) => {
  try {
    const category = new Category({
      name: req.body.name,
      userId: req.user.id
    });
    await category.save();
    res.status(201).json({ message: 'Category created', category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Category name already exists' });
    next(err);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ userId: req.user.id }).sort({ name: 1 });
    res.status(200).json({ categories });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name: req.body.name },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category updated', category });
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Category name already exists' });
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json({ message: 'Category deleted' });
  } catch (err) {
    next(err);
  }
};
