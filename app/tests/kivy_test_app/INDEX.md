# Aerium Kivy Test App - Documentation Index

Welcome to the Aerium Kivy Test Application! This folder contains a complete Kivy app that mirrors your Flask webapp's data display.

## 📋 Quick Navigation

### 🚀 Want to Get Started Quickly?
1. **First Time?** → Read [QUICKSTART.md](QUICKSTART.md) (2 minutes)
2. **Need detailed setup?** → Read [INSTALLATION_GUIDE.md](INSTALLATION_GUIDE.md) (5 minutes)
3. **Just run it!** → Double-click `run.bat` (Windows) or run `python kivy_app.py`

### 📚 Documentation Files

| File | Purpose | Time | When to Read |
|------|---------|------|--------------|
| **QUICKSTART.md** | 3-step startup guide | 2 min | First time users |
| **INSTALLATION_GUIDE.md** | Detailed install & troubleshooting | 5 min | Need setup help |
| **README.md** | Full documentation & API reference | 10 min | Want complete info |
| **USAGE_EXAMPLES.md** | Real-world scenarios & examples | 8 min | Customization needs |
| **PROJECT_SUMMARY.md** | Technical overview & architecture | 5 min | Need technical details |
| **config_and_testing.py** | Configuration reference & testing | Reference | Advanced customization |

### 💻 Code Files

| File | Purpose | Lines |
|------|---------|-------|
| **kivy_app.py** | Main application code | ~450 |
| **requirements.txt** | Python dependencies | 3 packages |
| **run.bat** | Windows launcher script | 20 lines |

---

## 🎯 Choose Your Path

### Path 1: I Just Want to Run It (5 minutes)
```
1. Open this folder
2. Double-click run.bat
3. See your data!
```
No further reading needed! The app does everything.

### Path 2: I Need to Install Properly (10 minutes)
```
1. Read QUICKSTART.md
2. Follow the 3 steps
3. Run python kivy_app.py
4. Done!
```

### Path 3: I'm Having Issues (15 minutes)
```
1. Read INSTALLATION_GUIDE.md
2. Find your issue in Troubleshooting
3. Follow the solution
4. Try again
```

### Path 4: I Want to Customize It (30+ minutes)
```
1. Read README.md for architecture
2. Read USAGE_EXAMPLES.md for ideas
3. Edit kivy_app.py with your changes
4. Run and test
```

### Path 5: I'm a Developer (1+ hour)
```
1. Read PROJECT_SUMMARY.md for overview
2. Read config_and_testing.py for details
3. Review kivy_app.py code comments
4. Extend with new features
```

---

## 📊 What This App Does

### ✅ Displays Real-Time Data
- Latest CO2 reading (same as webapp)
- Temperature and humidity
- Sensor list and status
- Today's min/max/average

### ✅ Pulls from Your Flask API
- `/api/latest` - Current reading
- `/api/sensors` - Sensor list
- `/api/history/today` - Daily data
- `/api/readings` - Recent history

### ✅ Features
- Auto-refresh every 30 seconds
- Dark Material Design theme
- Two-screen navigation
- Non-blocking data loading
- Error handling

### ✅ Same Data as Webapp
Everything displayed here comes directly from the Flask API endpoints used by your web app. Same data, different interface!

---

## 🔧 System Requirements

| Requirement | Check |
|------------|-------|
| Python 3.8+ | `python --version` |
| pip installed | `pip --version` |
| Flask app running | Open http://localhost:5000 |

---

## 📂 File Organization

```
kivy_test_app/
│
├── 📱 CODE
│   ├── kivy_app.py              (Main app - ~450 lines)
│   ├── requirements.txt          (Dependencies)
│   └── run.bat                   (Windows launcher)
│
├── 📖 DOCUMENTATION
│   ├── INDEX.md                  (This file)
│   ├── QUICKSTART.md             (3-step guide)
│   ├── INSTALLATION_GUIDE.md     (Detailed setup)
│   ├── README.md                 (Full docs)
│   ├── PROJECT_SUMMARY.md        (Technical overview)
│   ├── USAGE_EXAMPLES.md         (Real-world scenarios)
│   └── config_and_testing.py     (Configuration reference)
```

