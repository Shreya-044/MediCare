from datetime import datetime, timezone

from bson import ObjectId

from app.database import db
from app.utils.password import hash_password


def create_admin(data):

    users = db["users"]
    hospitals = db["hospitals"]

    # Check if hospital exists
    hospital = hospitals.find_one({
        "_id": ObjectId(data["hospital_id"]),
        "status": "active"
    })

    if not hospital:
        return {
            "success": False,
            "message": "Hospital not found or inactive."
        }, 404

    # Check duplicate email
    existing = users.find_one({"email": data["email"]})

    if existing:
        return {
            "success": False,
            "message": "Email already exists."
        }, 400

    admin = {
        "name": data["name"],
        "email": data["email"],
        "password": hash_password(data["password"]),
        "role": "admin",
        "hospital_id": data["hospital_id"],
        "department": None,
        "designation": None,
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    result = users.insert_one(admin)

    return {
        "success": True,
        "message": "Hospital Admin created successfully.",
        "admin_id": str(result.inserted_id)
    }, 201

def get_all_admins():

    users = db["users"]

    admins = list(users.find(
        {"role": "admin"},
        {
            "name": 1,
            "email": 1,
            "role": 1,
            "hospital_id": 1,
            "status": 1,
            "created_at": 1
        }
    ))

    for admin in admins:
        admin["_id"] = str(admin["_id"])

    return {
        "success": True,
        "count": len(admins),
        "data": admins
    }, 200

def get_admin_by_id(admin_id):

    users = db["users"]

    try:
        admin = users.find_one(
            {
                "_id": ObjectId(admin_id),
                "role": "admin"
            },
            {
                "password": 0
            }
        )

        if not admin:
            return {
                "success": False,
                "message": "Admin not found."
            }, 404

        admin["_id"] = str(admin["_id"])

        return {
            "success": True,
            "data": admin
        }, 200

    except Exception:
        return {
            "success": False,
            "message": "Invalid Admin ID."
        }, 400
    
def update_admin(admin_id, data):

    users = db["users"]

    try:

        admin = users.find_one({
            "_id": ObjectId(admin_id),
            "role": "admin"
        })

        if not admin:
            return {
                "success": False,
                "message": "Admin not found."
            }, 404

        allowed_fields = [
            "name",
            "email",
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
                "_id": {"$ne": ObjectId(admin_id)}
            })

            if existing:
                return {
                    "success": False,
                    "message": "Email already exists."
                }, 400

        users.update_one(
            {
                "_id": ObjectId(admin_id)
            },
            {
                "$set": update_data
            }
        )

        return {
            "success": True,
            "message": "Admin updated successfully."
        }, 200

    except Exception:
        return {
            "success": False,
            "message": "Invalid Admin ID."
        }, 400
    
def delete_admin(admin_id):

    users = db["users"]

    try:

        admin = users.find_one({
            "_id": ObjectId(admin_id),
            "role": "admin"
        })

        if not admin:
            return {
                "success": False,
                "message": "Admin not found."
            }, 404

        users.update_one(
            {
                "_id": ObjectId(admin_id)
            },
            {
                "$set": {
                    "status": "inactive"
                }
            }
        )

        return {
            "success": True,
            "message": "Admin deactivated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Admin ID."
        }, 400