import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useAppContext } from '../contexts/AppContext';
import toast from 'react-hot-toast';

const Blog = () => {
  const { id } = useParams();
  const { axios, blogs, navigate, user } = useAppContext();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentForm, setCommentForm] = useState({ name: '', content: '' });
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentSubmitted, setCommentSubmitted] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchBlog();
      fetchComments();
    } else setLoading(false);
  }, [id]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`/api/blog/${id}`);
      if (data.success) setBlog(data.data);
      else setError(data.message);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blog post');
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}/comments`);
      if (data.success) setComments(data.data || []);
      else setComments([]);
    } catch (err) {
      console.error(err);
      setComments([]);
    }
  };

  const handleCommentChange = (e) => {
    setCommentForm({ ...commentForm, [e.target.name]: e.target.value });
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentForm.name.trim() || !commentForm.content.trim()) return;

    try {
      setSubmittingComment(true);
      const { data } = await axios.post('/api/blog/addComment', {
        blog: id,
        name: commentForm.name.trim(),
        content: commentForm.content.trim(),
      });

      if (data.success) {
        setCommentForm({ name: '', content: '' });
        setCommentSubmitted(true);
        fetchComments();
        toast.success('Comment submitted! Visible after admin approval.');
        setTimeout(() => setCommentSubmitted(false), 5000);
      } else {
        toast.error(data.message || 'Failed to post comment');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    try {
      const { data } = await axios.delete(`/api/blog/comment/${commentId}`);
      if (data.success) setComments((prev) => prev.filter((c) => c._id !== commentId));
      else toast.error(data.message || 'Failed to delete comment');
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete comment. Please try again.');
    }
  };

  const canDeleteComment = (comment) => {
    if (!user?.email) return false;
    return comment?.authorEmail && comment.authorEmail.toLowerCase() === user.email.toLowerCase();
  };

  if (!id) return <><Navbar /><p>Blog list here...</p></>;

  if (loading) return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex flex-1 items-center justify-center text-muted">Loading...</div>
    </div>
  );

  if (error || !blog) return (
    <div className="min-h-screen flex flex-col bg-page">
      <Navbar />
      <div className="flex flex-1 items-center justify-center text-muted">{error || 'Blog not found'}</div>
    </div>
  );

  const subtitle = blog.subtitle || blog.subTitle || '';

  return (
    <div className="min-h-screen bg-page">
      <Navbar />

      {/* Header */}
      <div className="py-6 lg:py-10 border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-4 text-muted text-sm flex-wrap">
              {blog.category && (
                <span className="inline-flex items-center gap-2 px-3 py-1 bg-accent text-white font-semibold rounded-full text-xs">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"/></svg>
                  {blog.category}
                </span>
              )}
              <span className="inline-flex items-center gap-2 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"/></svg>
                {new Date(blog.createdAt).toLocaleDateString()}
              </span>
              <span className="inline-flex items-center gap-2 font-medium">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                {blog.authorName || blog.authorEmail || 'Admin'}
              </span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-black text-heading leading-tight tracking-tight">{blog.title}</h1>
            {subtitle && <h2 className="text-lg lg:text-xl text-muted font-semibold italic">{subtitle}</h2>}
          </div>
        </div>
      </div>

      {/* Main content + Sidebar */}
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {blog.image && (
            <div className="relative overflow-hidden rounded-xl border border-border shadow-lg aspect-video">
              <img
                src={blog.image}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {subtitle && (
            <div className="border-l-4 border-accent pl-4 italic text-heading text-lg font-semibold bg-accent-soft p-4 rounded-r-lg">
              "{subtitle}"
            </div>
          )}

          <div className="bg-white border border-border shadow-md rounded-xl p-6">
            <div
              className="rich-text text-base leading-relaxed [&_img]:rounded-lg [&_img]:border [&_img]:border-border [&_img]:shadow-md [&_img]:hover:shadow-lg [&_img]:transition-shadow"
              dangerouslySetInnerHTML={{ __html: blog.description || '<p>No content available</p>' }}
            />
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Trending */}
          <div className="bg-white border border-border shadow-md rounded-xl p-4">
            <h3 className="font-bold text-heading mb-3 border-b border-border pb-2 inline-flex items-center gap-2 text-lg">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16s.5-1 4-1 4 1 4 1-1-4-4-7c-3 3-4 7-4 7z"/></svg>
              Trending
            </h3>
            <div className="space-y-3">
              {(blogs || []).slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,5).map(t => (
                <button key={t._id} onClick={()=> navigate(`/blog/${t._id}`)} className="flex items-center gap-3 w-full text-left hover:bg-accent-soft p-2 rounded-lg transition-all">
                  <img src={t.image} alt={t.title} className="w-16 h-12 object-cover rounded-lg border border-border" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-heading">{t.title}</p>
                    <p className="text-xs text-muted font-medium">{new Date(t.createdAt).toLocaleDateString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="bg-white border border-border shadow-md rounded-xl p-4">
            <h3 className="font-bold text-heading mb-3 border-b border-border pb-2 inline-flex items-center gap-2 text-lg">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(new Set((blogs||[]).map(b=>b.category))).slice(0,10).map(cat => (
                <span key={cat} className="px-3 py-1 text-xs bg-accent text-white font-semibold rounded-full hover:bg-accent-hover cursor-default inline-flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v12m6-6H6"/></svg>
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Recent Posts */}
          <div className="bg-white border border-border shadow-md rounded-xl p-4">
            <h3 className="font-bold text-heading mb-3 border-b border-border pb-2 inline-flex items-center gap-2 text-lg">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3M3 11h18M5 19h14a2 2 0 002-2v-6H3v6a2 2 0 002 2z"/></svg>
              Recent Posts
            </h3>
            <div className="space-y-2">
              {(blogs || []).slice().sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)).slice(0,6).map(r => (
                <button key={r._id} onClick={()=> navigate(`/blog/${r._id}`)} className="w-full text-left text-sm text-heading hover:text-accent hover:bg-accent-soft font-medium line-clamp-1 inline-flex items-center gap-2 p-2 rounded-lg transition-all">
                  <svg className="w-3.5 h-3.5 text-muted flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M2 10a8 8 0 1116 0A8 8 0 012 10zm8-5a1 1 0 011 1v3.382l2.447 1.224a1 1 0 11-.894 1.788l-3-1.5A1 1 0 019 10V6a1 1 0 011-1z"/></svg>
                  {r.title}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white border border-border shadow-md rounded-xl p-4">
            <h3 className="font-bold text-heading text-lg mb-4 border-b border-border pb-2 inline-flex items-center gap-2">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h6m-8 8l4-4h8a4 4 0 004-4V6a4 4 0 00-4-4H7a4 4 0 00-4 4v10a4 4 0 004 4z"/></svg>
              Comments ({comments.length})
            </h3>

            {commentSubmitted && (
              <div className="bg-accent-soft border border-accent/20 rounded-lg p-3 mb-4">
                <p className="text-heading font-semibold">Comment Submitted!</p>
                <p className="text-muted text-sm mt-1 font-medium">Visible after admin approval.</p>
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="space-y-3 mb-6">
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={commentForm.name}
                onChange={handleCommentChange}
                className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent font-medium text-heading placeholder-slate-400"
                disabled={commentSubmitted}
                required
              />
              <textarea
                name="content"
                placeholder="Add a comment..."
                value={commentForm.content}
                onChange={handleCommentChange}
                className="w-full border border-border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-accent resize-none font-medium text-heading placeholder-slate-400"
                rows="3"
                disabled={commentSubmitted}
                required
              />
              <button
                type="submit"
                disabled={submittingComment || commentSubmitted}
                className="bg-accent text-white px-5 py-2 font-semibold rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50"
              >
                {submittingComment ? 'Posting...' : 'Post Comment'}
              </button>
            </form>

            {comments.length === 0 ? (
              <p className="text-muted text-center font-medium">No comments yet.</p>
            ) : (
              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {comments.map((comment) => (
                  <div key={comment._id} className="border-b border-border pb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-heading">{comment.name}</span>
                      <span className="text-xs text-muted font-medium">{new Date(comment.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-muted font-medium">{comment.content}</p>
                    {canDeleteComment(comment) && (
                      <button onClick={() => handleDeleteComment(comment._id)} className="text-red-600 text-sm mt-1 hover:text-red-800 font-semibold inline-flex items-center gap-1 px-2 py-1 rounded hover:bg-red-50 transition-colors">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862A2 2 0 015.995 19.142L5.128 7m3.372 0V4a1 1 0 011-1h5a1 1 0 011 1v3M4 7h16"/></svg>
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button 
          onClick={() => window.history.back()}
          className="inline-flex items-center px-4 py-2 bg-accent text-white font-semibold rounded-lg hover:bg-accent-hover transition-colors"
        >
          ← Back to Blogs
        </button>
      </div>
    </div>
  );
};

export default Blog;
