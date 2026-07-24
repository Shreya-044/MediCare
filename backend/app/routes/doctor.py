from flask import Blueprint, jsonify, g
from flask import request
from app.middleware.jwt_required import jwt_required
from app.middleware.role_required import role_required

from app.services.doctor_service import (
    punch_in,
    punch_out,
    get_attendance_history,
    apply_leave,
    get_leave_history,
    get_salary_summary,
    get_doctor_appointments,
    complete_appointment,
    mark_no_show
)

doctor_bp = Blueprint("doctor", __name__)


# -----------------------------
# Today's Queue
# -----------------------------
@doctor_bp.route("/queue", methods=["GET"])
@jwt_required
@role_required("doctor")
def doctor_queue():

    doctor_id = g.current_user["user_id"]

    date = request.args.get("date")

    response, status = get_doctor_appointments(
        doctor_id,
        date
    )

    return jsonify(response), status


# -----------------------------
# Punch In
# -----------------------------
@doctor_bp.route("/punch-in", methods=["POST"])
@jwt_required
@role_required("doctor")
def doctor_punch_in():

    doctor_id = g.current_user["user_id"]

    response, status = punch_in(doctor_id)

    return jsonify(response), status


# -----------------------------
# Punch Out
# -----------------------------
@doctor_bp.route("/punch-out", methods=["POST"])
@jwt_required
@role_required("doctor")
def doctor_punch_out():

    doctor_id = g.current_user["user_id"]

    response, status = punch_out(doctor_id)

    return jsonify(response), status


# -----------------------------
# Attendance History
# -----------------------------
@doctor_bp.route("/doctor/attendance", methods=["GET"])
@jwt_required
@role_required("doctor")
def doctor_attendance():

    doctor_id = g.current_user["user_id"]

    response, status = get_attendance_history(doctor_id)

    return jsonify(response), status

@doctor_bp.route("/leave", methods=["POST"])
@jwt_required
@role_required("doctor")
def doctor_leave():

    doctor_id = g.current_user["user_id"]

    data = request.get_json()

    response, status = apply_leave(
        doctor_id,
        data
    )

    return jsonify(response), status

@doctor_bp.route("/leave", methods=["GET"])
@jwt_required
@role_required("doctor")
def doctor_leave_history():

    doctor_id = g.current_user["user_id"]

    response, status = get_leave_history(
        doctor_id
    )

    return jsonify(response), status

@doctor_bp.route("/salary", methods=["GET"])
@jwt_required
@role_required("doctor")
def doctor_salary():

    doctor_id = g.current_user["user_id"]

    response, status = get_salary_summary(
        doctor_id
    )

    return jsonify(response), status

@doctor_bp.route("/doctor/appointments", methods=["GET"])
@jwt_required
@role_required("doctor")
def doctor_appointments():

    doctor_id = g.current_user["user_id"]

    date = request.args.get("date")

    response, status = get_doctor_appointments(
        doctor_id,
        date
    )

    return jsonify(response), status

@doctor_bp.route(
    "/appointment/<appointment_id>/complete",
    methods=["PUT"]
)
@jwt_required
@role_required("doctor")
def complete_patient(appointment_id):

    response,status = complete_appointment(
        appointment_id
    )

    return jsonify(response),status

@doctor_bp.put("/appointment/<appointment_id>/no-show")
@jwt_required
@role_required("doctor")
def no_show(appointment_id):

    return mark_no_show(appointment_id)