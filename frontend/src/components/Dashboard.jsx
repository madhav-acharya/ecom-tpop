import React from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  PieChart, 
  Pie,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell 
} from 'recharts';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart,
  ShoppingBag, 
  TrendingUp,
  Ticket
} from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Admin.css';

const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 4500 },
  { name: 'May', sales: 6000 },
  { name: 'Jun', sales: 5500 },
  { name: 'Jul', sales: 7000 },
  { name: 'Aug', sales: 8000 },
  { name: 'Sep', sales: 6500 },
  { name: 'Oct', sales: 7500 },
  { name: 'Nov', sales: 8500 },
  { name: 'Dec', sales: 9000 },
];

const productData = [
  { name: 'Electronics', value: 35 },
  { name: 'Clothing', value: 25 },
  { name: 'Home & Kitchen', value: 20 },
  { name: 'Books', value: 10 },
  { name: 'Others', value: 10 },
];

const orderStatusData = [
  { name: 'Pending', value: 15 },
  { name: 'Processing', value: 25 },
  { name: 'Shipped', value: 35 },
  { name: 'Delivered', value: 25 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>E-Commerce Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-item active">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="admin-nav-item">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/categories" className="admin-nav-item">
            <Package size={20} />
            <span>Categories</span>
          </Link>
          <Link to="/admin/vendors" className="admin-nav-item">
           <ShoppingBag size={20} />
             <span>Vendors</span>
          </Link>
          <Link to="/admin/promocode" className="admin-nav-item">
                      <Ticket size={20} />
                      <span>Promo Code</span>
                    </Link>
          <Link to="/admin/users" className="admin-nav-item">
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link to="/admin/orders" className="admin-nav-item">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          <h1 className="admin-card-title">Dashboard</h1>
          
          {/* Stats Cards */}
          <div className="admin-card-grid">
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
                <Package size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Products</h3>
                <p>248</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <ShoppingCart size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Orders</h3>
                <p>1,456</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                <Users size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Users</h3>
                <p>854</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                <TrendingUp size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Revenue</h3>
                <p>$34,256</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="admin-card" style={{ marginTop: '20px' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">Sales Overview</h2>
            </div>
            <div style={{ height: '300px' }} className='res-chart'>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sales" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '20px', marginTop: '20px' }}>
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Product Categories</h2>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={productData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            
            <div className="admin-card">
              <div className="admin-card-header">
                <h2 className="admin-card-title">Order Status</h2>
              </div>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8b5cf6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
          
          <div className="admin-card" style={{ marginTop: '20px' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">Recent Orders</h2>
            </div>
            <div className="admin-table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>#ORD-001</td>
                    <td>John Doe</td>
                    <td>2023-04-05</td>
                    <td><span style={{color: '#f97316'}}>Pending</span></td>
                    <td>$125.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-002</td>
                    <td>Jane Smith</td>
                    <td>2023-04-04</td>
                    <td><span style={{color: '#10b981'}}>Delivered</span></td>
                    <td>$250.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-003</td>
                    <td>Robert Johnson</td>
                    <td>2023-04-03</td>
                    <td><span style={{color: '#3b82f6'}}>Shipped</span></td>
                    <td>$545.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-004</td>
                    <td>Emily Davis</td>
                    <td>2023-04-02</td>
                    <td><span style={{color: '#8b5cf6'}}>Processing</span></td>
                    <td>$85.00</td>
                  </tr>
                  <tr>
                    <td>#ORD-005</td>
                    <td>Michael Wilson</td>
                    <td>2023-04-01</td>
                    <td><span style={{color: '#10b981'}}>Delivered</span></td>
                    <td>$325.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
