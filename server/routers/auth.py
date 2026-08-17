from fastapi import APIRouter, Depends, HTTPException, status
import asyncpg
from database import get_db
from schemas import UserSignUp, UserLogin
from utils import get_password_hash, verify_password, create_access_token

router = APIRouter()

@router.post("/signup", status_code=status.HTTP_201_CREATED)
async def signup(user: UserSignUp, db_conn: asyncpg.Connection = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    try:
        await db_conn.execute(
            'INSERT INTO users(full_name, email, password, role) VALUES ($1, $2, $3, $4)',
            user.full_name, user.email, hashed_password, 'USER'
        )
        return {"message": "User created successfully"}
    except asyncpg.exceptions.UniqueViolationError:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already exists")
    except Exception as e:
        print(f"Signup error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")

@router.post("/login", status_code=status.HTTP_200_OK)
async def login(user: UserLogin, db_conn: asyncpg.Connection = Depends(get_db)):
    try:
        record = await db_conn.fetchrow('SELECT * FROM users WHERE email = $1', user.email)
        if not record:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        user_dict = dict(record)
        if not verify_password(user.password, user_dict["password"]):
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
        
        payload = {
            "id": str(user_dict["id"]),
            "role": user_dict["role"],
            "email": user_dict["email"],
            "name": user_dict["full_name"]
        }
        token = create_access_token(payload)

        return {
            "message": "Logged in successfully",
            "token": token,
            "user": payload
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Login error: {e}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal server error")
