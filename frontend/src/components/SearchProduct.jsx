import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/SearchProduct.css';
import Product from './Product';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  X, 
  ShoppingCart, 
  Star
} from 'lucide-react';
import { useGetProductsQuery } from '../app/api/productAPI';
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../app/api/favoriteAPI";
import { setSearchTerm } from '../app/features/search/searchSlice';


const SearchProduct = () => {
      const { data: products, isSuccess } = useGetProductsQuery();
    const dispatch = useDispatch();
    const searchTerm = useSelector((state) => state.search.searchTerm);
    const favorites = useSelector((state => state.favorites));
      useEffect(() => {
        if (favorites?.status === "idle") {
          dispatch(fetchFavorites());
        }
        if (favorites?.status === "failed") {
          console.log("status failed", favorites?.error);
        }
      }, [dispatch, favorites.status]);

  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);

  const categories = [...new Set(products?.map(product => product?.category))];
  const brands = [...new Set(products?.map(product => product?.brand))];
  
  useEffect(() => {
    let results = products || [];
    if (isSuccess) {
      setFilteredProducts(products);
      results = products || [];

    if (searchTerm) {
      results = results?.filter(product => 
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }
 
    if (priceRange !== undefined && priceRange?.length > 0)
    {
      results = results?.filter(product => 
      product?.sellingPrice >= priceRange?.[0] && product?.sellingPrice <= priceRange?.[1]
      );
    }
 
    if (selectedCategory) {
      results = results?.filter(product => product?.category === selectedCategory);
    }
  
    if (selectedBrand) {
      results = results?.filter(product => product?.brand === selectedBrand);
    }
    
    setFilteredProducts(results);
     }
  }, [searchTerm, selectedCategory, selectedBrand, products, isSuccess, priceRange]);

  const clearFilters = () => {
    dispatch(setSearchTerm(''));
    setPriceRange([0, 1000000]);
    setSelectedCategory('');
    setSelectedBrand('');
  };

  const handlePriceChange = (e) => {
    setPriceRange([0, parseInt(e?.target?.value)]);
  };

  return (
    <div className="search-container">
      <header className="search-header">
        <p>Find your perfect product with our advanced search</p>
      </header>

      <div className="search-filters-container">
        <div className="filters-section">
          <div className="filter-header">
            <h3><Filter size={18} /> Filters</h3>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All</button>
          </div>

          <div className="filters-row">
            {/* Price Range Filter */}
            <div className="filter-group price-filter">
              <h4><SlidersHorizontal size={16} /> Price Range</h4>
              <div className="price-slider-container">
                <input
                  type="range"
                  min="0"
                  max={1000000}
                  value={priceRange?.[1]}
                  onChange={handlePriceChange}
                  className="price-slider"
                />
                <div className="price-range-labels">
                  <span>Rs{priceRange[0]}</span>
                  <span>Rs{priceRange[1]}</span>
                </div>
              </div>
            </div>
            <div className="filter-group">
              <div 
                className="dropdown-header" 
                onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              >
                <h4>Category</h4>
                {showCategoryDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {showCategoryDropdown && (
                <div className="dropdown-content">
                  <div 
                    className={`dropdown-item ${selectedCategory === '' ? 'selected' : ''}`}
                    onClick={() => setSelectedCategory('')}
                  >
                    All Categories
                  </div>
                  {categories.map(category => (
                    <div 
                      key={category} 
                      className={`dropdown-item ${selectedCategory === category ? 'selected' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="filter-group">
              <div 
                className="dropdown-header" 
                onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              >
                <h4>Brand</h4>
                {showBrandDropdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
              {showBrandDropdown && (
                <div className="dropdown-content">
                  <div 
                    className={`dropdown-item ${selectedBrand === '' ? 'selected' : ''}`}
                    onClick={() => setSelectedBrand('')}
                  >
                    All Brands
                  </div>
                  {brands.map(brand => (
                    <div 
                      key={brand} 
                      className={`dropdown-item ${selectedBrand === brand ? 'selected' : ''}`}
                      onClick={() => setSelectedBrand(brand)}
                    >
                      {brand}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="products-container">
        <div className="products-header">
          <h2>
            {filteredProducts?.length} {filteredProducts?.length === 1 ? 'Product' : 'Products'} Found
          </h2>
          {(searchTerm || selectedCategory || selectedBrand || priceRange?.[1] < 1000000) && (
            <div className="active-filters">
              {searchTerm && (
                <div className="filter-tag">
                  Search: "{searchTerm}"
                  <button onClick={() => dispatch(setSearchTerm(''))}><X size={12} /></button>
                </div>
              )}
              {selectedCategory && (
                <div className="filter-tag">
                  Category: {selectedCategory}
                  <button onClick={() => setSelectedCategory('')}><X size={12} /></button>
                </div>
              )}
              {selectedBrand && (
                <div className="filter-tag">
                  Brand: {selectedBrand}
                  <button onClick={() => setSelectedBrand('')}><X size={12} /></button>
                </div>
              )}
              {priceRange[1] < 1000000 && (
                <div className="filter-tag">
                  Max Price: ${priceRange?.[1]}
                  <button onClick={() => setPriceRange([0, 1000000])}><X size={12} /></button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Product grid */}
        {filteredProducts?.length > 0 ? (
          <div className="products-grid">
            <Product productList={filteredProducts} tagName={"searched items"}/>
          </div>
        ) : (
          <div className="no-products-found">
            <h3>No products match your search criteria</h3>
            <p>Try adjusting your filters or search terms</p>
            <button className="clear-filters-btn" onClick={clearFilters}>Clear All Filters</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
