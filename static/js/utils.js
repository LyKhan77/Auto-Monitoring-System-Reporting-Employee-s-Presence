// Utility functions for the dashboard

class Utils {
  // Format time to HH:MM:SS
  static formatTime(date = new Date()) {
    return date.toLocaleTimeString('en-US', { 
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  // Format date to DD Month YYYY
  static formatDate(date = new Date()) {
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Debounce function for performance optimization
  static debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Show loading state
  static showLoading(element) {
    element.classList.add('loading');
  }

  // Hide loading state
  static hideLoading(element) {
    element.classList.remove('loading');
  }

  // Show error state
  static showError(element, message = '') {
    element.classList.add('error');
    if (message) {
      element.title = message;
    }
  }

  // Hide error state
  static hideError(element) {
    element.classList.remove('error');
    element.removeAttribute('title');
  }

  // Generate unique ID
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Validate RTSP URL
  static isValidRTSPUrl(url) {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'rtsp:';
    } catch {
      return false;
    }
  }

  // Log with timestamp
  static log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${type.toUpperCase()}: ${message}`;
    
    switch (type) {
      case 'error':
        console.error(logMessage);
        break;
      case 'warn':
        console.warn(logMessage);
        break;
      default:
        console.log(logMessage);
    }
  }

  // API request wrapper
  static async apiRequest(url, options = {}) {
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      Utils.log(`API request failed: ${error.message}`, 'error');
      throw error;
    }
  }
}

// Export for use in other modules
window.Utils = Utils;
