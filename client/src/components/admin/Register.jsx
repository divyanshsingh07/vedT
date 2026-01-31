import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Register = () => {
  const { axios, setToken } = useAppContext()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/admin/register', form)
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('adminToken', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        toast.success('Account created! Welcome.')
        navigate('/admin')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-800/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-black">
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-4 shadow-lg border-2 border-black">
            <img src={assets.logo} alt="Vedified" className="w-12 h-12 object-contain filter brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-black text-black mb-2">Create Account</h1>
          <p className="text-gray-800 text-sm font-semibold">Register for admin access</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-semibold"
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-semibold"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full pl-4 pr-12 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-semibold"
                placeholder="At least 6 characters"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-800"
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
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 font-bold uppercase tracking-wide border-2 border-black disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/admin" className="font-bold text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Register
