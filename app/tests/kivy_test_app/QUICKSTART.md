# Quick Start Guide - Aerium Kivy Test App

## What is this?

This is a mobile-like Kivy test application that mirrors the Flask web application's data display. It pulls the same sensor data and readings from the webapp API and displays them in a modern Material Design interface.

## Get Started in 3 Steps

### Step 1: Ensure Flask App is Running
Make sure your Aerium Flask webapp is running:
```bash
# From the site folder
python app.py
```

The webapp should be accessible at `http://localhost:5000`

### Step 2: Install Dependencies
From this folder (`app/tests/kivy_test_app`):

```bash
pip install -r requirements.txt
```

Or simply run the batch file (Windows):
```bash
run.bat
```

### Step 3: Launch the App
```bash
python kivy_app.py
```

Or double-click `run.bat` on Windows.

## What You'll See

**Dashboard Screen:**
- Latest CO2 reading with temperature and humidity
- List of available sensors
- Today's min/max/average CO2 levels
- Recent readings timeline

**Sensors Detail Screen:**
- Complete sensor information
- Individual sensor status
- Location and last reading data

## Key Features

✅ **Real-Time Data**: Updates every 30 seconds  
✅ **Same Data as Webapp**: Pulls from the same API endpoints  
✅ **Auto-Refresh**: No manual refresh needed  
✅ **Dark Theme**: Easy on the eyes  
✅ **Responsive**: Works on different screen sizes  

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Connection refused | Ensure Flask app is running on localhost:5000 |
| No sensors shown | Login to webapp and create sensors first |
| Import error | Run `pip install -r requirements.txt` |
| Blank screen | Check Flask app is serving data correctly |

## API Endpoints Used

The app connects to these Flask API endpoints:
- `GET /api/latest` - Current reading
- `GET /api/sensors` - All sensors
- `GET /api/history/today` - Today's readings
- `GET /api/readings?days=1` - Recent readings

## Changing the API Host

If your Flask app runs on a different host/port, edit line in `kivy_app.py`:

```python
self.api_manager = APIManager(base_url="http://your-host:port")
```

## Next Steps

- Modify the UI in `kivy_app.py` to add more features
- Create additional screens for analytics
- Add sensor-specific data visualization
- Implement real-time WebSocket updates

---

**Note**: This is a test/development app. For production use, consider adding authentication and error handling improvements.
