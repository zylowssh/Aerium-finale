# Aerium Kivy Test App - Project Summary

## Overview

Created a complete Kivy test application that mirrors the functionality of your Aerium Flask web application. The Kivy app pulls data directly from the webapp's REST API and displays it in a modern Material Design interface.

## Project Structure

```
app/tests/kivy_test_app/
├── kivy_app.py                    # Main application file
├── requirements.txt               # Python dependencies
├── run.bat                        # Windows startup script
├── README.md                      # Comprehensive documentation
├── QUICKSTART.md                  # Quick start guide
└── config_and_testing.py          # Configuration reference & testing guide
```

## Key Features

### ✅ Dashboard Screen
- **Real-Time Data**: Latest CO2 reading with temperature and humidity
- **Sensor List**: View all available sensors and their status
- **Today's Summary**: Min, max, and average CO2 levels
- **Recent Readings**: Last 24 hours of readings in chronological order
- **Auto-Refresh**: Automatically updates every 30 seconds

### ✅ Sensors Detail Screen
- Complete sensor information and status
- Location and last reading data
- Full sensor list navigation
- Back and refresh buttons

### ✅ Technical Implementation
- **Threading**: Non-blocking API calls to prevent UI freezing
- **API Integration**: Uses the same endpoints as the webapp
- **Error Handling**: Graceful fallbacks for connection failures
- **Modern UI**: Material Design with dark theme
- **Responsive**: Adapts to different screen sizes

## API Integration

The app connects to these Flask endpoints:

| Endpoint | Purpose | Data |
|----------|---------|------|
| `/api/latest` | Current reading | CO2, temp, humidity, timestamp |
| `/api/sensors` | All sensors | Name, status, location, last reading |
| `/api/history/today` | Today's data | Hourly readings throughout the day |
| `/api/readings?days=1` | Recent readings | Last 24 hours of data |

## Data Flow

```
Flask Webapp (http://localhost:5000)
         ↓
   API Endpoints
         ↓
   APIManager (requests)
         ↓
   Kivy Screens
         ↓
   User Display
```

## Installation & Usage

### Quick Setup
```bash
# Navigate to kivy_test_app folder
cd app/tests/kivy_test_app

# Install dependencies
pip install -r requirements.txt

# Run the app
python kivy_app.py
```

### Windows Users
Simply double-click `run.bat` to install dependencies and launch automatically.

### Requirements
- Python 3.8+
- Flask webapp running on `http://localhost:5000`
- Dependencies: KivyMD, Kivy, requests

## Architecture

### Components

1. **APIManager Class**
   - Handles all HTTP requests to Flask backend
   - Methods for each API endpoint
   - Error handling and logging

2. **DashboardScreen Class**
   - Main UI screen
   - Displays latest readings and summary
   - Auto-refresh mechanism
   - Navigation to detail screens

3. **SensorsDetailScreen Class**
   - Detailed sensor information
   - Full sensor list
   - Navigation back to dashboard

4. **AeriumKivyApp Class**
   - Main application class
   - Screen manager
   - Theme configuration

## Same Data as Webapp

All data displayed in the Kivy app comes directly from the Flask webapp's API:
- **Same CO2 readings**: No conversion or modification
- **Same sensors**: Identical sensor list and properties
- **Same timestamps**: ISO 8601 format from the database
- **Same calculations**: Min/max/avg computed on same raw data

This makes it ideal for testing that the API is working correctly and displaying the same data across different interfaces.

## Customization

### Change API Host
Edit the APIManager initialization in `kivy_app.py`:
```python
self.api_manager = APIManager(base_url="http://your-host:5000")
```

### Adjust Refresh Rate
Change the auto-refresh interval in `DashboardScreen.on_enter()`:
```python
Clock.schedule_interval(self.auto_refresh, 60)  # 60 seconds instead of 30
```

### Modify UI Theme
Update the app theme in `MorpheusKivyApp.build()`:
```python
self.theme_cls.theme_style = "Light"  # Change to Light theme
self.theme_cls.primary_palette = "Green"  # Change primary color
```

## Troubleshooting

### Connection Issues
- Ensure Flask app is running: `python site/app.py`
- Check URL is correct: `http://localhost:5000`
- Verify API is responding: Open URL in browser

### No Data Displayed
- Login to webapp first
- Create sensors in the webapp
- Check sensor is active

### Import Errors
```bash
pip install -r requirements.txt --upgrade
```

### Kivy Display Issues
- Try adjusting screen size
- Update KivyMD: `pip install --upgrade kivymd`

## Testing Checklist

- [ ] Flask app running
- [ ] Can connect to API endpoints
- [ ] Latest reading displays
- [ ] Sensors list shows
- [ ] Auto-refresh works (every 30s)
- [ ] Navigation between screens works
- [ ] Refresh button updates data
- [ ] Timestamps format correctly
- [ ] Summary stats calculate correctly
- [ ] No errors in terminal

## Files Overview

| File | Purpose | Size |
|------|---------|------|
| kivy_app.py | Main application code | ~450 lines |
| requirements.txt | Python dependencies | 3 packages |
| README.md | Full documentation | Comprehensive |
| QUICKSTART.md | Quick start guide | Simple steps |
| config_and_testing.py | Reference & testing | Configuration details |
| run.bat | Windows launcher | Automated setup |

## Future Enhancements

Possible additions:
- Real-time WebSocket updates (faster than 30s polling)
- Chart/graph visualization
- Historical data analysis
- Sensor-specific detail screens
- Alert/threshold notifications
- Data export functionality
- Multi-user authentication

## Support & Debugging

If issues occur:
1. Check Flask app is running
2. Verify API endpoints are accessible
3. Review logs in terminal
4. Check network connectivity
5. Ensure dependencies are installed

See `config_and_testing.py` for detailed debugging tips and sample data.

---

**Created**: January 6, 2026  
**Version**: 1.0  
**Status**: Ready for Testing
