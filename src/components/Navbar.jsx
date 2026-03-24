import React from 'react';

export default function Navbar() {
  return (
    <nav className="bg-blue-600 p-4 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">StudentStack<span className="text-blue-200">.io</span></h1>
        <div className="space-x-6 hidden md:flex">
          <a href="#scholarships" className="hover:text-blue-200 font-medium">Scholarships</a>
          <a href="#jobs" className="hover:text-blue-200 font-medium">Jobs</a>
          <a href="#tools" className="hover:text-blue-200 font-medium">Tools</a>
        </div>
      </div>
    </nav>
  );
}