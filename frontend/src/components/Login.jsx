import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { reset } from '../app/features/auth/authSlice';
import { login } from '../app/api/authAPI';
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import '../styles/Login.css';
import { ToastContainer, toast } from 'react-toastify';

const Login = () => {
    const [formData, setFormData] = useState({
        emailOrPhone: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user, isLoading, isError, isSuccess, errorMessage } = useSelector((state) => state.auth);


    useEffect(() => {
        if (isSuccess && user) {
            toast.success('Login successful');
            setTimeout(() => {
                window.location.href = '/';
                // navigate('/');
                setTimeout(() => {
                    toast.success('Login successful');
                }, 20);
                // setTimeout(() => {
                //     window.location.reload();
                // }
                // , 1000);
            }, 1000);
            
        }
        else if (isError) {
            toast.error(errorMessage);
        }

        return () => {
            dispatch(reset());
        };
    }, [user, isSuccess, dispatch, navigate]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const validateForm = () => {
        const errors = {};
        const { emailOrPhone, password } = formData;

        if (!emailOrPhone.trim()) {
            errors.emailOrPhone = 'Email or phone number is required';
        } else {
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            const phoneRegex = /^[0-9]{10,15}$/; // Allows 10-15 digit phone numbers

            if (!emailRegex.test(emailOrPhone) && !phoneRegex.test(emailOrPhone)) {
                errors.emailOrPhone = 'Enter a valid email or phone number';
            }
        }

        if (!password.trim()) {
            errors.password = 'Password is required';
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const onSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            dispatch(login(formData)); 
        }
    };

    return (
        <div className="logins">
        <div className="login-container">
            <ToastContainer />
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={onSubmit}>
                <div className="form-group">
                    <label htmlFor="emailOrPhone">Email or Phone Number</label>
                    <input
                        type="text"
                        id="emailOrPhone"
                        name="emailOrPhone"
                        value={formData.emailOrPhone}
                        onChange={onChange}
                        required
                    />
                    {validationErrors.emailOrPhone && (
                        <span className="error">{validationErrors.emailOrPhone}</span>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="password-input">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            name="password"
                            value={formData.password}
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

                <button type="submit" className="login-button" disabled={isLoading}>
                    {isLoading ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <p className="signup-link">
                Don't have an account? <Link to="/signup" className='signup-link'>Sign up now</Link>
            </p>
        </div>
        </div>
    );
};

export default Login;
