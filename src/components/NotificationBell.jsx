import React, { useState, useEffect, useRef } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function NotificationBell() {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const bellRef = useRef(null);
  const navigate = useNavigate();

const fetchNotifications = async () => {
    try {
      const { tokens } = await fetchAuthSession();
      console.log("🔔 Fetching notifications...");
      
      const res = await fetch(`${API_URL}/notifications`, {
        headers: { 'Authorization': `Bearer ${tokens.idToken.toString()}` }
      });
      
      if (!res.ok) {
        console.error("🔔 API Error Status:", res.status);
        return;
      }
      
      const data = await res.json();
      console.log("🔔 Data received from AWS:", data);
      setNotifications(data?.notifications || []);
    } catch (e) { 
      console.error("🔔 Fetch crashed:", e);
    }
  };

  // Poll every 30 seconds
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

const handleNotificationClick = async (notification) => {
    setIsOpen(false);

    // 1. Instantly mark as read in local UI so the red bubble shrinks
    setNotifications(prev => prev.map(n => 
      n.id === notification.id ? { ...n, read: true } : n
    ));

    // 2. Tell the backend to mark it as read
    try {
      const { tokens } = await fetchAuthSession();
      fetch(`${API_URL}/notifications/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ createdAt: notification.createdAt })
      });
    } catch (e) { console.error("Failed to mark read"); }

    // 3. Navigate to the blog, and append the specific comment ID to the URL if it exists
    const targetUrl = notification.commentId 
      ? `/community/${notification.blogId}#comment-${notification.commentId}`
      : `/community/${notification.blogId}`;
      
    navigate(targetUrl);
  };
const handleMarkAllRead = async () => {
    // 1. Optimistically clear local UI
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));

    // 2. We can loop through the unread ones and hit the backend
    const unread = notifications.filter(n => !n.read);
    try {
      const { tokens } = await fetchAuthSession();
      for (const n of unread) {
        await fetch(`${API_URL}/notifications/read`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokens.idToken.toString()}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ createdAt: n.createdAt })
        });
      }
    } catch (e) { console.error("Failed to mark all read"); }
  };
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={bellRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="relative p-2 hover:bg-blue-700 rounded-full transition-colors focus:outline-none"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-blue-600">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <span className="font-black text-gray-900">Notifications</span>
            {unreadCount > 0 && (
              // Change this:
                <span onClick={handleMarkAllRead} className="text-xs font-bold text-blue-600 cursor-pointer hover:text-blue-800">
                Mark all read
              </span>
            )}
          </div>
          
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-3xl mb-2 grayscale opacity-50">📭</div>
                <p className="text-sm font-medium text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              notifications.map(n => (
                <div 
                  key={n.id} 
                  // ✅ CORRECT: Passing the whole notification object
onClick={() => handleNotificationClick(n)}
                  className={`p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors flex gap-3 ${!n.read ? 'bg-blue-50/50' : ''}`}
                >
                  <div className="mt-1 text-xl">
                    {n.type === 'LIKE' ? '❤️' : '💬'}
                  </div>
                  <div>
                    <p className={`text-sm ${!n.read ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                      {n.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}