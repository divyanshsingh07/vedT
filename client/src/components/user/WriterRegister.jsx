import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import toast from 'react-hot-toast'

const WriterRegister = () => {
  const { axios, setToken } = useAppContext()
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleRegister = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const { data } = await axios.post('/api/auth/writer-register', form)
      if (data.success) {
        setToken(data.token)
        localStorage.setItem('userToken', data.token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
        toast.success('Account created! Welcome.')
        navigate('/writer')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-black">
        <h1 className="text-2xl font-black text-center mb-6 text-black">Create Writer Account</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-black mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Your name"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
              className="w-full px-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="writer@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-black mb-1">Password (min 6 chars)</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 pr-12 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-gray-600"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 font-bold uppercase tracking-wide disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-700">
          Already have an account?{' '}
          <Link to="/writer-login" className="font-bold text-black hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

export default WriterRegister
