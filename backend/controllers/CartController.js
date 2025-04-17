import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ userId: req.user._id });
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  };
  
export const addToCart = async (req, res) => {
  try {
    const { productId, name, price, customShipping, image, quantity = 1 } = req.body;
    
    let cartItem = await Cart.findOne({ 
      userId: req.user._id, 
      productId
    });
    let product = await Product.findById(productId);
    console.log("product", product);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    if (cartItem) {
      if (product.countInStock < cartItem.quantity + quantity) {
        console.log("Product gone out of stock");
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      if (product.countInStock <= 0) {
        console.log("Product out of stock");
        return res.status(400).json({ message: 'Product is out of stock' });
      }
      if (product.countInStock < quantity) {
        console.log("Not enough stock available");
        return res.status(400).json({ message: 'Not enough stock available' });
      }
      if (cartItem.quantity < 0)
      {
        return res.status(400).json({ message: 'Quantity cannot be less than 0' });
      }
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        productId,
        customShipping,
        name,
        price,
        image,
        quantity
      });
      await cartItem.save();
    }
    
    res.status(201).json(cartItem);
  } catch (error) {
    console.log("error in cart",error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeFromCart = async (req, res) => {
  try {
    const result = await Cart.findOneAndDelete({ 
      userId: req?.user?._id, 
      _id: req?.params?.id
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const removeUsersCart = async (req, res) => {
  try {
    const result = await Cart.findOneAndDelete({ 
      userId: req?.user?._id, 
    });
    
    if (!result) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateCart = async (req, res) => {
  try {
    const { quantity } = req?.body;
    const cartItem = await Cart.findOne(
      { userId: req.user._id, productId: req.params.id }
    );
    if (!cartItem) {
      return res.status(404).json({ message: 'Cart item not found' });
    }
    let product = await Product.findById(cartItem.productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    if (product.countInStock < cartItem.quantity + quantity) {
      return res.status(400).json({ message: 'Not enough stock available' });
    }
    if (quantity === 0) {
      await cartItem.deleteOne();
      return res.json({ message: 'Item removed from cart' });
    }
    if (cartItem.quantity < 0) {
      return res.status(400).json({ message: 'Quantity cannot be less than 00' });
    }
    cartItem.quantity = cartItem.quantity + quantity;
    await cartItem.save();
    
    if (!cartItem) {
      console.log("cartItem not found")
      return res.status(404).json({ message: 'Cart item not found' });
    }
    
    res.json(cartItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
