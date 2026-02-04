# Guide WebSocket avec Python et KivyMD

## Démarrage Rapide

### 1. Installation des Dépendances

```bash
pip install kivy==2.3.1
pip install kivymd==0.104.2
pip install python-socketio==5.10.0
pip install websocket-client==1.7.0
```

### 2. Structure de Base - Classe WebSocketManager

```python
import socketio
import threading
from kivy.clock import Clock

class WebSocketManager:
    def __init__(self, server_url, on_data_callback):
        self.sio = socketio.Client(
            reconnection=True,
            reconnection_delay=1,
            reconnection_delay_max=5
        )
        self.on_data_callback = on_data_callback
        self.server_url = server_url
        self.connected = False
        
        # Enregistrer les événements
        self.sio.on('connect', self.on_connect)
        self.sio.on('disconnect', self.on_disconnect)
        self.sio.on('co2_update', self.on_co2_update)
        self.sio.on('error', self.on_error)

    def connect(self):
        """Connecter au serveur WebSocket"""
        try:
            self.sio.connect(self.server_url, wait_timeout=10)
        except Exception as e:
            print(f"Erreur de connexion: {e}")

    def on_connect(self):
        """Appelé quand connecté"""
        self.connected = True
        Clock.schedule_once(lambda x: self.on_data_callback({'status': 'Connecté'}), 0)

    def on_disconnect(self):
        """Appelé quand déconnecté"""
        self.connected = False
        Clock.schedule_once(lambda x: self.on_data_callback({'status': 'Déconnecté'}), 0)

    def on_co2_update(self, data):
        """Reçoit les données du serveur"""
        # Important: utiliser Clock pour mettre à jour l'UI depuis le thread WebSocket
        Clock.schedule_once(lambda x: self.on_data_callback(data), 0)

    def on_error(self, e):
        """Gère les erreurs WebSocket"""
        print(f"Erreur WebSocket: {e}")
        Clock.schedule_once(lambda x: self.on_data_callback({'status': 'Erreur'}), 0)

    def disconnect(self):
        """Déconnecter du serveur"""
        if self.connected:
            self.sio.disconnect()
```

### 3. Intégration dans Kivy/KivyMD

```python
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.label import MDLabel
from kivymd.uix.boxlayout import MDBoxLayout
from kivy.properties import StringProperty, NumericProperty

class MyScreen(MDScreen):
    ppm = NumericProperty(0)
    status = StringProperty('Démarrage...')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.manager = WebSocketManager(
            "http://localhost:5000",
            self.update_display
        )
        
        # Lancer la connexion dans un thread
        import threading
        thread = threading.Thread(target=self.manager.connect, daemon=True)
        thread.start()
        
        self.build_ui()
    
    def build_ui(self):
        """Construire l'interface utilisateur"""
        layout = MDBoxLayout(orientation='vertical', padding='20dp', spacing='20dp')
        
        # Affichage des données
        self.label = MDLabel(
            text=f'CO₂: {self.ppm} ppm\nÉtat: {self.status}',
            font_style='Headline',
            size_hint_y=None,
            height='200dp'
        )
        layout.add_widget(self.label)
        
        self.add_widget(layout)
    
    def update_display(self, data):
        """Mettre à jour l'écran avec les données du WebSocket"""
        self.ppm = data.get('ppm', 0)
        self.status = data.get('status', 'Inconnu')
        self.label.text = f'CO₂: {self.ppm} ppm\nÉtat: {self.status}'

class MyApp(MDApp):
    def build(self):
        return MyScreen()

if __name__ == '__main__':
    MyApp().run()
```

### 4. Côté Serveur Flask avec SocketIO

```python
from flask import Flask
from flask_socketio import SocketIO, emit
import threading
import time

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

@socketio.on('connect')
def handle_connect():
    print('Client connecté')
    emit('co2_update', {'ppm': 450, 'status': 'En ligne'})

@socketio.on('disconnect')
def handle_disconnect():
    print('Client déconnecté')

def broadcast_co2_data():
    """Envoyer les données CO2 aux clients"""
    while True:
        data = {
            'ppm': get_co2_reading(),  # Fonction pour lire les données réelles
            'timestamp': datetime.now().isoformat(),
            'status': 'En ligne'
        }
        socketio.emit('co2_update', data, broadcast=True)
        time.sleep(5)  # Envoyer toutes les 5 secondes

# Lancer le thread de broadcast
thread = threading.Thread(target=broadcast_co2_data, daemon=True)
thread.start()

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5000, debug=False)
```

## Points Clés

### ⚠️ Règle d'Or: UI depuis le Main Thread

Le WebSocket s'exécute dans un thread séparé. Pour mettre à jour l'UI Kivy, **toujours utiliser `Clock.schedule_once()`**:

