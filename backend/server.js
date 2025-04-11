import express, {urlencoded} from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import connectDB from './connection/connectDB.js';
import userRoutes from './routes/userRoutes.js';
import CartRoutes from './routes/CartRoutes.js';
import FavoriteRoutes from './routes/FavoriteRoutes.js';
import ProductRoutes from './routes/ProductRoutes.js';
import CategoryRoutes from './routes/CategoryRoutes.js';
import OrderRoutes from './routes/OrderRoutes.js';
import ReviewRoutes from './routes/ReviewRoutes.js';

dotenv.config({path: './config/.env'});
const PORT = process.env.PORT;
const app = express();
connectDB();

app.use(express.json())
app.use(urlencoded({extended: true}))
app.use(cookieParser())
app.use(cors({origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.static('./public'))

app.use('/api/users', userRoutes);
app.use('/api/cart', CartRoutes);
app.use('/api/favorite', FavoriteRoutes);
app.use('/api/products', ProductRoutes);
app.use('/api/categories', CategoryRoutes);
app.use('/api/orders', OrderRoutes);
app.use('/api/reviews', ReviewRoutes);
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => {
  console.log(`server running on http://localhost:${PORT}`);
});