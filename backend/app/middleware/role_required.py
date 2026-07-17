from functools import wraps

from flask import jsonify, g


def role_required(*allowed_roles):

    def decorator(f):

        @wraps(f)
        def decorated(*args, **kwargs):

            current_role = g.current_user["role"]

            if current_role not in allowed_roles:

                return jsonify({
                    "success": False,
                    "message": "Access denied."
                }), 403

            return f(*args, **kwargs)

        return decorated

    return decorator