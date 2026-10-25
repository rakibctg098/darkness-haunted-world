# DARKNESS: THE HAUNTED WORLD

**Professional 3D Horror Survival Game + Android PWA**

---

### 👤 Developer Credit
- **Made by Mohammad Rakib**
- **Telegram channel:** [https://t.me/appdevbyrakib](https://t.me/appdevbyrakib)

---

## 🎮 Game Overview
**DARKNESS: THE HAUNTED WORLD** is a real-time first-person 3D horror survival game built with Three.js WebGL and procedural Web Audio API.

### Level 1: Abandoned Hospital
You wake up in the pitch-black reception of St. Jude Psychiatric Hospital.
- **Atmosphere:** Claustrophobic horror fog, flickering fluorescent lights, blood splatters, and emergency sirens.
- **Flashlight & Battery:** Manage your limited battery power. When the battery drops below 20%, the beam flickers erratically.
- **Enemy AI (The Surgeon):** Dr. Vance patrols the hospital corridors. He investigates running footsteps, tracks last-known positions, and enters an aggressive chase when he spots you.
- **Objectives:**
  1. Search the Doctor's Office to locate the missing **Generator Key**.
  2. Unlock the heavy iron **Electrical Substation** in the north corridor.
  3. Pull the high-voltage breaker to restore emergency power.
  4. Evade **The Surgeon** and reach the **Main Security Exit Gate** to escape!

---

## 📱 Mobile Controls
- **Left Screen (Virtual Joystick):** Move forward, backward, and strafe left/right.
- **Right Screen (Touch Drag):** Smooth first-person camera look.
- **RUN Button:** Sprint (consumes stamina).
- **LGT Button:** Toggle flashlight on/off.
- **CRH Button:** Crouch to move silently under obstacles.
- **ACT Button:** Contextual interact (Pick up keys, batteries, open doors, flip switches).
- **Pause (||):** Pause game, adjust volume and sensitivity, or restart.

---

## 🚀 Android Smartphone GitHub Deployment Workflow
You can deploy this game using only your Android smartphone in Google Chrome without needing a PC or paid hosting:

1. **Open GitHub on Android Chrome:**
   - Go to [github.com](https://github.com) and log into your account.
   - Switch Chrome to **Desktop Site** mode (Tap the 3 dots in Chrome > Check "Desktop site").
2. **Create Repository:**
   - Tap **New Repository**.
   - Name it `darkness-haunted-world`.
   - Set to **Public** and tap **Create repository**.
3. **Upload / Create Files:**
   - Tap **Add file** > **Upload files** (or create them individually in the GitHub web editor).
   - Upload the files from this directory (`index.html`, `manifest.json`, `service-worker.js`, `assets/`, and `src/`).
   - Tap **Commit changes**.
4. **Deploy Free on GitHub Pages:**
   - Inside your repository, tap **Settings** > **Pages** (in the left sidebar).
   - Under **Build and deployment > Source**, select **Deploy from a branch**.
   - Under **Branch**, select `main` (or `master`) and folder `/ (root)`.
   - Tap **Save**.
   - Within 1–2 minutes, GitHub will generate your live HTTPS game URL:
     `https://<your-username>.github.io/darkness-haunted-world/`
5. **Install as PWA on Android:**
   - Open your live game link in Android Chrome.
   - Tap the 3 dots in Chrome > **Install app** (or "Add to Home screen").
   - Launch the game from your home screen in full-screen offline mode!

---

## 🛠️ Testing Checklist (Phase 1)
- [x] Real-time 3D rendering with Three.js (hospital corridor, rooms, reception)
- [x] Dual-zone mobile touch controls (analog joystick + look drag)
- [x] 3D collision system with wall sliding (cannot walk through walls)
- [x] Flashlight spotlight with battery drain and low-battery flicker
- [x] Working enemy AI (The Surgeon with Patrol, Investigate, Detect, Chase, and Attack states)
- [x] Interactive objects (Generator Key, Flashlight Battery, Substation Door, Generator Breaker, Security Exit Gate)
- [x] Real-time procedural horror soundscape (ambience, heartbeat, footsteps, jumpscare stinger, death cue)
- [x] Win condition (Escape via security gate) & Death condition (The Surgeon catches player)
- [x] Main menu, HUD, Pause menu, Settings with volume and sensitivity controls
- [x] Mandatory developer credit ("Made by Mohammad Rakib" & clickable Telegram link) on all screens
- [x] Web App Manifest & Service Worker for installable PWA

---
Developed by **Mohammad Rakib** | [Telegram Channel](https://t.me/appdevbyrakib)
