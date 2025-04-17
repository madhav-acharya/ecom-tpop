import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Trash2, Plus, Minus, ArrowRight } from "lucide-react";
import "../styles/Cart.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchCart } from "../app/api/cartAPI";
import { selectCartItems } from "../app/features/cart/cartSlice";
import { removeFromCart, updateCartItem } from "../app/api/cartAPI";
import { AiFillDelete } from "react-icons/ai";
import { ToastContainer, toast } from "react-toastify";
import { useApplyPromoCodeMutation } from "../app/api/promocodeAPI";

const Cart = () => {
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(Number(localStorage.getItem("pd")) || 0);
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const [applyPromoCode] = useApplyPromoCodeMutation();
  const dispatch = useDispatch();
  const carts = useSelector(selectCartItems);
  const [cartItems, setCartItems] = useState(carts?.cartItems || []);

  const handleRemoveItem = (id) => {
    dispatch(fetchCart());
    dispatch(removeFromCart(id));
    setCartItems(cartItems?.filter((item) => item?._id !== id));
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
 
    const handleQuantityChange = (productId, quantity) => {
        dispatch(updateCartItem({ productId, quantity }));
    };

    const calculateSubtotal = () => {
      return cartItems?.reduce((total, item) => {
        const price = Number(item?.price) || 0;
        const quantity = Number(item?.quantity) || 0;
        return total + price * quantity;
      }, 0);
    };

    const subtotal = calculateSubtotal();

    const handleApply = async () => {
      try {
        const res = await applyPromoCode({ code, cartTotal: subtotal }).unwrap();
        setPromoDiscount(res.discount);
        localStorage.setItem("pd", res?.discount);
        setIsPromoApplied(true);
        setMessage(res.message);
      } catch (err) {

        setMessage(err.data?.message || "Invalid promo");
      }
    };
  

    const calculateShipping = () => {
      const quantity = cartItems?.reduce((sum, item) => sum + (item?.quantity || 0), 0);
      if (quantity === 0) {
        return 0;
      }
      if (quantity === 1) {
        const item = cartItems[0];
        const customShipping = item?.customShipping || 0;
        const defaultShipping = item?.defaultShipping || 0;
        return customShipping + defaultShipping;
      } else if (quantity > 1 && quantity < 6) {
        return 50;
      } else if (quantity >= 6) {
        return 0;
      } else {
        return 0;
      }
    };
    
    const shipping = calculateShipping();
    const tax = subtotal * 0.13;
    const total = subtotal + shipping;

  return (
    <div className="cart-container">
       <ToastContainer position="bottom-left" limit={1}/>
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
                  <p className="item-price">Rs {item?.price?.toFixed(2)}</p>
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
                  </div>
                </div>
                <div className="item-total">
                  <span>
                  Rs {(item?.price * item?.quantity)?.toFixed(2)}
                  </span>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item?._id)}
                  >
                    <AiFillDelete size={30} />
                    Remove
                  </button>
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
            {promoDiscount&&<div className="summary-row">
              <span>Promo code Discount</span>
              <span >Rs{Number(promoDiscount)?.toFixed(2)}</span>
            </div>}
            <div className="summary-row">
              <span>VAT(13%)</span>
              <span style={{textDecoration: "line-through"}}>Rs{tax?.toFixed(2)}</span>
            </div>
            <div className="voucher-container">
              <label className="voucher-label">Voucher</label>
              <div className="voucher-row">
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="voucher-input"
                  placeholder="Enter your voucher code"
                />
                <button className="apply-button" onClick={handleApply}>Apply</button>
              </div>
              {message&&isPromoApplied?<p className="message success">{message}</p>:
              <p className="message error">{message}</p>}
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>Rs{total?.toFixed(2)}</span>
            </div>
            <button  className="checkout-btn" onClick={() => window.location.href = "/checkout"}>
              Proceed to Checkout
              <ArrowRight size={16} />
            </button>
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
