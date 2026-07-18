from datetime import datetime, timezone

from app.database import db
from app.utils.password import hash_password
from bson import ObjectId

def create_staff(data, hospital_id):

    users = db["users"]

    # Check if email already exists
    existing = users.find_one({
        "email": data["email"]
    })

    if existing:
        return {
            "success": False,
            "message": "Email already exists."
        }, 400

    # Check maximum 2 active staff members
    staff_count = users.count_documents({
        "role": "staff",
        "hospital_id": hospital_id,
        "status": "active"
    })

    if staff_count >= 2:
        return {
            "success": False,
            "message": "Only 2 staff members are allowed per hospital."
        }, 400

    staff = {
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "role": "staff",
        "hospital_id": hospital_id,
        "designation": data["designation"],
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    result = users.insert_one(staff)

    return {
        "success": True,
        "message": "Staff created successfully.",
        "staff_id": str(result.inserted_id)
    }, 201

def get_all_staff(hospital_id):

    users = db["users"]

    staff = users.find({
        "role": "staff",
        "hospital_id": hospital_id,
        "status": "active"
    })

    staff_list = []

    for member in staff:

        staff_list.append({
            "_id": str(member["_id"]),
            "name": member["name"],
            "email": member["email"],
            "designation": member["designation"],
            "hospital_id": member["hospital_id"],
            "status": member["status"],
            "created_at": member["created_at"]
        })

    return {
        "success": True,
        "count": len(staff_list),
        "data": staff_list
    }, 200

def get_staff_by_id(staff_id, hospital_id):

    users = db["users"]

    try:

        staff = users.find_one({
            "_id": ObjectId(staff_id),
            "role": "staff",
            "hospital_id": hospital_id,
            "status": "active"
        })

        if not staff:
            return {
                "success": False,
                "message": "Staff member not found."
            }, 404

        return {
            "success": True,
            "data": {
                "_id": str(staff["_id"]),
                "name": staff["name"],
                "email": staff["email"],
                "designation": staff["designation"],
                "hospital_id": staff["hospital_id"],
                "status": staff["status"],
                "created_at": staff["created_at"]
            }
        }, 200

    except Exception:
        return {
            "success": False,
            "message": "Invalid Staff ID."
        }, 400
    
def update_staff(staff_id, hospital_id, data):

    users = db["users"]

    try:

        staff = users.find_one({
            "_id": ObjectId(staff_id),
            "role": "staff",
            "hospital_id": hospital_id
        })

        if not staff:
            return {
                "success": False,
                "message": "Staff member not found."
            }, 404

        allowed_fields = [
            "name",
            "email",
            "designation",
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

        # Prevent duplicate email
        if "email" in update_data:

            existing = users.find_one({
                "email": update_data["email"],
                "_id": {"$ne": ObjectId(staff_id)}
            })

            if existing:
                return {
                    "success": False,
                    "message": "Email already exists."
                }, 400

        users.update_one(
            {
                "_id": ObjectId(staff_id)
            },
            {
                "$set": update_data
            }
        )

        return {
            "success": True,
            "message": "Staff updated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Staff ID."
        }, 400
    
def deactivate_staff(staff_id, hospital_id):

    users = db["users"]

    try:

        staff = users.find_one({
            "_id": ObjectId(staff_id),
            "role": "staff",
            "hospital_id": hospital_id
        })

        if not staff:
            return {
                "success": False,
                "message": "Staff member not found."
            }, 404

        users.update_one(
            {
                "_id": ObjectId(staff_id)
            },
            {
                "$set": {
                    "status": "inactive"
                }
            }
        )

        return {
            "success": True,
            "message": "Staff deactivated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Staff ID."
        }, 400
