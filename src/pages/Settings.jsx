import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useLocation, useNavigate } from 'react-router-dom';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function Settings() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [preferences, setPreferences] = useState({ Careers: true, Housing: true, Visa: true, General: false });
  // NEW: Separate preferences for Q&A
  const [qnaPreferences, setQnaPreferences] = useState({ Careers: true, Housing: true, Visa: true, General: true });
  
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Scroll to section if hash is present
  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }, [location.hash]);

  // Load current settings from backend
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        const response = await fetch(`${API_URL}/profile`, {
          headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}` }
        });
        if (response.ok) {
          const data = await response.json();
          if (data.notificationPreferences) setPreferences(data.notificationPreferences);
          if (data.qnaPreferences) setQnaPreferences(data.qnaPreferences);
        }
      } catch (error) { console.error("Error loading settings", error); }
    };
    loadSettings();
  }, []);

  const handleToggle = (category, type) => {
    if (type === 'blog') setPreferences(prev => ({ ...prev, [category]: !prev[category] }));
    if (type === 'qna') setQnaPreferences(prev => ({ ...prev, [category]: !prev[category] }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      const { tokens } = await fetchAuthSession();
      const response = await fetch(`${API_URL}/profile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        // Save BOTH preferences
        body: JSON.stringify({ notificationPreferences: preferences, qnaPreferences: qnaPreferences })
      });
      if (!response.ok) throw new Error("Failed to save");
      setMessage('Settings saved successfully! ✨');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving settings.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 space-y-8">
      <button onClick={() => navigate('/community')} className="text-sm font-bold text-gray-400 hover:text-gray-800 mb-4 block">
        &larr; Back to Community
      </button>
      <h1 className="text-4xl font-black text-gray-900 mb-8">Account Settings</h1>

      {/* Blog Notification Settings */}
      <div id="notifications" className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">Guide Notifications</h2>
        <p className="text-gray-500 font-medium text-sm mb-6">Alerts for when new master guides are posted.</p>
        <div className="space-y-4">
          {Object.keys(preferences).map(category => (
            <div key={category} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <div><h3 className="font-bold text-gray-800">{category} Guides</h3></div>
              <button onClick={() => handleToggle(category, 'blog')} className={`w-12 h-6 rounded-full transition-colors flex items-center ${preferences[category] ? 'bg-blue-600' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${preferences[category] ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* NEW: Q&A Notification Settings */}
      <div id="qna-notifications" className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
        <h2 className="text-xl font-black text-gray-900 mb-2">Q&A Forum Notifications</h2>
        <p className="text-gray-500 font-medium text-sm mb-6">Alerts for community questions needing answers.</p>
        <div className="space-y-4">
          {Object.keys(qnaPreferences).map(category => (
            <div key={category} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition">
              <div><h3 className="font-bold text-gray-800">{category} Questions</h3></div>
              <button onClick={() => handleToggle(category, 'qna')} className={`w-12 h-6 rounded-full transition-colors flex items-center ${qnaPreferences[category] ? 'bg-indigo-500' : 'bg-gray-300'}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${qnaPreferences[category] ? 'translate-x-7' : 'translate-x-1'}`}></div>
              </button>
            </div>
          ))}
        </div>

        <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6">
          <span className={`text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-emerald-500'}`}>{message}</span>
          <button onClick={handleSave} disabled={isSaving} className="bg-blue-600 text-white px-8 py-3 font-black rounded-xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50">
            {isSaving ? 'Saving...' : 'Save Preferences'}
          </button>
        </div>
      </div>
    </div>
  );
}