from flask import Flask
from flask_cors import CORS

from app.routes.auth import auth_bp
from app.routes.super_admin import super_admin_bp
from app.routes.admin import admin_bp
from app.routes.patient import patient_bp
from app.routes.appointment import appointment_bp

def create_app():

    app = Flask(__name__)

    CORS(app)

    # Authentication Routes
    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    # Super Admin Routes
    app.register_blueprint(
        super_admin_bp,
        url_prefix="/api/super-admin"
    )

    # Admin Routes
    app.register_blueprint(
        admin_bp,
        url_prefix="/api/admin"
    )

    app.register_blueprint(
        patient_bp,
        url_prefix="/api"
    )
    
    app.register_blueprint(
        appointment_bp,
        url_prefix="/api"
    )

    return app