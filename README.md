# 🌍 Aerium - Tableau de Bord Qualité de l'Air

<div align="center">

![React](https://img.shields.io/badge/react-19.x-blue)
![TypeScript](https://img.shields.io/badge/typescript-5.x-blue)
![Vite](https://img.shields.io/badge/vite-latest-purple)
![Python](https://img.shields.io/badge/python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/flask-3.0%2B-green)
![Licence](https://img.shields.io/badge/licence-MIT-orange)
![Statut](https://img.shields.io/badge/statut-production-brightgreen)

**Système complet de surveillance de la qualité de l'air en temps réel avec interface React moderne et backend Flask robuste**

[Démarrage Rapide](#-quick-start--démarrage-rapide) • [Documentation](docs/INDEX.md) • [Fonctionnalités](#-fonctionnalités) • [Contribuer](#-contribuer)

</div>

---

## 📖 À Propos

Aerium est une plateforme web complète de surveillance de la qualité de l'air construite avec une architecture moderne:
- **Frontend** : React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend** : Flask + SQLite + JWT + WebSocket (Socket.IO)
- **Temps réel** : Mises à jour en direct via WebSocket
- **Sécurité** : Authentification JWT, RBAC, rate limiting

Elle permet de suivre en temps réel les niveaux de CO₂, température et humidité avec des analyses avancées et des alertes intelligentes.

## ✨ Fonctionnalités

**Surveillance en Temps Réel**
- 📊 Suivi des niveaux de CO₂, température et humidité
- 🔄 Mises à jour en direct via WebSocket
- 📈 Graphiques et analytics détaillés avec recharts
- 🎨 Dashboard intuitif et fully responsive

**Alertes Intelligentes**
- 📧 Notifications par email automatiques
- 🚨 Seuils d'alerte configurables par capteur
- 📝 Historique complet des alertes
- 🔔 Reconnaissance et résolution d'alertes en temps réel

**Gestion des Capteurs**
- ➕ Ajouter et gérer plusieurs capteurs
- 🔍 Recherche et filtrage avancés
- 📍 Localisation et cartographie des capteurs
- 🔄 Support des capteurs physiques et simulés

**Analyse et Rapports**
- 📊 Comparaison multi-capteurs
- 📥 Export de données en CSV
- 📈 Statistiques détaillées avec tendances
- 🎯 Recommandations basées sur les données
- 📝 Rapports générés automatiquement

**Admin & Sécurité**
- 🔐 Authentification JWT sécurisée
- 👤 Contrôle d'accès basé sur les rôles (User/Admin)
- 📝 Piste d'audit complète (audit logging)
- 🛡️ Protection contre les abus (rate limiting)
- 🔧 Tableau de bord admin avec maintenance

---

## 🏗️ Architecture Technique

### Stack Frontend
- **React 19** avec TypeScript
- **Vite** - Build tool ultra-rapide
- **Tailwind CSS** - Styling utility-first
- **shadcn/ui** - Composants UI accessibles
- **Recharts** - Visualisations de données
- **TanStack Query** - Gestion d'état & requêtes
- **React Router v7** - Routage
- **Socket.IO Client** - Communication temps réel
- **Vitest** - Tests unitaires

### Stack Backend
- **Flask 3** - Microframework web
- **SQLAlchemy** - ORM
- **SQLite** - Base de données
- **Flask-JWT-Extended** - Authentification JWT
- **Flask-SocketIO** - WebSocket
- **Flask-Limiter** - Rate limiting
- **APScheduler** - Tâches programmées
- **Flask-Mail** - Notifications email

---

## 🚀 Quick Start / Démarrage Rapide

### Prérequis

- Node.js 18+ (pour le frontend)
- Python 3.8+ (pour le backend)
- npm ou bun

### Installation et Démarrage

#### 1) Clonez et configurez

```bash
cd site
npm install  # ou bun install
```

#### 2) Configuration du Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate
# ou macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
```

#### 3) Variables d'environnement

Créez un fichier `.env` dans `site/backend/` :

```env
SECRET_KEY=your-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
FLASK_ENV=development
MAIL_SERVER=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:5173
```

#### 4) Lancez l'application

**Terminal 1 - Frontend** :
```bash
cd site
npm run dev  # http://localhost:5173
```

**Terminal 2 - Backend** :
```bash
cd site/backend
python app.py  # http://localhost:5000
```

### 🔐 Comptes de Démo

Le backend crée automatiquement des comptes de démo à la première exécution :

- **User** : `demo@aerium.app` / `demo123`
- **Admin** : `admin@aerium.app` / `admin123`

---

## 📚 Documentation

Consultez la documentation complète dans [`docs/`](docs/INDEX.md) :

- 📘 **[Index de Documentation](docs/INDEX.md)** - Hub principal
- 🚀 **[Guide de Démarrage](docs/GUIDE-DEMARRAGE.md)** - Installation pas-à-pas
- 📖 **[Guide Utilisateur](docs/GUIDE-UTILISATEUR.md)** - Fonctionnalités complètes
- 🔌 **[Référence API](docs/REFERENCE-API.md)** - API REST et WebSocket
- 💻 **[Guide Développeur](docs/GUIDE-DEVELOPPEUR.md)** - Architecture & contribution
- 🆘 **[Dépannage](docs/DEPANNAGE.md)** - Problèmes courants

---

## 📂 Structure du Projet

```
Aerium/
├── site/                          # Application principale
│   ├── src/                       # Frontend React TypeScript
│   │   ├── pages/                # Pages (Dashboard, Analytics, etc.)
│   │   ├── components/           # Composants réutilisables
│   │   ├── contexts/             # Contextes (Auth, WebSocket, Settings)
│   │   ├── hooks/                # Hooks personnalisés
│   │   ├── integrations/         # Intégrations (API, WebSocket)
│   │   └── lib/                  # Utilitaires
│   │
│   ├── backend/                   # Backend Flask Python
│   │   ├── app.py                # Application principale
│   │   ├── database.py           # Modèles SQLAlchemy
│   │   ├── config.py             # Configuration
│   │   ├── routes/               # Endpoints API (auth, sensors, readings, etc.)
│   │   ├── scheduler.py          # Tâches programmées
│   │   ├── email_service.py      # Notifications email
│   │   └── validators.py         # Validation des données
│   │
│   ├── package.json              # Dépendances frontend
│   ├── vite.config.ts            # Configuration Vite
│   └── tailwind.config.ts        # Configuration Tailwind
│
├── app/                            # Utilitaires supplémentaires (Kivy)
├── data/                           # Base de données et sauvegardes
├── docs/                           # Documentation complète
└── tests/                          # Suite de tests
```

---

## 🔧 Configuration Environnement

### Frontend (site/)
```bash
npm run dev        # Développement
npm run build      # Build production
npm run preview    # Prévisualiser le build
npm run test       # Exécuter les tests
npm run lint       # Vérifier le code
```

### Backend (site/backend/)
```bash
python app.py                      # Lancer le serveur
python seed_database.py            # Créer les données de démo
pytest                             # Tests
```

---

## 🧪 Tests

```bash
# Frontend
cd site && npm run test

# Backend
cd site/backend && pytest -v
```

---

## 🤝 Contribuer

1. Forkez le dépôt
2. Créez votre branche : `git checkout -b feature/votre-feature`
3. Committez : `git commit -m 'Add your feature'`
4. Poussez : `git push origin feature/votre-feature`
5. Ouvrez une Pull Request

Consultez le [Guide Développeur](docs/GUIDE-DEVELOPPEUR.md) pour les conventions de code.

---

## 📊 Pages Principales

- **Landing** - Page d'accueil
- **Dashboard** - Surveillance en temps réel
- **Analytics** - Analyses détaillées
- **Comparison** - Comparaison multi-capteurs
- **Sensors** - Gestion des capteurs
- **Sensor Map** - Cartographie des capteurs
- **Alerts** - Gestion des alertes
- **Alert History** - Historique des alertes
- **Reports** - Rapports et exports
- **Recommendations** - Recommandations basées sur les données
- **Settings** - Paramètres utilisateur
- **Admin** - Tableau de bord administrateur
- **Maintenance** - Outils de maintenance

---

## 🔐 Sécurité

- JWT tokens avec expiration configurée
- Hachage bcrypt des mots de passe
- CORS configuré
- Rate limiting activé
- Audit logging complet
- Protection CSRF
- Validation des entrées

---

## 🏆 Contributeurs

Merci à tous ceux qui ont contribué ! 🙌

---

## 🙏 Remerciements

- **React & Ecosystem** - Framework frontend
- **Flask & Python** - Backend framework
- **shadcn/ui** - Composants UI
- **Recharts** - Visualisations
- **Tailwind CSS** - Styling
- **Socket.IO** - Communication temps réel
- **Tous les contributeurs et utilisateurs** ❤️

---

<div align="center">

**Version** : 2.0  
**Dernière Mise à Jour** : Février 2026

Construit avec ❤️ pour un air plus sain

[⬆ Retour en haut](#-aerium---tableau-de-bord-qualité-de-lair)

</div>
