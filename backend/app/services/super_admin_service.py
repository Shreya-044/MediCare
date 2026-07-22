from app.database import db
from app.database import db

def get_dashboard_stats():

    hospitals = db["hospitals"]
    users = db["users"]

    total_hospitals = hospitals.count_documents({})

    active_admins = users.count_documents({
        "role": "admin",
        "status": "active"
    })

    total_revenue = 0

    for hospital in hospitals.find({}, {"revenue": 1}):
        total_revenue += hospital.get("revenue", 0)

    return {
        "success": True,
        "data": {
            "total_hospitals": total_hospitals,
            "active_admins": active_admins,
            "total_revenue": total_revenue
        }
    }, 200

def get_super_dashboard_stats():

    hospitals = db["hospitals"]
    users = db["users"]
    appointments = db["appointments"]

    total_hospitals = hospitals.count_documents({})

    active_admins = users.count_documents({
        "role": "admin",
        "status": "active"
    })

    total_revenue = 0

    for appointment in appointments.find({
        "appointment_status": {
            "$in": ["Booked", "Completed"]
        }
    }):

        total_revenue += float(
            appointment.get("consultation_fee", 0)
        )

    return {
        "success": True,
        "data": {
            "total_hospitals": total_hospitals,
            "active_admins": active_admins,
            "total_revenue": total_revenue
        }
    }, 200

def get_super_dashboard_stats():

    hospitals = db["hospitals"]
    users = db["users"]
    appointments = db["appointments"]

    total_hospitals = hospitals.count_documents({})

    active_admins = users.count_documents({
        "role": "admin",
        "status": "active"
    })

    total_revenue = 0
    hospital_revenue = []

    for hospital in hospitals.find():

        revenue = 0

        hospital_appointments = appointments.find({
            "hospital_id": str(hospital["_id"]),
            "appointment_status": {
                "$in": ["Booked", "Completed"]
            }
        })

        count = 0

        for appt in hospital_appointments:
            revenue += float(appt.get("consultation_fee", 0))
            count += 1

        total_revenue += revenue

        hospital_revenue.append({
            "id": str(hospital["_id"]),
            "name": hospital["hospital_name"],
            "appointments": count,
            "revenue": revenue
        })

    hospital_revenue.sort(
        key=lambda x: x["revenue"],
        reverse=True
    )

    return {
        "success": True,
        "data": {
            "total_hospitals": total_hospitals,
            "active_admins": active_admins,
            "total_revenue": total_revenue,
            "hospital_revenue": hospital_revenue
        }
    }, 200