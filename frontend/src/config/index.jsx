const { default: axios } = require("axios");

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
const clientserver = axios.create({
    baseURL: BASE_URL,
});

export default clientserver;