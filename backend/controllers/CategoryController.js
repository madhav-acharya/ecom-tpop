import Category from "../models/Category.js";
import cloudinary from "../config/cloudinary.js";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const createCategory = async (req, res) => {
  const { name, description } = req.body;
  try {
    const categoryExists = await Category.findOne({ name });
    if (categoryExists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    let imageUrl = null;
    if (req?.file?.path) {
      const imageFilePath = req.file.path;
      const result = await cloudinary.uploader.upload(imageFilePath, {
        folder: "TPOP/categories",
        resource_type: "image"
      });
      imageUrl = result.secure_url;
    }

    const category = new Category({ name, description, image: imageUrl });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const updateCategory = async (req, res) => {
  const { name, description, image } = req.body;
  console.log("Update Category", req.body);
  try {
    let category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    category.name = name || category.name;
    category.description = description || category.description;
    category.image = image || category.image;

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await category.deleteOne();
    res.json({ message: "Category removed" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
