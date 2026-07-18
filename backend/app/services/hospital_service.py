from app.database import db
from app.models.hospital import hospital_schema
from bson import ObjectId

def create_hospital(data):

    hospitals = db["hospitals"]

    # Check duplicate email
    if hospitals.find_one({"email": data["email"]}):
        return {
            "success": False,
            "message": "Hospital email already exists."
        }, 400

    hospital = hospital_schema(data)

    result = hospitals.insert_one(hospital)

    return {
        "success": True,
        "message": "Hospital created successfully.",
        "hospital_id": str(result.inserted_id)
    }, 201


def get_all_hospitals():
    hospitals = list(db["hospitals"].find())

    for hospital in hospitals:
        hospital["_id"] = str(hospital["_id"])

    return {
        "success": True,
        "count": len(hospitals),
        "data": hospitals
    }, 200

def get_hospital_by_id(hospital_id):

    hospitals = db["hospitals"]

    try:
        hospital = hospitals.find_one({"_id": ObjectId(hospital_id)})

        if not hospital:
            return {
                "success": False,
                "message": "Hospital not found."
            }, 404

        hospital["_id"] = str(hospital["_id"])

        return {
            "success": True,
            "data": hospital
        }, 200

    except Exception:
        return {
            "success": False,
            "message": "Invalid Hospital ID."
        }, 400


def update_hospital(hospital_id, data):

    hospitals = db["hospitals"]

    try:

        hospital = hospitals.find_one({"_id": ObjectId(hospital_id)})

        if not hospital:
            return {
                "success": False,
                "message": "Hospital not found."
            }, 404

        allowed_fields = [
            "hospital_name",
            "email",
            "phone",
            "address",
            "city",
            "state",
            "pincode",
            "subscription"
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

        hospitals.update_one(
            {"_id": ObjectId(hospital_id)},
            {
                "$set": update_data
            }
        )

        return {
            "success": True,
            "message": "Hospital updated successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Hospital ID."
        }, 400

def delete_hospital(hospital_id):

    hospitals = db["hospitals"]

    try:

        hospital = hospitals.find_one({
            "_id": ObjectId(hospital_id)
        })

        if not hospital:
            return {
                "success": False,
                "message": "Hospital not found."
            }, 404

        hospitals.update_one(
            {"_id": ObjectId(hospital_id)},
            {
                "$set": {
                    "status": "inactive"
                }
            }
        )

        return {
            "success": True,
            "message": "Hospital deleted successfully."
        }, 200

    except Exception:

        return {
            "success": False,
            "message": "Invalid Hospital ID."
        }, 400
