import React, { useMemo, useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion, AnimatePresence } from "framer-motion"
import BlogCard from './BlogCard';
import { useAppContext } from '../contexts/AppContext';

function BlogList() {
  const [menu, setMenu] = useState("All");
  const [sortBy, setSortBy] = useState('Newest');
  const { blogs, input } = useAppContext();

  const filteredBlogs = blogs.filter(blog => {
    if (input == '') {
      return blog;
    }
    else {
      return blog.title.toLowerCase().includes(input.toLowerCase()) || blog.category.toLowerCase().includes(input.toLowerCase());
    }
  })

  const sortedBlogs = useMemo(() => {
    const list = [...filteredBlogs];
    if (sortBy === 'Newest') {
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    if (sortBy === 'Oldest') {
      return list.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    return list.sort((a, b) => (b?.description?.length || 0) - (a?.description?.length || 0));
  }, [filteredBlogs, sortBy]);

  const displayBlogs = sortedBlogs.filter((blog) => {
    if (menu === "All") return true;
    if (menu === "Tech/Startup") return blog.category === "Technology" || blog.category === "Startup";
    if (menu === "Sports") return blog.category === "Cricket" || blog.category === "Sports";
    return blog.category === menu;
  });

  return (
    <div
      id="blog-list-section"
      className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 max-w-7xl mx-auto"
    >
      {/* Section Header */}
      <div className="text-center mb-10 sm:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-semibold tracking-wide mb-4">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            Latest Articles
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-heading leading-tight">
            Explore the blog
          </h2>
          <p className="mt-3 text-base sm:text-lg text-muted max-w-xl mx-auto">
            Stories, ideas, and guides across technology, lifestyle, finance, and more.
          </p>
        </motion.div>
      </div>

      {/* Filter Bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10 pb-6 border-b border-border"
      >
        <div className="flex flex-wrap justify-center sm:justify-start gap-1.5 sm:gap-2">
          {blogCategories.map((item) => (
            <button
              key={item}
              onClick={() => setMenu(item)}
              className={`px-3.5 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                menu === item
                  ? 'bg-accent text-white shadow-sm shadow-accent/25'
                  : 'text-muted hover:text-heading hover:bg-slate-100'
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="relative flex-shrink-0">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='appearance-none text-[13px] font-medium rounded-lg border border-border bg-white pl-3 pr-8 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent text-heading cursor-pointer'
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Popular</option>
          </select>
          <span className='pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </span>
        </div>
      </motion.div>

      {/* Results count */}
      <div className="mb-6">
        <p className="text-sm text-muted">
          {displayBlogs.length === 0 ? 'No posts found' : `Showing ${displayBlogs.length} post${displayBlogs.length !== 1 ? 's' : ''}`}
          {menu !== 'All' && <span> in <span className="text-accent font-medium">{menu}</span></span>}
        </p>
      </div>

      {/* Blog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7 lg:gap-8 mb-16">
        <AnimatePresence mode="wait">
          {displayBlogs.map((blog, index) => (
            <BlogCard key={blog._id} blog={blog} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {displayBlogs.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-accent-soft flex items-center justify-center">
            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-heading mb-1">No posts yet</h3>
          <p className="text-muted text-sm">Check back soon or try a different category.</p>
        </motion.div>
      )}
    </div>
  );
}


export default BlogList
