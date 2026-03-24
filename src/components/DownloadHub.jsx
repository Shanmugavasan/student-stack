import React from 'react';

export default function DownloadHub() {
  const templates = [
    { id: 1, title: 'Tech CV Template (ATS Friendly)', type: 'Google Docs', icon: '📄', color: 'bg-blue-100 text-blue-600' },
    { id: 2, title: 'Notion University Planner', type: 'Notion', icon: '📓', color: 'bg-gray-100 text-gray-800' },
    { id: 3, title: 'Student Budget Tracker (UK Edition)', type: 'Excel', icon: '📊', color: 'bg-green-100 text-green-700' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-emerald-500 mb-8">
      <h3 className="font-bold text-xl mb-2 text-center text-gray-800">Free Templates</h3>
      <p className="text-xs text-gray-500 text-center mb-4">Grab these free resources to level up.</p>
      
      <div className="space-y-3">
        {templates.map((tpl) => (
          <div key={tpl.id} className="group flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 flex items-center justify-center rounded-lg ${tpl.color} text-lg`}>
                {tpl.icon}
              </div>
              <div>
                <h4 className="font-bold text-sm text-gray-800 group-hover:text-emerald-700">{tpl.title}</h4>
                <p className="text-xs text-gray-400">{tpl.type}</p>
              </div>
            </div>
            <span className="text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
              &darr;
            </span>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 py-2 text-emerald-600 text-sm font-bold hover:bg-emerald-50 rounded transition">
        View All Downloads &rarr;
      </button>
    </div>
  );
}