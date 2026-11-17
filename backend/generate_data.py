
import requests
import random

API_URL = "http://127.0.0.1:8000/api/listings/bulk"

business_names = [
    "Sharma Enterprises", "Patel Traders", "Gupta Electronics",
    "City Medical Store", "Royal Restaurant", "Fresh Mart",
    "Digital Solutions", "Modern Furniture", "Sunrise Hotel",
    "Bright Coaching Centre", "Tech World", "Fashion Hub",
    "New India Motors", "Green Garden Nursery", "Health Care Clinic",
    "Classic Bakery", "Smart Mobile Store", "Om Hardware",
    "Global Services", "Prime Auto Parts"
]

categories = [
    "Restaurant", "Medical Store", "Electronics",
    "Clothing", "Hotel", "Education",
    "Automobile", "Furniture", "Grocery",
    "Healthcare", "IT Services", "Hardware"
]

cities = [
    "Raipur", "Bhilai", "Durg", "Bilaspur",
    "Indore", "Bhopal", "Nagpur", "Mumbai",
    "Pune", "Delhi"
]

sources = [
    "Sample Dataset (Synthetic)"
]

listings = []

for i in range(1, 601):
    business = {
        "business_name": random.choice(business_names) + f" {i}",
        "category": random.choice(categories),
        "city": random.choice(cities),
        "address": f"Shop No. {i}, Main Market, {random.choice(cities)}",
        "phone": f"9{random.randint(100000000, 999999999)}",
        "source": random.choice(sources)
    }

    listings.append(business)

try:
    response = requests.post(
        API_URL,
        json={"listings": listings},
        timeout=60
    )

    print("Status Code:", response.status_code)
    print("Response:", response.json())

except requests.exceptions.RequestException as error:
    print("Error:", error)
