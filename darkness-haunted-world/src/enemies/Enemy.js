/**
 * DARKNESS: THE HAUNTED WORLD
 * 3D Procedural Horror Character: The Surgeon
 * Complete rigged procedural geometry with menacing animations & glowing eyes
 */

import { EnemyAI } from './EnemyAI.js';
import { ENEMY_REGISTRY } from './EnemyRegistry.js';

export class Enemy {
  constructor(scene, config = ENEMY_REGISTRY.SURGEON) {
    this.scene = scene;
    this.config = config;

    this.mesh = new THREE.Group();
    this.ai = new EnemyAI(this, this.config);

    // Animation references
    this.headMesh = null;
    this.leftArm = null;
    this.rightArm = null;
    this.leftLeg = null;
    this.rightLeg = null;
    this.eyeLights = [];
    this.dangerAura = null;

    this.animTime = 0;
    this.isChasing = false;

    this.buildCharacterMesh();
    this.scene.add(this.mesh);
  }

  buildCharacterMesh() {
    const coatColor = this.config.color || 0x771515;

    // 1. Torso / Surgical Apron Gown
    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.42, 1.15, 8);
    const torsoMat = new THREE.MeshStandardMaterial({
      color: coatColor,
      roughness: 0.85,
      metalness: 0.1
    });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.25;
    this.mesh.add(torso);

    // 2. Head with Surgical Mask
    this.headMesh = new THREE.Group();
    this.headMesh.position.y = 1.95;

    const skullGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const skinMat = new THREE.MeshStandardMaterial({
      color: 0xd8d0cb,
      roughness: 0.7
    });
    const skull = new THREE.Mesh(skullGeo, skinMat);
    this.headMesh.add(skull);

    // Mask
    const maskGeo = new THREE.BoxGeometry(0.28, 0.16, 0.15);
    const maskMat = new THREE.MeshStandardMaterial({ color: 0x334444 });
    const mask = new THREE.Mesh(maskGeo, maskMat);
    mask.position.set(0, -0.06, 0.16);
    this.headMesh.add(mask);

    // Glowing Crimson Eyes
    [-0.08, 0.08].forEach(eyeX => {
      const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(eyeX, 0.04, 0.22);
      this.headMesh.add(eye);
    });

    this.mesh.add(this.headMesh);

    // 3. Right Arm with Surgical Bone Saw
    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.42, 1.7, 0);

    const rArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 6);
    const armMat = new THREE.MeshStandardMaterial({ color: coatColor });
    const rArmMesh = new THREE.Mesh(rArmGeo, armMat);
    rArmMesh.position.y = -0.38;
    this.rightArm.add(rArmMesh);

    // Bone saw blade
    const sawGeo = new THREE.BoxGeometry(0.04, 0.55, 0.14);
    const sawMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
    const saw = new THREE.Mesh(sawGeo, sawMat);
    saw.position.set(0, -0.85, 0.12);
    saw.rotation.x = 0.5;
    this.rightArm.add(saw);

    this.mesh.add(this.rightArm);

    // 4. Left Arm (twitchy arm)
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.42, 1.7, 0);
    const lArmMesh = new THREE.Mesh(rArmGeo, armMat);
    lArmMesh.position.y = -0.38;
    this.leftArm.add(lArmMesh);
    this.mesh.add(this.leftArm);

    // 5. Legs
    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.8, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e });

    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.18, 0.4, 0);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.18, 0.4, 0);
    this.mesh.add(this.rightLeg);

    // 6. Red Danger Glow Aura (activates during CHASE)
    this.dangerAura = new THREE.PointLight(0xff0022, 0, 8, 2);
    this.dangerAura.position.set(0, 1.5, 0);
    this.mesh.add(this.dangerAura);
  }

  setChasing(chasing) {
    this.isChasing = chasing;
    if (this.dangerAura) {
      this.dangerAura.intensity = chasing ? 2.5 : 0;
    }
  }

  update(delta, player, collision, audio) {
    const aiStatus = this.ai.update(delta, player, collision, audio);

    // Procedural walk animation
    this.animTime += delta * (this.isChasing ? 12 : 5);
    const swing = Math.sin(this.animTime) * (this.isChasing ? 0.7 : 0.35);

    if (this.leftLeg && this.rightLeg) {
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
    }

    if (this.leftArm && this.rightArm) {
      this.leftArm.rotation.x = -swing;
      this.rightArm.rotation.x = swing + (this.isChasing ? 0.6 : 0.2);
    }

    // Unnatural head twitching
    if (this.headMesh) {
      if (Math.random() < 0.04) {
        this.headMesh.rotation.z = (Math.random() - 0.5) * 0.4;
      } else {
        this.headMesh.rotation.z *= 0.9;
      }
    }

    return aiStatus;
  }
}
