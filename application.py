#!/usr/bin/env python3
# application.py
# Main Application - Web Interface that displays everything to UI

from flask import Flask, render_template, jsonify, request, send_from_directory, Response
from flask_socketio import SocketIO, emit
from flask_cors import CORS
import json
import time
from datetime import datetime
import threading
import os
from db_manager import db_manager, SessionLocal, EmployeeStatus
from camera_manager import camera_manager, get_all_camera_configs
from tracking_manager import tracking_manager
from AI_module import ai_processing_module, load_system_specs

# Create Flask app
app = Flask(__name__, static_folder='static')
app.config['SECRET_KEY'] = 'your-secret_key_here'
socketio = SocketIO(app, async_mode="threading", cors_allowed_origins="*")
CORS(app)

# Active streams tracking
active_streams = {}

# Initialize AI processing module
print("[APPLICATION] Initializing AI processing module...")
ai_processing_module.initialize_model()
print("[APPLICATION] AI processing module initialized")

def get_db_session():
    """Get database session"""
    return SessionLocal()

@app.route('/')
def index():
    """Serve the main dashboard page"""
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/globals.css')
def globals_css():
    """Serve globals.css"""
    return send_from_directory(app.static_folder, 'globals.css')

@app.route('/style.css')
def style_css():
    """Serve style.css"""
    return send_from_directory(app.static_folder, 'style.css')

@app.route('/js/<path:filename>')
def js_files(filename):
    """Serve JavaScript files"""
    return send_from_directory(os.path.join(app.static_folder, 'js'), filename)

@app.route('/src/<path:filename>')
def src_files(filename):
    """Serve image files"""
    return send_from_directory(os.path.join(app.static_folder, 'src'), filename)

