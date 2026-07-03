const Category = require('../models/Category');


// GET all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// POST create category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const exists = await Category.findOne({ name });
    if (exists) return res.status(400).json({ message: "Category exists" });

    const newCat = new Category({ name, description });
    const saved = await newCat.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// PUT update category
const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    category.name = name || category.name;
    category.description = description || category.description;

    const updated = await category.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// DELETE category
const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Not found" });

    await category.deleteOne();
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

