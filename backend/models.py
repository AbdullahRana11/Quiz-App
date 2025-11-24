from pydantic import BaseModel
from typing import Optional

class LoginRequest(BaseModel):
    id: int
    password: str
    name: Optional[str] = None # For student registration during login if needed

class LoginResponse(BaseModel):
    id: int
    name: str
    role: str
    subject_id: Optional[int] = None
