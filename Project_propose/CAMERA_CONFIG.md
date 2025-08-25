# Camera Configuration System

This system allows you to dynamically create camera configurations by simply creating folders in the `camera_configs` directory.

## How it works

1. Each folder in `camera_configs` represents a camera
2. Each folder contains a `config.json` file with camera settings
3. The system automatically detects new folders and creates camera buttons
4. The first camera (alphabetically) is set as active by default

## Folder Structure

```
camera_configs/
├── CAM1/
│   └── config.json
├── CAM2/
│   └── config.json
└── CAM3/
    └── config.json
```

## config.json Format

```json
{
  "name": "CAM1",
  "rtsp_url": "rtsp://admin:gspe-intercon@192.168.0.64:554/Channels/Stream1",
  "status": "offline",
  "is_active": true
}
```

## Creating New Cameras

### Method 1: Manual Folder Creation

1. Create a new folder in `camera_configs` (e.g., `CAM3`)
2. Create a `config.json` file in that folder with the camera settings
3. Restart the application or refresh the camera list

### Method 2: Using the Script

Run the create_camera.py script:

```bash
python create_camera.py CAM3
```

Or with a custom RTSP URL:

```bash
python create_camera.py CAM3 rtsp://your-custom-url
```

## Default Cameras

If no cameras are configured, the system will automatically create:
- CAM1 (active)
- CAM2
- CAM3

All cameras use the default GSPE-Intercon RTSP URL.