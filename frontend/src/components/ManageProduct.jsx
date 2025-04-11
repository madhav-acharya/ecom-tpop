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
  X,
  Upload,
  ImageIcon
} from 'lucide-react';
import '../styles/Admin.css';
import { useGetProductsQuery } from '../app/api/productAPI';
import { useAddProductMutation } from '../app/api/productAPI';
import { useUpdateProductMutation } from '../app/api/productAPI';
import { useDeleteProductMutation } from '../app/api/productAPI';
import { useUploadProductsMutation } from '../app/api/productAPI';

const categories = [
  'Electronics',
  'Clothing',
  'Footwear',
  'Home & Kitchen',
  'Fitness',
  'Books',
  'Toys'
];

const Products = () => {
  const { data: initialProducts, isSuccess, refetch } = useGetProductsQuery();
  const [addProduct, { isSuccess: isAddSuccess }] = useAddProductMutation();
  const [updateProduct, { isSuccess: isUpdateSuccess }] = useUpdateProductMutation();
  const [deleteProduct, { isSuccess: isDeleteSuccess }] = useDeleteProductMutation();
  const [products, setProducts] = useState(initialProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    sellingPrice: '',
    markedprice: '',
    brand: '',
    images: [],
    category: '',
    rating: 0,
    isInStock: true,
    countInStock: 0
  });
  const [imagePreviewUrls, setImagePreviewUrls] = useState([]);

  useEffect(() => {
    if (isSuccess) {
      setProducts(initialProducts);
    }
  }, [initialProducts, isSuccess, products]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e?.target?.files);
    setImages(files);
    if (files.length === 0) return;
    const newImagePreviewUrls = files?.map(file => URL?.createObjectURL(file));
    setImagePreviewUrls([...imagePreviewUrls, ...newImagePreviewUrls]);
    setFormData({
      ...formData,
      images: [...formData?.images, ...newImagePreviewUrls]
    });
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...formData.images];
    updatedImages.splice(index, 1);
    
    const updatedPreviews = [...imagePreviewUrls];
    updatedPreviews.splice(index, 1);
    
    setFormData({
      ...formData,
      images: updatedImages
    });
    setImagePreviewUrls(updatedPreviews);
  };

  const handleAddProduct = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      sellingPrice: '',
      markedprice: '',
      brand: '',
      images: [],
      category: '',
      rating: 0,
      isInStock: true,
      countInStock: 0
    });
    setImagePreviewUrls([]);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product?.name,
      description: product?.description,
      sellingPrice: product?.sellingPrice,
      markedprice: product?.markedprice,
      brand: product?.brand,
      images: product?.images,
      category: product?.category,
      rating: product?.rating,
      isInStock: product?.isInStock,
      countInStock: product?.countInStock
    });
    setImages(product?.images);
    setImagePreviewUrls(product.images);
    setShowModal(true);
  };

  const handleDeleteProduct = (productId) => {
      setProducts(products.filter(product => product?._id !== productId));
      deleteProduct(productId)
        .unwrap()
        .then(() => {
          console.log('Product deleted successfully');
          refetch();
        })
        .catch((error) => {
          console.error('Failed to delete product: ', error);
        });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      ...formData,
      sellingPrice: parseFloat(formData?.sellingPrice),
      markedprice: parseFloat(formData?.markedprice),
      countInStock: parseInt(formData?.countInStock),
      rating: parseFloat(formData?.rating || 0)
    };
    const formDataToSubmit = new FormData();
    console.log("images", images);
    images?.forEach((image) => {
      formDataToSubmit.append('images', image);
    });
    formDataToSubmit.append('name', productData?.name);
    formDataToSubmit.append('description', productData?.description);
    formDataToSubmit.append('sellingPrice', productData?.sellingPrice);
    formDataToSubmit.append('markedprice', productData?.markedprice);
    formDataToSubmit.append('brand', productData?.brand);
    formDataToSubmit.append('category', productData?.category);
    formDataToSubmit.append('countInStock', productData?.countInStock);
    formDataToSubmit.append('isInStock', productData?.isInStock);
    formDataToSubmit.append('rating', productData?.rating);
    formDataToSubmit.append('reviews', productData?.reviews);

    
    if (editingProduct) {
      const updatedProducts = products.map(product =>
        product?._id === editingProduct?._id
          ? { ...productData }
          : product
      );
      setProducts(updatedProducts);
      await updateProduct({ id: editingProduct?._id, product: productData })
        .unwrap()
        .then(() => {
          console.log('Product updated successfully');
          setProducts(products);
          refetch();
        })
        .catch((error) => {
          console.error('Failed to update product: ', error);
        });
    } else {
      const newProduct = {
        ...productData
      };
      addProduct(formDataToSubmit)
        .unwrap()
        .then(() => {
          setProducts([...products, newProduct]);
          refetch();
        })
        .catch((error) => {
          console.error('Failed to add product: ', error);
        });
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
          <Link to="/admin/products" className="admin-nav-item active">
            <Package size={20} />
            <span>Products</span>
          </Link>
          <Link to="/admin/categories" className="admin-nav-item">
            <Tag size={20} />
            <span>Categories</span>
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
            <h1 className="admin-card-title">Products</h1>
            <button className="admin-btn" onClick={handleAddProduct}>
              <Plus size={18} />
              <span style={{ marginLeft: '8px' }}>Add Product</span>
            </button>
          </div>

          <div className="admin-table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products?.map((product, index) => (
                  <tr key={product?._id}>
                    <td>#{product?._id}</td>
                    <td>
                      <img 
                        src={product?.images[0]} 
                        alt={product?.name} 
                        className="product-thumbnail" 
                      />
                    </td>
                    <td>{product?.name}</td>
                    <td>{product?.brand}</td>
                    <td>{product?.category}</td>
                    <td>RS{product?.sellingPrice?.toFixed(2)}</td>
                    <td>{product?.countInStock}</td>
                    <td>
                      <span className={`status-badge ${product?.isInStock ? 'in-stock' : 'out-of-stock'}`}>
                        {product?.isInStock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="admin-action-btn edit"
                        onClick={() => handleEditProduct(product, index)}
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        className="admin-action-btn delete"
                        onClick={() => handleDeleteProduct(product?._id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal for Add/Edit Product */}
          {showModal && (
            <div className="admin-modal-overlay">
              <div className="admin-modal">
                <div className="admin-modal-header">
                  <h2 className="admin-modal-title">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button className="admin-modal-close" onClick={() => setShowModal(false)}>
                    <X size={24} />
                  </button>
                </div>
                <form className="admin-form" onSubmit={handleSubmit}>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Name</label>
                    <input
                      type="text"
                      name="name"
                      className="admin-form-input"
                      value={formData?.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Description</label>
                    <textarea
                      name="description"
                      className="admin-form-textarea"
                      value={formData?.description}
                      onChange={handleInputChange}
                      required
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Selling Price</label>
                      <input
                        type="number"
                        name="sellingPrice"
                        step="0.01"
                        min="0"
                        className="admin-form-input"
                        value={formData?.sellingPrice}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Marked Price</label>
                      <input
                        type="number"
                        name="markedprice"
                        step="0.01"
                        min="0"
                        className="admin-form-input"
                        value={formData?.markedprice}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        className="admin-form-input"
                        value={formData?.brand}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Category</label>
                      <select
                        name="category"
                        className="admin-form-select"
                        value={formData?.category}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories?.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="admin-form-row">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Count In Stock</label>
                      <input
                        type="number"
                        name="countInStock"
                        min="0"
                        className="admin-form-input"
                        value={formData?.countInStock}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Rating</label>
                      <input
                        type="number"
                        name="rating"
                        min="0"
                        max="5"
                        step="0.1"
                        className="admin-form-input"
                        value={formData?.rating}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-checkbox">
                      <input
                        type="checkbox"
                        name="isInStock"
                        checked={formData?.isInStock}
                        onChange={handleInputChange}
                      />
                      <span>In Stock</span>
                    </label>
                  </div>
                  
                  {/* Image Upload Section */}
                  <div className="admin-form-group">
                    <label className="admin-form-label">Product Images</label>
                    
                    <div className="image-upload-container">
                      <label htmlFor="image-upload" className="image-upload-label">
                        <div className="image-upload-placeholder">
                          <Upload size={24} />
                          <span>Click to upload images</span>
                          <p className="image-upload-hint">Supports: JPG, PNG, WEBP</p>
                        </div>
                        <input
                          type="file"
                          id="image-upload"
                          name="images"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="image-upload-input"
                        />
                      </label>
                    </div>
                    
                    {imagePreviewUrls?.length > 0 && (
                      <div className="image-preview-container">
                        {imagePreviewUrls?.map((url, index) => (
                          <div key={index} className="image-preview-item">
                            <img 
                              src={url} 
                              alt={`Product ${index+1}`}
                              className="image-preview"
                            //   onError={(e) => {e?.target?.src = 'https://via.placeholder.com/100'}}
                            />
                            <button 
                              type="button" 
                              className="image-preview-remove"
                              onClick={() => handleRemoveImage(index)}
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {imagePreviewUrls?.length === 0 && (
                      <div className="no-images-message">
                        <ImageIcon size={24} />
                        <p>No images uploaded yet</p>
                      </div>
                    )}
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
                      {editingProduct ? 'Update Product' : 'Add Product'}
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

export default Products;
