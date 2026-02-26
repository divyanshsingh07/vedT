import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import toast from 'react-hot-toast'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'

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
    setEditForm({
      title: blog.title,
      subtitle: blog.subtitle || '',
      category: blog.category,
      description: blog.description || '',
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
    if (editEditor) editEditor.commands.clearContent()
  }

  // Rich text editor for edit modal
  const editEditor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Link.configure({ openOnClick: false }),
    ],
    content: '',
    onUpdate: ({ editor }) => {
      setEditForm(prev => ({ ...prev, description: editor.getHTML() }))
    },
  })

  // Sync editor content when editForm.description is loaded
  useEffect(() => {
    if (editEditor && editingBlog) {
      editEditor.commands.setContent(editForm.description || '')
    }
  }, [editingBlog])

  const EditToolbarButton = ({ onClick, isActive, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      className={`p-1.5 rounded transition-colors ${
        isActive ? 'bg-accent-soft text-accent' : 'text-muted hover:bg-slate-100 hover:text-heading'
      }`}
      title={title}
    >
      {children}
    </button>
  )

  const handleAddNewBlog = () => {
    navigate('/admin/add-blog')
  }

  return (
    <div className="space-y-6 bg-page">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl sm:text-2xl font-bold text-heading">Blog List</h1>
        <div className="flex items-center gap-3 mt-4 sm:mt-0">
          <button 
            onClick={fetchBlogs}
            disabled={loading}
            className="bg-muted text-white px-3 py-2 rounded-lg hover:bg-accent-hover transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
            className="bg-accent text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-accent-hover transition-colors text-sm sm:text-base flex items-center gap-2"
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
        <div className="bg-white rounded-lg shadow-sm border border-border p-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted">Loading blogs...</p>
        </div>
      )}

      {/* Content when not loading */}
      {!loading && (
        <>
          {/* Filters */}
          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-sm border border-border">
            {/* Status Counts */}
            <div className="flex flex-wrap gap-4 mb-4 pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted">Total:</span>
                <span className="bg-accent-soft text-accent text-xs font-semibold px-2 py-1 rounded-full">
                  {totalCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted">Published:</span>
                <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-1 rounded-full">
                  {publishedCount}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted">Draft:</span>
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
                  className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                />
              </div>
              
              {/* Status Filter */}
              <div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-sm sm:text-base"
                >
                  <option value="all">All Status</option>
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Blogs Table */}
          <div className="bg-white rounded-lg shadow-sm border border-border overflow-hidden">
            {/* Card View (mobile + medium screens) */}
            <div className="block xl:hidden">
              {filteredBlogs.map((blog, index) => (
                <div key={blog._id} className="p-3 sm:p-4 border-b border-border last:border-b-0">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <span className="w-6 h-6 bg-accent-soft text-accent rounded-full flex items-center justify-center text-xs font-medium mr-3">
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
                    <div className="text-xs text-muted text-right">
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
                        <p className="text-sm font-medium text-heading truncate">{blog.title}</p>
                        <p className="text-xs text-muted truncate">{blog.subTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span className="inline-flex px-2 py-1 font-semibold rounded-full bg-accent-soft text-accent">
                        {blog.category}
                      </span>
                    </div>
                  </div>
                  
                  {canEditBlog(blog) ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleToggleStatus(blog._id)}
                      className="flex-1 text-muted hover:text-accent bg-page hover:bg-accent-soft px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
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
                      className="flex-1 text-accent hover:text-accent bg-accent-soft hover:bg-accent-soft px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(blog._id)}
                      className="flex-1 text-red-600 hover:text-accent bg-red-100 hover:bg-accent-soft px-3 py-2 rounded-md text-xs font-medium transition-colors flex items-center justify-center gap-1"
                    >
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Delete
                    </button>
                  </div>
                  ) : (
                    <span className="text-xs text-muted">—</span>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table View (xl and above) */}
            <div className="hidden xl:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">#</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Blog Title</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Category</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Date</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-border">
                  {filteredBlogs.map((blog, index) => (
                    <tr key={blog._id} className="hover:bg-accent-soft">
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted">{index + 1}</td>
                      <td className="px-3 sm:px-6 py-4 max-w-[280px]">
                        <div className="flex items-center">
                          <img 
                            src={blog.image} 
                            alt={blog.title} 
                            className="w-10 h-10 rounded-lg object-cover mr-3 flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-heading truncate">{blog.title}</p>
                            <p className="text-xs text-muted truncate">{blog.subTitle}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-accent-soft text-accent">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-muted">
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
                          <div className="flex items-center gap-1">
                            <button 
                              onClick={() => handleToggleStatus(blog._id)}
                              className="text-muted hover:text-accent bg-page hover:bg-accent-soft p-1.5 rounded-md text-xs transition-colors cursor-pointer"
                              title={blog.isPublished ? 'Make Draft' : 'Publish'}
                            >
                              {blog.isPublished ? (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                              )}
                            </button>
                            <button 
                              onClick={() => handleEdit(blog)}
                              className="text-accent hover:text-white hover:bg-accent p-1.5 rounded-md text-xs transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button 
                              onClick={() => handleDelete(blog._id)}
                              className="text-red-500 hover:text-white hover:bg-red-500 p-1.5 rounded-md text-xs transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted text-xs">—</span>
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
                <p className="text-muted text-sm sm:text-base">No blogs found matching your criteria.</p>
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
                <h2 className="text-xl font-bold text-heading">Edit Blog</h2>
                <button
                  onClick={closeEditModal}
                  className="text-muted hover:text-accent transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Blog Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editForm.title}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={editForm.subtitle}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={editForm.category}
                    onChange={handleEditInputChange}
                    className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Technology">Tech/Startup</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Finance">Finance</option>
                    <option value="Politics">Politics</option>
                    <option value="Cricket">Sports</option>
                    <option value="Geography">Geography</option>
                    <option value="Education">Education</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Description *
                  </label>
                  {/* Toolbar */}
                  <div className="border border-border rounded-t-md bg-slate-50 p-2 flex flex-wrap items-center gap-1">
                    <div className="flex items-center gap-0.5 border-r border-border pr-1.5">
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleBold().run()} isActive={editEditor?.isActive('bold')} title="Bold">
                        <span className="text-xs font-bold">B</span>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleItalic().run()} isActive={editEditor?.isActive('italic')} title="Italic">
                        <span className="text-xs italic font-semibold">I</span>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleUnderline().run()} isActive={editEditor?.isActive('underline')} title="Underline">
                        <span className="text-xs underline font-semibold">U</span>
                      </EditToolbarButton>
                    </div>
                    <div className="flex items-center gap-0.5 border-r border-border pr-1.5">
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleHeading({ level: 1 }).run()} isActive={editEditor?.isActive('heading', { level: 1 })} title="Heading 1">
                        <span className="text-[10px] font-bold">H1</span>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editEditor?.isActive('heading', { level: 2 })} title="Heading 2">
                        <span className="text-[10px] font-bold">H2</span>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editEditor?.isActive('heading', { level: 3 })} title="Heading 3">
                        <span className="text-[10px] font-bold">H3</span>
                      </EditToolbarButton>
                    </div>
                    <div className="flex items-center gap-0.5 border-r border-border pr-1.5">
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleBulletList().run()} isActive={editEditor?.isActive('bulletList')} title="Bullet List">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleOrderedList().run()} isActive={editEditor?.isActive('orderedList')} title="Numbered List">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
                      </EditToolbarButton>
                    </div>
                    <div className="flex items-center gap-0.5 border-r border-border pr-1.5">
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().toggleBlockquote().run()} isActive={editEditor?.isActive('blockquote')} title="Quote">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                      </EditToolbarButton>
                      <EditToolbarButton
                        onClick={() => {
                          const url = prompt('Enter URL:')
                          if (url) editEditor?.chain().focus().setLink({ href: url }).run()
                        }}
                        isActive={editEditor?.isActive('link')}
                        title="Insert Link"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </EditToolbarButton>
                    </div>
                    <div className="flex items-center gap-0.5">
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().setTextAlign('left').run()} isActive={editEditor?.isActive({ textAlign: 'left' })} title="Align Left">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h10M4 18h16" /></svg>
                      </EditToolbarButton>
                      <EditToolbarButton onClick={() => editEditor?.chain().focus().setTextAlign('center').run()} isActive={editEditor?.isActive({ textAlign: 'center' })} title="Align Center">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M4 18h16" /></svg>
                      </EditToolbarButton>
                    </div>
                  </div>
                  {/* Editor */}
                  <div className="border border-t-0 border-border rounded-b-md bg-white">
                    <EditorContent
                      editor={editEditor}
                      className="prose max-w-none min-h-[200px]"
                    />
                  </div>
                </div>

                {/* Image */}
                <div>
                  <label className="block text-sm font-medium text-muted mb-1">
                    Blog Image
                  </label>
                  <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
                    {editForm.image ? (
                      <div className="space-y-3">
                        <img 
                          src={URL.createObjectURL(editForm.image)} 
                          alt="Preview" 
                          className="mx-auto h-32 w-auto rounded-lg object-cover"
                        />
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-sm text-muted">{editForm.image.name}</span>
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
                        <p className="text-sm text-muted mb-2">Current image: {editingBlog.image}</p>
                        <label htmlFor="edit-image-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-accent hover:text-accent focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-accent">
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
                        <p className="text-xs text-muted mt-1">PNG, JPG, GIF up to 10MB</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    disabled={editLoading}
                    className="flex-1 bg-accent text-white py-2 px-4 rounded-md hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {editLoading ? 'Updating...' : 'Update Blog'}
                  </button>
                  <button
                    type="button"
                    onClick={closeEditModal}
                    disabled={editLoading}
                    className="flex-1 bg-slate-100 text-muted py-2 px-4 rounded-md hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
