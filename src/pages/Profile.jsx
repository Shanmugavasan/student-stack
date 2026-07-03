import React, { useState, useEffect } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    university: '',
    visaRequired: 'Yes',
    bio: '',
    roles: ['Student']
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // 1. Load Profile Data on Page Load
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { tokens } = await fetchAuthSession();
        if (!tokens) throw new Error("Not logged in");

        const response = await fetch(`${API_URL}/profile`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${tokens.idToken.toString()}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setProfile(prev => ({ ...prev, ...data }));
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, [navigate]);

  // 2. Save Updated Profile
  const handleSave = async (e) => {
    e.preventDefault();
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
        body: JSON.stringify(profile)
      });

      if (!response.ok) throw new Error("Failed to save");
      
      setMessage('Profile updated successfully! ✨');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Error saving profile. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center animate-pulse">
        <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-6"></div>
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto mb-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
        
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-12 border-b border-gray-100 pb-8">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white font-black text-4xl flex items-center justify-center shadow-lg">
            {profile.name?.charAt(0).toUpperCase() || 'S'}
          </div>
          <div>
            <h1 className="text-3xl font-black text-gray-900">{profile.name}</h1>
            <p className="text-gray-500 font-medium">{profile.email}</p>
            <div className="flex gap-2 mt-2">
              {profile.roles?.map(role => (
                <span key={role} className="text-[10px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 px-3 py-1 rounded-full border border-blue-100">
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Full Name</label>
              <input 
                type="text" value={profile.name || ''} onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors font-medium text-gray-800"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">University</label>
              <input 
                type="text" value={profile.university || ''} onChange={(e) => setProfile({...profile, university: e.target.value})}
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors font-medium text-gray-800"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Visa Sponsorship Required?</label>
            <div className="flex gap-4">
              <label className={`flex-1 p-4 border rounded-xl text-center cursor-pointer font-bold transition-all ${profile.visaRequired === 'Yes' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                <input type="radio" name="visa" value="Yes" className="hidden" onChange={(e) => setProfile({...profile, visaRequired: e.target.value})} checked={profile.visaRequired === 'Yes'} /> Yes
              </label>
              <label className={`flex-1 p-4 border rounded-xl text-center cursor-pointer font-bold transition-all ${profile.visaRequired === 'No' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                <input type="radio" name="visa" value="No" className="hidden" onChange={(e) => setProfile({...profile, visaRequired: e.target.value})} checked={profile.visaRequired === 'No'} /> No
              </label>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Bio / Career Goals</label>
            <textarea 
              value={profile.bio || ''} onChange={(e) => setProfile({...profile, bio: e.target.value})}
              placeholder="Tell recruiters and the community what you're looking for..."
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors h-32 resize-none font-medium text-gray-800"
            />
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-100">
            <span className={`text-sm font-bold ${message.includes('Error') ? 'text-red-500' : 'text-emerald-500'}`}>
              {message}
            </span>
            <button 
              type="submit" disabled={isSaving}
              className="bg-blue-600 text-white px-10 py-4 font-black rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}