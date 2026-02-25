import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const WriterLogin = () => {
  const { axios, setToken } = useAppContext()
  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/auth/writer-login', credentials)
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('userToken', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        toast.success(`Welcome, ${data.user.name || data.user.email}!`)
        navigate('/writer')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-page px-4 py-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-slate-400/5 rounded-full blur-3xl" />
      </div>

      <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full max-w-md border border-border">
        <div className="text-center mb-6 sm:mb-8">
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 bg-navy rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <img src={assets.logo} alt="Writer" className="w-10 h-10 sm:w-12 sm:h-12 object-contain filter brightness-0 invert" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-1">Writer Login</h1>
          <p className="text-muted text-xs sm:text-sm font-medium">
            Sign in to write and manage your own posts
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-heading mb-1.5">Email</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white font-medium text-heading"
              placeholder="writer@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-heading mb-1.5">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-accent bg-white font-medium text-heading"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-heading"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white py-3 px-4 rounded-xl hover:bg-accent-hover font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none transition-all"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="mt-4 text-center text-xs sm:text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/writer-register" className="font-semibold text-accent hover:text-accent-hover hover:underline">
            Create account
          </Link>
        </p>
      </div>
    </div>
  )
}

export default WriterLogin
