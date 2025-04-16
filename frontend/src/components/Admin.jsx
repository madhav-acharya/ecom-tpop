import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Tag, 
  Users, 
  ShoppingCart, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import '../styles/Admin.css';

const Admin = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => {
    return currentPath === path ? 'active' : '';
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>E-Commerce Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className={`admin-nav-item ${isActive('/admin/dashboard')}`}>
            <LayoutDashboard size={20} />
            <span>Dashhboard</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
          <Link to="/admin/products" className={`admin-nav-item ${isActive('/admin/products')}`}>
            <Package size={20} />
            <span>Products</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
          <Link to="/admin/categories" className={`admin-nav-item ${isActive('/admin/categories')}`}>
            <Tag size={20} />
            <span>Categoriees</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
          <Link to="/admin/categories" className={`admin-nav-item ${isActive('/admin/categories')}`}>
            <Tag size={20} />
            <span>Category</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
          <Link to="/admin/users" className={`admin-nav-item ${isActive('/admin/users')}`}>
            <Users size={20} />
            <span>Users</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
          <Link to="/admin/orders" className={`admin-nav-item ${isActive('/admin/orders')}`}>
            <ShoppingCart size={20} />
            <span>Orders</span>
            <ChevronRight size={16} className="admin-nav-arrow" />
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-welcome">
            <h1>Welcome to Admin Panel</h1>
            <p>Select an option from the sidebar to get started</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
