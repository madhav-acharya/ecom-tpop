import Favorite from '../models/Favorite.js';

export const getFavorites = async (req, res) => {
  try {
    const favoriteItems = await Favorite.find({ userId: req.user._id });
    res.json(favoriteItems);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const addToFavorites = async (req, res) => {
  try {
    const { productId, name, price, customShipping, defaultShipping, image } = req.body;
    const existingItem = await Favorite.findOne({ 
      userId: req.user._id, 
      productId
    });
    
    if (existingItem) {
      return res.json(existingItem);
    }
    const favoriteItem = new Favorite({
      userId: req.user._id,
      productId,
      name,
      customShipping,
      defaultShipping,
      price,
      image
    });
    
    await favoriteItem.save();
    res.status(201).json(favoriteItem);
  } catch (error) {
    console.log("error in favorite",error)
    res.status(500).json({ message: 'Server error', error: error.message });
  }
  };
  
  export const removeFromFavorites = async (req, res) => {
    try {
      const result = await Favorite.findOneAndDelete({ 
        userId: req.user._id, 
        productId: req.body.productId || req.body._id
      });
      
      if (!result) {
        console.log("Cant be found in favorites")
        return res.status(404).json({ message: 'Item not found in favorites' });
      }
      
      res.json({ message: 'Item removed from favorites' });
    } catch (error) {
      console.log("error in favorite")
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  };