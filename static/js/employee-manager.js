// Employee management system

class EmployeeManager {
  constructor() {
    this.employees = new Map();
    this.container = null;
    this.activeCountElement = null;
    this.statsElements = {
      present: null,
      alert: null,
      total: null
    };
  }

  // Initialize employee manager
  init() {
    this.container = document.getElementById('employee-list');
    this.activeCountElement = document.getElementById('active-count');
    this.statsElements = {
      present: document.getElementById('present-count'),
      alert: document.getElementById('alert-count'),
      total: document.getElementById('total-count')
    };

    if (!this.container || !this.activeCountElement) {
      Utils.log('Employee manager initialization failed: Required elements not found', 'error');
      return false;
    }

    Utils.log('Employee manager initialized successfully');
    return true;
  }

  // Add single employee
  addEmployee(employeeData) {
    const employee = {
      id: employeeData.id || Utils.generateId(),
      name: employeeData.name || `Employee ${this.employees.size + 1}`,
      status: employeeData.status || 'off', // 'available' or 'off'
      lastSeen: employeeData.lastSeen || 'Now',
      avatar: employeeData.avatar || this.getDefaultAvatar(),
      cameraId: employeeData.cameraId || null,
      location: employeeData.location || 'Unknown'
    };

    this.employees.set(employee.id, employee);
    this.renderEmployee(employee);
    this.updateStats();
    
    Utils.log(`Employee added: ${employee.name} (${employee.id})`);
    return employee.id;
  }

  // Load employees from backend
  async loadEmployees(employeeData) {
    try {
      this.clearEmployees();
      
      if (Array.isArray(employeeData)) {
        employeeData.forEach(emp => this.addEmployee(emp));
      }
      
      Utils.log(`Loaded ${this.employees.size} employees`);
      return true;
    } catch (error) {
      Utils.log(`Failed to load employees: ${error.message}`, 'error');
      return false;
    }
  }

  // Clear all employees
  clearEmployees() {
    this.employees.clear();
    this.container.innerHTML = '';
    this.updateStats();
  }

  // Render single employee
  renderEmployee(employee) {
    const employeeElement = document.createElement('div');
    employeeElement.className = 'employee-item';
    employeeElement.setAttribute('data-employee-id', employee.id);
    
    // Always use local avatar (colored circle)
    const avatarSrc = this.getDefaultAvatar();
    
    employeeElement.innerHTML = `
      <div class="employee-info">
        <div class="employee-name">${employee.name}</div>
        <div class="employee-cam">CAM ${employee.cameraId || 'Unknown'}</div>
      </div>
      
      <div class="employee-status">
        <div class="status-dot ${employee.status === 'available' ? 'available' : ''}"></div>
        <span>${employee.status}</span>
      </div>
      
      <div class="employee-actions">
        <div class="employee-time">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-clock-icon lucide-clock"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
          
          <span>${employee.lastSeen}</span>
        </div>
        <button class="track-btn" data-action="track" data-employee-id="${employee.id}">Track Location</button>
      </div>
    `;

    // Add event listeners
    const trackBtn = employeeElement.querySelector('.track-btn');
    trackBtn.addEventListener('click', () => this.trackEmployee(employee.id));

    this.container.appendChild(employeeElement);
  }

  // Update employee status
  updateEmployeeStatus(employeeId, status, lastSeen = null, location = null) {
    const employee = this.employees.get(employeeId);
    if (!employee) {
      Utils.log(`Employee not found: ${employeeId}`, 'error');
      return false;
    }

    employee.status = status;
    if (lastSeen) employee.lastSeen = lastSeen;
    if (location) employee.location = location;
    if (location) employee.cameraId = location;

    // Update DOM
    const employeeElement = this.container.querySelector(`[data-employee-id="${employeeId}"]`);
    if (employeeElement) {
      const statusDot = employeeElement.querySelector('.status-dot');
      const statusText = employeeElement.querySelector('.employee-status span');
      const timeText = employeeElement.querySelector('.employee-time span');
      const camText = employeeElement.querySelector('.employee-cam');

      if (statusDot) {
        statusDot.className = `status-dot ${status === 'available' ? 'available' : ''}`;
      }
      if (statusText) statusText.textContent = status;
      if (timeText && lastSeen) timeText.textContent = lastSeen;
      if (camText) camText.textContent = `CAM ${location || 'Unknown'}`;
    }

    this.updateStats();
    Utils.log(`Employee ${employee.name} status updated: ${status}`);
    return true;
  }

