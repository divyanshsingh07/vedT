import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const BlogCard = ({ blog }) => {
    const { title, description, category, image, _id, authorName, createdAt } = blog;
    const navigate = useNavigate();
    
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };
    
    const previewText = stripHtml(description).slice(0, 100);
    const readTimeMinutes = Math.max(1, Math.round(stripHtml(description).split(/\s+/).length / 200));
    
    const cardStyles = {
        title: {
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        },
        description: {
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
        }
    };
    
    return (
        <motion.div 
            onClick={() => navigate(`/blog/${_id}`)} 
            className='group w-full rounded-2xl overflow-hidden border border-border bg-white shadow-md hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer'
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.45 }}
        >
            <div className="relative overflow-hidden">
                <img 
                    src={image} 
                    alt={title}  
                    className='w-full h-40 sm:h-44 md:h-48 lg:h-52 object-cover group-hover:scale-110 transition-transform duration-700 ease-out'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-300"></div>
                
                <span className='absolute top-3 left-3 px-3 py-1 bg-accent text-white text-[10px] sm:text-xs font-semibold rounded-full shadow-lg uppercase tracking-[0.1em] group-hover:bg-accent-hover transition-all duration-300'>
                    {category}
                </span>
                
                <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <div className="bg-white/90 backdrop-blur-md rounded-full p-1.5 shadow-lg border border-border">
                        <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
            
            <div className='p-4 sm:p-5 lg:p-5 bg-white'>
                <h5 
                    className='mb-2.5 text-base sm:text-lg font-bold text-heading leading-snug tracking-tight group-hover:text-accent transition-colors duration-300'
                    style={cardStyles.title}
                >
                    {title}
                </h5>
                <p 
                    className='text-xs sm:text-sm text-muted leading-relaxed font-medium tracking-normal'
                    style={cardStyles.description}
                >
                    {previewText}...
                </p>
                <div className='mt-3.5 flex items-center justify-between text-[11px] sm:text-xs text-muted font-medium'>
                  <div className='flex items-center gap-2'>
                    <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-navy'>
                      <svg className='w-3.5 h-3.5 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' />
                      </svg>
                    </span>
                    <span className='truncate max-w-[110px] sm:max-w-[130px]'>{authorName || 'Anonymous'}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <svg className='w-3.5 h-3.5 text-muted' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                    </svg>
                    <span>{readTimeMinutes} min read</span>
                  </div>
                </div>
            </div>
        </motion.div>
    )
}

export default BlogCard
