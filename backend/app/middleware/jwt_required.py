from functools import wraps

from flask import request, jsonify, g

from app.utils.jwt import verify_token


def jwt_required(f):

    @wraps(f)
    def decorated(*args, **kwargs):

        auth_header = request.headers.get("Authorization")

        if not auth_header:
            return jsonify({
                "success": False,
                "message": "Authorization header missing."
            }), 401

        if not auth_header.startswith("Bearer "):
            return jsonify({
                "success": False,
                "message": "Invalid Authorization format."
            }), 401

        token = auth_header.split(" ")[1]

        payload = verify_token(token)

        if not payload:
            return jsonify({
                "success": False,
                "message": "Invalid or expired token."
            }), 401

        g.current_user = payload

        return f(*args, **kwargs)

    return decorated