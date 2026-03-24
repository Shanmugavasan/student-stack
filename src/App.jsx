import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import JobsPage from './pages/JobsPage';
import CommunityPage from './pages/CommunityPage';
import Accommodation from './components/Accommodation';
import Login from './pages/Login'; // <-- 1. Import the Login Page

export default function App() {
  return (
    <Router>
      <div className="bg-gray-50 text-gray-900 font-sans min-h-screen pb-12">
        <Navbar />

        {/* Global Search Bar */}
        <div className="bg-white shadow-sm border-b border-gray-100 py-8 mb-8">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-extrabold mb-4">Find Your Future Today</h2>
            <div className="max-w-2xl mx-auto relative">
              <input 
                type="text" 
                placeholder="Search scholarships, jobs, housing, or tools..." 
                className="w-full p-4 pl-12 rounded-full border-2 border-blue-100 shadow-sm focus:outline-none focus:border-blue-500 transition-all text-lg"
              />
              <span className="absolute left-5 top-5 text-gray-400 text-xl">🔍</span>
            </div>
          </div>
        </div>

        {/* Router Setup */}
        <main className="container mx-auto px-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/housing" element={<Accommodation />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/login" element={<Login />} /> {/* <-- 2. Add the Route */}
          </Routes>
        </main>
        
      </div>
    </Router>
  );
}