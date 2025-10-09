import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Comments = () => {
  const { axios, user, navigate } = useAppContext()
  const [comments, setComments] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  // Fetch comments from backend
  useEffect(() => {
    // Redirect non-admins away from admin comments page
    if (user && user.role !== 'admin') {
      toast.error('Admin access required')
      navigate('/')
      return
    }
    fetchComments()
  }, [user])

  const fetchComments = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/admin/comments')
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message || 'Failed to fetch comments')
      }
    } catch (error) {
      console.error('Fetch comments error:', error)
      toast.error('Failed to fetch comments. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const filteredComments = comments.filter(comment => {
    if (filter === 'all') return true
    if (filter === 'approved') return comment.isApproved === true
    if (filter === 'pending') return comment.isApproved === false
    return true
  })

  const handleApprove = async (commentId) => {
    try {
      const { data } = await axios.post(`/api/admin/approveComment/${commentId}`)
      if (data.success) {
        // Update local state
        setComments(comments.map(comment => 
          comment._id === commentId 
            ? { ...comment, isApproved: true }
            : comment
        ))
        toast.success('Comment approved successfully!')
      } else {
        toast.error(data.message || 'Failed to approve comment')
      }
    } catch (error) {
      console.error('Approve comment error:', error)
      toast.error('Failed to approve comment. Please try again.')
    }
  }

  const handleDelete = async (commentId) => {
    if (window.confirm('Are you sure you want to delete this comment? This action cannot be undone.')) {
      try {
        const { data } = await axios.post(`/api/admin/deleteComment/${commentId}`)
        if (data.success) {
          // Remove comment from local state
          setComments(comments.filter(comment => comment._id !== commentId))
          toast.success('Comment deleted successfully!')
        } else {
          toast.error(data.message || 'Failed to delete comment')
        }
      } catch (error) {
        console.error('Delete comment error:', error)
        toast.error('Failed to delete comment. Please try again.')
      }
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    
    const getOrdinalSuffix = (day) => {
      if (day > 3 && day < 21) return 'th'
      switch (day % 10) {
        case 1: return 'st'
        case 2: return 'nd'
        case 3: return 'rd'
        default: return 'th'
      }
    }
    
    return `${day}${getOrdinalSuffix(day)} ${month}, ${year}`
  }

  return (
    <div className="flex-1 space-y-6 p-4 sm:p-6 overflow-x-hidden bg-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-black text-black">Comments Management</h1>
        <div className="mt-4 sm:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-4 text-sm text-gray-800 font-semibold">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-black rounded-full"></span>
              Total: {comments.length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              Approved: {comments.filter(c => c.isApproved === true).length}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 bg-yellow-600 rounded-full"></span>
              Pending: {comments.filter(c => c.isApproved === false).length}
            </span>
          </div>
          <button
            onClick={fetchComments}
            disabled={loading}
            className="bg-black text-white px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold uppercase tracking-wide border-2 border-black"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                </svg>
                Refresh
              </>
            )}
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-black">
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
    <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border-2 border-black rounded-md focus:outline-none focus:ring-2 focus:ring-black text-sm sm:text-base font-semibold"
            >
              <option value="all">All Comments</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="bg-white rounded-lg shadow-lg border-2 border-black overflow-hidden">
        {/* Mobile Card View */}
        <div className="block lg:hidden">
          {loading ? (
            <div className="p-4 text-center text-gray-800 font-semibold">Loading comments...</div>
          ) : filteredComments.length === 0 ? (
            <div className="p-4 text-center text-gray-800 font-semibold">No comments found matching your filter.</div>
          ) : (
            filteredComments.map((comment, index) => (
              <div key={comment._id} className="p-4 sm:p-6 border-b-2 border-black last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center">
                    <span className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                      comment.isApproved === true
                        ? 'bg-green-100 text-green-800 border border-green-800' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-800'
                    }`}>
                      {comment.isApproved === true ? (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Approved
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          Pending
                        </>
                      )}
                    </span>
                  </div>
                  <div className="text-xs text-gray-800 font-semibold">
                    {formatDate(comment.createdAt)}
                  </div>
                </div>
                
                <div className="mb-3">
                  <p className="text-sm text-black mb-2 font-semibold">{comment.content}</p>
                  <div className="flex items-center text-xs text-gray-800">
                    <span className="font-bold mr-2">By: {comment.name}</span>
                    <span>•</span>
                    <span className="ml-2 font-semibold">{comment.blog?.title || 'Unknown Blog'}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {!comment.isApproved && (
                    <button 
                      onClick={() => handleApprove(comment._id)}
                                                  className="flex-1 text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 px-3 py-2 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-green-600"
                    >
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Approve
                    </button>
                  )}
                  <button 
                    onClick={() => handleDelete(comment._id)}
                                                className="flex-1 text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-2 rounded-md text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-red-600"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-amber-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">#</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Comment</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Blog</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Author</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-black">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-800 font-semibold">
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Loading comments...
                    </div>
                  </td>
                </tr>
              ) : filteredComments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 whitespace-nowrap text-center text-gray-800 font-semibold">
                    No comments found matching your filter.
                  </td>
                </tr>
              ) : (
                filteredComments.map((comment, index) => (
                  <tr key={comment._id} className="hover:bg-amber-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="max-w-[300px]">
                        <p className="text-sm text-black truncate font-semibold">{comment.content}</p>
                        <p className="text-xs text-gray-800 mt-1 font-semibold">{formatDate(comment.createdAt)}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img 
                          src={comment.blog?.image || assets.dummy} 
                          alt={comment.blog?.title || 'Unknown Blog'} 
                          className="w-10 h-10 rounded-lg object-cover mr-3 border-2 border-black"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-black truncate">
                            {comment.blog?.title || 'Unknown Blog'}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-black">
                      {comment.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-bold rounded-full ${
                        comment.isApproved === true
                          ? 'bg-green-100 text-green-800 border border-green-800' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-800'
                      }`}>
                        {comment.isApproved === true ? (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approved
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            Pending
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        {!comment.isApproved && (
                          <button 
                            onClick={() => handleApprove(comment._id)}
                            className="text-green-600 hover:text-green-800 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1 font-bold border border-green-600"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Approve
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(comment._id)}
                                                      className="text-red-600 hover:text-red-800 bg-red-100 hover:bg-red-200 px-3 py-1 rounded-md text-xs transition-colors flex items-center gap-1 font-bold border border-red-600"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Comments
