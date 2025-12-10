import { apiClient } from "./apiClient";

// Authentication Service
export const authService = {
  // Login user
  async login(username, password) {
    try {
      console.log("Attempting login for user:", username);

      const response = await apiClient.post("/Auth/login", {
        username,
        password,
      });

      console.log("Login successful:", response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Login failed:", error);

      let errorMessage = error.message;

      // Handle specific error cases
      if (error.status === 0) {
        errorMessage =
          "Network error: Unable to connect to the server. Please check your internet connection.";
      } else if (error.status === 401) {
        errorMessage = "Invalid username or password.";
      } else if (error.status === 403) {
        errorMessage = "Access denied. Please contact your administrator.";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
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
      const response = await apiClient.get("/Auth/me");
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

// Reports Service
export const reportsService = {
  // Get images with filters and pagination
  async getImages({
    page = 1,
    pageSize = 20,
    includeDetails = false,
    total = 20,
    date,
    ...filters
  } = {}) {
    try {
      // Get today's date in YYYY-MM-DD format if date is not provided
      const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
      };

      // Always include date parameter (required by API)
      const dateParam = date || getTodayDate();

      console.log("Fetching images with filters:", {
        page,
        pageSize,
        includeDetails,
        total,
        date: dateParam,
        ...filters,
      });

      const params = {
        page,
        pageSize,
        total,
        includeDetails,
        date: dateParam, // Always include date (required by API)
        ...filters,
      };

      const response = await apiClient.get("/reports/images", params);

      console.log("Images API response:", response);

      return {
        success: true,
        data: response,
      };
    } catch (error) {
      console.error("Images API error:", error);

      let errorMessage = error.message;

      // Handle specific error cases
      if (error.status === 0) {
        errorMessage = "Network error: Unable to connect to the server.";
      } else if (error.status === 401) {
        errorMessage = "Authentication required. Please login again.";
      } else if (error.status === 403) {
        errorMessage =
          "Access denied. You do not have permission to view images.";
      } else if (error.status === 404) {
        errorMessage = "Images endpoint not found.";
      } else if (error.status === 500) {
        errorMessage = "Server error. Please try again later.";
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
  async getAnnotatedImage(id, params = {}) {
    try {
      // Build query parameters
      const queryParams = {};
      if (params.date) {
        queryParams.date = params.date;
      }
      
      const endpoint = `/reports/images/${id}/annotated`;
      const response = await apiClient.get(endpoint, queryParams);
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
      const endpoint = `/reports/images/${id}/raw`;
      const response = await apiClient.get(endpoint);
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
    const baseUrl = "http://100.107.61.112:5270/api";
    return `${baseUrl}/reports/images/${id}/raw`;
  },

  // Get annotated image URL (for direct image src)
  getAnnotatedImageUrl(id, params = {}) {
    const baseUrl = "http://100.107.61.112:5270/api";
    let url = `${baseUrl}/reports/images/${id}/annotated`;
    
    // Add query parameters if provided
    const queryParams = [];
    if (params.date) {
      queryParams.push(`date=${encodeURIComponent(params.date)}`);
    }
    
    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }
    
    return url;
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

// Job Schedules Service (Flow Runs)
export const jobSchedulesService = {
  // Get flow runs with pagination
  async getFlowRuns({ limit = 100, offset = 0 } = {}) {
    try {
      // This endpoint uses a different base URL
      const API_BASE_URL = "http://100.107.61.112:4201/api";
      const url = `${API_BASE_URL}/flow-runs?limit=${limit}&offset=${offset}`;

      console.log("Fetching flow runs:", { limit, offset, url });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Flow runs API response:", data);

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Flow runs API error:", error);

      let errorMessage = error.message;

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage = "Network error: Unable to connect to the server.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Get flow run logs by flow_run_id
  async getFlowRunLogs(flowRunId) {
    try {
      const API_BASE_URL = "http://100.107.61.112:4201/api";
      const url = `${API_BASE_URL}/flow-runs/${flowRunId}/logs`;

      console.log("Fetching flow run logs:", { flowRunId, url });

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Flow run logs API response:", data);

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Flow run logs API error:", error);

      let errorMessage = error.message;

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage = "Network error: Unable to connect to the server.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },

  // Retry flow run by flow_run_id
  async retryFlowRun(flowRunId) {
    try {
      const API_BASE_URL = "http://100.107.61.112:4201/api";
      const url = `${API_BASE_URL}/flow-runs/${flowRunId}/retry`;

      console.log("Retrying flow run:", { flowRunId, url });

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        mode: "cors",
        credentials: "omit",
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      console.log("Flow run retry API response:", data);

      return {
        success: true,
        data: data,
      };
    } catch (error) {
      console.error("Flow run retry API error:", error);

      let errorMessage = error.message;

      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError")
      ) {
        errorMessage = "Network error: Unable to connect to the server.";
      }

      return {
        success: false,
        error: errorMessage,
      };
    }
  },
};
