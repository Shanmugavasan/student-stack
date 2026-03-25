import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import CvMatcher from '../components/CvMatcher';

export default function DynamicJobPage() {
  const { category, location } = useParams();
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Format text for display (e.g., "data-science" -> "Data Science")
  const formatText = (text) => {
    if (!text) return '';
    return text.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const displayCategory = formatText(category);
  const displayLocation = formatText(location);

  // Set the browser tab title for Google SEO
  useEffect(() => {
    document.title = `Best ${displayCategory} Jobs in ${displayLocation} | StudentStack`;
  }, [displayCategory, displayLocation]);

  // Fetch the jobs whenever the URL changes
  useEffect(() => {
    const fetchDynamicJobs = async () => {
      setIsLoading(true);
      
      // Replace these with your actual Adzuna keys later (or use import.meta.env)
      const APP_ID = 'YOUR_APP_ID'; 
      const APP_KEY = 'YOUR_APP_KEY';
      
      // We inject the URL parameters directly into the 'what' and 'where' API fields!
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=10&what=${category.replace('-', ' ')}&where=${location.replace('-', ' ')}`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API Key needed");
        const data = await response.json();
        setJobs(data.results);
      } catch (error) {
        // Fallback dummy data if the API keys aren't set up yet
        console.log("Using fallback data for:", displayCategory, displayLocation);
        setJobs([
          { id: '101', title: `Junior ${displayCategory} Engineer`, company: { display_name: 'Tech Innovators UK' }, location: { display_name: displayLocation }, created: new Date().toISOString(), redirect_url: '#' },
          { id: '102', title: `Graduate ${displayCategory} Analyst`, company: { display_name: 'Global Data Corp' }, location: { display_name: displayLocation }, created: new Date().toISOString(), redirect_url: '#' },
          { id: '103', title: `${displayCategory} Placement (Summer 2026)`, company: { display_name: 'Startup Hub' }, location: { display_name: displayLocation }, created: new Date().toISOString(), redirect_url: '#' }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDynamicJobs();
  }, [category, location]); // This array tells React to re-run the fetch if the URL changes!

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
      
      <div className="lg:col-span-2 space-y-8">
        {/* Dynamic SEO Header */}
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
            {displayCategory} Roles in <span className="text-blue-600">{displayLocation}</span>
          </h1>
          <p className="text-gray-600">
            Showing the latest graduate, placement, and entry-level opportunities for {displayCategory} students in {displayLocation}.
          </p>
        </div>

        {/* Dynamic Job Feed */}
        <div className="space-y-4">
          {isLoading ? (
            // Loading Skeleton
            <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse flex items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
              <div className="space-y-2 flex-grow">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100 text-gray-500">
              No recent roles found matching these exact criteria. Try broadening your search!
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job.id} className="bg-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center shadow-sm border border-gray-100 hover:border-blue-200 transition">
                <div className="h-12 w-12 bg-blue-50 rounded-lg flex items-center justify-center text-xl mr-4 text-blue-500 mb-4 sm:mb-0 shrink-0">💼</div>
                <div className="flex-grow">
                  <h4 className="font-bold text-gray-800 text-lg">{job.title}</h4>
                  <p className="text-sm text-gray-500 mt-1">
                    <span className="font-medium text-gray-700">{job.company.display_name}</span> &bull; 📍 {job.location?.display_name || displayLocation} &bull; Added {formatDate(job.created)}
                  </p>
                </div>
                <a href={job.redirect_url} target="_blank" rel="noreferrer" className="mt-4 sm:mt-0 text-center bg-gray-50 border border-gray-200 px-6 py-2 rounded-lg text-sm font-bold hover:bg-blue-600 hover:text-white transition">
                  Apply
                </a>
              </div>
            ))
          )}
        </div>
        
        <div className="text-center mt-8">
          <Link to="/jobs" className="text-blue-600 font-bold hover:underline inline-flex items-center gap-2">
            &larr; Back to all jobs
          </Link>
        </div>
      </div>

      <aside className="space-y-6">
        <CvMatcher />
        <div className="bg-gray-200 border-2 border-dashed border-gray-400 text-gray-500 text-center p-6 rounded-lg font-mono h-64 flex items-center justify-center">
          [Highly Targeted Ad Space]
        </div>
      </aside>
      
    </div>
  );
}