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