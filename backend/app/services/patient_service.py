from app.database import db
from datetime import datetime, timezone
from app.utils.password import hash_password
from app.utils.password import verify_password
from app.utils.jwt import generate_token
from app.services.appointment_service import book_appointment
from bson import ObjectId
from app.database import db

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
    
    patient["_id"] = result.inserted_id
    
    return {
    "success": True,
    "message": "Patient registered successfully.",
    "patient_id": str(result.inserted_id),
    "patient": patient
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
            "_id": str(patient["_id"]),
            "name": patient["name"],
            "email": patient["email"],
            "phone": patient["phone"],
            "dob": patient["dob"],
            "gender": patient["gender"],
            "status": patient["status"],
            "role": "patient"
            }
    }, 200

def register_and_book(data):

    patients = db["patients"]

    patient = patients.find_one({
        "email": data["email"]
    })

    if patient is None:

        response, status = register_patient(data)

        if status != 201:
            return response, status

        patient = response["patient"]

    appointment_data = {

        "patient_id": str(patient["_id"]),

        "doctor_id": data["doctor_id"],

        "appointment_date": data["appointment_date"],

        "appointment_time": data["appointment_time"],

        "consultation_fee": data["consultation_fee"],

        "platform_fee": data["platform_fee"],

        "gst": data["gst"],

        "total_amount": data["total_amount"]
    }

    return book_appointment(appointment_data)

def get_hospital_doctors(hospital_id):

    doctors = db["users"].find({
        "role": "doctor",
        "status": "active",
        "hospital_id": hospital_id
    })

    doctor_list = []

    for doctor in doctors:

        doctor_list.append({
            "_id": str(doctor["_id"]),
            "name": doctor["name"],
            "department": doctor["department"],
            "designation": doctor["designation"],
            "consultation_fee": doctor.get("consultation_fee", 0),
            "rating": doctor.get("rating", 0),
            "available_slots": doctor.get("available_slots", [])
        })

    return {
        "success": True,
        "count": len(doctor_list),
        "data": doctor_list
    }, 200

def get_patient(patient_id):

    patients = db["patients"]

    patient = patients.find_one(
        {"_id": ObjectId(patient_id)},
        {"password": 0}
    )

    if not patient:
        return {
            "success": False,
            "message": "Patient not found."
        }, 404

    patient["_id"] = str(patient["_id"])

    return {
        "success": True,
        "data": patient
    }, 200

def get_patient_appointments(patient_id):

    appointments = db["appointments"]

    doctors = db["users"]

    hospitals = db["hospitals"]

    appointment_list = []

    results = appointments.find({
        "$or": [
            {"patient_id": ObjectId(patient_id)},
            {"patient_id": patient_id}
            ]
        })

    for appointment in results:

        doctor = doctors.find_one({
            "_id": ObjectId(appointment["doctor_id"])
        })

        hospital = hospitals.find_one({
            "_id": ObjectId(doctor["hospital_id"])
        })

        appointment_list.append({

    "_id": str(appointment["_id"]),

    "doctor_name": doctor["name"],

    "department": doctor["department"],

    "hospital_name": hospital["hospital_name"],

    "appointment_date": appointment["appointment_date"],

    "appointment_time": appointment["appointment_time"],

    "appointment_status": appointment["appointment_status"],

    "consultation_fee": appointment["consultation_fee"],

    "platform_fee": appointment["platform_fee"],

    "gst": appointment["gst"],

    "total_amount": appointment["total_amount"],

    "patientsAhead": appointment.get("patients_ahead"),

    "expectedWait": appointment.get("expected_wait")

})

    return {

        "success": True,

        "data": appointment_list

    },200