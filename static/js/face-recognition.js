// Face Recognition Controls for the Dashboard

class FaceRecognitionController {
  constructor() {
    this.isActive = false;
    this.statusIndicator = null;
    this.statusText = null;
  }

  // Initialize face recognition controller
  init() {
    this.statusIndicator = document.getElementById('ai-indicator');
    this.statusText = document.getElementById('ai-status-text');

    if (!this.statusIndicator || !this.statusText) {
      Utils.log('Face recognition controller initialization failed: Required elements not found', 'error');
      return false;
    }

    this.setupEventListeners();
    Utils.log('Face recognition controller initialized successfully');
    return true;
  }

  // Setup event listeners
  setupEventListeners() {
    // We can add manual control buttons here if needed
  }

  // Update AI inference status display
  updateStatus(isActive) {
    this.isActive = isActive;

    if (this.statusIndicator && this.statusText) {
      if (isActive) {
        this.statusIndicator.classList.add('active');
        this.statusText.textContent = 'AI Inference: Active';
        this.statusText.style.color = '#00aa00';
      } else {
        this.statusIndicator.classList.remove('active');
        this.statusText.textContent = 'AI Inference: Stopped';
        this.statusText.style.color = '#554d4d';
      }
    }
    
    // Update the stream element if it exists
    const cameraManager = window.cameraManager;
    if (cameraManager && cameraManager.streamElement) {
      if (isActive) {
        cameraManager.startVideoStream();
      } else {
        cameraManager.stopVideoStream();
      }
    }
  }

  // Start face recognition
  async start() {
    try {
      const response = await fetch('/api/ai/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.status === 'success') {
        this.updateStatus(true);
        Utils.log('Face recognition started successfully');
        return true;
      } else {
        Utils.log(`Failed to start face recognition: ${result.message}`, 'error');
        return false;
      }
    } catch (error) {
      Utils.log(`Error starting face recognition: ${error.message}`, 'error');
      return false;
    }
  }

  // Stop face recognition
  async stop() {
    try {
      const response = await fetch('/api/ai/stop', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();
      if (result.status === 'success') {
        this.updateStatus(false);
        Utils.log('Face recognition stopped successfully');
        return true;
      } else {
        Utils.log(`Failed to stop face recognition: ${result.message}`, 'error');
        return false;
      }
    } catch (error) {
      Utils.log(`Error stopping face recognition: ${error.message}`, 'error');
      return false;
    }
  }

  // Get current status
  getStatus() {
    return {
      active: this.isActive
    };
  }
}

// Create global instance
window.faceRecognitionController = new FaceRecognitionController();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.faceRecognitionController.init();
});

// Global functions for external access
window.updateAIInferenceStatus = function(isActive) {
  if (window.faceRecognitionController) {
    window.faceRecognitionController.updateStatus(isActive);
  }
};