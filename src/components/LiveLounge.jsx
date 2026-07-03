// src/components/LiveLounge.jsx
import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser } from 'aws-amplify/auth';

// Your live API Gateway WebSocket URL
const WS_URL = 'wss://qhcfiyl9y4.execute-api.eu-north-1.amazonaws.com/production/';

export default function LiveLounge() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  
  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const checkAuth = async () => {
      try { const u = await getCurrentUser(); setUser(u); } catch (e) { setUser(null); }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    ws.current = new WebSocket(WS_URL);
    ws.current.onopen = () => setIsConnected(true);
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    ws.current.onclose = () => setIsConnected(false);

    return () => { if (ws.current) ws.current.close(); };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || !isConnected) return;

    const userName = user?.signInDetails?.loginId?.split('@')[0] || 'Anonymous Student';
    ws.current.send(JSON.stringify({ action: 'sendMessage', message: input, user: userName }));
    setInput('');
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex flex-col h-[70vh] bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="flex justify-between items-center bg-gray-50 p-6 border-b border-gray-100">
        <div>
          <h3 className="text-xl font-black flex items-center gap-2">🔴 Global Student Lounge</h3>
          <p className="text-xs text-gray-500 mt-1 font-medium">Real-time networking. Be kind!</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-gray-200 shadow-sm">
          <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
            {isConnected ? 'Connected' : 'Connecting...'}
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-4 bg-slate-50/50">
        {messages.length === 0 ? (
          <div className="m-auto text-center text-gray-400 font-medium">
            <p className="text-4xl mb-2">👋</p>
            <p>The lounge is quiet. Say hello!</p>
          </div>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`flex flex-col max-w-[75%] ${msg.user === (user?.signInDetails?.loginId?.split('@')[0] || 'Anonymous Student') ? 'self-end items-end' : 'self-start items-start'}`}>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1 ml-1">
                {msg.user} • {formatTime(msg.timestamp)}
              </span>
              <div className={`px-5 py-3 rounded-2xl shadow-sm text-sm ${msg.user === (user?.signInDetails?.loginId?.split('@')[0] || 'Anonymous Student') ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'}`}>
                {msg.message}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-100 flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={user ? "Type a message..." : "Log in to chat under your name..."}
          className="flex-grow bg-gray-50 border border-gray-200 p-4 rounded-xl focus:outline-none focus:border-blue-500 focus:bg-white transition-colors text-sm font-medium"
          disabled={!isConnected}
        />
        <button
          type="submit"
          disabled={!isConnected || !input.trim()}
          className="bg-blue-600 text-white px-8 font-black rounded-xl hover:bg-blue-700 transition-colors shadow-md disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}