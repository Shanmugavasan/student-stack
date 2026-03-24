import React, { useState, useEffect } from 'react';

export default function JobListings() {
  const [jobs, setJobs] = useState([]);
  const [isLoadingJobs, setIsLoadingJobs] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoadingJobs(true);
      const APP_ID = 'YOUR_APP_ID'; 
      const APP_KEY = 'YOUR_APP_KEY';
      const apiUrl = `https://api.adzuna.com/v1/api/jobs/gb/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=5&what=internship`;

      try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("API Key needed");
        const data = await response.json();
        setJobs(data.results);
      } catch (error) {
        setJobs([
          { id: '1', title: 'Marketing Intern (Summer 2026)', company: { display_name: 'Red Bull' }, created: '2026-03-24T10:00:00Z', redirect_url: '#' },
          { id: '2', title: 'Junior Front-End Developer', company: { display_name: 'TechWave' }, created: '2026-03-23T14:30:00Z', redirect_url: '#' },
          { id: '3', title: 'Data Analyst Placement', company: { display_name: 'Aviva' }, created: '2026-03-22T09:15:00Z', redirect_url: '#' }
        ]);
      } finally {
        setIsLoadingJobs(false);
      }
    };
    fetchJobs();
  }, []);

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
                <p className="text-xs text-gray-500 mt-1">{job.company.display_name} &bull; Added {formatDate(job.created)}</p>
              </div>
              <a href={job.redirect_url} target="_blank" rel="noreferrer" className="mt-4 sm:mt-0 text-center bg-gray-50 border border-gray-200 px-6 py-2 rounded-lg text-sm font-bold hover:bg-orange-500 hover:text-white transition">Apply</a>
            </div>
          ))
        )}
      </div>
    </section>
  );
}