# BizInsights – Business Listings Dashboard

## 🚀 Live Demo

**Live Dashboard:** https://business-listings-dashboard-lac.vercel.app/

**Backend API:** https://business-listings-dashboard-zzye.onrender.com

**API Documentation:** https://business-listings-dashboard-zzye.onrender.com/docs

**GitHub Repository:** https://github.com/pankaj071996/Business-Listings-Dashboard

A full-stack Business Listings Dashboard built to manage, explore, and analyze business listing data across multiple cities and categories.

## Project Overview

BizInsights provides a centralized dashboard to monitor business listings, analyze city-wise distribution, explore business categories, and search business records.

The application uses React for the frontend, FastAPI for backend APIs, and MySQL for database storage.

**Note:** This project currently uses 600 synthetic sample records generated for demonstration and testing. These records are not live Google Maps or directory-scraped data.

## Features

- Interactive business dashboard
- Key metrics: total businesses, cities, categories, and data sources
- City-wise business distribution chart
- Category-wise distribution chart
- Business listings table
- Search and sorting functionality
- REST APIs built with FastAPI
- MySQL database integration
- Bulk insertion of business records
- API documentation through Swagger UI

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React.js, Vite |
| Styling | CSS |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Python, FastAPI |
| Database | MySQL |
| ORM | SQLAlchemy |
| Database Driver | PyMySQL |

## Project Structure

```text
Business-Listings-Dashboard/
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   ├── generate_data.py
│   ├── test_db.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── main.jsx
│   ├── package.json
│   └── index.html
│
├── database/
│   └── business_listings.sql
│
├── data/
│
├── .gitignore
└── README.md
```

## Database Details

**Database:** `business_listings`

**Table:** `listing_master`

| Column | Description |
|---|---|
| id | Unique listing ID |
| business_name | Business name |
| category | Business category |
| city | City |
| address | Business address |
| phone | Contact number |
| source | Dataset source |
| created_at | Record creation timestamp |

The database contains 600 synthetic sample business records across 10 cities and 12 categories.

## Backend Setup

1. Install Python and MySQL.
2. Open the project folder in PowerShell.
3. Navigate to the backend:

```powershell
cd backend
```

4. Create and activate a virtual environment:

```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

5. Install dependencies:

```powershell
pip install -r requirements.txt
```

6. Create a `.env` file inside the backend folder:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=business_listings
```

7. Create the MySQL database and import the SQL file `database/business_listings.sql` if the database has not already been created.

8. Start the backend:

```powershell
uvicorn main:app --reload
```

Backend URL: `http://127.0.0.1:8000`

API documentation: `http://127.0.0.1:8000/docs`

## Frontend Setup

Open another terminal and navigate to the frontend:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the React application:

```powershell
npm run dev
```

Frontend URL: `http://localhost:5173`

Make sure the backend and MySQL database are running before using the dashboard.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | API health check |
| POST | `/api/listings/bulk` | Bulk insert business records |
| GET | `/api/listings` | Retrieve business listings |
| GET | `/api/dashboard/summary` | Dashboard summary metrics |
| GET | `/api/dashboard/city-wise` | City-wise listing counts |
| GET | `/api/dashboard/category-wise` | Category-wise listing counts |
| GET | `/api/dashboard/source-wise` | Source-wise listing counts |

## Sample Dataset

The project uses 600 generated sample records for testing the database, API endpoints, dashboard metrics, charts, and search functionality.

The source field identifies the records as `Sample Dataset (Synthetic)`. No claim is made that these records were collected from live business directories.

## Challenges and Solutions

- **MySQL connectivity:** Configured SQLAlchemy with PyMySQL and environment-based database settings.
- **API integration:** Connected the React frontend to FastAPI endpoints.
- **Data visualization:** Used Recharts to display city-wise and category-wise business distributions.
- **Search and sorting:** Implemented dynamic filtering and column sorting in the business listings table.
- **Bulk data insertion:** Implemented a FastAPI endpoint to insert multiple records into MySQL.

## Future Improvements

- Integrate verified business directory data sources.
- Add pagination and advanced filters.
- Add user authentication and role-based access.
- Add data export to CSV and Excel.
- Add additional analytics and reporting features.

## Author

**Pankaj Sonkar**

GitHub: https://github.com/pankaj071996

---

*Developed as a full-stack Business Listings Dashboard project using React, FastAPI, and MySQL.*
