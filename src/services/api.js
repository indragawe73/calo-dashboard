import { apiClient } from './apiClient';

// Authentication Service
export const authService = {
  // Login user
  async login(username, password) {
    try {
      console.log('Attempting login for user:', username);
      
      const response = await apiClient.post('/Auth/login', {
        username,
        password,
      });
      
      console.log('Login successful:', response);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Login failed:', error);
      
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (error.status === 0) {
        errorMessage = 'Network error: Unable to connect to the server. Please check your internet connection.';
      } else if (error.status === 401) {
        errorMessage = 'Invalid username or password.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. Please contact your administrator.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.data && error.data.detail) {
        errorMessage = error.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await apiClient.get('/Auth/me');
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Logout user (client-side cleanup)
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

// Reports Service
export const reportsService = {
  // Get images with filters and pagination
  async getImages({ page = 1, pageSize = 20, includeDetails = false, total = 20, ...filters } = {}) {
    try {
      console.log('Fetching images with filters:', { page, pageSize, includeDetails, total, ...filters });
      
      const params = {
        page,
        pageSize,
        total,
        includeDetails,
        ...filters,
      };
      
      const response = await apiClient.get('/reports/images', params);
      
      console.log('Images API response:', response);
      
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error('Images API error:', error);
      
      let errorMessage = error.message;
      
      // Handle specific error cases
      if (error.status === 0) {
        errorMessage = 'Network error: Unable to connect to the server.';
      } else if (error.status === 401) {
        errorMessage = 'Authentication required. Please login again.';
      } else if (error.status === 403) {
        errorMessage = 'Access denied. You do not have permission to view images.';
      } else if (error.status === 404) {
        errorMessage = 'Images endpoint not found.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      } else if (error.data && error.data.detail) {
        errorMessage = error.data.detail;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Get specific image by ID
  async getImageById(id) {
    try {
      const response = await apiClient.get(`/reports/images/${id}`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get annotated image
  async getAnnotatedImage(id) {
    try {
      const response = await apiClient.get(`/reports/images/${id}/annotated`);
      return {
        success: true,
        data: response, // This will be a Blob
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get raw image
  async getRawImage(id) {
    try {
      const response = await apiClient.get(`/reports/images/${id}/raw`);
      return {
        success: true,
        data: response, // This will be a Blob
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  // Get raw image URL (for direct image src)
  getRawImageUrl(id) {
    const baseUrl = 'http://100.107.61.112:5270/api';
    return `${baseUrl}/reports/images/${id}/raw`;
  },

  // Get annotated image URL (for direct image src)
  getAnnotatedImageUrl(id) {
    const baseUrl = 'http://100.107.61.112:5270/api';
    return `${baseUrl}/reports/images/${id}/annotated`;
  },
};

// Delivery Service
export const deliveryService = {
  // Get SKUs for a delivery
  async getDeliverySKUs(deliveryId) {
    try {
      const response = await apiClient.get(`/Delivery/${deliveryId}/skus`);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
      };
    }
  },
};
