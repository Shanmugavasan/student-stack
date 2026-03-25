import React from 'react';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-white my-10 rounded-2xl shadow-sm border">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
      <p className="text-gray-600 mb-4">Last Updated: March 2026</p>
      
      <section className="space-y-6 text-gray-800">
        <div>
          <h2 className="text-xl font-bold mb-2">1. Introduction</h2>
          <p>Welcome to StudentStack.co.uk. We respect your privacy and are committed to protecting your personal data in accordance with the UK General Data Protection Regulation (UK GDPR).</p>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">2. Data We Collect</h2>
          <ul className="list-disc ml-6 space-y-2">
            <li><strong>Account Data:</strong> Email addresses provided via Supabase Auth.</li>
            <li><strong>Usage Data:</strong> Information on how you use our GPA calculator and Job search.</li>
            <li><strong>Cookies:</strong> We use cookies to analyze traffic and serve personalized ads via Google AdSense.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold mb-2">3. How We Use Your Data</h2>
          <p>We use your data to provide our services, maintain your job dashboard, and improve our ATS matching algorithms.</p>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
          <h2 className="text-xl font-bold mb-2 text-blue-800">4. Advertising</h2>
          <p className="text-sm">We use third-party advertising companies (Google AdSense) to serve ads. These companies may use information about your visits to this and other websites to provide advertisements about goods and services of interest to you.</p>
        </div>
      </section>
    </div>
  );
}