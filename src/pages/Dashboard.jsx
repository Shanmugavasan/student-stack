import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

// TODO: We will replace this with your real AWS API Gateway URL in the next step
const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [jwtToken, setJwtToken] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Check Auth Status via AWS Amplify
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        // 2. Grab the secure JWT token to send to our Lambda backend
        const authSession = await fetchAuthSession();
        const token = authSession.tokens?.idToken?.toString();
        
        setUser(currentUser);
        setJwtToken(token);
        
        // 3. Fetch the jobs using the secure token
        fetchSavedJobs(token);
      } catch (error) {
        console.log("No user session found, redirecting to login.");
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchSavedJobs = async (token) => {
    setIsLoading(true);
    try {
      // Sending a request to your API Gateway, passing the Cognito token as the ID badge
      const response = await fetch(`${API_URL}/jobs`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Failed to fetch jobs');
      
      const data = await response.json();
      setSavedJobs(data.jobs || []);
    } catch (error) {
      console.error("Error loading jobs:", error.message);
      // Fails silently for now to keep the UI clean if the API isn't built yet
    } finally {
      setIsLoading(false);
    }
  };

  const markAsApplied = async (jobId) => {
    try {
      const response = await fetch(`${API_URL}/jobs/${jobId}/apply`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Content-Type': 'application/json'
        }
      });
        
      if (!response.ok) throw new Error('Could not update status');
      
      fetchSavedJobs(jwtToken); // Refresh the list
    } catch (error) {
      alert("Could not update status.");
    }
  };

  if (!user) return null; // Prevent flash of content before redirect

  return (
    <div className="max-w-4xl mx-auto mt-8 space-y-8">
      
      {/* Welcome Banner */}
      <div className="bg-slate-800 text-white p-8 rounded-2xl shadow-lg">
        {/* We use signInDetails.loginId because you used email as the login identifier */}
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user.signInDetails?.loginId?.split('@')[0] || 'Student'}!</h1>
        <p className="text-slate-300">Track your applications and manage your saved opportunities here.</p>
      </div>

      {/* Saved Jobs Section */}
      <section>
        <h3 className="text-2xl font-bold border-l-4 border-emerald-500 pl-3 mb-6">My Application Tracker</h3>
        
        {isLoading ? (
          <div className="p-8 text-center text-gray-500 bg-white rounded-xl border border-gray-100 animate-pulse">
            Loading your saved opportunities...
          </div>
        ) : savedJobs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500 mb-4">You haven't saved any roles yet.</p>
            <button onClick={() => navigate('/jobs')} className="bg-emerald-100 text-emerald-700 px-6 py-2 rounded-lg font-bold hover:bg-emerald-200 transition">
              Browse Jobs &rarr;
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {savedJobs.map(job => (
              <div key={job.SK} className="bg-white p-5 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between shadow-sm border border-gray-100 hover:border-emerald-200 transition">
                {/* Using job.SK (or job.id if you saved it) as the key */}
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{job.job_title}</h4>
                  <p className="text-sm text-gray-500">{job.company} &bull; {job.location}</p>
                </div>
                
                <div className="flex items-center gap-3 mt-4 sm:mt-0">
                  {job.status === 'Applied' ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">✓ Applied</span>
                  ) : (
                    <button 
                      onClick={() => markAsApplied(job.id)}
                      className="text-xs font-bold text-slate-500 hover:text-emerald-600 transition"
                    >
                      Mark as Applied
                    </button>
                  )}
                  <a href={job.url} target="_blank" rel="noreferrer" className="bg-slate-100 border border-slate-200 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 hover:text-white transition">
                    View Post
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}