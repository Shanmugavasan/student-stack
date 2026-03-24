import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export default function QnaForum() {
  const [newQuestion, setNewQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1. Fetch live questions ONLY from Supabase when the page loads
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('forum_questions')
        .select('*')
        .order('created_at', { ascending: false }); // Newest questions at the top

      if (error) throw error;
      
      // Update the screen ONLY with data that actually exists in the database
      if (data) setQuestions(data); 
    } catch (error) {
      console.error("Error fetching questions:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Insert the new question directly into the database
  const handleAsk = async (e) => {
    e.preventDefault();
    if (!newQuestion.trim()) return;

    // Check if the user is actually logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("You need to log in to ask a question!");
      return;
    }

    try {
      // Push the data to Supabase
      const { error } = await supabase
        .from('forum_questions')
        .insert([
          { 
            title: newQuestion, 
            author_id: session.user.id, 
            author_name: session.user.email.split('@')[0], 
            tags: ['New'] 
          }
        ]);

      if (error) throw error;
      
      // Clear the text box
      setNewQuestion('');
      
      // CRITICAL STEP: Instead of just putting it on the screen, 
      // we tell React to download the fresh list from the database.
      fetchQuestions(); 
      
    } catch (error) {
      console.error("Error posting question:", error.message);
      alert("Failed to post. " + error.message);
    }
  };

  return (
    <section id="qna" className="mt-12 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold border-l-4 border-indigo-500 pl-3">Student Q&A</h3>
      </div>

      <form onSubmit={handleAsk} className="mb-6 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex gap-3">
        <input 
          type="text" 
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="Ask the community a question..." 
          className="flex-grow p-3 rounded-lg border border-white shadow-sm focus:outline-none focus:border-indigo-300"
        />
        <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-sm">
          Ask
        </button>
      </form>

      <div className="space-y-3">
        {isLoading ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-100 animate-pulse">
            Loading community questions...
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center text-gray-500 py-8 bg-white rounded-xl border border-gray-100">
            No questions yet. Be the first to ask!
          </div>
        ) : (
          questions.map((q) => (
            <div key={q.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:border-indigo-200 transition">
              <h4 className="font-bold text-gray-800 text-lg mb-2">{q.title}</h4>
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><span className="text-indigo-500 font-bold">&uarr;</span> {q.upvotes || 1}</span>
                  <span>Asked by <span className="text-gray-700 font-medium">{q.author_name}</span></span>
                </div>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  {q.tags && q.tags.map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}