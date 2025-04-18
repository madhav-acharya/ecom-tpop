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
import {
  useAddPromoCodeMutation,
  useDeletePromoCodeMutation,
  useGetPromoCodesQuery,
  useUpdatePromoCodeMutation
} from '../app/api/promocodeAPI';

const PromoCode = () => {
  const [addPromoCode] = useAddPromoCodeMutation();
  const [updatePromoCode] = useUpdatePromoCodeMutation();
  const [deletePromoCode] = useDeletePromoCodeMutation();
  const { data: initialPromoCodes, isSuccess, refetch } = useGetPromoCodesQuery();

  const [promoCodes, setPromoCodes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPromo, setEditingPromo] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'flat',
    discount_amount: '',
    discount_percent: '',
    min_purchase: '',
    max_discount: '',
    limit: 0
  });

  useEffect(() => {
    if (isSuccess) setPromoCodes(initialPromoCodes);
  }, [initialPromoCodes, isSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = () => {
    setEditingPromo(null);
    setFormData({
        code: '',
        type: 'flat',
        discount_amount: '',
        discount_percent: '',
        min_purchase: '',
        max_discount: '',
        limit: 0
    });
    setShowModal(true);
  };

  const handleEdit = (promo) => {
    setEditingPromo(promo);
    setFormData({
        code: promo?.code,
        type: promo?.type,
        discount_amount: promo?.discount_amount,
        discount_percent: promo?.discount_percent,
        min_purchase: promo?.min_purchase,
        max_discount: promo?.max_discount,
        limit: promo?.limit
    });
    setShowModal(true);
  };

  const handleDelete = (id) => {
    setPromoCodes(promoCodes.filter(p => p?._id !== id));
    deletePromoCode(id);
    refetch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { ...formData };

    if (editingPromo) {
      updatePromoCode({ id: editingPromo?._id, ...data });
      setPromoCodes(promoCodes?.map(p => p?._id === editingPromo?._id ? { ...p, ...data } : p));
    } else {
      addPromoCode(data).unwrap().then((res) => {
        setPromoCodes([...promoCodes, data]);
        console.log('Promo code added:', res);
      }
      ).catch((err) => {
        console.error('Error adding promo code:', err);
      });
    }

    setShowModal(false);
    refetch();
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
          <Link to="/admin/promocode" className="admin-nav-item active">
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
        <h1 className="admin-card-title">Promo Codes</h1>
        <button className="admin-btn" onClick={handleAdd}>
          <Plus size={18} />
          <span style={{ marginLeft: '8px' }}>Add Promo Code</span>
        </button>
      </div>

      <div className="admin-table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Discount Percentage</th>
              <th>Flat Discount</th>
              <th>Min Purchase</th>
              <th>Max Discount</th>
              <th>Limit</th>
              <th>Used</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {promoCodes?.map(promo => (
              <tr key={promo?._id}>
                <td>{promo?.code}</td>
                <td>{promo?.type}</td>
                <td>{promo?.discount_percent || '-'}</td>
                <td>{promo?.discount_amount || '-'}</td>
                <td>{promo?.min_purchase || '-'}</td>
                <td>{promo?.max_discount || '-'}</td>
                <td>{promo?.limit || '-'}</td>
                <td>{promo?.usedBy?.length || 0}</td>
                <td>
                  <button className="admin-action-btn edit" onClick={() => handleEdit(promo)}>
                    <Edit size={18} />
                  </button>
                  <button className="admin-action-btn delete" onClick={() => handleDelete(promo?._id)}>
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h2 className="admin-modal-title">
                {editingPromo ? 'Edit Promo Code' : 'Add Promo Code'}
              </h2>
              <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                <X size={24} />
              </button>
            </div>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-group">
                <label className="admin-form-label">Code</label>
                <input type="text" name="code" className="admin-form-input" value={formData?.code} onChange={handleChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Limit</label>
                <input type="number" name="limit" className="admin-form-input" value={formData?.limit} onChange={handleChange} required />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Type</label>
                <select name="type" className="admin-form-input" value={formData?.type} onChange={handleChange}>
                  <option value="flat">Flat</option>
                  <option value="percent">Percentage</option>
                  <option value="percent_max">Percent with Max Cap</option>
                </select>
              </div>
              {formData?.type === 'flat' ? (
                <div className="admin-form-group">
                  <label className="admin-form-label">Flat Discount</label>
                  <input type="number" name="discount_amount" className="admin-form-input" value={formData?.discount_amount} onChange={handleChange} required />
                </div>
              ) : (
                <div className="admin-form-group">
                  <label className="admin-form-label">Discount Percentage</label>
                  <input type="number" name="discount_percent" className="admin-form-input" value={formData?.discount_percent} onChange={handleChange} required />
                </div>
              )}
              {formData?.type !== 'percent' && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Min Purchase</label>
                  <input type="number" name="min_purchase" className="admin-form-input" value={formData?.min_purchase} onChange={handleChange} />
                </div>
              )}
              {formData?.type === 'percent_max' && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Max Discount</label>
                  <input type="number" name="max_discount" className="admin-form-input" value={formData?.max_discount} onChange={handleChange} />
                </div>
              )}
              <div className="admin-form-actions">
                <button type="button" className="admin-btn admin-btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="admin-btn">
                  {editingPromo ? 'Update Promo' : 'Add Promo'}
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

export default PromoCode;
