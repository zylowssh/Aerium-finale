# Aerium Kivy App - WebSocket + Simulation Edition

## What's New

✅ **WebSocket Support** - Real-time connection to Flask SocketIO server  
✅ **Simulation Mode** - Built-in CO2 data simulator (no server needed)  
✅ **Fixed Font Styles** - KivyMD 2.0+ compatible (no more Display3 errors)  
✅ **Cleaner UI** - Simplified single-screen design  
✅ **Better Status Display** - Live connection status updates  

---

## How to Run

### Mode 1: Simulation (No Server Required)
Perfect for testing without Flask app:

```bash
# Edit kivy_app.py, set:
MODE = "SIMULATION"

# Then run:
python kivy_app.py
```

**What happens:**
- App generates random CO2 data
- Updates every 5-10 seconds
- Shows live quality indicators
- No connection needed

### Mode 2: Live (Requires Flask + SocketIO)
Connect to real data from Flask:

```bash
# First, ensure Flask server is running:
cd site
python app.py

# In kivy_app.py, set:
MODE = "LIVE"
SERVER_URL = "http://localhost:5000"

# Then run:
python kivy_app.py
```

**What happens:**
- Connects to Flask SocketIO server
- Receives real CO2 readings
- Auto-reconnects on disconnect
- Shows connection status

---

## Architecture Overview

### Simulation Mode
```
CO2MonitorScreen
       ↓
SimulationManager
       ↓
Random walk algorithm
       ↓
Generate: ppm, temp, humidity, timestamp
       ↓
Update UI every 5-10 seconds
```

### Live Mode
```
CO2MonitorScreen
       ↓
WebSocketManager
       ↓
python-socketio
       ↓
Flask SocketIO server
(http://localhost:5000)
       ↓
co2_update events
       ↓
Update UI in real-time
```

---

## UI Features

**Status Card**
- Shows connection status (🔌 Connecting / ✅ Connected / ❌ Error)
- Automatically updates

**CO2 Display**
- Large PPM reading
- Temperature and humidity
- Quality indicator (🟢 Excellent / 🟡 Fair / 🔴 Poor)
- Last update timestamp

**Info Card**
- Threshold configuration
- Server URL
- Data source

**Buttons**
- 🔄 Reconnect - Force reconnection
- 📊 Update - Request immediate data update

---

## Configuration

### In `kivy_app.py` line 8-9:

```python
SERVER_URL = "http://localhost:5000"  # Change to your server
MODE = "SIMULATION"                   # "LIVE" or "SIMULATION"
```

### Customization:

```python
# Change thresholds (line 90-91)
self.good_threshold = 800      # PPM
self.bad_threshold = 1200      # PPM

# Change update frequency (simulation mode):
# Line 135-138: adjust sleep time
time.sleep(random.randint(5, 10))  # Change to desired seconds
```

---

## Data Flow

### Simulation Data Structure
```python
{
    'ppm': 500,
    'temp': 22.3,
    'humidity': 42.5,
    'timestamp': '2026-01-06T14:30:00.123456',
    'source': 'simulation'
}
```

### Real Data (from Flask)
```python
{
    'ppm': 550,
    'temp': 22.1,
    'humidity': 43.0,
    'timestamp': '2026-01-06T14:30:00+00:00'
}
```

---

## Quality Indicators

| Range | Indicator | Color |
|-------|-----------|-------|
| < 800 | 🟢 Excellent | Green |
| 800-1200 | 🟡 Fair | Yellow |
| > 1200 | 🔴 Poor | Red |

---

## Troubleshooting

### Issue: "Connection refused" in LIVE mode
**Solution:**
1. Ensure Flask app is running: `python site/app.py`
2. Check SERVER_URL is correct
3. Verify Flask SocketIO support (needs Flask-SocketIO)

### Issue: No data appears
**Solution:**
1. Check console output for errors
2. In SIMULATION mode, wait 5-10 seconds
3. In LIVE mode, verify server is accessible

### Issue: Font style errors
**Solution:**
✅ Already fixed! Using valid KivyMD 2.0+ font styles:
- "Headline" instead of "Display3"
- "Title" instead of deprecated styles
- "Body" for regular text

---

## API Events (For LIVE mode)

The app expects these SocketIO events from Flask:

```python
# Server sends CO2 data
@socketio.on('co2_update')
def handle_co2_update(data):
    emit('co2_update', {
        'ppm': 550,
        'temp': 22.1,
        'humidity': 43.0,
        'timestamp': '2026-01-06T14:30:00'
    })

# Client requests data
client.emit('request_data')

# Server sends status
@socketio.on('connect')
def on_connect():
    emit('status', {'connected': True})
```

---

## Future Enhancements

- [ ] Add threshold adjustment UI
- [ ] Data history graph
- [ ] Multiple sensor support
- [ ] Data export to CSV
- [ ] Alert notifications
- [ ] Settings persistence
- [ ] Dark/Light theme toggle

---

## Technical Stack

- **Kivy 2.3.1** - UI Framework
- **KivyMD 2.0.1.dev0** - Material Design components
- **python-socketio** - WebSocket client
- **Python 3.12** - Runtime

---

## Tested On

✅ Windows 11 + Python 3.12  
✅ Intel HD Graphics  
✅ KivyMD 2.0+ (development version)  
✅ Flask + Flask-SocketIO  

---

## Quick Start Checklist

- [ ] Install python-socketio: `pip install python-socketio websocket-client`
- [ ] Choose MODE: "SIMULATION" (easy) or "LIVE" (needs Flask)
- [ ] For LIVE: ensure Flask server is running
- [ ] Run: `python kivy_app.py`
- [ ] Should see UI within 3-5 seconds
- [ ] Data updates every 5-10 seconds (SIMULATION) or real-time (LIVE)

---

**Status:** ✅ Ready to use!
