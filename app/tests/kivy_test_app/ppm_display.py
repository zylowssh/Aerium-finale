"""
Aerium Kivy PPM Display - Minimal WebSocket Test
=================================================
Simple Kivy app that connects to webhook and displays PPM from selected sensor.
"""

from kivy.clock import Clock
from kivy.properties import StringProperty, NumericProperty, ListProperty, BooleanProperty
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.gridlayout import MDGridLayout
from kivymd.uix.card import MDCard
from kivymd.uix.label import MDLabel
from kivymd.uix.button import MDButton, MDButtonText
from kivymd.uix.menu import MDDropdownMenu
from kivymd.uix.scrollview import MDScrollView
from kivy.graphics import Color, Rectangle
import socketio
import threading
from datetime import datetime
import requests

# ============================================================================
# CONFIGURATION
# ============================================================================

SERVER_URL = "http://localhost:5000"  # Change to your server IP
WEBSOCKET_URL = "http://localhost:5000"  # Flask SocketIO server
SELECTED_SENSOR_FILE = "selected_sensor.txt"  # Store selected sensor

# ============================================================================
# WEBSOCKET CLIENT
# ============================================================================

class PPMWebSocketManager:
    """Manages WebSocket connection for real-time PPM data"""
    
    def __init__(self, server_url=WEBSOCKET_URL, on_data_callback=None):
        self.server_url = server_url
        self.on_data_callback = on_data_callback
        self.sio: socketio.Client | None = None
        self.connected = False
        self.current_sensor_id = None
        self.setup_websocket()
    
    def setup_websocket(self):
        """Initialize WebSocket connection"""
        print(f"🔌 Initializing WebSocket at {self.server_url}")
        
        self.sio = socketio.Client(
            reconnection=True,
            reconnection_delay=1,
            reconnection_delay_max=5,
            logger=False,
            engineio_logger=False
        )
        
        # Register event handlers
        self.sio.on('connect', self.on_connect)
        self.sio.on('disconnect', self.on_disconnect)
        self.sio.on('connect_error', self.on_connect_error)
        self.sio.on('sensor_reading', self.on_sensor_reading)
        
        # Connect in background thread
        threading.Thread(target=self.connect_to_server, daemon=True).start()
    
    def connect_to_server(self):
        """Connect to WebSocket server"""
        try:
            print(f"📡 Attempting connection...")
            if self.sio:
                self.sio.connect(self.server_url)
        except Exception as e:
            print(f"❌ Connection error: {e}")
    
    def on_connect(self):
        """Called when connected"""
        print("✅ Connected to WebSocket!")
        self.connected = True
        if self.on_data_callback:
            self.on_data_callback({'status': 'connected', 'message': '✅ Connected'})
    
    def on_disconnect(self):
        """Called when disconnected"""
        print("⚠️ Disconnected from WebSocket")
        self.connected = False
        if self.on_data_callback:
            self.on_data_callback({'status': 'disconnected', 'message': '⚠️ Disconnected'})
    
    def on_connect_error(self, error):
        """Called on connection error"""
        print(f"❌ Connection error: {error}")
        if self.on_data_callback:
            self.on_data_callback({'status': 'error', 'message': f'❌ Error: {error}'})
    
    def on_sensor_reading(self, data):
        """Called when sensor reading received"""
        print(f"📊 Received data: {data}")
        if self.on_data_callback:
            self.on_data_callback({
                'status': 'data',
                'sensor_id': data.get('sensor_id'),
                'co2': data.get('co2', data.get('ppm', 0)),
                'temperature': data.get('temperature', 0),
                'humidity': data.get('humidity', 0),
                'timestamp': data.get('timestamp', datetime.now().isoformat())
            })
    
    def subscribe_to_sensor(self, sensor_id):
        """Subscribe to specific sensor updates"""
        if self.sio and self.connected:
            self.current_sensor_id = sensor_id
            try:
                self.sio.emit('subscribe_sensor', {'sensor_id': sensor_id})
                print(f"📌 Subscribed to sensor {sensor_id}")
            except Exception as e:
                print(f"Error subscribing to sensor: {e}")

# ============================================================================
# MAIN SCREEN
# ============================================================================

