import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users as UsersIcon, 
  ShoppingCart, 
  Tag,
  Edit, 
  Trash2, 
  X,
  User
} from 'lucide-react';
import '../styles/Admin.css';
import { useGetAllUsersQuery, useUpdateUserByIdMutation, useDeleteUserByIdMutation } from '../app/api/authAPI';


const Users = () => {
    const { data: initialUsers, isSuccess, refetch } = useGetAllUsersQuery();
  const [updateUser] = useUpdateUserByIdMutation();
  const [deleteUser] = useDeleteUserByIdMutation();
  const [users, setUsers] = useState(initialUsers);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  });

  useEffect(() => {
    if (isSuccess) {
      setUsers(initialUsers);
    }
  }, [initialUsers, isSuccess]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      firstName: user?.firstName,
      lastName: user?.lastName,
      email: user?.email,
      role: user?.role,
    });
    setShowModal(true);
  };

  const handleDeleteUser = (userId) => {
      setUsers(users.filter(user => user._id !== userId));
      const id = userId;
      deleteUser(id);
      refetch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Update existing user
    setUsers(users.map(user => 
      user._id === editingUser._id 
        ? { ...user, ...formData } 
        : user
    ));
    updateUser({ id: editingUser._id, userData: formData });
    refetch();
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      role: '',
    });
    setEditingUser(null);
    
    setShowModal(false);
  };

  return (
    <div className="admin-container">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-header">
          <h2>E-Commerce Admin</h2>
        </div>
        <nav className="admin-nav">
          <Link to="/admin/dashboard" className="admin-nav-item">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/admin/products" className="admin-nav-item">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/categories" className="admin-nav-item">
            <Tag size={20} />
            <span>Categories</span>
          </Link>
          <Link to="/admin/users" className="admin-nav-item active">
            <UsersIcon size={20} />
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
          <div className="admin-card-header">
            <h1 className="admin-card-title">Users</h1>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>FirstName</th>
                  <th>LastName</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Join Date</th>
                  <th>Orders</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users?.map(user => (
                  <tr key={user?._id}>
                    <td>#{user?._id}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: '#e2e8f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '8px'
                        }}>
                          <User size={16} />
                        </div>
                        {user?.firstName}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <div style={{ 
                          width: '32px', 
                          height: '32px', 
                          borderRadius: '50%', 
                          backgroundColor: '#e2e8f0', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          marginRight: '8px'
                        }}>
                          <User size={16} />
                        </div>
                        {user?.lastName}
                      </div>
                    </td>
                    <td>{user?.email}</td>
                    <td>
                      <span 
                        style={{ 
                          backgroundColor: user?.role === 'Admin' ? '#e0f2fe' : '#f1f5f9',
                          color: user.role === 'Admin' ? '#0284c7' : '#475569',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '0.875rem'
                        }}
                      >
                        {user?.role}
                      </span>
                    </td>
                    <td>{moment(user?.createdAt).format('YYYY-MM-DD')}</td>
                    <td>{user?.orders}</td>
                    <td>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteUser(user?._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Edit User */}
          {showModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Edit User</h2>
                  <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">FirstName</label>
                    <input
                      type="text"
                      name="firstName"
                      className="admin-form-input"
                      value={formData?.firstName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">LastName</label>
                    <input
                      type="text"
                      name="lastName"
                      className="admin-form-input"
                      value={formData?.lastName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="admin-form-input"
                      value={formData?.email}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Role</label>
                    <select
                      name="role"
                      className="admin-form-select"
                      value={formData?.role}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Customer">Customer</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>
                  <div className="admin-form-actions">
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn">
                      Update User
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Users;
