import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ displayOrder: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      categories
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, description, icon, image, displayOrder } = req.body;

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A category with this name already exists.'
      });
    }

    const category = await Category.create({
      name: name.trim(),
      description,
      icon: icon || 'Sparkles',
      image,
      displayOrder: displayOrder || 0
    });

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      category
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    // Check if any products use this category
    const productCount = await Product.countDocuments({ category: categoryId });
    if (productCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete category because ${productCount} product(s) are currently assigned to it. Deactivate it instead.`
      });
    }

    const category = await Category.findByIdAndDelete(categoryId);
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found.'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!'
    });
  } catch (error) {
    next(error);
  }
};
