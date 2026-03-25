import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto p-8 my-10 text-center">
      <h1 className="text-4xl font-black mb-6 text-gray-900">Empowering the <span className="text-blue-600">UK Student</span> Journey.</h1>
      <p className="text-xl text-gray-600 mb-12">StudentStack.co.uk was built by students, for students. We simplify the transition from University to Career.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-3xl mb-2">🎯</div>
          <h3 className="font-bold">The Mission</h3>
          <p className="text-sm text-gray-500 mt-2">To provide high-end tools like GPA calculators and ATS matchers for free.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-3xl mb-2">🇬🇧</div>
          <h3 className="font-bold">UK Focused</h3>
          <p className="text-sm text-gray-500 mt-2">Tailored specifically for the UK higher education system and job market.</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="font-bold">Career First</h3>
          <p className="text-sm text-gray-500 mt-2">Helping students navigate internships and graduate roles with AI-driven insights.</p>
        </div>
      </div>
    </div>
  );
}