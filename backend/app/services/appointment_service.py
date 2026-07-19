from datetime import datetime, timezone

from bson import ObjectId

from app.database import db

appointments = db["appointments"]
patients = db["patients"]
doctors = db["users"]

def book_appointment(data):

    patient = patients.find_one({
        "_id": ObjectId(data["patient_id"])
    })

    if not patient:
        return {
            "success": False,
            "message": "Patient not found."
        }, 404

    doctor = doctors.find_one({
        "_id": ObjectId(data["doctor_id"]),
        "role": "doctor",
        "status": "active"
    })

    if not doctor:
        return {
            "success": False,
            "message": "Doctor not found."
        }, 404

    appointment = {

        "patient_id": ObjectId(data["patient_id"]),

        "hospital_id": doctor["hospital_id"],

        "doctor_id": ObjectId(data["doctor_id"]),

        "appointment_date": data["appointment_date"],

        "appointment_time": data["appointment_time"],

        "appointment_status": "Booked",

        "payment_status": "Pending",

        "consultation_fee": data["consultation_fee"],

        "platform_fee": data["platform_fee"],

        "gst": data["gst"],

        "total_amount": data["total_amount"],

        "created_at": datetime.now(timezone.utc)
    }

    result = appointments.insert_one(appointment)

    return {
        "success": True,
        "message": "Appointment booked successfully.",
        "appointment_id": str(result.inserted_id)
    }, 201