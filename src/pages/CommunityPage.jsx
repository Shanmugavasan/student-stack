import React, { useState } from 'react';
import StudentBlogs from '../components/StudentBlogs';
import QnaForum from '../components/QnaForum';
import LiveLounge from '../components/LiveLounge';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('forums'); 

  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 mt-8 px-4 sm:px-6 lg:px-8">
      
      {/* 1. Community Header & Navigation */}
      <div className="text-center space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
            The Student <span className="text-blue-600">Stack</span> Community
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-medium mt-4 text-lg">
            Read expert career guides, ask questions in the forum, or network in real-time.
          </p>
        </div>

        <div className="inline-flex bg-gray-100 p-1.5 rounded-full border border-gray-200 shadow-inner">
          <button 
            onClick={() => setActiveTab('forums')}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all ${
              activeTab === 'forums' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            📚 Guides & Forums
          </button>
          <button 
            onClick={() => setActiveTab('live')}
            className={`px-8 py-2.5 rounded-full text-sm font-black transition-all flex items-center gap-2 ${
              activeTab === 'live' 
                ? 'bg-white text-rose-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activeTab === 'live' ? 'bg-rose-500 animate-pulse' : 'bg-gray-400'}`}></div>
            Live Lounge
          </button>
        </div>
      </div>

      {/* 2. Conditional Rendering based on Tab */}
      {activeTab === 'forums' ? (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
            
            {/* LEFT COLUMN: Master Guides */}
            <div className="lg:col-span-7 xl:col-span-8 space-y-8">
              <section>
                {/* The StudentBlogs component handles its own header now */}
                <StudentBlogs />
              </section>
            </div>

            {/* RIGHT COLUMN: Q&A Forum */}
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="sticky top-24 bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40">
                {/* The QnaForum component handles its own header now */}
                <div className="mt-[-1rem]"> 
                  <QnaForum />
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
           <LiveLounge />
        </div>
      )}
      
    </div>
  );
}