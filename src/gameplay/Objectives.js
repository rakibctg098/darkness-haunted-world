/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Level 1 & Level 2 Bilingual Objective Tracker & Quest Progression
 */

import { i18n } from '../ui/Localization.js';

export class ObjectiveManager {
  constructor(onObjectiveChange) {
    this.onObjectiveChange = onObjectiveChange;
    this.currentStep = 1;
    this.levelType = 'HOSPITAL';
    this.isCompleted = false;

    // Re-notify whenever language toggles
    i18n.subscribe(() => {
      this.notify();
    });
  }

  setLevelType(type = 'HOSPITAL') {
    this.levelType = type;
    this.currentStep = 1;
    this.isCompleted = false;
    this.notify();
  }

  reset() {
    this.currentStep = 1;
    this.isCompleted = false;
    this.notify();
  }

  getCurrentObjective() {
    if (this.levelType === 'GRAVEYARD') {
      if (this.currentStep === 1) {
        return {
          title: i18n.t('OBJ_GRAVE_1_TITLE'),
          desc: i18n.t('OBJ_GRAVE_1_DESC')
        };
      } else if (this.currentStep === 2) {
        return {
          title: i18n.t('OBJ_GRAVE_2_TITLE'),
          desc: i18n.t('OBJ_GRAVE_2_DESC')
        };
      } else {
        return {
          title: i18n.t('OBJ_GRAVE_3_TITLE'),
          desc: i18n.t('OBJ_GRAVE_3_DESC')
        };
      }
    } else {
      // HOSPITAL
      if (this.currentStep === 1) {
        return {
          title: i18n.t('OBJ_HOSPITAL_1_TITLE'),
          desc: i18n.t('OBJ_HOSPITAL_1_DESC')
        };
      } else if (this.currentStep === 2) {
        return {
          title: i18n.t('OBJ_HOSPITAL_2_TITLE'),
          desc: i18n.t('OBJ_HOSPITAL_2_DESC')
        };
      } else {
        return {
          title: i18n.t('OBJ_HOSPITAL_3_TITLE'),
          desc: i18n.t('OBJ_HOSPITAL_3_DESC')
        };
      }
    }
  }

  advanceTo(stepNumber) {
    if (stepNumber > this.currentStep) {
      this.currentStep = stepNumber;
      this.notify();
    }
  }

  notify() {
    if (typeof this.onObjectiveChange === 'function') {
      this.onObjectiveChange(this.getCurrentObjective(), this.currentStep);
    }
  }
}
