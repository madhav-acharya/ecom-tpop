import React from 'react';
import '../styles/Footer.css'; 
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-bottom">
                <p>&copy; {new Date().getFullYear()} TPOP Online Store. All rights reserved.</p>
            </div>
            <div className="footer-columns">
                <div className="footer-fc">
                    <div className="logo">
                        <Link to="/" className="logo-link">
                            {/* <img src="./logo.webp" alt="logo" /> */}TPOP
                        </Link>
                    </div>
                    <span className="address">
                        Jhapa, Nepal
                    </span>
                    <span className="contact">
                        9841234567
                    </span>
                    <span className="gmail">
                        tpop@gmail.com
                    </span>
                </div>
                <div className="footer-sc">
                    <span className="title">
                        My Account
                    </span>
                    <Link to="/login" className='login-link'>Login</Link>
                    <Link to="/wishlist" className='wishlist-link'>My Wishlist</Link>
                    <Link to="/cart" className='cart-link'>My Cart</Link>
                </div>
                <div className="footer-tc">
                    <span className="title">
                        Follow us on:
                    </span>
                    <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                        <FaFacebook size={35} /> Facebook
                    </a>
                    <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                        <FaInstagram size={35} /> Instagram
                    </a>
                </div>
            </div>
            
        </footer>
    );
};

export default Footer;