import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-5 md:px-12 xl:px-20 lg:px-28 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-t-4 border-black'>
      <div className='py-10 max-w-7xl mx-auto'>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10 items-start'>
          {/* Left: Developer Profile Section */}
          <div className='flex flex-col items-center lg:items-start'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl blur-sm group-hover:blur-md transition-all'></div>
              <img 
                src={assets.developerProfile} 
                alt="Divyansh Singh" 
                className='relative w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-black shadow-lg object-cover transform group-hover:scale-105 transition-transform duration-300'
              />
            </div>
            <h3 className='text-xl md:text-2xl font-black text-black mt-4 mb-2 text-center lg:text-left'>
              Divyansh Singh (Arsh Thakur)
            </h3>
            <div className='h-1 w-16 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-3'></div>
            <p className='text-xs md:text-sm text-gray-800 font-semibold text-center lg:text-left'>
              Full-Stack Developer & Designer
            </p>
          </div>

          {/* Center: Developer Contact & Links */}
          <div className='text-center lg:text-left'>
            <h4 className='text-lg font-bold text-black mb-4 flex items-center gap-2 justify-center lg:justify-start'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'/>
              </svg>
              Connect With Me
            </h4>
            
            <p className='text-sm text-gray-800 font-semibold leading-relaxed mb-5'>
              Crafting beautiful, scalable web experiences. From UI/UX design to deployment—let's build something amazing! 🚀
            </p>

            {/* Portfolio Link */}
            <div className='mb-5'>
              <a 
                href='https://divyansh.codes' 
                target='_blank' 
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white font-bold text-sm rounded-xl border-2 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl group'
              >
                <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
                </svg>
                <span>divyansh.codes</span>
                <svg className='w-3.5 h-3.5 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </a>
            </div>

            {/* Social Links */}
            <div className='flex flex-wrap items-center justify-center lg:justify-start gap-2.5'>
              {/* GitHub */}
              <a 
                href='https://github.com/divyanshsingh07' 
                target='_blank' 
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 shadow hover:shadow-lg'
                title='GitHub'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/>
                </svg>
                <span>GitHub</span>
              </a>

              {/* LinkedIn */}
              <a 
                href='https://linkedin.com/in/divyanshsingharsh' 
                target='_blank' 
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 shadow hover:shadow-lg'
                title='LinkedIn'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/>
                </svg>
                <span>LinkedIn</span>
              </a>

              {/* Email */}
              <a 
                href='mailto:divyanshsingharsh@gmail.com' 
                className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 shadow hover:shadow-lg'
                title='Email'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' />
                </svg>
                <span>Email</span>
              </a>

              {/* Twitter/X */}
              <a 
                href='https://twitter.com/divyanshsingh07' 
                target='_blank' 
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 shadow hover:shadow-lg'
                title='Twitter'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z'/>
                </svg>
                <span>Twitter</span>
              </a>

              {/* Instagram */}
              <a 
                href='https://instagram.com/arshthakur07' 
                target='_blank' 
                rel='noopener noreferrer'
                className='flex items-center gap-2 px-4 py-2 bg-white border-2 border-black rounded-xl font-semibold text-sm hover:bg-black hover:text-white transition-all duration-300 shadow hover:shadow-lg'
                title='Instagram'
              >
                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
                  <path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/>
                </svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Right: About Vedified */}
          <div className='text-center lg:text-left'>
            <h4 className='text-lg font-bold text-black mb-4 flex items-center gap-2 justify-center lg:justify-start'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'/>
              </svg>
              About Vedified
            </h4>
            
            <p className='text-sm text-gray-800 font-semibold leading-relaxed mb-4'>
              Your AI-powered blogging platform where creativity meets technology. Write, publish, and grow your audience effortlessly.
            </p>

            <div className='space-y-3 text-xs text-gray-700 font-semibold'>
              <div className='flex items-start gap-2 justify-center lg:justify-start'>
                <svg className='w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                <span>AI Writing Assistant powered by Gemini</span>
              </div>
              <div className='flex items-start gap-2 justify-center lg:justify-start'>
                <svg className='w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                <span>Rich Text Editor with Image Support</span>
              </div>
              <div className='flex items-start gap-2 justify-center lg:justify-start'>
                <svg className='w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                <span>Admin Dashboard & Analytics</span>
              </div>
              <div className='flex items-start gap-2 justify-center lg:justify-start'>
                <svg className='w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                <span>Comment Moderation System</span>
              </div>
              <div className='flex items-start gap-2 justify-center lg:justify-start'>
                <svg className='w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                <span>JWT Authentication</span>
              </div>
            </div>

          
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='py-4 border-t-2 border-black text-center max-w-7xl mx-auto'>
        <p className='text-xs md:text-sm text-gray-800 font-semibold'>
          © {new Date().getFullYear()} Divyansh Singh. All rights reserved. | Crafted with ❤️ and code
        </p>
      </div>
    </div>
  )
}

export default Footer
