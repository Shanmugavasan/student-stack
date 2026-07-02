import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeFilter, setActiveFilter] = useState('all');

  // Logic to handle "Intelligence" - this would eventually fetch from your DB
  // For now, we mock the categorized results
  const results = {
    jobs: [
      { id: 1, title: 'AI Research Intern', company: 'DeepMind', location: 'London', type: 'Full-time', sponsorship: true },
      { id: 2, title: 'Data Analyst (Part-time)', company: 'TechStart', location: 'Norwich', type: 'Part-time', sponsorship: false },
    ],
    blogs: [
      { id: 'visa-2026', title: 'Top UK Companies Sponsoring Visas 2026', category: 'Careers' },
    ],
    tools: [
      { name: 'GPA Calculator', description: 'Calculate UK/US/India scores', icon: '📊' }
    ]
  };

  return (
    <div className="max-w-6xl mx-auto py-10">
      {/* Header Area */}
      <div className="mb-12">
        <h1 className="text-sm font-black uppercase tracking-widest text-gray-400 mb-2">Search Results for</h1>
        <h2 className="text-4xl font-black text-gray-900 italic">"{query}"</h2>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-12 border-b border-gray-100 pb-4 overflow-x-auto">
        {['all', 'jobs', 'guides', 'tools'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={`px-6 py-2 rounded-full text-sm font-bold capitalize transition-all ${
              activeFilter === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-900'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Results Area */}
        <div className="lg:col-span-3 space-y-12">
          
          {/* JOBS SECTION */}
          {(activeFilter === 'all' || activeFilter === 'jobs') && (
            <section>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                💼 Jobs in {query || 'UK'} <span className="text-sm font-normal text-gray-400">({results.jobs.length})</span>
              </h3>
              <div className="space-y-4">
                {results.jobs.map(job => (
                  <div key={job.id} className="p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-400 transition-all shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg">{job.title}</h4>
                        <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                      </div>
                      {job.sponsorship && (
                        <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">Visa Sponsor</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* BLOGS/GUIDES SECTION */}
          {(activeFilter === 'all' || activeFilter === 'guides') && (
            <section>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                📚 Community Guides <span className="text-sm font-normal text-gray-400">({results.blogs.length})</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.blogs.map(blog => (
                  <Link to={`/community/${blog.id}`} key={blog.id} className="p-6 bg-gray-50 rounded-3xl hover:bg-white border border-transparent hover:border-rose-200 transition-all">
                    <span className="text-[10px] font-black text-rose-500 uppercase mb-2 block">{blog.category}</span>
                    <h4 className="font-bold">{blog.title}</h4>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar: Relevant Tools */}
        <div className="space-y-6">
          <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest">Suggested Tools</h3>
          {results.tools.map(tool => (
            <div key={tool.name} className="p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/20">
              <span className="text-3xl mb-4 block">{tool.icon}</span>
              <h4 className="font-bold text-lg mb-1">{tool.name}</h4>
              <p className="text-xs text-blue-100 mb-4">{tool.description}</p>
              <button className="w-full py-2 bg-white text-blue-600 rounded-xl text-xs font-black">Open Tool</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}