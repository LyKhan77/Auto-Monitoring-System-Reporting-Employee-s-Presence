# Enhanced Tracking Improvements - Documentation Update

## Changes Made

### 1. Parameter Updates
Updated default parameters in `main.py` for better face tracking consistency:

- **max_distance_threshold**: Increased from 100 to 150 pixels
  - Allows better tolerance for face position changes between frames
  - Reduces ID changes when faces move slightly or reappear

- **tracking_timeout**: Increased from 1.0 to 3.0 seconds
  - Maintains tracking IDs longer when faces temporarily disappear
  - Improves ID consistency when faces exit and re-enter camera view

- **bbox_smoothing_factor**: Kept at 0.85 (previously increased from 0.7)
  - Provides smoother bounding box movement
  - Better visual experience for multi-person tracking

### 2. Configuration File Updates
Updated `parameter.md` with new parameters:
- Added documentation for `max_distance_threshold` and `tracking_timeout`
- Updated recommended tuning values for different environments
- Added effects description for new parameters

### 3. Code Implementation
- Modified face tracking logic to use dynamic parameter values
- Added `get_tracking_parameters()` function for centralized parameter management
- Updated cleanup logic to use configurable timeout values

## Benefits

### Improved ID Consistency
- Faces that exit and re-enter camera view maintain the same tracking ID
- Reduced "jumping" between different IDs for the same person
- Better tracking experience in office environments where people move in/out of frame

### Better Parameter Management
- All tracking parameters are now configurable through system specs
- Easy to tune for different environments and use cases
- Consistent parameter usage across both webcam and RTSP functions

## Testing Recommendations

1. Test with people moving in and out of camera view
2. Verify ID consistency over 3+ seconds of disappearance
3. Check bounding box smoothness with multiple people
4. Validate parameter tuning through the parameter tuning menu

## Future Improvements

If these changes don't fully resolve the ID consistency issue, we can implement:
1. Face re-identification using embedding similarity
2. Velocity prediction for face position tracking
3. Advanced tracking algorithms (SORT, DeepSORT)