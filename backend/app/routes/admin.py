from flask import Blueprint, request, jsonify, g

from app.middleware.jwt_required import jwt_required
from app.middleware.role_required import role_required
from app.services.admin_service import get_dashboard_stats

from app.services.staff_service import (
    create_staff,
    get_all_staff,
    get_staff_by_id,
    update_staff,
    deactivate_staff
)

from app.services.doctor_service import (
    create_doctor,
    get_all_doctors,
    get_doctor_by_id,
    update_doctor,
    deactivate_doctor
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

@admin_bp.route("/doctor/<doctor_id>", methods=["GET"])
@jwt_required
@role_required("admin")
def doctor(doctor_id):

    hospital_id = g.current_user["hospital_id"]

    response, status = get_doctor_by_id(
        doctor_id,
        hospital_id
    )

    return jsonify(response), status

@admin_bp.route("/update-doctor/<doctor_id>", methods=["PUT"])
@jwt_required
@role_required("admin")
def update_doctor_route(doctor_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    hospital_id = g.current_user["hospital_id"]

    response, status = update_doctor(
        doctor_id,
        hospital_id,
        data
    )

    return jsonify(response), status

@admin_bp.route("/deactivate-doctor/<doctor_id>", methods=["PUT"])
@jwt_required
@role_required("admin")
def deactivate_doctor_route(doctor_id):

    hospital_id = g.current_user["hospital_id"]

    response, status = deactivate_doctor(
        doctor_id,
        hospital_id
    )

    return jsonify(response), status

@admin_bp.route("/add-staff", methods=["POST"])
@jwt_required
@role_required("admin")
def add_staff():

    data = request.get_json()

    required_fields = [
        "name",
        "email",
        "password",
        "designation"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    hospital_id = g.current_user["hospital_id"]

    response, status = create_staff(
        data,
        hospital_id
    )

    return jsonify(response), status
    
@admin_bp.route("/staff", methods=["GET"])
@jwt_required
@role_required("admin")
def staff():

    hospital_id = g.current_user["hospital_id"]

    response, status = get_all_staff(hospital_id)

    return jsonify(response), status

@admin_bp.route("/staff/<staff_id>", methods=["GET"])
@jwt_required
@role_required("admin")
def get_staff(staff_id):

    hospital_id = g.current_user["hospital_id"]

    response, status = get_staff_by_id(
        staff_id,
        hospital_id
    )

    return jsonify(response), status

@admin_bp.route("/update-staff/<staff_id>", methods=["PUT"])
@jwt_required
@role_required("admin")
def update_staff_route(staff_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    hospital_id = g.current_user["hospital_id"]

    response, status = update_staff(
        staff_id,
        hospital_id,
        data
    )

    return jsonify(response), status

@admin_bp.route("/deactivate-staff/<staff_id>", methods=["PUT"])
@jwt_required
@role_required("admin")
def deactivate_staff_route(staff_id):

    hospital_id = g.current_user["hospital_id"]

    response, status = deactivate_staff(
        staff_id,
        hospital_id
    )

    return jsonify(response), status

@admin_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required
@role_required("admin")
def dashboard_stats():

    hospital_id = g.current_user["hospital_id"]

    response, status = get_dashboard_stats(hospital_id)

    return jsonify(response), status