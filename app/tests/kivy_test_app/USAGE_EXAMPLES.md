# Aerium Kivy App - Usage Examples & Scenarios

## Scenario 1: Daily Monitoring

**Goal**: Monitor CO2 levels throughout the day

**Steps**:
1. Launch the Kivy app (via `run.bat` or `python kivy_app.py`)
2. View the dashboard with latest reading
3. Check "Today's Summary" for min/max/avg
4. Watch recent readings update every 30 seconds
5. No action needed - auto-refresh keeps data current

**What You See**:
```
Latest Reading: 545 ppm
Temp: 22.1°C | Humidity: 43%

Today's Summary:
Min: 420 ppm | Max: 680 ppm | Avg: 550 ppm

Recent Readings (Last 24 Hours):
08:00: 480 ppm
09:00: 495 ppm
10:00: 510 ppm
...
```

---

## Scenario 2: Comparing Multiple Sensors

**Goal**: Check CO2 levels across different rooms

**Steps**:
1. Click "Sensors" button on dashboard
2. View all available sensors and their latest readings
3. Compare readings between sensors
4. Check last reading timestamp for each sensor
5. Return to dashboard to monitor favorite sensor

**What You See**:
```
Available Sensors:

Office - Active
Last Reading: 545 ppm

Meeting Room A - Active
Last Reading: 620 ppm

Conference Room - Inactive
Last Reading: N/A

Break Room - Active
Last Reading: 580 ppm
```

---

## Scenario 3: Troubleshooting: No Data Appears

**Problem**: App shows "Loading..." but data doesn't load

**Diagnosis Steps**:
1. Check Flask app is running (`python site/app.py`)
2. Verify URL: Open `http://localhost:5000` in browser
3. Check if you're logged in to the webapp
4. Verify sensors exist (create one if needed)

**Resolution**:
- App requires Flask to be running
- App requires at least one active sensor
- App requires login session if authentication is enabled

---

## Scenario 4: Testing API Connectivity

**Goal**: Verify the API is working correctly

**Manual Testing**:

```python
import requests

# Test endpoint connectivity
base_url = "http://localhost:5000"

# Test 1: Latest reading
response = requests.get(f"{base_url}/api/latest")
print("Latest:", response.json())

# Test 2: Sensors
response = requests.get(f"{base_url}/api/sensors")
print("Sensors:", response.json())

# Test 3: Today's history
response = requests.get(f"{base_url}/api/history/today")
print("Today:", response.json())
```

**Expected Results**:
- All requests return HTTP 200
- Data contains CO2 readings and timestamps
- Sensor list is not empty

---

## Scenario 5: Customizing the Kivy App

**Goal**: Change colors, fonts, or refresh rate

**Example 1: Change Theme Color**

In `kivy_app.py`, modify `build()` method:
```python
def build(self):
    self.theme_cls.theme_style = "Light"  # Change to Light theme
    self.theme_cls.primary_palette = "Green"  # Change to Green
    # ... rest of code
```

**Example 2: Change Refresh Rate**

In `DashboardScreen.__init__()`:
```python
# Change from 30 seconds to 60 seconds
Clock.schedule_interval(self.auto_refresh, 60)
```

**Example 3: Change API Host**

In `AeriumKivyApp.__init__()`:
```python
self.api_manager = APIManager(
    base_url="http://192.168.1.100:5000"  # Your custom host
)
```

---

## Scenario 6: Data Export from Kivy App

**Goal**: Save displayed data to a file

**Method**: Add export button to dashboard

```python
def export_readings(self):
    """Export current readings to CSV"""
    import csv
    from datetime import datetime
    
    filename = f"readings_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv"
    
    with open(filename, 'w', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(['Timestamp', 'PPM', 'Temperature', 'Humidity'])
        # Write data from self.readings_layout
    
    print(f"Exported to {filename}")
```

---

## Scenario 7: Integration with Other Systems

