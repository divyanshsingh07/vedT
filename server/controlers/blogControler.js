import imagekit from "../configs/imagekit.js";
import fs from "fs";
import Blog from "../models/blog.js";
import Comment from "../models/comments.js";
import { generateBlogContent } from '../configs/gemini.js';

// Get all blogs
export const getBlogs = async (req, res) => {
    try {
        // Admins see all blogs; writers see only their own
        const authorFilter = req.user?.role === 'admin' ? {} : (req.user?.email ? { authorEmail: req.user.email } : {});
        const blogs = await Blog.find(authorFilter).sort({ createdAt: -1 });
        res.json({
            success: true,
            message: "Blogs retrieved successfully",
            data: blogs
        });
    } catch (error) {
        console.error('Get blogs error:', error);
        res.json({success: false, message: error.message});
    }
};

export const createBlog = async (req, res) => {
    try {
        console.log('=== CREATE BLOG DEBUG START ===');
        console.log('Request method:', req.method);
        console.log('Request headers:', req.headers);
        console.log('Request body:', req.body);
        console.log('Request files:', req.file);
        console.log('Environment check:', {
            hasMongoUri: !!process.env.MONGODB_URI,
            hasImagekitPublic: !!process.env.IMAGEKIT_PUBLIC_KEY,
            hasImagekitPrivate: !!process.env.IMAGEKIT_PRIVATE_KEY,
            hasImagekitUrl: !!process.env.IMAGEKIT_URL_ENDPOINT,
            isVercel: !!process.env.VERCEL
        });
        
        // Check if Blog field exists
        if (!req.body.Blog) {
            return res.json({
                success: false, 
                message: "Blog field is missing. Please send data in 'Blog' field.",
                receivedFields: Object.keys(req.body)
            });
        }
        
        // Parse Blog data
        let blogData;
        try {
            blogData = JSON.parse(req.body.Blog);
        } catch (parseError) {
            return res.json({
                success: false, 
                message: "Invalid JSON in Blog field",
                receivedBlog: req.body.Blog,
                parseError: parseError.message
            });
        }
        
        const {title, subtitle, description, category, isPublished = false} = blogData;
        const imgFile = req.file;

        // Validate fields based on draft/publish mode
        if (isPublished) {
            if (!title || !subtitle || !description || !category || !imgFile) {
                return res.json({
                    success: false,
                    message: "All fields are required to publish",
                    missingFields: {
                        title: !title,
                        subtitle: !subtitle,
                        description: !description,
                        category: !category,
                        image: !imgFile
                    }
                });
            }
        } else {
            if (!title) {
                return res.json({
                    success: false,
                    message: "Title is required to save a draft"
                });
            }
        }
        
        // Upload image to imagekit
        console.log('=== IMAGEKIT DEBUG ===');
        console.log('ImageKit config:', {
            publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'SET' : 'NOT SET',
            urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
        });
        
        try {
            let optimizedImageUrl;

            // Upload only if an image file was provided
            if (imgFile) {
                // Use file buffer directly from memory storage (for serverless)
                const fileBuffer = imgFile.buffer;
                console.log('File buffer available, size:', fileBuffer.length);
                
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: imgFile.originalname,
                    folder: "/blogs",
                });
                
                console.log('ImageKit upload response:', response);
                
                // Get imagekit url - try multiple methods
                try {
                    // Use the correct file path from response
                    const filePath = response.filePath || response.file;
                    console.log('Using file path:', filePath);
                    
                    // Method 1: Use imagekit.url() with transformations
                    optimizedImageUrl = imagekit.url({
                        path: filePath,
                        transformation: [
                            {width: 1280},
                            {quality: "auto"},
                            {format: "webp"},
                        ],
                    });
                    
                    console.log('Method 1 - Generated image URL:', optimizedImageUrl);
                    
                    // If Method 1 fails, try Method 2: Simple URL
                    if (!optimizedImageUrl || optimizedImageUrl === '') {
                        optimizedImageUrl = imagekit.url({ path: filePath });
                        console.log('Method 2 - Simple URL:', optimizedImageUrl);
                    }
                    
                    // If both methods fail, use direct URL construction
                    if (!optimizedImageUrl || optimizedImageUrl === '') {
                        optimizedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}${filePath}`;
                        console.log('Method 3 - Direct URL construction:', optimizedImageUrl);
                    }
                    
                } catch (urlError) {
                    console.error('URL generation error:', urlError);
                    // Fallback to direct URL construction using filePath
                    const filePath = response.filePath || response.file;
                    optimizedImageUrl = `${process.env.IMAGEKIT_URL_ENDPOINT}${filePath}`;
                    console.log('Fallback URL:', optimizedImageUrl);
                }
            }

            // Build blog payload
            const blogToSave = {
                title,
                subtitle,
                description,
                category,
                isPublished
            };

            if (optimizedImageUrl) {
                blogToSave.image = optimizedImageUrl;
            }

            // If publish requested but no image URL could be created
            if (isPublished && !blogToSave.image) {
                throw new Error('Image is required to publish the blog');
            }

            // attach author from auth middleware if available
            if (req.user?.email) {
                blogToSave.authorEmail = req.user.email;
                blogToSave.authorName = req.user.name;
            }

            const savedBlog = await Blog.create(blogToSave);
            console.log('Blog saved successfully:', savedBlog);

            res.json({success: true, message: isPublished ? "Blog created successfully" : "Draft saved successfully", blog: savedBlog});
            
        } catch (imagekitError) {
            console.error('ImageKit error:', imagekitError);
            console.error('Full ImageKit error details:', {
                message: imagekitError.message,
                stack: imagekitError.stack,
                name: imagekitError.name
            });
            
            // No file cleanup needed in memory storage (serverless)
            
            res.json({
                success: false, 
                message: "Image upload failed",
                error: imagekitError.message,
                details: "Check server console for full error details"
            });
        }
        
    } catch (error) {
        console.error('=== BLOG CREATION ERROR ===');
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
        console.error('Error name:', error.name);
        console.error('Full error object:', error);
        console.log('=== CREATE BLOG DEBUG END ===');
        
        res.status(500).json({
            success: false, 
            message: error.message || 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.stack : 'Server error occurred',
            timestamp: new Date().toISOString()
        });
    }
}

// Get all published blogs
export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({isPublished: true}).sort({ createdAt: -1 });
        res.json({success: true, message: "Blogs retrieved successfully", data: blogs});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Get blog by ID
export const getBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        res.json({success: true, message: "Blog retrieved successfully", data: blog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Delete blog by ID
export const deleteBlogById = async (req, res) => {
    try {
        const {blogId} = req.params;
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.json({success: false, message: "Blog not found"});
        }
        // Everyone (admin and writer) can only delete their own blogs
        if (!blog.authorEmail || blog.authorEmail !== req.user?.email) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
        }
        await Blog.findByIdAndDelete(blogId);
        //delete comments associated with the blog
        await Comment.deleteMany({blog: blogId});




        res.json({success: true, message: "Blog deleted successfully", data: blog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Toggle published status
export const togglePublishedStatus = async (req, res) => {
    try {
        // Get ID from either params (URL) or body
        const id = req.params.id || req.body.id;
        
        if (!id) {
            return res.json({success: false, message: "Blog ID is required"});
        }
        
        const blog = await Blog.findById(id);
        if (!blog) {
            return res.json({success: false, message: "Blog not found"});
        }
        // Everyone (admin and writer) can only update their own blogs
        if (!blog.authorEmail || blog.authorEmail !== req.user?.email) {
            return res.status(403).json({ success: false, message: "Not authorized to update this blog" });
        }
        blog.isPublished = !blog.isPublished;
        await blog.save();
        res.json({success: true, message: "Blog published status updated successfully", data: blog});
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Update blog by ID
export const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        console.log('Update blog request for ID:', blogId);
        console.log('Request body:', req.body);
        console.log('Request files:', req.file);
        
        // Check if Blog field exists
        if (!req.body.Blog) {
            return res.json({
                success: false, 
                message: "Blog field is missing. Please send data in 'Blog' field.",
                receivedFields: Object.keys(req.body)
            });
        }
        
        // Parse Blog data
        let blogData;
        try {
            blogData = JSON.parse(req.body.Blog);
        } catch (parseError) {
            return res.json({
                success: false, 
                message: "Invalid JSON in Blog field",
                receivedBlog: req.body.Blog,
                parseError: parseError.message
            });
        }
        
        const { title, subtitle, description, category } = blogData;
        
        if (!title || !description || !category) {
            return res.json({
                success: false, 
                message: "Title, description, and category are required",
                missingFields: {
                    title: !title,
                    description: !description,
                    category: !category
                }
            });
        }
        
        // Find existing blog
        const existingBlog = await Blog.findById(blogId);
        if (!existingBlog) {
            return res.json({ success: false, message: "Blog not found" });
        }
        // Everyone (admin and writer) can only update their own blogs
        if (!existingBlog.authorEmail || existingBlog.authorEmail !== req.user?.email) {
            return res.status(403).json({ success: false, message: "Not authorized to update this blog" });
        }
        
        // Update basic fields
        existingBlog.title = title;
        existingBlog.subtitle = subtitle || '';
        existingBlog.description = description;
        existingBlog.category = category;
        
        // Handle image update if new image is provided
        if (req.file) {
            try {
                // Use file buffer directly from memory storage (for serverless)
                const fileBuffer = req.file.buffer;
                console.log('New image buffer available, size:', fileBuffer.length);
                
                const response = await imagekit.upload({
                    file: fileBuffer,
                    fileName: req.file.originalname,
                    folder: "/blogs",
                });
                
                console.log('New image uploaded to ImageKit:', response);
                
                // Get optimized image URL
                let optimizedImageUrl;
                try {
                    const filePath = response.filePath || response.file;
                    optimizedImageUrl = imagekit.url({
                        path: filePath,
                        transformation: [
                            {width: 1280},
                            {quality: "auto"},
                            {format: "webp"},
                        ],
                    });
                } catch (urlError) {
                    console.log('ImageKit URL generation error, using direct URL:', urlError.message);
                    optimizedImageUrl = response.url;
                }
                
                existingBlog.image = optimizedImageUrl;
                
                // No file cleanup needed in memory storage (serverless)
                
            } catch (imageError) {
                console.error('Image upload error:', imageError);
                return res.json({ success: false, message: "Failed to upload new image" });
            }
        }
        
        // Save updated blog
        await existingBlog.save();
        
        res.json({
            success: true,
            message: "Blog updated successfully",
            data: existingBlog
        });
 
    } catch (error) {
        console.error('Update blog error:', error);
        res.json({ success: false, message: error.message });
    }
}


export const addComment = async (req, res) => {
    try{
        const{blog,name , content} = req.body;
        // Create comment with pending status by default
        const authorEmail = req.user?.email || null;
        await Comment.create({blog, name, authorEmail, content, isApproved: false});
        res.json({success: true, message: "Comment added successfully. It will be visible after admin approval."});

    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const getBlogComments = async (req, res) => {
    try{
        const{blogId} = req.params;
        // Only return approved comments for public view
        const comments = await Comment.find({blog: blogId, isApproved: true}).sort({createdAt: -1});
        res.json({success: true, message: "Comments retrieved successfully", data: comments});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

export const deleteComment = async (req, res) => {
    try {
        const { commentId } = req.params;
        // Find the comment first
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.json({ success: false, message: "Comment not found" });
        }

        // Authorization: only the comment author can delete their own comment
        const requesterEmail = req.user?.email;
        const isCommentAuthor = requesterEmail && comment.authorEmail && comment.authorEmail.toLowerCase() === requesterEmail.toLowerCase();

        if (!isCommentAuthor) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(commentId);
        res.json({ success: true, message: "Comment deleted successfully" });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
}

// Generate blog content using Gemini AI
export const generateContent = async (req, res) => {
    try {
        const { title, category, subtitle } = req.body;
        
        if (!title || !category) {
            return res.json({
                success: false, 
                message: "Title and category are required for AI content generation"
            });
        }
        
        // Generate content using Gemini AI
        const content = await generateBlogContent(title, category, subtitle);
        
        res.json({
            success: true, 
            message: "Blog content generated successfully", 
            data: { content }
        });
    } catch (error) {
        console.error('AI content generation error:', error);
        res.json({
            success: false, 
            message: error.message || "Failed to generate AI content"
        });
    }
}