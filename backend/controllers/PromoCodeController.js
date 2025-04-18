import PromoCode from '../models/PromoCode.js';

export const createPromoCode = async (req, res) => {
  try {
    const promoExists = await PromoCode.findOne({ code: req.body.code });
    
    if (promoExists) {
      return res.status(400).json({ message: 'Promo code already exists' });
    }
    const newPromo = new PromoCode(req.body);
    if (newPromo.discount_percent && newPromo.discount_percent > 100) {
      return res.status(400).json({ message: 'Discount percent cannot exceed 100' });
    }
    if (newPromo.discount_amount && newPromo.discount_amount < 0) {
      return res.status(400).json({ message: 'Discount amount cannot be negative' });
    }
    if (newPromo.max_discount && newPromo.max_discount < 0) {
      return res.status(400).json({ message: 'Max discount cannot be negative' });
    }
    if (newPromo.min_purchase && newPromo.min_purchase < 0) {
      return res.status(400).json({ message: 'Minimum purchase cannot be negative' });
    }
    if (newPromo.type === 'flat' && !newPromo.discount_amount) {
      return res.status(400).json({ message: 'Discount amount is required for flat discount type' });
    }
    if (newPromo.type === 'percent' && !newPromo.discount_percent) {
      return res.status(400).json({ message: 'Discount percent is required for percent discount type' });
    }
    if (newPromo.type === 'percent_max' && (!newPromo.discount_percent || !newPromo.max_discount)) {
      return res.status(400).json({ message: 'Discount percent and max discount are required for percent_max discount type' });
    }
    if (newPromo.type === 'percent' && newPromo.discount_percent > 100) {
      return res.status(400).json({ message: 'Discount percent cannot exceed 100' });
    }
    if (newPromo.type === 'percent_max' && newPromo.discount_percent > 100) {
      return res.status(400).json({ message: 'Discount percent cannot exceed 100' });
    }
    await newPromo.save();
    res.status(201).json(newPromo);
  } catch(error) {
    console.error("Error creating promo codes", error);
    res.status(500).json({ message: 'Error creating promo code' });
  }
};

export const getAllPromoCodes = async (req, res) => {
  try {
    const promos = await PromoCode.find();
    res.json(promos);
  } catch {
    res.status(500).json({ message: 'Error fetching promo codes' });
  }
};

export const updatePromoCode = async (req, res) => {
  try {
    const updated = await PromoCode.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Promo code not found' });
    res.json(updated);
  } catch {
    res.status(500).json({ message: 'Error updating promo code' });
  }
};

export const deletePromoCode = async (req, res) => {
  try {
    const deleted = await PromoCode.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Promo code not found' });
    res.json({ message: 'Promo code deleted' });
  } catch {
    res.status(500).json({ message: 'Error deleting promo code' });
  }
};

export const applyPromoCode = async (req, res) => {
  const { code, cartTotal, userId } = req.body;
    console.log("Apply Promo Code", req.body);
  try {
    const promo = await PromoCode.findOne({ code: code.toUpperCase()});
    if (!promo) 
    {
        console.log("Promo code not found");
        return res.status(404).json({ message: 'Promo code not found' });
    }

    if (promo.usedBy.includes(userId)) {
      console.log("Promo code already used");
      return res.status(400).json({ message: 'You have already used this promo code' });
    }
    if(promo?.usedBy?.length >= promo?.limit) {
      console.log("Promo code limit reached");
      return res.status(400).json({ message: 'Promo code usage limit reached' });
    }

    if (promo.min_purchase && cartTotal < promo.min_purchase) {
      return res.status(400).json({ message: `Minimum purchase of ₹${promo.min_purchase} required` });
    }

    let discount = 0;

    switch (promo.type) {
      case 'flat':
        discount = promo.discount_amount;
        break;
      case 'percent':
        discount = (promo.discount_percent / 100) * cartTotal;
        break;
      case 'percent_max':
        discount = (promo.discount_percent / 100) * cartTotal;
        if (discount > promo.max_discount) discount = promo.max_discount;
        break;
    }
    promo.usedBy.push(userId);
    await promo.save();

    res.json({ success: true, discount: Math.floor(discount), message: `Promo code of RS ${Math.floor(discount)} is applied` });
  } catch {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