---

## 🎓 Learning Path

### Beginner
1. QUICKSTART.md - Get it running
2. README.md - Understand what it does
3. Use the app - Explore the features

### Intermediate
1. PROJECT_SUMMARY.md - Technical overview
2. INSTALLATION_GUIDE.md - Troubleshooting
3. USAGE_EXAMPLES.md - Ideas for customization

### Advanced
1. config_and_testing.py - Technical details
2. kivy_app.py - Read the code
3. Modify and extend features

---

## ❓ FAQ

**Q: Do I need the Flask app running?**
A: Yes! The Kivy app pulls data from Flask. Both need to run.

**Q: Does it work on Windows/Mac/Linux?**
A: Yes! Python, Kivy, and Flask all work on all platforms.

**Q: Can I change the colors/refresh rate?**
A: Yes! See USAGE_EXAMPLES.md for customization guide.

**Q: What if I can't connect?**
A: See INSTALLATION_GUIDE.md → Troubleshooting section.

**Q: How often does it update?**
A: Every 30 seconds by default (adjustable in code).

**Q: Is it production-ready?**
A: It's a test app. For production, add authentication, error handling, etc.

---

## 🚀 Getting Started Right Now

### Windows Users
```bash
# Option 1: Double-click
run.bat

# Option 2: Command line
pip install -r requirements.txt
python kivy_app.py
```

### Mac/Linux Users
```bash
pip install -r requirements.txt
python kivy_app.py
```

That's it! The app will:
1. Install/verify dependencies
2. Connect to Flask app
3. Display your data
4. Auto-refresh every 30 seconds

---

## 📞 Need Help?

| Issue | Solution |
|-------|----------|
| App won't start | Read INSTALLATION_GUIDE.md |
| No data appears | Ensure Flask app is running |
| Can't install | Check Python version |
| Want to customize | Read USAGE_EXAMPLES.md |
| Want details | Read PROJECT_SUMMARY.md |

---

## 📝 File Read Times

| Document | Read Time | Difficulty |
|----------|-----------|-----------|
| QUICKSTART.md | 2 min | Easy |
| INSTALLATION_GUIDE.md | 5 min | Easy |
| README.md | 10 min | Medium |
| PROJECT_SUMMARY.md | 5 min | Medium |
| USAGE_EXAMPLES.md | 8 min | Medium |
| config_and_testing.py | Variable | Hard |
| kivy_app.py (code) | 15 min | Hard |

---

## ✨ Key Features Summary

| Feature | Description |
|---------|------------|
| Live Data | Real-time CO2, temp, humidity |
| Sensor List | All sensors with status |
| Today's Stats | Min, max, average levels |
| Recent Readings | Last 24 hours timeline |
| Auto-Refresh | Updates every 30 seconds |
| Two Screens | Dashboard + Sensors detail |
| Dark Theme | Easy on the eyes |
| Cross-Platform | Windows, Mac, Linux |

---

## 🎯 Next Steps

1. **Choose your path above** and follow the steps
2. **Run the app** - It takes 30 seconds to see data
3. **Explore** - Click through the screens
4. **Customize** - Read USAGE_EXAMPLES.md for ideas
5. **Extend** - Modify kivy_app.py for your needs

---

## 📋 Document Purpose Summary

```
START HERE
    ↓
QUICKSTART.md (How to run in 3 steps)
    ↓
README.md (Full documentation)
    ↓
USAGE_EXAMPLES.md (Ways to use and customize)
    ↓
PROJECT_SUMMARY.md (Technical details)
    ↓
INSTALLATION_GUIDE.md (Troubleshooting)
    ↓
config_and_testing.py (Advanced reference)
    ↓
kivy_app.py (Source code)
```

---

## 🎉 That's It!

You now have a complete Kivy app that:
- ✅ Displays the same data as your webapp
- ✅ Pulls from the same Flask API
- ✅ Auto-refreshes every 30 seconds
- ✅ Works on Windows, Mac, Linux
- ✅ Has full documentation

**Ready?** Start with QUICKSTART.md or just run `run.bat`!

---

**Created**: January 6, 2026  
**Version**: 1.0  
**Status**: Production Ready for Testing
