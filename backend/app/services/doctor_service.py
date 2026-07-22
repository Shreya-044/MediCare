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
        "availability":"offline",
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
        "hospital_id": hospital_id
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
            "hospital_id": hospital_id
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

def get_doctor_queue(doctor_id):

    appointments = db["appointments"]
    patients = db["patients"]

    today = datetime.now().strftime("%Y-%m-%d")

    result = appointments.find({
        "doctor_id": ObjectId(doctor_id),
        "appointment_date": today,
        "appointment_status": "Booked"
    }).sort("appointment_time", 1)

    queue = []

    position = 1

    for appointment in result:

        patient = patients.find_one({
            "_id": appointment["patient_id"]
        })

        if not patient:
            continue

        queue.append({
            "_id": str(appointment["_id"]),
            "patient_name": patient["name"],
            "patient_email": patient["email"],
            "patient_phone": patient["phone"],
            "appointment_time": appointment["appointment_time"],
            "appointment_status": appointment["appointment_status"],
            "position": position
        })

        position += 1

    return {
        "success": True,
        "data": queue
    }, 200

attendance = db["attendance"]
users = db["users"]
doctor_leaves = db["doctor_leaves"]

def punch_in(doctor_id):

    today = datetime.now().strftime("%Y-%m-%d")

    # Check if already punched in today
    existing = attendance.find_one({
        "doctor_id": ObjectId(doctor_id),
        "date": today
    })

    if existing:
        return {
            "success": False,
            "message": "Already punched in today."
        }, 400

    doctor = users.find_one({
        "_id": ObjectId(doctor_id),
        "role": "doctor"
    })

    if not doctor:
        return {
            "success": False,
            "message": "Doctor not found."
        }, 404

    attendance.insert_one({

        "doctor_id": ObjectId(doctor_id),

        "hospital_id": doctor["hospital_id"],

        "date": today,

        "punch_in": datetime.now(timezone.utc),

        "punch_out": None,

        "working_hours": 0,

        "attendance_status": "Present",

        "created_at": datetime.now(timezone.utc)

    })

    users.update_one(
        {
            "_id": ObjectId(doctor_id)
        },
        {
            "$set": {
                "availability": "online"
            }
        }
    )

    return {
        "success": True,
        "message": "Punch In Successful"
    }, 200

def punch_out(doctor_id):

    today = datetime.now().strftime("%Y-%m-%d")

    record = attendance.find_one({
        "doctor_id": ObjectId(doctor_id),
        "date": today
    })

    if not record:
        return {
            "success": False,
            "message": "Please Punch In First."
        }, 400

    if record["punch_out"] is not None:
        return {
            "success": False,
            "message": "Already Punched Out."
        }, 400

    now = datetime.now(timezone.utc)
    punch_in = record["punch_in"]
    if punch_in.tzinfo is None:
        punch_in = punch_in.replace(tzinfo=timezone.utc)
        hours = (
            now - punch_in
            ).total_seconds() / 3600
        attendance.update_one(
            {
                "_id": record["_id"]
            },
        {
            "$set": {
                "punch_out": now,
                "working_hours": round(hours, 2)
            }
        }
    )

    users.update_one(
        {
            "_id": ObjectId(doctor_id)
        },
        {
            "$set": {
                "availability": "offline"
            }
        }
    )

    return {
        "success": True,
        "message": "Punch Out Successful"
    }, 200

def get_attendance_history(doctor_id):

    result = attendance.find({
        "doctor_id": ObjectId(doctor_id)
    }).sort("date", -1)

    data = []

    for item in result:

        data.append({
            "date": item["date"],
            "punch_in": item["punch_in"],
            "punch_out": item["punch_out"],
            "working_hours": item["working_hours"],
            "attendance_status": item["attendance_status"]
        })

    return {
        "success": True,
        "data": data
    }, 200

