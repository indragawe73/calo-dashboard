// Mock API for testing when real API is not accessible
export const mockAuthService = {
  async login(username, password) {
    console.log('Using mock API for login');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    if (username === 'admin' && password) {
      return {
        success: true,
        data: {
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6ImFkbWluIiwic3ViIjoiYWRtaW4iLCJqdGkiOiJhZDBiMGMwZC1kNzdiLTQ1NTYtYTAwNC1kMGI3ZmQzNzBjMGUiLCJuYmYiOjE3NTk2Njc0OTUsImV4cCI6MTc1OTY3MTA5NSwiaWF0IjoxNzU5NjY3NDk1LCJpc3MiOiJDYWxvUmVwb3J0U2VydmljZSIsImF1ZCI6IkNhbG9BUEkifQ.Q4ZMhLu3Vs3dapeGLAwjDtiDh2FWvkDNx6ik_n4izFg",
          expiresAt: "2025-10-05T13:31:35.5858337Z",
          tokenType: "Bearer"
        }
      };
    } else {
      return {
        success: false,
        error: "Invalid username or password"
      };
    }
  },

  async getCurrentUser() {
    console.log('Using mock API for getCurrentUser');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {
      success: true,
      data: {
        id: 1,
        username: 'admin',
        name: 'Administrator',
        email: 'admin@calo.com',
        role: 'admin',
        avatar: null,
      }
    };
  }
};
