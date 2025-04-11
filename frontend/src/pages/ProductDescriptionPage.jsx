import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ProductDescription from '../components/ProductDescription';

const ProductDescriptionPage = () => {
  return (
    <div className="product-description-page">
        <Header />
        <div className="content">
            <ProductDescription />
        </div>
        <Footer />
    </div>
  )
}

export default ProductDescriptionPage