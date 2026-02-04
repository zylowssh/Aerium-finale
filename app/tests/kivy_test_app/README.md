# Aerium Kivy Test App

A lightweight Kivy application that mirrors the functionality of the Aerium Flask web application. This app pulls real-time CO2 readings, sensor data, and analytics from the webapp API.

## Features

- **Live Dashboard**: Real-time CO2 readings with temperature and humidity
- **Sensor List**: View all available sensors and their status
- **Today's Summary**: Min, max, and average CO2 levels for today
- **Recent Readings**: Display the last 24 hours of readings
- **Auto-Refresh**: Automatically updates data every 30 seconds
- **Responsive UI**: Built with KivyMD for a modern Material Design interface

## Prerequisites

- Python 3.8+
- The Aerium Flask webapp running on `http://localhost:5000`

## Installation

1. Navigate to the kivy_test_app folder:
```bash
cd app/tests/kivy_test_app
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the App

From the `kivy_test_app` folder:

```bash
python kivy_app.py
```

The app will:
- Connect to the Flask webapp API at `http://localhost:5000`
- Display the same data shown in the web dashboard
- Automatically refresh every 30 seconds

## Screens

### Dashboard Screen
- Latest CO2 reading with temperature and humidity
- List of available sensors with status
- Today's summary statistics
- Recent readings from the last 24 hours
- Refresh and navigate to sensors detail

### Sensors Detail Screen
- Comprehensive list of all sensors
- Sensor status, location, and last reading
- Back and refresh buttons

## Data Sources

The app pulls data from the following webapp endpoints:
- `/api/latest` - Latest CO2 reading
- `/api/sensors` - Available sensors
- `/api/sensor/<id>/readings` - Sensor-specific readings
- `/api/history/today` - Today's readings history
- `/api/readings` - Recent readings

## Configuration

To connect to a different API endpoint, modify the `APIManager` initialization in `kivy_app.py`:

```python
self.api_manager = APIManager(base_url="http://your-host:5000")
```

## Troubleshooting

- **Connection Error**: Ensure the Flask webapp is running on `http://localhost:5000`
- **No Data Displayed**: Check that you're logged in to the webapp and have sensors configured
- **Import Errors**: Make sure all dependencies from `requirements.txt` are installed

## Architecture

- **APIManager**: Handles all HTTP requests to the Flask backend
- **DashboardScreen**: Main screen showing real-time data and summaries
- **SensorsDetailScreen**: Detailed view of all sensors
- **AeriumKivyApp**: Main application class managing the UI

## Notes

- The app uses threading to avoid blocking the UI during API calls
- All data comes directly from the webapp's REST API
- The app is designed for testing and monitoring purposes
