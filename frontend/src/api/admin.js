// admin.js
// Admin API calls (uses token from localStorage)

import API from "./index";

// ✅ Services
export const adminGetServices = () => API.get("/services");
export const adminCreateService = (data) => API.post("/services", data);
export const adminUpdateService = (id, data) => API.put(`/services/${id}`, data);
export const adminDeleteService = (id) => API.delete(`/services/${id}`);

// ✅ Appointments (you should protect backend with adminMiddleware)
export const adminGetAppointments = () => API.get("/appointments");
export const adminUpdateAppointmentStatus = (id, status) =>
  API.put(`/appointments/${id}/status`, { status });

// ✅ Users (you will add backend routes)
export const adminGetUsers = () => API.get("/users");
export const adminToggleAdmin = (id, isAdmin) =>
  API.put(`/users/${id}/admin`, { isAdmin });
