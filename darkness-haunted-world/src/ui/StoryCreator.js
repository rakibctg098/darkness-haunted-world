/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Story Creator & Scenario Selection Screen
 * Includes mandatory developer credit and clickable Telegram link
 */

import { STORY_TEMPLATES } from '../gameplay/StoryDefinitions.js';

export class StoryCreator {
  constructor(callbacks = {}) {
    this.callbacks = callbacks;
    this.el = document.getElementById('story-creator-screen');
    this.selectedTemplateKey = 'THE_LAST_PATIENT';

    this.bindEvents();
    this.populateTemplates();
  }

  show() {
    if (this.el) this.el.style.display = 'flex';
  }

  hide() {
    if (this.el) this.el.style.display = 'none';
  }

  populateTemplates() {
    const listEl = document.getElementById('story-template-list');
    if (!listEl) return;
    listEl.innerHTML = '';

    Object.keys(STORY_TEMPLATES).forEach(key => {
      const tmpl = STORY_TEMPLATES[key];
      const card = document.createElement('div');
      card.className = `story-card ${key === this.selectedTemplateKey ? 'active' : ''}`;
      card.innerHTML = `
        <div style="font-weight: 800; color: #ff3344; font-size: 0.95rem;">${tmpl.title}</div>
        <div style="font-size: 0.76rem; color: #9aa; margin: 3px 0;">${tmpl.tagline}</div>
        <div style="font-size: 0.72rem; color: #ffaa33;">Location: ${tmpl.location} | Monster: ${tmpl.primaryEnemy}</div>
      `;
      card.addEventListener('click', () => {
        this.selectTemplate(key);
      });
      listEl.appendChild(card);
    });
  }

  selectTemplate(key) {
    this.selectedTemplateKey = key;
    this.populateTemplates();
    const tmpl = STORY_TEMPLATES[key];
    if (!tmpl) return;

    const titleInput = document.getElementById('story-custom-title');
    const locSelect = document.getElementById('story-custom-location');
    const enemySelect = document.getElementById('story-custom-enemy');
    const diffSelect = document.getElementById('story-custom-difficulty');

    if (titleInput) titleInput.value = tmpl.title;
    if (locSelect) locSelect.value = tmpl.location;
    if (enemySelect) enemySelect.value = tmpl.primaryEnemy;
    if (diffSelect) diffSelect.value = tmpl.difficulty;
  }

  bindEvents() {
    const closeBtn = document.getElementById('btn-close-story-creator');
    const playBtn = document.getElementById('btn-launch-custom-story');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.hide();
        this.callbacks.onClose?.();
      });
    }

    if (playBtn) {
      playBtn.addEventListener('click', () => {
        const titleInput = document.getElementById('story-custom-title');
        const locSelect = document.getElementById('story-custom-location');
        const enemySelect = document.getElementById('story-custom-enemy');
        const diffSelect = document.getElementById('story-custom-difficulty');
        const weepingToggle = document.getElementById('story-custom-weeping');

        const customConfig = {
          title: titleInput ? titleInput.value : 'Darkness Survival',
          location: locSelect ? locSelect.value : 'HOSPITAL',
          enemyId: enemySelect ? enemySelect.value : 'SURGEON',
          difficulty: diffSelect ? diffSelect.value : 'NORMAL',
          enableWeepingAmbience: weepingToggle ? weepingToggle.checked : true
        };

        this.hide();
        this.callbacks.onLaunchStory?.(customConfig);
      });
    }
  }
}
