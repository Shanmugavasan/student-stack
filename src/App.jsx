import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'; // <-- 1. Import Footer
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

export default function App() {
  return (
    <Router>
      {/* 2. Added flex-col and min-h-screen to pin footer to bottom */}
      <div className="bg-gray-50 text-gray-900 font-sans min-h-screen flex flex-col">
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

        {/* 3. Changed <main> to flex-grow so it pushes the footer down */}
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
          </Routes>
        </main>

        {/* 4. Footer stays outside <main> and <Routes> */}
        <Footer />
      </div>
    </Router>
  );
}