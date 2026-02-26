import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// Set API base URL - prioritize environment variable, fallback to production URL, then localhost
const API_URL = import.meta.env.VITE_API_URL || 
                (import.meta.env.PROD ? "https://ved-7jpz.onrender.com/" : "http://localhost:4000");

axios.defaults.baseURL = API_URL;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
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
    const [authLoading, setAuthLoading] = useState(true);

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
        if (tokenValue) {
            setToken(tokenValue);
            axios.defaults.headers.common["Authorization"] = `Bearer ${tokenValue}`;

            try {
                const payloadBase64 = tokenValue.split('.')[1];
                if (payloadBase64) {
                    const payloadJson = JSON.parse(atob(payloadBase64));
                    setUser({
                        name: payloadJson.name || null,
                        email: payloadJson.email || null,
                        role: payloadJson.role || null,
                    });
                }
            } catch (e) {
                setUser(null);
            }
        } else {
            setToken(null);
            delete axios.defaults.headers.common["Authorization"];
            setUser(null);
        }
    };

    // Check authentication status on mount
    useEffect(() => {
        fetchBlogs();
        
        const adminToken = localStorage.getItem("adminToken");
        const userToken = localStorage.getItem("userToken");
        const activeToken = adminToken || userToken;
        
        if (activeToken) {
            // Trust the token from localStorage immediately so routes render correctly.
            // The validation call only checks if the server still accepts it.
            validateAndSetToken(activeToken);
            setAuthLoading(false);
            
            const testEndpoint = adminToken ? "/api/admin/dashboard" : "/api/user/dashboard";
            axios.get(testEndpoint, { timeout: 10000 })
                .catch(() => {
                    localStorage.removeItem("adminToken");
                    localStorage.removeItem("userToken");
                    validateAndSetToken(null);
                    toast.error("Session expired. Please login again.");
                });
        } else {
            validateAndSetToken(null);
            setAuthLoading(false);
        }
    }, []);

    const value = {
        axios,
        navigate,
        token,
        user,
        setToken: validateAndSetToken,
        blogs,
        setBlogs,
        input,
        setInput,
        fetchBlogs,
        fetchAllBlogs,
        authLoading,
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