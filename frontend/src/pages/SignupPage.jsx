import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Signup from '../components/Signup';

const SignupPage = () => {
  return (
    <div className="signup-page">
        <Header />
        <div className="content">
            <Signup />
        </div>
        <Footer />
    </div>
  )
}

export default SignupPage;