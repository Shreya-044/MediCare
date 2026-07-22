from app.database import db
from datetime import datetime, timezone


activities = db["activities"]


def create_activity(description, activity_type):

    activities.insert_one({

        "description": description,

        "type": activity_type,

        "timestamp": datetime.now(timezone.utc)

    })



def get_recent_activities():

    data = list(
        activities.find()
        .sort(
            "timestamp",
            -1
        )
        .limit(10)
    )


    for activity in data:
        activity["_id"] = str(activity["_id"])


    return {

        "success": True,
        "data": data

    }, 200