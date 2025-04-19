import jwt from 'jsonwebtoken';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalRevenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = totalRevenueData[0]?.total || 0;

    res.json({ totalProducts, totalOrders, totalUsers, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMonthlySalesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: { $month: '$createdAt' },
          sales: { $sum: '$totalAmount' }
        }
      },
      { $sort: { '_id': 1 } }
    ]);

    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const formattedData = salesData.map(item => ({
      name: monthNames[item._id - 1],
      sales: item.sales
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getWeeklySalesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $isoWeekYear: '$createdAt' },
            week: { $isoWeek: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.week': 1
        }
      }
    ]);

    const formattedData = salesData.map(item => ({
      name: `Week ${item._id.week}`,
      sales: item.sales
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getDailySalesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1
        }
      }
    ]);

    const formattedData = salesData.map(item => ({
      name: `${item._id.day}/${item._id.month}`,
      sales: item.sales
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedData = categories.map(item => ({
      name: item._id,
      value: item.count
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getHourlySalesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            hour: { $hour: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.hour': 1
        }
      }
    ]);

    const formattedData = salesData.map(item => ({
      name: `${item._id.day}/${item._id.month} ${item._id.hour}:00`,
      sales: item.sales
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMinutelySalesOverview = async (req, res) => {
  try {
    const salesData = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' },
            hour: { $hour: '$createdAt' },
            minute: { $minute: '$createdAt' }
          },
          sales: { $sum: '$totalAmount' }
        }
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
          '_id.day': 1,
          '_id.hour': 1,
          '_id.minute': 1
        }
      }
    ]);

    const formattedData = salesData.map(item => ({
      name: `${item._id.day}/${item._id.month} ${item._id.hour}:${item._id.minute.toString().padStart(2, '0')}`,
      sales: item.sales
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getOrderStatusSummary = async (req, res) => {
  try {
    const statuses = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedData = statuses.map(item => ({
      name: item._id,
      value: item.count
    }));

    res.json(formattedData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRecentOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('firstName', 'lastName');

    const formattedOrders = orders.map(order => ({
      id: order._id,
      customer: `${order.firstName} ${order.lastName}`,
      date: order.createdAt.toISOString().split('T')[0],
      status: order.orderStatus,
      amount: order.totalAmount
    }));

    res.json(formattedOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

export const adminLogin = async (req, res) => {
    console.log("Admin Login", req.body);
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }
  
    try {
      if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const token = generateToken(email);
        req.session.token = token;
      res.json({ message: "Logged in as admin", admin: { token } });
    } catch (err) {
      res.status(500).json({ message: "Server error", error: err.message });
    }
  };

export const adminLogout = (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out" });
};

export const getAdminProfile = (req, res) => {
  if (req.session.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  res.json({ user: req.session.user });
};