def apply_leave(doctor_id, data):

    doctor = users.find_one({
        "_id": ObjectId(doctor_id),
        "role": "doctor"
    })

    if not doctor:
        return {
            "success": False,
            "message": "Doctor not found."
        }, 404

    # Check if leave already exists for this date
    existing = doctor_leaves.find_one({
        "doctor_id": ObjectId(doctor_id),
        "leave_date": data["date"]
    })

    if existing:
        return {
            "success": False,
            "message": "Leave already requested for this date."
        }, 400

    doctor_leaves.insert_one({

        "doctor_id": ObjectId(doctor_id),

        "hospital_id": doctor["hospital_id"],

        "leave_date": data["date"],

        "reason": data["reason"],

        "leave_type": data["type"],

        "status": "Pending",

        "created_at": datetime.now(timezone.utc)

    })

    return {
        "success": True,
        "message": "Leave Request Submitted"
    }, 200

def get_leave_history(doctor_id):

    leaves = doctor_leaves.find({

        "doctor_id": ObjectId(doctor_id)

    }).sort("created_at",-1)

    data=[]

    for leave in leaves:

        data.append({

            "id":str(leave["_id"]),

            "date":leave["leave_date"],

            "reason":leave["reason"],

            "type":leave["leave_type"],

            "status":leave["status"]

        })

    return {

        "success":True,

        "data":data

    },200

def get_salary_summary(doctor_id):

    attendance = db["attendance"]
    appointments = db["appointments"]
    doctor_leaves = db["doctor_leaves"]
    users = db["users"]

    doctor = users.find_one({
        "_id": ObjectId(doctor_id),
        "role": "doctor"
    })

    if not doctor:
        return {
            "success": False,
            "message": "Doctor not found."
        }, 404

    consultation_fee = doctor.get("consultation_fee", 0)

    current_month = datetime.now().strftime("%Y-%m")

    # -----------------------------
    # Doctor Income
    # -----------------------------

    monthly_income = 0
    all_time_income = 0

    appointments_cursor = appointments.find({
        "doctor_id": ObjectId(doctor_id),
        "payment_status": {
            "$in": ["Paid", "Completed"]
        }
    })

    for appointment in appointments_cursor:

        fee = appointment.get("consultation_fee", consultation_fee)

        all_time_income += fee

        if appointment["appointment_date"].startswith(current_month):
            monthly_income += fee

    # -----------------------------
    # Deductions
    # -----------------------------

    early_logout_count = attendance.count_documents({
        "doctor_id": ObjectId(doctor_id),
        "attendance_status": "Early Logout"
    })

    leave_count = doctor_leaves.count_documents({
        "doctor_id": ObjectId(doctor_id),
        "status": "Approved"
    })

    early_logout_deduction = early_logout_count * (consultation_fee * 0.10)

    leave_deduction = leave_count * consultation_fee

    total_deduction = early_logout_deduction + leave_deduction

    # -----------------------------
    # Hospital Income
    # -----------------------------

    hospital_income = 0

    hospital_appointments = appointments.find({
        "hospital_id": doctor["hospital_id"],
        "payment_status": {
            "$in": ["Paid", "Completed"]
        }
    })

    for appointment in hospital_appointments:

        hospital_income += appointment.get("consultation_fee", 0)

    return {
        "success": True,
        "data": {
            "monthly_income": round(monthly_income, 2),
            "all_time_income": round(all_time_income, 2),
            "early_logout_count": early_logout_count,
            "leave_count": leave_count,
            "early_logout_deduction": round(early_logout_deduction, 2),
            "leave_deduction": round(leave_deduction, 2),
            "total_deduction": round(total_deduction, 2),
            "hospital_income": round(hospital_income, 2)
        }
    }, 200

def get_doctor_appointments(doctor_id, date):

    appointments = db["appointments"]
    patients = db["patients"]

    result = appointments.find({
        "doctor_id": ObjectId(doctor_id),
        "appointment_date": date
    }).sort("appointment_time", 1)

    data = []

    for appointment in result:

        patient = patients.find_one({
            "_id": appointment["patient_id"]
        })

        if not patient:
            continue

        data.append({

            "_id": str(appointment["_id"]),

            "patient_name": patient["name"],

            "patient_email": patient["email"],

            "patient_phone": patient["phone"],

            "appointment_time": appointment["appointment_time"],

            "appointment_date": appointment["appointment_date"],

            "status": appointment["appointment_status"]

        })

    return {

        "success": True,

        "data": data

    }, 200