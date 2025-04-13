import React, { useEffect, useState } from 'react';
import { MdOutlineWifiOff } from "react-icons/md";
import { FaWifi } from "react-icons/fa";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showStatus, setShowStatus] = useState(true);

  useEffect(() => {
    let timeoutId;
    if (navigator.onLine) {
      timeoutId = setTimeout(() => {
        setShowStatus(false);
      }, 2000);
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowStatus(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showStatus) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        left: 10,
        padding: '1rem 3rem',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 100000000000000,
      }}
    >
      {isOnline ? (
        <div className='net-popup'><FaWifi /> Back Online</div>
      ) : (
        <div className='net-popup'><MdOutlineWifiOff /> You are Offline</div>
      )}
    </div>
  );
};

export default NetworkStatus;
