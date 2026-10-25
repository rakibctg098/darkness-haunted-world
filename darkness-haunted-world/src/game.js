/**
 * DARKNESS: THE HAUNTED WORLD - Phase 2
 * Master Game Loop & State Coordinator
 * Phase 2 features: Lockers, Hiding, Lore Notes Modal, Checkpoints, and Stealth Ratings
 */

import { CONFIG } from './config.js';
import { AudioManager } from './audio/AudioManager.js';
import { HorrorSoundscape } from './audio/HorrorSoundscape.js';
import { CollisionSystem } from './player/Collision.js';
import { Controls } from './player/Controls.js';
import { Player } from './player/Player.js';
import { World } from './world/World.js';
import { Enemy } from './enemies/Enemy.js';
import { ENEMY_REGISTRY } from './enemies/EnemyRegistry.js';
import { Inventory } from './gameplay/Inventory.js';
import { InteractionSystem } from './gameplay/Interaction.js';
import { ObjectiveManager } from './gameplay/Objectives.js';
import { SaveSystem } from './gameplay/SaveSystem.js';
import { HUD } from './ui/HUD.js';
import { MainMenu } from './ui/MainMenu.js';
import { PauseMenu } from './ui/PauseMenu.js';
import { SettingsMenu } from './ui/Settings.js';
import { AboutScreen } from './ui/About.js';
import { CreditsScreen } from './ui/Credits.js';

export class Game {
  constructor() {
    this.state = 'MENU';
    this.container = document.getElementById('game-container');

    // Systems
    this.audio = new AudioManager();
    this.soundscape = new HorrorSoundscape(this.audio);
    this.collision = new CollisionSystem();
    this.interaction = new InteractionSystem();
    this.inventory = new Inventory();
    this.objectives = new ObjectiveManager((obj) => this.onObjectiveChanged(obj));
    this.settings = SaveSystem.loadSettings();

    // Three.js Core
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.clock = new THREE.Clock();

    // Entities
    this.world = null;
    this.player = null;
    this.controls = null;
    this.enemy = null;

    // UI
    this.hud = null;
    this.mainMenu = null;
    this.pauseMenu = null;
    this.settingsMenu = null;
    this.aboutScreen = null;
    this.creditsScreen = null;

    // Phase 2 Metrics & Checkpoints
    this.gameStartTime = 0;
    this.elapsedTime = 0;
    this.timesSpotted = 0;
    this.lastSpottedState = false;

    this.init();
  }

  init() {
    this.setupThreeJS();
    this.setupUI();
    this.setupGameWorld();
    this.setupEventListeners();
    this.applySettings(this.settings);

    requestAnimationFrame((time) => this.loop(time));
  }

