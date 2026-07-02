import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, confirmSignUp } from 'aws-amplify/auth';

export default function AuthBox() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // UI States
  const [isSignUp, setIsSignUp] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (showVerification) {
        // Step 3: Confirm the email code
        const { isSignUpComplete } = await confirmSignUp({
          username: email,
          confirmationCode: code
        });
        
        if (isSignUpComplete) {
          setMessage('Email verified! You can now log in.');
          setShowVerification(false);
          setIsSignUp(false);
        }
      } else if (isSignUp) {
        // Step 1: Create a new user with their actual name
        await signUp({
          username: email,
          password: password,
          options: {
            userAttributes: {
              email: email,
              name: name 
            }
          }
        });
        
        setMessage('Check your university email for the 6-digit code!');
        setShowVerification(true); 
        
      } else {
        // Step 2: Log in existing user
        const { isSignedIn } = await signIn({ 
          username: email, 
          password: password 
        });

        if (isSignedIn) {
          setMessage('Welcome back!');
          setTimeout(() => navigate('/community'), 1000);
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-t-4 border-slate-800">
      <h3 className="font-bold text-xl mb-2 text-center text-gray-800">
        {showVerification ? 'Verify Your Email' : (isSignUp ? 'Create Student Account' : 'Student Login')}
      </h3>
      
      <form onSubmit={handleAuth} className="space-y-3 mt-4">
        {!showVerification ? (
          <>
            {isSignUp && (
              <input 
                type="text" 
                placeholder="Full Name" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500 text-sm"
              />
            )}
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
              placeholder="Password (min 8 chars)" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:border-slate-500 text-sm"
            />
          </>
        ) : (
          <input 
            type="text" 
            placeholder="6-digit code from email" 
            value={code}
            onChange={(e) => setCode(e.target.value)}
            required
            className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50 text-center tracking-widest font-mono focus:outline-none focus:border-slate-500 text-lg"
          />
        )}

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-slate-800 text-white text-sm font-bold rounded-lg hover:bg-slate-900 transition shadow-md disabled:bg-slate-400"
        >
          {loading ? 'Processing...' : (showVerification ? 'Verify Code' : (isSignUp ? 'Sign Up' : 'Log In'))}
        </button>
      </form>

      {message && (
        <p className={`mt-4 text-center text-sm font-bold ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') ? 'text-red-500' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      {!showVerification && (
        <div className="mt-4 text-center">
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-slate-500 hover:text-slate-800 underline"
          >
            {isSignUp ? 'Already have an account? Log in' : 'Need an account? Sign up'}
          </button>
        </div>
      )}
    </div>
  );
}