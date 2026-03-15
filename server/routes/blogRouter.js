import express from 'express';
import multer from 'multer';
import { createBlog, getBlogs, getAllBlogs, getBlogById, deleteBlogById, togglePublishedStatus, deleteComment, updateBlog, generateContent } from '../controlers/blogControler.js';
import { addComment, getBlogComments } from '../controlers/blogControler.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Configure multer for serverless file uploads (Vercel)
const upload = multer({ 
    storage: multer.memoryStorage(), // Use memory storage for serverless
    limits: {
        fileSize: 20 * 1024 * 1024 // 20MB limit (increased from 5MB)
    },
    fileFilter: (req, file, cb) => {
        // Accept only images
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Wrapper function to handle multer errors
const handleUpload = (uploadMiddleware) => {
    return (req, res, next) => {
        uploadMiddleware(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                if (err.code === 'LIMIT_FILE_SIZE') {
                    return res.status(400).json({
                        success: false,
                        message: `File too large. Maximum file size is 20MB.`,
                        error: err.message
                    });
                }
                return res.status(400).json({
                    success: false,
                    message: `File upload error: ${err.message}`,
                    error: err.message
                });
            }
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.message || 'File upload error',
                    error: err.message
                });
            }
            next();
        });
    };
};

// Blog routes
router.get('/', auth, getBlogs); 
router.get('/all', getAllBlogs);
router.post('/create', auth, handleUpload(upload.single('image')), createBlog);
router.post('/add', auth, handleUpload(upload.single('image')), createBlog);
router.put('/:blogId', auth, handleUpload(upload.single('image')), updateBlog); 
router.post('/addComment', addComment); 
router.delete('/comment/:commentId', auth, deleteComment);
router.get('/:blogId/comments', getBlogComments);
router.get('/:blogId', getBlogById); 
router.delete('/:blogId', auth, deleteBlogById); 
router.post('/:id/togglePublish', auth, togglePublishedStatus); 
router.post('/togglePublish', auth, togglePublishedStatus); 
router.post('/generateContent', auth, generateContent); 

// Test/debug endpoints disabled in production
const isProduction = process.env.NODE_ENV === 'production';

router.post('/test-ai', auth, async (req, res) => {
  if (isProduction) return res.status(404).json({ success: false, message: 'Not found' });
  try {
    const { title, category } = req.body;
    if (!title || !category) {
      return res.json({
        success: false,
        message: "Title and category are required for testing"
      });
    }
    const { generateBlogContent } = await import('../configs/gemini.js');
    const content = await generateBlogContent(title, category);
    res.json({
      success: true,
      message: "AI test successful",
      data: { content }
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message
    });
  }
});

router.post('/debug-create', auth, async (req, res) => {
  if (isProduction) return res.status(404).json({ success: false, message: 'Not found' });
  try {
    const testBlog = {
      title: "Debug Test Blog",
      subtitle: "Testing blog creation",
      description: "<p>This is a test blog post to debug the creation process.</p>",
      category: "Technology",
      image: "https://via.placeholder.com/800x400.png", // Placeholder image
      isPublished: false
    };
    const { default: Blog } = await import('../models/blog.js');
    const savedBlog = await Blog.create(testBlog);
    res.json({
      success: true,
      message: "Debug blog creation successful",
      blogId: savedBlog._id,
      blog: savedBlog
    });
    
  } catch (error) {
    console.error('❌ Debug blog creation failed:', error);
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      name: error.name
    });
  }
});

export default router;