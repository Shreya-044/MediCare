from flask import Blueprint, request, jsonify, g
from bson import ObjectId
from app.database import db
from app.middleware.jwt_required import jwt_required
from app.middleware.role_required import role_required
from app.services.activity_service import (
    get_recent_activities,
    create_activity
)
from app.services.super_admin_service import (
    get_dashboard_stats,
    get_super_dashboard_stats
)

from app.services.user_service import (
    create_admin,
    get_all_admins,
    get_admin_by_id,
    update_admin,
    delete_admin,
    update_admin_status
)

from app.services.hospital_service import (
    create_hospital,
    get_all_hospitals,
    get_hospital_by_id,
    update_hospital,
    delete_hospital,
    update_hospital_status
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
    if status == 201:
        create_activity(
            f"Added new Hospital: {data['hospital_name']}",
            "HOSPITAL_ADDED"
        )
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
    if status == 200:
        create_activity(
            f"Deleted or Updated Hospital ID: {hospital_id}",
            "HOSPITAL_DELETED"
        )
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
    if status == 201:
        create_activity(
            f"Registered new Admin: {data['name']}",
            "ADMIN_REGISTERED"
        )
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
def update_admin_route(admin_id):

    current_role = g.current_user["role"]

    # Only super_admin and admin allowed
    if current_role not in ["super_admin", "admin"]:
        return jsonify({
            "success": False,
            "message": "Access denied."
        }), 403


    # Admin can update only their own profile
    if current_role == "admin":

        if g.current_user["_id"] != admin_id:
            return jsonify({
                "success": False,
                "message": "You can update only your own profile."
            }), 403


    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }), 400


    response, status = update_admin(
        admin_id,
        data
    )

    return jsonify(response), status

@super_admin_bp.route("/delete-admin/<admin_id>", methods=["DELETE"])
@jwt_required
@role_required("super_admin")
def delete_admin_route(admin_id):

    admin = db["users"].find_one({
        "_id": ObjectId(admin_id)
    })

    response, status = delete_admin(admin_id)

    if status == 200 and admin:
        create_activity(
            f"Deleted or Updated Admin: {admin.get('name')}",
            "ADMIN_DELETED"
        )

    return jsonify(response), status

@super_admin_bp.route("/update-profile/<admin_id>", methods=["PUT"])
@jwt_required
@role_required("super_admin")
def update_super_admin_profile(admin_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request body is required."
        }),400


    response, status = update_admin(
        admin_id,
        data
    )

    return jsonify(response), status

@super_admin_bp.route("/dashboard-revenue", methods=["GET"])
@jwt_required
@role_required("super_admin")
def dashboard_stats():

    response, status = get_super_dashboard_stats()

    return jsonify(response), status

@super_admin_bp.route("/recent-activities", methods=["GET"])
@jwt_required
@role_required("super_admin")
def recent_activities():

    response, status = get_recent_activities()

    return jsonify(response), status

@super_admin_bp.route("/hospital/<hospital_id>/status", methods=["PATCH"])
@jwt_required
@role_required("super_admin")
def change_hospital_status(hospital_id):

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({
            "success": False,
            "message": "Status is required."
        }), 400

    hospital = db["hospitals"].find_one({
    "_id": ObjectId(hospital_id)
})

    response, status = update_hospital_status(
        hospital_id,
        data["status"]
    )

    if status == 200 and hospital:
        create_activity(
            f"Hospital '{hospital['hospital_name']}' status changed to {data['status']}",
            "HOSPITAL_STATUS_UPDATED"
        )
    return jsonify(response), status

@super_admin_bp.route("/admin/<admin_id>/status", methods=["PATCH"])
@jwt_required
@role_required("super_admin")
def change_admin_status(admin_id):

    data = request.get_json()

    if not data or "status" not in data:
        return jsonify({
            "success": False,
            "message": "Status is required."
        }), 400

    admin = db["users"].find_one({
        "_id": ObjectId(admin_id)
    })

    response, status = update_admin_status(
        admin_id,
        data["status"]
    )

    if status == 200 and admin:
        create_activity(
            f"Admin '{admin['name']}' status changed to {data['status']}",
            "ADMIN_STATUS_UPDATED"
        )

    return jsonify(response), status
