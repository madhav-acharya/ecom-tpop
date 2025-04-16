import jwt from 'jsonwebtoken';

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
