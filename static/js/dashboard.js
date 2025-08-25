// Updated dashboard.js with AI inference indicator
// Main dashboard controller

class Dashboard {
  constructor() {
    this.isInitialized = false;
    this.updateInterval = null;
    this.aiInferenceActive = false;
  }

  // Initialize dashboard
  async init() {
    try {
      Utils.log('Initializing dashboard...');

      // Initialize managers
      const cameraInitialized = window.cameraManager.init();
      const employeeInitialized = window.employeeManager.init();

      if (!cameraInitialized || !employeeInitialized) {
        throw new Error('Failed to initialize managers');
      }

      // Setup event listeners
      this.setupEventListeners();

      // Start real-time updates
      this.startRealTimeUpdates();

      // Load initial data
      await this.loadInitialData();

      // Initialize WebSocket connection
      this.initWebSocket();

      this.isInitialized = true;
      Utils.log('Dashboard initialized successfully');

    } catch (error) {
      Utils.log(`Dashboard initialization failed: ${error.message}`, 'error');
      this.showErrorState();
    }
  }

  // Setup event listeners
  setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => this.handleNavigation(e));
    });

    // User actions
    const notificationsBtn = document.getElementById('notifications-btn');
    const profileBtn = document.getElementById('profile-btn');

    if (notificationsBtn) {
      notificationsBtn.addEventListener('click', () => this.showNotifications());
    }

    if (profileBtn) {
      profileBtn.addEventListener('click', () => this.showProfile());
    }

    // Window events
    window.addEventListener('beforeunload', () => this.cleanup());
    window.addEventListener('online', () => this.handleOnline());
    window.addEventListener('offline', () => this.handleOffline());
  }

  // Initialize WebSocket connection
  initWebSocket() {
    try {
      const socket = io();
      
      // Listen for AI status updates
      socket.on('ai_status_update', (data) => {
        this.updateAIInferenceStatus(data.active);
      });
      
      // Listen for employee status updates
      socket.on('employee_status_update', (data) => {
        this.updateEmployeeStatuses(data);
      });
      
      // Connection events
      socket.on('connect', () => {
        Utils.log('WebSocket connected');
      });
      
      socket.on('disconnect', () => {
        Utils.log('WebSocket disconnected');
      });
      
      socket.on('connection_status', (data) => {
        Utils.log(`WebSocket status: ${data.status}`);
      });
      
      Utils.log('WebSocket initialized');
    } catch (error) {
      Utils.log(`WebSocket initialization failed: ${error.message}`, 'error');
    }
  }

  // Handle navigation
  handleNavigation(event) {
    const section = event.currentTarget.dataset.section;
    
    // Update active nav item
    document.querySelectorAll('.nav-item').forEach(item => {
      item.classList.remove('active');
    });
    event.currentTarget.classList.add('active');

    // Handle section-specific logic
    switch (section) {
      case 'cctv':
        this.showCCTVSection();
        break;
      case 'report':
        this.showReportSection();
        break;
      default:
        Utils.log(`Unknown section: ${section}`, 'warn');
    }
  }

  // Show CCTV section
  showCCTVSection() {
    Utils.log('Showing CCTV section');
  }

  // Show report section
  showReportSection() {
    Utils.log('Showing report section');
    alert('Report section - Coming soon!');
  }

  // Load initial data
  async loadInitialData() {
    try {
      // Load cameras from API
      await this.loadCamerasFromAPI();
      
      // Load employees from API
      await this.loadEmployeesFromAPI();
      
    } catch (error) {
      Utils.log(`Failed to load initial data: ${error.message}`, 'error');
    }
  }

  // Load cameras from API
  async loadCamerasFromAPI() {
    try {
      const response = await fetch('/api/cameras');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const cameras = await response.json();
      await window.loadCameras(cameras);
      
      // Select first active camera by default
      const activeCamera = cameras.find(cam => cam.isActive);
      if (activeCamera) {
        await window.selectCamera(activeCamera.id);
      }
      
    } catch (error) {
      Utils.log(`Failed to load cameras from API: ${error.message}`, 'error');
    }
  }

  // Load employees from API
  async loadEmployeesFromAPI() {
    try {
      const response = await fetch('/api/employees');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const employees = await response.json();
      await window.loadEmployees(employees);
      
    } catch (error) {
      Utils.log(`Failed to load employees from API: ${error.message}`, 'error');
    }
  }

  // Start real-time updates
  startRealTimeUpdates() {
    // Update time every second
    this.updateInterval = setInterval(() => {
      this.updateDateTime();
    }, 1000);

    // Update employee status every 10 seconds
    setInterval(() => {
      this.updateEmployeeStatusesFromAPI();
    }, 10000);
  }

  // Update employee statuses from API
  async updateEmployeeStatusesFromAPI() {
    try {
      const response = await fetch('/api/employees/status');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const statusUpdates = await response.json();
      this.updateEmployeeStatuses(statusUpdates);
      
    } catch (error) {
      Utils.log(`Failed to update employee statuses from API: ${error.message}`, 'error');
    }
  }

  // Update employee statuses
  updateEmployeeStatuses(statusUpdates) {
    try {
      statusUpdates.forEach(update => {
        window.updateEmployeeStatus(
          update.employeeId,
          update.status,
          update.lastSeen,
          update.location
        );
      });
    } catch (error) {
      Utils.log(`Failed to update employee statuses: ${error.message}`, 'error');
    }
  }

  // Update date and time display
  updateDateTime() {
    const timeElement = document.getElementById('current-time');
    const dateElement = document.getElementById('current-date');

    if (timeElement) {
      timeElement.textContent = Utils.formatTime();
    }

    if (dateElement) {
      dateElement.textContent = Utils.formatDate();
    }
  }

  // Update AI inference status
  updateAIInferenceStatus(isActive) {
    this.aiInferenceActive = isActive;
    
    const indicator = document.getElementById('ai-indicator');
    const statusText = document.getElementById('ai-status-text');
    
    if (indicator && statusText) {
      if (isActive) {
        indicator.classList.add('active');
        statusText.textContent = 'AI Inference: Active';
      } else {
        indicator.classList.remove('active');
        statusText.textContent = 'AI Inference: Stopped';
      }
    }
  }

  // Show notifications
  showNotifications() {
    Utils.log('Showing notifications');
    alert('Notifications - Coming soon!');
  }

  // Show profile
  showProfile() {
    Utils.log('Showing profile');
    alert('Profile - Coming soon!');
  }

  // Handle online status
  handleOnline() {
    Utils.log('Connection restored');
    this.loadInitialData();
  }

  // Handle offline status
  handleOffline() {
    Utils.log('Connection lost', 'warn');
    this.showOfflineState();
  }

  // Show error state
  showErrorState() {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      mainContent.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; color: #ff0000;">
          <h2>Dashboard Error</h2>
          <p>Failed to initialize dashboard. Please refresh the page.</p>
          <button onclick="location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #003473; color: white; border: none; border-radius: 5px; cursor: pointer;">
            Refresh Page
          </button>
        </div>
      `;
    }
  }

  // Show offline state
  showOfflineState() {
    const header = document.querySelector('.header');
    if (header && !header.querySelector('.offline-indicator')) {
      const offlineIndicator = document.createElement('div');
      offlineIndicator.className = 'offline-indicator';
      offlineIndicator.style.cssText = `
        position: absolute;
        top: 10px;
        right: 10px;
        background: #ff0000;
        color: white;
        padding: 5px 10px;
        border-radius: 5px;
        font-size: 12px;
        z-index: 1000;
      `;
      offlineIndicator.textContent = 'OFFLINE';
      header.appendChild(offlineIndicator);
    }
  }

  // Cleanup resources
  cleanup() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
    
    if (window.cameraManager) {
      window.cameraManager.stopStream();
    }
    
    Utils.log('Dashboard cleanup completed');
  }

  // Get dashboard status
  getStatus() {
    return {
      initialized: this.isInitialized,
      cameras: window.cameraManager?.getCameras() || [],
      employees: window.employeeManager?.getEmployees() || [],
      currentCamera: window.cameraManager?.getCurrentCamera() || null,
      streaming: window.cameraManager?.isCurrentlyStreaming() || false,
      aiInferenceActive: this.aiInferenceActive
    };
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  window.dashboard = new Dashboard();
  await window.dashboard.init();
  
  // Request initial employee status
  if (window.dashboard) {
    window.dashboard.updateEmployeeStatusesFromAPI();
  }
});

// Global functions for external access
window.getDashboardStatus = function() {
  return window.dashboard?.getStatus() || { initialized: false };
};

window.refreshDashboard = async function() {
  if (window.dashboard) {
    await window.dashboard.loadInitialData();
  }
};

window.updateAIInferenceStatus = function(isActive) {
  if (window.dashboard) {
    window.dashboard.updateAIInferenceStatus(isActive);
  }
};