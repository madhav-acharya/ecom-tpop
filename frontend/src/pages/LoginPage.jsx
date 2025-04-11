import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Login from '../components/Login';

const LoginPage = () => {
  return (
    <div className="login-page">
        <Header />
        <div className="content">
            <Login />
        </div>
        <Footer />
    </div>
  )
}

export default LoginPage;