// Axios base configuration

import axios from "axios";

const DEFAULT_BACKEND = "https://nail-appointment-website.onrender.com";
const RAW_BASE = (process.env.REACT_APP_API_BASE || DEFAULT_BACKEND).replace(/\/$/, "");
const API_ROOT = RAW_BASE.endsWith("/api") ? RAW_BASE.replace(/\/api$/, "") : RAW_BASE;
const API_BASE = `${API_ROOT}/api`;
const UPLOADS_BASE = API_ROOT;

const isAbsoluteUrl = (value) => /^https?:\/\//i.test(value);

export const getServiceImageUrl = (image) => {
  if (!image) {
    return "";
  }

  if (isAbsoluteUrl(image)) {
    return image;
  }

  return `${UPLOADS_BASE}/uploads/${image}`;
};

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
