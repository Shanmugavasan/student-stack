import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchOverlay({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      // Shortcut: Allow user to press '/' anywhere to search
      if (e.key === '/' && !isOpen) {
        e.preventDefault();
        // This logic would need to be in App.jsx actually, but good to keep in mind!
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isOpen]);

  if (!isOpen) return null;
  // Inside SearchOverlay.jsx
const handleKeyDown = (e) => {
  if (e.key === 'Enter') {
    onClose();
    navigate(`/search?q=${query}`);
  }
};

  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center pt-12 md:pt-24 px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300" 
        onClick={onClose} 
      />

      {/* The Plate */}
      <div className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-top-4 duration-300">
        
        {/* Search Header */}
        <div className="p-6 md:p-8 flex items-center gap-4 border-b">
          <span className="text-3xl">🔍</span>
          <input 
            autoFocus
            type="text" 
            className="w-full text-2xl md:text-3xl font-bold outline-none placeholder:text-gray-200"
            placeholder="What are you looking for?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={onClose} className="text-4xl font-light text-gray-300 hover:text-gray-900 transition-colors">&times;</button>
        </div>

        {/* Intelligent Categories (Frontend Mockup) */}
        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-12 max-h-[60vh] overflow-y-auto">
          
          {/* Section: Top Hits */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-6">Top Matches</h4>
            <div className="space-y-6">
              <div className="group cursor-pointer">
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">UK Visa Sponsorship 2026 Guide</p>
                <p className="text-sm text-gray-400 line-clamp-1">Expert guide on sponsorship for international students...</p>
              </div>
              <div className="group cursor-pointer">
                <p className="font-bold text-gray-900 group-hover:text-blue-600 transition">Part-time Data Analyst</p>
                <p className="text-sm text-gray-400 line-clamp-1">Remote • £15-£20/hr • TechStart UK</p>
              </div>
            </div>
          </div>

          {/* Section: Navigation / Tools */}
          <div>
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-6">Jump To</h4>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100">
                <span className="block text-lg mb-1">📊</span>
                <span className="text-xs font-bold text-gray-700">GPA Tool</span>
              </button>
              <button className="p-4 bg-gray-50 rounded-2xl text-left hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100">
                <span className="block text-lg mb-1">🏠</span>
                <span className="text-xs font-bold text-gray-700">Housing</span>
              </button>
            </div>
          </div>

        </div>

        {/* Results Footer */}
        <div className="p-6 bg-gray-50 flex justify-between items-center px-12">
          <p className="text-xs font-medium text-gray-400">Type "Visa" or "Norwich" to see intelligent results</p>
          <button 
            className="text-sm font-black text-blue-600 hover:underline"
            onClick={() => navigate(`/search?q=${query}`)}
          >
            See All Results →
          </button>
        </div>
      </div>
    </div>
  );
}