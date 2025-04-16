import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Tag,
  Edit, 
  Eye, 
  Plus,
  X,
  ShoppingBag
} from 'lucide-react';
import '../styles/Admin.css';
import { useGetOrdersQuery, useCreateOrderMutation, useUpdateOrderMutation } from '../app/api/orderAPI';
import { useGetProductsQuery } from '../app/api/productAPI';
import moment from 'moment';

const Orders = () => {
    const { data: initialOrders, isSuccess, refetch } = useGetOrdersQuery();
    const { data: productsList, refetch: prefetch, isSuccess: pisSuccess } = useGetProductsQuery();
    const [createOrder] = useCreateOrderMutation();
    const [updateOrder] = useUpdateOrderMutation();
    const [orders, setOrders] = useState(initialOrders);
    const [showModal, setShowModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [viewingOrder, setViewingOrder] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    orderStatus: '',
    products: [],
    totalAmount: 0,
  });
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setOrders(initialOrders);
    }
  }, [initialOrders, isSuccess]);

  const statusColors = {
    'Pending': { bg: '#fff7ed', color: '#f97316' },
    'Processing': { bg: '#f0f9ff', color: '#0ea5e9' },
    'Shipped': { bg: '#ecfeff', color: '#06b6d4' },
    'Delivered': { bg: '#f0fdf4', color: '#10b981' },
    'Cancelled': { bg: '#fef2f2', color: '#ef4444' },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddOrder = () => {
    setEditingOrder(null);
    setFormData({
      firstName: '',
      lastName: '',
      orderStatus: 'Pending',
      products: [],
    });
    setSelectedProducts([]);
    setShowModal(true);
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order);
    setFormData({
      firstName: order?.firstName,
      lastName: order?.lastName,
      orderStatus: order?.orderStatus,
      products: order?.products,
    });
    setShowModal(true);
  };

  const handleViewOrder = (order) => {
    setViewingOrder(order);
    setShowViewModal(true);
  };

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1 }]);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...selectedProducts];
    // updatedProducts?.[index][field] = value;
    setSelectedProducts(updatedProducts);
  };

  const handleRemoveProduct = (index) => {
    const updatedProducts = [...selectedProducts];
    updatedProducts?.splice(index, 1);
    setSelectedProducts(updatedProducts);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingOrder) {
      setOrders(orders?.map(order => 
        order?._id === editingOrder?._id 
          ? { 
              ...order, 
              firstName: formData?.firstName,
              lastName: formData?.lastName,
              orderStatus: formData?.orderStatus
            } 
          : order
      ));
      updateOrder({ id: editingOrder?._id, data: formData });
    } else {
     
      const newOrder = {
        firstName: formData?.firstName,
        lastName: formData?.lastName,
        date: new Date()?.toISOString()?.split('T')?.[0],
        orderStatus: formData?.orderStatus,
        totalAmount: formData?.totalAmount,
        items: formData?.products?.length
      };
      setOrders([newOrder, ...orders]);
      createOrder(newOrder);
      setFormData({
        firstName: '',
        lastName: '',
        orderStatus: 'Pending',
        products: [],
      });
      setSelectedProducts([]);
      refetch();
    }
    refetch();
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
          <Link to="/admin/vendors" className="admin-nav-item">
            <ShoppingBag size={20} />
            <span>Vendors</span>
          </Link>
          <Link to="/admin/users" className="admin-nav-item">
            <Users size={20} />
            <span>Users</span>
          </Link>
          <Link to="/admin/orders" className="admin-nav-item active">
            <ShoppingCart size={20} />
            <span>Orders</span>
          </Link>
        </nav>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          <div className="admin-card-header">
            <h1 className="admin-card-title">Orders</h1>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders?.map(order => (
                  <tr key={order?._id}>
                    <td>#{order?._id}</td>
                    <td>{`${order?.firstName} ${order?.lastName}`}</td>
                    <td>{moment(initialOrders?.[order?.firstName]?.createdAt)?.format('YYYY-MM-DD')}</td>
                    <td>
                      <span style={{ 
                        backgroundColor: statusColors[order?.orderStatus]?.bg || '#f1f5f9',
                        color: statusColors[order?.orderStatus]?.color || '#475569',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                      }}>
                        {order?.orderStatus}
                      </span>
                    </td>
                    <td>{order?.products?.length}</td>
                    <td>Rs{order?.totalAmount?.toFixed(2)}</td>
                    <td>
                      <button 
                        className="admin-action-btn"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye size={18} />
                      </button>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEditOrder(order)}
                      >
                        <Edit size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit Order */}
          {showModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingOrder ? 'Edit Order' : 'Add New Order'}
                  </h2>
                  <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Customer First Name</label>
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
                    <label className="admin-form-label">Customer Last Name</label>
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
                    <label className="admin-form-label">orderStatus</label>
                    <select
                      name="orderStatus"
                      className="admin-form-select"
                      value={formData?.orderStatus}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  
                  {!editingOrder && (
                    <>
                      <div className="admin-form-group">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <label className="admin-form-label" style={{ margin: 0 }}>Products</label>
                          <button 
                            type="button" 
                            className="admin-btn" 
                            style={{ padding: '6px 12px' }}
                            onClick={handleAddProduct}
                          >
                            <Plus size={16} /> Add Product
                          </button>
                        </div>
                        
                        {selectedProducts?.map((product, index) => (
                          <div key={index} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                            <select
                              className="admin-form-select"
                              style={{ flex: 2 }}
                              value={product?.productId}
                              onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                              required
                            >
                              <option value="">Select Product</option>
                              {console.log("productsList", productsList)}
                              {productsList?.map(p => (
                                <option key={p?._id} value={p?.name}>{p?.name} - ${p?.sellingPrice}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              className="admin-form-input"
                              style={{ flex: 1 }}
                              placeholder="Qty"
                              min="1"
                              value={product?.quantity}
                              onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                              required
                            />
                            <button
                              type="button"
                              className="admin-btn admin-btn-danger"
                              style={{ padding: '8px' }}
                              onClick={() => handleRemoveProduct(index)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                        
                        {selectedProducts?.length === 0 && (
                          <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                            No products added. Click "Add Product" to add products to this order.
                          </div>
                        )}
                      </div>
                    </>
                  )}
                  
                  <div className="admin-form-actions">
                    <button 
                      type="button" 
                      className="admin-btn admin-btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="admin-btn">
                      {editingOrder ? 'Update Order' : 'Add Order'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal for View Order */}
          {showViewModal && viewingOrder && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">Order Details</h2>
                  <button className="admin-modal-close" onClick={() => setShowViewModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '4px' }}>Order #{viewingOrder?._id}</h3>
                      <p style={{ color: '#64748b', margin: '0' }}>{viewingOrder?.createdAt}</p>
                    </div>
                    <span style={{ 
                      backgroundColor: statusColors?.[viewingOrder?.orderStatus]?.bg || '#f1f5f9',
                      color: statusColors?.[viewingOrder?.orderStatus]?.color || '#475569',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.875rem',
                      alignSelf: 'flex-start'
                    }}>
                      {viewingOrder.orderStatus}
                    </span>
                  </div>
                  
                  <div style={{ borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0', padding: '12px 0', marginBottom: '16px' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '8px' }}>CUSTOMER</h4>
                    <p style={{ margin: '0', fontWeight: '500' }}>{`${viewingOrder?.firstName} ${viewingOrder?.lastName}`}</p>
                  </div>
                  
                  <div style={{ marginBottom: '24px' }}>
                    <h4 style={{ fontSize: '0.875rem', fontWeight: '500', color: '#64748b', marginBottom: '12px' }}>ORDER SUMMARY</h4>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <tbody>
                        <tr>
                          {viewingOrder?.products?.map((viewOrder)=>(<td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Items ({viewOrder?.name})</td>))}
                          <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Rs{(viewingOrder?.totalAmount * 0.8)?.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Tax</td>
                          <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Rs{(viewingOrder?.totalAmount * 0.1)?.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Shipping</td>
                          <td style={{ textAlign: 'right', padding: '8px 0', borderBottom: '1px solid #e2e8f0' }}>Rs{(viewingOrder?.totalAmount * 0.1)?.toFixed(2)}</td>
                        </tr>
                        <tr>
                          <td style={{ padding: '12px 0', fontWeight: '600' }}>Total</td>
                          <td style={{ textAlign: 'right', padding: '12px 0', fontWeight: '600' }}>Rs{viewingOrder?.totalAmount?.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                
                <div className="admin-form-actions" style={{ justifyContent: 'center' }}>
                  <button 
                    type="button" 
                    className="admin-btn"
                    onClick={() => setShowViewModal(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Orders;
