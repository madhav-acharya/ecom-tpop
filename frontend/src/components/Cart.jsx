import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import "../styles/Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../app/api/cartAPI";
import { selectCartItems } from "../app/features/cart/cartSlice";
import { removeFromCart, updateCartItem } from "../app/api/cartAPI";

const Cart = () => {
  const dispatch = useDispatch();
  const carts = useSelector(selectCartItems);
  const [cartItems, setCartItems] = useState(carts?.cartItems || []);

  const handleRemoveItem = (id) => {
    dispatch(fetchCart());
    dispatch(removeFromCart(id));
    setCartItems(cartItems.filter((item) => item?._id !== id));
    dispatch(fetchCart());
  };

  useEffect(() => {
    if (carts?.status === "idle") {
      dispatch(fetchCart());
    }
    if (carts?.status === "failed") {
      console.log("status failed", carts?.error);
    }
    if (carts?.status === "succeeded") {
      setCartItems(carts?.cartItems);
    }
  }, [dispatch, carts]);

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item?.price * item?.quantity,
      0
    );
  };
  const handleQuantityChange = (productId, quantity) => {
      dispatch(updateCartItem({ productId, quantity }));
  };

  const subtotal = calculateSubtotal();
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h1>
          <ShoppingCart className="cart-icon" />
          Shopping Cart
        </h1>
        <p className="cart-count">{cartItems?.length} Items</p>
      </div>

      {cartItems?.length === 0 ? (
        <div className="empty-cart">
          <ShoppingCart size={64} className="empty-cart-icon" />
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/" className="continue-shopping-btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div className="cart-item" key={item?._id}>
                <img
                  src={item?.image}
                  alt={item?.name}
                  className="item-image"
                />
                <div className="item-details">
                  <h3>{item?.name}</h3>
                  <p className="item-price">Rs{item?.price?.toFixed(2)}</p>
                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() => handleQuantityChange(item?.productId, -1)}
                        className="quantity-btn"
                        disabled={item?.quantity <= 1}
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item?.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item?.productId, 1)}
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveItem(item?._id)}
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>
                <div className="item-total">
                  Rs{(item?.price * item?.quantity)?.toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>Rs{subtotal?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Rs{shipping?.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Tax</span>
              <span>Rs{tax?.toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs{total?.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">
              Proceed to Checkout
              <ArrowRight size={16} />
            </Link>
            <Link to="/" className="continue-shopping-link">
              Continue Shopping
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
