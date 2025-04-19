import React, {useState, useEffect} from 'react';
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
import { useGetDashboardStatsQuery,
  useGetHourlySalesOverviewQuery,
  useGetMinutelySalesOverviewQuery,
  useGetDailySalesOverviewQuery,
  useGetWeeklySalesOverviewQuery,
  useGetMonthlySalesOverviewQuery,
  useGetProductCategoriesQuery,
  useGetOrderStatusSummaryQuery,
  useGetRecentOrdersQuery } from "../app/api/adminAPI";

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


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Dashboard = () => {
  const [range, setRange] = useState("daily");
  const { data: stats, isLoading: statsLoading, refetch: statsRefetch } = useGetDashboardStatsQuery();
  const { data: weeklySalesOverview, isLoading: weeklyLoading, refetch: weeklyRefetch } = useGetWeeklySalesOverviewQuery();
  const { data: monthlySalesOverview, isLoading: monthlyLoading, refetch: monthlyRefetch } = useGetMonthlySalesOverviewQuery();
  const { data: dailySalesOverview, isLoading: dailyLoading, refetch: dailyRefetch } = useGetDailySalesOverviewQuery();
  const { data: hourlySalesOverview, isLoading: hourlyLoading, refetch: hourlyRefetch } = useGetHourlySalesOverviewQuery();
  const { data: minutelySalesOverview, isLoading: minutelyLoading, refetch: minutelyRefetch } = useGetMinutelySalesOverviewQuery();
  const { data: productCategories, isLoading: categoriesLoading, refetch: categoriesRefetch } = useGetProductCategoriesQuery();
  const { data: orderStatusSummary, isLoading: statusLoading, refetch: orderRefetch } = useGetOrderStatusSummaryQuery();
  const { data: recentOrders, isLoading: ordersLoading, refetch: recentOrderRefetch } = useGetRecentOrdersQuery();
  const [salesOverview, setSalesOverview] = useState([]);

  useEffect(() => {
    switch (range) {
      case 'daily':
        setSalesOverview(dailySalesOverview || []);
        break;
      case 'weekly':
        setSalesOverview(weeklySalesOverview || []);
        break;
      case 'monthly':
        setSalesOverview(monthlySalesOverview || []);
        break;
      case 'hourly':
        setSalesOverview(hourlySalesOverview || []);
        break;
      case 'minutely':
        setSalesOverview(minutelySalesOverview || []);
        break;
      default:
        setSalesOverview([]);
    }
  }, [range, dailySalesOverview, weeklySalesOverview, monthlySalesOverview]);

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "status pending";
      case "delivered":
        return "status delivered";
      case "shipped":
        return "status shipped";
      case "processing":
        return "status processing";
      case "cancelled":
        return "status cancelled";
      default:
        return "status";
    }
  };

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
                <p>{stats?.totalProducts}</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
                <ShoppingCart size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Orders</h3>
                <p>{stats?.totalOrders}</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316' }}>
                <Users size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Users</h3>
                <p>{stats?.totalUsers}</p>
              </div>
            </div>
            
            <div className="admin-stat-card">
              <div className="admin-stat-icon" style={{ backgroundColor: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                <TrendingUp size={24} />
              </div>
              <div className="admin-stat-content">
                <h3>Total Revenue</h3>
                <p>Rs {stats?.totalRevenue?.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          {/* Charts */}
          <div className="admin-card" style={{ marginTop: '20px' }}>
            <div className="admin-card-header">
              <h2 className="admin-card-title">Sales Overview</h2>
              <select value={range} onChange={(e) => setRange(e.target.value)}>
                <option value="minutely">Minutely</option>
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div style={{ height: '300px' }} className='res-chart'>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesOverview} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                      data={productCategories}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {productCategories?.map((entry, index) => (
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
                  <BarChart data={orderStatusSummary} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
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
                {recentOrders?.map((order, index) => (
                    <tr key={index}>
                      <td>{order?.id}</td>
                      <td>{order?.customer}</td>
                      <td>{order?.date}</td>
                      <td><span className={getStatusClass(order?.status)}>{order?.status}</span></td>
                      <td>Rs {order?.amount?.toFixed(2)}</td>
                    </tr>
                  ))}
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
