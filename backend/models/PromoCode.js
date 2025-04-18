import mongoose from 'mongoose';

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ['flat', 'percent', 'percent_max'], required: true },
  discount_amount: Number,
  discount_percent: Number,
  max_discount: Number,
  min_purchase: Number,
  usedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('PromoCode', promoCodeSchema);
