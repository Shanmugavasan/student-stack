import React, { useState } from 'react';

export default function GpaCalculator() {
  const [courses, setCourses] = useState([{ credits: '', grade: '4' }]);

  const addCourse = () => setCourses([...courses, { credits: '', grade: '4' }]);
  
  const updateCourse = (index, field, value) => {
    const newCourses = [...courses];
    newCourses[index][field] = value;
    setCourses(newCourses);
  };

  const calculateGPA = () => {
    let totalPoints = 0, totalCredits = 0;
    courses.forEach(c => {
      const creds = parseFloat(c.credits);
      const grade = parseFloat(c.grade);
      if (creds > 0 && !isNaN(creds)) {
        totalPoints += creds * grade;
        totalCredits += creds;
      }
    });
    return totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : "0.00";
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-blue-600 mb-8">
      <h3 className="font-bold text-xl mb-4 text-center text-gray-800">Free GPA Calculator</h3>
      <div className="space-y-3 mb-4">
        {courses.map((course, index) => (
          <div key={index} className="flex gap-2">
            <input type="number" min="0" value={course.credits} onChange={(e) => updateCourse(index, 'credits', e.target.value)} placeholder="Credits" className="w-1/2 p-2 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white transition" />
            <select value={course.grade} onChange={(e) => updateCourse(index, 'grade', e.target.value)} className="w-1/2 p-2 border border-gray-200 rounded bg-gray-50 focus:outline-none focus:border-blue-400 focus:bg-white transition">
              <option value="4">A</option><option value="3">B</option><option value="2">C</option><option value="1">D</option><option value="0">F</option>
            </select>
          </div>
        ))}
      </div>
      <button onClick={addCourse} className="w-full py-2 text-blue-600 text-sm font-bold hover:bg-blue-50 rounded transition">+ Add Course</button>
      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-center border border-blue-100">
        <p className="text-xs text-blue-800 uppercase font-bold tracking-widest mb-1">Your GPA</p>
        <p className="text-4xl font-black text-blue-600">{calculateGPA()}</p>
      </div>
    </div>
  );
}