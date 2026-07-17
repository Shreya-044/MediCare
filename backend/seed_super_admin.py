from datetime import datetime, timezone

from app.database import db
from app.utils.password import hash_password


def seed_super_admin():

    users = db["users"]

    # Check if Super Admin already exists
    existing = users.find_one({"role": "super_admin"})

    if existing:
        print("✅ Super Admin already exists!")
        return

    super_admin = {
        "name": "Super Admin",
        "email": "admin@medicare.com",
        "password": hash_password("Admin@123"),
        "role": "super_admin",
        "hospital_id": None,
        "department": None,
        "designation": None,
        "status": "active",
        "created_at": datetime.now(timezone.utc)
    }

    users.insert_one(super_admin)

    print("✅ Super Admin created successfully!")


if __name__ == "__main__":
    seed_super_admin()