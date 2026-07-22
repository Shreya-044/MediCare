from datetime import datetime, timezone
from bson import ObjectId

from app.database import db


def save_report(appointment_id, hospital_id, data):

    appointments = db["appointments"]
    reports = db["reports"]

    appointment = appointments.find_one({
        "_id": ObjectId(appointment_id),
        "hospital_id": hospital_id
    })

    if not appointment:
        return {
            "success": False,
            "message": "Appointment not found."
        }, 404

    existing = reports.find_one({
        "appointment_id": ObjectId(appointment_id)
    })

    if existing:
        return {
            "success": False,
            "message": "Report already exists."
        }, 400

    report = {

        "appointment_id": ObjectId(appointment_id),

        "patient_id": appointment["patient_id"],

        "doctor_id": appointment["doctor_id"],

        "hospital_id": hospital_id,

        "title": data.get("title", ""),

        "doctor_notes": data.get("doctor_notes", ""),

        "rows": data.get("rows", []),

        "created_at": datetime.now(timezone.utc)

    }

    reports.insert_one(report)

    appointments.update_one(
        {
            "_id": ObjectId(appointment_id)
        },
        {
            "$set": {
                "hasReport": True
            }
        }
    )

    return {
        "success": True,
        "message": "Report saved successfully."
    }, 201


def get_report_by_appointment(appointment_id, hospital_id=None):

    reports = db["reports"]

    query = {
        "appointment_id": ObjectId(appointment_id)
    }

    # Only admins send hospital_id
    if hospital_id:
        query["hospital_id"] = hospital_id

    report = reports.find_one(query)

    if not report:
        return {
            "success": False,
            "message": "Report not found."
        }, 404

    report["_id"] = str(report["_id"])
    report["appointment_id"] = str(report["appointment_id"])
    report["patient_id"] = str(report["patient_id"])
    report["doctor_id"] = str(report["doctor_id"])

    return {
        "success": True,
        "data": report
    }, 200


def get_patient_reports(patient_id):

    reports = db["reports"]

    result = reports.find({
        "patient_id": ObjectId(patient_id)
    }).sort("created_at", -1)

    report_list = []

    for report in result:

        report_list.append({

            "_id": str(report["_id"]),

            "appointment_id": str(report["appointment_id"]),

            "doctor_id": str(report["doctor_id"]),

            "title": report.get("title"),

            "doctor_notes": report.get("doctor_notes"),

            "rows": report.get("rows", []),

            "created_at": report.get("created_at")

        })

    return {
        "success": True,
        "count": len(report_list),
        "data": report_list
    }, 200