class PPMDisplayScreen(MDScreen):
    """Main PPM display screen"""
    
    current_ppm = NumericProperty(0)
    status_text = StringProperty("🔌 Connecting...")
    is_connected = BooleanProperty(False)
    selected_sensor_name = StringProperty("Select Sensor")
    temperature = NumericProperty(0)
    humidity = NumericProperty(0)
    quality = StringProperty("--")
    quality_color = ListProperty([0.5, 0.5, 0.5, 1])
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.ws_manager = None
        self.sensors = []
        self.selected_sensor = None
        
    def on_enter(self):
        """Called when screen is displayed"""
        self.build_ui()
        self.setup_websocket()
        self.fetch_sensors()
    
    def build_ui(self):
        """Build the user interface"""
        main_layout = MDBoxLayout(
            orientation="vertical",
            padding="16dp",
            spacing="16dp",
            size_hint=(1, 1)
        )
        
        # ─────────────────────────────────────────────────────────────
        # Connection Status
        # ─────────────────────────────────────────────────────────────
        status_card = MDCard(
            orientation="vertical",
            padding="12dp",
            size_hint=(1, None),
            height="60dp",
            style="elevated"
        )
        
        self.status_label = MDLabel(
            text="🔌 Connecting...",
            halign="center",
            theme_text_color="Primary",
            font_style="Label"
        )
        status_card.add_widget(self.status_label)
        main_layout.add_widget(status_card)
        
        # ─────────────────────────────────────────────────────────────
        # Sensor Selection
        # ─────────────────────────────────────────────────────────────
        sensor_card = MDCard(
            orientation="vertical",
            padding="12dp",
            spacing="8dp",
            size_hint=(1, None),
            height="80dp",
            style="elevated"
        )
        
        sensor_label = MDLabel(
            text="Sensor:",
            size_hint_x=0.3,
            theme_text_color="Primary",
            font_style="Label"
        )
        
        self.sensor_button = MDButton(
            MDButtonText(text="Select Sensor"),
            style="outlined",
            size_hint_x=0.7
        )
        self.sensor_button.bind(on_release=self.show_sensor_menu)
        
        sensor_layout = MDBoxLayout(orientation="horizontal", spacing="8dp")
        sensor_layout.add_widget(sensor_label)
        sensor_layout.add_widget(self.sensor_button)
        sensor_card.add_widget(sensor_layout)
        main_layout.add_widget(sensor_card)
        
        # ─────────────────────────────────────────────────────────────
        # PPM Display (Large)
        # ─────────────────────────────────────────────────────────────
        ppm_card = MDCard(
            orientation="vertical",
            padding="20dp",
            spacing="12dp",
            size_hint=(1, None),
            height="200dp",
            style="elevated"
        )
        
        ppm_label = MDLabel(
            text="CO₂ Level",
            halign="center",
            size_hint_y=0.3,
            theme_text_color="Primary",
            font_style="Label"
        )
        
        self.ppm_value_label = MDLabel(
            text="-- ppm",
            halign="center",
            size_hint_y=0.7,
            theme_text_color="Primary",
            font_style="Display",
            font_size="72sp"
        )
        
        ppm_card.add_widget(ppm_label)
        ppm_card.add_widget(self.ppm_value_label)
        main_layout.add_widget(ppm_card)
        
        # ─────────────────────────────────────────────────────────────
        # Quality & Environmental Data
        # ─────────────────────────────────────────────────────────────
        data_card = MDCard(
            orientation="vertical",
            padding="12dp",
            spacing="8dp",
            size_hint=(1, None),
            height="120dp",
            style="elevated"
        )
        
        grid = MDGridLayout(cols=3, spacing="8dp", size_hint_y=1)
        
        # Quality
        quality_layout = MDBoxLayout(orientation="vertical", spacing="4dp")
        quality_layout.add_widget(MDLabel(
            text="Quality",
            halign="center",
            theme_text_color="Primary",
            font_style="Label",
            size_hint_y=0.4
        ))
        self.quality_label = MDLabel(
            text="--",
            halign="center",
            theme_text_color="Primary",
            font_style="Headline",
            size_hint_y=0.6
        )
        quality_layout.add_widget(self.quality_label)
        grid.add_widget(quality_layout)
        
        # Temperature
        temp_layout = MDBoxLayout(orientation="vertical", spacing="4dp")
        temp_layout.add_widget(MDLabel(
            text="Temperature",
            halign="center",
            theme_text_color="Primary",
            font_style="Label",
            size_hint_y=0.4
        ))
        self.temp_label = MDLabel(
            text="-- °C",
            halign="center",
            theme_text_color="Primary",
            font_style="Headline",
            size_hint_y=0.6
        )
        temp_layout.add_widget(self.temp_label)
        grid.add_widget(temp_layout)
        
        # Humidity
        humid_layout = MDBoxLayout(orientation="vertical", spacing="4dp")
        humid_layout.add_widget(MDLabel(
            text="Humidity",
            halign="center",
            theme_text_color="Primary",
            font_style="Label",
            size_hint_y=0.4
        ))
        self.humid_label = MDLabel(
            text="-- %",
            halign="center",
            theme_text_color="Primary",
            font_style="Headline",
            size_hint_y=0.6
        )
        humid_layout.add_widget(self.humid_label)
        grid.add_widget(humid_layout)
        
        data_card.add_widget(grid)
        main_layout.add_widget(data_card)
        
        # ─────────────────────────────────────────────────────────────
        # Timestamp
        # ─────────────────────────────────────────────────────────────
        self.timestamp_label = MDLabel(
            text="Last update: --",
            halign="center",
            theme_text_color="Primary",
            font_style="Body",
            size_hint_y=None,
            height="30dp"
        )
        main_layout.add_widget(self.timestamp_label)
        
        self.add_widget(main_layout)
    
    def setup_websocket(self):
        """Setup WebSocket connection"""
        self.ws_manager = PPMWebSocketManager(
            server_url=WEBSOCKET_URL,
            on_data_callback=self.on_websocket_data
        )
    
    def on_websocket_data(self, data):
        """Handle WebSocket data updates"""
        status = data.get('status')
        
        if status == 'connected':
            self.is_connected = True
            self.status_text = "✅ Connected"
            Clock.schedule_once(lambda dt: self.on_status_update())
            
        elif status == 'disconnected':
            self.is_connected = False
            self.status_text = "⚠️ Disconnected"
            Clock.schedule_once(lambda dt: self.on_status_update())
            
        elif status == 'error':
            self.status_text = data.get('message', '❌ Error')
            Clock.schedule_once(lambda dt: self.on_status_update())
            
        elif status == 'data' and self.selected_sensor:
            # Only display data for selected sensor
            if data.get('sensor_id') == self.selected_sensor['id']:
                Clock.schedule_once(lambda dt: self.update_ppm_display(data))
    
    def on_status_update(self):
        """Update status label"""
        self.status_label.text = self.status_text
    
    def update_ppm_display(self, data):
        """Update PPM display with new data"""
        co2 = data.get('co2', 0)
        temp = data.get('temperature', 0)
        humid = data.get('humidity', 0)
        
        self.current_ppm = co2
        self.temperature = temp
        self.humidity = humid
        
        # Update display
        self.ppm_value_label.text = f"{int(co2)} ppm"
        self.temp_label.text = f"{temp:.1f} °C"
        self.humid_label.text = f"{humid:.1f} %"
        
        # Update quality based on PPM
        if co2 < 800:
            quality = "🟢 Good"
            self.quality_color = [0.2, 0.8, 0.2, 1]  # Green
        elif co2 < 1200:
            quality = "🟡 Fair"
            self.quality_color = [0.9, 0.7, 0.2, 1]  # Yellow
        else:
            quality = "🔴 Poor"
            self.quality_color = [0.9, 0.2, 0.2, 1]  # Red
        
        self.quality_label.text = quality
        
        # Update timestamp
        timestamp = data.get('timestamp', datetime.now().isoformat())
        timestamp_obj = datetime.fromisoformat(timestamp.replace('Z', '+00:00')) if isinstance(timestamp, str) else datetime.now()
        self.timestamp_label.text = f"Last update: {timestamp_obj.strftime('%H:%M:%S')}"
    
    def fetch_sensors(self):
        """Fetch available sensors from API"""
        print("Fetching sensors...")
        threading.Thread(target=self._fetch_sensors_thread, daemon=True).start()
    
    def _fetch_sensors_thread(self):
        """Fetch sensors in background thread"""
        try:
            # Try to get sensors from API (requires auth - simplified version)
            # For now, use demo sensors
            self.sensors = [
                {'id': 1, 'name': 'Classroom A'},
                {'id': 2, 'name': 'Classroom B'},
                {'id': 3, 'name': 'Office 1'},
                {'id': 4, 'name': 'Meeting Room'},
            ]
            print(f"✅ Loaded {len(self.sensors)} sensors")
            Clock.schedule_once(lambda dt: self.update_sensor_menu())
        except Exception as e:
            print(f"Error fetching sensors: {e}")
    
    def show_sensor_menu(self, *args):
        """Show sensor selection menu"""
        if not self.sensors:
            print("No sensors available")
            return
        
        menu_items = [
            {
                "text": sensor['name'],
                "viewclass": "OneLineListItem",
                "on_release": lambda s=sensor: self.select_sensor(s)
            }
            for sensor in self.sensors
        ]
        
        menu = MDDropdownMenu(
            caller=self.sensor_button,
            items=menu_items,
            width_mult=4,
            max_height="250dp"
        )
        menu.open()
    
    def update_sensor_menu(self):
        """Update sensor menu visibility"""
        if self.sensors:
            self.sensor_button.disabled = False
    
    def select_sensor(self, sensor):
        """Select a sensor and subscribe to its data"""
        self.selected_sensor = sensor
        self.selected_sensor_name = sensor['name']
        self.sensor_button.text = sensor['name']
        
        print(f"📌 Selected: {sensor['name']} (ID: {sensor['id']})")
        
        # Subscribe to this sensor's data via WebSocket
        if self.ws_manager and self.ws_manager.connected:
            self.ws_manager.subscribe_to_sensor(sensor['id'])
        
        # Reset display
        self.ppm_value_label.text = "-- ppm"
        self.quality_label.text = "--"
        self.temp_label.text = "-- °C"
        self.humid_label.text = "-- %"

# ============================================================================
# MAIN APP
# ============================================================================

class PPMDisplayApp(MDApp):
    """Main Kivy app"""
    
    def build(self):
        self.title = "Aerium PPM Monitor"
        self.theme_cls.theme_style = "Light"
        self.theme_cls.primary_palette = "Blue"
        
        return PPMDisplayScreen()

if __name__ == '__main__':
    app = PPMDisplayApp()
    app.run()
