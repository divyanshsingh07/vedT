import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../contexts/AppContext'

function Navbar() {
  const { navigate, token, user } = useAppContext();
  const [scrolled, setScrolled] = useState(false);

useEffect(() => {
  const onScroll = () => setScrolled(window.scrollY > 10);
  window.addEventListener('scroll', onScroll);
  onScroll();
  return () => window.removeEventListener('scroll', onScroll);
}, []);

  return (
    <div className={`sticky top-0 z-40 transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-none'}`}>
      <div className={`backdrop-blur-md border-b border-transparent ${scrolled ? 'bg-navy/95' : 'bg-navy/90'}`}>
        <div className='flex justify-between items-center py-1.5 md:py-2 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <img
            onClick={() => navigate('/')}
            src={assets.logo}
            alt='logo'
            className='w-12 sm:w-14 lg:w-16 cursor-pointer hover:scale-[1.03] transition-transform brightness-0 invert'
          />

          {token ? (
            <button
              onClick={() => navigate('/admin')}
              className='flex items-center gap-2 rounded-full px-3 py-2 pr-4 border border-border/30 bg-white/10 hover:bg-accent-soft hover:border-accent/30 hover:shadow-lg hover:scale-[1.02] active:scale-100 transition-all'
            >
              <span className='inline-flex items-center justify-center w-7 h-7 rounded-full bg-accent'>
                <img src={assets.user_icon} alt='avatar' className='w-4 h-4 invert' />
              </span>
              <span className='text-xs font-semibold text-white truncate max-w-[120px]'>
                {user?.name || user?.email || 'Account'}
              </span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/admin')}
              className='flex items-center gap-2 rounded-full text-xs bg-accent text-white px-4 py-2 shadow-lg hover:bg-accent-hover hover:shadow-xl hover:scale-[1.03] active:scale-100 transition-all font-semibold'
            >
              Login
              <img src={assets.arrow} alt="login" className='w-3 invert' />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default Navbar
