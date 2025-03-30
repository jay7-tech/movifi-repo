// API Service for frontend-backend communication

const API_BASE_URL = "http://localhost:8080/api";

// Helper function for API calls
async function apiCall(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
      // Add authorization header if token exists
      ...(localStorage.getItem("token") && {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }),
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API call failed:", error);
    throw error;
  }
}

// User API
export const userApi = {
  register: (userData) =>
    apiCall("/users/register", {
      method: "POST",
      body: JSON.stringify(userData),
    }),
  login: (credentials) =>
    apiCall("/users/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getProfile: () => apiCall("/users/profile"),
  updateProfile: (userData) =>
    apiCall("/users/profile", {
      method: "PUT",
      body: JSON.stringify(userData),
    }),
  changePassword: (oldPassword, newPassword) =>
    apiCall("/users/change-password", {
      method: "POST",
      body: JSON.stringify({ oldPassword, newPassword }),
    }),
};

// Show API
export const showApi = {
  getAllShows: () => apiCall("/shows"),
  getShowById: (id) => apiCall(`/shows/${id}`),
  getShowsByType: (type) => apiCall(`/shows/type/${type}`),
  getShowsByCity: (city) => apiCall(`/shows/city/${city}`),
  getShowsByTypeAndCity: (type, city) =>
    apiCall(`/shows/type/${type}/city/${city}`),
  getShowsByGenre: (genre) => apiCall(`/shows/genre/${genre}`),
  getShowsByLanguage: (language) => apiCall(`/shows/language/${language}`),
  searchShows: (query) =>
    apiCall(`/shows/search?query=${encodeURIComponent(query)}`),
};

// Booking API
export const bookingApi = {
  createBooking: (bookingData) =>
    apiCall("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    }),
  getBookingById: (id) => apiCall(`/bookings/${id}`),
  getUserBookings: () => apiCall("/bookings/user"),
  getShowBookings: (showId) => apiCall(`/bookings/show/${showId}`),
  getShowTimeBookings: (showTimeId) =>
    apiCall(`/bookings/showtime/${showTimeId}`),
  getBookingsByDateRange: (start, end) =>
    apiCall(`/bookings/date-range?start=${start}&end=${end}`),
  updateBookingStatus: (id, status) =>
    apiCall(`/bookings/${id}/status?status=${status}`, {
      method: "PUT",
    }),
  updatePaymentStatus: (id, status) =>
    apiCall(`/bookings/${id}/payment-status?status=${status}`, {
      method: "PUT",
    }),
  cancelBooking: (id) =>
    apiCall(`/bookings/${id}/cancel`, {
      method: "POST",
    }),
};

// Auth Service
export const authService = {
  login: async (credentials) => {
    const response = await userApi.login(credentials);
    if (response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  },
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
  isAuthenticated: () => !!localStorage.getItem("token"),
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },
};
