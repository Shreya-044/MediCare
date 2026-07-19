from flask import Blueprint, request, jsonify

from app.services.appointment_service import book_appointment

appointment_bp = Blueprint("appointment", __name__)


@appointment_bp.route("/book-appointment", methods=["POST"])
def create_appointment():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "patient_id",
        "doctor_id",
        "appointment_date",
        "appointment_time",
        "consultation_fee",
        "platform_fee",
        "gst",
        "total_amount"
    ]

    for field in required_fields:
        if field not in data or data[field] in [None, ""]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status = book_appointment(data)

    return jsonify(response), status