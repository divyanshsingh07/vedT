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

  const scrollToBlogs = () => {
    const section = document.getElementById('blog-list-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      navigate('/');
    }
  };

  return (
    <section className="relative overflow-hidden py-10 sm:py-12 lg:py-16">
      <div className="pointer-events-none absolute -left-32 top-10 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-64 w-64 rounded-full bg-slate-300/20 blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-accent-soft px-4 py-1.5 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.16em] text-accent">
              <img src={assets.star_icon} alt="spark" className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Write your next blog with AI assistance</span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight leading-tight text-heading font-serif">
                Your space for
                <span className="block bg-gradient-to-r from-accent to-accent-hover bg-clip-text text-transparent">
                  thoughtful blogging
                </span>
              </h1>
              <p className="max-w-xl text-sm sm:text-base md:text-lg font-medium text-muted">
                Draft ideas, polish stories, and share them with the world. Clean layout, smooth
                writing experience, and tools that stay out of your way.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate(token ? '/admin' : '/admin')}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-lg shadow-accent/25 hover:bg-accent-hover hover:shadow-xl hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all"
              >
                Start writing
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-accent font-bold">
                  ↗
                </span>
              </button>
              <button
                onClick={scrollToBlogs}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold uppercase tracking-[0.12em] text-heading shadow-sm hover:bg-accent-soft hover:border-accent/30 hover:shadow-md hover:-translate-y-0.5 hover:scale-[1.02] active:translate-y-0 active:scale-100 transition-all"
              >
                Explore blogs
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-xs sm:text-sm font-medium text-muted">
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-border">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                  ✓
                </span>
                No noise, just words that matter
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 border border-border">
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                  AI
                </span>
                Optional AI help when you need it
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.7, ease: 'easeOut' }}
            className="relative hidden sm:block"
          >
            <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-accent/15 via-slate-200/40 to-accent-soft blur-xl" />

            <div className="relative grid gap-4">
              <motion.div
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/admin')}
                className="rounded-2xl border border-border bg-white shadow-lg px-5 py-4 cursor-pointer hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      Featured draft
                    </p>
                    <p className="text-sm sm:text-base font-bold text-heading">
                      A better way to start your next blog post
                    </p>
                  </div>
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft border border-accent/20">
                    <img src={assets.blog_icon} alt="blog icon" className="h-4 w-4" />
                  </span>
                </div>
                <div className="space-y-1.5 text-[11px] sm:text-xs text-muted font-medium">
                  <p>• Outline your idea in seconds.</p>
                  <p>• Expand sections with AI, then edit in your own voice.</p>
                  <p>• Publish when it feels ready, not when the UI lets you.</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -4 }}
                className="ml-8 rounded-2xl border border-dashed border-border bg-white/80 px-4 py-3 shadow-sm"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted">
                      Today on the blog
                    </p>
                    <p className="mt-1 text-sm font-semibold text-heading line-clamp-2">
                      Lifestyle, technology, and finance stories curated for curious readers.
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-[11px] text-muted font-medium">
                    <span>10+ published posts</span>
                    <span>5 comments waiting to be read</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
          className="mt-8 sm:mt-10 flex items-center max-w-xl md:max-w-2xl mx-auto border border-border bg-white rounded-full overflow-hidden shadow-lg"
        >
          <div className="pl-4 text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search by title or category"
            value={searchValue}
            onChange={handleInputChange}
            required
            className="flex-1 pl-3 pr-3 py-2.5 sm:py-3 outline-none bg-transparent text-sm sm:text-base text-heading placeholder-slate-400 font-medium"
          />
          <button
            type="submit"
            className="bg-accent text-white px-4 sm:px-5 py-2.5 m-1 rounded-full hover:bg-accent-hover hover:shadow-lg transition-all cursor-pointer font-semibold text-[11px] sm:text-xs uppercase tracking-[0.12em]"
          >
            Search
          </button>
        </motion.form>
      </div>
    </section>
  )
}

export default Header
