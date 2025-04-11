import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Checkout from '../components/Checkout';

const CheckoutPage = () => {
  return (
   <div className="checkout-page">
         <Header />
         <div className="content">
              <Checkout />
         </div>
         <Footer />
   </div>
  )
}

export default CheckoutPage