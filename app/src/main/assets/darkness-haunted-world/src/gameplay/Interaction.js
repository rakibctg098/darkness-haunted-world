/**
 * DARKNESS: THE HAUNTED WORLD
 * Interactive Object & Raycasting System
 */

export class InteractionSystem {
  constructor() {
    this.interactables = []; // Array of { id, mesh, label, distance, onInteract }
    this.currentFocused = null;
  }

  clear() {
    this.interactables = [];
    this.currentFocused = null;
  }

  register(item) {
    this.interactables.push(item);
  }

  unregister(id) {
    this.interactables = this.interactables.filter(item => item.id !== id);
    if (this.currentFocused && this.currentFocused.id === id) {
      this.currentFocused = null;
    }
  }

  update(playerPos, cameraForward) {
    let closest = null;
    let minDistance = 2.8;

    for (let i = 0; i < this.interactables.length; i++) {
      const item = this.interactables[i];
      if (!item.mesh || !item.mesh.visible) continue;

      const itemPos = new THREE.Vector3();
      item.mesh.getWorldPosition(itemPos);

      const toItem = itemPos.clone().sub(playerPos);
      const dist = toItem.length();

      if (dist <= (item.distance || 2.6)) {
        // Dot product check to ensure object is in front of camera
        toItem.normalize();
        const dot = toItem.dot(cameraForward);
        if (dot > 0.45 && dist < minDistance) {
          minDistance = dist;
          closest = item;
        }
      }
    }

    this.currentFocused = closest;
    return this.currentFocused;
  }

  triggerInteract(gameContext) {
    if (this.currentFocused && typeof this.currentFocused.onInteract === 'function') {
      this.currentFocused.onInteract(gameContext);
    }
  }
}
