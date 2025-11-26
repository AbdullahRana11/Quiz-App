# Deployment Guide

To make your application accessible from other devices and ensure the database is available even when your laptop is turned off, you must **deploy** all three parts of your application (Database, Backend, Frontend) to a cloud server.

**Crucial Concept**: A database on your laptop cannot be accessed if the laptop is shut down or sleeping. It must live on a server that is "always on."

## Recommended Free/Cheap Tech Stack

For a student project like this, we recommend the following services which often have free tiers:

1.  **Database (MySQL)**: [Railway](https://railway.app/) or [Aiven](https://aiven.io/mysql).
2.  **Backend (FastAPI)**: [Railway](https://railway.app/) or [Render](https://render.com/).
3.  **Frontend (React)**: [Vercel](https://vercel.com/) or [Netlify](https://netlify.com/).

---

## Step 1: Deploy the Database (MySQL)

1.  Sign up for **Railway** (or Aiven).
2.  Create a new **MySQL** service.
3.  Once created, Railway will provide you with **Connection Variables**:
    -   `MYSQLHOST`
    -   `MYSQLUSER`
    -   `MYSQLPASSWORD`
    -   `MYSQLPORT`
    -   `MYSQLDATABASE`
4.  **Import your Data**: Use a tool like MySQL Workbench to connect to this *remote* database using the credentials above. Run your SQL schema script to create the tables in the cloud database.

## Step 2: Deploy the Backend (FastAPI)

1.  **Prepare your Code**:
    -   Ensure you have a `requirements.txt` file in your `backend` folder. Run `pip freeze > requirements.txt` to generate it.
    -   **Update `database.py`**: Instead of hardcoding credentials, use Environment Variables.
        ```python
        import os
        
        DB_CONFIG = {
            'host': os.getenv('MYSQLHOST', 'localhost'),
            'user': os.getenv('MYSQLUSER', 'root'),
            'password': os.getenv('MYSQLPASSWORD', 'your_local_password'),
            'database': os.getenv('MYSQLDATABASE', 'QuizSystem'),
            'port': int(os.getenv('MYSQLPORT', 3306))
        }
        ```
2.  **Push to GitHub**: Upload your project to a GitHub repository.
3.  **Deploy on Railway/Render**:
    -   Connect your GitHub repo.
    -   Set the **Root Directory** to `backend`.
    -   Set the **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
    -   **Environment Variables**: Add the MySQL variables from Step 1 into the deployment settings.
4.  Once deployed, you will get a **Backend URL** (e.g., `https://my-api.up.railway.app`).

## Step 3: Deploy the Frontend (React)

1.  **Update API Calls**:
    -   In your React code, you are currently calling `http://localhost:8000`.
    -   You need to change this to your new **Backend URL** from Step 2.
    -   *Best Practice*: Use an environment variable like `import.meta.env.VITE_API_URL` and create a `.env` file for local dev and set the variable in Vercel for production.
2.  **Deploy on Vercel**:
    -   Connect your GitHub repo.
    -   Set the **Root Directory** to `frontend`.
    -   Vercel usually auto-detects Vite settings.
    -   Deploy.
3.  You will get a **Frontend URL** (e.g., `https://my-quiz-app.vercel.app`).

## Summary of Flow

1.  **User** opens `https://my-quiz-app.vercel.app` (Frontend).
2.  **Frontend** sends requests to `https://my-api.up.railway.app` (Backend).
3.  **Backend** queries the **Railway MySQL Database**.

All of these live in the cloud, so they work 24/7 regardless of your laptop's status.
