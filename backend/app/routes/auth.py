from flask import Blueprint, request, jsonify

from app.services.auth_service import login_user

from flask import g

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
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

    response, status = login_user(email, password)

    return jsonify(response), status

from app.middleware.jwt_required import jwt_required


@auth_bp.route("/profile", methods=["GET"])
@jwt_required
def profile():

    return jsonify({
        "success": True,
        "user": g.current_user
    })