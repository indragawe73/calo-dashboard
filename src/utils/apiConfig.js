/**
 * Get API base URL based on current domain
 * @param {number} port - API port (default: 5271)
 * @returns {string} API base URL
 */
export const getApiBaseUrl = (port = 5271) => {
  const hostname = window.location.hostname;
  
  // Only if accessed from 192.168.1.99 (any port) -> use 192.168.1.99:5271
  if (hostname === '192.168.1.99') {
    return `http://192.168.1.99:${port}/api`;
  }
  
  // Otherwise (including 100.107.61.112:7864) -> use 100.107.61.112:5271
  return `http://100.107.61.112:${port}/api`;
};

