/**
 * Global Toast Notification System
 * Can be used outside React components (e.g., in API client)
 */

class ToastManager {
  constructor() {
    this.listeners = [];
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify(message, type = 'error', duration = 5000) {
    this.listeners.forEach(listener => {
      listener({ message, type, duration });
    });
  }

  error(message) {
    this.notify(message, 'error', 5000);
  }

  success(message) {
    this.notify(message, 'success', 3000);
  }

  warning(message) {
    this.notify(message, 'warning', 4000);
  }

  info(message) {
    this.notify(message, 'info', 3000);
  }
}

// Global instance
export const toast = new ToastManager();

// Export default for convenience
export default toast;

