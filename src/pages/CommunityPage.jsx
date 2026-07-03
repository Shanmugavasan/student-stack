import React, { useState } from 'react';
import StudentBlogs from '../components/StudentBlogs';
import QnaForum from '../components/QnaForum';
import LiveLounge from '../components/LiveLounge'; // Our new chat component

export default function CommunityPage() {
  // State to track which tab the user is viewing
  const [activeTab, setActiveTab] = useState('forums'); 

  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 mt-8">
      
      {/* 1. Community Header & Navigation */}
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">The Student <span className="text-blue-600">Stack</span> Community</h1>
          <p className="text-gray-500 max-w-xl mx-auto font-medium mt-4">
            Read expert career guides, ask questions in the forum, or network in real-time.
          </p>
        </div>

        {/* The Toggle Switch */}
        <div className="inline-flex bg-gray-100 p-1.5 rounded-full border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('forums')}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${activeTab === 'forums' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            📚 Guides & Forums
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 ${activeTab === 'live' ? 'bg-white text-rose-600 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'live' ? 'bg-rose-500 animate-pulse' : 'bg-gray-400'}`}></div>
            Live Lounge
          </button>
        </div>
      </div>

      {/* 2. Conditional Rendering based on Tab */}
      {activeTab === 'forums' ? (
        <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Articles Section */}
          <section>
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black text-gray-800">Featured Guides</h2>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">New Content</span>
            </div>
            <StudentBlogs />
          </section>

          {/* Forum Section */}
          <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-gray-800">Student Q&A Forum</h2>
              <p className="text-sm text-gray-400 mt-1 font-medium">Get answers from fellow students in the UK.</p>
            </div>
            <QnaForum />
          </section>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
           {/* Live Chat Section */}
           <LiveLounge />
        </div>
      )}
      
    </div>
  );
}