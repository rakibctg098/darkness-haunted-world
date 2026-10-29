/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Master Game Loop & State Coordinator
 * Phase 3 features: Story Creator, Character Customizer, Cursed Graveyard, Corpse Rising, and Ghostly Weeping
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
import { StoryCreator } from './ui/StoryCreator.js';
import { CharacterCustomizer } from './ui/CharacterCustomizer.js';

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
    this.storyCreator = null;
    this.charCustomizer = null;

    // Phase 2 & 3 Metrics & Current Story
    this.gameStartTime = 0;
    this.elapsedTime = 0;
    this.timesSpotted = 0;
    this.lastSpottedState = false;
    this.activeStoryConfig = {
      title: 'The Last Patient',
      location: 'HOSPITAL',
      enemyId: 'SURGEON',
      difficulty: 'NORMAL',
      enableWeepingAmbience: true
    };

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
      onStoryCreator: () => this.storyCreator.show(),
      onCharCustomizer: () => this.charCustomizer.show(),
      onSettings: () => this.settingsMenu.show(),
      onAbout: () => this.aboutScreen.show(),
      onCredits: () => this.creditsScreen.show(),
      onCycleBrightness: () => this.cycleBrightness()
    });

    this.pauseMenu = new PauseMenu({
      onResume: () => this.resumeGame(),
      onRestart: () => this.restartGame(),
      onSettings: () => this.settingsMenu.show(),
      onMainMenu: () => this.returnToMainMenu()
    });

    this.settingsMenu = new SettingsMenu({
      onChange: (newSettings) => this.applySettings(newSettings),
      onBrightnessChange: (preset) => this.setBrightnessPreset(preset)
    });

    this.storyCreator = new StoryCreator({
      onLaunchStory: (config) => this.launchCustomStory(config)
    });

    this.charCustomizer = new CharacterCustomizer({
      onApply: (charConfig) => this.applyCharacterConfig(charConfig)
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
    this.world.buildHospitalLevel();
    if (this.hud) this.hud.setLighting(this.world.lighting);

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

  setBrightnessPreset(preset) {
    if (this.world && this.world.lighting) {
      this.world.lighting.setBrightnessPreset(preset);
    }
    if (this.hud) {
      this.hud.updateBrightnessButtonLabel();
    }
    if (this.mainMenu) {
      this.mainMenu.updateTexts();
    }
  }

  cycleBrightness() {
    let newPreset = 'NORMAL';
    if (this.world && this.world.lighting) {
      newPreset = this.world.lighting.cycleBrightnessPreset();
    }
    if (this.hud) {
      this.hud.updateBrightnessButtonLabel();
    }
    if (this.mainMenu) {
      this.mainMenu.updateTexts();
    }
    return newPreset;
  }

  launchCustomStory(config) {
    this.activeStoryConfig = config;
    this.audio.init();
    this.audio.resume();

    // Build selected world
    if (config.location === 'GRAVEYARD') {
      this.world.buildGraveyardLevel();
      if (this.hud) this.hud.setLighting(this.world.lighting);
      this.player.reset(0, 10); // Entrance path
      this.soundscape.setGraveyardMode(true);

      const enemyDef = ENEMY_REGISTRY[config.enemyId] || ENEMY_REGISTRY.CORPSE;
      this.enemy.rebuild(enemyDef);
      this.enemy.mesh.position.set(0, -2.5, -8); // Buried in grave initially
      this.enemy.ai.setWaypoints([
        new THREE.Vector3(0, 0, -8),
        new THREE.Vector3(-14, 0, -12),
        new THREE.Vector3(14, 0, -6),
        new THREE.Vector3(-15, 0, -14),
        new THREE.Vector3(0, 0, 2)
      ]);

      // Graveyard Objectives (Bilingual)
      this.objectives.setLevelType('GRAVEYARD');
    } else {
      // Hospital
      this.world.buildHospitalLevel();
      if (this.hud) this.hud.setLighting(this.world.lighting);
      this.player.reset(0, 9);
      this.soundscape.setGraveyardMode(false);

      const enemyDef = ENEMY_REGISTRY[config.enemyId] || ENEMY_REGISTRY.SURGEON;
      this.enemy.rebuild(enemyDef);
      this.enemy.mesh.position.set(0, 0, -6);
      this.enemy.ai.setWaypoints([
        new THREE.Vector3(0, 0, -6),
        new THREE.Vector3(0, 0, -18),
        new THREE.Vector3(-8, 0, -13),
        new THREE.Vector3(0, 0, -10),
        new THREE.Vector3(8, 0, -3),
        new THREE.Vector3(0, 0, 0)
      ]);

      // Hospital Objectives (Bilingual)
      this.objectives.setLevelType('HOSPITAL');
    }

    this.soundscape.setWeepingEnabled(config.enableWeepingAmbience);

    this.state = 'PLAYING';
    this.gameStartTime = Date.now();
    this.timesSpotted = 0;
    this.mainMenu.hide();
    document.getElementById('hud-screen').style.display = 'block';
    this.hud.showNotification(`Story Launched: ${config.title}`);
  }

  applyCharacterConfig(charConfig) {
    if (this.player && this.player.flashlight) {
      this.player.flashlight.color.set(charConfig.flashlightColor || '#ffeedd');
    }

    if (charConfig.startingItem === 'BATTERY') {
      this.inventory.addBattery();
      this.hud.showNotification('Bonus Battery Added to Inventory');
    } else if (charConfig.startingItem === 'ADRENALINE') {
      this.player.injectAdrenaline(8);
      this.hud.showNotification('Starting Adrenaline Rush Activated!');
    }

    if (charConfig.enemyAggression === 'RELENTLESS') {
      this.enemy.ai.config.chaseSpeed += 0.8;
      this.enemy.ai.config.detectionRange += 4.0;
    } else if (charConfig.enemyAggression === 'BERSERK') {
      this.enemy.ai.config.chaseSpeed += 1.4;
      this.enemy.ai.config.attackDamage += 15;
    }
    this.hud.showNotification('Character modifications applied!');
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
    this.launchCustomStory(this.activeStoryConfig);
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
    let spawnZ = this.activeStoryConfig.location === 'GRAVEYARD' ? 10 : 9;

    if (fromCheckpoint && this.world.environment && this.world.environment.checkpoints) {
      if (this.world.environment.checkpoints.hasPower) {
        spawnX = 7.0;
        spawnZ = -10.0;
        this.inventory.addItem('generator_key');
        this.objectives.advanceTo(4);
      } else if (this.world.environment.checkpoints.hasKey) {
        spawnX = -7.0;
        spawnZ = -3.0;
        this.inventory.addItem('generator_key');
        this.objectives.advanceTo(2);
      }
    } else {
      this.inventory.reset();
      this.objectives.reset();
      if (this.activeStoryConfig.location === 'GRAVEYARD') {
        this.world.buildGraveyardLevel();
      } else {
        this.world.buildHospitalLevel();
      }
    }

    this.player.reset(spawnX, spawnZ);

    if (this.activeStoryConfig.location === 'GRAVEYARD') {
      this.enemy.mesh.position.set(0, -2.5, -8);
      this.enemy.ai.state = 'PATROL';
      this.enemy.setChasing(false);
    } else {
      this.enemy.mesh.position.set(0, 0, -6);
      this.enemy.ai.state = 'PATROL';
      this.enemy.setChasing(false);
    }

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

    const chkBtn = document.getElementById('btn-death-checkpoint');
    const hasCheckpoint = this.world.environment && this.world.environment.checkpoints &&
      (this.world.environment.checkpoints.hasKey || this.world.environment.checkpoints.hasPower);
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

      // Automatic cinematic proximity trigger for Graveyard corpse awakening
      if (this.activeStoryConfig && this.activeStoryConfig.location === 'GRAVEYARD' &&
          this.world.environment && this.world.environment.triggerCorpseAwakening &&
          !this.world.environment.hasCorpseRisen) {
        const distToGrave = Math.hypot(this.player.position.x - 0, this.player.position.z - (-8));
        if (distToGrave < 5.5) {
          this.world.environment.triggerCorpseAwakening(this);
        }
      }

      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      const focusedItem = this.interaction.update(this.player.position, camDir);

      let distToEnemy = 999;
      if (this.enemy) {
        const aiStatus = this.enemy.update(delta, this.player, this.collision, this.audio);
        distToEnemy = aiStatus.distToPlayer;

        if (aiStatus.isChasing && !this.lastSpottedState) {
          this.timesSpotted += 1;
        }
        this.lastSpottedState = aiStatus.isChasing;
      }

      this.soundscape.update(delta, this.player, this.enemy);
      this.hud.update(this.player, this.objectives.getCurrentObjective(), focusedItem, distToEnemy);

      if (this.player.isDead) {
        this.onPlayerDied();
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}
