import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from '../../contexts/AppContext'
import { assets } from '../../assets/assets'
import toast from 'react-hot-toast'

const Login = () => {
  const { axios, setToken } = useAppContext();

  const [credentials, setCredentials] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try{
      const{data}=await axios.post("/api/admin/login",credentials);
      if(data.success){
        setToken(data.token);
        localStorage.setItem("adminToken",data.token); // Changed from "token" to "adminToken"
        axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
        toast.success('Welcome back, Admin!');
        navigate("/admin");
      }
      else{
        toast.error(data.message);
      }
    }
    catch(error){
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    }
    finally {
      setIsLoading(false)
    }
  }



  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50 p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-800/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border-4 border-black">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="mx-auto w-20 h-20 bg-black rounded-2xl flex items-center justify-center mb-4 shadow-lg border-2 border-black">
            <img src={assets.logo} alt="Vedified" className="w-12 h-12 object-contain filter brightness-0 invert" />
          </div>
          <h1 className="text-3xl font-black text-black mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-800 text-sm font-semibold">Sign in to your admin dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 bg-white font-semibold"
                placeholder="admin@vedified.com"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-black">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full pl-10 pr-12 py-3 border-2 border-black rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 bg-white font-semibold"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-black hover:text-gray-800 transition-colors duration-200"
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

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 px-4 rounded-xl hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black transition-all duration-200 font-bold uppercase tracking-wide shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-black"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                Signing in...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Sign In to Dashboard
              </div>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-6 p-4 bg-amber-100 border-2 border-black rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="h-5 w-5 text-black mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <h3 className="font-bold text-black text-sm mb-1">Authorized Access Only</h3>
              <p className="text-xs text-gray-800 font-medium">Only authorized admin credentials are accepted. New registrations are disabled for security.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-800 font-semibold">
            © 2024 Vedified. Secure admin access.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login