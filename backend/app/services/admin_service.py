from app.database import db
from bson import ObjectId

def get_dashboard_stats(hospital_id):

    users = db["users"]

    doctor_count = users.count_documents({
        "role": "doctor",
        "hospital_id": hospital_id,
        "status": "active"
    })

    staff_count = users.count_documents({
        "role": "staff",
        "hospital_id": hospital_id,
        "status": "active"
    })

    return {
        "success": True,
        "data": {
            "doctors": doctor_count,
            "staff": staff_count
        }
    }, 200

def get_hospital_patient_appointments(hospital_id, date=None, doctor_id=None):

    appointments = db["appointments"]
    patients = db["patients"]
    doctors = db["users"]

    query = {
        "hospital_id": hospital_id,
        "appointment_status": "Booked"
    }

    # Filter by date if provided
    if date:
        query["appointment_date"] = date

    # Filter by doctor if selected
    if doctor_id:
        query["doctor_id"] = ObjectId(doctor_id)

    result = appointments.find(query).sort("appointment_time", 1)

    appointment_list = []

    for appointment in result:

        patient = patients.find_one({
            "_id": appointment["patient_id"]
        })

        doctor = doctors.find_one({
            "_id": appointment["doctor_id"],
            "role": "doctor"
        })

        # Avoid crashes if patient/doctor no longer exists
        if not patient or not doctor:
            continue

        appointment_list.append({

            "_id": str(appointment["_id"]),

            # Patient details
            "patientId": str(patient["_id"]),
            "name": patient.get("name"),
            "email": patient.get("email"),
            "phone": patient.get("phone"),

            # Doctor details
            "doctorId": str(doctor["_id"]),
            "doctorName": doctor.get("name"),
            "department": doctor.get("department"),

            # Appointment details
            "appointmentDate": appointment.get("appointment_date"),
            "appointmentTime": appointment.get("appointment_time"),
            "appointmentStatus": appointment.get("appointment_status")

        })

    return {
        "success": True,
        "count": len(appointment_list),
        "data": appointment_list
    }, 200

def get_hospital_profile(hospital_id):

    hospitals = db["hospitals"]

    hospital = hospitals.find_one({
        "_id": ObjectId(hospital_id)
    })

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

def update_hospital_image(hospital_id, image_url):

    hospitals = db["hospitals"]

    result = hospitals.update_one(
        {
            "_id": ObjectId(hospital_id)
        },
        {
            "$set": {
                "image_url": image_url
            }
        }
    )

    if result.matched_count == 0:
        return {
            "success": False,
            "message": "Hospital not found."
        }, 404

    return {
        "success": True,
        "message": "Hospital image updated successfully.",
        "image_url": image_url
    }, 200