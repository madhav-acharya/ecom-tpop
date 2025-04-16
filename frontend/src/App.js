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
import ServerStatus from './components/ServerStatus';
import AdminLogin from './components/AdminLogin';
import { AuthRoute } from './components/AuthRoute';
import Vendors from './components/Vendor';

function App() {
  
  console.log("url",process.env.REACT_APP_API_URL)
  console.log("ENV",process.env.NODE_ENV)
  const isAdmin = localStorage.getItem("adminToken");
  return (
    <div className="App">
        <NetworkStatus />
        <ServerStatus />
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
          <Route path="/admin" element={ <AuthRoute />} >
            <Route  index element={<AdminLogin /> } />
            <Route path="dashboard" element={localStorage.getItem("adminToken")&&<Dashboard />} />
            <Route path="products" element={isAdmin&&<ManageProduct />} />
            <Route path="categories" element={isAdmin&&<Categories />} />
            <Route path="vendors" element={isAdmin&&<Vendors />} />
            <Route path="users" element={isAdmin&&<Users />} />
            <Route path="orders" element={isAdmin&&<Orders />} />
          </Route >
        </Routes>
    </div> 
  );
}

export default App;
