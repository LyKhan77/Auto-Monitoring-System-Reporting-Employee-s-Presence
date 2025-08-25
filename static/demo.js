// Demo script to show how to use the employee management system

document.addEventListener('DOMContentLoaded', function() {
  // Initialize the employee manager
  if (window.employeeManager.init('employee-container')) {
    console.log('Employee manager initialized successfully');
    
    // Demo: Load some sample employees (replace this with your database call)
    loadSampleEmployees();
  }
});

// Sample function to demonstrate loading employees from database
function loadSampleEmployees() {
  const sampleEmployees = [
    {
      id: 1,
      name: 'John Smith',
      status: 'available',
      lastSeen: 'Now',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-4.png'
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      status: 'available',
      lastSeen: 'Now',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-5.png'
    },
    {
      id: 3,
      name: 'Mike Wilson',
      status: 'off',
      lastSeen: '5 min ago',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-6.png'
    },
    {
      id: 4,
      name: 'Emily Davis',
      status: 'off',
      lastSeen: '45 min ago',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-7.png'
    },
    {
      id: 5,
      name: 'David Brown',
      status: 'off',
      lastSeen: '1 hour ago',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-8.png'
    },
    {
      id: 6,
      name: 'Lisa Anderson',
      status: 'off',
      lastSeen: '2 hour ago',
      avatar: 'https://c.animaapp.com/melkph5cv5mM6I/img/mask-group-9.png'
    }
  ];

  // Load employees using the global function
  window.loadEmployees(sampleEmployees);
}

// Example functions you can call from your backend:

// Add a new employee
function addNewEmployee() {
  window.addEmployee({
    name: 'New Employee',
    status: 'available',
    lastSeen: 'Now'
  });
}

// Update employee status
function updateEmployee() {
  window.updateEmployeeStatus(1, 'off', '10 min ago');
}
