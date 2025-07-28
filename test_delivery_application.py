import requests
import json

url = "http://172.16.223.198:8000/api/delivery/apply/"


payload = {
    "user": {
        "first_name": "John",
        "last_name": "Doe",
        "email": "unique.john.doe.v2@example.com",
        "phone": "1234567890124",
        "password": "password"
    },
    "id_type": "National ID",
    "id_number": "999888775",

    "is_student": False,
    "transportation_mode": "Motorcycle/Bodaboda",
    "available_hours": "15-20 hours",
    "has_license": True,
    "agree_to_terms": True
}

headers = {
    "Content-Type": "application/json"
}

response = requests.post(url, data=json.dumps(payload), headers=headers)

print(response.status_code)
print(response.json())
