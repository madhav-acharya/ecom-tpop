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
import { useAddCategoryMutation, useUpdateCategoryMutation, useGetCategoriesQuery, useDeleteCategoryMutation } from '../app/api/categoryAPI';


const Categories = () => {
  const [addCategory] = useAddCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();
  const { data: initialCategories, isSuccess, refetch } = useGetCategoriesQuery();
  const [categories, setCategories] = useState(initialCategories);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null,
  });

  useEffect(() => {
    if (isSuccess) {
      setCategories(initialCategories);
    }
  }, [initialCategories, isSuccess]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      image: null,
    });
    setShowModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category?.name,
      description: category?.description,
      image: category?.image,
    });
    setShowModal(true);
  };

  const handleDeleteCategory = (categoryId) => {
    
      setCategories(categories?.filter(category => category?._id !== categoryId));
      deleteCategory(categoryId);
      refetch();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editingCategory) {
      setCategories(categories?.map(category => 
        category?._id === editingCategory?._id 
          ? { ...category, ...formData } 
          : category
      ));
      updateCategory({ id: editingCategory?._id, ...formData });
    } else {
      const newCategory = {
        ...formData
      };
      setCategories([...categories, newCategory]);
      addCategory(newCategory);
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
          <Link to="/admin/categories" className="admin-nav-item active">
            <Tag size={20} />
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
          <div className="admin-card-header">
            <h1 className="admin-card-title">Categories</h1>
            <button className="admin-btn" onClick={handleAddCategory}>
              <Plus size={18} />
              <span style={{ marginLeft: '8px' }}>Add Category</span>
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
                {categories?.map(category => (
                  <tr key={category?._id}>
                    <td>#{category?._id}</td>
                    <td>{category?.name}</td>
                    <td>{category?.description}</td>
                    <td>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEditCategory(category)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteCategory(category?._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit Category */}
          {showModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingCategory ? 'Edit Category' : 'Add New Category'}
                  </h2>
                  <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Category Name</label>
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
                      {editingCategory ? 'Update Category' : 'Add Category'}
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

export default Categories;
