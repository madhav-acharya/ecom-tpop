import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  customShipping: { type: Number, default: 0 },
  dateAdded: { type: Date, default: Date.now }
   });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
