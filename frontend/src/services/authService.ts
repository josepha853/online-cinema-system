// src/services/authService.ts
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'customer' | 'staff' | 'admin';
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'staff' | 'admin';
}

interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

// Add axios interceptor for auth tokens
axios.interceptors.request.use(
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

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    try {
      // Default role is 'customer' if not specified
      const dataToSend = {
        ...userData,
        role: userData.role || 'customer'
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, dataToSend);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  },

  logout: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.post(`${API_URL}/auth/logout`);
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return response.data;
    } catch (error: any) {
      // Still clear local storage even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw new Error(error.response?.data?.message || 'Logout failed');
    }
  },

  verifyToken: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.get(`${API_URL}/auth/verify`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Token verification failed');
    }
  },

  // Optional: Get user profile
  getProfile: async (): Promise<AuthResponse> => {
    try {
      const response = await axios.get(`${API_URL}/auth/profile`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get profile');
    }
  }
};