import { 
    adminlogin,
    adminRegister,
    getAllCommentsAdmin, 
    getDashboardData, 
    deleteBlogAdmin, 
    deleteCommentAdmin, 
    approveCommentAdmin,
    getAdminAccountsList,
    deleteAdminAccount,
    googleLogin,
    firebaseLogin
} from "../controlers/admincontrole.js";
import express from "express";
import auth from "../middleware/auth.js";
import User from "../models/user.js";
import jwt from "jsonwebtoken";

const adminRout = express.Router();

// Admin-only guard - must be defined before routes that use it
const adminOnly = (req, res, next) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ success: false, message: "Admin access required" });
    }
    next();
};

// Debug: Log route registration
console.log('🔧 Registering admin routes...');

adminRout.post("/login", adminlogin);
adminRout.post("/register", adminRegister);
adminRout.post("/google-login", googleLogin);
adminRout.post("/firebase-login", firebaseLogin);

console.log('✅ Admin routes registered');
adminRout.get("/admin-accounts", auth, adminOnly, getAdminAccountsList);
adminRout.delete("/admin-account", auth, adminOnly, deleteAdminAccount);

// Writer user management (admin only)
adminRout.get("/users", auth, adminOnly, async (req, res) => {
    try {
        const users = await User.find({}).sort({ createdAt: -1 }).select("-__v");
        res.json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

adminRout.post("/users", auth, adminOnly, async (req, res) => {
    try {
        const { email, name, password } = req.body;
        if (!email || !email.trim()) {
            return res.status(400).json({ success: false, message: "Email is required" });
        }
        const trimmedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: trimmedEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: "User with this email already exists" });
        }
        const userData = { email: trimmedEmail, name: (name || "").trim() || trimmedEmail };
        if (password && password.trim()) userData.password = password.trim();
        const user = await User.create(userData);
        res.json({ success: true, message: "Writer user created successfully", user: { email: user.email, name: user.name, _id: user._id } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

adminRout.delete("/users/:userId", auth, adminOnly, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.json({ success: true, message: "User removed successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

adminRout.get("/comments", auth, adminOnly, getAllCommentsAdmin);
adminRout.get("/dashboard", auth, adminOnly, getDashboardData);
adminRout.delete("/blog/:blogId", auth, adminOnly, deleteBlogAdmin);
adminRout.post("/deleteComment/:commentId", auth, adminOnly, deleteCommentAdmin);
adminRout.post("/approveComment/:commentId", auth, adminOnly, approveCommentAdmin);

export default adminRout;

// ==== USER (WRITER) AUTH AND DASHBOARD ====
export const userRout = express.Router();

// POST /api/auth/writer-login
userRout.post("/auth/writer-login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }
        const user = await User.findOne({ email: email.trim().toLowerCase() });
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const match = await user.comparePassword(password);
        if (!match) {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
        const token = jwt.sign(
            { email: user.email, name: user.name, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.json({ success: true, message: "Login successful", token, user: { email: user.email, name: user.name, photoURL: user.photoURL } });
    } catch (error) {
        console.error("Writer login error:", error);
        return res.status(500).json({ success: false, message: error.message || "Login failed" });
    }
});

// POST /api/auth/writer-register
userRout.post("/auth/writer-register", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required" });
        }
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration error." });
        }
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
        }
        const trimmedEmail = email.trim().toLowerCase();
        const existing = await User.findOne({ email: trimmedEmail });
        if (existing) {
            return res.status(400).json({ success: false, message: "An account with this email already exists." });
        }
        const user = await User.create({
            email: trimmedEmail,
            password,
            name: (name || "").trim() || trimmedEmail
        });
        const token = jwt.sign(
            { email: user.email, name: user.name, role: "user" },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );
        return res.status(201).json({ success: true, message: "Account created!", token, user: { email: user.email, name: user.name } });
    } catch (error) {
        console.error("Writer register error:", error);
        return res.status(500).json({ success: false, message: error.message || "Registration failed" });
    }
});

// GET /api/user/dashboard
userRout.get("/user/dashboard", auth, async (req, res) => {
    try {
        if (req.user?.role !== 'user' && req.user?.role !== 'admin') {
            return res.json({ success: false, message: "Unauthorized" });
        }
        const authorEmail = req.user.email;

        const recentBlogs = await (await import('../models/blog.js')).default
            .find({ authorEmail })
            .sort({ createdAt: -1 })
            .limit(5);

        const blogCount = await (await import('../models/blog.js')).default
            .countDocuments({ authorEmail });

        const draftBlogs = await (await import('../models/blog.js')).default
            .countDocuments({ authorEmail, isPublished: false });

        const blogIds = (await (await import('../models/blog.js')).default
            .find({ authorEmail }).select('_id')).map(b => b._id);

        const commentCount = blogIds.length > 0 
            ? await (await import('../models/comments.js')).default.countDocuments({ blog: { $in: blogIds } })
            : 0;

        res.json({ success: true, dashboardData: { recentBlogs, blogCount, commentCount, draftBlogs } });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
});

