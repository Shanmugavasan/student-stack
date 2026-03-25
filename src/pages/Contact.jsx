import React from 'react';

export default function Contact() {
  return (
    <div className="max-w-2xl mx-auto p-12 bg-white my-10 rounded-2xl shadow-sm border text-center">
      <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
      <p className="text-gray-600 mb-8">Have a question about our tools or want to report a bug?</p>
      
      <div className="inline-block bg-blue-50 p-6 rounded-2xl border border-blue-100">
        <p className="text-sm font-bold text-blue-800 uppercase tracking-widest mb-2">Email Us</p>
        <a href="mailto:support@studentstack.co.uk" className="text-2xl font-black text-blue-600 hover:underline">
          hello@studentstack.co.uk
        </a>
      </div>
      
      <p className="mt-12 text-xs text-gray-400">We typically respond within 24-48 hours.</p>
    </div>
  );
}