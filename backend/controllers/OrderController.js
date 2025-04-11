import Order from '../models/Order.js';

export const getOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching orders', error: err.message });
    }
}
export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;
        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching order', error: err.message });
    }
}
export const createOrder = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      billingAddress,
      shippingAddress,
      phoneNumber,
      district,
      city,
      state,
      products,
      totalAmount
    } = req.body;

    const newOrder = new Order({
      firstName,
      lastName,
      email,
      billingAddress,
      shippingAddress,
      phoneNumber,
      district,
      city,
      state,
      products,
      totalAmount
    });

    const savedOrder = await newOrder.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating order', error: err.message });
  }
};

export const updateOrder = async (req, res) => {
  try {
    console.log("Update Order", req.body);
    const { id } = req.params;
    const updatedData = req.body;


    const updatedOrder = await Order.findByIdAndUpdate(id, updatedData, {
      new: true,
      runValidators: true
    });

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json(updatedOrder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating order', error: err.message });
  }
};
