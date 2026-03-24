import React, { useState } from 'react';

export default function Accommodation() {
  const [properties] = useState([
    {
      id: 1,
      name: 'The Student Village - En Suite',
      location: 'City Centre, 10 min walk to campus',
      price: '£185',
      features: ['Bills Included', 'Fast Wi-Fi', 'On-site Gym'],
      image: '🏢', // Placeholder for an actual property photo
      availability: 'Sept 2026'
    },
    {
      id: 2,
      name: 'Campus View Studios',
      location: 'North Quarter',
      price: '£220',
      features: ['Private Kitchen', 'Study Room', 'Cinema'],
      image: '🛏️',
      availability: 'Few Rooms Left'
    }
  ]);

  return (
    <section id="accommodation" className="mt-12">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold border-l-4 border-teal-500 pl-3">Student Housing</h3>
        <span className="text-teal-600 cursor-pointer font-medium hover:underline">See All Map &rarr;</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
            <div className="h-32 bg-gray-100 flex items-center justify-center text-5xl group-hover:bg-teal-50 transition">
              {prop.image}
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-gray-800 text-lg leading-tight">{prop.name}</h4>
                <div className="text-right">
                  <span className="font-black text-teal-600 text-xl">{prop.price}</span>
                  <span className="text-xs text-gray-500 block">/ week</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex items-center gap-1">📍 {prop.location}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {prop.features.map(feat => (
                  <span key={feat} className="bg-teal-50 text-teal-700 px-2 py-1 rounded text-xs font-medium">{feat}</span>
                ))}
              </div>
              
              <button className="w-full bg-white border-2 border-teal-500 text-teal-600 py-2 rounded-lg font-bold hover:bg-teal-500 hover:text-white transition">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}