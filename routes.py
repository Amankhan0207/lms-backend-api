from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_db_connection
from auth import create_access_token
from datetime import timedelta

router = APIRouter()

class LoginRequest(BaseModel):
    email: str
    password: str

@router.get("/")
def home():
    return {"status": "Online", "message": "LMS Backend is running perfectly"}

@router.post("/api/login")
def login(login_data: LoginRequest):
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)
    try:
        query = "SELECT * FROM users WHERE email = %s"
        cursor.execute(query, (login_data.email,))
        user = cursor.fetchone()

        if not user:
            raise HTTPException(status_code=400, detail="Email wrong!")

        if login_data.password != user["password"]:
            raise HTTPException(status_code=400, detail="Password wrong!")

        token_expires = timedelta(minutes=60)
        access_token = create_access_token(
            data={"user_id": user["user_id"], "email": user["email"], "role": user["role"]},
            expires_delta=token_expires,
        )

        return {
            "status": "success",
            "token": access_token,
            "user": {
                "name": user["name"],
                "email": user["email"],
                "role": user["role"],
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()

@router.get("/api/dashboard-data")
def get_all_dashboard_data():
    conn = get_db_connection()
    if not conn:
        raise HTTPException(status_code=500, detail="Database connection failed")

    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT user_id, name, email, role FROM users")
        users = cursor.fetchall()

        cursor.execute("SELECT * FROM books")
        books = cursor.fetchall()

        transaction_query = """
            SELECT 
                t.transaction_id,
                u.name AS student_name,
                b.title AS book_title,
                t.issue_date,
                t.due_date,
                t.status
            FROM transactions t
            JOIN users u ON t.user_id = u.user_id
            JOIN books b ON t.book_id = b.book_id
        """
        cursor.execute(transaction_query)
        transactions = cursor.fetchall()

        return {
            "total_users_count": len(users),
            "total_books_count": len(books),
            "total_transactions_count": len(transactions),
            "users": users,
            "books": books,
            "transactions": transactions,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cursor.close()
        conn.close()
