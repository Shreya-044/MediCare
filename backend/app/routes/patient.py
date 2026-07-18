from flask import Blueprint
from flask import request, jsonify
from app.services.patient_service import search_hospitals

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
