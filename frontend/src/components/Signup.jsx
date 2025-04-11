// src/components/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { reset } from '../app/features/auth/authSlice';
import { signup } from '../app/api/authAPI';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import '../styles/Signup.css';
import { ToastContainer, toast } from 'react-toastify';

const Signup = () => {
   const { user, isLoading, isError, isSuccess, errorMessage } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    number: '',
    countryCode: '+977',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { firstName, lastName, email, number, countryCode, password, confirmPassword } = formData;

  useEffect(() => {
    if (isSuccess) {
      setTimeout(() => {
        toast.success('Signup successful');
      }, 5);
      navigate('/login');
    } else if (isError) {
      toast.error(errorMessage);
    }
    return () => {
      dispatch(reset());
    };
  }, [user, isSuccess, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    const errors = {};

    if (!firstName.trim()) errors.firstName = 'First name is required';
    if (!lastName.trim()) errors.lastName = 'Last name is required';
    if (!email.trim()) errors.email = 'Email is required';
    if (!number.trim()) errors.number = 'Phone number is required';
    if (!password) errors.password = 'Password is required';
    if (password.length < 6) errors.password = 'Password must be at least 6 characters';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (email && !emailRegex.test(email)) errors.email = 'Please enter a valid email address';

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const onSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      dispatch(signup(formData));
    }
    else {
      toast.error('Please correct the errors in the form');
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
      <ToastContainer />
      <h2 className="signup-title">Sign Up</h2>
      <form className="signup-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={firstName}
            onChange={onChange}
            required
          />
          {validationErrors.firstName && (
            <span className="error">{validationErrors.firstName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            onChange={onChange}
            required
          />
          {validationErrors.lastName && (
            <span className="error">{validationErrors.lastName}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={onChange}
            required
          />
          {validationErrors.email && (
            <span className="error">{validationErrors.email}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="number">Number</label>
          <div className="number-input">
            <select 
              id="countryCode" 
              name="countryCode" 
              value={countryCode}
              onChange={onChange}
            >
              <option value="+977">+977</option>
              {/* Add more country codes as needed */}
            </select>
            <input
              type="tel"
              id="number"
              name="number"
              value={number}
              onChange={onChange}
              required
            />
          </div>
          {validationErrors.number && (
            <span className="error">{validationErrors.number}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
            <i 
              className='eye-icon' 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </i>
          </div>
          {validationErrors.password && (
            <span className="error">{validationErrors.password}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={onChange}
              required
            />
            <i 
              className='eye-icon' 
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEye /> : <AiFillEyeInvisible />}
            </i>
          </div>
          {validationErrors.confirmPassword && (
            <span className="error">{validationErrors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="signup-button" disabled={isLoading}>
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>

      <p className="login-link">
        Already a member? <Link to="/login" className='login-link'>Login now</Link>
      </p>
    </div>
    </div>

  );
};

export default Signup;