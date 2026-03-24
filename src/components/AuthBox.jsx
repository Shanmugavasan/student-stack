import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthBox() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (isSignUp) {
        // Create a brand new user
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });
        if (error) throw error;
        setMessage('Account created! You are logged in.');
        setTimeout(() => navigate('/community'), 1000); // Send them to the community page
      } else {
        // Log in an existing user
        const { error } = await supabase.auth.signInWithPassword({
          email: email,
          password: password,
        });
        if (error) throw error;
        setMessage('Welcome back!');
        setTimeout(() => navigate('/community'), 1000);
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-slate-800">
      <h3 className="font-bold text-xl mb-2 text-center text-gray-800">
        {isSignUp ? 'Create Student Account' : 'Student Login'}
      </h3>
      <p className="text-xs text-gray-500 text-center mb-4">
        {isSignUp ? 'Sign up to post on the forums.' : 'Sign in to save jobs and post blogs.'}
      </p>
      
      <form onSubmit={handleAuth} className="space-y-3">
        <input 
          type="email" 
          placeholder="Your university email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500 text-sm"
        />
        <input 
          type="password" 
          placeholder="Password (min 6 chars)" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500 text-sm"
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-900 transition shadow-md disabled:bg-slate-400"
        >
          {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
        </button>
      </form>

      {message && <p className={`mt-4 text-center text-sm font-bold ${message.includes('Error') || message.includes('Invalid') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}

      <div className="mt-4 text-center">
        <button 
          type="button" 
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-sm text-slate-500 hover:text-slate-800 underline"
        >
          {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
        </button>
      </div>
    </div>
  );
}