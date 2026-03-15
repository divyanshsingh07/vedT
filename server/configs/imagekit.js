import ImageKit from 'imagekit';
import dotenv from 'dotenv';

dotenv.config();

// Validate required environment variables
if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
    throw new Error('Missing required ImageKit environment variables. Please check your .env file.');
}

// Create ImageKit instance with explicit property assignment
const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

export default imagekit;