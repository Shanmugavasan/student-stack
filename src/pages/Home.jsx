import React from 'react';
import DownloadHub from '../components/DownloadHub';

export default function Home() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <section id="scholarships">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold border-l-4 border-blue-600 pl-3">Featured Scholarships</h3>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
              <h4 className="font-bold text-lg text-gray-800">STEM Excellence Grant 2026</h4>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">$10,000</span>
            </div>
            <p className="text-gray-600 text-sm mt-2">Open to all 2nd-year Engineering and Computer Science students.</p>
            <button className="mt-4 text-blue-600 font-semibold text-sm">Apply Now &nearr;</button>
          </div>
        </section>
      </div>
      <aside className="space-y-6">
        <DownloadHub />
        <div className="bg-gray-200 border-2 border-dashed border-gray-400 text-gray-500 text-center p-6 rounded-lg font-mono h-64 flex items-center justify-center">
          [Sidebar Ad]
        </div>
      </aside>
    </div>
  );
}