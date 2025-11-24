from fastapi import APIRouter, HTTPException
from database import get_db_connection
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter()

class QuestionCreate(BaseModel):
    subject_id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str

class QuestionUpdate(BaseModel):
    id: int
    subject_id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str

class QuestionView(BaseModel):
    id: int
    text: str
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    correct_option: str
    difficulty: str

class StudentView(BaseModel):
    id: int
    name: str

class StudentGrade(BaseModel):
    student_name: str
    subject_name: str
    score: int
    grade: str

@router.get("/students/{subject_id}", response_model=List[StudentView])
def get_students(subject_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT DISTINCT st.StudentID, st.SName 
        FROM Student st 
        JOIN QuizAttempt qa ON st.StudentID = qa.StudentID 
        WHERE qa.SubjectID = %s
    """, (subject_id,))
    students = [{"id": row[0], "name": row[1]} for row in cursor.fetchall()]
    cursor.close()
    conn.close()
    return students

@router.get("/questions/{subject_id}", response_model=List[QuestionView])
def get_questions(subject_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("SELECT QuestionID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty FROM Question WHERE SubjectID = %s", (subject_id,))
    questions = []
    for row in cursor.fetchall():
        questions.append({
            "id": row[0],
            "text": row[1],
            "option_a": row[2],
            "option_b": row[3],
            "option_c": row[4],
            "option_d": row[5],
            "correct_option": row[6],
            "difficulty": row[7]
        })
    cursor.close()
    conn.close()
    return questions

@router.post("/question/add")
def add_question(question: QuestionCreate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            INSERT INTO Question (SubjectID, QuestionText, OptionA, OptionB, OptionC, OptionD, CorrectOption, Difficulty) 
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """, (question.subject_id, question.text, question.option_a, question.option_b, question.option_c, question.option_d, question.correct_option, question.difficulty))
        conn.commit()
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to add question: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Question added successfully"}

@router.put("/question/update")
def update_question(question: QuestionUpdate):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("""
            UPDATE Question SET QuestionText = %s, OptionA = %s, OptionB = %s, OptionC = %s, OptionD = %s, CorrectOption = %s, Difficulty = %s 
            WHERE QuestionID = %s AND SubjectID = %s
        """, (question.text, question.option_a, question.option_b, question.option_c, question.option_d, question.correct_option, question.difficulty, question.id, question.subject_id))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Question not found or not in your subject")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to update question: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Question updated successfully"}

@router.delete("/question/delete/{subject_id}/{question_id}")
def delete_question(subject_id: int, question_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM Question WHERE QuestionID = %s AND SubjectID = %s", (question_id, subject_id))
        conn.commit()
        if cursor.rowcount == 0:
            cursor.close()
            conn.close()
            raise HTTPException(status_code=404, detail="Question not found or not in your subject")
    except Exception as e:
        conn.rollback()
        cursor.close()
        conn.close()
        raise HTTPException(status_code=500, detail=f"Failed to delete question: {str(e)}")
    
    cursor.close()
    conn.close()
    return {"message": "Question deleted successfully"}

@router.get("/grades/{subject_id}", response_model=List[StudentGrade])
def get_subject_grades(subject_id: int):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")
    cursor = conn.cursor()
    cursor.execute("""
        SELECT st.SName, s.SubjectName, qa.Score 
        FROM QuizAttempt qa 
        JOIN Student st ON qa.StudentID = st.StudentID 
        JOIN Subject s ON qa.SubjectID = s.SubjectID
        WHERE qa.SubjectID = %s
    """, (subject_id,))
    
    results = []
    for row in cursor.fetchall():
        score = row[2]
        grade = 'A' if score >= 90 else 'B' if score >= 70 else 'C' if score >= 50 else 'D' if score >= 30 else 'F'
        results.append({
            "student_name": row[0],
            "subject_name": row[1],
            "score": score,
            "grade": grade
        })
        
    cursor.close()
    conn.close()
    return results
