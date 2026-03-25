import React, { useState } from 'react';

export default function CvMatcher() {
  const [jobDesc, setJobDesc] = useState('We are hiring a Junior Data Scientist in London. The ideal candidate will have strong skills in Python and preliminary data analysis. Experience with NLP, Neural Networks, or building a local AI assistant is a huge plus.');
  const [cvText, setCvText] = useState('Computer Science student. Projects include identifying fake text documents using NLP and neural networks, and preliminary data analysis for data mining. Also built a microservice for image generation. Active participant in Kaggle competitions.');
  const [matchResults, setMatchResults] = useState(null);

  const analyzeCV = () => {
    const stopWords = ['and', 'the', 'to', 'a', 'of', 'for', 'in', 'with', 'on', 'is', 'an', 'as', 'are', 'be', 'this', 'that', 'by', 'or', 'we', 'will', 'have'];
    const getWords = (text) => text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 2);
    
    const jobWordsRaw = getWords(jobDesc).filter(w => !stopWords.includes(w));
    const cvWordsRaw = getWords(cvText);
    const jobKeywords = [...new Set(jobWordsRaw)];
    const cvKeywords = new Set(cvWordsRaw);

    const matched = jobKeywords.filter(w => cvKeywords.has(w));
    const missing = jobKeywords.filter(w => !cvKeywords.has(w));
    const score = jobKeywords.length > 0 ? Math.round((matched.length / jobKeywords.length) * 100) : 0;
    
    setMatchResults({ score, matched, missing });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-purple-600">
      <h3 className="font-bold text-xl mb-2 text-center text-gray-800">Beat the ATS Bots</h3>
      <p className="text-xs text-gray-500 text-center mb-4">Paste your CV and the job description to find missing keywords.</p>
      <div className="space-y-3 mb-4">
        <textarea value={jobDesc} onChange={(e) => setJobDesc(e.target.value)} placeholder="Paste Job Description here..." className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 text-sm h-24 resize-none"></textarea>
        <textarea value={cvText} onChange={(e) => setCvText(e.target.value)} placeholder="Paste your CV text here..." className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-purple-400 text-sm h-24 resize-none"></textarea>
      </div>
      <button onClick={analyzeCV} className="w-full py-3 bg-purple-600 text-white text-sm font-bold rounded-lg hover:bg-purple-700 transition shadow-md">Analyze Match</button>
      
      {matchResults && (
        <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-100 animate-fade-in">
          <div className="text-center mb-4">
            <p className="text-xs text-purple-800 uppercase font-bold tracking-widest mb-1">Match Score</p>
            <p className={`text-4xl font-black ${matchResults.score > 70 ? 'text-green-600' : 'text-orange-500'}`}>{matchResults.score}%</p>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-bold text-green-700 block mb-1">✓ Found Keywords:</span>
              <div className="flex flex-wrap gap-1">{matchResults.matched.slice(0, 8).map(word => <span key={word} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">{word}</span>)}</div>
            </div>
            <div>
              <span className="font-bold text-red-600 block mb-1">✗ Missing Keywords:</span>
              <div className="flex flex-wrap gap-1">{matchResults.missing.slice(0, 8).map(word => <span key={word} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">{word}</span>)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}