import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Home from './pages/Home';
import WishListPage from './pages/WishListPage';
import ProductDescriptionPage from './pages/ProductDescriptionPage';
import SearchResultPage from './pages/SearchResultPage';
import UserProfilePage from './pages/UserProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import ManageProduct from './components/ManageProduct';
import Categories from './components/Categories';
import Users from './components/Users';
import Orders from './components/Orders';
import { Routes, Route } from "react-router-dom";
import NetworkStatus from './components/NetworkStatus';

function App() {
  console.log("url",process.env.REACT_APP_API_URL)
  console.log("ENV",process.env.NODE_ENV)
  return (
    <div className="App">
        <NetworkStatus />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/wishlist" element={<WishListPage />} />
          <Route path="/product-description/:id" element={<ProductDescriptionPage />} />
          <Route path="/search-result" element={<SearchResultPage />} />
          <Route path="/my-profile" element={<UserProfilePage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/admin/*" element={<Admin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/products" element={<ManageProduct />} />
          <Route path="/admin/categories" element={<Categories />} />
          <Route path="/admin/users" element={<Users />} />
          <Route path="/admin/orders" element={<Orders />} />
        </Routes>
    </div> 
  );
}

export default App;
