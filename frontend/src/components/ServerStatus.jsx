import React, { useEffect, useState } from 'react';
import { MdOutlineWifiOff } from "react-icons/md";
import { FaWifi } from "react-icons/fa";

const ServerStatus = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [showStatus, setShowStatus] = useState(true);

  const BACKEND_URL = process.env.REACT_APP_API_URL;

  const checkServer = async () => {
    try {
      const res = await fetch(BACKEND_URL);
      if (res.ok) {
        setIsConnected(true);
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 2000);
      } else {
        throw new Error('Server not ok');
      }
    } catch (err) {
      setIsConnected(false);
      setShowStatus(true);
    }
  };

  useEffect(() => {
    checkServer();

    const interval = setInterval(() => {
      checkServer();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (!showStatus) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 70,
        left: 10,
        padding: '1rem 2rem',
        backgroundColor: 'black',
        color: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}
    >
      {isConnected ? (
        <>
          <FaWifi /> <span>Server Connected</span>
        </>
      ) : (
        <>
          <MdOutlineWifiOff /> <span>Server Not Connected</span>
        </>
      )}
    </div>
  );
};

export default ServerStatus;
