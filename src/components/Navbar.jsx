import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';

export default function Navbar() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // 1. Check if user is logged in when the navbar first loads
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setSession(user);
      } catch (error) {
        // getCurrentUser throws an error if no one is logged in, so we catch it and set null
        setSession(null); 
      }
    };
    
    checkUser();

    // 2. Listen for global auth changes (like when they log in or out from the AuthBox)
    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      switch (payload.event) {
        case 'signedIn':
          checkUser();
          break;
        case 'signedOut':
          setSession(null);
          break;
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          StudentStack<span className="text-blue-200">.io</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex items-center">
          <Link to="/" className="hover:text-blue-200 font-medium">Home</Link>
          <Link to="/jobs" className="hover:text-blue-200 font-medium">Jobs</Link>
          <Link to="/housing" className="hover:text-blue-200 font-medium">Housing</Link>
          <Link to="/community" className="hover:text-blue-200 font-medium">Community</Link>
          
          {/* Dynamic Login / Logout / Dashboard Section */}
          {session ? (
            <div className="flex items-center gap-4 ml-4 pl-4 border-l border-blue-500">
              <Link to="/dashboard" className="text-sm font-bold text-blue-100 hover:text-white transition">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="bg-blue-700 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-800 transition shadow-sm ml-2">
                Logout
              </button>
            </div>
          ) : (
            <div className="ml-4 pl-4 border-l border-blue-500">
              <Link to="/login" className="bg-white text-blue-600 px-5 py-2 rounded-lg font-bold hover:bg-blue-50 transition shadow-sm">
                Login
              </Link>
            </div>
          )}
        </div>
        
      </div>
    </nav>
  );
}