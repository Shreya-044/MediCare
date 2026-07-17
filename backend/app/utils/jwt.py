import jwt
from datetime import datetime, timedelta, timezone

from app.config import Config


def generate_token(user):
    """
    Generate JWT token for authenticated user.
    """

    payload = {
        "user_id": str(user["_id"]),
        "email": user["email"],
        "role": user["role"],
        "hospital_id": user.get("hospital_id"),
        "exp": datetime.now(timezone.utc) + timedelta(hours=Config.JWT_EXPIRE_HOURS)
    }

    token = jwt.encode(
        payload,
        Config.JWT_SECRET_KEY,
        algorithm="HS256"
    )

    return token


def verify_token(token):
    """
    Verify JWT token.
    """

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