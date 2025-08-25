// Camera management system for RTSP streams and camera controls

class CameraManager {
  constructor() {
    this.cameras = new Map();
    this.currentCamera = null;
    this.streamElement = null;
    this.videoContainer = null;
    this.placeholder = null;
    this.loadingSpinner = null;
    this.buttonsContainer = null;
    this.fullscreenToggle = null;
    this.isStreaming = false;
    this.faceRecognitionActive = false;
    this.socket = null;
  }

  // Initialize camera manager
  init() {
    this.streamElement = document.getElementById('face-recognition-stream');
    this.videoContainer = document.getElementById('video-container');
    this.placeholder = document.getElementById('video-placeholder');
    this.loadingSpinner = document.getElementById('loading-spinner');
    this.buttonsContainer = document.getElementById('camera-buttons');
    this.fullscreenToggle = document.getElementById('fullscreen-toggle');

    if (!this.videoContainer || !this.placeholder || !this.buttonsContainer) {
      Utils.log('Camera manager initialization failed: Required elements not found', 'error');
      return false;
    }

    // Initialize Socket.IO connection for camera streaming
    this.initCameraSocket();
    
    // Initialize fullscreen toggle
    this.initFullscreenToggle();

    Utils.log('Camera manager initialized successfully');
    return true;
  }

  // Initialize Socket.IO connection for camera streaming
  initCameraSocket() {
    try {
      this.socket = io('/camera');
      
      // Listen for camera frames
      this.socket.on('camera_frame', (data) => {
        if (this.streamElement) {
          // Handle different types of frame data
          if (data.frame) {
            // Check if this is an error frame
            if (typeof data.frame === 'string' && 
                (data.frame === 'Camera Unavailable' || 
                 data.frame.includes("Camera Unavailable") || 
                 data.frame.includes("Failed to open video stream") ||
                 data.frame.includes("Camera Error"))) {
              this.showCameraError("Camera Unavailable");
            } else {
              // Clear any previous error messages
              this.clearCameraError();
              // Show the video stream when we receive a normal frame
              this.showFaceRecognitionStream();
              // Handle both string and object frame data
              if (typeof data.frame === 'string') {
                this.streamElement.src = "data:image/jpeg;base64," + data.frame;
              } else {
                // If frame is not a string, it might be an object - convert to string
                this.streamElement.src = "data:image/jpeg;base64," + String(data.frame);
              }
            }
          }
        }
      });
      
      // Listen for AI status updates
      this.socket.on('ai_status_update', (data) => {
        if (window.dashboard) {
          window.dashboard.updateAIInferenceStatus(data.active);
        }
      });
      
    } catch (error) {
      console.error(`Camera Socket.IO initialization failed: ${error.message}`);
    }
  }

  // Add camera configuration
  addCamera(cameraConfig) {
    const camera = {
      id: cameraConfig.id || Utils.generateId(),
      name: cameraConfig.name || `Camera ${this.cameras.size + 1}`,
      rtspUrl: cameraConfig.rtspUrl || '',
      isActive: cameraConfig.isActive || false,
      status: cameraConfig.status || 'offline' // online, offline, error
    };

    this.cameras.set(camera.id, camera);
    this.renderCameraButton(camera);
    
    Utils.log(`Camera added: ${camera.name} (${camera.id})`);
    return camera.id;
  }

  // Load cameras from backend
  async loadCameras(cameraConfigs) {
    try {
      // Clear existing cameras
      this.clearCameras();

      // Add new cameras
      if (Array.isArray(cameraConfigs)) {
        cameraConfigs.forEach(config => this.addCamera(config));
      }

      Utils.log(`Loaded ${this.cameras.size} cameras`);
      return true;
    } catch (error) {
      Utils.log(`Failed to load cameras: ${error.message}`, 'error');
      return false;
    }
  }

  // Clear all cameras
  clearCameras() {
    this.stopStream();
    this.cameras.clear();
    if (this.buttonsContainer) {
      this.buttonsContainer.innerHTML = '';
    }
    this.currentCamera = null;
  }

  // Render camera button
  renderCameraButton(camera) {
    if (!this.buttonsContainer) return;
    
    const button = document.createElement('button');
    button.className = `camera-btn ${camera.isActive ? 'active' : ''}`;
    button.setAttribute('data-camera-id', camera.id);
    button.textContent = camera.name.replace('Camera ', '');
    
    // Add click handler
    button.addEventListener('click', () => this.selectCamera(camera.id));
    
    this.buttonsContainer.appendChild(button);
  }

