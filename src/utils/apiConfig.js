/**
 * Get API base URL based on current domain
 * @param {number} port - API port (default: 5271)
 * @returns {string} API base URL
 */
export const getApiBaseUrl = (port = 5271) => {
  const hostname = window.location.hostname;
  const currentPort = window.location.port;
  
  // Check if accessed from 192.168.1.99:7864
  if (hostname === '192.168.1.99' || currentPort === '7864') {
    return `http://192.168.1.99:${port}/api`;
  }
  
  // Default to 100.107.61.112
  return `http://100.107.61.112:${port}/api`;
};

