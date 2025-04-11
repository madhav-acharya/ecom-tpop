import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import "../styles/WishList.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../app/api/favoriteAPI";
import Product from "./Product";

const WishList = () => {
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

  return (
    <div className="wishlist-container">
      <div className="wishlist-header">
        <h1>
          <Heart className="wishlist-icon" />
          My Wishlist
        </h1>
        <p className="wishlist-count">{favorites?.favoriteItems?.length} Items</p>
      </div>

      {favorites?.favoriteItems?.length === 0 ? (
        <div className="empty-wishlist">
          <Heart size={64} className="empty-wishlist-icon" />
          <h2>Your wishlist is empty</h2>
          <p>Save your favorite items to come back to them later!</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <Product tagName="Wishlist" productList={favorites?.favoriteItems} />
      )}
    </div>
  );
};

export default WishList;
