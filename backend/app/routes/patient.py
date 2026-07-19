from flask import Blueprint
from flask import request, jsonify
from app.services.patient_service import search_hospitals
from app.services.patient_service import (
    register_patient,
    login_patient,
    register_and_book,
    get_hospital_doctors
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
        "gender",
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

    response, status = register_and_book(data)

    return jsonify(response), status

@patient_bp.route("/hospital/<hospital_id>/doctors", methods=["GET"])
def hospital_doctors(hospital_id):

    response, status = get_hospital_doctors(hospital_id)

    return jsonify(response), status
