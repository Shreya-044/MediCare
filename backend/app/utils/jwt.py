import jwt
from datetime import datetime, timedelta, timezone

from app.config import Config


def generate_token(data):
    """
    Generate JWT token for any authenticated user.
    """

    payload = {
        "email": data["email"],
        "role": data["role"],
        "exp": datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRE_HOURS)
    }

    # Employee login
    if "user_id" in data:
        payload["user_id"] = data["user_id"]
        payload["hospital_id"] = data.get("hospital_id")

    # Patient login
    elif "patient_id" in data:
        payload["patient_id"] = data["patient_id"]

    token = jwt.encode(
        payload,
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    return token


def verify_token(token):
    try:
        payload = jwt.decode(
            token,
            Config.JWT_SECRET_KEY,
            algorithms=["HS256"]
        )

        return payload

    except jwt.ExpiredSignatureError:
        return None

    except jwt.InvalidTokenError:
        return None