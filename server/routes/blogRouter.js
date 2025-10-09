import express from 'express';
import multer from 'multer';
import { createBlog, getBlogs, getAllBlogs, getBlogById, deleteBlogById, togglePublishedStatus, deleteComment, updateBlog, generateContent } from '../controlers/blogControler.js';
import jwt from 'jsonwebtoken';
import { addComment, getBlogComments } from '../controlers/blogControler.js';
import auth from '../middleware/auth.js';


const router = express.Router();

// Authentication middleware
const authenticateToken = (req, res, next) => {
    console.log('=== AUTH DEBUG ===');
    console.log('All headers:', req.headers);
    
    // Check for authorization header in different cases
    const authHeader = req.headers['authorization'] || req.headers['Authorization'] || req.headers['AUTHORIZATION'];
    console.log('Found auth header:', authHeader);
    
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    console.log('Extracted token:', token);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    
    if (!token) {
        console.log('No token found');
        return res.json({
            success: false,
            message: "Access token is required",
            debug: {
                receivedHeaders: Object.keys(req.headers),
                authHeader: authHeader
            }
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log('JWT verification error:', err.message);
            return res.json({
                success: false,
                message: "Invalid or expired token"
            });
        }
        console.log('JWT verified successfully, user:', user);
        req.user = user;
        next();
    });
};

// Configure multer for serverless file uploads (Vercel)
const upload = multer({ 
    storage: multer.memoryStorage(), // Use memory storage for serverless
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
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

// Blog routes
router.get('/', authenticateToken, getBlogs); 
router.get('/all', getAllBlogs);
router.post('/create', authenticateToken, upload.single('image'), createBlog);
router.post('/add', authenticateToken, upload.single('image'), createBlog);
router.put('/:blogId', authenticateToken, upload.single('image'), updateBlog); 
router.post('/addComment', addComment); 
router.delete('/comment/:commentId', auth, deleteComment);
router.get('/:blogId/comments', getBlogComments);
router.get('/:blogId', getBlogById); 
router.delete('/:blogId', authenticateToken, deleteBlogById); 
router.post('/:id/togglePublish', authenticateToken, togglePublishedStatus); 
router.post('/togglePublish', authenticateToken, togglePublishedStatus); 
router.post('/generateContent', authenticateToken, generateContent); 

// Test endpoint for AI generation (now requires auth)
router.post('/test-ai', authenticateToken, async (req, res) => {
  try {
    const { title, category } = req.body;
    console.log('🧪 Testing AI endpoint with:', { title, category });
    
    if (!title || !category) {
      return res.json({
        success: false,
        message: "Title and category are required for testing"
      });
    }
    
    // Import and test the Gemini function
    const { generateBlogContent } = await import('../configs/gemini.js');
    const content = await generateBlogContent(title, category);
    
    res.json({
      success: true,
      message: "AI test successful",
      data: { content }
    });
  } catch (error) {
    console.error('❌ AI test failed:', error);
    res.json({
      success: false,
      message: error.message
    });
  }
});

// Debug endpoint for testing blog creation (now requires auth)
router.post('/debug-create', authenticateToken, async (req, res) => {
  try {
    console.log('🔍 Debug blog creation test started');
    console.log('Request body:', req.body);
    
    // Test basic blog creation without file upload
    const testBlog = {
      title: "Debug Test Blog",
      subtitle: "Testing blog creation",
      description: "<p>This is a test blog post to debug the creation process.</p>",
      category: "Technology",
      image: "https://via.placeholder.com/800x400.png", // Placeholder image
      isPublished: false
    };
    
    console.log('Creating test blog:', testBlog);
    
    // Import Blog model and create
    const { default: Blog } = await import('../models/blog.js');
    const savedBlog = await Blog.create(testBlog);
    
    console.log('✅ Test blog created successfully:', savedBlog._id);
    
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