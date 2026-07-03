import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function WriteBlog() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Careers');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);

  const handlePublish = async (e) => {
    e.preventDefault();
    setIsPublishing(true);

    try {
      const { tokens } = await fetchAuthSession();
      if (!tokens) throw new Error("Not logged in");

      const response = await fetch(`${API_URL}/blogs`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, category, excerpt, content })
      });

      if (!response.ok) throw new Error("Failed to publish");
      
      alert("Post published successfully!");
      navigate('/community');
    } catch (error) {
      console.error(error);
      alert("You must be logged in to publish a post.");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <button onClick={() => navigate('/community')} className="text-sm font-bold text-gray-400 hover:text-gray-800 mb-8 block">
        &larr; Back to Community
      </button>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h1 className="text-3xl font-black text-gray-900 mb-8">Write a Community Guide</h1>
        
        <form onSubmit={handlePublish} className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Post Title</label>
              <input 
                type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
                placeholder="e.g., How I secured a Tier 2 Visa..."
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-rose-500 transition-colors text-lg font-bold"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Category</label>
              <select 
                value={category} onChange={(e) => setCategory(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-rose-500 transition-colors font-bold text-gray-700"
              >
                <option>Careers</option>
                <option>Finance</option>
                <option>Legal</option>
                <option>Housing</option>
                <option>Student Life</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Short Summary (Excerpt)</label>
            <textarea 
              value={excerpt} onChange={(e) => setExcerpt(e.target.value)} required maxLength={150}
              placeholder="A brief 1-2 sentence hook explaining what this guide is about..."
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-rose-500 transition-colors resize-none h-24 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Full Content</label>
            <textarea 
              value={content} onChange={(e) => setContent(e.target.value)} required
              placeholder="Write your guide here... (Markdown supported)"
              className="w-full p-6 border border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:outline-none focus:border-rose-500 transition-colors h-96 font-medium leading-relaxed"
            />
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" disabled={isPublishing}
              className="bg-rose-600 text-white px-10 py-4 font-black rounded-xl hover:bg-rose-700 transition-colors shadow-lg shadow-rose-600/20 disabled:opacity-50"
            >
              {isPublishing ? 'Publishing...' : 'Publish Guide'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}