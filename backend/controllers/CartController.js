import Cart from '../models/Cart.js';

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
    const { productId, name, price, image, quantity = 1 } = req.body;
    
    let cartItem = await Cart.findOne({ 
      userId: req.user._id, 
      productId
    });
    
    if (cartItem) {
      cartItem.quantity += quantity;
      await cartItem.save();
    } else {
      cartItem = new Cart({
        userId: req.user._id,
        productId,
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
