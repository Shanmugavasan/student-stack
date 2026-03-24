import React, { useState } from 'react';
import Navbar from './components/Navbar';
import JobListings from './components/JobListings';
import GpaCalculator from './components/GpaCalculator';
import CvMatcher from './components/CvMatcher';

export default function App() {
  const [query, setQuery] = useState('');

  return (
    <div className="bg-gray-50 text-gray-900 font-sans min-h-screen">
      <Navbar />

      {/* Top Header Ad */}
      <div className="container mx-auto px-4 my-6">
        <div className="bg-gray-200 border-2 border-dashed border-gray-400 text-gray-500 text-center p-6 rounded-lg font-mono">
          [AdSense/Mediavine Horizontal Leaderboard - 728x90]
        </div>
      </div>

      <main className="container mx-auto px-4 py-4">
        {/* Search & Filter Section */}
        <section className="mb-12 text-center">
          <h2 className="text-4xl font-extrabold mb-4">Find Your Future Today</h2>
          <div className="max-w-2xl mx-auto relative">
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search scholarships, jobs, or tools..." 
              className="w-full p-4 pl-12 rounded-full border-2 border-blue-100 shadow-sm focus:outline-none focus:border-blue-500 transition-all text-lg"
            />
            <span className="absolute left-5 top-5 text-gray-400 text-xl">🔍</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN: Aggregators */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Static Scholarships Section (Can be extracted to a component later!) */}
            <section id="scholarships">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold border-l-4 border-blue-600 pl-3">New Scholarships</h3>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-lg text-gray-800">STEM Excellence Grant 2026</h4>
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">$10,000</span>
                </div>
                <p className="text-gray-600 text-sm mt-2">Open to all 2nd-year Engineering and Computer Science students.</p>
                <button className="mt-4 text-blue-600 font-semibold text-sm hover:underline">Apply Now &nearr;</button>
              </div>
            </section>

            <JobListings />
          </div>

          {/* RIGHT COLUMN: Tools & Sidebar */}
          <aside className="space-y-6" id="tools">
            <CvMatcher />
            <GpaCalculator />
            
            {/* Sidebar Ad */}
            <div className="bg-gray-200 border-2 border-dashed border-gray-400 text-gray-500 text-center p-6 rounded-lg font-mono h-64 flex items-center justify-center">
              [Sidebar Sticky Ad - 300x600]
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}