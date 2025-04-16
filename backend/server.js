import express, {urlencoded} from "express";
import session from "express-session";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './connection/connectDB.js';
import UserRoutes from './routes/UserRoutes.js';
import CartRoutes from './routes/CartRoutes.js';
import FavoriteRoutes from './routes/FavoriteRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
import CategoryRoutes from './routes/CategoryRoutes.js';
import OrderRoutes from './routes/OrderRoutes.js';
import ReviewRoutes from './routes/ReviewRoutes.js';
import AdminRoutes from './routes/AdminRoutes.js';
import VendorRoutes from './routes/VendorRoutes.js'

dotenv.config({path: './config/.env'});
const PORT = process.env.PORT;
const app = express();
connectDB();

const FRONTEND_URL = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL_PROD
  : process.env.FRONTEND_URL_DEV;

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({origin: FRONTEND_URL, credentials: true}));
app.use(express.static('./public'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
  }
}));

app.use('/api/users', UserRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/favorite', FavoriteRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/admin', AdminRoutes);
app.use('/api/vendors', VendorRoutes)
app.get('/api', (req, res) => {
  res.send('API is running...');
});

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT} and frontend URL is ${FRONTEND_URL}`);
  console.log(`NODE_ENV is ${process.env.NODE_ENV}`);
});