from functools import wraps
from flask import request, jsonify

from app.utils.jwt import verify_token


def patient_required(func):
    @wraps(func)
    def wrapper(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Token missing."
            }), 401

        try:
            token = auth_header.split(" ")[1]
        except Exception:
            return jsonify({
                "success": False,
                "message": "Invalid token."
            }), 401

        payload = verify_token(token)

        if not payload:
            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

        request.patient = payload

        return func(*args, **kwargs)

    return wrapper