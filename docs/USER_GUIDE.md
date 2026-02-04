# 🎯 USER GUIDE - HOW TO USE EACH PAGE

## Overview
All 6 pages in the Aerium webapp are now fully functional with simulated data. Here's how to use each one.

---

## 1. 📤 Export Page (`/export`)

### What It Does
Allows you to export CO2 sensor data in multiple formats (CSV, JSON, Excel, PDF)

### How to Use
1. Navigate to **Export** in the main menu
2. **Select a Sensor** from the dropdown (e.g., "Capteur par défaut")
3. **Select Time Period** (7 days, 30 days, 90 days, etc.)
4. **Choose Format**: CSV, JSON, Excel, or PDF
5. **Click "Exporter Maintenant"** or **"Télécharger Rapidement"**
6. File downloads automatically with name like `co2_export_7d.csv`

### Features
- ✅ Multiple format support
- ✅ Quick export button
- ✅ Scheduled exports
- ✅ Export history
- ✅ Sensor selection
- ✅ Date range selection

### API Endpoint Used
```
POST /api/export/simulate
```

---

## 2. 📊 Analytics Page (`/analytics`)

### What It Does
Shows AI-powered insights about your air quality:
- **Predictions**: Next 2-24 hours of CO2 levels
- **Anomalies**: Unusual patterns detected
- **Insights**: Smart recommendations based on data

### How to Use

#### Predictions Tab
1. Open **Analytics** → **Predictions**
2. Select number of hours (2, 6, 12, 24)
3. Click "Load" or wait for auto-load
4. View hourly predictions with confidence levels
5. See visual bar chart of predicted CO2 levels

#### Anomalies Tab
1. Open **Analytics** → **Anomalies**
2. System automatically detects unusual patterns
3. View detected anomalies (if any)
4. See severity level (High, Medium, Low)
5. Review timestamp and value

#### Insights Tab
1. Open **Analytics** → **Insights**
2. Read AI-generated observations
3. Check recommendations
4. Review impact assessment

### Example Output
```
✓ Predictions for next 2 hours:
  +0h: 850 ppm (85% confidence)
  +2h: 920 ppm (82% confidence)

✓ Anomalies Detected:
  SUDDEN SPIKE - 1450 ppm - Severity: HIGH

✓ Insights:
  Peak activity detected: 14h-16h usually highest
  Recommendation: Increase ventilation during peak hours
```

### API Endpoints Used
```
GET /api/analytics/predictions?hours=N
GET /api/analytics/anomalies
GET /api/analytics/insights
```

---

## 3. 💚 Health Page (`/health`)

### What It Does
Evaluates your air quality and provides health recommendations

### How to Use
1. Open **Health** in the menu
2. View your **Health Score** (0-100)
3. See current **CO2 Level**
4. Read **Personalized Recommendations**
5. Follow action items for improvement

### Health Score Levels
- **Excellent** (95+): < 600 ppm - Perfect conditions
- **Good** (85+): 600-800 ppm - Acceptable
- **Moderate** (65): 800-1000 ppm - Needs ventilation
- **Poor** (40): 1000-1200 ppm - Open windows
- **Critical** (20): 1200+ ppm - Urgent action needed

### Sample Recommendations
1. **Aérer votre espace** - Open windows 10-15 minutes
2. **Améliorer la ventilation** - Use mechanical ventilation
3. **Planter des plantes vertes** - Plants absorb CO2
4. **Surveiller régulièrement** - Check levels daily

### API Endpoint Used
```
GET /api/health/recommendations
```

---

## 4. ⚡ Performance Page (`/performance`)

### What It Does
Shows system performance metrics and maintenance tools

### Sections

#### System Performance
- Response time
- Database queries/minute
- Cache hit rate
- System availability
- Active sessions
- Memory usage

#### Cache Management
- View cache status
- Cache size
- Hit rate percentage
- Cached records count
- **Clear Cache** button

#### Data Management
- **Archive Old Data**: Remove readings older than N days
- Estimated records to archive
- Estimated space to free
- Estimated processing time

### How to Use
1. Open **Performance**
2. Review metrics in **System Performance**
3. To clear cache:
   - Click **"Vider le Cache"**
   - Confirm action
4. To archive old data:
   - Scroll to **Archive**
   - Select number of days
   - Click **"Archiver"**

### API Endpoints Used
```
GET /api/system/performance
POST /api/system/cache/clear
POST /api/system/archive
```

---

## 5. 👥 Collaboration Page (`/collaboration`)

### What It Does
Manage teams, organizations, and share dashboards with colleagues

### Main Features

#### Teams
- Create new teams
- View team members
- Add team members by email
- Assign roles (admin, member, viewer)

#### Organizations
- Create organizations
- Manage members
- Define locations
- Set usage quotas
- Track resource usage

