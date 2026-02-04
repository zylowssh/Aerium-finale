"""
Aerium Kivy Test App - WebSocket Edition
===========================================
Real-time CO2 monitoring with WebSocket connection.
Supports both LIVE and SIMULATION modes.
"""

from kivy.clock import Clock
from kivy.properties import StringProperty, NumericProperty, BooleanProperty, ListProperty
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.appbar import MDTopAppBar, MDTopAppBarTitle
from kivymd.uix.label import MDLabel
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.card import MDCard
from kivymd.uix.button import MDButton, MDButtonText
from kivymd.uix.scrollview import MDScrollView
import socketio
import threading
from datetime import datetime
import random
import requests

# ============================================================================
# CONFIGURATION
        Aerium Kivy Test App - WebSocket Edition

SERVER_URL = "http://localhost:5000"  # Flask SocketIO server
MODE = "FLASK_SIM"  # "LIVE", "SIMULATION", or "FLASK_SIM" (polls Flask /api/simulator/latest)

# ============================================================================
# WEBSOCKET CLIENT
# ============================================================================

class WebSocketManager:
    """Manages WebSocket connection to Flask server"""
    
    def __init__(self, server_url=SERVER_URL, on_data_callback=None):
        self.server_url = server_url
        self.on_data_callback = on_data_callback
        self.sio = None
        self.connected = False
        self.setup_websocket()
    
    def setup_websocket(self):
        """Initialize WebSocket connection"""
        print(f"🔌 Initializing WebSocket client for {self.server_url}")
        
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
        self.sio.on('co2_update', self.on_co2_update)
        self.sio.on('status', self.on_status)
        
        # Connect in background thread
        threading.Thread(target=self.connect_to_server, daemon=True).start()
    
    def connect_to_server(self):
        """Connect to WebSocket server"""
        try:
            print(f"📡 Attempting connection to {self.server_url}...")
            self.sio.connect(self.server_url)
        except Exception as e:
            print(f"❌ Connection error: {e}")
    
    def on_connect(self):
        """Called when connected"""
        print("✅ Connected to WebSocket server!")
        self.connected = True
        if self.on_data_callback:
            self.on_data_callback({
                'status': 'connected',
                'message': '✅ Connected to server'
            })
    
    def on_disconnect(self):
        """Called when disconnected"""
        print("⚠️ Disconnected from WebSocket server")
        self.connected = False
        if self.on_data_callback:
            self.on_data_callback({
                'status': 'disconnected',
                'message': '⚠️ Disconnected from server'
            })
    
    def on_connect_error(self, error):
        """Called on connection error"""
        print(f"❌ Connection error: {error}")
        if self.on_data_callback:
            self.on_data_callback({
    print("🌬️ Aerium CO₂ Monitor - WebSocket + Simulation")
                'message': f'❌ Error: {str(error)}'
            })
    
    def on_status(self, data):
        """Called on status message"""
        print(f"📢 Status: {data}")
    
    def on_co2_update(self, data):
        """Called when CO2 data received"""
        print(f"📊 CO₂ Update: {data}")
        if self.on_data_callback:
            self.on_data_callback(data)
    
    def request_data(self):
        """Request immediate data update"""
        if self.sio and self.connected:
            print("📡 Requesting data...")
            self.sio.emit('request_data')
    
    def disconnect(self):
        """Disconnect from server"""
        if self.sio and self.connected:
            print("👋 Disconnecting...")
            self.sio.disconnect()

# ============================================================================
# SIMULATION MODE - Matches Flask fake_co2.py
# ============================================================================

class SimulationScenario:
    """Base scenario class"""
    def __init__(self):
        self.co2 = 600
        self.temp = 22.0
        self.humidity = 45.0
    
    def step(self):
        """Advance simulation by one step"""
        raise NotImplementedError