  // Select and activate camera
  async selectCamera(cameraId) {
    console.log(`[CAMERA MANAGER] Selecting camera: ${cameraId}`);
    const camera = this.cameras.get(cameraId);
    if (!camera) {
      console.error(`[CAMERA MANAGER] Camera not found: ${cameraId}`);
      return false;
    }

    // Update UI - deactivate all buttons
    if (this.buttonsContainer) {
      this.buttonsContainer.querySelectorAll('.camera-btn').forEach(btn => {
        btn.classList.remove('active');
      });
    }

    // Activate selected button
    if (this.buttonsContainer) {
      const selectedButton = this.buttonsContainer.querySelector(`[data-camera-id="${cameraId}"]`);
      if (selectedButton) {
        selectedButton.classList.add('active');
      }
    }

    // Update camera states
    this.cameras.forEach(cam => cam.isActive = false);
    camera.isActive = true;
    this.currentCamera = camera;

    // Start streaming
    console.log(`[CAMERA MANAGER] Starting stream for camera: ${camera.name}`);
    const success = await this.startStream(camera);
    if (!success) {
      console.error('[CAMERA MANAGER] Failed to start camera stream');
      this.showCameraError('Failed to start camera stream');
    }
    
    console.log(`[CAMERA MANAGER] Camera selected: ${camera.name}`);
    return success;
  }

  // Start RTSP stream
  async startStream(camera) {
    if (!camera || !camera.rtspUrl) {
      console.log('[CAMERA MANAGER] Cannot start stream: Invalid camera or missing RTSP URL');
      this.showCameraError('Camera Unavailable');
      return false;
    }

    try {
      console.log(`[CAMERA MANAGER] Starting stream for camera: ${camera.name} (${camera.rtspUrl})`);
      this.showLoading();
      
      // Send start stream command to server
      if (this.socket) {
        this.socket.emit('start_stream', { rtsp_url: camera.rtspUrl });
        console.log('[CAMERA MANAGER] Start stream command sent to server');
      }
      
      return true;
    } catch (error) {
      console.error(`[CAMERA MANAGER] Failed to start stream: ${error.message}`);
      this.showCameraError('Camera Unavailable');
      return false;
    }
  }

  // Stop current stream
  stopStream() {
    console.log('[CAMERA MANAGER] Stopping current stream');
    if (this.socket && this.currentCamera) {
      this.socket.emit('stop_stream', { rtsp_url: this.currentCamera.rtspUrl });
      console.log('[CAMERA MANAGER] Stop stream command sent to server');
    }
    
    if (this.streamElement) {
      this.streamElement.src = '';
    }
    
    this.isStreaming = false;
    this.showPlaceholder();
    
    console.log('[CAMERA MANAGER] Stream stopped');
  }

  // Show face recognition stream
  showFaceRecognitionStream() {
    console.log('[CAMERA MANAGER] Showing face recognition stream');
    // Only show video if we're not currently showing an error
    if (this.placeholder && this.placeholder.innerHTML.includes("Camera Unavailable")) {
      console.log('[CAMERA MANAGER] Camera unavailable, not showing stream');
      return; // Don't override error message
    }
    
    this.hideLoading();
    this.showVideo();
  }

  // Clear any camera error messages
  clearCameraError() {
    console.log('[CAMERA MANAGER] Clearing camera error');
    // Reset to normal placeholder if we were showing an error
    if (this.placeholder && (this.placeholder.innerHTML.includes("Camera Unavailable") || 
                             this.placeholder.innerHTML.includes("Stream Error"))) {
      this.showPlaceholder();
    }
  }

  // Update camera status
  updateCameraStatus(cameraId, status) {
    const camera = this.cameras.get(cameraId);
    if (!camera) return false;

    camera.status = status;
    
    // Update button appearance based on status
    if (this.buttonsContainer) {
      const button = this.buttonsContainer.querySelector(`[data-camera-id="${cameraId}"]`);
      if (button) {
        button.classList.remove('error', 'success');
        if (status === 'error') {
          button.classList.add('error');
        } else if (status === 'online') {
          button.classList.add('success');
        }
      }
    }

    Utils.log(`Camera ${camera.name} status updated: ${status}`);
    return true;
  }

