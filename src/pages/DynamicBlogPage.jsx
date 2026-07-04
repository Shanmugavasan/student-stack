import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Markdown from 'react-markdown';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_URL = 'https://64lm64wl72.execute-api.eu-north-1.amazonaws.com';

export default function DynamicBlogPage() {
  const { blogId } = useParams(); // Acts as the generic 'postId'
  const navigate = useNavigate();
  const location = useLocation();
  
  const [post, setPost] = useState(null);
  const [postType, setPostType] = useState(null); // 'BLOG' or 'QUESTION'
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [userVote, setUserVote] = useState('NONE');
  const [localScore, setLocalScore] = useState(0);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    if (location.hash && comments.length > 0) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('bg-amber-100', 'transition-colors', 'duration-500');
          setTimeout(() => {
            element.classList.remove('bg-amber-100');
            element.classList.add('bg-transparent');
          }, 3000);
        }
      }, 300);
    }
  }, [location.hash, comments]);

  // SMART FETCH: Checks Blogs first, then checks Q&A
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // 1. Try fetching from Blogs
        const blogRes = await fetch(`${API_URL}/blogs`); 
        const blogData = await blogRes.json();
        let foundPost = blogData.blogs?.find(b => b.id === blogId);
        let type = 'BLOG';

        // 2. If not a Blog, try fetching from Q&A Forum
        if (!foundPost) {
          const qRes = await fetch(`${API_URL}/forum`);
          const qData = await qRes.json();
          foundPost = qData.questions?.find(q => q.id === blogId);
          type = 'QUESTION';
        }
        
        if (foundPost) {
          setPost(foundPost);
          setPostType(type);
          setLocalScore(type === 'BLOG' ? (foundPost.likes || 0) : (foundPost.upvotes || 0));

          // 3. Fetch the Comments for this post ID
          const commentsRes = await fetch(`${API_URL}/comments?blogId=${blogId}`);
          const commentsData = await commentsRes.json();
          setComments(commentsData.comments || []);
        } else {
          setPost(null);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (blogId) fetchData();
  }, [blogId]);

  const handleVote = async (direction) => {
    try {
      const { tokens } = await fetchAuthSession();
      let newVoteState = direction;
      if (userVote === direction) newVoteState = "NONE"; 

      const oldVote = userVote;
      setUserVote(newVoteState);
      
      const response = await fetch(`${API_URL}/vote`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokens.idToken.toString()}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetId: post.id,
          targetType: postType, // 'BLOG' or 'QUESTION'
          action: newVoteState,
          blogCreatedAt: post.createdAt,     // Lambda looks for this for Blogs
          targetCreatedAt: post.createdAt    // Lambda looks for this for Questions
        })
      });

      const data = await response.json();
      if (response.ok && data.scoreChange !== undefined) {
         setLocalScore(prev => prev + data.scoreChange);
      } else {
         setUserVote(oldVote);
      }
    } catch (error) {
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
          blogId: post.id,
          content: content,
          parentId: parentId,
          blogAuthorId: post.author_id,
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

  const buildCommentTree = (commentsArray, parentId = null) => {
    return commentsArray
      .filter(c => c.parentId === parentId)
      .map(c => ({
        ...c,
        children: buildCommentTree(commentsArray, c.id)
      }));
  };

  const CommentThread = ({ thread, depth = 0 }) => {
    return (
      <div className={`mt-4 ${depth > 0 ? 'ml-4 md:ml-8 pl-4 border-l-2 border-gray-100' : ''}`}>
        {thread.map(comment => (
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

                {replyingTo === comment.id && (
                   <div className="mt-3 flex gap-2">
                     <input 
                        type="text" autoFocus placeholder={`Reply to ${comment.author_name}...`}
                        className="flex-1 p-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500"
                        onKeyDown={(e) => {
                          if(e.key === 'Enter') handlePostComment(comment.id, e.target.value, comment.author_id);
                        }}
                     />
                   </div>
                )}
              </div>
            </div>
            
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
  if (!post) return <div className="max-w-3xl mx-auto py-20 text-center">Post Not Found</div>;

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <button onClick={() => navigate('/community')} className="text-sm font-bold text-gray-400 hover:text-gray-800 mb-8 block">
        &larr; Back to Community
      </button>

      {/* RENDER QUESTION UI */}
      {postType === 'QUESTION' && (
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8 flex gap-6">
          {/* Left Reddit Vote Bar */}
          <div className="flex flex-col items-center bg-gray-50 rounded-2xl p-2 h-fit border border-gray-100">
             <button onClick={() => handleVote('UP')} className={`p-2 rounded-xl transition-colors ${userVote === 'UP' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200 text-gray-400'}`}>▲</button>
             <span className={`py-2 font-black ${userVote === 'UP' ? 'text-orange-600' : userVote === 'DOWN' ? 'text-indigo-600' : 'text-gray-700'}`}>{localScore}</span>
             <button onClick={() => handleVote('DOWN')} className={`p-2 rounded-xl transition-colors ${userVote === 'DOWN' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-400'}`}>▼</button>
          </div>
          
          {/* Right Question Content */}
          <div className="flex-1">
            <div className="flex items-center gap-3 text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
              <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">{post.category || 'General'}</span>
              <span>Posted by {post.author_name}</span>
              <span>· {new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">{post.title}</h1>
          </div>
        </div>
      )}

      {/* RENDER BLOG UI */}
      {postType === 'BLOG' && (
        <article className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100 mb-8">
          <div className="mb-8 border-b border-gray-100 pb-8">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-6">{post.title}</h1>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-xl grayscale shadow-inner">👤</div>
              <div>
                <p className="font-bold text-gray-900 flex items-center gap-1">
                  {post.author_name} {post.isVerified && <span className="text-blue-500">☑️</span>}
                </p>
                <p className="text-xs text-gray-500">Published {new Date(post.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="text-gray-700 leading-relaxed font-medium markdown-body">
            <Markdown components={{
                h3: ({node, ...props}) => <h3 className="text-2xl font-black text-gray-900 mt-8 mb-4 tracking-tight" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-base leading-relaxed text-gray-600" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-6 space-y-2 text-gray-600" {...props} />
              }}>
              {post.content}
            </Markdown>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 flex items-center gap-4">
            <div className="flex items-center bg-gray-50 rounded-full border border-gray-200 p-1">
               <button onClick={() => handleVote('UP')} className={`p-2 rounded-full transition-colors ${userVote === 'UP' ? 'bg-orange-100 text-orange-600' : 'hover:bg-gray-200 text-gray-400'}`}>▲</button>
               <span className={`px-4 font-black ${userVote === 'UP' ? 'text-orange-600' : userVote === 'DOWN' ? 'text-indigo-600' : 'text-gray-700'}`}>{localScore}</span>
               <button onClick={() => handleVote('DOWN')} className={`p-2 rounded-full transition-colors ${userVote === 'DOWN' ? 'bg-indigo-100 text-indigo-600' : 'hover:bg-gray-200 text-gray-400'}`}>▼</button>
            </div>
          </div>
        </article>
      )}

      {/* UNIVERSAL DISCUSSION SECTION (Works for both!) */}
      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-gray-100">
        <h3 className="text-2xl font-black text-gray-900 mb-8">{postType === 'QUESTION' ? 'Answers' : 'Discussion'} ({comments.length})</h3>
        
        <div className="mb-10">
            <textarea 
              value={newComment} onChange={(e) => setNewComment(e.target.value)}
              placeholder={postType === 'QUESTION' ? "Write your answer..." : "What are your thoughts?"}
              className="w-full p-4 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none font-medium text-gray-800"
            />
            <div className="flex justify-end mt-2">
              <button onClick={() => handlePostComment(null)} className="bg-blue-600 text-white px-6 py-2 font-bold rounded-full hover:bg-blue-700 transition-colors">
                {postType === 'QUESTION' ? 'Post Answer' : 'Comment'}
              </button>
            </div>
        </div>

        <CommentThread thread={commentTree} />
      </div>
    </div>
  );
}