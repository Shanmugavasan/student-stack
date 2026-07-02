import React, { useState, useEffect, useRef } from 'react';

export default function GpaCalculator() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // 1. The Universal Rules Engine (Defaults to UK, but fully editable)
  const [rules, setRules] = useState({
    maxScore: 100,
    passMark: 40,
    unitName: 'Credits',
    tiers: [
      { min: 70, label: '1st Class' },
      { min: 60, label: '2:1 (Upper)' },
      { min: 50, label: '2:2 (Lower)' },
      { min: 40, label: '3rd Class' }
    ]
  });

  const [courses, setCourses] = useState([{ id: 1, credits: '', grade: '' }]);
  const [result, setResult] = useState({ score: '0.00', label: 'N/A' });
  const modalRef = useRef(null);

  // 2. Intelligent Universal Math Logic
  useEffect(() => {
    let totalPoints = 0;
    let totalCredits = 0;

    courses.forEach(c => {
      const creds = parseFloat(c.credits);
      const grade = parseFloat(c.grade);
      if (creds > 0 && !isNaN(grade)) {
        totalPoints += (grade * creds);
        totalCredits += creds;
      }
    });

    const finalScore = totalCredits > 0 ? (totalPoints / totalCredits) : 0;
    
    // Find the matching tier based on custom rules (Sorted High to Low)
    const activeTier = [...rules.tiers]
      .sort((a, b) => b.min - a.min)
      .find(t => finalScore >= t.min);

    setResult({ 
      score: finalScore.toFixed(2), 
      label: finalScore < rules.passMark ? "Below Pass" : (activeTier?.label || "Passed")
    });
  }, [courses, rules]);

  // Handlers
  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourse = (id) => {
    if (courses.length > 1) setCourses(courses.filter(c => c.id !== id));
  };

  const addTier = () => {
    setRules({ ...rules, tiers: [...rules.tiers, { min: 0, label: 'New Tier' }] });
  };

  const updateTier = (index, field, value) => {
    const newTiers = [...rules.tiers];
    newTiers[index][field] = field === 'min' ? parseFloat(value) : value;
    setRules({ ...rules, tiers: newTiers });
  };

  const removeTier = (index) => {
    const newTiers = rules.tiers.filter((_, i) => i !== index);
    setRules({ ...rules, tiers: newTiers });
  };

  const containerClasses = isExpanded 
    ? "fixed inset-0 z-[999] flex items-center justify-center p-4"
    : "relative bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm transition-all hover:shadow-md cursor-pointer";

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[998] animate-in fade-in duration-300" 
          onClick={() => setIsExpanded(false)} 
        />
      )}

      {/* Calculator Component */}
      <div className={containerClasses} onClick={() => !isExpanded && setIsExpanded(true)}>
        <div 
          ref={modalRef} 
          onClick={(e) => e.stopPropagation()}
          className={`${isExpanded ? "bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden" : "w-full"}`}
        >
          
          {/* Header */}
          <div className={`${isExpanded ? "p-8 border-b flex justify-between items-center bg-gray-50/50" : "mb-4 flex justify-between items-center"}`}>
            <div>
              <h3 className={`${isExpanded ? "text-2xl font-black" : "text-lg font-bold"} text-gray-900 tracking-tight`}>
                Universal GPA Engine
              </h3>
              {isExpanded && <p className="text-sm text-gray-500 font-medium">Customize for any marking scheme globally.</p>}
            </div>
            {isExpanded && (
              <div className="flex gap-2">
                <button 
                  onClick={() => setShowSettings(!showSettings)} 
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${showSettings ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                  {showSettings ? '✓ Done' : '⚙️ Logic Settings'}
                </button>
                <button onClick={() => setIsExpanded(false)} className="text-3xl font-light text-gray-300 hover:text-gray-900 ml-2">&times;</button>
              </div>
            )}
          </div>

          <div className={`${isExpanded ? "p-8 max-h-[60vh] overflow-y-auto" : ""}`}>
            
            {/* Logic Customizer Panel */}
            {isExpanded && showSettings && (
              <div className="mb-10 p-6 bg-blue-50 rounded-[2rem] border border-blue-100 animate-in slide-in-from-top-4">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-6">Scale Configuration</h4>
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div>
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Max Possible Grade</label>
                    <input type="number" value={rules.maxScore} onChange={(e) => setRules({...rules, maxScore: e.target.value})} className="w-full p-4 mt-2 rounded-2xl border-none focus:ring-2 ring-blue-200 outline-none font-bold text-gray-700" placeholder="e.g. 100 or 4.0" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Pass Mark</label>
                    <input type="number" value={rules.passMark} onChange={(e) => setRules({...rules, passMark: e.target.value})} className="w-full p-4 mt-2 rounded-2xl border-none focus:ring-2 ring-blue-200 outline-none font-bold text-gray-700" placeholder="e.g. 40" />
                  </div>
                </div>
                
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">Grade Tiers & Classification</h4>
                <div className="space-y-3">
                  {rules.tiers.map((tier, idx) => (
                    <div key={idx} className="flex gap-3 group">
                      <input type="number" value={tier.min} onChange={(e) => updateTier(idx, 'min', e.target.value)} placeholder="Min Score" className="w-24 p-3 rounded-xl border-none text-sm font-bold shadow-sm" />
                      <input type="text" value={tier.label} onChange={(e) => updateTier(idx, 'label', e.target.value)} placeholder="Label (e.g. First Class)" className="flex-grow p-3 rounded-xl border-none text-sm font-bold shadow-sm" />
                      <button onClick={() => removeTier(idx)} className="text-gray-300 hover:text-red-500 text-xl font-light">&times;</button>
                    </div>
                  ))}
                  <button onClick={addTier} className="text-[10px] font-black text-blue-600 mt-4 uppercase tracking-widest hover:underline">+ Add Custom Tier</button>
                </div>
              </div>
            )}

            {/* Course Inputs */}
            <div className="space-y-4">
              {(isExpanded ? courses : courses.slice(0, 2)).map(course => (
                <div key={course.id} className="flex gap-3 group">
                  <input 
                    type="number" 
                    placeholder={rules.unitName} 
                    className="w-1/3 p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-bold"
                    onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                    onFocus={() => !isExpanded && setIsExpanded(true)}
                  />
                  <input 
                    type="number" 
                    placeholder="Grade" 
                    className="flex-grow p-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm font-bold"
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                    onFocus={() => !isExpanded && setIsExpanded(true)}
                  />
                  {isExpanded && (
                    <button onClick={() => removeCourse(course.id)} className="p-4 text-gray-300 hover:text-red-500 transition-colors">&times;</button>
                  )}
                </div>
              ))}
            </div>

            {isExpanded && (
              <button 
                onClick={() => setCourses([...courses, { id: Date.now(), credits: '', grade: '' }])} 
                className="mt-6 w-full py-5 border-2 border-dashed border-gray-100 rounded-[2rem] text-gray-400 font-black hover:border-blue-200 hover:text-blue-500 transition-all text-[10px] uppercase tracking-[0.2em]"
              >
                + Add Another Module
              </button>
            )}
          </div>

          {/* Footer Display / Result Plate */}
          <div 
            className={`${isExpanded ? "p-10 bg-slate-900 text-white flex justify-between items-center" : "mt-6 p-5 bg-blue-50 rounded-[2rem] flex justify-between items-center"}`}
          >
            <div className="flex gap-10 items-center">
              <div>
                <p className={`${isExpanded ? "text-slate-500" : "text-blue-400"} text-[10px] uppercase font-black tracking-[0.2em] mb-2`}>Weighted GPA</p>
                <div className="flex items-baseline gap-3">
                  <span className={`${isExpanded ? "text-6xl" : "text-3xl"} font-black tracking-tighter`}>{result.score}</span>
                  <span className={`${isExpanded ? "text-blue-500" : "text-blue-200"} font-black text-xs uppercase tracking-widest`}>/ {rules.maxScore}</span>
                </div>
              </div>
              
              {isExpanded && (
                <div className="hidden md:block h-16 w-[1px] bg-slate-800" />
              )}
              
              {isExpanded && (
                <div>
                  <p className="text-slate-500 text-[10px] uppercase font-black tracking-[0.2em] mb-2">Classification</p>
                  <p className="text-2xl font-black text-white">{result.label}</p>
                </div>
              )}
            </div>
            
            <button className={`${isExpanded ? "bg-blue-600 px-10 py-5" : "bg-blue-600 px-6 py-3"} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-blue-500/20 hover:scale-105 transition-all`}>
              {isExpanded ? "Save & Export" : "Calculate"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}