import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { assets } from '../../assets/assets'

const Sidebar = () => {
  const navigate = useNavigate()
  const [isPinned, setIsPinned] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isSmallScreen, setIsSmallScreen] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth
      setIsMobile(width < 1024)
      setIsSmallScreen(width < 1280)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('.mobile-sidebar') && !event.target.closest('.mobile-menu-button')) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMobileMenuOpen])

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-accent text-white shadow-sm'
        : 'text-slate-300 hover:bg-navy hover:text-white font-medium'
    }`

  const labelClass = `
    font-medium text-sm transition-opacity duration-300
    ${isMobile ? 'opacity-100' : (isSmallScreen ? (isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') : 'opacity-100')}
  `

  const handleLogoClick = () => {
    if (isMobile) setIsMobileMenuOpen(false)
    navigate('/')
  }

  const NavigationContent = () => (
    <>
      <div className="mb-5 lg:mb-7">
        <div
          className="flex items-center justify-center md:justify-start cursor-pointer"
          onClick={handleLogoClick}
        >
          <img
            src={assets.logo}
            alt="Logo"
            className="w-10 h-10 transition-all duration-300 brightness-0 invert"
          />
          <span
            className={`
              ml-2 text-lg lg:text-xl font-bold text-white truncate 
              transition-opacity duration-300
              ${isMobile ? 'opacity-100' : (isSmallScreen ? (isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') : 'opacity-100')}
            `}
          >
            Admin
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        <NavLink
          to="/admin"
          end
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={navLinkClass}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v0M8 11h0" />
          </svg>
          <span className={labelClass}>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin/add-blog"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={navLinkClass}
        >
          <img src={assets.add_icon} alt="add blog" className="w-5 h-5 flex-shrink-0 invert" />
          <span className={labelClass}>Add Blog</span>
        </NavLink>

        <NavLink
          to="/admin/blog-list"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={navLinkClass}
        >
          <img src={assets.list_icon} alt="blog list" className="w-5 h-5 flex-shrink-0 invert" />
          <span className={labelClass}>Blog List</span>
        </NavLink>

        <NavLink
          to="/admin/comments"
          onClick={() => isMobile && setIsMobileMenuOpen(false)}
          className={navLinkClass}
        >
          <img src={assets.comment_icon} alt="comments" className="w-5 h-5 flex-shrink-0 invert" />
          <span className={labelClass}>Comments</span>
        </NavLink>
      </nav>

      <div
        className={`
          mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-navy 
          transition-opacity duration-300
          ${isMobile ? 'opacity-100' : (isSmallScreen ? (isPinned ? 'opacity-100' : 'opacity-0 group-hover:opacity-100') : 'opacity-100')}
        `}
      />
    </>
  )

  return (
    <>
      {isMobile && (
        <button
          className="mobile-menu-button fixed bottom-4 left-4 z-50 bg-navy-light rounded-lg p-2 shadow-lg hover:shadow-xl transition-shadow md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className={`w-6 h-6 text-white transition-transform duration-300 ${
              isMobileMenuOpen ? 'rotate-90' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      )}

      {!isMobile && isSmallScreen && (
        <button
          onClick={() => setIsPinned(!isPinned)}
          className="fixed bottom-4 left-4 z-50 bg-navy-light rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          title={isPinned ? 'Unpin sidebar' : 'Pin sidebar'}
        >
          <svg
            className={`w-5 h-5 text-white transition-transform duration-300 ${!isPinned ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {isMobile && isMobileMenuOpen && (
        <div className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-40 md:hidden" />
      )}

      {!isMobile && (
        <div
          className={`
            group relative h-full bg-navy-light border-r border-navy/50
            transition-all duration-300 ease-in-out
            ${isSmallScreen ? (isPinned ? 'w-64' : 'w-16 hover:w-64') : 'w-64'}
          `}
        >
          <div className="p-3 sm:p-4 lg:p-6">
            <NavigationContent />
          </div>
        </div>
      )}

      {isMobile && (
        <div
          className={`
            mobile-sidebar fixed left-0 top-0 h-full w-72 max-w-[80vw] bg-navy-light shadow-xl
            transform transition-transform duration-300 ease-in-out z-50 md:hidden
            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
        >
          <div className="p-4 pt-16">
            <NavigationContent />
          </div>
        </div>
      )}
    </>
  )
}

export default Sidebar
