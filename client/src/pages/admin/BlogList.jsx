import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import toast from 'react-hot-toast'

const BlogList = () => {
  const { axios, fetchAllBlogs, user } = useAppContext()
  const canEditBlog = (blog) => blog.authorEmail && user?.email && blog.authorEmail.toLowerCase() === user.email.toLowerCase()
  const [blogs, setBlogs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [editingBlog, setEditingBlog] = useState(null)
  const [editForm, setEditForm] = useState({
    title: '',
    subtitle: '',
    category: '',
    description: '',
    image: null
  })
  const [editLoading, setEditLoading] = useState(false)
  const navigate = useNavigate()

  // Fetch blogs from backend
  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      const blogsData = await fetchAllBlogs()
      setBlogs(blogsData)
    } catch (error) {
      console.error('Fetch blogs error:', error)
      toast.error('Failed to fetch blogs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Filter blogs based on search and status
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && blog.isPublished === true) ||
                         (statusFilter === 'draft' && blog.isPublished === false)
    
    return matchesSearch && matchesStatus
  })

  // Get counts for different statuses
  const publishedCount = blogs.filter(blog => blog.isPublished === true).length
  const draftCount = blogs.filter(blog => blog.isPublished === false).length
  const totalCount = blogs.length

  // Format date function
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

  const handleDelete = async (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      try {
        const { data } = await axios.delete(`/api/blog/${blogId}`)
        if (data.success) {
          setBlogs(blogs.filter(blog => blog._id !== blogId))
          toast.success('Blog deleted successfully!')
          
          // Refresh the blog list to ensure accurate counts
          setTimeout(() => {
            fetchBlogs()
          }, 500)
        } else {
          toast.error(data.message || 'Failed to delete blog')
        }
      } catch (error) {
        console.error('Delete blog error:', error)
        toast.error('Failed to delete blog. Please try again.')
      }
    }
  }

  const handleToggleStatus = async (blogId) => {
    try {
      const { data } = await axios.post(`/api/blog/${blogId}/togglePublish`)
      if (data.success) {
        // Update local state with the response data
        setBlogs(blogs.map(blog => 
          blog._id === blogId 
            ? { ...blog, isPublished: data.data.isPublished }
            : blog
        ))
        toast.success(`Blog ${data.data.isPublished ? 'published' : 'unpublished'} successfully!`)
        
        // Refresh the blog list to ensure accurate counts
        setTimeout(() => {
          fetchBlogs()
        }, 500)
      } else {
        toast.error(data.message || 'Failed to update blog status')
      }
    } catch (error) {
      console.error('Toggle status error:', error)
      toast.error('Failed to update blog status. Please try again.')
    }
  }

  const handleEdit = (blog) => {
    setEditingBlog(blog)
    
    // Strip HTML tags from description for clean editing
    const stripHtml = (html) => {
      const tmp = document.createElement('div')
      tmp.innerHTML = html
      return tmp.textContent || tmp.innerText || ''
    }
    
    setEditForm({
      title: blog.title,
      subtitle: blog.subtitle || '',
      category: blog.category,
      description: stripHtml(blog.description),
      image: null
    })
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()
    
    if (!editForm.title || !editForm.category || !editForm.description) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setEditLoading(true)
      
      const formData = new FormData()
      formData.append('Blog', JSON.stringify({
        title: editForm.title,
        subtitle: editForm.subtitle,
        description: editForm.description,
        category: editForm.category
      }))
      
      if (editForm.image) {
        formData.append('image', editForm.image)
      }

      const { data } = await axios.put(`/api/blog/${editingBlog._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      if (data.success) {
        // Update local state
        setBlogs(blogs.map(blog => 
          blog._id === editingBlog._id 
            ? { ...blog, ...data.data }
            : blog
        ))
        toast.success('Blog updated successfully!')
        setEditingBlog(null)
        setEditForm({
          title: '',
          subtitle: '',
          category: '',
          description: '',
          image: null
        })
        
        // Refresh the blog list to ensure accurate counts
        setTimeout(() => {
          fetchBlogs()
        }, 500)
      } else {
        toast.error(data.message || 'Failed to update blog')
      }
    } catch (error) {
      console.error('Update blog error:', error)
      toast.error('Failed to update blog. Please try again.')
    } finally {
      setEditLoading(false)
    }
  }

  const handleEditInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    })
  }

  const handleEditImageChange = (e) => {
    if (e.target.files[0]) {
      setEditForm({
        ...editForm,
        image: e.target.files[0]
      })
    }
  }

  const closeEditModal = () => {
    setEditingBlog(null)
    setEditForm({
      title: '',
      subtitle: '',
      category: '',
      description: '',
      image: null
    })
  }

  const handleAddNewBlog = () => {
    navigate('/admin/add-blog')
  }

  return (
    <div className="space-y-6 bg-gray-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Blog List</h1>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={fetchBlogs}
            disabled={loading}
            className="bg-gray-600 text-white px-3 py-2 rounded-lg hover:bg-hover-primary transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Loading...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </>
            )}
          </button>
          <button 
            onClick={handleAddNewBlog}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-hover-primary transition-colors text-sm sm:text-base flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Blog
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blogs...</p>
        </div>
      )}

      {/* Content when not loading */}
      {!loading && (
        <>
          {/* Filters */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-gray-200">
            {/* Status Counts */}
            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Total:</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Published:</span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {publishedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-700">Draft:</span>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {draftCount}
                </span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              {/* Search */}
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search blogs by title or category..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              
              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Blogs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Mobile Card View */}
            <div className="block lg:hidden">
              {filteredBlogs.map((blog, index) => (
                <div key={blog._id} className="p-3 sm:p-4 border-b border-gray-200 last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium mr-3">
                        {index + 1}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        blog.isPublished === true
                          ? 'bg-green-100 text-green-800 border border-green-200' 
                          : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                      }`}>
                        {blog.isPublished === true ? (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Published
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                            </svg>
                            Draft
                          </span>
                        )}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 text-right">
                      {formatDate(blog.createdAt)}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="flex items-center mb-2">
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-12 h-12 rounded-lg object-cover mr-3"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                        <p className="text-xs text-gray-500 truncate">{blog.subTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-600">
                      <span className="inline-flex px-2 py-1 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  {canEditBlog(blog) ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(blog._id)}
                      className="flex-1 text-gray-600 hover:text-hover-primary bg-gray-100 hover:bg-hover-primary/20 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      {blog.isPublished === true ? (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                          </svg>
                          Make Draft
                        </>
                      ) : (
                        <>
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          Publish
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleEdit(blog)}
                      className="flex-1 text-blue-600 hover:text-hover-primary bg-blue-100 hover:bg-hover-primary/20 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 text-red-600 hover:text-hover-primary bg-red-100 hover:bg-hover-primary/20 px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                  ) : (
                    <span className="text-xs text-gray-500">—</span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Blog Title</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBlogs.map((blog, index) => (
                    <tr key={blog._id} className="hover:bg-hover-primary/10">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-10 h-10 rounded-lg object-cover mr-3"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">{blog.title}</p>
                            <p className="text-xs text-gray-500 truncate">{blog.subTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(blog.createdAt)}
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          blog.isPublished === true
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                        }`}>
                          {blog.isPublished === true ? (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Published
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                              </svg>
                              Draft
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {canEditBlog(blog) ? (
                          <div className="flex gap-2">
                            <button 
                              onClick={() => handleToggleStatus(blog._id)}
                              className="text-gray-600 hover:text-hover-primary bg-gray-100 hover:bg-hover-primary/20 px-3 py-1 rounded-md text-xs transition-colors flex items-center justify-center gap-1"
                            >
                              {blog.isPublished ? (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                  </svg>
                                  Make Draft
                                </>
                              ) : (
                                <>
                                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                  Publish
                                </>
                              )}
                            </button>
                            <button 
                              onClick={() => handleEdit(blog)}
                              className="text-blue-600 hover:text-hover-primary bg-blue-100 hover:bg-hover-primary/20 px-3 py-1 rounded-md text-xs transition-colors flex items-center justify-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-600 hover:text-hover-primary bg-red-100 hover:bg-hover-primary/20 px-3 py-1 rounded-md text-xs transition-colors flex items-center justify-center gap-1"
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-500 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Empty State */}
            {filteredBlogs.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-500 text-sm sm:text-base">No blogs found matching your criteria.</p>
              </div>
            )}
          </div>
        </>
      )}

      {/* Edit Modal */}
      {editingBlog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Blog</h2>
                <button
                  onClick={closeEditModal}
                  className="text-gray-400 hover:text-hover-primary transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={editForm.subtitle}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Technology</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Travel">Travel</option>
                    <option value="Food">Food</option>
                    <option value="Health">Health</option>
                    <option value="Business">Business</option>
                    <option value="Education">Education</option>
                    <option value="Entertainment">Entertainment</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={editForm.description}
                    onChange={handleEditInputChange}
                    rows="6"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags for formatting (e.g., &lt;p&gt;, &lt;strong&gt;, &lt;em&gt;)
                  </p>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blog Image
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    {editForm.image ? (
                      <div className="space-y-3">
                        <img 
                          src={URL.createObjectURL(editForm.image)} 
                          alt="Preview" 
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-gray-600">{editForm.image.name}</span>
                          <button
                            type="button"
                            onClick={() => setEditForm({...editForm, image: null})}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-600 mb-2">Current image: {editingBlog.image}</p>
                        <label htmlFor="edit-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Change Image</span>
                          <input
                            id="edit-image-upload"
                            name="image"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleEditImageChange}
                          />
                        </label>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editLoading ? 'Updating...' : 'Update Blog'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editLoading}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BlogList
