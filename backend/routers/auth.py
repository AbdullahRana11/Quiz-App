from fastapi import APIRouter, HTTPException
from database import get_db_connection
from models import LoginRequest, LoginResponse

router = APIRouter()

@router.post("/login/student", response_model=LoginResponse)
def login_student(request: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    cursor.execute("SELECT SName, SPassword FROM Student WHERE StudentID = %s", (request.id,))
    result = cursor.fetchone()
    
    if result:
        db_name, db_pass = result
        if request.password == db_pass:
            cursor.close()
            conn.close()
            return LoginResponse(id=request.id, name=db_name, role="student")
        else:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=401, detail="Invalid credentials")
    else:
        # Check if it's a new student registration attempt
        if request.password == "Student@123" and request.name:
            try:
                cursor.execute("INSERT INTO Student (StudentID, SName, SPassword) VALUES (%s, %s, %s)", 
                               (request.id, request.name, request.password))
                conn.commit()
                cursor.close()
                conn.close()
                return LoginResponse(id=request.id, name=request.name, role="student")
            except Exception as e:
                cursor.close()
                conn.close()
                raise HTTPException(status_code=400, detail=f"Registration failed: {str(e)}")
        else:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Student not found. Use default password 'Student@123' and provide name to register.")

@router.post("/login/instructor", response_model=LoginResponse)
def login_instructor(request: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    cursor.execute("SELECT InstructorID, IName, SubjectID FROM Instructor WHERE InstructorID = %s AND IPassword = %s", (request.id, request.password))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if result:
        return LoginResponse(id=result[0], name=result[1], role="instructor", subject_id=result[2])
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@router.post("/login/admin", response_model=LoginResponse)
def login_admin(request: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    
    cursor = conn.cursor()
    cursor.execute("SELECT AdminID, AName FROM Admin WHERE AdminID = %s AND APassword = %s", (request.id, request.password))
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    if result:
        return LoginResponse(id=result[0], name=result[1], role="admin")
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")
