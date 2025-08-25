# Auto-Monitoring System: System Flow & Architecture

## 1. SYSTEM OVERVIEW FLOW

### Primary System Flow
```
[CCTV Cameras] → [Jetson Nano Processing] → [Face Recognition AI] → [Database Update] → [Dashboard Display] → [WhatsApp Notifications]
```

### Core Components Integration
- **Hardware Layer**: Multiple IP CCTV cameras connected to Jetson Nano
- **Processing Layer**: OpenCV + TensorFlow/PyTorch for face recognition
- **Data Layer**: Employee database with registered faces
- **Interface Layer**: Real-time dashboard with live feeds
- **Communication Layer**: WhatsApp API for automated notifications

---

## 2. DETAILED COMPONENT FLOWS

### 2.1 Header Section Flow
```
Real-Time DateTime Display
├── System Clock → NTP Sync → Display Update (1-second interval)
├── Notification Button → Alert Center → Unread Count Badge
└── Settings Button → Configuration Panel → System Parameters
```

**Function Flow:**
1. **Real-Time DateTime**: Continuously updates from system clock with NTP synchronization
2. **Notification Button**: Shows unread alert count, opens notification center on click
3. **Settings Button**: Access to camera configuration, employee management, notification settings

### 2.2 Live CCTV Feed Panel Flow
```
Camera Selection → Stream Acquisition → AI Processing → Display Output
```

**Detailed Process:**
1. **Camera Selection**: Active camera button highlighted (blue button "1")
2. **Stream Acquisition**: RTSP/HTTP stream from selected IP camera
3. **AI Processing Status**: Green indicator shows face recognition model is active
4. **Display Output**: Real-time video feed with bounding boxes around detected faces

**AI Inference Flow:**
```
Video Frame → Face Detection → Feature Extraction → Database Comparison → Employee Identification → Timestamp Recording
```

### 2.3 Employee Tracking Panel Flow
```
Database Query → Employee Status Evaluation → UI Status Update → Alert Generation (if needed)
```

**Status Logic:**
- **Available (Green)**: Employee detected within last 5 minutes
- **Off (Red)**: Employee not detected for >5 minutes during work hours
- **Time Display**: Shows duration since last detection

**Per Employee Flow:**
```
[Employee Name] → [Camera Location] → [Last Seen Timestamp] → [Status Color] → [Track Location Button]
```

### 2.4 CCTV Camera Switch Panel Flow
```
Camera Button Click → Stream Switch → AI Model Reset → New Feed Display → Database Location Update
```

---

## 3. SYSTEM ARCHITECTURE DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    JETSON NANO DEVICE                       │
│  ┌─────────────────────────────────────────────────────────┤
│  │                  APPLICATION LAYER                      │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  │  Dashboard  │  │ WhatsApp API│  │ Report Gen. │     │
│  │  │   Web UI    │  │ Integration │  │   Module    │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │
│  │─────────────────────────────────────────────────────────│
│  │                 PROCESSING LAYER                        │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  │Face Recog.  │  │ Time Track  │  │Alert System│     │
│  │  │ AI Engine   │  │   Module    │  │   Module    │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │
│  │─────────────────────────────────────────────────────────│
│  │                   DATA LAYER                            │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  │ Employee DB │  │Attendance DB│  │ Config DB   │     │
│  │  │(Face Data)  │  │  (Logs)     │  │(Settings)   │     │
│  │  └─────────────┘  └─────────────┘  └─────────────┘     │
│  └─────────────────────────────────────────────────────────│
│─────────────────────────────────────────────────────────────│
│                    HARDWARE LAYER                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐         │
│  │  Camera 1   │  │  Camera 2   │  │   ...       │         │
│  │ (Area A)    │  │ (Area B)    │  │ Camera 5    │         │
│  └─────────────┘  └─────────────┘  └─────────────┘         │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. ATTENDANCE MONITORING FLOW

### 4.1 Employee Detection Process
```
1. Camera Feed Input
   ↓
2. Frame Processing (OpenCV)
   ↓
3. Face Recognition (InsightFace)
   ↓
4. Database Comparison
   ↓
5. Employee Identification
   ↓
6. Timestamp & Location Logging
   ↓
7. Status Update in Dashboard
```

### 4.2 Alert Generation Flow
```
Employee Status Check (every 30 seconds)
├── Present in Area → Update "Available" status
├── Absent 5+ minutes → Generate Alert
│   ├── Check if Lunch Break (12:00-13:00)
│   ├── Check if Prayer Time (configurable)
│   └── If working hours → Send WhatsApp Alert
└── Long Absence (45+ minutes) → Escalate to HR
```

---

## 5. WHATSAPP INTEGRATION FLOW

### 5.1 Notification Hierarchy
```
Level 1: Direct Supervisor (5-15 minutes absence)
Level 2: Department Head (15-30 minutes absence)  
Level 3: HR Manager (30+ minutes absence)
```

### 5.2 Message Flow
```
Alert Trigger → Message Template Selection → Contact Lookup → WhatsApp API Call → Delivery Confirmation → Log Entry
```

**Sample Alert Messages:**
- **5-min Alert**: "Employee [Name] has been away from [Area] for 5 minutes. Current time: [Time]"
- **Extended Alert**: "Employee [Name] absent from [Area] for 45 minutes. Please check. Time: [Time]"

---

## 6. TECHNICAL IMPLEMENTATION FLOW

### 6.1 Jetson Nano Setup Flow
```
1. Install JetPack SDK
   ↓
2. Configure OpenCV with CUDA
   ↓
3. Install Face Recognition Libraries
   ↓
4. Setup Database (SQLite/PostgreSQL)
   ↓
5. Configure Network Connections
   ↓
6. Deploy Web Dashboard
   ↓
7. Setup WhatsApp Business API
```

### 6.2 Face Recognition Pipeline
```
Training Phase:
Employee Photos → Face Alignment → Feature Extraction → Database Storage

Recognition Phase:
Live Frame → Face Detection → Feature Extraction → Similarity Comparison → Identity Assignment
```

### 6.3 Time Tracking Logic
```
Detection Event → Timestamp Recording → Status Calculation → Alert Evaluation → Database Update
```

**Status Calculation Rules:**
- Available: Last seen ≤ 5 minutes ago
- Warning: Last seen 5-15 minutes ago (supervisor alert)
- Absent: Last seen >15 minutes ago (escalated alert)

---

## 7. DATABASE SCHEMA FLOW

### 7.1 Core Tables Structure
```
employees_table:
├── employee_id (PK)
├── name
├── department
├── supervisor_contact
└── face_encoding

attendance_logs:
├── log_id (PK)
├── employee_id (FK)
├── camera_location
├── timestamp
└── detection_confidence

alerts_table:
├── alert_id (PK)
├── employee_id (FK)
├── alert_type
├── sent_time
└── recipient_contact
```

---

## 8. DASHBOARD INTERACTION FLOW

### 8.1 User Interface Actions
```
Camera Switch: Button Click → Stream Change → UI Update
Track Employee: Button Click → Camera Navigation → Focus View
Status Monitoring: Auto-refresh (5-second interval) → Status Color Update
Alert Management: Alert Generation → UI Notification → WhatsApp Send
```

### 8.2 Real-time Updates
```
WebSocket Connection → Live Data Stream → JSON Processing → DOM Update → Visual Refresh
```

This comprehensive flow documentation provides the foundation for implementing your auto-monitoring system on Jetson Nano with full CCTV integration and WhatsApp reporting capabilities.