from app.database import db
from bson import ObjectId
from datetime import datetime

def get_dashboard_stats(hospital_id):

    users = db["users"]
    appointments = db["appointments"]

    # -------------------------
    # Total Doctors
    # -------------------------
    doctor_count = users.count_documents({
        "role": "doctor",
        "hospital_id": hospital_id,
        "status": "active"
    })

    # -------------------------
    # Total Staff
    # -------------------------
    staff_count = users.count_documents({
        "role": "staff",
        "hospital_id": hospital_id,
        "status": "active"
    })

    # -------------------------
    # Unique Patients
    # -------------------------
    patient_ids = appointments.distinct(
        "patient_id",
        {
            "hospital_id": hospital_id,
            "appointment_status": "Booked"
        }
    )

    patient_count = len(patient_ids)
    return {
        "success": True,
        "data": {
            "doctors": doctor_count,
            "staff": staff_count,
            "patients": patient_count,
        }
    }, 200

def get_revenue_stats(hospital_id, mode="daily", date=None):

    users = db["users"]
    appointments = db["appointments"]

    # -----------------------------
    # Date Filter
    # -----------------------------
    query = {
        "hospital_id": hospital_id,
        "appointment_status": {
            "$in": ["Booked", "Completed"]
        }
    }

    if mode == "daily":

        if not date:
            date = datetime.now().strftime("%Y-%m-%d")

        query["appointment_date"] = date

    elif mode == "monthly":

        if not date:
            date = datetime.now().strftime("%Y-%m")

        query["appointment_date"] = {
            "$regex": f"^{date}"
        }

    elif mode == "all":
        pass

    # -----------------------------
    # Revenue
    # -----------------------------
    total_revenue = 0

    doctor_revenue = []

    doctors = users.find({
        "role": "doctor",
        "hospital_id": hospital_id
    })

    for doctor in doctors:

        doctor_query = query.copy()

        doctor_query["doctor_id"] = doctor["_id"]

        doctor_appointments = list(
            appointments.find(doctor_query)
        )

        revenue = 0

        for appointment in doctor_appointments:

            revenue += float(
                appointment.get("consultation_fee") or 0
            )

        total_revenue += revenue

        doctor_revenue.append({

            "id": str(doctor["_id"]),

            "name": doctor.get("name"),

            "appointments": len(doctor_appointments),

            "revenue": revenue

        })

    doctor_revenue.sort(
        key=lambda x: x["revenue"],
        reverse=True
    )

    return {
        "success": True,
        "data": {

            "total_revenue": total_revenue,

            "doctor_revenue": doctor_revenue

        }
    }, 200

def get_hospital_patient_appointments(hospital_id, date=None, doctor_id=None):

    appointments = db["appointments"]
    patients = db["patients"]
    doctors = db["users"]

    query = {
        "hospital_id": hospital_id,
        "appointment_status": {
            "$in": [
                "Booked",
                "Completed"
            ]
        }
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