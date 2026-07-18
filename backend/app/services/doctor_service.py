from datetime import datetime, timezone
from bson import ObjectId

from app.database import db
from app.utils.password import hash_password


def create_doctor(data, hospital_id):

    users = db["users"]

    # Check if email already exists
    existing = users.find_one({"email": data["email"]})

    if existing:
        return {
            "success": False,
            "message": "Email already exists."
        }, 400

    doctor = {
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "role": "doctor",
        "hospital_id": hospital_id,
        "department": data["department"],
        "designation": data["designation"],
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    result = users.insert_one(doctor)

    return {
        "success": True,
        "message": "Doctor created successfully.",
        "doctor_id": str(result.inserted_id)
    }, 201

def get_all_doctors(hospital_id):

    users = db["users"]

    doctors = users.find({
        "role": "doctor",
        "hospital_id": hospital_id,
        "status": "active"
    })

    doctor_list = []

    for doctor in doctors:

        doctor_list.append({
            "_id": str(doctor["_id"]),
            "name": doctor["name"],
            "email": doctor["email"],
            "department": doctor["department"],
            "designation": doctor["designation"],
            "hospital_id": doctor["hospital_id"],
            "status": doctor["status"],
            "created_at": doctor["created_at"]
        })

    return {
        "success": True,
        "count": len(doctor_list),
        "data": doctor_list
    }, 200