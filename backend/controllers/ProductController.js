import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const addProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      sellingPrice,
      markedprice,
      brand,
      category,
      countInStock,
      isInStock,
      rating,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No product images uploaded" });
    }

    const uploadPromises = req.files.map(file =>
      cloudinary.uploader.upload(file.path, {
        folder: "TPOP/products",
        resource_type: "image",
      })
    );

    const uploadedResults = await Promise.all(uploadPromises);
    const imageUrls = uploadedResults.map(result => result.secure_url);

    const newProduct = new Product({
      name,
      description,
      sellingPrice,
      markedprice,
      brand,
      images: imageUrls,
      category,
      countInStock,
      isInStock,
      rating,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.status(200).json({ message: 'Product deleted' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};