# API Routes
@app.route('/api/employees')
def get_employees():
    """Get all employees with their current status"""
    try:
        session = get_db_session()
        
        # Get all employees
        employees_data = db_manager.get_all_employees()
        
        # Get status for each employee
        employees_with_status = []
        for name, _ in employees_data:
            # Get employee status
            status_record = session.query(EmployeeStatus).filter_by(employee_name=name).first()
            
            employee_info = {
                'id': name.lower().replace(' ', '_'),  # Generate ID from name
                'name': name,
                'status': status_record.status if status_record else 'off',
                'lastSeen': format_last_seen(status_record.last_seen) if status_record and status_record.last_seen else 'Never',
                'cameraId': status_record.current_camera if status_record else None,
                'location': status_record.current_camera if status_record else 'Unknown'
            }
            employees_with_status.append(employee_info)
        
        session.close()
        return jsonify(employees_with_status)
    
    except Exception as e:
        print(f"[APPLICATION] Error getting employees: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/employees/status')
def get_employee_status():
    """Get real-time status updates for all employees"""
    try:
        session = get_db_session()
        
        # Get all employee statuses
        status_records = db_manager.get_employee_statuses()
        
        status_updates = []
        for record in status_records:
            status_update = {
                'employeeId': record['employee_name'].lower().replace(' ', '_'),
                'employeeName': record['employee_name'],
                'status': record['status'],
                'lastSeen': format_last_seen(record['last_seen']) if record['last_seen'] else 'Never',
                'cameraId': record['current_camera'],
                'location': record['current_camera'] or 'Unknown'
            }
            status_updates.append(status_update)
        
        session.close()
        return jsonify(status_updates)
    
    except Exception as e:
        print(f"[APPLICATION] Error getting employee status: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({'error': str(e)}), 500

@app.route('/api/cameras')
def get_cameras():
    """Get all camera configurations"""
    try:
        # Use the camera manager instance to get all cameras
        camera_configs = camera_manager.get_all_camera_configs()
        return jsonify(camera_configs)
    
    except Exception as e:
        print(f"[APPLICATION] Error getting cameras: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/employee/<employee_id>/location')
def get_employee_location(employee_id):
    """Get employee location history"""
    try:
        session = get_db_session()
        
        # Convert employee_id back to name (this is a simple approach)
        employee_name = employee_id.replace('_', ' ').title()
        
        # Get employee locations
        locations = session.query(EmployeeLocation).filter_by(employee_name=employee_name).order_by(EmployeeLocation.timestamp.desc()).limit(10).all()
        
        location_history = []
        for loc in locations:
            camera = session.query(Camera).filter_by(id=loc.camera_id).first()
            location_info = {
                'cameraId': loc.camera_id,
                'cameraName': camera.name if camera else loc.camera_id,
                'timestamp': loc.timestamp.isoformat(),
                'formattedTime': format_last_seen(loc.timestamp)
            }
            location_history.append(location_info)
        
        session.close()
        
        if location_history:
            return jsonify({
                'employeeId': employee_id,
                'employeeName': employee_name,
                'location': location_history[0]['cameraName'],
                'history': location_history
            })
        else:
            return jsonify({
                'employeeId': employee_id,
                'employeeName': employee_name,
                'location': 'Unknown',
                'history': []
            })
    
    except Exception as e:
        print(f"[APPLICATION] Error getting employee location: {e}")
        return jsonify({'error': str(e)}), 500

def format_last_seen(last_seen_time):
    """Format last seen time in a human-readable way"""
    if not last_seen_time:
        return "Never"
    
    if isinstance(last_seen_time, str):
        # If it's already a string, return as is
        return last_seen_time
    
    # Calculate time difference
    now = datetime.now()
    if isinstance(last_seen_time, datetime):
        diff = now - last_seen_time
    else:
        # Assume it's a timestamp
        diff = now - datetime.fromtimestamp(last_seen_time)
    
    seconds = diff.total_seconds()
    
    if seconds < 60:
        return "Just now"
    elif seconds < 3600:
        minutes = int(seconds / 60)
        return f"{minutes} min ago"
    elif seconds < 86400:
        hours = int(seconds / 3600)
        return f"{hours} hour{'s' if hours > 1 else ''} ago"
    else:
        days = int(seconds / 86400)
        return f"{days} day{'s' if days > 1 else ''} ago"

def update_employee_status_in_background():
    """Background thread to update employee status and emit to clients"""
    while True:
        try:
            time.sleep(10)  # Update every 10 seconds
            
            session = get_db_session()
            
            # Get all employee statuses
            status_records = db_manager.get_employee_statuses()
            
            # Emit updates to all connected clients
            status_updates = []
            for record in status_records:
                status_update = {
                    'employeeId': record['employee_name'].lower().replace(' ', '_'),
                    'employeeName': record['employee_name'],
                    'status': record['status'],
                    'lastSeen': format_last_seen(record['last_seen']) if record['last_seen'] else 'Never',
                    'cameraId': record['current_camera'],
                    'location': record['current_camera'] or 'Unknown'
                }
                status_updates.append(status_update)
            
            # Emit to all connected clients
            socketio.emit('employee_status_update', status_updates)
            
            session.close()
            
        except Exception as e:
            print(f"[APPLICATION] Error in background status update: {e}")

# WebSocket events for camera streaming
@socketio.on('connect', namespace='/camera')
def handle_camera_connect():
    """Handle camera client connection"""
    print('[APPLICATION] Camera client connected')

@socketio.on('start_stream', namespace='/camera')
def start_stream(data):
    """Start camera stream - delegate to AI module for background processing"""
    rtsp_url = data.get('rtsp_url')
    if not rtsp_url:
        # Send error frame to client
        socketio.emit('camera_frame', {
            'frame': 'Camera Unavailable',
            'rtsp_url': ''
        }, namespace='/camera')
        return
    
    # Stop any existing streams
    for url in list(active_streams.keys()):
        stop_stream({'rtsp_url': url})
    
    # Define frame callback to emit frames to client
    def frame_callback(frame_base64):
        # Always send frame to client, let frontend handle error detection
        socketio.emit('camera_frame', {
            'frame': frame_base64, 
            'rtsp_url': rtsp_url
        }, namespace='/camera')
    
    # Start face recognition processing in background (delegate to AI module)
    # Use rtsp_url as both camera_id and rtsp_url for consistency
    success = ai_processing_module.start_stream(rtsp_url, rtsp_url, frame_callback)
    
    if success:
        # Update AI status for all clients
        socketio.emit('ai_status_update', {'active': True})
        active_streams[rtsp_url] = True
    else:
        # Send error frame to client
        socketio.emit('camera_frame', {
            'frame': 'Camera Unavailable',
            'rtsp_url': rtsp_url
        }, namespace='/camera')

@socketio.on('stop_stream', namespace='/camera')
def stop_stream(data):
    """Stop camera stream - delegate to AI module"""
    rtsp_url = data.get('rtsp_url')
    print(f"[APPLICATION] Received stop_stream request for RTSP URL: {rtsp_url}")
    if not rtsp_url:
        return
    
    if rtsp_url in active_streams:
        print(f"[APPLICATION] Stopping stream: {rtsp_url}")
        # Stop face recognition processing (delegate to AI module)
        ai_processing_module.stop_stream(rtsp_url)
        
        # Update AI status for all clients
        socketio.emit('ai_status_update', {'active': False})
        del active_streams[rtsp_url]
        print(f"[APPLICATION] Stream stopped: {rtsp_url}")

# API routes for AI control
@app.route('/api/ai/start', methods=['POST'])
def start_ai_processing():
    """Start AI processing module"""
    try:
        if ai_processing_module.start_processing():
            return jsonify({'status': 'success', 'message': 'AI processing started'})
        else:
            return jsonify({'status': 'error', 'message': 'Failed to start AI processing'}), 500
    except Exception as e:
        print(f"[APPLICATION] Error starting AI processing: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/ai/stop', methods=['POST'])
def stop_ai_processing():
    """Stop AI processing module"""
    try:
        if ai_processing_module.stop_processing():
            return jsonify({'status': 'success', 'message': 'AI processing stopped'})
        else:
            return jsonify({'status': 'error', 'message': 'Failed to stop AI processing'}), 500
    except Exception as e:
        print(f"[APPLICATION] Error stopping AI processing: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/ai/status', methods=['GET'])
def get_ai_status():
    """Get AI processing status"""
    try:
        status = {
            'active': ai_processing_module.is_running,
            'active_streams': list(ai_processing_module.active_streams.keys())
        }
        return jsonify(status)
    except Exception as e:
        print(f"[APPLICATION] Error getting AI status: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

# WebSocket events for dashboard
@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    print('[APPLICATION] Dashboard client connected')
    emit('connection_status', {'status': 'connected'})

@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    print('[APPLICATION] Dashboard client disconnected')

@socketio.on('ai_status_update', namespace='/camera')
def handle_ai_status_update(data):
    """Handle AI status updates and broadcast to all clients"""
    print(f"[APPLICATION] AI status update received: {data}")
    # Broadcast to all connected clients
    socketio.emit('ai_status_update', data)
    print(f"[APPLICATION] AI status update broadcasted to clients")

@socketio.on('request_employee_status')
def handle_employee_status_request():
    """Handle request for employee status"""
    try:
        session = get_db_session()
        
        # Get all employee statuses
        status_records = db_manager.get_employee_statuses()
        
        status_updates = []
        for record in status_records:
            status_update = {
                'employeeId': record.employee_name.lower().replace(' ', '_'),
                'employeeName': record.employee_name,
                'status': record.status,
                'lastSeen': format_last_seen(record.last_seen) if record.last_seen else 'Never',
                'cameraId': record.current_camera,
                'location': record.current_camera or 'Unknown'
            }
            status_updates.append(status_update)
        
        session.close()
        emit('employee_status_update', status_updates)
        
    except Exception as e:
        print(f"[APPLICATION] Error handling employee status request: {e}")

def start_application():
    """Start the main application"""
    try:
        # Start background thread for status updates
        status_thread = threading.Thread(target=update_employee_status_in_background)
        status_thread.daemon = True
        status_thread.start()
        
        # Start AI processing module
        if not ai_processing_module.start_processing():
            print("[APPLICATION] Warning: Failed to start AI processing module")
        
        # Run the Flask app
        socketio.run(app,
                 host="127.0.0.1",
                 port=8000,
                 debug=True,
                 use_reloader=False,
                 allow_unsafe_werkzeug=True)
    except Exception as e:
        print(f"[APPLICATION] Error starting application: {e}")

if __name__ == '__main__':
    # Start the main application
    start_application()