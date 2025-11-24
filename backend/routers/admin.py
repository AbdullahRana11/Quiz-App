from fastapi import APIRouter, HTTPException
from database import get_db_connection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class StudentCreate(BaseModel):
    id: int
    name: str
    password: Optional[str] = "Student@123"

class InstructorCreate(BaseModel):
    id: Optional[int] = None
    name: str
    subject_name: str
    password: Optional[str] = "Admin@123"

class PasswordUpdate(BaseModel):
    id: int
    new_password: str

class StudentView(BaseModel):
    id: int
    name: str

class InstructorView(BaseModel):
    id: int
    name: str
    subject: str

@router.get("/students", response_model=List[StudentView])
def get_all_students():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("SELECT StudentID, SName FROM Student ORDER BY StudentID")
    students = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return students

@router.post("/student/add")
def add_student(student: StudentCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("INSERT INTO Student (StudentID, SName, SPassword) VALUES (%s, %s, %s)", 
                       (student.id, student.name, student.password))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail=f"Failed to add student: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Student added successfully"}

@router.delete("/student/delete/{student_id}")
def delete_student(student_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Student WHERE StudentID = %s", (student_id,))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to delete student: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Student expelled successfully"}

@router.put("/student/password")
def update_student_password(data: PasswordUpdate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Student SET SPassword = %s WHERE StudentID = %s", (data.new_password, data.id))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to update password: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Password updated successfully"}

@router.get("/instructors", response_model=List[InstructorView])
def get_instructors():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT i.InstructorID, i.IName, s.SubjectName 
        FROM Instructor i 
        JOIN Subject s ON i.SubjectID = s.SubjectID
        ORDER BY i.InstructorID
    """)
    instructors = [{"id": row[0], "name": row[1], "subject": row[2]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return instructors

@router.post("/instructor/add")
def add_instructor(instructor: InstructorCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    
    # Get SubjectID
    cursor.execute("SELECT SubjectID FROM Subject WHERE SubjectName = %s", (instructor.subject_name,))
    result = cursor.fetchone()
    if not result:
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail="Invalid course")
    subject_id = result[0]
    
    try:
        if instructor.id:
            cursor.execute("INSERT INTO Instructor (InstructorID, IName, SubjectID, IPassword) VALUES (%s, %s, %s, %s)", 
                           (instructor.id, instructor.name, subject_id, instructor.password))
        else:
            cursor.execute("INSERT INTO Instructor (IName, SubjectID, IPassword) VALUES (%s, %s, %s)", 
                           (instructor.name, subject_id, instructor.password))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=400, detail=f"Failed to add instructor: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Instructor added successfully"}

@router.delete("/instructor/delete/{instructor_id}")
def delete_instructor(instructor_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Instructor WHERE InstructorID = %s", (instructor_id,))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Instructor not found")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to delete instructor: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Instructor removed successfully"}

@router.put("/instructor/password")
def update_instructor_password(data: PasswordUpdate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE Instructor SET IPassword = %s WHERE InstructorID = %s", (data.new_password, data.id))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Instructor not found")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to update password: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Password updated successfully"}
