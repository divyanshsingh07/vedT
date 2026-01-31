import jwt from "jsonwebtoken";
import Blog from "../models/blog.js";
import Comment from "../models/comments.js";
import Admin from "../models/admin.js";

// Env fallback for backward compatibility (used only if no DB admins exist)
const getEnvAdminAccounts = () => {
    const envEmail = (process.env.ADMIN_EMAIL || "").trim();
    const envPassword = (process.env.ADMIN_PASSWORD || "").trim();
    const envName = (process.env.ADMIN_NAME || "Admin").trim();
    if (envEmail && envPassword) {
        return [{ email: envEmail, password: envPassword, name: envName }];
    }
    return [{ email: "vt8795507492@gmail.com", password: "Vedu@1906", name: "Ved Praksh Tiwari" }];
};

const adminlogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        // 1. Try DB admin first
        const dbAdmin = await Admin.findOne({ email: email.trim().toLowerCase() });
        if (dbAdmin) {
            const match = await dbAdmin.comparePassword(password);
            if (match) {
                const token = jwt.sign(
                    { email: dbAdmin.email, name: dbAdmin.name, role: "admin" },
                    process.env.JWT_SECRET,
                    { expiresIn: "7d" }
                );
                return res.json({
                    success: true,
                    message: `Welcome back, ${dbAdmin.name}!`,
                    token,
                    admin: { name: dbAdmin.name, email: dbAdmin.email }
                });
            }
        }

        // 2. Fallback to env credentials
        const envAccounts = getEnvAdminAccounts();
        const envAdmin = envAccounts.find(a => a.email === email && a.password === password);
        if (envAdmin) {
            const token = jwt.sign(
                { email: envAdmin.email, name: envAdmin.name, role: "admin" },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
            );
            return res.json({
                success: true,
                message: `Welcome back, ${envAdmin.name}!`,
                token,
                admin: { name: envAdmin.name, email: envAdmin.email }
            });
        }

        return res.status(401).json({ success: false, message: "Invalid email or password." });
    } catch (error) {
        console.error("Admin login error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

const adminRegister = async (req, res) => {
    try {
        const { email, password, name } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }
        
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }

        const trimmedEmail = email.trim().toLowerCase();
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
        }

        const existing = await Admin.findOne({ email: trimmedEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: "An account with this email already exists." });
        }

        const admin = await Admin.create({
            email: trimmedEmail,
            password,
            name: (name || "").trim() || trimmedEmail
        });

        const token = jwt.sign(
            { email: admin.email, name: admin.name, role: "admin" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully!",
            token,
            admin: { name: admin.name, email: admin.email }
        });
    } catch (error) {
        console.error("Admin register error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

const googleLogin = async (req, res) => {
    return res.json({ success: false, message: "Use email/password to sign in." });
}

const firebaseLogin = async (req, res) => {
    return res.json({ success: false, message: "Use email/password to sign in." });
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
       // Admins see all blogs; writers see only their own
       const authorFilter = req.user?.role === 'admin' ? {} : (req.user?.email ? { authorEmail: req.user.email } : {});

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
        const blog = await Blog.findById(blogId);
        if (!blog) return res.json({ success: false, message: "Blog not found" });
        // Admins can only delete their own blogs
        if (!blog.authorEmail || blog.authorEmail !== req.user?.email) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this blog" });
        }
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
        const comment = await Comment.findById(commentId);
        if (!comment) return res.json({ success: false, message: "Comment not found" });
        // Admins can only delete their own comments
        if (!comment.authorEmail || comment.authorEmail.toLowerCase() !== req.user?.email?.toLowerCase()) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this comment" });
        }
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

const getAdminAccountsList = async (req, res) => {
    try {
        const dbAdmins = await Admin.find({}).select("-password").lean();
        const envAccounts = getEnvAdminAccounts();
        const envList = envAccounts.map(a => ({ email: a.email, name: a.name, role: "admin", source: "env" }));
        const dbList = dbAdmins.map(a => ({ email: a.email, name: a.name, role: "admin", source: "db" }));
        const adminList = [...envList, ...dbList.filter(d => !envList.some(e => e.email === d.email))];
        res.json({ success: true, adminAccounts: adminList });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

const deleteAdminAccount = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ success: false, message: "Email is required." });
        const deleted = await Admin.findOneAndDelete({ email: email.trim().toLowerCase() });
        if (deleted) {
            res.json({ success: true, message: "Admin account removed." });
        } else {
            res.status(400).json({ success: false, message: "Cannot remove env-configured admin. DB admins can be removed." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export {
    adminlogin,
    adminRegister,
    getAllBlogsAdmin,
    getAllCommentsAdmin,
    getDashboardData,
    deleteBlogAdmin,
    deleteCommentAdmin,
    approveCommentAdmin,
    getAdminAccountsList,
    deleteAdminAccount,
    googleLogin,
    firebaseLogin
};