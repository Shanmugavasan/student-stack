import React, { useState, useEffect } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function QnaForum() {
  const navigate = useNavigate();
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State for expanded question thread (kept per your request!)
  const [expandedId, setExpandedId] = useState(null);
  const [threadComments, setThreadComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/forum`);
      if (!response.ok) throw new Error("API error");
      const data = await response.json();
      setQuestions(data.questions || []);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;
    try {
      const { tokens } = await fetchAuthSession();
      const realName = tokens.idToken.payload.name || "Student"; 
      
      await fetch(`${API_URL}/forum`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title: newQuestion,
          category: selectedCategory,
          author_name: realName
        })
      });
      setNewQuestion('');
      fetchQuestions(); 
    } catch (error) { alert("Please log in to ask."); }
  };

  const handleVote = async (e, qId, qCreatedAt, direction) => {
    e.stopPropagation(); 
    try {
      const { tokens } = await fetchAuthSession();
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: qId, targetType: "QUESTION", action: direction, targetCreatedAt: qCreatedAt })
      });
      if (response.ok) fetchQuestions(); 
    } catch (error) { alert("Log in to vote!"); }
  };

  const toggleExpand = async (qId) => {
    if (expandedId === qId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(qId);
    setThreadComments([]); 
    const res = await fetch(`${API_URL}/comments?blogId=${qId}`);
    if (res.ok) {
      const data = await res.json();
      setThreadComments(data.comments || []);
    }
  };

  const handlePostReply = async (qId, qAuthorId) => {
    if (!newComment.trim()) return;
    try {
      const { tokens } = await fetchAuthSession();
      await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ blogId: qId, content: newComment, blogAuthorId: qAuthorId })
      });
      setNewComment('');
      toggleExpand(qId); 
    } catch (err) { alert("Log in to reply!"); }
  };

  return (
    <section id="qna" className="mt-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-black border-l-4 border-indigo-500 pl-3 text-gray-900">Student Q&A</h3>
          <p className="text-xs text-gray-400 mt-1 ml-4 font-medium">Quick answers from peers.</p>
        </div>
        <button 
          onClick={() => navigate('/settings#qna-notifications')}
          className="text-xl text-gray-400 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
          title="Q&A Notification Settings"
        >
          ⚙️
        </button>
      </div>

      {/* FIXED: Changed to flex-col so inputs stack nicely in the sidebar */}
      <form onSubmit={handleAsk} className="mb-8 flex flex-col gap-3">
        <textarea 
          value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask the community a question..." 
          className="w-full p-4 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-indigo-500 font-medium resize-none h-24"
        />
        <div className="flex gap-2">
          <select 
            value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
            className="flex-1 p-3 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-indigo-500 font-bold text-sm"
          >
            <option>General</option><option>Visa</option><option>Housing</option><option>Careers</option>
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-black hover:bg-indigo-700 transition shadow-sm text-sm">
            Ask
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {isLoading ? ( <div className="text-center py-8 animate-pulse text-gray-400 text-sm">Loading...</div> ) : 
         questions.map((q) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:border-indigo-200">
            
            <div 
              onClick={() => navigate(`/community/${q.id}`)} 
              className="p-4 hover:bg-gray-50 transition cursor-pointer flex gap-3"
            >
              {/* VOTE COLUMN */}
              <div className="flex flex-col items-center bg-gray-50 rounded-xl p-1 h-fit border border-gray-200 shrink-0">
                <button onClick={(e) => handleVote(e, q.id, q.createdAt, 'UP')} className="p-1 hover:text-orange-500 text-gray-400 text-xs">▲</button>
                <span className="font-black text-gray-800 text-xs">{q.upvotes || 0}</span>
                <button onClick={(e) => handleVote(e, q.id, q.createdAt, 'DOWN')} className="p-1 hover:text-indigo-500 text-gray-400 text-xs">▼</button>
              </div>
              
              {/* FIXED: min-w-0 ensures truncation works properly inside a flex container */}
              <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-900 text-sm md:text-base mb-2 leading-tight">{q.title}</h4>
                
                {/* FIXED: flex-wrap prevents overflow, truncate handles long names */}
                <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <span className="bg-indigo-50 text-indigo-600 px-2 py-1 rounded border border-indigo-100 shrink-0">{q.category || 'General'}</span>
                  <span className="truncate max-w-[90px] sm:max-w-[120px]" title={q.author_name}>👤 {q.author_name}</span>
                  <span className="shrink-0 text-indigo-400 ml-auto">💬 Reply</span>
                </div>
              </div>
            </div>

            {/* EXPANDED COMMENT SECTION */}
            {expandedId === q.id && (
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <div className="flex gap-2 mb-6">
                  <input 
                    type="text" placeholder="Write a reply..." value={newComment} onChange={e => setNewComment(e.target.value)}
                    className="flex-1 p-3 rounded-xl border border-gray-200 focus:border-indigo-500 outline-none text-sm font-medium"
                    onKeyDown={(e) => e.key === 'Enter' && handlePostReply(q.id, q.author_id)}
                  />
                  <button onClick={() => handlePostReply(q.id, q.author_id)} className="px-4 bg-gray-900 text-white font-bold rounded-xl text-xs hover:bg-gray-800">Reply</button>
                </div>

                <div className="space-y-4 pl-1">
                  {threadComments.map(c => (
                    <div key={c.id} className="flex gap-3">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-black text-[10px] mt-1 shrink-0">{c.author_name.charAt(0)}</div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-xs text-gray-900 truncate max-w-[100px]">{c.author_name}</span>
                          <span className="text-[10px] text-gray-400 shrink-0">{new Date(c.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-xs text-gray-700 font-medium break-words">{c.content}</p>
                      </div>
                    </div>
                  ))}
                  {threadComments.length === 0 && <p className="text-xs text-gray-400 italic">No replies yet.</p>}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}