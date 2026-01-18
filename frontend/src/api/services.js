import API from "./index";

// Get all services
export const getServices = () => API.get("/services");

// Add service (admin)
export const addService = (data) => API.post("/services", data);

// Update service (admin)
export const updateService = (id, data) => API.put(`/services/${id}`, data);

// Delete service (admin)
export const deleteService = (id) => API.delete(`/services/${id}`);
