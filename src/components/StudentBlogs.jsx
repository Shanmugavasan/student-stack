import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function StudentBlogs() {
  const navigate = useNavigate();

  const blogs = [
    {
      id: 'visa-2026',
      title: 'Top UK Companies Sponsoring Visas for AI & Data Science Grads in 2026',
      excerpt: 'Following the 2025 Immigration Updates, the Skilled Worker route remains the primary path. Here are the top companies to watch...',
      author: 'StudentStack Editorial',
      readTime: '8 min read',
      category: 'Careers',
      likes: 1240,
      path: '/community/visa-sponsorship-2026'
    },
    {
      id: 'dropshipping-legal',
      title: 'Can You Start a Dropshipping Business on a UK Student Visa? (2026 Update)',
      excerpt: 'The Home Office strictly prohibits self-employment and "Business Activity." Here is why managing a Shopify store could risk your visa...',
      author: 'Legal Desk',
      readTime: '5 min read',
      category: 'Visa Compliance',
      likes: 842,
      path: '/community/dropshipping-visa'
    },
{
  id: 'monzo-revolut',
  title: 'Monzo vs Revolut: Which is actually better for international students?',
  excerpt: 'A breakdown of hidden fees, split bills, and app features for students arriving in the UK...',
  author: 'Sarah Jenkins',
  readTime: '4 min read',
  category: 'Finance',
  likes: 342,
  path: '/community/monzo-vs-revolut' // WAS '#' NOW FIXED
}
  ];

  return (
    <section id="blogs" className="mt-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-2xl font-black text-gray-900">Community Guides</h3>
          <p className="text-sm text-gray-400 font-medium">Verified advice for the 2026 academic year.</p>
        </div>
        <button className="bg-rose-50 text-rose-600 px-6 py-2 rounded-2xl text-sm font-black hover:bg-rose-100 transition border border-rose-100">
          + Write a Post
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {blogs.map((blog) => (
          <div 
            key={blog.id} 
            onClick={() => blog.path !== '#' && navigate(blog.path)}
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
                <span className="text-xs font-bold text-gray-700">{blog.author}</span>
              </div>
              <span className="text-[10px] font-black text-gray-400 bg-gray-50 px-3 py-1 rounded-full flex items-center gap-1 group-hover:bg-rose-50 group-hover:text-rose-500 transition">
                ❤️ {blog.likes}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}