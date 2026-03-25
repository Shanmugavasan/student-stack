import React from 'react';
import JobListings from '../components/JobListings';
import CvMatcher from '../components/CvMatcher';
import GpaCalculator from '../components/GpaCalculator';

export default function JobsPage() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-8">
        <JobListings />
      </div>
      <aside className="space-y-6">
        <CvMatcher />
        {/* Just call it normally. It expands automatically when clicked! */}
        <GpaCalculator />
      </aside>
    </div>
  );
}