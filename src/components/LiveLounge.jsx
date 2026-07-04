import React, { useState, useEffect, useRef } from 'react';
import { getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';

const WS_URL = 'wss://fucqeup8cl.execute-api.eu-north-1.amazonaws.com/production/';
const REST_API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function LiveLounge() {
  // --- STATE ---
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState(null);
  
  const [currentLounge, setCurrentLounge] = useState('General'); 
  const [isLoadingChat, setIsLoadingChat] = useState(true);
  
  const [lounges, setLounges] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [newLoungeName, setNewLoungeName] = useState('');
  const [newLoungeDesc, setNewLoungeDesc] = useState('');

  // NEW: Members & Roles State
  const [members, setMembers] = useState([]);
  const [showMembers, setShowMembers] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null); // For Mod Actions

  const ws = useRef(null);
  const messagesEndRef = useRef(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const init = async () => {
      try { const u = await getCurrentUser(); setUser(u); } catch (e) { setUser(null); }
      fetchLounges();
    };
    init();
  }, []);

  const fetchLounges = async () => {
    try {
      const res = await fetch(`${REST_API_URL}/lounges`);
      if (res.ok) {
        const data = await res.json();
        setLounges(data.lounges || []);
      }
    } catch (err) { console.error("Failed to fetch lounges", err); }
  };

  // --- ROOM DATA FETCHING (Messages & Members) ---
  const fetchRoomData = async (loungeId) => {
    setIsLoadingChat(true);
    try {
      // 1. Fetch Messages
      const msgRes = await fetch(`${REST_API_URL}/messages?room=${encodeURIComponent(loungeId)}`);
      if (msgRes.ok) {
        const msgData = await msgRes.json();
        setMessages(msgData.messages || []);
      }

      // 2. Fetch Members
      const memRes = await fetch(`${REST_API_URL}/lounges/members?loungeId=${encodeURIComponent(loungeId)}`);
      if (memRes.ok) {
        const memData = await memRes.json();
        setMembers(memData.members || []);
      }
    } catch (err) {
      console.error("Failed to fetch room data", err);
    } finally {
      setIsLoadingChat(false);
    }
  };

  // --- WEBSOCKET CONNECTION ---
  useEffect(() => {
    const socket = new WebSocket(WS_URL);
    ws.current = socket;
    
    socket.onopen = () => setIsConnected(true);
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    
    socket.onclose = () => setIsConnected(false);

    return () => { if (socket.readyState === 1) socket.close(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  useEffect(() => {
    if (isConnected && ws.current?.readyState === 1) {
      setMessages([]); 
      fetchRoomData(currentLounge); 
      ws.current.send(JSON.stringify({ action: 'joinLounge', loungeId: currentLounge })); 
    }
  }, [currentLounge, isConnected]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // --- CHECK CURRENT USER ROLE ---
  const currentUserRole = members.find(m => m.userId === user?.userId)?.role || 'NONE';
  const isOwnerOrMod = currentUserRole === 'OWNER' || currentUserRole === 'MODERATOR';

  // --- ACTIONS ---
  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || !isConnected) return;

    const userName = user?.signInDetails?.loginId?.split('@')[0] || user?.username || 'Anonymous Student';
    const userId = user?.userId || 'anonymous';
    
    ws.current.send(JSON.stringify({ 
      action: 'sendMessage', 
      message: input, 
      user: userName,
      userId: userId,
      loungeId: currentLounge,
      role: currentUserRole // Attach role for dynamic badges
    }));
    
    setInput('');
  };

  const handleCreateLounge = async (e) => {
    e.preventDefault();
    if (!newLoungeName.trim()) return;
    try {
      const { tokens } = await fetchAuthSession();
      const res = await fetch(`${REST_API_URL}/lounges`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLoungeName, description: newLoungeDesc })
      });
      if (res.ok) {
        setIsCreating(false);
        setNewLoungeName('');
        setNewLoungeDesc('');
        fetchLounges(); 
        setCurrentLounge(newLoungeName); 
      }
    } catch (err) { alert("Please log in to create a lounge."); }
  };

  const handleJoinLounge = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      const res = await fetch(`${REST_API_URL}/lounges/members`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ loungeId: currentLounge, action: 'JOIN' })
      });
      if (res.ok) fetchRoomData(currentLounge);
    } catch (err) { alert("Log in to join."); }
  };

  const handleModeration = async (targetUserId, action) => {
    try {
      const { tokens } = await fetchAuthSession();
      const res = await fetch(`${REST_API_URL}/lounges/members`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ loungeId: currentLounge, targetUserId, action })
      });
      if (res.ok) {
        setSelectedMember(null);
        fetchRoomData(currentLounge); // Refresh list
      }
    } catch (err) { alert("Action failed."); }
  };

  // --- HELPERS ---
  const formatTime = (isoString) => {
    if (!isoString) return '';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderBadge = (role) => {
    if (role === 'OWNER') return <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[8px] font-black ml-1">👑 OWNER</span>;
    if (role === 'MODERATOR') return <span className="bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded text-[8px] font-black ml-1">🛡️ MOD</span>;
    return null;
  };

  return (
    <div className="flex flex-col md:flex-row h-[75vh] bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/40 overflow-hidden relative">
      
      {/* CREATE LOUNGE MODAL */}
      {isCreating && (
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateLounge} className="bg-white p-8 rounded-[2rem] shadow-2xl border border-gray-100 w-full max-w-md">
            <h3 className="text-2xl font-black text-gray-900 mb-2">Create a Lounge</h3>
            <p className="text-sm text-gray-500 mb-6 font-medium">Start a new space for your community.</p>
            <input 
              type="text" placeholder="Lounge Name (e.g. UCL Tech Society)" value={newLoungeName} onChange={e => setNewLoungeName(e.target.value)}
              className="w-full mb-4 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 font-bold" autoFocus
            />
            <textarea 
              placeholder="What is this space for?" value={newLoungeDesc} onChange={e => setNewLoungeDesc(e.target.value)}
              className="w-full mb-6 p-4 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:border-blue-500 text-sm font-medium h-24 resize-none"
            />
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Cancel</button>
              <button type="submit" className="px-6 py-3 rounded-xl font-black text-white bg-blue-600 hover:bg-blue-700 shadow-md">Create</button>
            </div>
          </form>
        </div>
      )}

      {/* LEFT SIDEBAR: DIRECTORY */}
      <div className="w-full md:w-1/4 bg-gray-50 border-r border-gray-100 flex flex-col h-48 md:h-full shrink-0">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-black text-gray-900 mb-4">Directory</h2>
          <button onClick={() => setIsCreating(true)} className="w-full py-3 bg-white border border-gray-200 rounded-xl text-sm font-black text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm flex items-center justify-center gap-2">
            <span>+</span> New Lounge
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <button onClick={() => setCurrentLounge('General')} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 ${currentLounge === 'General' ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
            🌎 General Lounge
          </button>
          {lounges.map(lounge => (
            <button key={lounge.id} onClick={() => setCurrentLounge(lounge.name)} className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex flex-col ${currentLounge === lounge.name ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
              <span># {lounge.name}</span>
              <span className={`text-[10px] mt-0.5 truncate ${currentLounge === lounge.name ? 'text-blue-200' : 'text-gray-400'}`}>
                {lounge.description || 'Community chat'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* MIDDLE PANEL: CHAT AREA */}
      <div className="flex-1 flex flex-col h-full bg-white relative min-w-0">
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white z-10 shadow-sm">
          <div>
            <h3 className="text-xl font-black flex items-center gap-2 text-gray-900">
              <span className="text-blue-600">#</span> {currentLounge}
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
              <div className={`w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-600">
                {isConnected ? 'Live' : 'Offline'}
              </span>
            </div>
            {/* TOGGLE MEMBERS PANEL BUTTON */}
            <button onClick={() => setShowMembers(!showMembers)} className="bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full flex items-center gap-2 transition-colors">
              👥 <span className="text-xs font-black text-gray-700">{members.length}</span>
            </button>
          </div>
        </div>

        <div className="flex-grow p-6 overflow-y-auto flex flex-col gap-5 bg-slate-50/50">
          {isLoadingChat ? (
            <div className="m-auto text-center text-gray-400 font-bold text-sm animate-pulse">Loading history...</div>
          ) : messages.length === 0 ? (
            <div className="m-auto text-center text-gray-400 font-medium">
              <p className="text-4xl mb-3">👋</p>
              <p>Welcome to <span className="font-bold text-gray-600">{currentLounge}</span>.</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = msg.userId === user?.userId || msg.user === (user?.signInDetails?.loginId?.split('@')[0]);
              return (
                <div key={msg.id || idx} className={`flex flex-col max-w-[85%] md:max-w-[70%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1.5 px-1 flex items-center">
                    {msg.user} {renderBadge(msg.role)} • {formatTime(msg.timestamp)}
                  </span>
                  <div className={`px-5 py-3.5 shadow-sm text-sm font-medium break-words ${isMe ? 'bg-blue-600 text-white rounded-2xl rounded-tr-sm' : 'bg-white border border-gray-200 text-gray-800 rounded-2xl rounded-tl-sm'}`}>
                    {msg.message}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          {currentUserRole === 'NONE' && currentLounge !== 'General' ? (
            <button onClick={handleJoinLounge} className="w-full bg-emerald-500 text-white py-3 rounded-2xl font-black hover:bg-emerald-600 shadow-md">
              Join Lounge to Chat
            </button>
          ) : (
            <form onSubmit={sendMessage} className="flex gap-3 bg-gray-50 p-2 rounded-2xl border border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all shadow-inner">
              <input
                type="text" value={input} onChange={(e) => setInput(e.target.value)}
                placeholder={`Message ${currentLounge}...`}
                className="flex-grow bg-transparent p-3 focus:outline-none text-sm font-medium text-gray-800"
                disabled={!isConnected}
              />
              <button type="submit" disabled={!isConnected || !input.trim()} className="bg-blue-600 text-white px-8 font-black rounded-xl hover:bg-blue-700 shadow-md disabled:opacity-50">
                Send
              </button>
            </form>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR: MEMBERS & MODERATION */}
      {showMembers && (
        <div className="w-full md:w-64 bg-white border-l border-gray-100 flex flex-col h-full shrink-0 animate-in slide-in-from-right-8">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h4 className="font-black text-sm text-gray-900 uppercase tracking-wider">Members</h4>
            <button onClick={() => setShowMembers(false)} className="text-gray-400 hover:text-gray-800">✖</button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {members.map(m => (
              <div key={m.userId} className="relative">
                <div 
                  onClick={() => isOwnerOrMod && m.userId !== user?.userId ? setSelectedMember(selectedMember === m.userId ? null : m.userId) : null}
                  className={`p-3 flex items-center justify-between rounded-lg transition-colors ${isOwnerOrMod && m.userId !== user?.userId ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  <div className="flex flex-col min-w-0">
                    <span className="font-bold text-sm text-gray-800 truncate">{m.userName || 'Student'}</span>
                    {renderBadge(m.role)}
                  </div>
                  {isOwnerOrMod && m.userId !== user?.userId && <span className="text-gray-300 text-xs">⚙️</span>}
                </div>
                
                {/* MODERATION CONTEXT MENU */}
                {selectedMember === m.userId && (
                  <div className="m-2 p-2 bg-gray-900 rounded-xl shadow-lg flex flex-col gap-1 z-20">
                    {currentUserRole === 'OWNER' && m.role !== 'MODERATOR' && (
                      <button onClick={() => handleModeration(m.userId, 'PROMOTE')} className="text-xs font-bold text-left px-3 py-2 rounded text-emerald-400 hover:bg-gray-800">⬆️ Promote to Mod</button>
                    )}
                    {currentUserRole === 'OWNER' && m.role === 'MODERATOR' && (
                      <button onClick={() => handleModeration(m.userId, 'DEMOTE')} className="text-xs font-bold text-left px-3 py-2 rounded text-amber-400 hover:bg-gray-800">⬇️ Demote to Member</button>
                    )}
                    <button onClick={() => handleModeration(m.userId, 'KICK')} className="text-xs font-bold text-left px-3 py-2 rounded text-rose-400 hover:bg-gray-800">🛑 Kick from Lounge</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}