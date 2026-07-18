from app.database import db


def search_hospitals(query):

    hospitals = db["hospitals"]

    result = hospitals.find({
    "$or": [
        {
            "hospital_name": {
                "$regex": query,
                "$options": "i"
            }
        },
        {
            "city": {
                "$regex": query,
                "$options": "i"
            }
        }
    ],
    "status": "active"
})
    hospital_list = []

    for hospital in result:

        hospital_list.append({

            "_id": str(hospital["_id"]),

            "hospital_name": hospital["hospital_name"],

            "city": hospital["city"],

            "state": hospital["state"],

            "address": hospital["address"],

            "phone": hospital["phone"],

            "email": hospital["email"]

        })

    return {

        "success": True,

        "count": len(hospital_list),

        "data": hospital_list

    }, 200