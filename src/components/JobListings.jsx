import React, { useState, useEffect } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// Add your API Gateway URL here
const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function JobListings() {
// ...
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);
  const [user, setUser] = useState(null); // <--- ADD THIS LINE
  const [savingId, setSavingId] = useState(null);
// ...
  // 1. Get jobs and check auth status on load
  useEffect(() => {
    // Check if user is logged in via Amplify
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser); // This sets the 'user' variable that handleSaveJob needs!
      } catch (err) {
        setUser(null);
      }
    };
    checkUser();

    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      // Replace with your actual Adzuna keys
      const APP_ID = 'b6a13fad'; 
      const APP_KEY = '0b2814ed931408919f1a5ad45f87e697';
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=internship`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API Key needed");
        const data = await response.json();
        setJobs(data.results);
      } catch (error) {
        // Fallback data
        setJobs([
          { id: '1', title: 'Marketing Intern (Summer 2026)', company: { display_name: 'Red Bull' }, location: { display_name: 'London' }, created: '2026-03-24T10:00:00Z', redirect_url: '#' },
          { id: '2', title: 'Junior Front-End Developer', company: { display_name: 'TechWave' }, location: { display_name: 'Manchester' }, created: '2026-03-23T14:30:00Z', redirect_url: '#' },
          { id: '3', title: 'Data Analyst Placement', company: { display_name: 'Aviva' }, location: { display_name: 'Norwich' }, created: '2026-03-22T09:15:00Z', redirect_url: '#' }
        ]);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

  // 2. The Save Function
  const handleSaveJob = async (job) => {
  console.log("Save button clicked for:", job.id); // Add this
  
  if (!user) {
    alert("Please log in to save jobs!");
    return;
  }

  setSavingId(job.id);
  try {
    const { tokens } = await fetchAuthSession();
    const token = tokens.idToken.toString();
    console.log("Token acquired:", !!token); // Check if we actually have a token

    const response = await fetch(`${API_URL}/jobs`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jobId: job.id,
        jobTitle: job.title,
        company: job.company.display_name,
        location: job.location?.display_name || 'UK',
        url: job.redirect_url
      })
    });

    console.log("Response status:", response.status); // Check if API Gateway is responding
    
    if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", errorText); // This will show you exactly why it's failing
        throw new Error("Failed to save");
    }
    
    alert(`"${job.title}" saved!`);
  } catch (error) {
    console.error("Full Save Error:", error); // Logs the full crash
    alert("Could not save the job. Check the console for details.");
  } finally {
    setSavingId(null);
  }
};

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <section id="jobs">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold border-l-4 border-orange-500 pl-3">Latest Internships & Jobs</h3>
      </div>
      <div className="space-y-4">
        {isLoadingJobs ? (
          <div className="p-5 bg-white rounded-xl shadow-sm border border-gray-100 animate-pulse flex items-center">
            <div className="h-12 w-12 bg-gray-200 rounded-lg mr-4"></div>
            <div className="space-y-2 flex-grow">
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="bg-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center shadow-sm border border-gray-100 hover:border-orange-200 transition">
              <div className="h-12 w-12 bg-orange-50 rounded-lg flex items-center justify-center text-xl mr-4 text-orange-500 mb-4 sm:mb-0 shrink-0">💼</div>
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800">{job.title}</h4>
                <p className="text-xs text-gray-500 mt-1">
                  <span className="font-medium text-gray-700">{job.company.display_name}</span> &bull; 📍 {job.location?.display_name || 'UK'} &bull; Added {formatDate(job.created)}
                </p>
              </div>
              
              <div className="mt-4 sm:mt-0 flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={() => handleSaveJob(job)}
                  disabled={savingId === job.id}
                  className="flex-1 sm:flex-none text-center bg-white border border-gray-200 px-4 py-2 rounded-lg text-sm font-bold text-gray-600 hover:bg-gray-50 hover:text-orange-500 transition disabled:opacity-50"
                >
                  {savingId === job.id ? '...' : '♡ Save'}
                </button>
                <a 
                  href={job.redirect_url} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 sm:flex-none text-center bg-gray-50 border border-gray-200 px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition"
                >
                  Apply
                </a>
              </div>

            </div>
          ))
        )}
      </div>
    </section>
  );
}