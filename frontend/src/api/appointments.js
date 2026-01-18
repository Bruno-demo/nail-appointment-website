import API from "./index";

// Book appointment
export const bookAppointment = (data) => API.post("/appointments", data);

// Get logged in user's appointments
export const getMyAppointments = () => API.get("/appointments/my");

// Cancel appointment
export const cancelAppointment = (id) => API.delete(`/appointments/${id}`);
