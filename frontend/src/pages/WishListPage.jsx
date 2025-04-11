import React from 'react';
import WishList from '../components/WishList';
import Header from '../components/Header';
import Footer from '../components/Footer';

const WishListPage = () => {
  return (
    <div className="wishlist-page">
      <Header />
      <div className="content">
        <WishList />
      </div>
      <Footer />
    </div>
  )
}

export default WishListPage