#### Dashboard Sharing
- Generate shareable links
- Share dashboards with specific people
- Track shared dashboards
- Revoke access anytime

### How to Use

**To Create a Team:**
1. Click **"Create Team"**
2. Enter team name
3. Click **"Create"**
4. Click **"Add Member"**
5. Enter member email and role

**To Share Dashboard:**
1. Click **"Share Dashboard"**
2. Select dashboard
3. Choose sharing settings
4. Get shareable link
5. Send link to colleagues

**To Manage Organization:**
1. Click **"Organization Settings"**
2. Add/remove members
3. Create locations
4. View quotas
5. Update settings

### API Endpoints Used
```
GET/POST /api/teams
GET/POST /api/organizations
POST /api/share/dashboard
POST /api/share/link
```

---

## 6. 📈 Visualization Page (`/visualization`)

### What It Does
Display advanced data visualizations with two main widgets

### Widget 1: 🔥 Carte Thermique 7×24h (Heatmap)

**What is it?**
A 24-hour × 7-day heat map showing CO2 patterns

**How to Read It:**
- **Rows**: Hours (0:00 to 23:00)
- **Columns**: Days (Mon-Sun)
- **Colors**:
  - 🟢 Green = Good (400-800 ppm)
  - 🟡 Yellow = Medium (800-1200 ppm)
  - 🔴 Red = Bad (1200+ ppm)

**How to Use:**
1. Click **"Générer une Carte Thermique"**
2. Wait for data to load
3. Hover over cells to see exact CO2 value
4. Identify patterns:
   - Is Friday worse than Monday?
   - Is morning better than afternoon?
   - Which day/hour combination is worst?

**How to Read Example:**
```
     Mon    Tue    Wed    Thu    Fri    Sat    Sun
00:  750    780    820    800    850    600    580  (Night)
12:  950   1050   1100    980   1200    900    750  (Noon peak)
18:  850    920    980    850    950    800    700  (Evening)
```
→ Friday at noon is the worst time (1200 ppm)

### Widget 2: 📊 Analyse de Corrélation (Correlation)

**What is it?**
Shows how other factors relate to CO2 levels

**How to Read It:**
- **Variable**: Factor being measured (Température, Humidité, etc.)
- **Corrélation**: Number from -1.0 to +1.0
  - **+1.0** = Perfect positive correlation (both increase together)
  - **-1.0** = Perfect negative correlation (one increases, other decreases)
  - **0.0** = No correlation
- **Force**: Strength classification:
  - **Forte** (Strong): |value| > 0.7
  - **Moyenne** (Medium): |value| 0.4-0.7
  - **Faible** (Weak): |value| < 0.4

**Example:**
```
Variable      | Correlation | Force
Temperature   | +0.68       | Moyenne    (higher temp = higher CO2)
Humidity      | -0.42       | Moyenne    (higher humidity = lower CO2)
Occupancy     | +0.85       | Forte      (more people = higher CO2)
Light         | +0.55       | Moyenne    (more light = more activity = higher CO2)
```

**How to Use:**
1. Click **"Charger les Corrélations"**
2. Review the correlation table
3. Identify strong relationships
4. Use insights for ventilation planning

### API Endpoints Used
```
GET /api/visualization/heatmap
GET /api/visualization/correlation
```

---

## 🎯 Quick Tips

### For Export
- Always select a sensor first
- CSV is best for Excel
- JSON is best for programmatic access
- Schedule recurring exports for automatic backups

### For Analytics
- Check predictions every morning to plan ventilation
- Monitor anomalies in real-time alerts
- Use insights to improve your space

### For Health
- Target a health score of 85+
- Follow recommendations in order of priority
- Re-check after 1 week to see improvement

### For Performance
- Clear cache weekly to maintain speed
- Archive data monthly to free space
- Monitor queries to identify bottlenecks

### For Collaboration
- Create teams for departments
- Share dashboards for team awareness
- Set appropriate roles for security

### For Visualization
- Check heatmap weekly for patterns
- Identify peak CO2 times
- Use correlation data to improve air quality
- Share findings with your team

---

## 🆘 Troubleshooting

### Page not loading?
- Refresh the page (F5)
- Check you're logged in
- Clear browser cache

### Data not showing?
- Wait 2-3 seconds for load to complete
- Check browser console for errors (F12)
- Try refreshing the page

### Buttons not working?
- Ensure JavaScript is enabled
- Try a different browser
- Clear cookies and try again

### Export not downloading?
- Check your downloads folder
- Allow pop-ups in browser settings
- Try a different file format

---

## 📞 Support

For questions or issues, refer to the main documentation in the `/docs` folder.

**All Pages Status**: ✅ Working  
**Last Updated**: 2026-01-06  
**Language**: Français 🇫🇷
