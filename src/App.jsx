import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; 
import Home from './pages/Home';
import JobsPage from './pages/JobsPage';
import CommunityPage from './pages/CommunityPage';
import Accommodation from './components/Accommodation';
import Login from './pages/Login';
import DynamicJobPage from './pages/DynamicJobPage';
import Dashboard from './pages/Dashboard';
import Privacy from './pages/Privacy';
import About from './pages/About';
import Contact from './pages/Contact';


// New Dynamic Blog Pages
import WriteBlog from './pages/WriteBlog';
import DynamicBlogPage from './pages/DynamicBlogPage';

import SearchOverlay from './components/SearchOverlay'; 
import SearchResultsPage from './pages/SearchResultsPage';

import Profile from './pages/Profile';




export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && !isSearchOpen) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  return (
    <Router>
      <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
        <Navbar />

        {/* Global Search Bar */}
        <div className="bg-white shadow-sm border-b border-gray-100 py-12 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-black mb-6 text-gray-900 tracking-tight">Find Your Future Today</h2>
            
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="max-w-2xl mx-auto relative group cursor-pointer"
            >
              <div className="w-full p-5 pl-14 rounded-full border-2 border-blue-100 bg-gray-50 shadow-sm group-hover:border-blue-500 group-hover:bg-white group-hover:shadow-xl group-hover:shadow-blue-500/10 transition-all text-lg text-left text-gray-400 font-medium">
                Search scholarships, jobs, housing, or tools...
              </div>
              <span className="absolute left-6 top-6 text-gray-400 text-xl group-hover:text-blue-600 transition-colors">🔍</span>
              
              <div className="absolute right-6 top-6 hidden md:block">
                <span className="text-[10px] font-black text-gray-300 border border-gray-200 px-2 py-1 rounded-lg bg-white shadow-sm">PRESS /</span>
              </div>
            </div>
          </div>
        </div>

        <main className="container mx-auto px-4 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:category/:location" element={<DynamicJobPage />} />
            <Route path="/housing" element={<Accommodation />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/search" element={<SearchResultsPage />} />
            
            {/* Community Routes */}
            <Route path="/community/write" element={<WriteBlog />} />
            
            {/* The Dynamic Route catches everything else (e.g. /community/12345-abc) */}
            <Route path="/community/:blogId" element={<DynamicBlogPage />} />

            
// ...
<Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        <Footer />

        <SearchOverlay 
          isOpen={isSearchOpen} 
          onClose={() => setIsSearchOpen(false)} 
        />
      </div>
    </Router>
  );
}