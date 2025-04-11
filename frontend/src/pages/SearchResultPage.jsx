import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchProduct from '../components/SearchProduct';

const SearchResultPage = () => {
  return (
    <div className="searchresult-page">
        <Header />
        <div className="content">
            <SearchProduct />
        </div>
        <Footer />
    </div>
  )
}

export default SearchResultPage;