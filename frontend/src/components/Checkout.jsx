import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Check, ArrowLeft } from 'lucide-react';
import '../styles/Checkout.css';
import { fetchCart } from "../app/api/cartAPI";
import { useSelector, useDispatch } from "react-redux";
import { selectCartItems } from "../app/features/cart/cartSlice";
import { useCreateOrderMutation } from '../app/api/orderAPI';
import { toast } from 'react-toastify';
import { useRemoveUsersCartMutation } from '../app/api/cartAPI';
import { useGetCurrentUserQuery } from '../app/api/authAPI';

const districtsOfNepal = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura", "Banke",
  "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan", "Dadeldhura", "Dailekh",
  "Dang", "Darchula", "Dhading", "Dhankuta", "Dhanusha", "Dolakha", "Dolpa",
  "Doti", "Eastern Rukum", "Gorkha", "Gulmi", "Humla", "Ilam", "Jajarkot", "Jhapa",
  "Jumla", "Kailali", "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu",
  "Kavrepalanchok", "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur",
  "Manang", "Morang", "Mugu", "Mustang", "Myagdi", "Nawalpur", "Nuwakot",
  "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Parasi", "Pyuthan",
  "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rupandehi", "Salyan",
  "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok", "Siraha",
  "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Tanahun", "Taplejung",
  "Terhathum", "Udayapur", "Western Rukum"
];