  // UI state management
  showLoading() {
    console.log('[CAMERA MANAGER] Showing loading spinner');
    if (this.placeholder) {
      this.placeholder.innerHTML = '<span>LIVE CCTV CAM</span>';
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.id = 'loading-spinner';
      spinner.style.display = 'block';
      this.placeholder.appendChild(spinner);
      this.placeholder.style.display = 'flex';
    }
    if (this.streamElement) this.streamElement.style.display = 'none';
  }

  hideLoading() {
    // Remove loading spinner if it exists
    const spinner = this.placeholder ? this.placeholder.querySelector('.loading-spinner') : null;
    if (spinner) {
      spinner.remove();
    }
  }

  showVideo() {
    if (this.placeholder) {
      this.placeholder.style.display = 'none';
    }
    if (this.streamElement) {
      this.streamElement.style.display = 'block';
      // Add responsive sizing
      this.streamElement.style.maxWidth = '100%';
      this.streamElement.style.maxHeight = '100%';
      this.streamElement.style.width = 'auto';
      this.streamElement.style.height = 'auto';
      this.streamElement.style.objectFit = 'contain';
      
      // Show fullscreen toggle button
      if (this.fullscreenToggle) {
        this.fullscreenToggle.style.display = 'block';
      }
    }
  }

  showPlaceholder() {
    if (this.placeholder) {
      this.placeholder.innerHTML = '<span>LIVE CCTV CAM</span>';
      const spinner = document.createElement('div');
      spinner.className = 'loading-spinner';
      spinner.id = 'loading-spinner';
      spinner.style.display = 'none';
      this.placeholder.appendChild(spinner);
      this.placeholder.style.display = 'flex';
    }
    if (this.streamElement) this.streamElement.style.display = 'none';
    
    // Hide fullscreen toggle button
    if (this.fullscreenToggle) {
      this.fullscreenToggle.style.display = 'none';
    }
  }

  showError() {
    this.hideLoading();
    if (this.placeholder) {
      this.placeholder.innerHTML = '<span style="color: #ff0000;">Stream Error</span>';
    }
    if (this.streamElement) this.streamElement.style.display = 'none';
  }

  // Show camera error message
  showCameraError(errorMessage) {
    this.hideLoading();
    if (this.placeholder) {
      this.placeholder.innerHTML = '<span style="color: #ff0000; font-size: 32px; font-weight: bold;">' + (errorMessage || "Camera Unavailable") + '</span>';
      this.placeholder.style.display = 'flex';
    }
    if (this.streamElement) this.streamElement.style.display = 'none';
    
    // Hide fullscreen toggle button
    if (this.fullscreenToggle) {
      this.fullscreenToggle.style.display = 'none';
    }
  }

  // Get current camera info
  getCurrentCamera() {
    return this.currentCamera;
  }

  // Get all cameras
  getCameras() {
    return Array.from(this.cameras.values());
  }

  // Check if streaming
  isCurrentlyStreaming() {
    return this.isStreaming;
  }
  
  // Initialize fullscreen toggle button
  initFullscreenToggle() {
    if (this.fullscreenToggle && this.streamElement) {
      this.fullscreenToggle.addEventListener('click', () => {
        this.toggleFullscreen();
      });
      
      // Show fullscreen button when stream is active
      this.streamElement.addEventListener('load', () => {
        if (this.streamElement.style.display !== 'none') {
          this.fullscreenToggle.style.display = 'block';
        }
      });
    }
  }

  // Toggle fullscreen mode
  toggleFullscreen() {
    if (this.streamElement) {
      this.streamElement.classList.toggle('fullscreen');
      const isFullscreen = this.streamElement.classList.contains('fullscreen');
      
      if (isFullscreen) {
        this.streamElement.style.objectFit = 'cover';
        this.fullscreenToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M7 7h10v10M7 17H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/>
          </svg>
        `;
      } else {
        this.streamElement.style.objectFit = 'contain';
        this.streamElement.style.width = 'auto';
        this.streamElement.style.height = 'auto';
        this.fullscreenToggle.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/>
          </svg>
        `;
      }
    }
  }
}

// Create global instance
window.cameraManager = new CameraManager();

// Global functions for backend integration
window.loadCameras = async function(cameraConfigs) {
  return await window.cameraManager.loadCameras(cameraConfigs);
};

window.addCamera = function(cameraConfig) {
  return window.cameraManager.addCamera(cameraConfig);
};

window.selectCamera = async function(cameraId) {
  return await window.cameraManager.selectCamera(cameraId);
};

window.updateCameraStatus = function(cameraId, status) {
  return window.cameraManager.updateCameraStatus(cameraId, status);
};