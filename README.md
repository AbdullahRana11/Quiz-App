# Quiz Application (React + FastAPI + MySQL)

This project is a web-based Quiz Application with a **React** frontend, **FastAPI** backend, and **MySQL** database.

## Prerequisites

Ensure you have the following installed on your system:
- **VS Code** (Visual Studio Code)
- **Python** (3.8 or higher)
- **Node.js** (LTS version)
- **MySQL Server** and **MySQL Workbench**

## 1. Database Setup

1.  Open **MySQL Workbench**.
2.  Connect to your local MySQL server.
3.  Create a new database named `QuizSystem`:
    ```sql
    CREATE DATABASE QuizSystem;
    ```
4.  Run your SQL schema script to create the necessary tables (`Student`, `Instructor`, `Admin`, `Subject`, `Question`, `Quiz_Attempt`, etc.) and insert initial data.

## 2. Backend Setup (Python/FastAPI)

1.  Open the project folder in **VS Code**.
2.  Open a **New Terminal** (`Ctrl + \``).
3.  Navigate to the `backend` directory:
    ```bash
    cd backend
    ```
4.  Install the required Python packages:
    ```bash
    pip install fastapi uvicorn mysql-connector-python pydantic
    ```
5.  **Configure Database Connection**:
    - Open `backend/database.py`.
    - Update the `DB_CONFIG` dictionary with your MySQL credentials:
      ```python
      DB_CONFIG = {
          'host': 'localhost',
          'user': 'your_mysql_username',  # e.g., 'root'
          'password': 'your_mysql_password',
          'database': 'QuizSystem'
      }
      ```
6.  Start the Backend Server:
    ```bash
    uvicorn main:app --reload
    ```
    - The backend will run at `http://localhost:8000`.

## 3. Frontend Setup (React)

1.  Open a **second** terminal in VS Code (click the `+` icon in the terminal panel).
2.  Navigate to the `frontend` directory:
    ```bash
    cd frontend
    ```
3.  Install the Node.js dependencies:
    ```bash
    npm install
    ```
4.  Start the Frontend Development Server:
    ```bash
    npm run dev
    ```
5.  The terminal will show a local URL (usually `http://localhost:5173`). Ctrl+Click it to open the app in your browser.

## 4. How to Use

- **Login Page**: You will see the login screen. Select your role (Student, Instructor, Admin).
- **Default Credentials** (if you used the provided schema):
    - **Admin**: ID: `111`, Password: `Admin@123`
    - **Instructor**: ID: `1`, Password: `Proff@123`
    - **Student**: ID: `1`, Password: `Student@123` (or register a new student).

## Troubleshooting

- **Database Connection Error**: Double-check your username and password in `backend/database.py`. Ensure MySQL Server is running.
- **CORS Error**: If the frontend cannot talk to the backend, ensure the backend is running on port 8000.