```python
# ❌ MAUVAIS - Crash
def on_co2_update(self, data):
    self.label.text = f"CO₂: {data['ppm']}"

# ✅ BON - Sûr
def on_co2_update(self, data):
    Clock.schedule_once(lambda x: setattr(self.label, 'text', f"CO₂: {data['ppm']}"), 0)
```

### Propriétés Kivy avec WebSocket

Utiliser les propriétés pour synchroniser les données:

```python
from kivy.properties import NumericProperty

class MyScreen(MDScreen):
    ppm = NumericProperty(0)
    
    def update_display(self, data):
        self.ppm = data.get('ppm', 0)  # Met à jour automatiquement l'UI liée

# Dans le fichier KV ou UI
MDLabel(text=f'CO₂: {root.ppm}')  # Se met à jour automatiquement
```

### Gestion des Reconnexa Automatiques

python-socketio gère les reconnexions automatiques. Configurer les paramètres:

```python
self.sio = socketio.Client(
    reconnection=True,           # Activer les reconnexions
    reconnection_delay=1,        # Délai initial (secondes)
    reconnection_delay_max=5,    # Délai maximum (secondes)
    reconnection_attempts=10     # Nombre de tentatives
)
```

### Modes de Données

**Mode Simulation (Sans Serveur)**
```python
class SimulationManager:
    def __init__(self, on_data_callback):
        self.callback = on_data_callback
        self.current_ppm = 400
        self.thread = threading.Thread(target=self._simulate, daemon=True)
        self.thread.start()
    
    def _simulate(self):
        import random
        while True:
            self.current_ppm += random.randint(-20, 30)
            data = {'ppm': self.current_ppm, 'timestamp': datetime.now().isoformat()}
            Clock.schedule_once(lambda x: self.callback(data), 0)
            time.sleep(5)
```

**Mode Live (Avec Serveur)**
```python
manager = WebSocketManager("http://localhost:5000", callback)
```

### Mise en Page KivyMD - Points Critiques

1. **size_hint doit être un tuple (x, y)**
   ```python
   # ❌ Erreur: size_hint=0.5
   # ✅ Correct: size_hint=(0.5, 1)
   MDButton(size_hint=(0.5, 1))
   ```

2. **Fonts style KivyMD 2.0+**
   ```python
   # Styles valides: "Headline", "Title", "Body", "LabelLarge", etc.
   MDLabel(font_style='Headline')
   ```

3. **Boutons KivyMD 2.0+**
   ```python
   from kivymd.uix.button import MDButton, MDButtonText
   
   btn = MDButton(style='filled')
   btn.add_widget(MDButtonText(text='Texte'))
   ```

## Exemple Complet - Lecteur CO2 WebSocket Minimaliste

```python
from kivy.clock import Clock
from kivy.properties import StringProperty, NumericProperty
from kivymd.app import MDApp
from kivymd.uix.screen import MDScreen
from kivymd.uix.label import MDLabel
from kivymd.uix.boxlayout import MDBoxLayout
from kivymd.uix.button import MDButton, MDButtonText
import socketio
import threading

class CO2Monitor(MDScreen):
    ppm = NumericProperty(0)
    status = StringProperty('Démarrage')
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.sio = socketio.Client(reconnection=True)
        self.sio.on('co2_update', self.on_data)
        
        layout = MDBoxLayout(orientation='vertical', padding='20dp')
        self.label = MDLabel(font_style='Headline')
        layout.add_widget(self.label)
        
        btn = MDButton(size_hint=(1, None), height='48dp')
        btn.add_widget(MDButtonText(text='Connecter'))
        btn.bind(on_release=self.connect)
        layout.add_widget(btn)
        
        self.add_widget(layout)
    
    def connect(self, instance):
        thread = threading.Thread(target=lambda: self.sio.connect('http://localhost:5000'), daemon=True)
        thread.start()
    
    def on_data(self, data):
        Clock.schedule_once(
            lambda x: setattr(self, 'ppm', data.get('ppm', 0)),
            0
        )
        self.label.text = f'CO₂: {self.ppm} ppm'

class MyApp(MDApp):
    def build(self):
        return CO2Monitor()

if __name__ == '__main__':
    MyApp().run()
```

## Troubleshooting

| Problème | Cause | Solution |
|----------|-------|----------|
| `ValueError: size_hint must be tuple` | size_hint passé en float | Utiliser `size_hint=(x, y)` |
| L'UI ne se met pas à jour | Mise à jour depuis thread WebSocket | Utiliser `Clock.schedule_once()` |
| Connexion échoue | Serveur non disponible | Vérifier l'adresse et le port |
| Crash de l'app | Erreur dans callback | Envelopper en try/except dans `on_data()` |
| Reconnexion lente | Délai configuré trop court | Augmenter `reconnection_delay_max` |

