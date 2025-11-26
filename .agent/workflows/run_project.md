---
description: Run the full stack project (Backend + Frontend)
---

# Run Project

This workflow will start both the backend and frontend servers.

## 1. Start Backend Server

Open a new terminal and run:

```powershell
cd backend
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 2. Start Frontend Server

Open a **separate** terminal and run:

```powershell
cd frontend
npm run dev
```

## 3. Access the App

### From this Computer
- Frontend: [http://localhost:5173/](http://localhost:5173/) or [http://192.168.1.12:5173/](http://192.168.1.12:5173/)

### From Other Devices (Phone, Tablet)
- Ensure the device is connected to the **same Wi-Fi network**.
- Open the browser on your device and go to:
  **[http://192.168.1.12:5173/](http://192.168.1.12:5173/)**

> [!NOTE]
> If your computer's IP address changes, you will need to update `frontend/src/config.js` with the new IP.
