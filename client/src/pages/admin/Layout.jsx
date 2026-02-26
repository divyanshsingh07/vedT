import React, { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAppContext } from '../../contexts/AppContext';
import { assets } from '../../assets/assets';
import Sidebar from '../../components/admin/Sidebar';
import toast from 'react-hot-toast';
import axios from 'axios';

const Layout = () => {
  const navigate = useNavigate();
  const { setToken, setBlogs, setInput, token } = useAppContext();
  const [adminInfo, setAdminInfo] = useState(null);

  // Add smooth scroll behavior
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  // Get admin info from token
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setAdminInfo({
          name: payload.name || 'Admin',
          email: payload.email || 'admin@example.com'
        });
      } catch (error) {
        console.error('Error parsing token:', error);
        setAdminInfo({
          name: 'Admin',
          email: 'admin@example.com'
        });
      }
    }
  }, [token]);

  const handleLogout = async () => {
    try {
      // Clear local storage
      localStorage.removeItem('adminToken');
      
      // Clear context state
      setToken(null);
      setBlogs([]);
      setInput('');
      setAdminInfo(null);
      
      // Clear axios authorization header
      delete axios.defaults.headers.common['Authorization'];
      
      // Show success message
      toast.success('Logged out successfully');
      
      // Navigate to home
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <>
      {/* Navbar - Same as regular Navbar but with Logout */}
      <div className='flex justify-between items-center py-1.5 sm:py-2 px-4 sm:px-8 lg:px-20 xl:px-32 bg-navy border-b border-navy-light'>
        <div className='flex items-center gap-3'>
          <img 
            onClick={handleLogoClick} 
            src={assets.logo} 
            alt='logo' 
            className='w-14 sm:w-16 lg:w-20 cursor-pointer hover:opacity-80 transition-opacity brightness-0 invert' 
          />
          {adminInfo && (
            <div className='hidden sm:block'>
              <p className='text-[10px] text-slate-400 font-medium leading-tight'>Welcome back,</p>
              <p className='text-sm font-bold text-white leading-tight'>{adminInfo.name}</p>
            </div>
          )}
        </div>
        <button 
          onClick={handleLogout} 
          className='flex items-center gap-2 rounded-full hover:scale-105 hover:bg-accent-hover transition-all cursor-pointer text-xs bg-accent text-white px-3 sm:px-4 py-1.5 sm:py-2 font-semibold tracking-wide'
        >
          Logout
          <img src={assets.arrow} alt="logout" className='w-3 h-3 invert' />
        </button>
      </div>

      {/* Content from child routes */}
      <div className='flex h-[calc(100vh-48px)] sm:h-[calc(100vh-52px)]'>
        <Sidebar />
        <div className='flex-1 overflow-y-auto bg-page'>
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;