import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    try {
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "Server configuration error" });
        }
        const header = req.headers.authorization || "";
        const token = header.startsWith("Bearer ") ? header.slice(7) : header;
        if (!token) {
            return res.status(401).json({ success: false, message: "Authorization token missing" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            email: decoded.email,
            name: decoded.name,
            role: decoded.role
        };
        next();
    } catch (error) {
        const msg = error.name === "TokenExpiredError" ? "Token expired" : "Invalid token";
        return res.status(401).json({ success: false, message: msg });
    }
};
export default auth;    
