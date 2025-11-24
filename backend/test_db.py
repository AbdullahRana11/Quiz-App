import mysql.connector
from database import DB_CONFIG

def test_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        if conn.is_connected():
            cursor = conn.cursor()
            
            # Check for students
            try:
                cursor.execute("SELECT * FROM Student")
                students = cursor.fetchall()
                print(f"\nStudents found: {len(students)}")
                for student in students:
                    print(student)
            except Exception as e:
                print(f"Error querying Student table: {e}")

            conn.close()
    except Exception as e:
        print(f"Connection failed with error: {e}")

if __name__ == "__main__":
    test_connection()
