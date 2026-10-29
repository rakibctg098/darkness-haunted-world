/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * World Coordinator with Multi-Environment Support (Hospital & Cursed Graveyard)
 */

import { Lighting } from './Lighting.js';
import { HospitalEnvironment } from './Environment.js';
import { GraveyardEnvironment } from './GraveyardEnvironment.js';

export class World {
  constructor(scene, collision, interaction) {
    this.scene = scene;
    this.collision = collision;
    this.interaction = interaction;
    this.currentLevelType = 'HOSPITAL';

    this.lighting = new Lighting(this.scene);
    this.environment = null;
  }

  buildHospitalLevel() {
    this.clearWorld();
    this.currentLevelType = 'HOSPITAL';
    this.lighting = new Lighting(this.scene);
    this.environment = new HospitalEnvironment(this.scene, this.collision, this.interaction, this.lighting);
    this.environment.build();
  }

  buildGraveyardLevel() {
    this.clearWorld();
    this.currentLevelType = 'GRAVEYARD';
    this.lighting = new Lighting(this.scene);
    this.environment = new GraveyardEnvironment(this.scene, this.collision, this.interaction, this.lighting);
    this.environment.build();
  }

  clearWorld() {
    this.collision.clear();
    this.interaction.clear();

    // Remove old meshes from scene except camera
    const toRemove = [];
    this.scene.children.forEach(child => {
      if (child.type !== 'PerspectiveCamera' && !child.isCamera) {
        toRemove.push(child);
      }
    });
    toRemove.forEach(c => this.scene.remove(c));
  }

  update(delta) {
    if (this.lighting) {
      this.lighting.update(delta);
    }
  }
}
