from datetime import datetime, timezone


def hospital_schema(data):
    return {
        "hospital_name": data["hospital_name"],
        "email": data["email"],
        "phone": data["phone"],
        "address": data["address"],
        "city": data["city"],
        "state": data["state"],
        "pincode": data["pincode"],
        "subscription": data.get("subscription", "Free"),
        "status": "active",
        "revenue": 0,
        "created_at": datetime.now(timezone.utc)
    }