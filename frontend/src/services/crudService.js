import axios from 'axios';

const API_BASE_URL = 'http://localhost/cine/backend/controllers';

// Create axios instance with credentials support
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Redirect to login if unauthorized
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// CRUD Service for Movies
export const movieService = {
  // Create movie
  create: async (movieData) => {
    try {
      const formData = new FormData();
      Object.keys(movieData).forEach(key => {
        formData.append(key, movieData[key]);
      });

      const response = await apiClient.post('/MovieController.php?action=create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create movie');
    }
  },

  // Read all movies
  getAll: async () => {
    try {
      const response = await apiClient.get('/MovieController.php?action=getAll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch movies');
    }
  },

  // Read single movie
  getById: async (id) => {
    try {
      const response = await apiClient.get(`/ MovieController.php ? action = getById & id=${id} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch movie');
    }
  },

  // Update movie
  update: async (id, movieData) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      Object.keys(movieData).forEach(key => {
        formData.append(key, movieData[key]);
      });

      const response = await apiClient.post('/MovieController.php?action=update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update movie');
    }
  },

  // Delete movie
  delete: async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await apiClient.post('/MovieController.php?action=delete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete movie');
    }
  }
};

// CRUD Service for Theaters
export const theaterService = {
  create: async (theaterData) => {
    try {
      const formData = new FormData();
      Object.keys(theaterData).forEach(key => {
        formData.append(key, theaterData[key]);
      });

      const response = await apiClient.post('/TheaterController.php?action=create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create theater');
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get('/TheaterController.php?action=getAll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch theaters');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/ TheaterController.php ? action = getById & id=${id} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch theater');
    }
  },

  update: async (id, theaterData) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      Object.keys(theaterData).forEach(key => {
        formData.append(key, theaterData[key]);
      });

      const response = await apiClient.post('/TheaterController.php?action=update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update theater');
    }
  },

  delete: async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await apiClient.post('/TheaterController.php?action=delete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete theater');
    }
  }
};

// CRUD Service for Shows
export const showService = {
  create: async (showData) => {
    try {
      const formData = new FormData();
      Object.keys(showData).forEach(key => {
        formData.append(key, showData[key]);
      });

      const response = await apiClient.post('/ShowController.php?action=create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create show');
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get('/ShowController.php?action=getAll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch shows');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/ ShowController.php ? action = getById & id=${id} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch show');
    }
  },

  update: async (id, showData) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      Object.keys(showData).forEach(key => {
        formData.append(key, showData[key]);
      });

      const response = await apiClient.post('/ShowController.php?action=update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update show');
    }
  },

  delete: async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await apiClient.post('/ShowController.php?action=delete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete show');
    }
  }
};

// CRUD Service for Bookings
export const bookingService = {
  create: async (bookingData) => {
    try {
      const formData = new FormData();
      Object.keys(bookingData).forEach(key => {
        if (Array.isArray(bookingData[key])) {
          formData.append(key, JSON.stringify(bookingData[key]));
        } else {
          formData.append(key, bookingData[key]);
        }
      });

      const response = await apiClient.post('/BookingController.php?action=create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create booking');
    }
  },

  getAll: async () => {
    try {
      const response = await apiClient.get('/BookingController.php?action=getAll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch bookings');
    }
  },

  getByUserId: async (userId) => {
    try {
      const response = await apiClient.get(`/ BookingController.php ? action = getByUserId & userId=${userId} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user bookings');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/ BookingController.php ? action = getById & id=${id} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch booking');
    }
  },

  update: async (id, bookingData) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      Object.keys(bookingData).forEach(key => {
        formData.append(key, bookingData[key]);
      });

      const response = await apiClient.post('/BookingController.php?action=update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update booking');
    }
  },

  cancel: async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await apiClient.post('/BookingController.php?action=cancel', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to cancel booking');
    }
  }
};

// CRUD Service for Users (Admin only)
export const userService = {
  getAll: async () => {
    try {
      const response = await apiClient.get('/UserController.php?action=getAll');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch users');
    }
  },

  getById: async (id) => {
    try {
      const response = await apiClient.get(`/ UserController.php ? action = getById & id=${id} `);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user');
    }
  },

  update: async (id, userData) => {
    try {
      const formData = new FormData();
      formData.append('id', id);
      Object.keys(userData).forEach(key => {
        formData.append(key, userData[key]);
      });

      const response = await apiClient.post('/UserController.php?action=update', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update user');
    }
  },

  delete: async (id) => {
    try {
      const formData = new FormData();
      formData.append('id', id);

      const response = await apiClient.post('/UserController.php?action=delete', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete user');
    }
  }
};

export default {
  movieService,
  theaterService,
  showService,
  bookingService,
  userService
};