  setupThreeJS() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06070a);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      60
    );
    this.scene.add(this.camera);

    this.renderer = new THREE.WebGLRenderer({
      powerPreference: 'high-performance',
      antialias: false,
      stencil: false,
      depth: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.2));
    this.renderer.shadowMap.enabled = false;
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupUI() {
    this.hud = new HUD();

    this.mainMenu = new MainMenu({
      onStart: () => this.startGame(),
      onLevelSelect: () => {
        this.hud.showNotification('Level 1: St. Jude Asylum (Active)');
      },
      onSettings: () => this.settingsMenu.show(),
      onAbout: () => this.aboutScreen.show(),
      onCredits: () => this.creditsScreen.show()
    });

    this.pauseMenu = new PauseMenu({
      onResume: () => this.resumeGame(),
      onRestart: () => this.restartGame(),
      onSettings: () => this.settingsMenu.show(),
      onMainMenu: () => this.returnToMainMenu()
    });

    this.settingsMenu = new SettingsMenu({
      onChange: (newSettings) => this.applySettings(newSettings)
    });

    this.aboutScreen = new AboutScreen();
    this.creditsScreen = new CreditsScreen();

    // Death Screen buttons
    const deathRestartBtn = document.getElementById('btn-death-restart');
    const deathCheckpointBtn = document.getElementById('btn-death-checkpoint');
    const deathMenuBtn = document.getElementById('btn-death-menu');

    if (deathRestartBtn) deathRestartBtn.addEventListener('click', () => this.restartGame(false));
    if (deathCheckpointBtn) deathCheckpointBtn.addEventListener('click', () => this.restartGame(true));
    if (deathMenuBtn) deathMenuBtn.addEventListener('click', () => this.returnToMainMenu());

    // Victory Screen buttons
    const victoryContinueBtn = document.getElementById('btn-victory-continue');
    const victoryMenuBtn = document.getElementById('btn-victory-menu');
    if (victoryContinueBtn) victoryContinueBtn.addEventListener('click', () => this.returnToMainMenu());
    if (victoryMenuBtn) victoryMenuBtn.addEventListener('click', () => this.returnToMainMenu());

    // Note Modal Close
    const closeNoteBtn = document.getElementById('btn-close-note');
    if (closeNoteBtn) {
      closeNoteBtn.addEventListener('click', () => {
        const noteModal = document.getElementById('note-modal');
        if (noteModal) noteModal.style.display = 'none';
      });
    }
  }

  setupGameWorld() {
    this.world = new World(this.scene, this.collision, this.interaction);
    this.world.buildLevel1();

    this.player = new Player(this.camera, this.collision, this.audio);
    this.player.reset(0, 9); // Spawn in Reception

    this.controls = new Controls(this.container, {
      sensitivity: this.settings.touchSensitivity
    });

    this.enemy = new Enemy(this.scene, ENEMY_REGISTRY.SURGEON);
    this.enemy.mesh.position.set(0, 0, -6);
    this.enemy.ai.setWaypoints([
      new THREE.Vector3(0, 0, -6),
      new THREE.Vector3(0, 0, -18),
      new THREE.Vector3(-8, 0, -13),
      new THREE.Vector3(0, 0, -10),
      new THREE.Vector3(8, 0, -3),
      new THREE.Vector3(0, 0, 0)
    ]);
  }

  setupEventListeners() {
    const flashBtn = document.getElementById('btn-action-flashlight');
    if (flashBtn) {
      flashBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.player.toggleFlashlight();
      });
    }

    const sprintBtn = document.getElementById('btn-action-sprint');
    if (sprintBtn) {
      sprintBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.controls.isSprinting = true;
      });
      sprintBtn.addEventListener('touchend', (e) => {
        e.preventDefault();
        this.controls.isSprinting = false;
      });
    }

    const crouchBtn = document.getElementById('btn-action-crouch');
    if (crouchBtn) {
      crouchBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.controls.isCrouching = !this.controls.isCrouching;
      });
    }

    const interactBtn = document.getElementById('btn-action-interact');
    if (interactBtn) {
      interactBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.triggerInteraction();
      });
    }

    const pauseBtn = document.getElementById('btn-action-pause');
    if (pauseBtn) {
      pauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.pauseGame();
      });
    }
  }

  showNoteModal(title, text) {
    const modal = document.getElementById('note-modal');
    const titleEl = document.getElementById('note-modal-title');
    const bodyEl = document.getElementById('note-modal-body');
    if (modal && titleEl && bodyEl) {
      titleEl.innerText = title;
      bodyEl.innerText = text;
      modal.style.display = 'flex';
      if (this.audio) this.audio.playPickupSound();
    }
  }

  startGame() {
    this.audio.init();
    this.audio.resume();
    this.state = 'PLAYING';
    this.gameStartTime = Date.now();
    this.timesSpotted = 0;
    this.mainMenu.hide();
    document.getElementById('hud-screen').style.display = 'block';
    this.hud.showNotification('Investigate the hospital. Search for the Generator Key.');
  }

  pauseGame() {
    if (this.state !== 'PLAYING') return;
    this.state = 'PAUSED';
    this.pauseMenu.show();
  }

  resumeGame() {
    if (this.state !== 'PAUSED') return;
    this.state = 'PLAYING';
    this.pauseMenu.hide();
  }

  restartGame(fromCheckpoint = false) {
    document.getElementById('death-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    this.pauseMenu.hide();

    let spawnX = 0;
    let spawnZ = 9;

    if (fromCheckpoint) {
      if (this.world.environment.checkpoints.hasPower) {
        // Respawn near Substation with power active
        spawnX = 7.0;
        spawnZ = -10.0;
        this.inventory.addItem('generator_key');
        this.objectives.advanceTo(4);
      } else if (this.world.environment.checkpoints.hasKey) {
        // Respawn near Doctor's Office with key in hand
        spawnX = -7.0;
        spawnZ = -3.0;
        this.inventory.addItem('generator_key');
        this.objectives.advanceTo(2);
      } else {
        this.inventory.reset();
        this.objectives.reset();
        this.world.buildLevel1();
      }
    } else {
      this.inventory.reset();
      this.objectives.reset();
      this.world.buildLevel1();
    }

    this.player.reset(spawnX, spawnZ);

    // Reset enemy to patrol corridor
    this.enemy.mesh.position.set(0, 0, -6);
    this.enemy.ai.state = 'PATROL';
    this.enemy.setChasing(false);

    this.state = 'PLAYING';
    this.gameStartTime = Date.now();
    this.hud.showNotification(fromCheckpoint ? 'Resumed from Checkpoint!' : 'Nightmare reset. Stay silent.');
  }

  returnToMainMenu() {
    this.state = 'MENU';
    this.pauseMenu.hide();
    document.getElementById('death-screen').style.display = 'none';
    document.getElementById('victory-screen').style.display = 'none';
    document.getElementById('hud-screen').style.display = 'none';
    this.mainMenu.show();
  }

  triggerInteraction() {
    if (this.state !== 'PLAYING') return;
    if (this.player.isHiding) {
      this.player.exitHiding();
      this.hud.showNotification('You exited the locker.');
      return;
    }
    this.interaction.triggerInteract(this);
  }

  onObjectiveChanged(objective) {
    if (this.hud) {
      this.hud.update(this.player, objective, this.interaction.currentFocused);
    }
  }

  onPlayerEscape() {
    this.state = 'VICTORY';
    this.elapsedTime = Math.round((Date.now() - this.gameStartTime) / 1000);
    if (this.audio) this.audio.playVictoryFanfare();

    let rating = 'S';
    let ratingTitle = 'GHOST SURVIVOR';
    if (this.timesSpotted >= 4) {
      rating = 'C';
      ratingTitle = 'BATTERED ESCAPEE';
    } else if (this.timesSpotted >= 2) {
      rating = 'B';
      ratingTitle = 'ALERT RUNNER';
    } else if (this.timesSpotted >= 1) {
      rating = 'A';
      ratingTitle = 'SHADOW SURVIVOR';
    }

    const statsEl = document.getElementById('victory-stats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div style="font-size: 1.2rem; color: #ffd700; margin-bottom: 6px;">Stealth Grade: ${rating} (${ratingTitle})</div>
        <div>Escape Time: <strong>${this.elapsedTime} seconds</strong></div>
        <div>Health Remaining: <strong>${Math.round(this.player.health)}%</strong></div>
        <div>Times Detected: <strong>${this.timesSpotted}</strong></div>
      `;
    }

    const vicScreen = document.getElementById('victory-screen');
    if (vicScreen) vicScreen.style.display = 'flex';
  }

  onPlayerDied() {
    this.state = 'DEAD';
    if (this.settings.vibrationEnabled) {
      if (window.AndroidBridge && typeof window.AndroidBridge.vibrate === 'function') {
        window.AndroidBridge.vibrate(600);
      } else if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate([300, 100, 400]);
      }
    }

    // Enable/disable checkpoint button on death screen
    const chkBtn = document.getElementById('btn-death-checkpoint');
    const hasCheckpoint = this.world.environment.checkpoints.hasKey || this.world.environment.checkpoints.hasPower;
    if (chkBtn) {
      chkBtn.style.display = hasCheckpoint ? 'block' : 'none';
    }

    const deathScreen = document.getElementById('death-screen');
    if (deathScreen) deathScreen.style.display = 'flex';
  }

  applySettings(s) {
    this.settings = s;
    if (this.audio) {
      this.audio.setMasterVolume(s.masterVolume);
      this.audio.setSfxVolume(s.sfxVolume);
      this.audio.setAmbientVolume(s.ambientVolume);
    }
    if (this.controls) {
      this.controls.sensitivity = s.touchSensitivity;
    }
    if (this.renderer) {
      const preset = CONFIG.GRAPHICS[s.graphicsQuality] || CONFIG.GRAPHICS.MEDIUM;
      this.renderer.setPixelRatio(preset.pixelRatio);
    }
  }

  onWindowResize() {
    if (!this.camera || !this.renderer) return;
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  loop() {
    requestAnimationFrame((time) => this.loop(time));

    const delta = Math.min(this.clock.getDelta(), 0.1);

    if (this.state === 'PLAYING') {
      this.controls.update();

      if (this.controls.interactPressed) {
        this.controls.interactPressed = false;
        this.triggerInteraction();
      }
      if (this.controls.flashlightTogglePressed) {
        this.controls.flashlightTogglePressed = false;
        this.player.toggleFlashlight();
      }
      if (this.controls.pausePressed) {
        this.controls.pausePressed = false;
        this.pauseGame();
      }

      this.player.update(delta, this.controls);
      this.world.update(delta);

      // Check forward interaction raycast
      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      const focusedItem = this.interaction.update(this.player.position, camDir);

      // Update Enemy
      let distToEnemy = 999;
      if (this.enemy) {
        const aiStatus = this.enemy.update(delta, this.player, this.collision, this.audio);
        distToEnemy = aiStatus.distToPlayer;

        // Track spotted times for stealth rating
        if (aiStatus.isChasing && !this.lastSpottedState) {
          this.timesSpotted += 1;
        }
        this.lastSpottedState = aiStatus.isChasing;
      }

      // Update Soundscape tension & heartbeat
      this.soundscape.update(delta, this.player, this.enemy);

      // Update HUD
      this.hud.update(this.player, this.objectives.getCurrentObjective(), focusedItem, distToEnemy);

      // Check Player Death
      if (this.player.isDead) {
        this.onPlayerDied();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
