/**
 * DARKNESS: THE HAUNTED WORLD
 * Core Configuration & Developer Identity
 */

export const CONFIG = {
  GAME_TITLE: "DARKNESS: THE HAUNTED WORLD",
  VERSION: "1.0.0-phase1",
  
  // Mandatory Developer Credits
  CREDITS: {
    DEVELOPER_NAME: "Made by Mohammad Rakib",
    TELEGRAM_LABEL: "Telegram channel: https://t.me/appdevbyrakib",
    TELEGRAM_URL: "https://t.me/appdevbyrakib",
    ROLE: "Senior Game Developer & Sound/Level Designer"
  },

  // Player Attributes
  PLAYER: {
    WALK_SPEED: 4.2,
    SPRINT_SPEED: 7.5,
    CROUCH_SPEED: 2.2,
    HEIGHT: 1.7,
    CROUCH_HEIGHT: 0.9,
    RADIUS: 0.45,
    MAX_HEALTH: 100,
    MAX_STAMINA: 100,
    STAMINA_DRAIN_RATE: 24, // per sec sprinting
    STAMINA_RECOVER_RATE: 18, // per sec walking or still
    MAX_BATTERY: 100,
    BATTERY_DRAIN_RATE: 1.8, // % per sec with flashlight on
    FLASHLIGHT_INTENSITY: 2.8,
    FLASHLIGHT_DISTANCE: 26,
    FLASHLIGHT_ANGLE: Math.PI / 4.8,
    FLASHLIGHT_PENUMBRA: 0.4
  },

  // Enemy: The Surgeon Baseline
  ENEMY: {
    NAME: "The Surgeon",
    ARCHETYPE: "SURGEON",
    PATROL_SPEED: 2.6,
    INVESTIGATE_SPEED: 3.4,
    CHASE_SPEED: 5.6,
    ATTACK_RANGE: 1.6,
    ATTACK_DAMAGE: 45,
    ATTACK_COOLDOWN: 1.4,
    DETECTION_RANGE: 16.0,
    HEARING_RANGE_WALK: 6.0,
    HEARING_RANGE_SPRINT: 15.0,
    FIELD_OF_VIEW_DEG: 110,
    SEARCH_DURATION: 6.0
  },

  // Graphics Presets
  GRAPHICS: {
    LOW: {
      pixelRatio: 0.85,
      shadows: false,
      fogDensity: 0.045,
      particles: false
    },
    MEDIUM: {
      pixelRatio: 1.0,
      shadows: false,
      fogDensity: 0.04,
      particles: true
    },
    HIGH: {
      pixelRatio: Math.min(window.devicePixelRatio || 1, 1.5),
      shadows: true,
      fogDensity: 0.035,
      particles: true
    }
  },

  // Default User Settings
  DEFAULT_SETTINGS: {
    graphicsQuality: "MEDIUM",
    masterVolume: 0.85,
    musicVolume: 0.7,
    sfxVolume: 0.9,
    ambientVolume: 0.8,
    touchSensitivity: 1.2,
    controlOpacity: 0.8,
    vibrationEnabled: true,
    subtitlesEnabled: true,
    reducedFlashing: false
  }
};
