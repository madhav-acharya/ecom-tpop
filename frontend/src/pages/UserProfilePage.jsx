import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProfile from '../components/UserProfile';

const UserProfilePage = () => {
  return (
    <div className="userprofile-page">
        <Header />
        <div className="content">
            <UserProfile />
        </div>
        <Footer />
    </div>
  )
}

export default UserProfilePage