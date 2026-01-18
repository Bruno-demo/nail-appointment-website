import API from "./index";

// Register user
export const register = (formData) => API.post("/auth/register", formData);

// Login user
export const login = (formData) => API.post("/auth/login", formData);