import React from 'react';
import StudentBlogs from '../components/StudentBlogs';
import QnaForum from '../components/QnaForum';

export default function CommunityPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-16 pb-20">
      {/* 1. Community Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-black text-gray-900 tracking-tight">The Student <span className="text-blue-600">Stack</span> Community</h1>
        <p className="text-gray-500 max-w-xl mx-auto font-medium">
          Expert career guides, legal advice for international students, and a peer-to-peer Q&A forum.
        </p>
      </div>

      {/* 2. Articles Section (Crucial for AdSense) */}
      <section>
        <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
          <h2 className="text-2xl font-black text-gray-800">Featured Guides</h2>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full">New Content</span>
        </div>
        <StudentBlogs />
      </section>

      {/* 3. Forum Section */}
      <section className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-gray-800">Student Q&A Forum</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">Get answers from fellow students in the UK.</p>
        </div>
        <QnaForum />
      </section>
    </div>
  );
}