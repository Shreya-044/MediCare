from flask import Blueprint, request, jsonify, g

from app.middleware.jwt_required import jwt_required
from app.middleware.role_required import role_required

from app.services.doctor_service import (
    create_doctor,
    get_all_doctors
)

admin_bp = Blueprint("admin", __name__)

@admin_bp.route("/add-doctor", methods=["POST"])
@jwt_required
@role_required("admin")
def add_doctor():

    data = request.get_json()

    required_fields = [
        "name",
        "email",
        "password",
        "department",
        "designation"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    hospital_id = g.current_user["hospital_id"]

    response, status = create_doctor(data, hospital_id)

    return jsonify(response), status

@admin_bp.route("/doctors", methods=["GET"])
@jwt_required
@role_required("admin")
def doctors():

    hospital_id = g.current_user["hospital_id"]

    response, status = get_all_doctors(hospital_id)

    return jsonify(response), status