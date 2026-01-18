// Axios base configuration

import axios from "axios";

const RAW_BASE = (process.env.REACT_APP_API_BASE || "https://nail-appointment-website-backend.onrender.com").replace(/\/$/, "");
const API_BASE = RAW_BASE.endsWith("/api") ? RAW_BASE : `${RAW_BASE}/api`;
const UPLOADS_BASE = RAW_BASE.endsWith("/api")
  ? RAW_BASE.slice(0, -4)
  : RAW_BASE;

const API = axios.create({
  baseURL: API_BASE
});

// Automatically attach token if logged in
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export { API_BASE, UPLOADS_BASE };
export default API;
