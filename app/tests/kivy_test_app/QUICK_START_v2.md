# Kivy App - Quick Reference

## Run It Now

```bash
cd app/tests/kivy_test_app
python kivy_app.py
```

## What You'll See

Within 2-3 seconds:
1. App window opens
2. Shows "🎮 Simulation Mode"  
3. Large CO2 reading appears
4. Updates every 5-10 seconds
5. Color changes: 🟢 Excellent → 🟡 Fair → 🔴 Poor

## How It Works

**Default: SIMULATION MODE**
- Generates fake CO2 data
- No server needed
- Updates: every 5-10 seconds
- Perfect for testing

**To Switch to LIVE:**
1. Edit `kivy_app.py` line 9: `MODE = "LIVE"`
2. Ensure Flask running: `python site/app.py`
3. Run: `python kivy_app.py`

## Configuration

Edit `kivy_app.py`:
```python
SERVER_URL = "http://localhost:5000"  # Line 8
MODE = "SIMULATION"                   # Line 9
```

## What's New

✅ Fixed all KivyMD 2.0+ errors
✅ WebSocket + Simulation modes
✅ Real-time or demo ready
✅ Single screen, clean UI
✅ Color-coded quality

## UI Layout

```
┌─────────────────────────────┐
│  Aerium CO₂ Monitor       │
│  (SIMULATION)               │
├─────────────────────────────┤
│ ✅ Connected / 🎮 Simulation│
├─────────────────────────────┤
│                             │
│      550 ppm                │
│   T: 22.1°C | H: 43%        │
│     🟡 Fair                 │
│  Last update: 14:30:00      │
│                             │
├─────────────────────────────┤
│ Threshold: <800 <1200       │
│ Server: localhost:5000      │
├─────────────────────────────┤
│ 🔄 Reconnect  📊 Update     │
└─────────────────────────────┘
```

## Buttons

- **🔄 Reconnect** - Force reconnection
- **📊 Update** - Request data now

## Data

Shows real-time:
- CO2 level (ppm)
- Temperature (°C)
- Humidity (%)
- Quality rating
- Last update time

## Quality Levels

| Color | Range | Text |
|-------|-------|------|
| 🟢 | <800 | Excellent |
| 🟡 | 800-1200 | Fair |
| 🔴 | >1200 | Poor |

## Troubleshooting

**No data appears?**
- Wait 5-10 seconds (simulation)
- Check Flask running (live mode)

**Connection error?**
- Check SERVER_URL
- Verify Flask server address
- Try 🔄 Reconnect button

**Font errors?**
- Already fixed ✅
- All errors resolved

## Files

- `kivy_app.py` - Main application (350 lines)
- `requirements.txt` - Dependencies
- `WEBSOCKET_SIMULATION_GUIDE.md` - Full guide
- `TRANSFORMATION_SUMMARY.md` - What changed

## Install Dependencies

```bash
pip install -r requirements.txt
pip install python-socketio websocket-client
```

## Status

✅ Ready to run immediately
✅ Works in SIMULATION mode
✅ Ready for Flask integration
✅ No configuration needed

---

**Just run:** `python kivy_app.py`
