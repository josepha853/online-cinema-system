import axios from 'axios';

const API_BASE_URL = 'http://localhost/cine/backend/controllers';

// Create axios instance with credentials support
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for session cookies
  // Note: Content-Type is intentionally not set here to allow FormData to work correctly
  // Axios will automatically set the appropriate Content-Type based on the request data
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
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
apiClient.interceptors.response.use(
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

class AuthService {
  async login(credentials) {
    try {
      const formData = new FormData();
      formData.append('email', credentials.email);
      formData.append('password', credentials.password);

      const response = await apiClient.post('/AuthController.php?action=login', formData);

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(`${message} ${status ? `(Status: ${status})` : ''}`);
    }
  }

  async register(userData) {
    try {
      const formData = new FormData();
      formData.append('name', userData.name);
      formData.append('email', userData.email);
      formData.append('password', userData.password);
      formData.append('phone', userData.phone);
      if (userData.role) {
        formData.append('role', userData.role);
      }
      if (userData.profilePhoto) {
        formData.append('profile_photo', userData.profilePhoto);
      }

      const response = await apiClient.post('/AuthController.php?action=register', formData);

      return response.data;
    } catch (error) {
      const status = error.response?.status;
      const message = error.response?.data?.message || error.message || 'Registration failed';
      throw new Error(`${message} ${status ? `(Status: ${status})` : ''}`);
    }
  }

  async logout() {
    try {
      await apiClient.post('/AuthController.php?action=logout');
    } catch (error) {
      console.error('Logout error:', error);
      // Continue with local cleanup even if API call fails
    } finally {
      // Always clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async updateProfile(userData) {
    try {
      const formData = new FormData();
      if (userData.name) formData.append('name', userData.name);
      if (userData.phone) formData.append('phone', userData.phone);

      const response = await apiClient.post('/AuthController.php?action=update_profile', formData);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Profile update failed');
    }
  }

  async changePassword(currentPassword, newPassword) {
    try {
      const formData = new FormData();
      formData.append('current_password', currentPassword);
      formData.append('new_password', newPassword);

      const response = await apiClient.post('/AuthController.php?action=change_password', formData);

      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Password change failed');
    }
  }

  getCurrentUser() {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  isAdmin() {
    return this.hasRole('admin');
  }

  isStaff() {
    return this.hasRole('staff');
  }

  isCustomer() {
    return this.hasRole('customer');
  }
}

export const authService = new AuthService();
export default authService;
