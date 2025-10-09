import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import Comment from "../models/comments.js";

// ==========================================
// SINGLE ADMIN ACCOUNT - NO REGISTRATION
// ==========================================
// ONLY this account can access the admin dashboard
// All other login methods are disabled
const ADMIN_ACCOUNTS = [
    {
        email: "vt8795507492@gmail.com",
        password: "Vedu@1906",
        name: "Ved Praksh Tiwari"
    }
];

// Function to check if credentials match any admin account
const validateAdminCredentials = (email, password) => {
    return ADMIN_ACCOUNTS.find(admin => 
        admin.email === email && admin.password === password
    );
};

const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Check if credentials match the ONLY allowed admin account
        const adminAccount = validateAdminCredentials(email, password);
        
        if (!adminAccount) {
            return res.json({ 
                success: false, 
                message: "Invalid credentials. Only authorized admin can login." 
            });
        }
        
        // Generate JWT token with admin info
        const token = jwt.sign({ 
            email: adminAccount.email,
            name: adminAccount.name,
            role: "admin"
        }, process.env.JWT_SECRET);
        
        res.json({
            success: true, 
            message: `Welcome back, ${adminAccount.name}!`, 
            token,
            admin: {
                name: adminAccount.name,
                email: adminAccount.email
            }
        });
    } catch (error) {
        res.json({success: false, message: error.message });
    }
}

// Google Login - DISABLED (No registration allowed)
const googleLogin = async (req, res) => {
    return res.json({ 
        success: false, 
        message: "Google login is disabled. Only email/password login with authorized admin account is allowed." 
    });
}

// Firebase Login - DISABLED (No registration allowed)
const firebaseLogin = async (req, res) => {
    return res.json({ 
        success: false, 
        message: "Firebase login is disabled. Only email/password login with authorized admin account is allowed." 
    });
}

const getAllBlogsAdmin = async (req, res) => {
    try{
        const blogs = await Blog.find({}).sort({createdAt: -1});
        res.json({success: true, blogs});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const getAllCommentsAdmin = async (req, res) => {
    try{
        const comments = await Comment.find({}).populate("blog").sort({createdAt: -1});
        res.json({success: true, comments});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const getDashboardData = async (req, res) => {
    try{
       // Scope to current user if available; fallback to global for legacy tokens
       const authorFilter = req.user?.email ? { authorEmail: req.user.email } : {};

        const recentBlogs = await Blog.find(authorFilter).sort({createdAt: -1}).limit(5);
        const blogCount = await Blog.countDocuments(authorFilter);
        const draftBlogs = await Blog.countDocuments({ ...authorFilter, isPublished: false });

        // Count comments on the user's blogs only
        const authorBlogs = await Blog.find(authorFilter).select('_id');
        const blogIds = authorBlogs.map(b => b._id);
        const commentCount = blogIds.length > 0 
            ? await Comment.countDocuments({ blog: { $in: blogIds } })
            : 0;

        const dashboardData = {
            recentBlogs,
            blogCount,
            commentCount,
            draftBlogs
        }
        res.json({success: true, dashboardData});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const deleteBlogAdmin = async (req, res) => {
    try{
        const{blogId} = req.params;
        await Blog.findByIdAndDelete(blogId);
        res.json({success: true, message: "Blog deleted successfully"});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const deleteCommentAdmin = async (req, res) => {
    try{
        const{commentId} = req.params;
        await Comment.findByIdAndDelete(commentId);
        res.json({success: true, message: "Comment deleted successfully"});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const approveCommentAdmin = async (req, res) => {
    try{
        const{commentId} = req.params;
        await Comment.findByIdAndUpdate(commentId, {isApproved: true});
        res.json({success: true, message: "Comment approved successfully"});
    }
    catch(error){
        res.json({success: false, message: error.message});
    }
}

const getAdminAccounts = async (req, res) => {
    try {
        // Return admin accounts without passwords for security
        const adminList = ADMIN_ACCOUNTS.map(admin => ({
            email: admin.email,
            name: admin.name,
            role: "admin"
        }));
        
        res.json({
            success: true, 
            adminAccounts: adminList
        });
    } catch (error) {
        res.json({success: false, message: error.message});
    }
};

// Delete admin account - DISABLED (No new accounts allowed)
const deleteAdminAccount = async (req, res) => {
    return res.json({ 
        success: false, 
        message: "Cannot delete admin account. Only one authorized admin account exists." 
    });
};

export {
    adminlogin, 
    getAllBlogsAdmin, 
    getAllCommentsAdmin, 
    getDashboardData, 
    deleteBlogAdmin, 
    deleteCommentAdmin, 
    approveCommentAdmin,
    getAdminAccounts,
    deleteAdminAccount,
    googleLogin,
    firebaseLogin
};