**Goal**: Use Kivy app as monitoring frontend for a larger system

**Possible Integrations**:

1. **Alerting System**
```python
# In update_latest() method
if ppm > THRESHOLD:
    send_alert(f"High CO2: {ppm} ppm")
```

2. **Database Logging**
```python
# Save readings to local database
import sqlite3
db = sqlite3.connect('local_readings.db')
db.execute("INSERT INTO readings VALUES (?, ?)", (ppm, timestamp))
```

3. **Email Notifications**
```python
if avg_ppm > WARNING_LEVEL:
    send_email(f"High CO2 average: {avg_ppm} ppm")
```

---

## Scenario 8: Performance Monitoring

**Goal**: Track app performance and response times

**Method**: Add timing to API calls

```python
import time

def measure_api_performance(self):
    """Measure API response times"""
    
    # Test /api/latest
    start = time.time()
    latest = self.api_manager.get_latest_reading()
    latest_time = time.time() - start
    
    # Test /api/sensors
    start = time.time()
    sensors = self.api_manager.get_sensors()
    sensors_time = time.time() - start
    
    print(f"API Performance:")
    print(f"  Latest: {latest_time:.2f}s")
    print(f"  Sensors: {sensors_time:.2f}s")
```

**Target Performance**:
- API calls: < 2 seconds
- UI updates: < 100ms
- Full data load: < 5 seconds

---

## Scenario 9: Running on Different Network

**Goal**: Access Flask app on different computer

**Setup**:
1. Find Flask app host IP (e.g., 192.168.1.50)
2. Edit `kivy_app.py`:
```python
self.api_manager = APIManager(base_url="http://192.168.1.50:5000")
```
3. Run Kivy app on different computer
4. Data flows across network from Flask to Kivy

**Network Requirements**:
- Both computers on same network
- Port 5000 accessible (firewall)
- Flask app running and accessible

---

## Scenario 10: Debugging Common Issues

### Issue: Sensor readings show 0 or N/A

**Cause**: Sensor not generating/transmitting data

**Debug**:
```python
# Check sensor status
sensors = requests.get("http://localhost:5000/api/sensors").json()
for sensor in sensors:
    print(f"{sensor['name']}: {sensor['last_reading_ppm']} ppm")
```

### Issue: Timestamps are in wrong timezone

**Cause**: Timezone offset in ISO format

**Fix**:
```python
from datetime import datetime

timestamp = "2026-01-06T14:30:00+00:00"
# This is UTC, add timezone handling:
dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
local_time = dt.astimezone()  # Convert to local timezone
```

### Issue: Auto-refresh not working

**Cause**: Clock.schedule_interval may be cancelled

**Fix**:
```python
# Store schedule reference
self.refresh_event = Clock.schedule_interval(self.auto_refresh, 30)

# Later, if needed:
# self.refresh_event.cancel()
```

---

## Quick Reference

### Common Commands

```bash
# Start app
python kivy_app.py

# Start with full paths (Windows)
C:\Python311\python.exe kivy_app.py

# Run with logging
python -u kivy_app.py

# Check logs
# Windows: See console output
# Linux: kivy_app.log
```

### Key Files to Modify

| Change | File | Location |
|--------|------|----------|
| Colors | kivy_app.py | `build()` method |
| Refresh rate | kivy_app.py | `DashboardScreen` class |
| API host | kivy_app.py | `AeriumKivyApp.__init__()` |
| API timeout | kivy_app.py | `APIManager.__init__()` |
| Screen layout | kivy_app.py | Screen classes |

---

## Support & Further Help

For more information:
- **Installation**: See `INSTALLATION_GUIDE.md`
- **Quick Start**: See `QUICKSTART.md`
- **Full Docs**: See `README.md`
- **Technical Details**: See `config_and_testing.py`
- **Project Info**: See `PROJECT_SUMMARY.md`

---

**Last Updated**: January 6, 2026
