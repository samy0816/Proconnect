const { default: axios } = require("axios");

// Use environment variable or fallback to localhost
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Debug log (will show in browser console)
if (typeof window !== 'undefined') {
    console.log('🔧 API Configuration:', {
        'NEXT_PUBLIC_API_URL': process.env.NEXT_PUBLIC_API_URL,
        'Using API_URL': API_URL
    });
}

export const BASE_URL = API_URL;

const clientserver = axios.create({
    baseURL: BASE_URL,
});

export default clientserver;