class NormalScenario(SimulationScenario):
    """Normal office operation - steady state with slight variations"""
    def __init__(self):
        super().__init__()
        self.co2_trend = random.choice([-1, 0, 1])
        self.trend_counter = 0
    
    def step(self):
        self.trend_counter += 1
        if self.trend_counter > random.randint(5, 15):
            self.co2_trend = random.choice([-1, 0, 1])
            self.trend_counter = 0
        
        if self.co2_trend == 1:
            drift = random.uniform(3, 8)
        elif self.co2_trend == -1:
            drift = random.uniform(-8, -3)
        else:
            drift = random.uniform(-2, 2)
        
        self.co2 += drift
        self.co2 = max(400, min(1200, self.co2))
        self.temp += random.uniform(-0.5, 0.5)
        self.temp = max(19, min(25, self.temp))
        self.humidity += random.uniform(-1, 1)
        self.humidity = max(30, min(60, self.humidity))


class OfficeHoursScenario(SimulationScenario):
    """Office hours - CO2 rises throughout day"""
    def __init__(self):
        super().__init__()
        self.co2 = 500
    
    def step(self):
        self.co2 += random.uniform(5, 15)
        self.co2 = max(400, min(1600, self.co2))
        self.temp += random.uniform(0.1, 0.3)
        self.temp = max(19, min(26, self.temp))
        self.humidity += random.uniform(0.5, 1.5)
        self.humidity = max(30, min(70, self.humidity))


class SleepScenario(SimulationScenario):
    """Night time - low CO2"""
    def __init__(self):
        super().__init__()
        self.co2 = 400
    
    def step(self):
        self.co2 += random.uniform(-1, 1)
        self.co2 = max(400, min(500, self.co2))
        self.temp += random.uniform(-0.2, 0.1)
        self.temp = max(18, min(23, self.temp))
        self.humidity += random.uniform(-0.5, 0.5)
        self.humidity = max(35, min(55, self.humidity))


class VentilationScenario(SimulationScenario):
    """Ventilation running - rapid CO2 decrease"""
    def __init__(self):
        super().__init__()
        self.co2 = 1400
    
    def step(self):
        self.co2 -= random.uniform(20, 40)
        self.co2 = max(400, self.co2)
        self.temp -= random.uniform(0.1, 0.3)
        self.temp = max(18, min(25, self.temp))
        self.humidity -= random.uniform(1, 2)
        self.humidity = max(30, min(70, self.humidity))


class AnomalyScenario(SimulationScenario):
    """Sensor anomaly - spikes, drift, or intermittent issues"""
    def __init__(self):
        super().__init__()
        self.anomaly_type = 'spike'
    
    def step(self):
        if self.anomaly_type == 'spike':
            if random.random() < 0.3:
                self.co2 += random.uniform(200, 400)
            else:
                self.co2 -= random.uniform(50, 100)
        elif self.anomaly_type == 'drift':
            self.co2 += random.uniform(10, 30)
        elif self.anomaly_type == 'intermittent':
            if random.random() < 0.1:
                self.co2 = random.choice([400, 800, 1200])
            else:
                self.co2 += random.uniform(-5, 5)
        
        self.co2 = max(300, min(2500, self.co2))
        self.temp += random.uniform(-1, 1)
        self.temp = max(15, min(30, self.temp))
        self.humidity += random.uniform(-2, 2)
        self.humidity = max(20, min(80, self.humidity))


class SimulationManager:
    """Generates simulated CO2 data matching Flask scenarios"""
    
    def __init__(self, on_data_callback=None):
        self.on_data_callback = on_data_callback
        self.running = True
        self.scenarios = {
            'normal': NormalScenario(),
            'office_hours': OfficeHoursScenario(),
            'sleep': SleepScenario(),
            'ventilation': VentilationScenario(),
            'anomaly': AnomalyScenario()
        }
        self.current_scenario = 'normal'
        self.active_scenario = self.scenarios[self.current_scenario]
        self.start_simulation()
    
    def start_simulation(self):
        """Start simulated data generation"""
        print("🎮 Starting simulation mode with Flask scenarios...")
        threading.Thread(target=self.generate_data, daemon=True).start()
    
    def set_scenario(self, scenario_name):
        """Switch to a different scenario"""
        if scenario_name in self.scenarios:
            self.current_scenario = scenario_name
            self.active_scenario = self.scenarios[scenario_name]
            print(f"📊 Scenario changed to: {scenario_name}")
    
    def generate_data(self):
        """Generate simulated CO2 data"""
        import time
        while self.running:
            self.active_scenario.step()
            
            data = {
                'ppm': int(self.active_scenario.co2),
                'temp': round(self.active_scenario.temp, 1),
                'humidity': round(self.active_scenario.humidity, 1),
                'timestamp': datetime.now().isoformat(),
                'source': 'simulation',
                'scenario': self.current_scenario
            }
            
            if self.on_data_callback:
                self.on_data_callback(data)
            
            time.sleep(1)  # Update every 1 second (matches Flask)
    
    def disconnect(self):
        """Stop simulation"""
        self.running = False


