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
        "consultation_fee": data["consultation_fee"],
        "experience": data["experience"],
        "rating": 5,
        "available_slots": data["available_slots"],
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
            "consultation_fee": doctor["consultation_fee"],
            "experience": doctor["experience"],
            "rating": doctor["rating"],
            "available_slots": doctor["available_slots"],
            "hospital_id": doctor["hospital_id"],
            "status": doctor["status"],
            "created_at": doctor["created_at"]
        })

    return {
        "success": True,
        "count": len(doctor_list),
        "data": doctor_list
    }, 200

def get_doctor_by_id(doctor_id, hospital_id):

    users = db["users"]

    try:

        doctor = users.find_one({
            "_id": ObjectId(doctor_id),
            "role": "doctor",
            "hospital_id": hospital_id,
            "status": "active"
        })

        if not doctor:
            return {
                "success": False,
                "message": "Doctor not found."
            }, 404

        return {
            "success": True,
            "data": {
                "_id": str(doctor["_id"]),
                "name": doctor["name"],
                "email": doctor["email"],
                "department": doctor["department"],
                "designation": doctor["designation"],
                "consultation_fee": doctor["consultation_fee"],
                "experience": doctor["experience"],
                "rating": doctor["rating"],
                "available_slots": doctor["available_slots"],
                "hospital_id": doctor["hospital_id"],
                "status": doctor["status"],
                "created_at": doctor["created_at"]
            }
        }, 200

    except Exception:
        return {
            "success": False,
            "message": "Invalid Doctor ID."
        }, 400

def update_doctor(doctor_id, hospital_id, data):

    users = db["users"]

    try:

        doctor = users.find_one({
            "_id": ObjectId(doctor_id),
            "role": "doctor",
            "hospital_id": hospital_id
        })

        if not doctor:
            return {
                "success": False,
                "message": "Doctor not found."
            }, 404

        allowed_fields = [
            "name",
            "email",
            "department",
            "designation",
            "consultation_fee",
            "experience",
            "available_slots",
            "status"
        ]

        update_data = {}

        for field in allowed_fields:
            if field in data:
                update_data[field] = data[field]

        if not update_data:
            return {
                "success": False,
                "message": "No fields provided for update."
            }, 400

        # Check duplicate email
        if "email" in update_data:

            existing = users.find_one({
                "email": update_data["email"],
                "_id": {"$ne": ObjectId(doctor_id)}
            })

            if existing:
                return {
                    "success": False,
                    "message": "Email already exists."
                }, 400

        users.update_one(
            {
                "_id": ObjectId(doctor_id)
            },
            {
                "$set": update_data
            }
        )

        return {
            "success": True,
            "message": "Doctor updated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Doctor ID."
        }, 400

def deactivate_doctor(doctor_id, hospital_id):

    users = db["users"]

    try:

        doctor = users.find_one({
            "_id": ObjectId(doctor_id),
            "role": "doctor",
            "hospital_id": hospital_id
        })

        if not doctor:
            return {
                "success": False,
                "message": "Doctor not found."
            }, 404

        users.update_one(
            {
                "_id": ObjectId(doctor_id)
            },
            {
                "$set": {
                    "status": "inactive"
                }
            }
        )

        return {
            "success": True,
            "message": "Doctor deactivated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Doctor ID."
        }, 400