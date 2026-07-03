import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeFilter, setActiveFilter] = useState('all');
  
  // State for our live data
  const [liveJobs, setLiveJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Mock static data for community guides and tools
  const staticBlogs = [
    { id: 'visa-sponsorship-2026', title: 'Top UK Companies Sponsoring Visas 2026', category: 'Careers' },
    { id: 'dropshipping-visa', title: 'Can I do Dropshipping on a Student Visa?', category: 'Legal' },
    { id: 'monzo-vs-revolut', title: 'Monzo vs Revolut: Best Student Bank', category: 'Finance' },
  ];

  const staticTools = [
    { name: 'GPA Calculator', description: 'Calculate UK/US/India scores', icon: '📊', link: '/jobs' },
    { name: 'CV SmartMatch AI', description: 'Score your CV against job posts', icon: '🤖', link: '/jobs' },
    { name: 'Housing Map', description: 'Find student accommodation', icon: '🏠', link: '/housing' }
  ];

  // 1. Fetch live jobs whenever the search query changes
  useEffect(() => {
    const fetchLiveSearchResults = async () => {
      setIsLoading(true);
      
      const APP_ID = 'b6a13fad'; 
      const APP_KEY = '0b2814ed931408919f1a5ad45f87e697';
      
      // We pass the user's query directly into the 'what' parameter
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${encodeURIComponent(query)}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Search failed");
        const data = await response.json();
        
        // Map Adzuna data to match our UI format
        const formattedJobs = data.results.map(job => ({
          id: job.id,
          title: job.title,
          company: job.company.display_name,
          location: job.location.display_name,
          url: job.redirect_url,
          // Simple logic: if description mentions "visa" or "sponsor", flag it
          sponsorship: job.description.toLowerCase().includes('sponsor') || job.description.toLowerCase().includes('visa')
        }));
        
        setLiveJobs(formattedJobs);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        setLiveJobs([]); // Fallback to empty if it fails
      } finally {
        setIsLoading(false);
      }
    };

    if (query) {
      fetchLiveSearchResults();
    } else {
      setIsLoading(false);
    }
  }, [query]);

  // 2. Filter our static content based on the query
  const q = query.toLowerCase();
  const filteredBlogs = staticBlogs.filter(b => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q));
  const filteredTools = staticTools.filter(t => t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q));

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
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
                💼 Jobs <span className="text-sm font-normal text-gray-400">({liveJobs.length})</span>
              </h3>
              
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map(n => (
                    <div key={n} className="h-24 bg-gray-100 rounded-3xl"></div>
                  ))}
                </div>
              ) : liveJobs.length === 0 ? (
                <p className="text-gray-500 italic">No jobs found for "{query}". Try a broader term.</p>
              ) : (
                <div className="space-y-4">
                  {liveJobs.map(job => (
                    <a href={job.url} target="_blank" rel="noreferrer" key={job.id} className="block p-6 bg-white border border-gray-100 rounded-3xl hover:border-blue-400 transition-all shadow-sm group">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors">{job.title}</h4>
                          <p className="text-gray-500 text-sm">{job.company} • {job.location}</p>
                        </div>
                        {job.sponsorship && (
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-2 py-1 rounded-md uppercase">Visa Sponsor</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* BLOGS/GUIDES SECTION */}
          {(activeFilter === 'all' || activeFilter === 'guides') && (
            <section>
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                📚 Community Guides <span className="text-sm font-normal text-gray-400">({filteredBlogs.length})</span>
              </h3>
              {filteredBlogs.length === 0 ? (
                <p className="text-gray-500 italic">No guides found for "{query}".</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredBlogs.map(blog => (
                    <Link to={`/community/${blog.id}`} key={blog.id} className="p-6 bg-gray-50 rounded-3xl hover:bg-white border border-transparent hover:border-rose-200 transition-all">
                      <span className="text-[10px] font-black text-rose-500 uppercase mb-2 block">{blog.category}</span>
                      <h4 className="font-bold text-gray-800">{blog.title}</h4>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Sidebar: Relevant Tools */}
        {(activeFilter === 'all' || activeFilter === 'tools') && (
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase text-gray-400 tracking-widest flex justify-between items-center">
              Suggested Tools <span className="text-gray-300">({filteredTools.length})</span>
            </h3>
            {filteredTools.map(tool => (
              <div key={tool.name} className="p-6 bg-blue-600 text-white rounded-[2rem] shadow-xl shadow-blue-500/20">
                <span className="text-3xl mb-4 block">{tool.icon}</span>
                <h4 className="font-bold text-lg mb-1">{tool.name}</h4>
                <p className="text-xs text-blue-100 mb-4">{tool.description}</p>
                <Link to={tool.link} className="block text-center w-full py-2 bg-white text-blue-600 rounded-xl text-xs font-black hover:bg-blue-50 transition-colors">
                  Open Tool
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}