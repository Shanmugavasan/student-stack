import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function StudentBlogs() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_URL}/blogs`);
        if (!response.ok) throw new Error("API not ready");
        const data = await response.json();
        if (data.blogs && data.blogs.length > 0) {
          setBlogs(data.blogs);
        } else {
          throw new Error("No blogs found, using fallback");
        }
      } catch (error) {
        // Fallback data while testing
        setBlogs([
          {
            id: 'visa-2026',
            title: 'Top UK Companies Sponsoring Visas for AI & Data Science Grads in 2026',
            excerpt: 'Following the 2025 Immigration Updates, the Skilled Worker route remains the primary path. Here are the top companies to watch...',
            author_name: 'StudentStack Editorial',
            isVerified: true,
            readTime: '8 min read',
            category: 'Careers',
            likes: 1240,
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <section id="blogs" className="mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Community Guides</h3>
          <p className="text-sm text-gray-400 font-medium">Verified advice for the 2026 academic year.</p>
        </div>
        <button 
          onClick={() => navigate('/community/write')}
          className="bg-rose-50 text-rose-600 px-6 py-2 rounded-2xl text-sm font-black hover:bg-rose-100 transition border border-rose-100 shadow-sm"
        >
          + Write a Post
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-64 bg-white rounded-[2rem] border border-gray-100"></div>
          <div className="h-64 bg-white rounded-[2rem] border border-gray-100"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogs.map((blog) => (
            <div 
              key={blog.id} 
              onClick={() => navigate(`/community/${blog.id}`)}
              className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 hover:border-rose-400 hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-black text-rose-600 uppercase tracking-[0.2em] bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
                    {blog.category}
                  </span>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">⏱️ {blog.readTime}</span>
                </div>
                
                <h4 className="font-black text-gray-900 text-xl mb-3 group-hover:text-rose-600 transition leading-tight">
                  {blog.title}
                </h4>
                <p className="text-sm text-gray-500 mb-6 line-clamp-3 font-medium leading-relaxed">
                  {blog.excerpt}
                </p>
              </div>
              
              <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-xs grayscale">👤</div>
                  <span className="text-xs font-bold text-gray-700 flex items-center gap-1">
                    {blog.author_name}
                    {blog.isVerified && <span className="text-blue-500" title="Verified Advisor">☑️</span>}
                  </span>
                </div>
                <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1 group-hover:bg-rose-50 group-hover:text-rose-500 transition">
                  ❤️ {blog.likes || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}