import React, { useState, useEffect, useRef } from 'react';
import '../styles/UserProfile.css';
import { useGetCurrentUserQuery } from '../app/api/authAPI';
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../app/api/favoriteAPI";
import Product from './Product';
import '../styles/Product.css';
import { Link } from 'react-router-dom';
import { User, Edit, MapPin, Mail, Phone, Package, Heart, ArrowLeft, LogOut, Camera } from 'lucide-react';
import { updateImage } from '../app/api/authAPI';
import { useUpdateUserByIdMutation } from '../app/api/authAPI';
import { useUpdateOrderMutation, useGetOrderByIdQuery } from '../app/api/orderAPI';

    
    const UserProfile = () => {
      const [activeTab, setActiveTab] = useState('profile');
      const [updateOrder] = useUpdateOrderMutation();
      const [editMode, setEditMode] = useState(false);
      const [updateUser] = useUpdateUserByIdMutation();
      const fileInputRef = useRef(null);
      const [profileImage, setProfileImage] = useState(null);
      const { data: user, isSuccess } = useGetCurrentUserQuery();
      const [userData, setUserData] = useState(user?.user);
      const [editedUserData, setEditedUserData] = useState(userData);
      const dispatch = useDispatch();
      const favorites = useSelector((state => state?.favorites));
      const [ userId, setUserId] = useState(user?.user?.id);
      const { data: orders, refetch } = useGetOrderByIdQuery(userId&& userId, {skip: !userId});
    
      useEffect(() => {
        if (favorites?.status === "idle") {
          dispatch(fetchFavorites());
        }
        if (favorites?.status === "failed") {
          console.log("status failed", favorites?.error);
        }
      }, [dispatch, favorites?.status]);

      useEffect(() => {
        if (orders?.status === "idle" && orders) {
          console.log("orders", orders);
          refetch();
        }
      }, [refetch, orders]);


      useEffect(() => {
        if (isSuccess) {
          setUserData(user?.user);
          setEditedUserData(userData);
          setUserId(user?.user?.id);
        }},[user, isSuccess]);
      
      const handleImageUpload = (e) => {
        const file = e?.target?.files?.[0];
        const imageFormData = new FormData();
        imageFormData.append('profileImage', file);
        updateImage({id: userId, imageFormData})
          .then((response) => {
            console.log("Image uploaded successfully", response);
          })
          .catch((error) => {
            console.error("Error uploading image", error);
          });
       
        if (file) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setProfileImage(reader?.result);
            setEditedUserData({...editedUserData, profilePicture: reader?.result});
          };
          reader?.readAsDataURL(file);
        }
      };
    
      const handleEditToggle = () => {
        if (editMode) {
          setUserData(editedUserData);
          updateUser({id: userId, userData: editedUserData})
            .then((response) => {
              console.log("User updated successfully", response);
            })
            .catch((error) => {
              console.error("Error updating user", error);
            });
        } else {
          setEditedUserData({...userData});
        }
        setEditMode(!editMode);
      };
    
      const handleInputChange = (e) => {
        const { name, value } = e?.target;
        
        if (name?.includes('.')) {
          const [parent, child] = name?.split('.');
          setEditedUserData({
            ...editedUserData,
            [parent]: {
              ...editedUserData[parent],
              [child]: value
            }
          });
        } else {
          setEditedUserData({
            ...editedUserData,
            [name]: value
          });
        }
      };
    
      const handleCancelOrder = (orderId) => {
        const updatedOrder = {
          orderStatus: "Cancelled"
        };
        updateOrder({id: orderId, data: updatedOrder})
          .then(() => {
            refetch();
          })
          .catch((error) => {
            console.error("Error cancelling order", error);
          });
      };
    
      const renderProfileContent = () => {
        return (
          <div className="profile-details">
            <div className="profile-header">
              <div className="profile-picture-container">
                <div className="profile-picture">
                  {profileImage || userData?.profileImage ? (
                    <img src={profileImage || userData?.profileImage} alt="Profile" />
                  ) : (
                    <User size={50} />
                  )}
                  {editMode && (
                    <div className="profile-picture-overlay" onClick={() => fileInputRef?.current?.click()}>
                      <Camera size={24} />
                      <span>Change</span>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        accept="image/*" 
                        style={{display: 'none'}}
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="profile-info">
                <h2>{userData?.firstName} {userData?.lastName}</h2>
                <p className="customer-since">Customer since April 2023</p>
              </div>
              <button className="edit-profile-button" onClick={handleEditToggle}>
                {editMode ? 'Save Changes' : 'Edit Profile'}
                {!editMode && <Edit size={16} />}
              </button>
            </div>
    
            <div className="profile-form">
              <div className="form-row">
                <div className="form-group">
                  <label>First Name</label>
                  {editMode ? (
                    <input 
                      type="text" 
                      name="firstName" 
                      value={editedUserData?.firstName} 
                      onChange={handleInputChange} 
                    />
                  ) : (
                    
                    <p>{userData?.firstName}</p>
                  )}
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  {editMode ? (
                    <input 
                      type="text" 
                      name="lastName" 
                      value={editedUserData?.lastName}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{userData?.lastName}</p>
                  )}
                </div>
              </div>
    
              <div className="form-row">
                <div className="form-group">
                  <label><Mail size={16} /> Email</label>
                  {editMode ? (
                    <input 
                      type="email" 
                      name="email" 
                      value={editedUserData?.email}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{userData?.email}</p>
                  )}
                </div>
                <div className="form-group">
                  <label><Phone size={16} /> Phone</label>
                  {editMode ? (
                    <input 
                      type="tel" 
                      name="phone" 
                      value={editedUserData?.phoneNumber?.number}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{`${userData?.phoneNumber?.countryCode}-${userData?.phoneNumber?.number}`}</p>
                  )}
                </div>
              </div>
    
              <h3><MapPin size={18} /> Shipping Address</h3>
              <div className="address-form">
                <div className="form-group">
                  {editMode ? (
                    <input 
                      type="text" 
                      name="shippingAddress" 
                      value={editedUserData?.shippingAddress}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{userData?.shippingAddress}</p>
                  )}
                </div>
                
              </div>
              <h3><MapPin size={18} /> Billing Address</h3>
              <div className="address-form">
                <div className="form-group">
                  {editMode ? (
                    <input 
                      type="text" 
                      name="billingAddress" 
                      value={editedUserData?.billingAddress}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <p>{userData?.billingAddress}</p>
                  )}
                </div>
                
              </div>
    
              {editMode && (
                <div className="edit-controls">
                  <button className="cancel-button" onClick={() => setEditMode(false)}>Cancel</button>
                </div>
              )}
            </div>
          </div>
        );
      };
    
     
      const renderOrdersContent = () => {
        return (
          <div className="orders-content">
            <h2><Package size={22} /> Order History</h2>
            {orders?.length === 0 ? (
              <div className="empty-state">
                <Package size={48} />
                <p>You haven't placed any orders yet</p>
                <Link to="/search" className="shopping-button">Start Shopping</Link>
              </div>
            ) : (
              <div className="orders-list">
                {orders?.map(order => (
                  <div className="order-card" key={order?._id}>
                    <div className="order-header">
                      <div>
                        <h3>Order #{order?._id}</h3>
                        <p className="order-date">Placed on {new Date(order?.createdAt.slice(0, 7)).toLocaleDateString()}</p>
                      </div>
                      <div className="order-status">
                        <span className={`status-badge ${order?.orderStatus?.toLowerCase()}`}>{order?.orderStatus}</span>
                      </div>
                    </div>
                    <div className="order-items">
                      {order?.products?.map(item => (
                        <div className="order-item" key={item?.productId}>
                          <div className="order-item-details">
                            <p className="item-name">{item?.name}</p>
                            <p className="item-quantity">Qty: {item?.quantity}</p>
                          </div>
                          <p className="item-price">Rs{item?.price?.toFixed(2)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="order-footer">
                      <p className="order-total">Total: Rs{order?.totalAmount?.toFixed(2)}</p>
                      {(order?.orderStatus === "Processing" || order?.orderStatus === "Pending") && (
                        <button 
                          className="cancel-order-button"
                          onClick={() => handleCancelOrder(order?._id)}
                        >
                          Cancel Order
                        </button>
                      )}
                      
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      };
    
      const renderWishlistContent = () => {
        return (
          <div className="wishlist-content">
            <h2><Heart size={22} /> My Wishlist ({favorites?.favoriteItems?.length} items)</h2>
            {favorites?.favoriteItems?.length === 0 ? (
              <div className="empty-state">
                <Heart size={48} />
                <p>Your wishlist is empty</p>
                <Link to="/" className="shopping-button">Browse Products</Link>
              </div>
            ) : (
              <div className="wishlist-items">
                <Product productList={favorites?.favoriteItems} tagName={"My Wishlist"} />
              </div>
            )}
          </div>
        );
      };
    
      return (
        <div className="user-profile-container">
          <div className="back-to-shop">
            <Link to="/" className="back-link">
              <ArrowLeft size={18} />
              Back to Shopping
            </Link>
          </div>
          
          <div className="profile-content">
            <div className="profile-sidebar">
              <div className="sidebar-header">
                <User size={24} />
                <h2>My Account</h2>
              </div>
              <nav className="profile-nav">
                <button 
                  className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
                  onClick={() => setActiveTab('profile')}
                >
                  <User size={18} />
                  Profile
                </button>
                <button 
                  className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package size={18} />
                  Order History
                </button>
                <button 
                  className={`nav-item ${activeTab === 'wishlist' ? 'active' : ''}`}
                  onClick={() => setActiveTab('wishlist')}
                >
                  <Heart size={18} />
                  Wishlist
                </button>
                <button className="nav-item logout">
                  <LogOut size={18} />
                  Sign Out
                </button>
              </nav>
            </div>
            
            <div className="profile-main">
              {activeTab === 'profile' && renderProfileContent()}
              {activeTab === 'orders' && renderOrdersContent()}
              {activeTab === 'wishlist' && renderWishlistContent()}
            </div>
          </div>
        </div>
      );
    };
    
    export default UserProfile;
    