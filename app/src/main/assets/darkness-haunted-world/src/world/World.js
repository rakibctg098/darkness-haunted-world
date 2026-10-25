/**
 * DARKNESS: THE HAUNTED WORLD
 * World Coordinator
 */

import { Lighting } from './Lighting.js';
import { HospitalEnvironment } from './Environment.js';

export class World {
  constructor(scene, collision, interaction) {
    this.scene = scene;
    this.collision = collision;
    this.interaction = interaction;

    this.lighting = new Lighting(this.scene);
    this.environment = new HospitalEnvironment(this.scene, this.collision, this.interaction, this.lighting);
  }

  buildLevel1() {
    this.collision.clear();
    this.interaction.clear();
    this.environment.build();
  }

  update(delta) {
    this.lighting.update(delta);
  }
}
