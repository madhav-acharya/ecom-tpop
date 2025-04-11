import React, { useState, useEffect } from 'react';
import { TbCurrencyRupeeNepalese as DollarSign } from "react-icons/tb";
import { 
  Search, 
  X, 
  Filter, 
  ChevronDown, 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye,
  Tag,
  Grid3X3,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import '../styles/SearchProduct.css';
import Product from './Product';
import { useGetProductsQuery } from '../app/api/productAPI';
import { useGetCategoriesQuery } from '../app/api/categoryAPI';
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../app/api/favoriteAPI";
import { setSearchTerm } from '../app/features/search/searchSlice';

const brands = ['All', 'SoundCore', 'AppleX', 'Nike', 'Gucci', 'Breville', 'IKEA', 'Lululemon', 'Fitbit'];
const ratingOptions = [5, 4, 3, 2, 1];
const SearchProduct = () => {
    const { data: products } = useGetProductsQuery();
    const { data: categories } = useGetCategoriesQuery();
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

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBrand, setSelectedBrand] = useState('All');
  const [minRating, setMinRating] = useState(0);
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [showNoResults, setShowNoResults] = useState(false);
  const [sortOrder, setSortOrder] = useState(null);
  const [sortBy, setSortBy] = useState(null);

  console.log("searchTerm", searchTerm);
  useEffect(() => {
    setFilteredProducts(products);
  }, [products]);

  const handleSearch = (e) => {
    // const searchTerm = e?.target?.value;
    setFilteredProducts(products);
    if (selectedCategory !== 'All') {
      setFilteredProducts(filteredProducts?.filter(product =>
        product?.category === selectedCategory
      ));
    }
    if (selectedBrand !== 'All') {
      setFilteredProducts(filteredProducts?.filter(product =>
        product?.brand === selectedBrand
      ));
    }
    setFilteredProducts(filteredProducts?.filter(product =>
      product?.price >= priceRange?.min && product?.price <= priceRange?.max
    ));
    if (minRating > 0) {
      setFilteredProducts(filteredProducts?.filter(product =>
        product?.rating >= minRating
      ));
    }
    if (sortBy && sortOrder) {      
      setFilteredProducts([...filteredProducts]?.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] - b[sortBy];
        } else {
          return b[sortBy] - a[sortBy];
        }
      }));
    }
    if (selectedCategory === 'All') {
      setFilteredProducts(products);
    }
    if (selectedBrand === 'All') {
      setFilteredProducts(products);
    }
    if (priceRange?.min === 0 && priceRange?.max === 10000) {
      setFilteredProducts(products);
    }
    if (minRating === 0) {
      setFilteredProducts(products);
    }
    if (sortBy === null && sortOrder === null) {
      setFilteredProducts(products);
    }
    if (sortBy === 'price' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => a?.sellingPrice - b?.sellingPrice));
    }
    if (sortBy === 'price' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => b?.sellingPrice - a?.sellingPrice));
    }
    if (sortBy === 'rating' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => a?.rating - b?.rating));
    }
    if (sortBy === 'rating' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => b?.rating - a?.rating));
    }
    if (sortBy === 'name' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => a?.name?.localeCompare(b?.name)));
    }
    if (sortBy === 'name' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => b?.name?.localeCompare(a?.name)));
    }
    if (sortBy === 'brand' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => a?.brand?.localeCompare(b?.brand)));
    }
    if (sortBy === 'brand' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => b?.brand?.localeCompare(a?.brand)));
    }
    if (sortBy === 'category' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => a?.category?.localeCompare(b?.category)));
    }
    if (sortBy === 'category' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => b?.category?.localeCompare(a?.category)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)));
    }
    if (sortBy === 'updatedAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.updatedAt) - new Date(b?.updatedAt)));
    }
    if (sortBy === 'updatedAt' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)));
    }
    if (sortBy === 'updatedAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.updatedAt) - new Date(b?.updatedAt)));
    }
    if (sortBy === 'updatedAt' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(b?.updatedAt) - new Date(a?.updatedAt)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.createdAt) - new Date(b?.createdAt)));
    }
    if (sortBy === 'createdAt' && sortOrder === 'desc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(b?.createdAt) - new Date(a?.createdAt)));
    }
    if (sortBy === 'updatedAt' && sortOrder === 'asc') {
      setFilteredProducts([...filteredProducts]?.sort((a, b) => new Date(a?.updatedAt) - new Date(b?.updatedAt)));
    }         
    if (searchTerm) {
      setFilteredProducts(filteredProducts?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      ));
      setShowNoResults(filteredProducts?.length === 0);
    }
    console.log("searchTerm", searchTerm);
  };
  
  // useEffect(() => {
  //   const delaySearch = setTimeout(() => {
  //     let results = products;
  //     if (searchTerm) {
  //       results = results?.filter(product => 
  //         product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase())
  //       );
  //     }
  //     if (selectedCategory !== 'All') {
  //       results = results?.filter(product => 
  //         product?.category === selectedCategory
  //       );
  //     }
  //     if (selectedBrand !== 'All') {
  //       results = results?.filter(product => 
  //         product?.brand === selectedBrand
  //       );
  //     }
  //     results = results?.filter(product => 
  //       product?.price >= priceRange?.min && product?.price <= priceRange?.max
  //     );
  //     if (minRating > 0) {
  //       results = results?.filter(product => 
  //         product?.rating >= minRating
  //       );
  //     }
  //     if (sortBy && sortOrder) {
  //       results = [...results]?.sort((a, b) => {
  //         if (sortOrder === 'asc') {
  //           return a[sortBy] - b[sortBy];
  //         } else {
  //           return b[sortBy] - a[sortBy];
  //         }
  //       });
  //     }
      
  //     setFilteredProducts(results);
  //     setShowNoResults(results?.length === 0);
  //     console.log("results", results);
  //   }, 300);
    
  //   return () => clearTimeout(delaySearch);
  // }, [searchTerm, selectedCategory, selectedBrand, priceRange, minRating, sortBy, sortOrder]);

  const handleSearchChange = (e) => {
    dispatch(setSearchTerm(e.target.value));
  };
  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const handleBrandChange = (brand) => {
    setSelectedBrand(brand);
  };
  const handlePriceChange = (e) => {
    const { name, value } = e?.target;
    setPriceRange(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };
  const handleRatingChange = (rating) => {
    setMinRating(rating === minRating ? 0 : rating);
  };

  const handleSort = (sortByField) => {
    if (sortBy === sortByField) {
      if (sortOrder === 'asc') {
        setSortOrder('desc');
      } else if (sortOrder === 'desc') {
        setSortBy(null);
        setSortOrder(null);
      }
    } else {
      setSortBy(sortByField);
      setSortOrder('asc');
    }
  };

  const resetFilters = () => {
    dispatch(setSearchTerm(''));
    setSelectedCategory('All');
    setSelectedBrand('All');
    setPriceRange({ min: 0, max: 10000 });
    setMinRating(0);
    setSortBy(null);
    setSortOrder(null);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star
        key={index}
        size={15}
        className={index < Math.floor(rating) ? "filled" : ""}
        fill={index < Math.floor(rating) ? "#ffb954" : "none"}
        stroke={index < Math.floor(rating) ? "#ffb954" : "currentColor"}
      />
    ));
  };

  const renderRatingOptions = () => {
    return ratingOptions?.map((rating) => (
      <button
        key={rating}
        className={`rating-button ${minRating === rating ? 'active' : ''}`}
        onClick={() => handleRatingChange(rating)}
      >
        {renderStars(rating)}
        <span>&amp; Up</span>
      </button>
    ));
  };

  return (
    <div className="search-container">
      <div className="search-header">
        <h1>Find Your Perfect Product</h1>
        <p>Explore our wide selection of quality products</p>
      </div>
      
      <div className={`search-bar-container ${isSearchFocused ? 'focused' : ''}`}>
        <div className="search-icon">
          <Search size={22} />
        </div>
        <input
          type="search"
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
          className="search-input"
        />
      </div>
      
      <div className="filter-section">
        <div className="categories">
          <h3>
            <Tag size={20} />
            Categories
          </h3>
          <div className="category-buttons">
            {categories?.map(category => (
              <button
                key={category?._id}
                className={`category-button ${selectedCategory === category?.name ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category?.name)}
              >
                {category?.name}
              </button>
            ))}
          </div>
        </div>
        
        <div className="brands-filter">
          <h3>
            <Tag size={20} />
            Brands
          </h3>
          <div className="brand-buttons">
            {brands?.map(brand => (
              <button
                key={brand}
                className={`brand-button ${selectedBrand === brand ? 'active' : ''}`}
                onClick={() => handleBrandChange(brand)}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>
        
        <div className="price-filter">
          <h3>
            <DollarSign size={20} />
            Price Range
          </h3>
          <div className="price-inputs">
            <div className="price-input-container">
              <span className="dollar-sign"><DollarSign/></span>
              <input
                type="number"
                name="min"
                value={priceRange?.min}
                onChange={handlePriceChange}
                min="0"
                max={priceRange?.max}
              />
              <label>Min</label>
            </div>
            <div className="price-range-divider"></div>
            <div className="price-input-container">
              <span className="dollar-sign"><DollarSign/></span>
              <input
                type="number"
                name="max"
                value={priceRange?.max}
                onChange={handlePriceChange}
                min={priceRange?.min}
              />
              <label>Max</label>
            </div>
          </div>
        </div>
        
        <div className="rating-filter">
          <h3>
            <Star size={20} />
            Ratings
          </h3>
          <div className="rating-buttons">
            {renderRatingOptions()}
          </div>
        </div>
      </div>
      
      <div className="search-results">
        <div className="search-results-header">
          <h2>
            <Grid3X3 size={20} />
            Search Results
          </h2>
          <div className="results-actions">
            <span className="results-count">{filteredProducts?.length} products found</span>
            <div className="sort-controls">
              <button 
                className={`sort-button ${sortBy === 'price' ? 'active' : ''}`} 
                onClick={() => handleSort('price')}
              >
                Price
                {sortBy === 'price' && sortOrder === 'asc' && <ArrowUp size={14} />}
                {sortBy === 'price' && sortOrder === 'desc' && <ArrowDown size={14} />}
              </button>
              <button 
                className={`sort-button ${sortBy === 'rating' ? 'active' : ''}`} 
                onClick={() => handleSort('rating')}
              >
                Rating
                {sortBy === 'rating' && sortOrder === 'asc' && <ArrowUp size={14} />}
                {sortBy === 'rating' && sortOrder === 'desc' && <ArrowDown size={14} />}
              </button>
            </div>
          </div>
        </div>
        
        {showNoResults ? (
          <div className="no-results">
            <X size={60} />
            <p>No products found matching your criteria</p>
            <button className="reset-button" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            <Product productList={filteredProducts} tagName="Search Results" />
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchProduct;
