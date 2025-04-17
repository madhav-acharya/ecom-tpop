import React, {useState, useEffect} from 'react';
import '../styles/Product.css';
import { AiOutlineHeart } from "react-icons/ai";
import { BsCart3 } from "react-icons/bs";
import { AiFillHeart } from "react-icons/ai";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../app/api/cartAPI';
import { addToFavorites, removeFromFavorites } from '../app/api/favoriteAPI';
import { selectFavoriteItems } from '../app/features/favorite/favoriteSlice';
import { fetchFavorites } from '../app/api/favoriteAPI';
import { ToastContainer } from 'react-toastify';
import { Link } from 'react-router-dom';

const Product = ({tagName, productList}) => {
    
    const dispatch = useDispatch();
    const favorites = useSelector((selectFavoriteItems));

    useEffect(() => {
      if (favorites.status === 'idle') {
        dispatch(fetchFavorites());
      }
      if (favorites.status === 'failed') {
        console.log("status failed",favorites.error)
      }
    }
    , [favorites.status, dispatch, productList]);

    const handleAddToCart = (product) => {
        dispatch(addToCart({...product, quantity: 1}));
      };
    
      const handleToggleFavorite = (product) => {
        dispatch(fetchFavorites());
        const isFavorite = favorites?.favoriteItems?.some(fav => fav?.productId === (product?.productId?product?.productId:product?._id));
        if (isFavorite) {
          dispatch(removeFromFavorites(product));
        } else {
          dispatch(addToFavorites(product));

        }
        dispatch(fetchFavorites());
      };

  return (
      <div className="product">
        <div className="products">
        <span className="tag-name">
            {tagName}
              <ToastContainer position='bottom-left' limit={1}/>
            </span>
        <div className="product-container">
            {productList?.map((product) =>(
            <div className="product-card" key={product?._id}>
              <Link to={`/product-description/${product?.productId?product?.productId:product?._id}`}>
                <div className="product-image">
                    <img src={product?.images?.[0] || product?.image} alt="product" />
                </div>
              </Link>
                <div className="product-content">
                    <Link to={`/product-description/${product?._id}`} className="product-name">
                      <span className="product-name">
                          {product?.name}
                      </span> 
                    </Link>
                    <span className="product-price">
                        RS: {product?.sellingPrice || product?.price}
                    </span>
                    <div className="cart-fav">
                        <i className="heart-icon" onClick={() => handleToggleFavorite(product)}>
                            {(favorites?.favoriteItems?.some(fav => fav?.productId === (product?.productId?product?.productId:product?._id)))?<AiFillHeart fill='red'/>:<AiOutlineHeart fill='red'/>}
                        </i>
                        <div className="add-to-cart" onClick={() => {handleAddToCart(product)}}>
                            <span className="cart-name" >
                                Add to Cart
                            </span>
                            <i className="carts-icon">
                                <BsCart3 />
                            </i>
                        </div>
                    </div>
                </div>
            </div>))}
        </div>
        </div>
    </div>
  )
}

export default Product;