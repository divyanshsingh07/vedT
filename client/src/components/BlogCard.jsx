import React from 'react'
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'

const BlogCard = ({ blog, index = 0 }) => {
    const { title, description, category, image, _id, authorName, createdAt } = blog;
    const navigate = useNavigate();
    
    const stripHtml = (html) => {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    };
    
    const plainText = stripHtml(description);
    const previewText = plainText.slice(0, 120);
    const readTimeMinutes = Math.max(1, Math.round(plainText.split(/\s+/).length / 200));

    const formattedDate = new Date(createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
    
    return (
        <motion.article 
            onClick={() => navigate(`/blog/${_id}`)} 
            className='group flex flex-col bg-white rounded-2xl overflow-hidden border border-border/80 hover:border-accent/20 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer'
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
        >
            {/* Image */}
            <div className="relative aspect-[16/10] overflow-hidden">
                <img 
                    src={image} 
                    alt={title}  
                    className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out'
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            {/* Content */}
            <div className='flex flex-col flex-1 p-5'>
                {/* Category + Date row */}
                <div className="flex items-center justify-between mb-3">
                    <span className='px-2.5 py-1 bg-accent/10 text-accent text-[11px] font-semibold rounded-md tracking-wide'>
                        {category}
                    </span>
                    <span className="text-[11px] text-muted font-medium">
                        {formattedDate}
                    </span>
                </div>

                {/* Title */}
                <h3 className='text-[15px] sm:text-base font-semibold text-heading leading-snug mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200'>
                    {title}
                </h3>

                {/* Preview */}
                <p className='text-[13px] text-muted leading-relaxed line-clamp-2 mb-4'>
                    {previewText}...
                </p>

                {/* Footer */}
                <div className='mt-auto pt-3.5 border-t border-border/60 flex items-center justify-between'>
                    <div className='flex items-center gap-2'>
                        <span className='inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent'>
                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                        </span>
                        <span className='text-[12px] text-muted font-medium truncate max-w-[120px]'>{authorName || 'Anonymous'}</span>
                    </div>
                    <div className='flex items-center gap-1.5 text-[12px] text-muted font-medium'>
                        <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                        </svg>
                        <span>{readTimeMinutes} min read</span>
                    </div>
                </div>
            </div>
        </motion.article>
    )
}

export default BlogCard
