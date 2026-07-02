import React, { useState, useEffect, useRef } from 'react';
import { pipeline, env } from '@xenova/transformers';

env.allowLocalModels = false;
env.useBrowserCache = true;

export default function CvMatcher() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [jobDesc, setJobDesc] = useState('Empathic Nurse needed for London clinic. Emergency response and patient care experience required.');
  const [cvText, setCvText] = useState('Experienced healthcare worker skilled in clinical record keeping and patient care. Looking for a nursing role.');
  const [results, setResults] = useState(null);
  const modalRef = useRef(null);

  useEffect(() => {
    const initModel = async () => {
      try {
        const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
        window.nlpModel = extractor;
        setIsReady(true);
      } catch (err) {
        console.error("AI Model Load Error:", err);
      }
    };
    initModel();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsExpanded(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const dotProduct = (a, b) => a.reduce((sum, _, i) => sum + a[i] * b[i], 0);
  const magnitude = (arr) => Math.sqrt(arr.reduce((sum, val) => sum + val * val, 0));

  const runAIScan = async () => {
    if (!isReady || !window.nlpModel) return;
    setIsAnalyzing(true);

    try {
      const jobOutput = await window.nlpModel(jobDesc, { pooling: 'mean', normalize: true });
      const cvOutput = await window.nlpModel(cvText, { pooling: 'mean', normalize: true });

      const v1 = Array.from(jobOutput.data);
      const v2 = Array.from(cvOutput.data);

      const similarity = dotProduct(v1, v2) / (magnitude(v1) * magnitude(v2));
      const normalizedScore = Math.max(0, Math.min(100, Math.round((similarity - 0.2) * 175 + 20)));

      const getTerms = (text) => {
        const tokens = text.toLowerCase().match(/\b(\w+)\b/g) || [];
        const corporateNoise = new Set(['about', 'role', 'looking', 'joined', 'using', 'strong', 'knowledge', 'proven', 'working', 'responsibilities', 'candidate', 'ideal', 'expected', 'focus', 'built', 'highly', 'adept', 'regarding', 'needed', 'required', 'london', 'clinic', 'join', 'opportunity', 'successful', 'junior', 'senior', 'remote', 'hybrid', 'team', 'individual', 'driven', 'responsible', 'ongoing', 'providing', 'provide', 'acquire']);
        const standardStopWords = new Set(['and', 'the', 'for', 'with', 'from', 'that', 'this', 'are', 'was', 'were', 'will', 'have', 'has', 'your', 'our', 'their', 'must', 'should', 'plus', 'years', 'who', 'they', 'you']);
        return tokens.filter(w => w.length > 3 && !standardStopWords.has(w) && !corporateNoise.has(w));
      };

      const jobTerms = [...new Set(getTerms(jobDesc))];
      const cvLower = cvText.toLowerCase();

      const matched = jobTerms.filter(jt => {
        const stem = jt.length > 5 ? jt.slice(0, -2) : jt.slice(0, -1);
        return cvLower.includes(stem);
      });

      const missing = jobTerms.filter(jt => {
        const stem = jt.length > 5 ? jt.slice(0, -2) : jt.slice(0, -1);
        return !cvLower.includes(stem);
      });

      setResults({
        score: normalizedScore,
        matched: [...new Set(matched)],
        missing: [...new Set(missing)]
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (isExpanded) setIsExpanded(false);
  };

  return (
    <>
      {isExpanded && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[998] animate-in fade-in duration-300" onClick={() => setIsExpanded(false)} />
      )}

      <div className={isExpanded ? "fixed inset-0 z-[999] flex items-center justify-center p-4" : "relative"} onClick={handleOverlayClick}>
        <div 
          ref={modalRef} 
          onClick={(e) => e.stopPropagation()} 
          className={isExpanded 
            ? "bg-white w-full max-w-4xl max-h-[90vh] flex flex-col rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden cursor-default" 
            : "bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer"}
        >
          {/* Header - Fixed */}
          <div className={isExpanded ? "p-8 border-b bg-gray-50/50 flex justify-between items-center flex-shrink-0" : "flex justify-between items-center mb-4"}>
            <div>
              <h3 className={`${isExpanded ? "text-2xl font-black" : "text-lg font-bold"} text-gray-900 tracking-tight`}>
                ATS <span className="text-blue-600">SmartMatch AI</span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-2 h-2 rounded-full ${isReady ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${isReady ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {isReady ? "Local AI Brain Active" : "Waking up AI..."}
                </span>
              </div>
            </div>
            {isExpanded && <button onClick={() => setIsExpanded(false)} className="text-3xl font-light text-gray-300 hover:text-gray-900">&times;</button>}
          </div>

          {/* Body - Scrollable Area */}
          <div className={isExpanded ? "p-8 overflow-y-auto scroll-smooth flex-grow" : ""}>
            <div className={`grid gap-4 ${isExpanded ? "md:grid-cols-2" : "grid-cols-1"}`}>
              <div className="flex flex-col gap-2">
                {isExpanded && <label className="text-[10px] font-black uppercase text-blue-500 tracking-tighter ml-2 italic">Target Job Post</label>}
                <textarea 
                  value={jobDesc} onChange={(e) => setJobDesc(e.target.value)}
                  className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium leading-relaxed resize-none ${isExpanded ? "h-64" : "h-24"}`}
                  placeholder="Paste Job Description..."
                />
              </div>
              <div className="flex flex-col gap-2">
                {isExpanded && <label className="text-[10px] font-black uppercase text-gray-400 tracking-tighter ml-2 italic">Current CV Draft</label>}
                <textarea 
                  value={cvText} onChange={(e) => setCvText(e.target.value)}
                  className={`w-full p-4 bg-gray-50 rounded-2xl border-none outline-none text-sm font-medium leading-relaxed resize-none ${isExpanded ? "h-64" : "h-24"}`}
                  placeholder="Paste your CV..."
                />
              </div>
            </div>

            {isExpanded && (
              <div className="mt-8 flex justify-center">
                <button 
                  onClick={runAIScan} disabled={isAnalyzing || !isReady}
                  className="px-12 py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-blue-600 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? "Analyzing Semantic Density..." : "Run AI Deep Match"}
                </button>
              </div>
            )}

            {isExpanded && results && (
              <div className="mt-10 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-emerald-50/50 p-6 rounded-3xl border border-emerald-100/50">
                    <p className="text-[10px] font-black uppercase text-emerald-600 tracking-widest mb-4">✓ Found Keywords</p>
                    <div className="flex flex-wrap gap-2">
                      {results.matched.map(m => (
                        <span key={m} className="px-3 py-1 bg-white text-emerald-600 rounded-lg text-[10px] font-bold border border-emerald-100 shadow-sm">{m}</span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-rose-50/50 p-6 rounded-3xl border border-rose-100/50">
                    <p className="text-[10px] font-black uppercase text-rose-600 tracking-widest mb-4">✗ Missing Nuance</p>
                    <div className="flex flex-wrap gap-2">
                      {results.missing.map(m => (
                        <span key={m} className="px-3 py-1 bg-white text-rose-600 rounded-lg text-[10px] font-bold border border-rose-100 shadow-sm">{m}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {results.missing.length > 0 && (
                  <div className="p-6 bg-blue-600/10 rounded-[2rem] border border-blue-500/20">
                    <p className="text-[10px] font-black uppercase text-blue-500 tracking-widest mb-2 italic">✨ AI SmartMatch Advice</p>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed">
                      Your technical profile is solid. To boost your score, try incorporating more 
                      <span className="text-blue-600 px-1 font-bold italic">"{results.missing[0]}"</span> and 
                      <span className="text-blue-600 px-1 font-bold italic">"{results.missing[1] || results.missing[0]}"</span> 
                      to demonstrate your project impact.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sticky Footer for Score - Expanded Only */}
          {isExpanded && (
            <div className="p-8 bg-slate-900 text-white flex-shrink-0">
               <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <p className="text-slate-500 text-[10px] uppercase font-black tracking-widest mb-1">Match Rate</p>
                    <span className="text-6xl font-black leading-none">{results ? `${results.score}%` : "0%"}</span>
                  </div>
                  <div className="h-12 w-[1px] bg-slate-700 mx-2" />
                  <span className="text-blue-500 font-black text-xs uppercase tracking-widest">Semantic<br/>Similarity</span>
                </div>
                <button onClick={() => setIsExpanded(false)} className="bg-white/10 hover:bg-white/20 px-8 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest transition-all">
                  Close Dashboard
                </button>
              </div>
            </div>
          )}

          {/* Compact View Footer */}
          {!isExpanded && (
            <div className="mt-6 p-5 bg-blue-50 rounded-2xl flex justify-between items-center" onClick={(e) => { e.stopPropagation(); setIsExpanded(true); }}>
              <div>
                <p className="text-blue-400 text-[10px] uppercase font-black tracking-widest mb-1">AI Match Rate</p>
                <span className="text-3xl font-black text-slate-900">{results ? `${results.score}%` : "0%"}</span>
              </div>
              <button className="bg-blue-600 px-8 py-3 rounded-xl text-white font-black text-[10px] uppercase tracking-widest disabled:opacity-50">
                {isReady ? "Go Fullscreen" : "Wait..."}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}