import React, { useState, useEffect, use } from "react";
import "../styles/ProductDescription.css";
import ReviewForm from "./ReviewForm";
import {
  ShoppingCart,
  Heart,
  Share2,
  ChevronDown,
  ChevronUp,
  Star,
  Plus,
  Minus,
} from "lucide-react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { toast, ToastContainer } from "react-toastify";
import { useGetProductByIdQuery } from "../app/api/productAPI";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../app/api/cartAPI";
import { addToFavorites, removeFromFavorites } from "../app/api/favoriteAPI";
import { selectFavoriteItems } from "../app/features/favorite/favoriteSlice";
import { fetchFavorites } from "../app/api/favoriteAPI";
import { fetchCart } from "../app/api/cartAPI";
import { selectCartItems } from "../app/features/cart/cartSlice";
import { updateCartItem } from "../app/api/cartAPI";
import { useNavigate } from "react-router-dom"; 
import { BsXLg } from "react-icons/bs";
import { useGetReviewsByProductIdQuery } from "../app/api/reviewAPI";

const ProductDescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { id } = useParams();
  const { data: reviewsData } = useGetReviewsByProductIdQuery(id);
  const { data } = useGetProductByIdQuery(id);
  const carts = useSelector(selectCartItems);
  var thisCart = carts?.cartItems?.find(
    (item) => item?.productId === (data?.productId ? data?.productId : data?._id)
  );

  useEffect(() => {
    if (carts?.status === "idle") {
      dispatch(fetchCart());
      thisCart = carts?.cartItems?.find(
        (item) => item?.productId === (data?.productId ? data?.productId : data?._id)
      );
    }
    if (carts?.status === "failed") {
      console.log("status failed", carts?.error);
    }
  }, [carts.status, dispatch]);
  const [products, setProducts] = useState({
    id: data?._id,
    name: data?.name,
    price: data?.markedprice,
    discountPrice: data?.sellingPrice,
    description: data?.description,
    highlights: data?.highlights,
    images: data?.images,
    rating: data?.rating,
    reviewCount: data?.reviewCount,
    reviews: reviewsData,
    category: data?.category,
    brand: data?.brand,
  });

  useEffect(() => {
    if (data && reviewsData) {
      setProducts({
        id: data?._id,
        name: data?.name,
        price: data?.markedprice,
        discountPrice: data?.sellingPrice,
        description: data?.description,
        highlights: data?.highlights,
        images:  data?.images,
        rating: data?.rating,
        reviewCount: data?.reviews.length,
        reviews: reviewsData,
        category: data?.category,
        brand: data?.brand,
      });
    }
  }, [data, reviewsData]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [expandedSection, setExpandedSection] = useState("description");
  const favorites = useSelector(selectFavoriteItems);

  useEffect(() => {
    if (favorites.status === "idle") {
      dispatch(fetchFavorites());
    }
    if (favorites.status === "failed") {
      console.log("status failed", favorites.error);
    }
  }, [favorites.status, dispatch]);

  const handleAddToCart = (product) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    toast.success("Product added to cart");
  };

  const handleToggleFavorite = (product) => {
    dispatch(fetchFavorites());
    const isFavorite = favorites?.favoriteItems?.some(
      (fav) =>
        fav?.productId ===
        (product?.productId ? product?.productId : product?._id)
    );
    if (isFavorite) {
      dispatch(removeFromFavorites(product));
      toast.error("Product removed from favorites");
    } else {
      dispatch(addToFavorites(product));
      toast.success("Product added to favorites");
    }
    dispatch(fetchFavorites());
  };

  const nextImage = () => {
    setActiveImageIndex((current) =>
      current === products?.images?.length - 1 ? 0 : current + 1
    );
  };

  const prevImage = () => {
    setActiveImageIndex((current) =>
      current === 0 ? products?.images?.length - 1 : current - 1
    );
  };

  const selectImage = (index) => {
    setActiveImageIndex(index);
  };

  const buyNow = (product) => {
    console.log("carts", carts?.cartItems?.length);
    if (carts?.cartItems?.length === 0) {
      console.log("not enough", carts?.cartItems?.products?.length);
      dispatch(addToCart({ ...product, quantity: 1 }));
    }
    console.log("enough", carts?.cartItems?.products?.length);
    toast.success("Product added to cart from buy");
    // navigate("/checkout");
    window.location.href = "/checkout";
  };

  const shareProduct = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Product link copied to clipboard!");
  };

  const toggleSection = (section) => {
    if (expandedSection === section) {
      setExpandedSection("");
    } else {
      setExpandedSection(section);
    }
  };

  const handleQuantityChange = (productId, quantity, products) => {
    if (!thisCart) {
      dispatch(addToCart({ ...products, quantity: 1 }));
      toast.success("Product added to cart");
    } else if (thisCart?.quantity + quantity > products?.quantity) {
      toast.error("Quantity exceeds available stock");
    } else if (thisCart?.quantity + quantity < 1) {
      toast.error("Quantity cannot be less than 1");
    } else {
      toast.success("Product quantity updated");
        dispatch(updateCartItem({ productId, quantity }));
    };
  };
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="star filled" />);
    }

    if (hasHalfStar) {
      stars?.push(
        <div key="half" className="half-star-container">
          <Star className="star empty" />
          <div className="half-star">
            <Star className="star filled" />
          </div>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(<Star key={`empty-${i}`} className="star empty" />);
    }

    return stars;
  };

  return (
    <div className="product-page">
      <ToastContainer />
      <div className="product-container">
        {/* Product images section */}
        <div className="product-images">
          <div className="main-image-container">
            {products?.images?.map((image, index) => (
              <div
                key={index}
                className={`main-image ${
                  index === activeImageIndex ? "active" : ""
                }`}
              >
                <img src={image} alt={`${products?.name} view ${index + 1}`} />
              </div>
            ))}
            <button className="image-nav prev" onClick={prevImage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button className="image-nav next" onClick={nextImage}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
          <div className="thumbnail-container">
            {products?.images?.map((image, index) => (
              <button
                key={index}
                className={`thumbnail ${
                  index === activeImageIndex ? "active" : ""
                }`}
                onClick={() => selectImage(index)}
              >
                <img src={image} alt={`Thumbnail ${index + 1}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Product details section */}
        <div className="product-details">
          <div className="product-header">
            <h1 className="product-title">{products?.name}</h1>
            <i
              className="heart-icon"
              onClick={() => handleToggleFavorite(data)}
            >
              {favorites?.favoriteItems?.some(
                (fav) =>
                  fav?.productId ===
                  (products?.id)
              ) ? (
                <AiFillHeart fill="red" />
              ) : (
                <AiOutlineHeart fill="red" />
              )}
            </i>
          </div>

          <div className="product-rating">
            <div className="stars-container">{renderStars(products.rating)}</div>
            <span className="rating-text">
              {products?.rating?.toFixed(1)} ({products?.reviews?.length} reviews)
            </span>
          </div>

          <div className="product-price">
            {products?.discountPrice ? (
              <>
                <span className="current-price">
                  Rs{products?.discountPrice?.toFixed(2)}
                </span>
                <span className="original-price">
                  Rs{products?.price?.toFixed(2)}
                </span>
                <span className="discount-badge">
                  {Math.round(
                    (1 - products?.discountPrice / products?.price) * 100
                  )}
                  % OFF
                </span>
              </>
            ) : (
              <span className="current-price">
                Rs{products?.price?.toFixed(2)}
              </span>
            )}
          </div>

          {/* Quantity selector */}
          <div className="quantity-section">
            <h3 className="section-title">Quantity</h3>
            <div className="quantity-selector">
              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(products?.id, -1, data)}
                disabled={thisCart?.quantity <= 1}
              >
                <Minus size={16} />
              </button>
              <input
                type="text"
                value={thisCart?.quantity}
                className="quantity-input"
                aria-label="Quantity"
              />

              <button
                className="quantity-btn"
                onClick={() => handleQuantityChange(products?.id, 1, data)}
                disabled={thisCart?.quantity >= products?.quantity}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="product-actions">
            <button className="cart-button" onClick={() => {handleAddToCart(data)}}>
              <ShoppingCart />
              Add to Cart
            </button>
            <button className="buy-button" onClick={()=>buyNow(data)}>
              Buy Now
            </button>
            <button
              className="share-button"
              onClick={shareProduct}
              aria-label="Share product"
            >
              <Share2 />
            </button>
          </div>

          {/* Collapsible sections */}
          <div className="product-sections">
            {/* Description section */}
            <div className="collapsible-section">
              <button
                className="section-header"
                onClick={() => toggleSection("description")}
                aria-expanded={expandedSection === "description"}
              >
                <h3>Description</h3>
                {expandedSection === "description" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
              {expandedSection === "description" && (
                <div className="section-content">
                  <p>{products?.description}</p>
                  <h4>Highlights</h4>
                  <ul className="highlights-list">
                    {products?.highlights?.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Reviews section */}
            <div className="collapsible-section">
              <button
                className="section-header"
                onClick={() => toggleSection("reviews")}
                aria-expanded={expandedSection === "reviews"}
              >
                <h3>Customer Reviews ({products?.reviews?.length})</h3>
                {expandedSection === "reviews" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
              {expandedSection === "reviews" && (
                <div className="section-content">
                  <div className="review-summary">
                    <div className="overall-rating">
                      <span className="rating-number">
                        {products?.rating?.toFixed(1)}
                      </span>
                      <span className="out-of">out of 5</span>
                    </div>
                    <div className="stars-container summary-stars">
                      {renderStars(products?.rating)}
                    </div>
                  </div>

                  <div className="reviews-list">
                    {products?.reviews?.map((review) => (
                      <div key={review?._id} className="review-item">
                        <div className="reviewer-info">
                          <img
                            src="../no-image.jpg"
                            alt={review?.user}
                            className="reviewer-avatar"
                          />
                          <div className="reviewer-details">
                            <h4 className="reviewer-name">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h4>
                            <div className="reviewer-rating">
                              <div className="stars-container small">
                                {renderStars(review?.rating)}
                              </div>
                              <span className="review-date">
                                {review?.createdAt?.slice(0, 10)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="review-text">{review?.comment}</p>
                        <div className="review-actions">
                          <button className="review-action-btn">
                            {review?.helpful} people found this helpful
                          </button>
                          <span className="action-separator">•</span>
                          <button className="review-action-btn">Helpful</button>
                          <span className="action-separator">•</span>
                          <button className="review-action-btn">Report</button>
                        </div>
                      </div>
                    ))}
                    <button className="view-all-reviews">
                      View all {products?.reviewCount} reviews
                    </button>
                  </div>
                </div>
              )}
              <ReviewForm productId={products?._id} />
            </div>

            {/* Shipping section */}
            <div className="collapsible-section">
              <button
                className="section-header"
                onClick={() => toggleSection("shipping")}
                aria-expanded={expandedSection === "shipping"}
              >
                <h3>Shipping & Returns</h3>
                {expandedSection === "shipping" ? (
                  <ChevronUp />
                ) : (
                  <ChevronDown />
                )}
              </button>
              {expandedSection === "shipping" && (
                <div className="section-content">
                  <h4>Free Shipping</h4>
                  <p>
                    Free shipping on orders over Rs5000. Standard shipping takes
                    3-5 business days.
                  </p>

                  <h4>Returns</h4>
                  <p>
                    Easy returns within 30 days of purchase. Return shipping is
                    free for defective items.
                  </p>

                  <h4>Warranty</h4>
                  <p>
                    This product comes with a 2-year manufacturer warranty
                    covering defects in materials and workmanship.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Related products */}
      <div className="related-products">
        <h2 className="related-title">You may also like</h2>
        <div className="related-grid">
          {products?.related?.map((relatedProduct) => (
            <div key={relatedProduct?.id} className="related-item">
              <div className="related-image">
                <img src={relatedProduct?.image} alt={relatedProduct?.name} />
              </div>
              <div className="related-info">
                <h3 className="related-name">
                  <a href="#">{relatedProduct?.name}</a>
                </h3>
                <div className="related-rating">
                  <div className="stars-container small">
                    {renderStars(relatedProduct?.rating)}
                  </div>
                  <span className="rating-number small">
                    {relatedProduct?.rating?.toFixed(1)}
                  </span>
                </div>
                <p className="related-price">
                  Rs{relatedProduct?.price?.toFixed(2)}
                </p>
              </div>
              <button className="related-cart-btn">Add to cart</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