# ============================================================================
# FLASK SIMULATOR POLLING MODE
# ============================================================================

class FlaskSimulatorManager:
    """Polls Flask /api/simulator/latest endpoint for synchronized data"""
    
    def __init__(self, server_url, on_data_callback=None):
        self.server_url = server_url
        self.on_data_callback = on_data_callback
        self.running = True
        self.start_polling()
    
    def start_polling(self):
        """Start polling Flask simulator"""
        print(f"🔄 Polling Flask simulator at {self.server_url}/api/simulator/latest...")
        threading.Thread(target=self.poll_data, daemon=True).start()
    
    def poll_data(self):
        """Poll Flask API for simulator data"""
        import time
        import requests
        
        # Wait until the start of the next full second for synchronization
        now = time.time()
        wait_time = 1.0 - (now % 1.0)
        time.sleep(wait_time)
        
        while self.running:
            try:
                # Poll at the exact start of each second
                response = requests.get(
                    f"{self.server_url}/api/simulator/latest",
                    timeout=5,
                    headers={'Cache-Control': 'no-store'}
                )
                if response.status_code == 200:
                    data = response.json()
                    # Transform Flask data format to match expected format
                    transformed = {
                        'ppm': data.get('ppm', 0),
                        'temp': data.get('temp', 0),
                        'humidity': data.get('humidity', 0),
                        'timestamp': data.get('timestamp', datetime.now().isoformat()),
                        'source': 'flask_simulator'
                    }
                    
                    print(f"📊 Flask data: PPM={transformed['ppm']}, Temp={transformed['temp']}, Humidity={transformed['humidity']}")
                    
                    if self.on_data_callback:
                        self.on_data_callback(transformed)
                else:
                    print(f"⚠️ Flask API returned status {response.status_code}")
            except requests.exceptions.ConnectionError:
                print("⚠️ Cannot connect to Flask server")
            except Exception as e:
                print(f"⚠️ Error polling Flask: {e}")
            
            # Sleep until the next full second
            now = time.time()
            wait_time = 1.0 - (now % 1.0)
            time.sleep(wait_time)
    
    def disconnect(self):
        """Stop polling"""
        self.running = False


# ============================================================================
# MAIN SCREEN
# ============================================================================