const Checkout = () => {
  const [createOrder] = useCreateOrderMutation();
  const[removeUsersCart] = useRemoveUsersCartMutation();
  const dispatch = useDispatch();
  const carts = useSelector(selectCartItems);
  const {data: user, isSuccess} = useGetCurrentUserQuery();
  const [cartItems, setCartItems] = useState(carts?.cartItems || []);

  console.log("user", user?.user);
  const [isChecked, setIsChecked] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    billingAddress: '',
    shippingAddress: '',
    phoneNumber: '',
    district: '',
    city: '',
    state: '',
    user: '',
    products: cartItems,
    isChecked: isChecked,
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (isSuccess)
    {
      setFormData({
        ...formData,
        firstName: user?.user?.firstName,
        lastName: user?.user?.lastName,
        email: user?.user?.email,
        phoneNumber: user?.user?.phoneNumber?.number,
        user: user?.user?.id,
        billingAddress: user?.user?.billingAddress,
        shippingAddress: user?.user?.shippingAddress,
      });
    }
  }, [user, isSuccess]);

  useEffect(() => {
      if (carts?.status === "idle") {
        dispatch(fetchCart());
      }
      if (carts?.status === "failed") {
        console.log("status failed", carts?.error);
      }
      if (carts?.status === "succeeded") {
        setCartItems(carts?.cartItems);
        setFormData({
          ...formData,
          products: carts?.cartItems,
          user: carts?.cartItems[0]?.userId,
        });
      }
    }, [dispatch, carts]);

  const calculateSubtotal = () => {
    return cartItems?.reduce(
      (total, item) => total + item?.price * item?.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = 9.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null,
      });
    }
  };
  
  const validateStep = (stepNumber) => {
    const errors = {};
    
    if (stepNumber === 1) {
      if (!formData?.firstName) errors.firstName = 'First name is required';
      if (!formData?.lastName) errors.lastName = 'Last name is required';
      if (!formData?.email) {
        errors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData?.email)) {
        errors.email = 'Email address is invalid';
      }
      if (!formData?.shippingAddress) errors.shippingAddress = 'Address is required';
      if (!formData?.billingAddress) errors.billingAddress = 'Billing address is required';
      if (!formData?.district) errors.district = 'District is required';
      if (!formData?.city) errors.city = 'City is required';
      if (!formData?.state) errors.state = 'State is required';
      if (!formData?.phoneNumber) errors.phoneNumber = 'Phone number is required';
    }
    
    if (stepNumber === 2) {
      if (!formData?.isChecked) errors.isChecked = 'Please accept the payment method';
    }
    
    return errors;
  };
  
  const handleNextStep = () => {
    console.log("formData", formData);
    const errors = validateStep(step);
    console.log("errors", errors);
    if (Object.keys(errors).length === 0) {
      setStep(step + 1);
    } else {
      setFormErrors(errors);
    }
  };
  
  const handlePrevStep = () => {
    setStep(step - 1);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateStep(step);
    console.log("errors", errors);
    
    if (Object.keys(errors).length === 0) {
      
      console.log('Order submitted', formData);
      setStep(3);
      const orderData = {
        ...formData,
        totalAmount: total,
      };
      createOrder(orderData)
        .unwrap()
        .then((response) => {
          console.log('Order created successfully:', response);
        })
        .catch((error) => {
          console.error('Error creating order:', error);
        });
        toast.success('Order placed successfully!');
        removeUsersCart(formData?.products[0]?.userId).unwrap()
        .then((response) => {
          console.log('Cart cleared successfully:', response);
          setCartItems([]);
          dispatch(fetchCart());
        })
        .catch((error) => {
          console.error('Error clearing cart:', error);
        });
    } else {
      setFormErrors(errors);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-header">
        <h1>
          <ShoppingBag className="checkout-icon" />
          Checkout
        </h1>
      </div>
      
      <div className="checkout-progress">
        <div className={`progress-step ${step >= 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
          <div className="step-number">
            {step > 1 ? <Check size={18} /> : 1}
          </div>
          <span>Shipping</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
          <div className="step-number">
            {step > 2 ? <Check size={18} /> : 2}
          </div>
          <span>Payment</span>
        </div>
        <div className="progress-line"></div>
        <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
          <div className="step-number">3</div>
          <span>Confirmation</span>
        </div>
      </div>
      
      <div className="checkout-content">
        <div className="checkout-form-container">
          {step === 1 && (
            <form className="checkout-form">
              <h2>Shipping Information</h2>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={formErrors?.firstName ? 'error' : ''}
                  />
                  {formErrors?.firstName && (
                    <div className="error-message">{formErrors?.firstName}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={formErrors.lastName ? 'error' : ''}
                  />
                  {formErrors?.lastName && (
                    <div className="error-message">{formErrors?.lastName}</div>
                  )}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={formErrors?.email ? 'error' : ''}
                />
                {formErrors?.email && (
                  <div className="error-message">{formErrors?.email}</div>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="billingAddress">Billing Address</label>
                <input
                  type="text"
                  id="billingAddress"
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleChange}
                  className={formErrors?.billingAddress ? 'error' : ''}
                />
                {formErrors?.billingAddress && (
                  <div className="error-message">{formErrors?.billingAddress}</div>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="shippingAddress">Shipping Address</label>
                <input
                  type="text"
                  id="shippingAddress"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleChange}
                  className={formErrors?.shippingAddress ? 'error' : ''}
                />
                {formErrors.shippingAddress && (
                  <div className="error-message">{formErrors?.shippingAddress}</div>
                )}
              </div>

              <div className="form-group">
                  <label htmlFor="phoneNumber">PhoneNumber</label>
                  <input
                    type="text"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={formErrors?.phoneNumber ? 'error' : ''}
                  />
                  {formErrors?.phoneNumber && (
                    <div className="error-message">{formErrors?.phoneNumber}</div>
                  )}
                </div>
                
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData?.city}
                    onChange={handleChange}
                    className={formErrors?.city ? 'error' : ''}
                  />
                  {formErrors.city && (
                    <div className="error-message">{formErrors?.city}</div>
                  )}
                </div>
                
                <div className="form-group">
                  <label htmlFor="state">State</label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    value={formData?.state}
                    onChange={handleChange}
                    className={formErrors?.state ? 'error' : ''}
                  />
                  {formErrors?.state && (
                    <div className="error-message">{formErrors?.state}</div>
                  )}
                </div>

                <div className="form-group">
                <label for="district">Select District:</label>
                    <select id="district" name="district" onChange={handleChange} className={formErrors?.district ? 'error' : ''}>
                      <option value="">Select District</option>
                      {districtsOfNepal.map((district, index) => (
                        <option key={index} value={district}>
                          {district}
                        </option>
                      ))}
                    </select>
                  {formErrors.district && (
                    <div className="error-message">{formErrors?.district}</div>
                  )}
                </div>

                
                
                
              </div>
              
              <div className="form-actions">
                <Link to="/cart" className="back-button">
                  <ArrowLeft size={16} /> Back to Cart
                </Link>
                <button type="button" onClick={handleNextStep} className="next-button">
                  Continue to Payment
                </button>
              </div>
            </form>
          )}
          
          {step === 2 && (
            <form className="checkout-form" onSubmit={handleSubmit}>
              <h2>Payment Information</h2>
              
              <div className="cod-wrapper">
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={formData?.isChecked}
                    onChange={handleChange}
                    name="isChecked"
                    className={formErrors?.isChecked ? 'error' : ''}
                  />
                  <span className="checkmark"></span>
                  Cash on Delivery
                </label>
                {formErrors?.isChecked && (
                  <div className="error-message">{formErrors?.isChecked}</div>
                )}
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={handlePrevStep} className="back-button">
                  <ArrowLeft size={16} /> Back
                </button>
                <button type="submit" className="place-order-button">
                  Place Order
                </button>
              </div>
            </form>
          )}
          
          {step === 3 && (
            <div className="confirmation">
              <div className="confirmation-icon">
                <Check size={48} />
              </div>
              <h2>Order Confirmed!</h2>
              <p>Thank you for your purchase. Your order has been received.</p>
              <p>Order confirmation has been sent to <strong>{formData.email}</strong></p>
              <div className="confirmation-details">
                <div className="confirmation-detail">
                  <span>Order Number:</span>
                  <span>#OD{Math?.floor(10000 + Math?.random() * 90000)}</span>
                </div>
                <div className="confirmation-detail">
                  <span>Estimated Delivery:</span>
                  <span>{new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString()}</span>
                </div>
              </div>
              <Link to="/" className="continue-shopping-button">
                Continue Shopping
              </Link>
            </div>
          )}
        </div>
        
        <div className="order-summary">
          <h2>Order Summary</h2>
          <div className="order-items">
            {cartItems?.map((item) => (
              <div className="order-item" key={item?._id}>
                <img src={item?.image} alt={item?.name} className="order-item-image" />
                <div className="order-item-details">
                  <h4>{item?.name}</h4>
                  <div className="order-item-meta">
                    <span className="order-item-quantity">Qty: {item?.quantity}</span>
                    <span className="order-item-price">Rs{(item?.price * item?.quantity)?.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="order-totals">
            <div className="order-total-row">
              <span>Subtotal</span>
              <span>Rs{subtotal?.toFixed(2)}</span>
            </div>
            <div className="order-total-row">
              <span>Shipping</span>
              <span>Rs{shipping?.toFixed(2)}</span>
            </div>
            <div className="order-total-row">
              <span>Tax</span>
              <span>Rs{tax?.toFixed(2)}</span>
            </div>
            <div className="order-total-row grand-total">
              <span>Total</span>
              <span>Rs{total?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
