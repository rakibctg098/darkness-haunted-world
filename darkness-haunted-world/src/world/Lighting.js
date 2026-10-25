/**
 * DARKNESS: THE HAUNTED WORLD
 * Atmospheric Lighting & Fluorescent Flickering Engine
 */

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.flickerLights = [];
    this.emergencyLights = [];
    this.isEmergencyActive = false;
    this.setupBaseLighting();
  }

  setupBaseLighting() {
    // 1. Very faint ambient moonlight (deep desaturated dark blue)
    const ambient = new THREE.AmbientLight(0x0c1018, 0.45);
    this.scene.add(ambient);

    // 2. Scene Fog (dark claustrophobic horror fog)
    this.scene.fog = new THREE.FogExp2(0x06070a, 0.048);
  }

  addFlickeringCorridorLight(x, y, z, color = 0xdde5ff, intensity = 1.1) {
    const light = new THREE.PointLight(color, intensity, 12, 1.8);
    light.position.set(x, y, z);
    this.scene.add(light);

    // Subtle ceiling fixture visual
    const fixGeo = new THREE.BoxGeometry(0.35, 0.08, 1.2);
    const fixMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    const fixture = new THREE.Mesh(fixGeo, fixMat);
    fixture.position.set(x, y + 0.1, z);
    this.scene.add(fixture);

    // Fluorescent tube bulb
    const bulbGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 8);
    bulbGeo.rotateX(Math.PI / 2);
    const bulbMat = new THREE.MeshBasicMaterial({ color: color });
    const bulb = new THREE.Mesh(bulbGeo, bulbMat);
    bulb.position.set(x, y, z);
    this.scene.add(bulb);

    this.flickerLights.push({
      light,
      bulbMat,
      baseIntensity: intensity,
      baseColor: color,
      timer: Math.random() * 2,
      isOff: false
    });
  }

  addEmergencyBeacon(x, y, z) {
    const light = new THREE.PointLight(0xff1111, 0, 15, 1.5);
    light.position.set(x, y, z);
    this.scene.add(light);

    this.emergencyLights.push({
      light,
      baseIntensity: 2.2,
      phase: Math.random() * Math.PI * 2
    });
  }

  activateEmergencyMode() {
    this.isEmergencyActive = true;
    // Dim normal flicker lights and turn on eerie red sirens
    this.flickerLights.forEach(item => {
      item.baseIntensity = 0.3;
    });
  }

  update(delta) {
    // Update fluorescent tube flickering
    for (let i = 0; i < this.flickerLights.length; i++) {
      const item = this.flickerLights[i];
      item.timer -= delta;
      if (item.timer <= 0) {
        if (Math.random() < 0.25) {
          // Rapid buzz/flicker
          item.isOff = !item.isOff;
          item.light.intensity = item.isOff ? 0.05 : item.baseIntensity * (0.6 + Math.random() * 0.6);
          item.bulbMat.color.setHex(item.isOff ? 0x222222 : item.baseColor);
          item.timer = 0.05 + Math.random() * 0.12;
        } else {
          // Steady on for a while
          item.isOff = false;
          item.light.intensity = item.baseIntensity;
          item.bulbMat.color.setHex(item.baseColor);
          item.timer = 1.0 + Math.random() * 3.5;
        }
      }
    }

    // Update emergency rotating / pulsing red beacons
    if (this.isEmergencyActive) {
      const time = Date.now() * 0.005;
      for (let i = 0; i < this.emergencyLights.length; i++) {
        const em = this.emergencyLights[i];
        const pulse = (Math.sin(time + em.phase) + 1) / 2;
        em.light.intensity = pulse * em.baseIntensity;
      }
    }
  }
}
