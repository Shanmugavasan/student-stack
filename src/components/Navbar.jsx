import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCurrentUser, signOut } from 'aws-amplify/auth';
import { Hub } from 'aws-amplify/utils';
import NotificationBell from './NotificationBell'; // <-- 1. Import the Bell

export default function Navbar() {
  const [session, setSession] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await getCurrentUser();
        setSession(user);
      } catch (error) {
        setSession(null); 
      }
    };
    
    checkUser();

    const unsubscribe = Hub.listen('auth', ({ payload }) => {
      if (payload.event === 'signedIn') checkUser();
      if (payload.event === 'signedOut') setSession(null);
    });

    return () => unsubscribe();
  }, []);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut();
      setIsDropdownOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Get first letter of email for Avatar
  const userInitial = session?.signInDetails?.loginId?.charAt(0).toUpperCase() || 'S';

  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center relative">
        
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight">
          StudentStack<span className="text-blue-200">.io</span>
        </Link>
        
        {/* Navigation Links */}
        <div className="space-x-6 hidden md:flex items-center">
          <Link to="/" className="hover:text-blue-200 font-medium transition-colors">Home</Link>
          <Link to="/jobs" className="hover:text-blue-200 font-medium transition-colors">Jobs</Link>
          <Link to="/housing" className="hover:text-blue-200 font-medium transition-colors">Housing</Link>
          <Link to="/community" className="hover:text-blue-200 font-medium transition-colors">Community</Link>
          
          {session ? (
            // 2. Added Flex container for Bell + Avatar
            <div className="ml-4 pl-4 border-l border-blue-500 flex items-center gap-4">
              
              <NotificationBell />

              <div className="relative" ref={dropdownRef}>
                {/* Avatar Button */}
                <button 
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-10 h-10 rounded-full bg-blue-800 text-white font-black flex items-center justify-center border-2 border-blue-400 hover:border-white transition-all shadow-sm focus:outline-none"
                >
                  {userInitial}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-gray-50 bg-gray-50/50">
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">Signed in as</p>
                      <p className="text-sm font-bold truncate">{session.signInDetails?.loginId}</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      <Link onClick={() => setIsDropdownOpen(false)} to="/dashboard" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors text-sm">
                        📊 Dashboard
                      </Link>
                      <Link onClick={() => setIsDropdownOpen(false)} to="/profile" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors text-sm">
                        👤 My Profile
                      </Link>
                      <Link onClick={() => setIsDropdownOpen(false)} to="/settings" className="px-4 py-2 hover:bg-blue-50 hover:text-blue-600 rounded-xl font-medium transition-colors text-sm">
                        ⚙️ Settings
                      </Link>
                    </div>
                    <div className="p-2 border-t border-gray-50">
                      <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-rose-600 rounded-xl font-medium transition-colors text-sm">
                        Log out
                      </button>
                    </div>
                  </div>
                )}
              </div>
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