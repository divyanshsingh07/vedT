import React, { useMemo, useState } from 'react'
import { blog_data, blogCategories } from '../assets/assets'
import { motion, LayoutGroup } from "framer-motion"
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


  const categoryIcon = (cat) => {
    switch (cat) {
      case 'Technology':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9.75 17L8 15.25m8 0L14.25 17M4 7h16M8 7l-4 10h16L16 7' />
          </svg>
        );
      case 'Startup':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
          </svg>
        );
      case 'Finance':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8c-3 0-5 1.5-5 4s2 4 5 4 5-1.5 5-4-2-4-5-4zm0-5v5m0 8v5' />
          </svg>
        );
      case 'Lifestyle':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 6v6l4 2' />
          </svg>
        );
      case 'Politics':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
          </svg>
        );
      case 'Cricket':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M13 10V3L4 14h7v7l9-11h-7z' />
          </svg>
        );
      case 'Geography':
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
          </svg>
        );
      default:
        return (
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 7h18M3 12h18M3 17h18' />
          </svg>
        );
    }
  };

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

  return (
    <div
      id="blog-list-section"
      className="px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16 py-10 max-w-6xl mx-auto"
    >
      <div className="mb-6 sm:mb-8">
        <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-[0.24em] text-muted">
          Browse
        </p>
        <h2 className="mt-1 text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-heading">
          Latest posts from the community
        </h2>
        <p className="mt-2 text-sm sm:text-base text-muted font-medium max-w-2xl">
          Filter by category, sort by date, and dive into stories across technology, lifestyle,
          finance, and more.
        </p>
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 my-4 sm:my-6">
        <div className="flex flex-wrap justify-center md:justify-start gap-2">
          {blogCategories.map((item) => (
            <button
              key={item}
              onClick={() => setMenu(item)}
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${
                menu === item
                  ? 'border-accent text-white bg-accent shadow-md'
                  : 'border-border text-heading bg-white hover:bg-accent-soft hover:border-accent/30 hover:shadow-sm'
              } transition-all hover:-translate-y-0.5 font-semibold text-[11px] sm:text-xs`}
            >
              <span className='text-current'>{categoryIcon(item)}</span>
              <span className='text-sm font-semibold'>{item}</span>
            </button>
          ))}
        </div>

        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className='appearance-none text-[11px] sm:text-xs font-semibold rounded-full border border-border bg-white px-3 py-2 pr-8 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent text-heading'
          >
            <option>Newest</option>
            <option>Oldest</option>
            <option>Popular</option>
          </select>
          <span className='pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-muted'>
            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
            </svg>
          </span>
        </div>
      </div>

      <div className="mt-6 sm:mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16 lg:mb-20">
        {sortedBlogs
          .filter((blog) => menu === "All" ? true : blog.category === menu)
          .map((blog) => (
            <BlogCard key={blog._id} blog={blog} />
          ))}
      </div>
    </div>
  );
}


export default BlogList
