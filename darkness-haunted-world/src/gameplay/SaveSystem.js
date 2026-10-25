/**
 * DARKNESS: THE HAUNTED WORLD
 * Save System & Local Storage Persistence
 */

import { CONFIG } from '../config.js';

const STORAGE_KEY_SETTINGS = 'darkness_settings_v1';
const STORAGE_KEY_PROGRESS = 'darkness_progress_v1';

export class SaveSystem {
  static loadSettings() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_SETTINGS);
      if (data) {
        return { ...CONFIG.DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('Failed to load settings from storage', e);
    }
    return { ...CONFIG.DEFAULT_SETTINGS };
  }

  static saveSettings(settings) {
    try {
      localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to save settings to storage', e);
    }
  }

  static resetSettings() {
    try {
      localStorage.removeItem(STORAGE_KEY_SETTINGS);
    } catch (e) {}
    return { ...CONFIG.DEFAULT_SETTINGS };
  }

  static loadProgress() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_PROGRESS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {}
    return {
      unlockedLevels: [1],
      bestEscapeTimeSec: null,
      completedStories: 0
    };
  }

  static saveProgress(progress) {
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(progress));
    } catch (e) {}
  }
}
