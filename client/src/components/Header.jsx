import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../contexts/AppContext'
import { motion } from 'framer-motion'

function Header() {
  const { setInput, navigate, token } = useAppContext();
  const [searchValue, setSearchValue] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    setInput(searchValue);
  };

  const handleInputChange = (e) => {
    setSearchValue(e.target.value);
    setInput(e.target.value);
  };

  return (
    <div className=" w-fullrelative bg-amber-50 py-8">
      {/* Background Accent (subtle) */}
      <img
        src={assets.gradientBackground}
        alt="bg"
        className="absolute -top-[35%] opacity-10 -z-10"
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center mt-8 mb-8"
      >
        <div className="inline-flex items-center justify-center border-2 border-black rounded-full px-5 py-1.5 gap-2 text-xs sm:text-sm font-bold text-black bg-amber-100 shadow-lg">
          <img src={assets.star_icon} alt="spark" className="w-3.5 h-3.5" />
          <p className="">Write your blog with AI assistance </p>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight py-4 text-black">
          Your own{" "}
          <span className="bg-gradient-to-r from-sky-400 via-blue-500 to-blue-700 bg-clip-text text-transparent">
  blogging
</span>{" "}
          platform
        </h1>
        <p className="max-w-2xl mx-auto text-gray-800 text-sm sm:text-base font-bold">
          Create, publish, and grow your audience with elegant tooling and
          AI-powered writing.
        </p>

        {/* CTA Buttons */}
        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={() => navigate(token ? "/admin" : "/admin")}
            className="px-4 sm:px-5 py-2 rounded-full bg-black text-white font-bold uppercase tracking-wide shadow-lg hover:bg-gray-800 hover:shadow-xl hover:scale-[1.03] active:scale-100 transition-all border-2 border-black text-sm"
          >
            Start Writing
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-4 sm:px-5 py-2 rounded-full border-2 border-black bg-amber-100 text-black font-bold uppercase tracking-wide hover:bg-amber-200 hover:shadow-md hover:scale-[1.02] active:scale-100 transition-all text-sm"
          >
            Explore Blogs
          </button>
        </div>
      </motion.div>

      {/* Search Bar */}
      <motion.form
        onSubmit={handleSearch}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="flex items-center max-w-xl mx-auto border-2 border-black bg-white rounded-full overflow-hidden shadow-lg mt-6"
      >
        <div className="pl-4 text-black">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>
        <input
          type="text"
          placeholder="Search for blogs"
          value={searchValue}
          onChange={handleInputChange}
          required
          className="flex-1 pl-3 pr-3 py-2 outline-none bg-transparent text-black placeholder-gray-600 font-semibold text-sm"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 m-1 rounded-full hover:bg-gray-800 hover:shadow-lg hover:scale-[1.03] transition-all cursor-pointer font-bold uppercase tracking-wide border-2 border-black text-sm"
        >
          Search
        </button>
      </motion.form>
    </div>
  )
}

export default Header