from app.database import db
from datetime import datetime, timezone
from app.utils.password import hash_password
from app.utils.password import verify_password
from app.utils.jwt import generate_token

def search_hospitals(query):

    hospitals = db["hospitals"]

    result = hospitals.find({
    "$or": [
        {
            "hospital_name": {
                "$regex": query,
                "$options": "i"
            }
        },
        {
            "city": {
                "$regex": query,
                "$options": "i"
            }
        }
    ],
    "status": "active"
})
    hospital_list = []

    for hospital in result:

        hospital_list.append({

            "_id": str(hospital["_id"]),

            "hospital_name": hospital["hospital_name"],

            "city": hospital["city"],

            "state": hospital["state"],

            "address": hospital["address"],

            "phone": hospital["phone"],

            "email": hospital["email"]

        })

    return {

        "success": True,

        "count": len(hospital_list),

        "data": hospital_list

    }, 200

def register_patient(data):

    patients = db["patients"]

    # Check email already exists
    existing_email = patients.find_one({
        "email": data["email"]
    })

    if existing_email:
        return {
            "success": False,
            "message": "Email already registered."
        }, 400

    # Check phone already exists
    existing_phone = patients.find_one({
        "phone": data["phone"]
    })

    if existing_phone:
        return {
            "success": False,
            "message": "Phone number already registered."
        }, 400

    patient = {
        "name": data["name"],
        "email": data["email"],
        "phone": data["phone"],
        "password": hash_password(data["password"]),
        "dob": data["dob"],
        "gender": data["gender"],
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    result = patients.insert_one(patient)

    return {
        "success": True,
        "message": "Patient registered successfully.",
        "patient_id": str(result.inserted_id)
    }, 201

def login_patient(email, password):

    patients = db["patients"]

    patient = patients.find_one({
        "email": email
    })

    if not patient:
        return {
            "success": False,
            "message": "Invalid email or password."
        }, 401

    if patient["status"] != "active":
        return {
            "success": False,
            "message": "Your account is inactive."
        }, 403

    if not verify_password(password, patient["password"]):
        return {
            "success": False,
            "message": "Invalid email or password."
        }, 401

    token = generate_token({
        "patient_id": str(patient["_id"]),
        "email": patient["email"],
        "role": "patient"
    })

    return {
        "success": True,
        "message": "Login successful",
        "token": token,
        "patient": {
            "id": str(patient["_id"]),
            "name": patient["name"],
            "email": patient["email"],
            "phone": patient["phone"],
            "status": patient["status"]
        }
    }, 200