import React, { useState, useEffect, useRef } from 'react';

export default function GpaCalculator() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [system, setSystem] = useState('us');
  const [courses, setCourses] = useState([{ id: 1, credits: '', grade: '' }]);
  const [result, setResult] = useState({ score: '0.00', label: '' });
  const modalRef = useRef(null);

  // Math Logic
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
    const finalScore = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
    setResult({ score: finalScore, label: system === 'uk' && finalScore >= 70 ? "1st Class" : "" });
  }, [courses, system]);

  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  // Close when clicking outside the plate
  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsExpanded(false);
    }
  };

  // Base styles for the "Small" version vs "Expanded" version
  const containerClasses = isExpanded 
    ? "fixed inset-0 z-[999] flex items-center justify-center p-4 transition-all duration-300"
    : "relative bg-white p-6 rounded-2xl border border-gray-100 shadow-sm transition-all duration-300";

  return (
    <>
      {/* 1. The Backdrop (Only visible when expanded) */}
      {isExpanded && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[998] animate-in fade-in duration-300" 
          onClick={() => setIsExpanded(false)} 
        />
      )}

      {/* 2. The Calculator Component */}
      <div className={containerClasses}>
        <div 
          ref={modalRef}
          className={`${isExpanded ? "bg-white w-full max-w-xl rounded-[2rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden" : "w-full"}`}
        >
          
          {/* Header - Changes based on state */}
          <div className={`${isExpanded ? "p-8 border-b bg-gray-50/50 flex justify-between items-center" : "mb-4"}`}>
            <div>
              <h3 className={`${isExpanded ? "text-2xl font-black" : "text-lg font-bold"} text-gray-900 tracking-tight`}>
                GPA Calculator
              </h3>
              {isExpanded && <p className="text-sm text-gray-500">Calculate scores for any university system</p>}
            </div>
            {isExpanded && (
              <button onClick={() => setIsExpanded(false)} className="text-3xl font-light text-gray-400 hover:text-gray-900">
                &times;
              </button>
            )}
          </div>

          {/* Body */}
          <div className={`${isExpanded ? "p-8 max-h-[60vh] overflow-y-auto" : ""}`}>
            <div className="mb-4">
              <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">System</label>
              <select 
                value={system} 
                onChange={(e) => setSystem(e.target.value)}
                onFocus={() => setIsExpanded(true)} // EXPAND ON INTERACTION
                className="w-full p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-blue-500 outline-none text-sm font-bold text-gray-700"
              >
                <option value="us">US / 4.0</option>
                <option value="uk">UK / %</option>
                <option value="india">India / 10.0</option>
              </select>
            </div>

            <div className="space-y-3">
              {/* Only show first 2 rows when small to save space */}
              {(isExpanded ? courses : courses.slice(0, 2)).map(course => (
                <div key={course.id} className="flex gap-2">
                  <input 
                    type="number" 
                    placeholder="Credits" 
                    onFocus={() => setIsExpanded(true)} // EXPAND ON INTERACTION
                    className="w-1/3 p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
                    onChange={(e) => updateCourse(course.id, 'credits', e.target.value)}
                  />
                  <input 
                    type="number" 
                    placeholder="Grade" 
                    onFocus={() => setIsExpanded(true)} // EXPAND ON INTERACTION
                    className="w-2/3 p-3 bg-gray-50 rounded-xl border border-transparent focus:border-blue-500 focus:bg-white transition-all outline-none text-sm"
                    onChange={(e) => updateCourse(course.id, 'grade', e.target.value)}
                  />
                </div>
              ))}
            </div>

            {!isExpanded && courses.length > 2 && (
              <p className="text-[10px] text-center mt-2 text-gray-400 font-bold">+ {courses.length - 2} more modules</p>
            )}
            
            {isExpanded && (
              <button 
                onClick={() => setCourses([...courses, { id: Date.now(), credits: '', grade: '' }])} 
                className="mt-6 w-full py-4 border-2 border-dashed border-gray-200 rounded-2xl text-gray-400 font-bold hover:border-blue-300 hover:text-blue-500 transition-all"
              >
                + Add Another Module
              </button>
            )}
          </div>

          {/* Footer / Result Display */}
          <div className={`${isExpanded ? "p-8 bg-slate-900 text-white flex justify-between items-center" : "mt-6 p-4 bg-blue-50 rounded-xl flex justify-between items-center cursor-pointer"}`}
               onClick={() => !isExpanded && setIsExpanded(true)}>
            <div>
              <p className={`${isExpanded ? "text-[10px] text-slate-500" : "text-[10px] text-blue-400"} uppercase font-black tracking-[0.2em] mb-1`}>Result</p>
              <div className="flex items-baseline gap-2">
                <span className={`${isExpanded ? "text-5xl" : "text-2xl"} font-black tracking-tighter`}>{result.score}</span>
                {isExpanded && <span className="text-blue-400 font-bold text-sm uppercase">{result.label}</span>}
              </div>
            </div>
            <button className={`${isExpanded ? "bg-blue-600 px-8 py-4" : "bg-blue-600 px-4 py-2"} text-white rounded-xl font-black text-xs shadow-lg transition-all`}>
              {isExpanded ? "Save Result" : "Open"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}