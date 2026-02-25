import React, { useState, useEffect } from 'react'
import { useAppContext } from '../../contexts/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

const WriterDashboard = () => {
  const { axios } = useAppContext()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState({
    recentBlogs: [],
    blogCount: 0,
    commentCount: 0,
    draftBlogs: 0
  })
  const [loading, setLoading] = useState(true)

  // Fetch dashboard data from backend
  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      const { data } = await axios.get('/api/user/dashboard')
      if (data.success) {
        setDashboardData(data.dashboardData)
      } else {
        toast.error(data.message || 'Failed to fetch dashboard data')
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error)
      toast.error('Failed to fetch dashboard data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Format date function
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = date.toLocaleDateString('en-US', { month: 'long' })
    const year = date.getFullYear()
    
    // Add ordinal suffix to day
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

  // Handle status toggle
  const handleToggleStatus = async (blogId) => {
    try {
      const { data } = await axios.post(`/api/blog/${blogId}/togglePublish`)
      if (data.success) {
        // Update local state
        setDashboardData(prev => ({
          ...prev,
          recentBlogs: prev.recentBlogs.map(blog => 
            blog._id === blogId 
              ? { ...blog, isPublished: data.data.isPublished }
              : blog
          ),
          blogCount: prev.blogCount,
          commentCount: prev.commentCount,
          draftBlogs: data.data.isPublished ? prev.draftBlogs - 1 : prev.draftBlogs + 1
        }))
        toast.success(`Blog ${data.data.isPublished ? 'published' : 'unpublished'} successfully!`)
      } else {
        toast.error(data.message || 'Failed to update blog status')
      }
    } catch (error) {
      console.error('Toggle status error:', error)
      toast.error('Failed to update blog status. Please try again.')
    }
  }

  // Handle delete blog
  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const { data } = await axios.delete(`/api/blog/${blogId}`)
        if (data.success) {
          // Update local state
          const deletedBlog = dashboardData.recentBlogs.find(blog => blog._id === blogId)
          setDashboardData(prev => ({
            ...prev,
            recentBlogs: prev.recentBlogs.filter(blog => blog._id !== blogId),
            blogCount: prev.blogCount - 1,
            draftBlogs: deletedBlog?.isPublished ? prev.draftBlogs : prev.draftBlogs - 1
          }))
          toast.success('Blog deleted successfully!')
        } else {
          toast.error(data.message || 'Failed to delete blog')
        }
      } catch (error) {
        console.error('Delete blog error:', error)
        toast.error('Failed to delete blog. Please try again.')
      }
    }
  }

  // Navigation functions for stats cards
  const navigateToAddBlog = () => {
    navigate('/writer/add-blog')
  }

  const navigateToBlogs = () => {
    navigate('/writer/blog-list')
  }

  const navigateToDrafts = () => {
    navigate('/writer/blog-list?filter=draft')
  }

  return (
    <div className="min-h-screen bg-page p-4 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-heading">Writer Dashboard</h1>
            <p className="text-muted mt-1 font-semibold">
              Manage your blogs, drafts, and reader engagement
            </p>
          </div>
          <button
            onClick={fetchDashboardData}
            disabled={loading}
            className="bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm font-bold uppercase tracking-wide shadow-md hover:shadow-lg"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Refreshing...
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Total Blogs Card */}
          <div 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-border cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            onClick={navigateToBlogs}
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-accent-soft rounded-lg group-hover:bg-accent-soft transition-colors">
                <img src={assets.tick_icon} alt="blogs" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-100 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-heading group-hover:text-heading transition-colors">{dashboardData.blogCount}</p>
                    <p className="text-sm sm:text-base text-muted group-hover:text-heading transition-colors">Total Blogs</p>
                  </>
                )}
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Published Blogs Card */}
          <div 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-border cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            onClick={navigateToBlogs}
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <img src={assets.tick_icon} alt="published" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-100 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-heading group-hover:text-heading transition-colors">{dashboardData.blogCount - dashboardData.draftBlogs}</p>
                    <p className="text-sm sm:text-base text-muted group-hover:text-heading transition-colors">Published</p>
                  </>
                )}
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Draft Blogs Card */}
          <div 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-border cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-200 group"
            onClick={navigateToDrafts}
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-200 transition-colors">
                <img src={assets.add_icon} alt="drafts" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-100 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-heading group-hover:text-heading transition-colors">{dashboardData.draftBlogs}</p>
                    <p className="text-sm sm:text-base text-muted group-hover:text-heading transition-colors">Drafts</p>
                  </>
                )}
              </div>
              <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          </div>

          {/* Total Comments Card */}
          <div 
            className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-border transition-all duration-200 group"
          >
            <div className="flex items-center">
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <img src={assets.comment_icon} alt="comments" className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div className="ml-3 sm:ml-4">
                {loading ? (
                  <div className="animate-pulse">
                    <div className="h-8 bg-slate-100 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-slate-100 rounded w-20"></div>
                  </div>
                ) : (
                  <>
                    <p className="text-xl sm:text-2xl font-bold text-heading group-hover:text-heading transition-colors">{dashboardData.commentCount}</p>
                    <p className="text-sm sm:text-base text-muted group-hover:text-heading transition-colors">Comments</p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-md border border-border p-6">
          <h2 className="text-lg font-bold text-heading mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={navigateToAddBlog}
              className="bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent-hover transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wide shadow-md hover:shadow-lg"
            >
              <img src={assets.add_icon} alt="add" className="w-5 h-5" />
              Create New Blog
            </button>
            <button
              onClick={navigateToBlogs}
              className="bg-accent-soft text-accent px-6 py-3 rounded-lg hover:bg-accent-soft transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
            >
              <img src={assets.list_icon} alt="list" className="w-5 h-5" />
              View All Blogs
            </button>
            <button
              onClick={navigateToDrafts}
              className="bg-white text-heading px-6 py-3 rounded-lg border border-border hover:bg-yellow-100 transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
            >
              <img src={assets.add_icon} alt="drafts" className="w-5 h-5" />
              View Drafts
            </button>
          </div>
        </div>

        {/* Recent Blogs Section */}
        <div className="bg-white rounded-xl shadow-md border border-border">
          <div className="p-4 sm:p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-1 h-4 sm:h-6 bg-accent rounded-full mr-2 sm:mr-3"></div>
                <h2 className="text-lg sm:text-xl font-bold text-heading">Your Recent Blogs</h2>
              </div>
              {loading && (
                <div className="flex items-center gap-2 text-sm text-muted">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
                  Loading...
                </div>
              )}
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="block lg:hidden">
            {loading ? (
              <div className="p-4 text-center text-muted font-semibold">Loading blogs...</div>
            ) : dashboardData.recentBlogs.length === 0 ? (
              <div className="p-4 text-center text-muted font-semibold">
                <p>No blogs found.</p>
                <button
                  onClick={navigateToAddBlog}
                  className="mt-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors font-bold uppercase tracking-wide"
                >
                  Create Your First Blog
                </button>
              </div>
            ) : (
              dashboardData.recentBlogs.map((blog, index) => (
                <div key={blog._id} className="p-3 sm:p-4 border-b border-border last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-accent-soft text-accent rounded-full flex items-center justify-center text-xs font-bold mr-3 border border-border">
                        {index + 1}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.isPublished 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {blog.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                    <div className="text-xs text-muted text-right">
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm font-semibold text-heading mb-2">{blog.title}</p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      className="flex-1 text-accent hover:text-accent bg-accent-soft hover:bg-accent-soft px-3 py-2 rounded-md text-xs font-bold transition-colors border border-border"
                      onClick={() => handleToggleStatus(blog._id)}
                    >
                      {blog.isPublished ? 'Unpublish' : 'Publish'}
                    </button>
                    <button 
                      className="text-heading hover:text-red-700 bg-white hover:bg-red-50 w-10 h-10 rounded-full flex items-center justify-center transition-colors border border-border"
                      onClick={() => handleDelete(blog._id)}
                    >
                      <img src={assets.bin_icon} alt="delete" className="w-4 h-5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-accent-soft">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">#</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Blog Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-border">
                {loading ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-muted">Loading blogs...</td>
                  </tr>
                ) : dashboardData.recentBlogs.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 whitespace-nowrap text-center text-muted">
                      <div>
                        <p>No blogs found.</p>
                        <button
                          onClick={navigateToAddBlog}
                          className="mt-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors"
                        >
                          Create Your First Blog
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  dashboardData.recentBlogs.map((blog, index) => (
                  <tr key={blog._id} className="hover:bg-accent-soft">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">{index + 1}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-heading">
                        <div className="max-w-[300px]">
                          <p className="truncate">{blog.title}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-muted">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.isPublished 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {blog.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button 
                          className="text-accent hover:text-accent bg-accent-soft hover:bg-accent-soft px-3 py-1 rounded-md text-xs font-bold transition-colors border border-border"
                          onClick={() => handleToggleStatus(blog._id)}
                        >
                          {blog.isPublished ? 'Unpublish' : 'Publish'}
                        </button>
                        <button 
                          className="text-heading hover:text-red-700 bg-white hover:bg-red-50 w-8 h-8 rounded-full flex items-center justify-center transition-colors border border-border"
                          onClick={() => handleDelete(blog._id)}
                        >
                          <img src={assets.bin_icon} alt="delete" className="w-4 h-5 cursor-pointer" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WriterDashboard
