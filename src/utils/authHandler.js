/**
 * Handle unauthorized (401) response
 * Clears authentication data and redirects to login page
 */
export const handleUnauthorized = () => {
  console.warn('Unauthorized: Clearing token and redirecting to login');
  
  // Clear authentication data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  // Check if already on login page to prevent redirect loop
  const currentPath = window.location.pathname;
  if (currentPath === '/login' || currentPath === '/') {
    console.log('Already on login page, skipping redirect');
    return; // Don't redirect if already on login page
  }
  
  // Redirect to login page
  window.location.href = '/login';
};

/**
 * Check response status and handle unauthorized
 * @param {Response} response - Fetch API response object
 * @returns {Response} - Returns the response if not 401
 */
export const checkAuthResponse = (response) => {
  if (response.status === 401) {
    handleUnauthorized();
  }
  return response;
};

