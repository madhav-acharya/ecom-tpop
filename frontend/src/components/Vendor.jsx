import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  Tag,
  Edit, 
  Trash2, 
  Plus,
  ShoppingBag,
  X,
  Ticket
} from 'lucide-react';
import '../styles/Admin.css';
import { useAddVendorMutation, useUpdateVendorMutation, useGetVendorsQuery, useDeleteVendorMutation } from '../app/api/vendorAPI';


const Vendors = () => {
  const [addVendor] = useAddVendorMutation();
  const [updateVendor] = useUpdateVendorMutation();
  const [deleteVendor] = useDeleteVendorMutation();
  const { data: initialVendors, isSuccess, refetch } = useGetVendorsQuery();
  const [vendors, setVendors] = useState(initialVendors);
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  useEffect(() => {
    if (isSuccess) {
      setVendors(initialVendors);
    }
  }, [initialVendors, isSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddVendor = () => {
    setEditingVendor(null);
    setFormData({
      name: '',
      description: '',
    });
    setShowModal(true);
  };

  const handleEditVendor = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      name: vendor?.name,
      description: vendor?.description,
    });
    setShowModal(true);
  };

  const handleDeleteVendor = (vendorId) => {
    
      setVendors(vendors?.filter(vendor => vendor?._id !== vendorId));
      deleteVendor(vendorId);
      refetch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingVendor) {
      setVendors(vendors?.map(vendor => 
        vendor?._id === editingVendor?._id 
          ? { ...vendor, ...formData } 
          : vendor
      ));
      updateVendor({ id: editingVendor?._id, ...formData });
    } else {
      const newVendor = {
        ...formData
      };
      setVendors([...vendors, newVendor]);
      addVendor(newVendor);
      refetch();
    }
    
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
          <Link to="/admin/vendors" className="admin-nav-item active">
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
          <div className="admin-card-header">
            <h1 className="admin-card-title">Vendors</h1>
            <button className="admin-btn" onClick={handleAddVendor}>
              <Plus size={18} />
              <span style={{ marginLeft: '8px' }}>Add Vendor</span>
            </button>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors?.map(vendor => (
                  <tr key={vendor?._id}>
                    <td>#{vendor?._id}</td>
                    <td>{vendor?.name}</td>
                    <td>{vendor?.description}</td>
                    <td>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEditVendor(vendor)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteVendor(vendor?._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit Vendor */}
          {showModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingVendor ? 'Edit Vendor' : 'Add New Vendor'}
                  </h2>
                  <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Vendor Name</label>
                    <input
                      type="text"
                      name="name"
                      className="admin-form-input"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Description</label>
                    <textarea
                      name="description"
                      className="admin-form-textarea"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
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
                      {editingVendor ? 'Update Vendor' : 'Add Vendor'}
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

export default Vendors;
