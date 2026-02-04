# Installation & Testing Guide

## Prerequisites Check

Before installing, verify you have:
- Python 3.8 or higher installed
- Flask webapp running or accessible
- Internet connection for downloading packages

## Step-by-Step Installation

### 1. Navigate to the Kivy App Directory

**Windows (PowerShell/CMD):**
```bash
cd C:\Users\01\Documents\Aerium\app\tests\kivy_test_app
```

**Linux/Mac:**
```bash
cd ~/Documents/Aerium/app/tests/kivy_test_app
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**What gets installed:**
- `kivy==2.2.1` - Core Kivy framework
- `kivymd==0.104.2` - Material Design components
- `requests==2.31.0` - HTTP client library

**Installation time:** 5-10 minutes (first time)

### 3. Verify Installation

```bash
python -c "import kivy; import kivymd; import requests; print('All dependencies installed successfully!')"
```

If you see "All dependencies installed successfully!", you're ready to go!

## Launching the Application

### Option A: Command Line

```bash
python kivy_app.py
```

### Option B: Windows Batch File (Easiest)

```bash
run.bat
```

This will:
1. Check Python is installed
2. Install/update dependencies automatically
3. Launch the app

### Option C: Direct Python

```bash
python -m kivy.app kivy_app
```

## First Run Checklist

After launching, verify:

- [ ] Window opens with "Aerium - Live Data Monitor" title
- [ ] Dark theme is applied
- [ ] "Loading..." text appears initially
- [ ] After 2-3 seconds, data loads
- [ ] CO2 level displays in large text
- [ ] Sensors list appears
- [ ] "Refresh" and "Sensors" buttons are visible

## Testing the Data Display

### Test 1: Live Reading
- Check the latest CO2 reading displays
- Verify temperature and humidity are shown
- Confirm timestamp updates

### Test 2: Sensor List
- Count sensors displayed matches webapp
- Click "Sensors" button
- Verify all sensors appear with status

### Test 3: Auto-Refresh
- Wait 30 seconds
- Data should update automatically
- No manual action needed

### Test 4: Manual Refresh
- Click "Refresh" button
- Data updates immediately
- No error messages

### Test 5: Navigation
- Click "Sensors" button
- You navigate to sensors detail screen
- Click "Back" button
- You return to dashboard

## Troubleshooting Installation Issues

### Issue: "ModuleNotFoundError: No module named 'kivy'"

**Solution:**
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Issue: "Connection refused" Error at startup

**Solution:**
1. Ensure Flask webapp is running
2. Open http://localhost:5000 in browser
3. If not accessible, start Flask app:
```bash
cd path/to/site
python app.py
```

### Issue: ImportError for PIL/Pillow

**Solution:**
```bash
pip install pillow
```

### Issue: Windows can't find Python

**Solution:**
1. Ensure Python is in PATH
2. Or use full path: `C:\Python311\python.exe kivy_app.py`
3. Or right-click run.bat and "Edit" to use full path

### Issue: Kivy window won't open on Linux

**Solution:**
```bash
sudo apt-get install python3-dev python3-tk libsdl2-dev libsdl2-image-dev
pip install -r requirements.txt
```

## Testing with Sample Data

The app works with any data in your Flask webapp. If you want to test with guaranteed data:

1. Generate sample readings in Flask:
```python
# In Flask app
from utils.fake_co2 import generate_co2_data
for i in range(10):
    data = generate_co2_data()
    print(data)  # Returns sample CO2 data
```

2. Or import sample CSV in webapp UI

3. Then run Kivy app - it will display the sample data

## Performance Testing

Test app responsiveness:

1. **Startup Time**: From launch to data displayed
   - Target: < 5 seconds
   
2. **Refresh Time**: Click refresh to data update
   - Target: < 3 seconds
   
3. **UI Responsiveness**: Click buttons while loading
   - Target: UI stays responsive
   
4. **Memory**: Monitor while running
   - Check Task Manager (Windows) or Activity Monitor (Mac)
   - Target: < 200 MB

## Uninstalling

To remove the app and dependencies:

```bash
# Remove just the app folder
rmdir app\tests\kivy_test_app

# Or uninstall Python packages
pip uninstall kivy kivymd requests
```

## Next Steps After Installation

1. **Explore the Code**: Read `kivy_app.py` comments
2. **Customize**: Change theme colors, refresh rate, etc.
3. **Extend**: Add new screens or features
4. **Test**: Verify all data matches webapp
5. **Deploy**: Use on different machines/networks

## Getting Help

If you encounter issues:

1. Check the README.md for full documentation
2. Review QUICKSTART.md for simple usage
3. Check config_and_testing.py for technical details
4. Review error messages in terminal output
5. Ensure Flask webapp is running and accessible

## System Requirements Summary

| Component | Requirement | Check Command |
|-----------|-------------|----------------|
| Python | 3.8+ | `python --version` |
| pip | Latest | `pip --version` |
| kivy | 2.2.1+ | `python -c "import kivy; print(kivy.__version__)"` |
| kivymd | 0.104.2+ | `python -c "import kivymd; print(kivymd.__version__)"` |
| requests | 2.31.0+ | `python -c "import requests; print(requests.__version__)"` |

---

**Estimated Setup Time:** 10-15 minutes  
**Difficulty Level:** Beginner-Friendly  
**Support:** See README.md or config_and_testing.py
