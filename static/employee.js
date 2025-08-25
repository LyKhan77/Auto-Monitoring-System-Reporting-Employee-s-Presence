// Employee data structure and management functions

class EmployeeManager {
  constructor() {
    this.employees = [];
    this.container = null;
  }

  // Initialize the employee manager with the container element
  init(containerId = 'employee-container') {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with id '${containerId}' not found`);
      return false;
    }
    return true;
  }

  // Add a single employee
  addEmployee(employeeData) {
    const employee = {
      id: employeeData.id || this.employees.length + 1,
      name: employeeData.name || `Employee ${this.employees.length + 1}`,
      status: employeeData.status || 'off', // 'available' or 'off'
      lastSeen: employeeData.lastSeen || 'Now',
      avatar: employeeData.avatar || `duration.png`
    };
    
    this.employees.push(employee);
    this.renderEmployee(employee);
    this.updateStats();
  }

  // Load employees from database (you'll replace this with your actual database call)
  async loadEmployeesFromDatabase(employeeData) {
    try {
      // Clear existing employees
      this.clearEmployees();
      
      // Add employees from the provided data
      if (Array.isArray(employeeData)) {
        employeeData.forEach(emp => this.addEmployee(emp));
      }
      
      return true;
    } catch (error) {
      console.error('Error loading employees:', error);
      return false;
    }
  }

  // Clear all employees
  clearEmployees() {
    this.employees = [];
    if (this.container) {
      // Keep only the header elements, remove employee entries
      const employeeEntries = this.container.querySelectorAll('.employee-entry');
      employeeEntries.forEach(entry => entry.remove());
    }
    this.updateStats();
  }

  // Render a single employee
  renderEmployee(employee) {
    if (!this.container) return;

    const employeeElement = document.createElement('div');
    employeeElement.className = 'employee-entry';
    employeeElement.setAttribute('data-employee-id', employee.id);
    
    const statusClass = employee.status === 'available' ? 'available' : 'off';
    const statusColor = employee.status === 'available' ? '#00ff15' : '#ff0000';
    
    employeeElement.innerHTML = `
      <div class="overlap-7">
        <div class="employee visible">${employee.name}</div>
        <div class="CAM">CAM</div>
        <div class="group-11">
          <div class="overlap-group-5">
            <div class="text-wrapper-12">Track Location</div>
          </div>
        </div>
        <div class="group-12">
          <div class="overlap-8">
            <div class="text-wrapper-13">${employee.status}</div>
            <div class="ellipse" style="background-color: ${statusColor}"></div>
          </div>
        </div>
        <div class="group-13">
          <div class="text-wrapper-14">${employee.lastSeen}</div>
          <img class="mask-group-4" src="${employee.avatar}" />
        </div>
      </div>
    `;

    // Add click handler for track location button
    const trackButton = employeeElement.querySelector('.group-11');
    trackButton.addEventListener('click', () => this.trackEmployee(employee.id));

    this.container.appendChild(employeeElement);
  }

  // Update employee status
  updateEmployeeStatus(employeeId, status, lastSeen = null) {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (!employee) return false;

    employee.status = status;
    if (lastSeen) employee.lastSeen = lastSeen;

    // Update the DOM element
    const employeeElement = this.container.querySelector(`[data-employee-id="${employeeId}"]`);
    if (employeeElement) {
      const statusElement = employeeElement.querySelector('.text-wrapper-13');
      const ellipseElement = employeeElement.querySelector('.ellipse');
      const lastSeenElement = employeeElement.querySelector('.text-wrapper-14');

      if (statusElement) statusElement.textContent = status;
      if (ellipseElement) {
        ellipseElement.style.backgroundColor = status === 'available' ? '#00ff15' : '#ff0000';
      }
      if (lastSeenElement && lastSeen) lastSeenElement.textContent = lastSeen;
    }

    this.updateStats();
    return true;
  }

  // Update statistics
  updateStats() {
    const activeCount = this.employees.filter(emp => emp.status === 'available').length;
    const totalCount = this.employees.length;
    const alertCount = this.employees.filter(emp => emp.status === 'off').length;

    // Update active count in header
    const activeElement = document.querySelector('.text-wrapper-11');
    if (activeElement) activeElement.textContent = `${activeCount} Active`;

    // Update stats at bottom
    const presentElement = document.querySelector('.group-19 .text-wrapper-17');
    const alertsElement = document.querySelector('.group-20 .text-wrapper-18');
    const totalElement = document.querySelector('.group-21 .text-wrapper-17');

    if (presentElement) presentElement.textContent = activeCount;
    if (alertsElement) alertsElement.textContent = alertCount;
    if (totalElement) totalElement.textContent = totalCount;
  }

  // Track employee location (placeholder function)
  trackEmployee(employeeId) {
    const employee = this.employees.find(emp => emp.id === employeeId);
    if (employee) {
      console.log(`Tracking location for ${employee.name}`);
      // Add your tracking logic here
      alert(`Tracking ${employee.name}'s location...`);
    }
  }

  // Get all employees
  getEmployees() {
    return [...this.employees];
  }

  // Get employee by ID
  getEmployee(employeeId) {
    return this.employees.find(emp => emp.id === employeeId);
  }
}

// Create global instance
window.employeeManager = new EmployeeManager();

// Example usage functions for your backend integration:

// Function to load employees from your database
window.loadEmployees = async function(employeeData) {
  return await window.employeeManager.loadEmployeesFromDatabase(employeeData);
};

// Function to add a single employee
window.addEmployee = function(employeeData) {
  window.employeeManager.addEmployee(employeeData);
};

// Function to update employee status
window.updateEmployeeStatus = function(employeeId, status, lastSeen) {
  return window.employeeManager.updateEmployeeStatus(employeeId, status, lastSeen);
};

// Function to get all employees
window.getEmployees = function() {
  return window.employeeManager.getEmployees();
};
