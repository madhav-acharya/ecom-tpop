import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Cart from '../components/Cart';

const CartPage = () => {
  return (
    <div className="cart-page">
        <Header />
        <div className="content">
            <Cart />
        </div>
        <Footer />
    </div>
  )
}

export default CartPage