import axios from 'axios';

const API_BASE_URL = 'http://localhost/cine/backend/controllers';

// Create axios instance with credentials
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important: Send cookies with requests
  // Note: Content-Type is intentionally not set here to allow FormData to work correctly
  // Individual API methods will set the appropriate Content-Type as needed
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Theater API
export const theaterApi = {
  getTheaters: () => api.get('/theatercontroller.php?action=get_theaters'),
  getTheater: (id) => api.get(`/theatercontroller.php?action=get_theater&id=${id}`),
  getTheatersByCity: (city) => api.get(`/theatercontroller.php?action=get_theaters_by_city&city=${city}`),
  getCities: () => api.get('/theatercontroller.php?action=get_cities'),
  createTheater: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/theatercontroller.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateTheater: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/theatercontroller.php?action=update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteTheater: (theater_id) => {
    const formData = new FormData();
    formData.append('theater_id', theater_id.toString());
    return api.post('/theatercontroller.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Show API
export const showApi = {
  getShows: () => api.get('/showcontroller.php?action=get_shows'),
  getShow: (id) => api.get(`/showcontroller.php?action=get_show&id=${id}`),
  getShowsByDate: (date) => api.get(`/showcontroller.php?action=get_shows_by_date&date=${date}`),
  getShowsByTheater: (theater_id) => api.get(`/showcontroller.php?action=get_shows_by_theater&theater_id=${theater_id}`),
  searchShows: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value);
    });
    return api.get(`/showcontroller.php?action=search_shows&${searchParams.toString()}`);
  },
  getUpcomingShows: () => api.get('/showcontroller.php?action=get_upcoming_shows'),
  createShow: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'poster' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/showcontroller.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateShow: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'poster' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/showcontroller.php?action=update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteShow: (show_id) => {
    const formData = new FormData();
    formData.append('show_id', show_id.toString());
    return api.post('/showcontroller.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Booking API
export const bookingApi = {
  createBooking: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (Array.isArray(data[key])) {
        data[key].forEach((item, index) => {
          formData.append(`${key}[${index}]`, item);
        });
      } else {
        formData.append(key, data[key]);
      }
    });
    return api.post('/bookingcontroller.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  cancelBooking: (order_id) => {
    const formData = new FormData();
    formData.append('order_id', order_id.toString());
    return api.post('/bookingcontroller.php?action=cancel', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getBookingDetails: (order_id) => api.get(`/bookingcontroller.php?action=get_details&order_id=${order_id}`),
  getUserBookings: () => api.get('/bookingcontroller.php?action=get_user_bookings'),
  checkSeatAvailability: (show_id, seat_numbers) =>
    api.get(`/bookingcontroller.php?action=check_seats&show_id=${show_id}&seat_numbers=${seat_numbers.join(',')}`),
  getAvailableSeats: (auditorium_id, show_id) =>
    api.get(`/bookingcontroller.php?action=get_available_seats&auditorium_id=${auditorium_id}&show_id=${show_id}`)
};

// Ticket Type API
export const ticketTypeApi = {
  getTicketTypes: () => api.get('/TicketTypeController.php?action=get_ticket_types'),
  getTicketType: (id) => api.get(`/TicketTypeController.php?action=get_ticket_type&id=${id}`),
  getTicketTypesByShow: (show_id) => api.get(`/TicketTypeController.php?action=get_ticket_types_by_show&show_id=${show_id}`),
  createTicketType: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/TicketTypeController.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateTicketType: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/TicketTypeController.php?action=update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteTicketType: (type_id) => {
    const formData = new FormData();
    formData.append('type_id', type_id.toString());
    return api.post('/TicketTypeController.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateQuantity: (type_id, quantity) => {
    const formData = new FormData();
    formData.append('type_id', type_id.toString());
    formData.append('quantity', quantity.toString());
    return api.post('/TicketTypeController.php?action=update_quantity', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Notification API
export const notificationApi = {
  getNotifications: () => api.get('/NotificationController.php?action=get_notifications'),
  markAsRead: (notif_id) => {
    const formData = new FormData();
    formData.append('notif_id', notif_id.toString());
    return api.post('/NotificationController.php?action=mark_read', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteNotification: (notif_id) => {
    const formData = new FormData();
    formData.append('notif_id', notif_id.toString());
    return api.post('/NotificationController.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getUnreadCount: () => api.get('/NotificationController.php?action=get_unread_count'),
  broadcastNotification: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/NotificationController.php?action=broadcast', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Feedback API
export const feedbackApi = {
  getFeedback: () => api.get('/FeedbackController.php?action=get_feedback'),
  getFeedbackByShow: (show_id) => api.get(`/FeedbackController.php?action=get_feedback_by_show&show_id=${show_id}`),
  createFeedback: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/FeedbackController.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateFeedback: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key]));
    return api.post('/FeedbackController.php?action=update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteFeedback: (feedback_id) => {
    const formData = new FormData();
    formData.append('feedback_id', feedback_id.toString());
    return api.post('/FeedbackController.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getAverageRating: (show_id) => api.get(`/FeedbackController.php?action=get_average_rating&show_id=${show_id}`),
  getTopRatedShows: () => api.get('/FeedbackController.php?action=get_top_rated_shows'),
  getFeedbackStats: () => api.get('/FeedbackController.php?action=get_feedback_stats')
};

// Movie API
export const movieApi = {
  getMovies: () => api.get('/moviecontroller.php?action=get_movies'),
  getMovie: (id) => api.get(`/moviecontroller.php?action=get_movie&id=${id}`),
  createMovie: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'poster' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/moviecontroller.php?action=create', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateMovie: (data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (key === 'poster' && data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    return api.post('/moviecontroller.php?action=update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteMovie: (movie_id) => {
    const formData = new FormData();
    formData.append('movie_id', movie_id.toString());
    return api.post('/moviecontroller.php?action=delete', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }
};

// Report API
export const reportApi = {
  getDashboardStats: () => api.get('/ReportController.php?action=dashboard_stats'),
  getRevenueReport: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return api.get(`/ReportController.php?action=revenue&${searchParams.toString()}`);
  },
  getOccupancyReport: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return api.get(`/ReportController.php?action=occupancy&${searchParams.toString()}`);
  },
  getFeedbackReport: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return api.get(`/ReportController.php?action=feedback&${searchParams.toString()}`);
  },
  exportRevenueReport: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return api.get(`/ReportController.php?action=export_revenue&${searchParams.toString()}`, {
      responseType: 'blob'
    });
  },
  exportOccupancyReport: (params) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) searchParams.append(key, value.toString());
    });
    return api.get(`/ReportController.php?action=export_occupancy&${searchParams.toString()}`, {
      responseType: 'blob'
    });
  }
};

export default api;
