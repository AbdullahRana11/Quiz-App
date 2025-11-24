import requests
import json

def test_login():
    url = "http://localhost:8000/api/auth/login/student"
    payload = {
        "id": 45,
        "password": "Student@123"
    }
    headers = {
        "Content-Type": "application/json"
    }

    try:
        print(f"Sending POST request to {url} with payload: {payload}")
        response = requests.post(url, json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        print(f"Response Body: {response.text}")
        
        if response.status_code == 200:
            print("Login Successful!")
        else:
            print("Login Failed!")

    except Exception as e:
        print(f"Request failed: {e}")

if __name__ == "__main__":
    test_login()
