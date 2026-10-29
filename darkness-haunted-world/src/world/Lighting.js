/**
 * DARKNESS: THE HAUNTED WORLD
 * Atmospheric Lighting Engine with Dynamic Brightness Modes:
 * - NORMAL: 'হালকা ডার্ক' (Clear Visibility + Eerie Horror Ambience - Recommended Default)
 * - BRIGHT: 'উজ্জ্বল দৃষ্টি' (High Visibility)
 * - DARK: 'গাঢ় অন্ধকার' (Original Pitch Black)
 */

export class Lighting {
  constructor(scene) {
    this.scene = scene;
    this.flickerLights = [];
    this.emergencyLights = [];
    this.isEmergencyActive = false;
    
    this.ambientLight = null;
    this.moonDirectional = null;

    // Load saved brightness preset or default to NORMAL ('হালকা ডার্ক')
    const saved = localStorage.getItem('dhw_brightness');
    this.currentPreset = saved === 'BRIGHT' || saved === 'DARK' ? saved : 'NORMAL';

    this.setupBaseLighting();
  }

  setupBaseLighting() {
    // 1. Ambient Moonlight Base
    this.ambientLight = new THREE.AmbientLight(0x526075, 1.15);
    this.scene.add(this.ambientLight);

    // 2. Global Directional Moon Fill
    this.moonDirectional = new THREE.DirectionalLight(0x607898, 0.75);
    this.moonDirectional.position.set(10, 25, 10);
    this.scene.add(this.moonDirectional);

    // 3. Fog
    this.scene.fog = new THREE.FogExp2(0x151b24, 0.016);

    // Apply the configured preset
    this.applyBrightnessPreset(this.currentPreset);
  }

  setBrightnessPreset(preset) {
    if (preset !== 'NORMAL' && preset !== 'BRIGHT' && preset !== 'DARK') {
      preset = 'NORMAL';
    }
    this.currentPreset = preset;
    localStorage.setItem('dhw_brightness', preset);
    this.applyBrightnessPreset(preset);
  }

  cycleBrightnessPreset() {
    if (this.currentPreset === 'NORMAL') {
      this.setBrightnessPreset('BRIGHT');
    } else if (this.currentPreset === 'BRIGHT') {
      this.setBrightnessPreset('DARK');
    } else {
      this.setBrightnessPreset('NORMAL');
    }
    return this.currentPreset;
  }

  applyBrightnessPreset(preset) {
    if (!this.ambientLight || !this.scene.fog) return;

    if (preset === 'BRIGHT') {
      // High visibility mode (উজ্জ্বল দৃষ্টি)
      this.ambientLight.color.setHex(0x788aa0);
      this.ambientLight.intensity = 1.6;
      if (this.moonDirectional) {
        this.moonDirectional.color.setHex(0x8095b0);
        this.moonDirectional.intensity = 1.1;
      }
      this.scene.fog.color.setHex(0x202835);
      this.scene.fog.density = 0.008;
    } else if (preset === 'DARK') {
      // Original hardcore dark (গাঢ় অন্ধকার)
      this.ambientLight.color.setHex(0x1e2430);
      this.ambientLight.intensity = 0.55;
      if (this.moonDirectional) {
        this.moonDirectional.color.setHex(0x283545);
        this.moonDirectional.intensity = 0.35;
      }
      this.scene.fog.color.setHex(0x090b10);
      this.scene.fog.density = 0.038;
    } else {
      // NORMAL: 'হালকা ডার্ক' (Comfortable, crisp visibility with horror mood)
      this.ambientLight.color.setHex(0x526075);
      this.ambientLight.intensity = 1.15;
      if (this.moonDirectional) {
        this.moonDirectional.color.setHex(0x607898);
        this.moonDirectional.intensity = 0.75;
      }
      this.scene.fog.color.setHex(0x151b24);
      this.scene.fog.density = 0.016;
    }
  }

  addFlickeringCorridorLight(x, y, z, color = 0xdde5ff, intensity = 1.3) {
    const light = new THREE.PointLight(color, intensity, 14, 1.8);
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
    const light = new THREE.PointLight(0xff1111, 0, 16, 1.5);
    light.position.set(x, y, z);
    this.scene.add(light);

    this.emergencyLights.push({
      light,
      baseIntensity: 2.5,
      phase: Math.random() * Math.PI * 2
    });
  }

  activateEmergencyMode() {
    this.isEmergencyActive = true;
    this.flickerLights.forEach(item => {
      item.baseIntensity = 0.45;
    });
  }

  update(delta) {
    // Update fluorescent tube flickering
    for (let i = 0; i < this.flickerLights.length; i++) {
      const item = this.flickerLights[i];
      item.timer -= delta;
      if (item.timer <= 0) {
        if (Math.random() < 0.2) {
          // Rapid buzz/flicker
          item.isOff = !item.isOff;
          item.light.intensity = item.isOff ? 0.15 : item.baseIntensity * (0.7 + Math.random() * 0.5);
          item.bulbMat.color.setHex(item.isOff ? 0x222222 : item.baseColor);
          item.timer = 0.06 + Math.random() * 0.12;
        } else {
          // Steady on
          item.isOff = false;
          item.light.intensity = item.baseIntensity;
          item.bulbMat.color.setHex(item.baseColor);
          item.timer = 1.2 + Math.random() * 3.5;
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