class CO2MonitorScreen(MDScreen):
    """Main CO2 monitoring screen"""
    
    current_ppm = NumericProperty(0)
    quality_text = StringProperty("--")
    quality_color = ListProperty([0.4, 0.4, 0.4, 1])
    is_connected = BooleanProperty(False)
    last_update = StringProperty("--")
    
    def __init__(self, mode="SIMULATION", **kwargs):
        super().__init__(**kwargs)
        self.mode = mode
        self.manager_obj = None
        self.good_threshold = 800
        self.bad_threshold = 1200
        self.build_ui()
        self.initialize_connection()
    
    def build_ui(self):
        """Build user interface"""
        main_layout = MDBoxLayout(orientation="vertical", padding="10dp", spacing="10dp")
        
        # Top bar
        topbar = MDTopAppBar(
            MDTopAppBarTitle(text=f"Aerium CO₂ Monitor ({self.mode})", halign="center"),
            type="small",
            pos_hint={"top": 1},
        )
        main_layout.add_widget(topbar)
        
        # Scroll view
        scroll = MDScrollView()
        content = MDBoxLayout(
            orientation="vertical",
            padding="15dp",
            spacing="15dp",
            size_hint_y=None
        )
        content.bind(minimum_height=content.setter("height"))
        
        # Status Card
        status_card = MDCard(padding="15dp", spacing="10dp", size_hint_y=None, height="70dp")
        self.status_label = MDLabel(
            text="🔌 Initializing...",
            halign="center",
            font_style="Title",
            size_hint_y=None,
            height="60dp"
        )
        status_card.add_widget(self.status_label)
        content.add_widget(status_card)
        
        # CO2 Display Card
        co2_card = MDCard(padding="20dp", spacing="10dp", size_hint_y=None, height="220dp")
        co2_layout = MDBoxLayout(orientation="vertical", spacing="10dp")
        
        self.ppm_label = MDLabel(
            text="-- ppm",
            halign="center",
            font_style="Headline",
            size_hint_y=None,
            height="70dp"
        )
        co2_layout.add_widget(self.ppm_label)
        
        self.quality_label = MDLabel(
            text="--",
            halign="center",
            font_style="Title",
            size_hint_y=None,
            height="50dp"
        )
        co2_layout.add_widget(self.quality_label)
        
        self.time_label = MDLabel(
            text="Last update: --",
            halign="center",
            font_style="Body",
            size_hint_y=None,
            height="40dp"
        )
        co2_layout.add_widget(self.time_label)
        
        co2_card.add_widget(co2_layout)
        content.add_widget(co2_card)
        
        # Info Card
        info_card = MDCard(padding="15dp", spacing="10dp", size_hint_y=None, height="100dp")
        info_layout = MDBoxLayout(orientation="vertical", spacing="5dp")
        
        info_layout.add_widget(MDLabel(
            text=f"Thresholds: Good < {self.good_threshold} < Medium < {self.bad_threshold} < Bad",
            halign="center",
            font_style="Body",
            size_hint_y=None,
            height="40dp"
        ))
        
        # Scenario label (only show in SIMULATION mode)
        if self.mode == "SIMULATION":
            self.scenario_label = MDLabel(
                text="Scenario: normal",
                halign="center",
                font_style="Body",
                size_hint_y=None,
                height="30dp"
            )
            info_layout.add_widget(self.scenario_label)
        
        info_layout.add_widget(MDLabel(
            text=f"Server: {SERVER_URL}",
            halign="center",
            font_style="Body",
            size_hint_y=None,
            height="30dp"
        ))
        
        info_card.add_widget(info_layout)
        content.add_widget(info_card)
        
        # Scenario buttons (only in SIMULATION mode)
        if self.mode == "SIMULATION":
            scenario_layout = MDBoxLayout(spacing="5dp", padding="10dp", size_hint_y=None, height="50dp")
            for scenario in ['normal', 'office_hours', 'sleep', 'ventilation', 'anomaly']:
                btn = MDButton(style="filled", size_hint=(0.2, 1))
                btn.bind(on_release=lambda instance, s=scenario: self.change_scenario(s))
                btn.add_widget(MDButtonText(text=scenario[:3]))
                scenario_layout.add_widget(btn)
            content.add_widget(scenario_layout)
        
        scroll.add_widget(content)
        main_layout.add_widget(scroll)
        
        # Buttons
        button_layout = MDBoxLayout(spacing="10dp", padding="10dp", size_hint_y=None, height="60dp")
        
        reconnect_btn = MDButton(style="filled", size_hint=(0.5, 1))
        reconnect_btn.bind(on_release=self.reconnect)
        reconnect_btn.add_widget(MDButtonText(text="🔄 Reconnect"))
        button_layout.add_widget(reconnect_btn)
        
        update_btn = MDButton(style="outlined", size_hint=(0.5, 1))
        update_btn.bind(on_release=self.request_update)
        update_btn.add_widget(MDButtonText(text="📊 Update"))
        button_layout.add_widget(update_btn)
        
        main_layout.add_widget(button_layout)
        
        self.add_widget(main_layout)
    
    def initialize_connection(self):
        """Initialize WebSocket, Simulation, or Flask Simulator"""
        if self.mode == "SIMULATION":
            self.manager_obj = SimulationManager(on_data_callback=self.on_data_received)
            Clock.schedule_once(lambda dt: self.update_status("🎮 Local Simulation Mode"), 0)
        elif self.mode == "FLASK_SIM":
            self.manager_obj = FlaskSimulatorManager(SERVER_URL, on_data_callback=self.on_data_received)
            Clock.schedule_once(lambda dt: self.update_status("🔄 Flask Simulator Mode"), 0)
        else:
            self.manager_obj = WebSocketManager(SERVER_URL, on_data_callback=self.on_data_received)
            Clock.schedule_once(lambda dt: self.update_status("🔌 Connecting..."), 0)
    
    def on_data_received(self, data):
        """Called when data is received"""
        Clock.schedule_once(lambda dt: self.update_display(data), 0)
    
    def update_display(self, data):
        """Update display with new data"""
        # Status update
        if 'status' in data:
            status_msg = data.get('message', 'Status updated')
            self.status_label.text = status_msg
            return
        
        # CO2 data update
        if 'ppm' in data:
            ppm = int(data.get('ppm', 0))
            temp = data.get('temp', 0)
            humidity = data.get('humidity', 0)
            timestamp = data.get('timestamp', '')
            scenario = data.get('scenario', 'normal')
            
            self.current_ppm = ppm
            self.ppm_label.text = f"[b]{ppm}[/b] ppm\n[size=16sp]T: {temp:.1f}°C | H: {humidity:.0f}%[/size]"
            self.ppm_label.markup = True
            
            # Update scenario label if in SIMULATION
            if self.mode == "SIMULATION" and hasattr(self, 'scenario_label'):
                self.scenario_label.text = f"Scenario: {scenario}"
            
            # Update quality
            if ppm < self.good_threshold:
                self.quality_text = "🟢 Excellent"
                self.quality_color = [0.29, 0.87, 0.5, 1]
            elif ppm < self.bad_threshold:
                self.quality_text = "🟡 Fair"
                self.quality_color = [0.98, 0.8, 0.13, 1]
            else:
                self.quality_text = "🔴 Poor"
                self.quality_color = [0.97, 0.44, 0.44, 1]
            
            self.quality_label.text = self.quality_text
            self.quality_label.color = self.quality_color
            
            # Update timestamp
            try:
                dt = datetime.fromisoformat(timestamp.replace('Z', '+00:00'))
                time_str = dt.strftime('%H:%M:%S')
                self.time_label.text = f"Last update: {time_str}"
            except:
                self.time_label.text = "Last update: just now"
    
    def update_status(self, text):
        """Update status label"""
        self.status_label.text = text
    
    def change_scenario(self, scenario_name):
        """Change simulation scenario"""
        if self.manager_obj and hasattr(self.manager_obj, 'set_scenario'):
            self.manager_obj.set_scenario(scenario_name)
            print(f"Scenario changed to: {scenario_name}")
    
    def reconnect(self, instance):
        """Reconnect button"""
        if self.manager_obj:
            if hasattr(self.manager_obj, 'disconnect'):
                self.manager_obj.disconnect()
            self.initialize_connection()
    
    def request_update(self, instance):
        """Request data update"""
        if self.manager_obj and hasattr(self.manager_obj, 'request_data'):
            self.manager_obj.request_data()
    
    def on_leave(self):
        """Clean up on leave"""
        if self.manager_obj:
            self.manager_obj.disconnect()


# ============================================================================
# MAIN APP
# ============================================================================

class AeriumKivyApp(MDApp):
    """Main application"""
    
    def build(self):
        """Build app"""
        self.theme_cls.theme_style = "Dark"
        self.theme_cls.primary_palette = "Blue"
        
        screen = CO2MonitorScreen(mode=MODE)
        return screen
    
    def on_stop(self):
        """Clean up on stop"""
        if hasattr(self.root, 'on_leave'):
            self.root.on_leave()

# ============================================================================
# MAIN ENTRY POINT
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("🌬️ Aerium CO₂ Monitor - WebSocket + Simulation")
    print("=" * 60)
    print(f"Mode: {MODE}")
    print(f"Server: {SERVER_URL}")
    print("=" * 60)
    
    AeriumKivyApp().run()
