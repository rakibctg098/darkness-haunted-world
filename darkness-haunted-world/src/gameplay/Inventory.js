/**
 * DARKNESS: THE HAUNTED WORLD
 * Player Inventory System
 */

export class Inventory {
  constructor() {
    this.items = new Set();
    this.batteries = 0;
  }

  reset() {
    this.items.clear();
    this.batteries = 0;
  }

  addItem(itemId) {
    this.items.add(itemId);
  }

  hasItem(itemId) {
    return this.items.has(itemId);
  }

  removeItem(itemId) {
    this.items.delete(itemId);
  }

  addBattery() {
    this.batteries += 1;
  }

  consumeBattery() {
    if (this.batteries > 0) {
      this.batteries -= 1;
      return true;
    }
    return false;
  }
}
