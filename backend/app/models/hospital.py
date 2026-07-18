from datetime import datetime, timezone


def hospital_schema(data):
    return {
        "hospital_name": data["hospital_name"],
        "email": data["email"],
        "phone": data["phone"],
        "emergency_phone": data["emergency_phone"],
        "address": data["address"],
        "city": data["city"],
        "state": data["state"],
        "pincode": data["pincode"],
        "status": "active",
        "revenue": 0,
        "created_at": datetime.now(timezone.utc)
    }