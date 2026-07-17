from app.database import db
from app.utils.password import verify_password
from app.utils.jwt import generate_token


def login_user(email, password):
    """
    Authenticate a user and return JWT token.
    """

    user = db.users.find_one({"email": email})

    if not user:
        return {
            "success": False,
            "message": "Invalid email or password"
        }, 401

    if not verify_password(password, user["password"]):
        return {
            "success": False,
            "message": "Invalid email or password"
        }, 401

    token = generate_token(user)

    response = {
        "success": True,
        "message": "Login successful",
        "token": token,
        "user": {
            "id": str(user["_id"]),
            "name": user["name"],
            "email": user["email"],
            "role": user["role"],
            "hospital_id": user.get("hospital_id"),
            "status": user["status"]
        }
    }

    return response, 200