  // Track employee location
  async trackEmployee(employeeId) {
    const employee = this.employees.get(employeeId);
    if (!employee) return false;

    try {
      Utils.log(`Tracking employee: ${employee.name}`);
      
      // Call backend API to get employee location
      const response = await fetch(`/api/employee/${employeeId}/location`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const locationData = await response.json();
      
      if (locationData.location) {
        employee.location = locationData.location;
        alert(`${employee.name} is currently at: ${locationData.location}`);
        
        // If we have camera information, switch to that camera
        if (locationData.location && window.cameraManager) {
          // Find camera by name
          const cameras = window.cameraManager.getCameras();
          const targetCamera = cameras.find(cam => cam.name === locationData.location);
          if (targetCamera) {
            await window.selectCamera(targetCamera.id);
          }
        }
      }
      
      return true;
    } catch (error) {
      // Fallback for demo
      alert(`Tracking ${employee.name}'s location...
Last known location: ${employee.location}`);
      Utils.log(`Location tracking failed: ${error.message}`, 'warn');
      return false;
    }
  }

  // Update statistics display
  updateStats() {
    const employees = Array.from(this.employees.values());
    const activeCount = employees.filter(emp => emp.status === 'available').length;
    const alertCount = employees.filter(emp => emp.status === 'off').length;
    const totalCount = employees.length;

    // Update active count in header
    if (this.activeCountElement) {
      this.activeCountElement.textContent = `${activeCount} Active`;
    }

    // Update bottom statistics
    if (this.statsElements.present) {
      this.statsElements.present.textContent = activeCount;
    }
    if (this.statsElements.alert) {
      this.statsElements.alert.textContent = alertCount;
    }
    if (this.statsElements.total) {
      this.statsElements.total.textContent = totalCount;
    }
  }

  // Get default avatar based on employee count
  getDefaultAvatar() {
    // Use data URI for simple colored circles as avatars
    const colors = ['#003473', '#0056b3', '#00aa00', '#ff0000', '#ffff00', '#00ffff', '#ff00ff', '#800080', '#ffa500'];
    const colorIndex = this.employees.size % colors.length;
    const color = colors[colorIndex];
    
    // Create a simple colored circle as avatar using data URI
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='15' height='15' viewBox='0 0 15 15'%3E%3Ccircle cx='7.5' cy='7.5' r='7.5' fill='${color.replace('#', '%23')}'/%3E%3C/svg%3E`;
  }

  // Remove employee
  removeEmployee(employeeId) {
    const employee = this.employees.get(employeeId);
    if (!employee) return false;

    this.employees.delete(employeeId);
    
    const employeeElement = this.container.querySelector(`[data-employee-id="${employeeId}"]`);
    if (employeeElement) {
      employeeElement.remove();
    }

    this.updateStats();
    Utils.log(`Employee removed: ${employee.name}`);
    return true;
  }

  // Get employee by ID
  getEmployee(employeeId) {
    return this.employees.get(employeeId);
  }

  // Get all employees
  getEmployees() {
    return Array.from(this.employees.values());
  }

  // Get employees by status
  getEmployeesByStatus(status) {
    return Array.from(this.employees.values()).filter(emp => emp.status === status);
  }

  // Search employees
  searchEmployees(query) {
    const searchTerm = query.toLowerCase();
    return Array.from(this.employees.values()).filter(emp => 
      emp.name.toLowerCase().includes(searchTerm) ||
      (emp.location && emp.location.toLowerCase().includes(searchTerm))
    );
  }
}

// Create global instance
window.employeeManager = new EmployeeManager();

// Global functions for backend integration
window.loadEmployees = async function(employeeData) {
  return await window.employeeManager.loadEmployees(employeeData);
};

window.addEmployee = function(employeeData) {
  return window.employeeManager.addEmployee(employeeData);
};

window.updateEmployeeStatus = function(employeeId, status, lastSeen, location) {
  return window.employeeManager.updateEmployeeStatus(employeeId, status, lastSeen, location);
};

window.removeEmployee = function(employeeId) {
  return window.employeeManager.removeEmployee(employeeId);
};

window.getEmployee = function(employeeId) {
  return window.employeeManager.getEmployee(employeeId);
};

window.getEmployees = function() {
  return window.employeeManager.getEmployees();
};

window.trackEmployee = async function(employeeId) {
  return await window.employeeManager.trackEmployee(employeeId);
};