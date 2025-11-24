from fastapi import APIRouter, HTTPException
from database import get_db_connection
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()

class Subject(BaseModel):
    id: int
    name: str

class Question(BaseModel):
    id: int
    text: str
    options: List[str]
    # Correct option is not sent to frontend for security

class QuizSubmission(BaseModel):
    student_id: int
    subject_id: int
    answers: List[dict] # [{"question_id": 1, "answer": "A"}, ...]

class QuizResult(BaseModel):
    score: int
    total: int

class Grade(BaseModel):
    subject: str
    score: int
    grade: str
    date: str

@router.get("/subjects", response_model=List[Subject])
def get_subjects():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("SELECT SubjectID, SubjectName FROM Subject")
    subjects = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return subjects

@router.get("/quiz/{subject_id}", response_model=List[Question])
def get_quiz(subject_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    # Get 5 random questions
    cursor.execute("SELECT QuestionID, QuestionText, OptionA, OptionB, OptionC, OptionD FROM Question WHERE SubjectID = %s ORDER BY RAND() LIMIT 5", (subject_id,))
    questions = []
    for row in cursor.fetchall():
        questions.append({
            "id": row[0],
            "text": row[1],
            "options": [row[2], row[3], row[4], row[5]]
        })
    cursor.close()
    conn.close()
    if len(questions) < 5:
        raise HTTPException(status_code=400, detail="Not enough questions in database")
    return questions

@router.post("/quiz/submit", response_model=QuizResult)
def submit_quiz(submission: QuizSubmission):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    
    score = 0
    # Calculate score
    for ans in submission.answers:
        cursor.execute("SELECT CorrectOption FROM Question WHERE QuestionID = %s", (ans['question_id'],))
        result = cursor.fetchone()
        if result and result[0] == ans['answer']:
            score += 20 # 5 questions * 20 = 100
            
    # Save attempt
    try:
        cursor.execute("INSERT INTO QuizAttempt (StudentID, SubjectID, Score) VALUES (%s, %s, %s)", 
                       (submission.student_id, submission.subject_id, score))
        attempt_id = cursor.lastrowid
        
        # Save question attempts
        for ans in submission.answers:
            cursor.execute("INSERT INTO QuestionAttempt (AttemptID, QuestionID, StudentAnswer) VALUES (%s, %s, %s)", 
                           (attempt_id, ans['question_id'], ans['answer']))
        
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to save quiz attempt: {str(e)}")
        
    cursor.close()
    conn.close()
    return QuizResult(score=score, total=100)

@router.get("/results/{student_id}", response_model=List[Grade])
def get_results(student_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT s.SubjectName, qa.Score, qa.AttemptTimestamp 
        FROM QuizAttempt qa 
        JOIN Subject s ON qa.SubjectID = s.SubjectID 
        WHERE qa.StudentID = %s
        ORDER BY qa.AttemptTimestamp DESC
    """, (student_id,))
    
    results = []
    for row in cursor.fetchall():
        score = row[1]
        grade = 'A' if score >= 90 else 'B' if score >= 70 else 'C' if score >= 50 else 'D' if score >= 30 else 'F'
        results.append({
            "subject": row[0],
            "score": score,
            "grade": grade,
            "date": row[2].strftime("%Y-%m-%d %H:%M:%S")
        })
        
    cursor.close()
    conn.close()
    return results
