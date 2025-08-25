#!/usr/bin/env python3
# db_manager.py
# Database manager for the face recognition system

import pickle
from datetime import datetime
from sqlalchemy import create_engine, and_, Column, Integer, String, DateTime, Boolean, Text, ForeignKey, LargeBinary
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base

# Setup database engine and session
engine = create_engine("sqlite:///attendance.db")
SessionLocal = sessionmaker(bind=engine)

# Define base for models
Base = declarative_base()

# Database models (from models.py)
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    embedding = Column(LargeBinary)  # simpan numpy array sebagai binary
    
    # Relationships
    status_record = relationship("EmployeeStatus", back_populates="employee", uselist=False)
    locations = relationship("EmployeeLocation", back_populates="employee")

class Attendance(Base):
    __tablename__ = "attendance"
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_name = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)

# Define database models (copied from database_extensions.py)
class EmployeeStatus(Base):
    __tablename__ = "employee_status"
    
    employee_name = Column(String, ForeignKey('employees.name'), primary_key=True)
    status = Column(String, default='off')  # 'available' or 'off'
    last_seen = Column(DateTime, default=datetime.utcnow)
    current_camera = Column(String, nullable=True)
    camera_history = Column(Text, nullable=True)  # JSON string of camera history
    
    # Relationship to Employee
    employee = relationship("Employee", back_populates="status_record")

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    rtsp_url = Column(String, nullable=True)
    status = Column(String, default='offline')  # 'online', 'offline', 'error'
    is_active = Column(Boolean, default=False)

class EmployeeLocation(Base):
    __tablename__ = "employee_locations"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    employee_name = Column(String, ForeignKey('employees.name'), nullable=False)
    camera_id = Column(String, ForeignKey('cameras.id'), nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    employee = relationship("Employee", back_populates="locations")
    camera = relationship("Camera")

# Add relationships to the Employee model
Employee.status_record = relationship("EmployeeStatus", back_populates="employee", uselist=False)
Employee.locations = relationship("EmployeeLocation", back_populates="employee")

class DatabaseManager:
    """Manager for all database operations"""
    
    @staticmethod
    def get_all_employees():
        """Get all employees from database"""
        try:
            session = SessionLocal()
            employees = session.query(Employee).all()
            data = [(emp.name, pickle.loads(emp.embedding)) for emp in employees]
            session.close()
            return data
        except Exception as e:
            print(f"[DB MANAGER] Error getting employees: {e}")
            return []
    
    @staticmethod
    def get_all_employees_with_id():
        """Get all employees with IDs from database"""
        try:
            session = SessionLocal()
            employees = session.query(Employee).all()
            data = [(emp.id, emp.name, pickle.loads(emp.embedding)) for emp in employees]
            session.close()
            return data
        except Exception as e:
            print(f"[DB MANAGER] Error getting employees with IDs: {e}")
            return []
    
    @staticmethod
    def log_attendance(employee_name):
        """Log employee attendance to database"""
        try:
            session = SessionLocal()
            record = Attendance(employee_name=employee_name)
            session.add(record)
            session.commit()
            session.close()
            print(f"[ATTENDANCE] {employee_name} hadir pada {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        except Exception as e:
            print(f"[DB MANAGER] Error logging attendance: {e}")
    
    @staticmethod
    def update_employee_status(employee_name, camera_id, status='available'):
        """Update employee status in database"""
        try:
            session = SessionLocal()
            
            # Check if status record exists
            status_record = session.query(EmployeeStatus).filter(
                EmployeeStatus.employee_name == employee_name
            ).first()
            
            if status_record:
                # Update existing record
                status_record.status = status
                status_record.last_seen = datetime.utcnow()
                status_record.current_camera = camera_id
            else:
                # Create new record
                status_record = EmployeeStatus(
                    employee_name=employee_name,
                    status=status,
                    last_seen=datetime.utcnow(),
                    current_camera=camera_id
                )
                session.add(status_record)
            
            session.commit()
            session.close()
        except Exception as e:
            print(f"[DB MANAGER] Error updating employee status: {e}")
    
    @staticmethod
    def mark_employee_off(employee_name):
        """Mark employee as off in database"""
        try:
            session = SessionLocal()
            
            # Check if status record exists
            status_record = session.query(EmployeeStatus).filter(
                EmployeeStatus.employee_name == employee_name
            ).first()
            
            if status_record:
                # Update existing record
                status_record.status = 'off'
                status_record.last_seen = datetime.utcnow()
            else:
                # Create new record
                status_record = EmployeeStatus(
                    employee_name=employee_name,
                    status='off',
                    last_seen=datetime.utcnow()
                )
                session.add(status_record)
            
            session.commit()
            session.close()
        except Exception as e:
            print(f"[DB MANAGER] Error marking employee off: {e}")
    
    @staticmethod
    def get_employee_statuses():
        """Get all employee statuses from database"""
        try:
            session = SessionLocal()
            status_records = session.query(EmployeeStatus).all()
            session.close()
            
            statuses = []
            for record in status_records:
                statuses.append({
                    'employee_name': record.employee_name,
                    'status': record.status,
                    'last_seen': record.last_seen,
                    'current_camera': record.current_camera
                })
            
            return statuses
        except Exception as e:
            print(f"[DB MANAGER] Error getting employee statuses: {e}")
            return []
    
    @staticmethod
    def log_employee_location(employee_name, camera_id):
        """Log employee location to database"""
        try:
            session = SessionLocal()
            location = EmployeeLocation(
                employee_name=employee_name,
                camera_id=camera_id
            )
            session.add(location)
            session.commit()
            session.close()
        except Exception as e:
            print(f"[DB MANAGER] Error logging employee location: {e}")

# Global instance
db_manager = DatabaseManager()