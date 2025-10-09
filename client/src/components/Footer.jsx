import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='px-5 md:px-16 xl:px-24 lg:px-32 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 border-t-4 border-black'>
      <div className='py-10'>
        <div className='flex flex-col md:flex-row items-center md:items-start gap-8 md:gap-12'>
          {/* Developer Profile Section */}
          <div className='flex-shrink-0'>
            <div className='relative group'>
              <div className='absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-3xl blur-sm group-hover:blur-md transition-all'></div>
              <img 
                src={assets.developerProfile} 
                alt="Divyansh Singh" 
                className='relative w-32 h-32 md:w-40 md:h-40 rounded-3xl border-4 border-black shadow-lg object-cover transform group-hover:scale-105 transition-transform duration-300'
              />
            </div>
          </div>

          {/* Developer Info & Links */}
          <div className='flex-1 text-center md:text-left'>
            <h3 className='text-2xl md:text-3xl font-black text-black mb-2'>
              Divyansh Singh
            </h3>
            <div className='h-1 w-20 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full mb-4 mx-auto md:mx-0'></div>
            
            <p className='text-sm md:text-base text-gray-800 font-semibold leading-relaxed mb-6 max-w-2xl'>
              Full-Stack Developer & Designer crafting beautiful, scalable web experiences. 
              From UI/UX design to deployment—let's build something amazing together! 🚀
            </p>

            {/* Portfolio Link */}
            <div className='mb-6'>
              <a 
                href='https://divyansh.codes' 
                target='_blank' 
                rel='noopener noreferrer'
                className='inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-2xl border-2 border-black hover:bg-white hover:text-black transition-all duration-300 shadow-lg hover:shadow-xl group'
              >
                <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9' />
                </svg>
                <span>divyansh.codes</span>
                <svg className='w-4 h-4 group-hover:translate-x-1 transition-transform' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M13 7l5 5m0 0l-5 5m5-5H6' />
                </svg>
              </a>
            </div>

            {/* Social Links */}
            <div className='flex flex-wrap items-center justify-center md:justify-start gap-3'>
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
                href='https://linkedin.com/in/divyanshsingh07' 
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
                href='mailto:divyanshsingh@example.com' 
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
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className='py-4 border-t-2 border-black text-center'>
        <p className='text-xs md:text-sm text-gray-800 font-semibold'>
          © {new Date().getFullYear()} Divyansh Singh. All rights reserved. | Crafted with ❤️ and code
        </p>
      </div>
    </div>
  )
}

export default Footer
