import React from 'react'
import { useAppContext } from '../contexts/AppContext'
import { assets, footer_data } from '../assets/assets'

const Footer = () => {
  const { loginBlocked } = useAppContext()
  
  const socialLinks = [
    { 
      name: 'Portfolio', 
      url: 'https://divyansh.codes', 
      icon: '🌐',
      label: 'divyansh.codes'
    },
    { 
      name: 'GitHub', 
      url: 'https://github.com/divyanshsingh07', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
      )
    },
    { 
      name: 'LinkedIn', 
      url: 'https://linkedin.com/in/divyansh-singh', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      name: 'Twitter', 
      url: 'https://twitter.com/divyanshsingh07', 
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      )
    }
  ]

  return (
    <div className='px-5 md:px-16 xl:px-24 lg:px-32 bg-amber-50 border-t-2 border-black'>
      <div className='py-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'>
        {/* Developer Profile Section - Left Side */}
        <div className='lg:col-span-5'>
          <div className='bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all'>
            <div className='flex items-start gap-4'>
              {/* Profile Photo */}
              <div className='flex-shrink-0'>
                <div className='w-20 h-20 rounded-xl border-2 border-black bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center text-3xl font-bold overflow-hidden'>
                  {/* Add your profile photo: <img src={assets.profile} alt="Divyansh Singh" className='w-full h-full object-cover' /> */}
                  <span className='text-black'>DS</span>
                </div>
              </div>
              
              {/* Profile Info */}
              <div className='flex-1 min-w-0'>
                <h3 className='text-lg font-bold text-black mb-1'>Divyansh Singh</h3>
                <p className='text-xs text-gray-700 font-semibold mb-3 leading-relaxed'>
                  Full-Stack Developer • UI/UX Designer
                </p>
                <p className='text-xs text-gray-800 font-medium leading-relaxed mb-3'>
                  ✨ Need web services? From stunning UI/UX design to full-stack development & deployment—let's build something amazing together!
                </p>
                
                {/* Social Links */}
                <div className='space-y-2'>
                  {socialLinks.map((link, index) => (
                    <a 
                      key={index}
                      href={link.url}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-2 text-xs font-semibold text-gray-800 hover:text-black transition-colors group'
                    >
                      <span className='flex items-center justify-center w-5 h-5 text-black group-hover:scale-110 transition-transform'>
                        {link.icon}
                      </span>
                      <span className='group-hover:underline'>
                        {link.label || link.name}
                      </span>
                      <svg className='w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Section - Middle */}
        <div className='lg:col-span-4'>
          <div className='inline-flex items-center gap-3'>
            <img src={assets.logo} alt="logo-footer" className='w-24 sm:w-32' />
          </div>
          <div className='h-1 w-20 bg-black rounded-full mt-3'></div>
          <p className='max-w-[420px] mt-3 text-gray-800 leading-relaxed font-semibold text-sm'>
            Vedified helps you write, publish, and grow—powered by AI, designed for creators.
          </p>
        </div>

        {/* Quick Links - Right Side */}
        <div className='lg:col-span-3 grid grid-cols-2 gap-4'>
          <div>
            <h4 className='text-xs font-bold text-black mb-2'>Company</h4>
            <ul className='space-y-1 text-xs text-gray-800 font-semibold'>
              <li><a href='#' className='hover:text-black'>About</a></li>
              <li><a href='#' className='hover:text-black'>Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className='text-xs font-bold text-black mb-2'>Legal</h4>
            <ul className='space-y-1 text-xs text-gray-800 font-semibold'>
              <li><a href='#' className='hover:text-black'>Privacy</a></li>
              <li><a href='#' className='hover:text-black'>Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
      {loginBlocked && (
        <div className='py-4 border-t-2 border-black'>
          <div className='max-w-3xl mx-auto bg-white border-2 border-black rounded-xl p-4 text-sm text-black font-semibold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'>
            <div className='flex items-start gap-3'>
              <svg className='w-5 h-5 text-black flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/></svg>
              <div>
                <p>🔒 New user registrations are currently closed. Need access?</p>
                <p className='mt-2'>
                  <a href='https://divyansh.codes' target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1 text-black hover:underline font-bold'>
                    Contact me at divyansh.codes
                    <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                    </svg>
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className='py-4 border-t-2 border-black text-center'>
        <p className='text-xs text-gray-800 font-semibold'>
          © 2025 Vedified. Crafted with care by{' '}
          <a href='https://divyansh.codes' target='_blank' rel='noopener noreferrer' className='text-black hover:underline font-bold'>
            Divyansh Singh
          </a>
        </p>
      </div>
    </div>
  )
}

export default Footer
