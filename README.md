# Vedified

A modern, full-stack blogging platform with AI-powered content generation, built with React and Node.js.

## 🚀 Features

- **AI-Powered Content Generation**: Generate blog content automatically using Google Gemini AI
- **Rich Text Editor**: Create and edit blog posts with a powerful TipTap-based editor
- **Role-Based Access Control**: Separate admin and writer roles with different permissions
- **Image Management**: Upload and manage images using ImageKit CDN
- **Blog Publishing**: Draft and publish blog posts with full control
- **Comments System**: Engage with readers through comments
- **Search Functionality**: Find blogs quickly with search capabilities
- **Responsive Design**: Beautiful, modern UI built with Tailwind CSS
- **Simple Authentication**: Single-user authentication (Firebase optional)

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **TipTap** - Rich text editor
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Firebase** - Authentication

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database (via Mongoose)
- **JWT** - Authentication tokens
- **Multer** - File upload handling
- **ImageKit** - Image CDN and optimization
- **Google Gemini AI** - Content generation
- **Firebase Admin SDK** - Server-side authentication

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher)
- **npm** or **yarn**
- **MongoDB** (local or cloud instance like MongoDB Atlas)
- **Firebase Project** (optional, only if using Firebase authentication)
- **ImageKit Account** (for image storage)
- **Google Gemini API Key** (for AI content generation)

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Vedified
   ```

2. **Install server dependencies**
   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies**
   ```bash
   cd ../client
   npm install
   ```

## ⚙️ Environment Variables

### Server Environment Variables

1. **Copy the example file**
   ```bash
   cd server
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your actual values:

   **Required for Single User Setup:**
   - **MONGODB_URI**: Your MongoDB connection string (e.g., `mongodb://localhost:27017` or MongoDB Atlas connection string)
   - **JWT_SECRET**: A strong random string for JWT token signing
   - **SINGLE_ALLOWED_EMAIL**: Your email address (only this email will be allowed to login)
   - **ALLOW_LOCAL_DEV_LOGIN**: Set to `true` (enables login without Firebase)
   - **IMAGEKIT_PUBLIC_KEY**: Your ImageKit public key
   - **IMAGEKIT_PRIVATE_KEY**: Your ImageKit private key
   - **IMAGEKIT_URL_ENDPOINT**: Your ImageKit URL endpoint (e.g., `https://ik.imagekit.io/your_id`)
   - **GEMINI_API_KEY**: Your Google Gemini API key

   **Note:** Firebase is NOT required for single user setup. Leave Firebase-related variables commented out.

   See `server/.env.example` for the complete list of variables.

### Client Environment Variables

1. **Copy the example file**
   ```bash
   cd client
   cp .env.example .env
   ```

2. **Edit the `.env` file** with your configuration:

   **For Single User Setup (No Firebase Required):**
   - **VITE_API_URL**: Your API server URL (use `http://localhost:4000` for local development)
   - Firebase configuration variables are optional and can be left as defaults

   **Note:** If you're using single user setup without Firebase, you can use the default Firebase config values or leave them as-is.

   See `client/.env.example` for the complete list of variables.

## 🚀 Running the Application

### Development Mode

1. **Start the server**
   ```bash
   cd server
   npm run dev
   ```
   The server will run on `http://localhost:4000`

2. **Start the client** (in a new terminal)
   ```bash
   cd client
   npm run dev
   ```
   The client will run on `http://localhost:5173`

### Production Mode

1. **Build the client**
   ```bash
   cd client
   npm run build
   ```

2. **Start the server**
   ```bash
   cd server
   npm start
   ```

## 📁 Project Structure

```
Vedified/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable React components
│   │   │   ├── admin/     # Admin-specific components
│   │   │   └── user/      # User-specific components
│   │   ├── pages/         # Page components
│   │   │   ├── admin/     # Admin pages
│   │   │   └── writer/    # Writer pages
│   │   ├── contexts/      # React contexts (AppContext)
│   │   ├── configs/       # Configuration files (Firebase)
│   │   └── assets/        # Static assets
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Node.js backend application
│   ├── configs/          # Configuration files
│   │   ├── db.js         # MongoDB connection
│   │   ├── firebaseAdmin.js
│   │   ├── imagekit.js
│   │   └── gemini.js
│   ├── controlers/       # Route controllers
│   ├── middleware/        # Express middleware
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
│
└── README.md
```

## 🔌 API Endpoints

### Blog Routes (`/api/blog`)

- `GET /api/blog/all` - Get all published blogs
- `GET /api/blog/:blogId` - Get a specific blog
- `POST /api/blog/add` - Create a new blog (requires auth)
- `POST /api/blog/generateContent` - Generate blog content using AI (requires auth)
- `PUT /api/blog/:blogId` - Update a blog (requires auth)
- `DELETE /api/blog/:blogId` - Delete a blog (requires auth)
- `POST /api/blog/addComment` - Add a comment to a blog
- `GET /api/blog/:blogId/comments` - Get comments for a blog

### Admin Routes (`/api/admin`)

- `POST /api/admin/firebase-login` - Admin login via Firebase
- `GET /api/admin/dashboard` - Get dashboard statistics (requires auth)
- `GET /api/admin/accounts` - Get admin accounts (requires auth)

## 🎨 Key Features Explained

### AI Content Generation
The platform uses Google Gemini AI to automatically generate blog content based on title, category, and subtitle. If the AI service is unavailable, it falls back to category-specific templates.

### Image Upload
Images are uploaded using Multer middleware and stored on ImageKit CDN. The system supports images up to 20MB and automatically optimizes them for web delivery.

### Authentication Flow

**Single User Setup (Recommended):**
1. Set `SINGLE_ALLOWED_EMAIL` in your `.env` file to your email
2. Set `ALLOW_LOCAL_DEV_LOGIN=true` to enable login without Firebase
3. Users authenticate via the login form
4. Server validates credentials and issues a JWT
5. JWT is used for subsequent API requests

**Firebase Setup (Optional):**
1. Users authenticate via Firebase on the client
2. Client receives a Firebase ID token
3. Server verifies the token and issues a JWT
4. JWT is used for subsequent API requests

### Role-Based Access
- **Admin**: Full access to all features including blog management, comments, and user accounts
- **Writer**: Can create and manage their own blog posts

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify your `MONGODB_URI` is correct
   - Ensure MongoDB is running (if local) or accessible (if cloud)

2. **Firebase Authentication Error**
   - Check Firebase configuration in both client and server
   - Verify service account JSON is properly formatted

3. **Image Upload Fails**
   - Check ImageKit credentials
   - Verify file size is under 20MB
   - Ensure image format is supported (jpg, png, etc.)

4. **AI Content Generation Fails**
   - Verify `GEMINI_API_KEY` is set correctly
   - Check API quota limits
   - System will fallback to template content if AI fails

## 📝 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, please open an issue in the repository.

---

Built with ❤️ using React, Node.js, and modern web technologies.

