import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signIn, signUp, confirmSignUp, fetchAuthSession } from 'aws-amplify/auth';

// Replace with your actual API Gateway URL
const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function AuthBox() {
  const navigate = useNavigate();
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [university, setUniversity] = useState('');
  const [visaRequired, setVisaRequired] = useState('Yes');
  const [code, setCode] = useState('');
  
  // UI States (1: Login/Signup, 2: Profile Setup, 3: Verification)
  const [step, setStep] = useState(1);
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleNextStep = (e) => {
    e.preventDefault();
    if (isSignUp && step === 1) {
      setStep(2); // Move to profile details
    } else {
      handleAuth(e);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      if (step === 3) {
        // Step 3A: Confirm Email
        const { isSignUpComplete } = await confirmSignUp({
          username: email,
          confirmationCode: code
        });
        
        if (isSignUpComplete) {
          setMessage('Email verified! Setting up your profile...');
          
          // Step 3B: Log them in silently to get their auth token
          await signIn({ username: email, password });
          const { tokens } = await fetchAuthSession();
          
          // Step 3C: Send their custom onboarding data to your DynamoDB table!
          await fetch(`${API_URL}/profile`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${tokens.idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              university: university,
              visaRequired: visaRequired
            })
          });

          setMessage('Profile complete! Logging you in...');
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } else if (isSignUp && step === 2) {
        // Step 2: Create Account in Cognito
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
        
        setMessage('Check your email for the 6-digit code!');
        setStep(3); 
      } else {
        // Step 1: Standard Login Route
        const { isSignedIn } = await signIn({ username: email, password: password });
        if (isSignedIn) {
          setMessage('Welcome back!');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      }
    } catch (error) {
      setMessage(error.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
      
      {/* Dynamic Header */}
      <div className="mb-6 text-center">
        <h3 className="font-black text-2xl text-gray-900 tracking-tight">
          {step === 3 ? 'Verify Your Email' : (isSignUp ? 'Join StudentStack' : 'Welcome Back')}
        </h3>
        {isSignUp && step < 3 && (
          <div className="flex justify-center gap-2 mt-4">
            <div className={`h-1.5 w-8 rounded-full ${step >= 1 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-1.5 w-8 rounded-full ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`h-1.5 w-8 rounded-full ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`} />
          </div>
        )}
      </div>
      
      <form onSubmit={handleNextStep} className="space-y-4">
        
        {/* STEP 1: Credentials */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">University Email</label>
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Password</label>
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="8"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
              />
            </div>
          </div>
        )}

        {/* STEP 2: Onboarding Details */}
        {step === 2 && isSignUp && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">Full Name</label>
              <input 
                type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-1 block">University</label>
              <input 
                type="text" value={university} onChange={(e) => setUniversity(e.target.value)} required placeholder="e.g. University of Manchester"
                className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors text-sm font-medium"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1 mb-2 block">Will you require Visa Sponsorship?</label>
              <div className="flex gap-4">
                <label className={`flex-1 p-3 border rounded-xl text-center cursor-pointer font-bold transition-all ${visaRequired === 'Yes' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                  <input type="radio" name="visa" value="Yes" className="hidden" onChange={(e) => setVisaRequired(e.target.value)} checked={visaRequired === 'Yes'} /> Yes
                </label>
                <label className={`flex-1 p-3 border rounded-xl text-center cursor-pointer font-bold transition-all ${visaRequired === 'No' ? 'border-blue-600 bg-blue-50 text-blue-600' : 'border-gray-200 text-gray-400 hover:bg-gray-50'}`}>
                  <input type="radio" name="visa" value="No" className="hidden" onChange={(e) => setVisaRequired(e.target.value)} checked={visaRequired === 'No'} /> No
                </label>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Verification */}
        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-300">
            <label className="text-xs font-bold text-gray-500 uppercase tracking-widest text-center mb-2 block">Enter Security Code</label>
            <input 
              type="text" value={code} onChange={(e) => setCode(e.target.value)} required autoFocus
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 text-center tracking-[0.5em] font-mono focus:bg-white focus:outline-none focus:border-blue-500 text-2xl"
            />
          </div>
        )}

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 mt-4 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-slate-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : (step === 1 && isSignUp ? 'Continue' : step === 3 ? 'Verify & Enter' : (isSignUp ? 'Create Profile' : 'Log In'))}
        </button>
      </form>

      {message && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-bold text-center ${message.toLowerCase().includes('error') || message.toLowerCase().includes('failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {message}
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="ml-2 font-black text-blue-600 hover:underline">
              {isSignUp ? 'Log in here' : 'Sign up for free'}
            </button>
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 text-center">
          <button type="button" onClick={() => setStep(1)} className="text-sm font-bold text-gray-400 hover:text-gray-800">
            &larr; Back to login details
          </button>
        </div>
      )}
    </div>
  );
}