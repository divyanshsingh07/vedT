import React, { useEffect } from 'react'
import Home from './pages/Home'
import Blog from './pages/Blog'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAppContext } from './contexts/AppContext'

import Layout from './pages/admin/Layout'
import Dashboard from './pages/admin/Dashboard'
import AddBlog from './pages/admin/AddBlog'
import BlogList from './pages/admin/BlogList'
import Comments from './pages/admin/Comments'
import AdminAccounts from './components/admin/AdminAccounts'
import Login from './components/admin/Login'
import Register from './components/admin/Register'
import WriterLogin from './components/user/WriterLogin'
import WriterRegister from './components/user/WriterRegister'
import WriterDashboard from './pages/writer/WriterDashboard'
import {Toaster} from 'react-hot-toast'

const AppRoutes = () => {
  const { token, user, authLoading } = useAppContext();

  // Only admins can access admin routes; writers get redirected
  const isAdmin = user?.role === 'admin';
  const AdminGuard = ({ children }) => {
    if (!token) return children;
    // Redirect writers (or when role not yet loaded) to writer dashboard
    if (!isAdmin) {
      return <Navigate to="/writer" replace />;
    }
    return children;
  };
  
  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #6366F1', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div>
      <Toaster />
      <Routes>
        <Route index element={<Home />} />
        <Route path='blog' element={<Blog />} />
        <Route path='blog/:id' element={<Blog />} />
        
        {/* Writer Routes */}
        <Route path='writer-login' element={<WriterLogin />} />
        <Route path='writer-register' element={token ? <Navigate to="/writer" replace /> : <WriterRegister />} />
        <Route path='writer' element={token ? <WriterDashboard /> : <WriterLogin />} />
        
        {/* Admin Routes - only admins can access */}
        <Route path='admin/register' element={token ? <AdminGuard><Navigate to="/admin" replace /></AdminGuard> : <Register />} />
        <Route 
          path='admin' 
          element={
            token ? (
              <AdminGuard><Layout /></AdminGuard>
            ) : (
              <Login />
            )
          }
        >
          <Route index element={token ? <Dashboard /> : <Login />} />
          <Route path='add-blog' element={token ? <AddBlog /> : <Login />} />
          <Route path='blog-list' element={token ? <BlogList /> : <Login />} />
          <Route path='comments' element={token ? <Comments /> : <Login />} />
          <Route path='admin-accounts' element={token ? <AdminAccounts /> : <Login />} />
        </Route>
      </Routes>
    </div>
  )
}

const App = () => {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  return <AppRoutes />;
}

export default App
