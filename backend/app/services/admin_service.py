from app.database import db


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