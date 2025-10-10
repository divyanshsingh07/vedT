import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Set API base URL - prioritize environment variable, fallback to production URL, then localhost
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? "https://ved-7jpz.onrender.com/" : "http://localhost:4000");

axios.defaults.baseURL = API_URL;

// Add request interceptor for debugging
axios.interceptors.request.use(
    (config) => {
        console.log(`Making API request to: ${config.baseURL}${config.url}`);
        return config;
    },
    (error) => {
        console.error('Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for better error handling
axios.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        if (error.code === 'NETWORK_ERROR' || !error.response) {
            toast.error('Network Error: Unable to connect to server. Please check your connection.');
        } else if (error.response?.status >= 500) {
            toast.error('Server Error: Please try again later.');
        }
        return Promise.reject(error);
    }
);

const AppContext = createContext();

export const AppProvider = ({children}) => {
    const navigate = useNavigate();
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [blogs, setBlogs] = useState([]);
    const [input, setInput] = useState("");
    const [loginBlocked, setLoginBlocked] = useState(false);

    const fetchBlogs = async () => {
        try {
            // Fetch only published blogs for public view
            const {data} = await axios.get("/api/blog/all");
            if (data.success) {
                setBlogs(data.data);
            } else {
                toast.error(data.message);
            }
        } catch(error) {
            toast.error(error.message);
        }
    };

    const fetchAllBlogs = async () => {
        try {
            // Fetch all blogs (including drafts) for admin view
            const {data} = await axios.get("/api/blog/");
            if (data.success) {
                return data.data;
            } else {
                toast.error(data.message);
                return [];
            }
        } catch(error) {
            toast.error(error.message);
            return [];
        }
    };

    // Validate token and set axios headers
    const validateAndSetToken = (tokenValue) => {
        console.log('🔑 Setting token:', tokenValue ? 'Token received' : 'No token');
        if (tokenValue) {
            setToken(tokenValue);
            axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;
            console.log('✅ Token set successfully');

            // Try to decode JWT for user info (name, email, role)
            try {
                const payloadBase64 = tokenValue.split('.')[1];
                if (payloadBase64) {
                    const payloadJson = JSON.parse(atob(payloadBase64));
                    const decodedUser = {
                        name: payloadJson.name || null,
                        email: payloadJson.email || null,
                        role: payloadJson.role || null,
                    };
                    setUser(decodedUser);
                }
            } catch (e) {
                console.log('JWT decode failed (non-fatal):', e?.message);
                setUser(null);
            }
        } else {
            setToken(null);
            delete axios.defaults.headers.common["Authorization"];
            console.log('❌ Token cleared');
            setUser(null);
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        fetchBlogs();
        
        // Check for tokens in localStorage (admin or user)
        const adminToken = localStorage.getItem("adminToken");
        const userToken = localStorage.getItem("userToken");
        const activeToken = adminToken || userToken;
        
        console.log('🔍 Checking localStorage for tokens:', {
            adminToken: adminToken ? 'Found' : 'Not found',
            userToken: userToken ? 'Found' : 'Not found',
            activeToken: activeToken ? 'Found' : 'Not found'
        });
        
        if (activeToken) {
            // Validate token by making a test request
            validateAndSetToken(activeToken);
            
            // Test token validity with appropriate endpoint
            const testEndpoint = adminToken ? "/api/admin/dashboard" : "/api/user/dashboard";
            axios.get(testEndpoint)
                .then(() => {
                    // Token is valid, keep it
                    console.log('✅ Token validation successful');
                    validateAndSetToken(activeToken);
                })
                .catch((error) => {
                    // Token is invalid, remove it
                    console.log('❌ Token validation failed:', error.response?.status);
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("userToken");
                    validateAndSetToken(null);
                    toast.error("Session expired. Please login again.");
                });
        } else {
            console.log('ℹ️ No tokens found in localStorage');
            validateAndSetToken(null);
        }
    }, []);

    const value = {
        axios,
        navigate,
        token,
        user,
        setToken: validateAndSetToken, // Use the wrapper function
        blogs,
        setBlogs,
        input,
        setInput,
        fetchBlogs,
        fetchAllBlogs,
        loginBlocked,
        setLoginBlocked
    };

    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};

export default AppContext;