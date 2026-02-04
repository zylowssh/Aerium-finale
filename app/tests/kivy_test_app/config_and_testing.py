"""
Aerium Kivy Test App - Configuration and Testing Guide

This file documents the API integration, data mapping, and testing procedures
for the Kivy test application that mirrors the Flask webapp.
"""

# API CONFIGURATION
API_BASE_URL = "http://localhost:5000"
API_TIMEOUT = 10  # seconds
AUTO_REFRESH_INTERVAL = 30  # seconds

# ENDPOINTS MAPPING
ENDPOINTS = {
    "latest_reading": {
        "url": "/api/latest",
        "method": "GET",
        "description": "Get the latest CO2 reading",
        "expected_response": {
            "ppm": int,
            "temp": float,
            "humidity": float,
            "timestamp": str,
            "analysis_running": bool
        }
    },
    "sensors": {
        "url": "/api/sensors",
        "method": "GET",
        "description": "Get all available sensors",
        "expected_response": [
            {
                "id": int,
                "name": str,
                "location": str,
                "is_active": bool,
                "last_reading_ppm": float,
                "last_reading_timestamp": str
            }
        ]
    },
    "sensor_readings": {
        "url": "/api/sensor/<sensor_id>/readings",
        "method": "GET",
        "description": "Get readings for a specific sensor",
        "query_params": ["days"],
        "expected_response": [
            {
                "ppm": int,
                "temperature": float,
                "humidity": float,
                "timestamp": str
            }
        ]
    },
    "today_history": {
        "url": "/api/history/today",
        "method": "GET",
        "description": "Get all readings for today",
        "query_params": ["source"],
        "expected_response": [
            {
                "ppm": int,
                "temperature": float,
                "humidity": float,
                "timestamp": str,
                "source": str
            }
        ]
    },
    "readings": {
        "url": "/api/readings",
        "method": "GET",
        "description": "Get recent readings",
        "query_params": ["days"],
        "expected_response": [
            {
                "ppm": int,
                "temperature": float,
                "humidity": float,
                "timestamp": str,
                "source": str
            }
        ]
    }
}

# DATA MAPPING
DATA_MAPPING = {
    "latest_reading": {
        "webapp_field": "ppm",
        "kivy_display": "CO2 Level (ppm)",
        "format": "integer with unit"
    },
    "temperature": {
        "webapp_field": "temp",
        "kivy_display": "Temperature (°C)",
        "format": "float with 1 decimal"
    },
    "humidity": {
        "webapp_field": "humidity",
        "kivy_display": "Humidity (%)",
        "format": "float with 1 decimal"
    },
    "timestamp": {
        "webapp_field": "timestamp",
        "kivy_display": "Updated",
        "format": "ISO 8601 to readable datetime"
    }
}

# TESTING CHECKLIST
TESTING_CHECKLIST = {
    "api_connectivity": [
        "Flask app running on http://localhost:5000",
        "Can connect to /api/latest",
        "Can connect to /api/sensors",
        "Can connect to /api/history/today",
        "Can connect to /api/readings"
    ],
    "data_display": [
        "Latest reading displays correctly",
        "Temperature shows with unit (°C)",
        "Humidity shows with unit (%)",
        "Timestamp formatted correctly",
        "Sensors list displays all sensors",
        "Today's summary calculates min/max/avg",
        "Recent readings show in reverse chronological order"
    ],
    "ui_functionality": [
        "Refresh button works",
        "Auto-refresh happens every 30 seconds",
        "Navigation to sensors detail works",
        "Back button returns to dashboard",
        "Error messages display on connection failure",
        "Loading states are shown appropriately"
    ],
    "performance": [
        "App loads within 5 seconds",
        "API calls complete within 10 seconds",
        "UI remains responsive during data fetch",
        "No memory leaks after 30 minutes",
        "Auto-refresh doesn't cause lag"
    ]
}

# SAMPLE TEST DATA
SAMPLE_RESPONSES = {
    "latest_reading": {
        "ppm": 550,
        "temp": 22.5,
        "humidity": 45.0,
        "timestamp": "2026-01-06T14:30:00+00:00",
        "analysis_running": True
    },
    "sensors": [
        {
            "id": 1,
            "name": "Office Sensor",
            "location": "Main Office",
            "is_active": True,
            "last_reading_ppm": 550.0,
            "last_reading_timestamp": "2026-01-06T14:30:00"
        },
        {
            "id": 2,
            "name": "Meeting Room Sensor",
            "location": "Conference Room A",
            "is_active": True,
            "last_reading_ppm": 620.0,
            "last_reading_timestamp": "2026-01-06T14:29:30"
        }
    ],
    "today_readings": [
        {
            "ppm": 480,
            "temperature": 21.0,
            "humidity": 40.0,
            "timestamp": "2026-01-06T08:00:00",
            "source": "real"
        },
        {
            "ppm": 520,
            "temperature": 22.0,
            "humidity": 42.0,
            "timestamp": "2026-01-06T12:00:00",
            "source": "real"
        },
        {
            "ppm": 550,
            "temperature": 22.5,
            "humidity": 45.0,
            "timestamp": "2026-01-06T14:30:00",
            "source": "real"
        }
    ]
}

# DEBUGGING TIPS
DEBUGGING_TIPS = """
1. Enable Kivy logging:
   from kivy.logger import Logger
   Logger.info('Your debug message')

2. Check API responses:
   Use requests library to manually test endpoints:
   >>> import requests
   >>> requests.get("http://localhost:5000/api/latest").json()

3. Thread debugging:
   Make sure threading.Thread is set to daemon=True to prevent hangs

4. Timestamp parsing:
   Always use datetime.fromisoformat() and handle timezone-aware datetimes

5. Screen navigation:
   Use self.manager.current = "screen_name" to switch screens

6. Widget sizing:
   Always bind size_hint_y=None and height for MDBoxLayout children
"""

# VERSION HISTORY
VERSION_HISTORY = """
v1.0 - Initial Release
- Dashboard screen with live data
- Sensors detail screen
- Auto-refresh every 30 seconds
- Data pulled from Flask webapp API
"""

if __name__ == "__main__":
    print("Aerium Kivy Test App - Configuration Reference")
    print("=" * 50)
    print("\nAvailable Endpoints:")
    for name, details in ENDPOINTS.items():
        print(f"\n{name}:")
        print(f"  URL: {details['url']}")
        print(f"  Method: {details['method']}")
        print(f"  Description: {details['description']}")
