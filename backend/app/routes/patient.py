from flask import Blueprint
from flask import request, jsonify
from app.services.patient_service import search_hospitals
from app.services.patient_service import get_patient_appointments
from app.utils.auth import patient_required

from app.services.report_service import (
    get_patient_reports,
    get_report_by_appointment
)

from app.services.patient_service import (
    register_patient,
    login_patient,
    register_and_book,
    book_logged_in_patient,
    get_hospital_doctors,
    get_patient,
)

patient_bp = Blueprint("patient", __name__)

@patient_bp.route("/hospitals/search", methods=["GET"])
def hospital_search():

    query = request.args.get("query")

    if not query:

        return jsonify({
            "success": False,
            "message": "City is required."
        }), 400

    response, status = search_hospitals(query)

    return jsonify(response), status

@patient_bp.route("/patient/register", methods=["POST"])
def register():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    required_fields = [
        "name",
        "email",
        "phone",
        "password",
        "dob",
        "gender"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status = register_patient(data)

    return jsonify(response), status

@patient_bp.route("/patient/login", methods=["POST"])
def login():

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({
            "success": False,
            "message": "Email and password are required."
        }), 400

    response, status = login_patient(email, password)

    return jsonify(response), status

@patient_bp.route("/patient/book-appointment", methods=["POST"])
def book_appointment():

    data = request.get_json()

    auth_header = request.headers.get("Authorization")

    # -----------------------------
    # Logged-in patient
    # -----------------------------
    if auth_header:

        from app.utils.jwt import verify_token

        token = auth_header.split(" ")[1]

        payload = verify_token(token)

        if payload and payload.get("patient_id"):

            required_fields = [
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

            response, status = book_logged_in_patient(
                payload["patient_id"],
                data
            )

            return jsonify(response), status

    # -----------------------------
    # Guest patient
    # -----------------------------
@patient_bp.route("/hospital/<hospital_id>/doctors", methods=["GET"])
def hospital_doctors(hospital_id):

    response, status = get_hospital_doctors(hospital_id)

    return jsonify(response), status

@patient_bp.route("/patient/<patient_id>", methods=["GET"])
def patient_profile(patient_id):

    response, status = get_patient(patient_id)

    return jsonify(response), status

@patient_bp.route("/patient/<patient_id>/appointments", methods=["GET"])
def patient_appointments(patient_id):

    response, status = get_patient_appointments(patient_id)

    return jsonify(response), status

@patient_bp.route("/patient/<patient_id>/reports", methods=["GET"])
def patient_reports(patient_id):

    response, status = get_patient_reports(patient_id)

    return jsonify(response), status

@patient_bp.route("/patient/<patient_id>/report/<appointment_id>", methods=["GET"])
def patient_report(patient_id, appointment_id):

    response, status = get_report_by_appointment(
        appointment_id,
        None
    )

    if not response["success"]:
        return jsonify(response), status

    # Security check
    if response["data"]["patient_id"] != patient_id:
        return jsonify({
            "success": False,
            "message": "Unauthorized."
        }), 403

    return jsonify(response), status