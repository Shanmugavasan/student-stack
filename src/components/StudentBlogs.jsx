import React, { useState } from 'react';

export default function StudentBlogs() {
  const [blogs] = useState([
    {
      id: 1,
      title: 'Monzo vs Revolut: Which is actually better for studying abroad?',
      excerpt: 'I used both during my semester in Spain. Here is the breakdown of hidden fees, split bills, and app features...',
      author: 'Sarah Jenkins',
      readTime: '4 min read',
      category: 'Finance',
      likes: 342
    },
    {
      id: 2,
      title: 'How I landed a Data Science Internship using cold emails',
      excerpt: 'Stop relying on the ATS bots. Here is the exact email template I sent to 50 startup founders that got me 4 interviews.',
      author: 'David Chen',
      readTime: '6 min read',
      category: 'Careers',
      likes: 891
    }
  ]);

  return (
    <section id="blogs" className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold border-l-4 border-rose-500 pl-3">Community Blogs</h3>
        <button className="bg-rose-100 text-rose-700 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-rose-200 transition">
          + Write a Post
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:border-rose-200 transition cursor-pointer group">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-bold text-rose-600 uppercase tracking-wider">{blog.category}</span>
              <span className="text-xs text-gray-400">⏱️ {blog.readTime}</span>
            </div>
            <h4 className="font-bold text-gray-900 text-xl mb-2 group-hover:text-rose-600 transition">{blog.title}</h4>
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{blog.excerpt}</p>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-xs">👤</div>
                <span className="font-medium text-gray-700">{blog.author}</span>
              </div>
              <span className="text-gray-500 flex items-center gap-1">❤️ {blog.likes}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}