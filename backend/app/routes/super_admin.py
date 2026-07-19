from flask import Blueprint, request, jsonify

from app.middleware.jwt_required import jwt_required
from app.middleware.role_required import role_required
from app.services.super_admin_service import get_dashboard_stats

from app.services.user_service import (
    create_admin,
    get_all_admins,
    get_admin_by_id,
    update_admin,
    delete_admin
)

from app.services.hospital_service import (
    create_hospital,
    get_all_hospitals,
    get_hospital_by_id,
    update_hospital,
    delete_hospital
)

super_admin_bp = Blueprint("super_admin", __name__)


@super_admin_bp.route("/add-hospital", methods=["POST"])
@jwt_required
@role_required("super_admin")
def add_hospital():

    data = request.get_json()

    required_fields = [
        "hospital_name",
        "email",
        "phone",
        "address",
        "city",
        "state",
        "pincode"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status = create_hospital(data)

    return jsonify(response), status

@super_admin_bp.route("/hospitals", methods=["GET"])
@jwt_required
@role_required("super_admin")
def hospitals():

    response, status = get_all_hospitals()

    return jsonify(response), status

@super_admin_bp.route("/hospital/<hospital_id>", methods=["GET"])
@jwt_required
@role_required("super_admin")
def get_hospital(hospital_id):

    response, status = get_hospital_by_id(hospital_id)

    return jsonify(response), status

@super_admin_bp.route("/update-hospital/<hospital_id>", methods=["PUT"])
@jwt_required
@role_required("super_admin")
def update_hospital_route(hospital_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status = update_hospital(hospital_id, data)

    return jsonify(response), status

@super_admin_bp.route("/delete-hospital/<hospital_id>", methods=["DELETE"])
@jwt_required
@role_required("super_admin")
def delete_hospital_route(hospital_id):

    response, status = delete_hospital(hospital_id)

    return jsonify(response), status

@super_admin_bp.route("/add-admin", methods=["POST"])
@jwt_required
@role_required("super_admin")
def add_admin():

    data = request.get_json()

    required_fields = [
        "name",
        "email",
        "password",
        "hospital_id"
    ]

    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({
                "success": False,
                "message": f"{field} is required."
            }), 400

    response, status = create_admin(data)

    return jsonify(response), status

@super_admin_bp.route("/admins", methods=["GET"])
@jwt_required
@role_required("super_admin")
def admins():

    response, status = get_all_admins()

    return jsonify(response), status

@super_admin_bp.route("/admin/<admin_id>", methods=["GET"])
@jwt_required
@role_required("super_admin")
def get_admin(admin_id):

    response, status = get_admin_by_id(admin_id)

    return jsonify(response), status

@super_admin_bp.route("/update-admin/<admin_id>", methods=["PUT"])
@jwt_required
@role_required("super_admin")
def update_admin_route(admin_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400

    response, status = update_admin(admin_id, data)

    return jsonify(response), status

@super_admin_bp.route("/delete-admin/<admin_id>", methods=["DELETE"])
@jwt_required
@role_required("super_admin")
def delete_admin_route(admin_id):

    response, status = delete_admin(admin_id)

    return jsonify(response), status

@super_admin_bp.route("/dashboard-stats", methods=["GET"])
@jwt_required
@role_required("super_admin")
def dashboard_stats():

    response, status = get_dashboard_stats()

    return jsonify(response), status
