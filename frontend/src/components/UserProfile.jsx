import React, { useState, useEffect } from 'react';
import '../styles/UserProfile.css';
import { useGetCurrentUserQuery } from '../app/api/authAPI';
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../app/api/favoriteAPI";
import Product from './Product';
import '../styles/Product.css';

const UserProfile = ({
   
  orders = [
    { id: 1, name: 'Product Name 1', status: 'Shipped', image: 'https://via.placeholder.com/50x50' },
    { id: 2, name: 'Product Name 2', status: 'Delivered', image: 'https://via.placeholder.com/50x50' },
    { id: 3, name: 'Product Name 3', status: 'Processing', image: 'https://via.placeholder.com/50x50' }
  ],
  wishlist = [
    { id: 1, name: 'Wishlist Product 1', image: 'https://via.placeholder.com/150x150' },
    { id: 2, name: 'Wishlist Product 2', image: 'https://via.placeholder.com/150x150' },
    { id: 3, name: 'Wishlist Product 3', image: 'https://via.placeholder.com/150x150' }
  ],
  addresses = [
    { id: 1, address: '123 Main St, Springfield, IL 62704' },
    { id: 2, address: '456 Elm St, Springfield, IL 62704' }
  ],
  paymentMethods = [
    { id: 1, description: 'Visa ending in 1234' }
  ]
}) => {
  const [activeTab, setActiveTab] = useState('order-history');
  
  
  const tabs = [
    { id: 'order-history', label: 'Order History' },
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'saved-addresses', label: 'Saved Addresses' },
    { id: 'account-settings', label: 'Account Settings' }
  ];

  const { data: user, isLoading, isError, isSuccess, errorMessage } = useGetCurrentUserQuery();
  const dispatch = useDispatch();
    const favorites = useSelector((state => state.favorites));
    useEffect(() => {
      if (favorites?.status === "idle") {
        dispatch(fetchFavorites());
      }
      if (favorites?.status === "failed") {
        console.log("status failed", favorites?.error);
      }
    }, [dispatch, favorites.status]);
  if(!user)
  {
    return <div>Loading...</div>;
  }
  if (isError) {
    return <div>Error: {errorMessage}</div>;
  }

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
  };

  const handleAddressEdit = (id) => {
    console.log(`Edit address with id: ${id}`);
  };

  const handleAddressDelete = (id) => {
    console.log(`Delete address with id: ${id}`);
  };

  const handlePaymentEdit = (id) => {
    console.log(`Edit payment method with id: ${id}`);
  };

  const handlePaymentDelete = (id) => {
    console.log(`Delete payment method with id: ${id}`);
  };

  const handlePersonalDetailsUpdate = (e) => {
    e.preventDefault();
    console.log('Updating personal details');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    console.log('Changing password');
  };

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <img src={user.avatar} alt="User avatar" className="profile-avatar" />
          <div className="profile-details">
            <h2 className="profile-name">{`${user?.user?.firstName} ${user?.user?.lastName}`}</h2>
            <p className="profile-email">{user?.user?.email}</p>
            <p className="profile-phone">{`${user?.user?.phoneNumber?.countryCode} ${user?.user?.phoneNumber?.number}`}</p>
          </div>
        </div>
      </div>

      <div className="profile-tabs">
        <ul className="tabs-list">
          {tabs.map(tab => (
            <li key={tab.id} className="tab-item">
              <button 
                className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="tab-content">
        {activeTab === 'order-history' && (
          <div className="order-history-content">
            <h3 className="section-title">Order History</h3>
            {orders.map(order => (
              <div key={order.id} className="order-item">
                <div className="order-details">
                  <img src={order.image} alt="Product" className="order-image" />
                  <div className="order-info">
                    <h4 className="order-title">{order.name}</h4>
                    <p className="order-status">Order Status: {order.status}</p>
                  </div>
                  <button className="track-button">Track Order</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'wishlist' && (
          // <div className="wishlist-content">
          //   <h3 className="section-title">Wishlist</h3>
          //   <div className="wishlist-grid">
          //     {favorites?.favoriteItems.map(item => (
          //       <div key={item?._id} className="wishlist-item">
          //         <img src={item?.image} alt="Wishlist product" className="wishlist-image" />
          //         <h4 className="wishlist-title">{item?.name}</h4>
          //         <button className="add-to-cart-button">Add to Cart</button>
          //       </div>
          //     ))}
          //   </div>
          // </div>
          <Product tagName="Wishlist" productList={favorites?.favoriteItems} />
        )}

        {activeTab === 'saved-addresses' && (
          <div className="addresses-content">
            <h3 className="section-title">Saved Addresses</h3>
            {addresses.map(address => (
              <div key={address.id} className="address-item">
                <p className="address-text">{address.address}</p>
                <div className="address-actions">
                  <button 
                    className="edit-button"
                    onClick={() => handleAddressEdit(address.id)}
                  >
                    Edit
                  </button>
                  <button 
                    className="delete-button"
                    onClick={() => handleAddressDelete(address.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            <button className="add-button">Add New Address</button>
          </div>
        )}

        {activeTab === 'account-settings' && (
          <div className="settings-content">
            <h3 className="section-title">Account Settings</h3>
            
            <div className="settings-section">
              <h4 className="subsection-title">Personal Details</h4>
              <form onSubmit={handlePersonalDetailsUpdate}>
                <div className="form-group">
                  <label className="form-label">Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={user.name}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Email</label>
                  <input 
                    type="email" 
                    className="form-input" 
                    defaultValue={user.email}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    defaultValue={user.phone}
                  />
                </div>
                <button type="submit" className="update-button">Update Details</button>
              </form>
            </div>
            
            <div className="settings-section">
              <h4 className="subsection-title">Change Password</h4>
              <form onSubmit={handlePasswordChange}>
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input type="password" className="form-input" />
                </div>
                <button type="submit" className="update-button">Change Password</button>
              </form>
            </div>
            
            <div className="settings-section">
              <h4 className="subsection-title">Payment Methods</h4>
              {paymentMethods.map(payment => (
                <div key={payment.id} className="payment-item">
                  <p className="payment-text">{payment.description}</p>
                  <div className="payment-actions">
                    <button 
                      className="edit-button"
                      onClick={() => handlePaymentEdit(payment.id)}
                    >
                      Edit
                    </button>
                    <button 
                      className="delete-button"
                      onClick={() => handlePaymentDelete(payment.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <button className="add-button">Add New Payment Method</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;