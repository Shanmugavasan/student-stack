import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom'; // Add useLocation
import Markdown from 'react-markdown';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function DynamicBlogPage() {
  const { blogId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // <-- Add this here
  
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  // Voting State
  const [userVote, setUserVote] = useState('NONE'); // UP, DOWN, or NONE
  const [localScore, setLocalScore] = useState(0);

  // Reply State
  const [replyingTo, setReplyingTo] = useState(null);

// Listen for hash changes in the URL to scroll to specific comments
// Fetch blog data when component mounts or blogId changes
useEffect(() => {
    const fetchBlog = async () => {
      try {
        setIsLoading(true);
        // We need the createdAt timestamp from the route, OR we need to 
        // fetch the list first and filter (easiest for now).
        const response = await fetch(`${API_URL}/blogs`); 
        const data = await response.json();
        
        if (response.ok && data.blogs) {
          // Find the specific blog from the list since we don't have createdAt in the URL
          const foundBlog = data.blogs.find(b => b.id === blogId);
          setBlog(foundBlog || null);
          setLocalScore(foundBlog?.likes || 0);
        }
      } catch (error) {
        console.error("Error fetching blog:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [blogId]);

  const handleVote = async (direction) => {
    try {
      const { tokens } = await fetchAuthSession();
      
      let newVoteState = direction;
      if (userVote === direction) newVoteState = "NONE"; 

      // Optimistically update the button color instantly for snappy UX
      const oldVote = userVote;
      setUserVote(newVoteState);
      
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetId: blog.id,
          targetType: "BLOG",
          action: newVoteState,
          blogCreatedAt: blog.createdAt
        })
      });

      const data = await response.json();

      // STRICT CHECK: Only change the number if the backend actually updated the database!
      if (response.ok && data.scoreChange !== undefined) {
         setLocalScore(prev => prev + data.scoreChange);
      } else {
         // If backend says "No change" or fails, revert the button color
         setUserVote(oldVote);
      }

    } catch (error) {
      console.error(error);
      alert("Please log in to vote.");
    }
  };

  const handlePostComment = async (parentId = null, contentOverride = null, replyToUserId = null) => {
    const content = contentOverride || newComment;
    if (!content.trim()) return;

    try {
      const { tokens } = await fetchAuthSession();
      
      const response = await fetch(`${API_URL}/comments`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          blogId: blog.id,
          content: content,
          parentId: parentId,
          blogAuthorId: blog.author_id,
          replyToUserId: replyToUserId
        })
      });

      if (response.ok) {
        const savedComment = await response.json();
        setComments([...comments, savedComment]); 
        if(!parentId) setNewComment('');
        setReplyingTo(null);
      }
    } catch (error) {
      alert("Please log in to comment.");
    }
  };

  // Helper to build the comment tree
  const buildCommentTree = (commentsArray, parentId = null) => {
    return commentsArray
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        children: buildCommentTree(commentsArray, c.id)
      }));
  };

  // Recursive Component for Rendering Comments
  const CommentThread = ({ thread, depth = 0 }) => {
    return (
      <div className={`mt-4 ${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
        {thread.map(comment => (
          // Change this:
        <div key={comment.id} id={`comment-${comment.id}`} className="mb-6 p-4 rounded-2xl -ml-4 transition-colors duration-1000">
            <div className="flex items-start gap-3">
               <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-500 text-xs flex-shrink-0 mt-1">
                {comment.author_name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-bold text-gray-900 text-sm">{comment.author_name}</span>
                  <span className="text-xs text-gray-400">· {new Date(comment.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-gray-700 text-sm">{comment.content}</p>
                
                <div className="flex gap-4 mt-2">
                   <button 
                     onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                     className="text-xs font-bold text-gray-400 hover:text-blue-600 flex items-center gap-1"
                   >
                     💬 Reply
                   </button>
                </div>

                {/* Inline Reply Input */}
                {replyingTo === comment.id && (
                   <div className="mt-3 flex gap-2">
                     <input 
                        type="text" 
                        autoFocus
                        placeholder={`Reply to ${comment.author_name}...`}
                        className="flex-1 p-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
// ✅ CORRECT:
if(e.key === 'Enter') handlePostComment(comment.id, e.target.value, comment.author_id);
                        }}
                     />
                   </div>
                )}
              </div>
            </div>
            
            {/* Render nested children */}
            {comment.children && comment.children.length > 0 && (
              <CommentThread thread={comment.children} depth={depth + 1} />
            )}
          </div>
        ))}
      </div>
    );
  };

  const commentTree = buildCommentTree(comments);

  if (isLoading) return <div className="max-w-3xl mx-auto py-20 text-center animate-pulse">Loading...</div>;
  if (!blog) return <div className="max-w-3xl mx-auto py-20 text-center">Post Not Found</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={() => navigate('/community')} className="text-sm font-bold text-gray-400 hover:text-gray-800 mb-8 block">
        &larr; Back to Community
      </button>

      {/* START OF ARTICLE BLOCK */}
      <article className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8">
        
        {/* Header Metadata */}
        <div className="mb-8 border-b border-gray-100 pb-8">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{blog.title}</h1>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl grayscale shadow-inner">👤</div>
            <div>
              <p className="font-bold text-gray-900 flex items-center gap-1">
                {blog.author_name} {blog.isVerified && <span className="text-blue-500">☑️</span>}
              </p>
              <p className="text-xs text-gray-500">Published {new Date(blog.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="text-gray-700 leading-relaxed font-medium markdown-body">
          <Markdown components={{
              h3: ({node, ...props}) => <h3 className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tight" {...props} />,
              p: ({node, ...props}) => <p className="mb-4 text-base leading-relaxed text-gray-600" {...props} />,
              ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600" {...props} />
            }}>
            {blog.content}
          </Markdown>
        </div>

        {/* Improved Reddit-Style Voting Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
          <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
             <button 
               onClick={() => handleVote('UP')}
               className={`p-2 rounded-full transition-colors ${userVote === 'UP' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200 text-gray-400'}`}
             >
               ▲
             </button>
             <span className={`px-4 font-black ${userVote === 'UP' ? 'text-orange-600' : userVote === 'DOWN' ? 'text-indigo-600' : 'text-gray-700'}`}>
                {localScore}
             </span>
             <button 
               onClick={() => handleVote('DOWN')}
               className={`p-2 rounded-full transition-colors ${userVote === 'DOWN' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-400'}`}
             >
               ▼
             </button>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-full hover:bg-blue-50 text-gray-500 hover:text-blue-600 font-bold transition-colors border border-gray-200">
            🔗 Share
          </button>
        </div>
      </article>
      {/* END OF ARTICLE BLOCK */}

      {/* Discussion Section */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-8">Discussion ({comments.length})</h3>
        
        <div className="mb-10">
            <textarea 
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none font-medium text-gray-800"
            />
            <div className="flex justify-end mt-2">
              <button onClick={() => handlePostComment(null)} className="bg-blue-600 text-white px-6 py-2 font-bold rounded-full hover:bg-blue-700 transition-colors">
                Comment
              </button>
            </div>
        </div>

        {/* Renders the recursive tree */}
        <CommentThread thread={commentTree} />
        
      </div>
    </div>
  );
}