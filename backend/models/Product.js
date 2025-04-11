import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0
    },
    markedprice: {
      type: Number,
      required: true,
      min: 0
    },
    brand: {
      type: String,
      required: true,
      trim: true
    },
    images: {
      type: [String],
      required: true,
      default: ['./no-image.jpg']
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
    rating: {
      type: Number,
      default: 0
    },
    isInStock: {
      type: Boolean,
      default: true
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    }
  }, {
    timestamps: true
  });
  
  const Product = mongoose.model('Product', productSchema);
  export default Product;