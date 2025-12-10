import { handleUnauthorized } from "../utils/authHandler";
import toast from "../utils/toast";

// API Configuration
// Try with CORS proxy if direct connection fails
const API_BASE_URL = "http://100.107.61.112:5270/api";
const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";

console.log("API Base URL:", API_BASE_URL);

// HTTP Client with interceptors
class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    // Try direct connection first, then CORS proxy if needed
    let url = `${this.baseURL}${endpoint}`;
    const token = localStorage.getItem("token");

    const config = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      mode: "cors", // Explicitly set CORS mode
      credentials: "omit", // Don't send cookies
      ...options,
    };

    console.log("Making API request:", {
      url,
      method: config.method,
      headers: config.headers,
    });

    try {
      let response;
      let usedCorsProxy = false;

      try {
        // Try direct connection first
        response = await fetch(url, config);
        console.log("Direct connection successful");

        // If we get 401, don't retry with CORS proxy - it's an auth error
        if (response.status === 401) {
          console.log("Got 401 Unauthorized - auth error, not retrying");
          // Don't override response, let it continue to error handling
        }
        // If we get 403 (forbidden, might be CORS), try with CORS proxy
        else if (response.status === 403) {
          console.log("Got 403, trying CORS proxy...");
          const proxyUrl = `${CORS_PROXY}${url}`;
          const proxyConfig = {
            ...config,
            headers: {
              ...config.headers,
              "X-Requested-With": "XMLHttpRequest",
            },
          };

          response = await fetch(proxyUrl, proxyConfig);
          usedCorsProxy = true;
          console.log("CORS proxy connection successful");
        }
      } catch (directError) {
        console.log("Direct connection failed:", directError.message);

        // Only try CORS proxy for network errors, not auth errors
        // If it's a TypeError (network error), try CORS proxy
        if (directError.name === "TypeError") {
          console.log("Network error, trying CORS proxy...");
          const proxyUrl = `${CORS_PROXY}${url}`;
          const proxyConfig = {
            ...config,
            headers: {
              ...config.headers,
              "X-Requested-With": "XMLHttpRequest",
            },
          };

          response = await fetch(proxyUrl, proxyConfig);
          usedCorsProxy = true;
          console.log("CORS proxy connection successful");
        } else {
          // Re-throw non-network errors
          throw directError;
        }
      }

      console.log("API response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let data;

      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else if (contentType && contentType.includes("image/")) {
        data = await response.blob();
      } else {
        data = await response.text();
      }

      console.log("Response data:", data);

      if (!response.ok) {
        console.error("API Error:", {
          status: response.status,
          statusText: response.statusText,
          data: data,
        });

        // Handle 401 Unauthorized - Clear token and redirect to login
        if (response.status === 401) {
          handleUnauthorized();

          // Only show toast if not on login page (avoid confusion on login page)
          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/") {
            toast.error("Session expired. Please login again.");
          }

          throw new ApiError(
            { detail: "Session expired. Please login again." },
            response.status
          );
        }

        // Handle 403 Forbidden - If we already tried CORS proxy and still get 403, it's likely an auth issue
        if (response.status === 403 && usedCorsProxy) {
          console.warn(
            "403 Forbidden after CORS proxy - treating as authentication error"
          );
          handleUnauthorized();

          const currentPath = window.location.pathname;
          if (currentPath !== "/login" && currentPath !== "/") {
            toast.error("Access forbidden. Please login again.");
          }

          throw new ApiError(
            { detail: "Access forbidden. Please login again." },
            response.status
          );
        }

        // Show error toast for other errors (except for optional endpoints)
        const isOptionalEndpoint = url.includes("/Auth/me");

        if (!isOptionalEndpoint) {
          const errorMessage =
            data?.detail ||
            data?.message ||
            data?.title ||
            `API Error: ${response.statusText}`;
          toast.error(errorMessage);
        }

        throw new ApiError(data, response.status);
      }

      return data;
    } catch (error) {
      console.error("Request failed:", {
        url,
        error: error.message,
        stack: error.stack,
      });

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        const networkError =
          "Network error: Unable to connect to the server. Please check your internet connection.";
        toast.error(networkError);
        throw new ApiError({ detail: networkError }, 0);
      }

      // Show generic error toast
      toast.error(error.message || "An unexpected error occurred");
      throw new ApiError({ detail: error.message }, 500);
    }
  }

  get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    return this.request(url, { method: "GET" });
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  delete(endpoint) {
    return this.request(endpoint, { method: "DELETE" });
  }
}

// Custom API Error class
class ApiError extends Error {
  constructor(errorData, status) {
    super(errorData.detail || errorData.title || "API Error");
    this.name = "ApiError";
    this.status = status;
    this.data = errorData;
  }
}

// Create API client instance
const apiClient = new ApiClient();

export { apiClient, ApiError };
