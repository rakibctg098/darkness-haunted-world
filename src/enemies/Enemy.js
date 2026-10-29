/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Procedural Rigged Horror Entities: The Surgeon, The Risen Corpse, and The Widow
 * Supports grave rising animations, sobbing gestures, and dynamic archetypes
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
    this.dangerAura = null;

    this.animTime = 0;
    this.isChasing = false;

    // Rising from Grave state
    this.isRising = false;
    this.riseProgress = 1.0;
    this.targetY = 0;

    this.buildCharacterMesh();
    this.scene.add(this.mesh);
  }

  rebuild(config) {
    this.scene.remove(this.mesh);
    this.mesh = new THREE.Group();
    this.config = config;
    this.ai = new EnemyAI(this, this.config);
    this.buildCharacterMesh();
    this.scene.add(this.mesh);
  }

  buildCharacterMesh() {
    if (this.config.id === 'CORPSE') {
      this.buildCorpseMesh();
    } else if (this.config.id === 'WIDOW') {
      this.buildWidowMesh();
    } else {
      this.buildSurgeonMesh();
    }
  }

  // --- 1. The Risen Corpse (কবর থেকে ওঠা লাশ) ---
  buildCorpseMesh() {
    const fleshColor = 0x3d4338; // Decayed greenish grey

    // Hunched decayed torso with exposed ribs
    const torsoGeo = new THREE.CylinderGeometry(0.28, 0.38, 1.1, 7);
    const torsoMat = new THREE.MeshStandardMaterial({ color: fleshColor, roughness: 0.95 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.15;
    torso.rotation.x = 0.25; // Hunched posture
    this.mesh.add(torso);

    // Ribcage protrusions
    for (let i = 0; i < 3; i++) {
      const ribGeo = new THREE.TorusGeometry(0.32 - i * 0.02, 0.03, 4, 8, Math.PI);
      const ribMat = new THREE.MeshStandardMaterial({ color: 0x9c9483, roughness: 0.8 });
      const rib = new THREE.Mesh(ribGeo, ribMat);
      rib.position.set(0, 1.25 - i * 0.15, 0.12);
      rib.rotation.x = Math.PI / 2 + 0.2;
      this.mesh.add(rib);
    }

    // Decayed sunken skull
    this.headMesh = new THREE.Group();
    this.headMesh.position.set(0, 1.75, 0.18);

    const skullGeo = new THREE.SphereGeometry(0.22, 10, 10);
    const skullMat = new THREE.MeshStandardMaterial({ color: 0x5a5e52, roughness: 0.9 });
    const skull = new THREE.Mesh(skullGeo, skullMat);
    this.headMesh.add(skull);

    // Burning ember hollow eyes
    [-0.07, 0.07].forEach(eyeX => {
      const eyeGeo = new THREE.SphereGeometry(0.04, 6, 6);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff6600 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(eyeX, 0.02, 0.2);
      this.headMesh.add(eye);
    });

    this.mesh.add(this.headMesh);

    // Claw arms
    const armGeo = new THREE.CylinderGeometry(0.06, 0.05, 0.9, 6);
    const armMat = new THREE.MeshStandardMaterial({ color: fleshColor });

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.38, 1.55, 0.1);
    const lMesh = new THREE.Mesh(armGeo, armMat);
    lMesh.position.y = -0.42;
    this.leftArm.add(lMesh);
    this.mesh.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.38, 1.55, 0.1);
    const rMesh = new THREE.Mesh(armGeo, armMat);
    rMesh.position.y = -0.42;
    this.rightArm.add(rMesh);
    this.mesh.add(this.rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.09, 0.07, 0.75, 6);
    this.leftLeg = new THREE.Mesh(legGeo, armMat);
    this.leftLeg.position.set(-0.16, 0.38, 0);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, armMat);
    this.rightLeg.position.set(0.16, 0.38, 0);
    this.mesh.add(this.rightLeg);

    // Corpse Sickly Green / Orange Aura
    this.dangerAura = new THREE.PointLight(0xff4400, 0, 9, 2);
    this.dangerAura.position.set(0, 1.4, 0);
    this.mesh.add(this.dangerAura);
  }

  // --- 2. The Weeping Widow (কান্নাকাটি করা প্রেতাত্মা) ---
  buildWidowMesh() {
    const gownMat = new THREE.MeshStandardMaterial({ color: 0x9aa4b2, roughness: 0.6 });

    // Flowing mourning lace dress
    const gownGeo = new THREE.CylinderGeometry(0.2, 0.55, 1.6, 12);
    const gown = new THREE.Mesh(gownGeo, gownMat);
    gown.position.y = 1.0;
    this.mesh.add(gown);

    // Pale veiled head
    this.headMesh = new THREE.Group();
    this.headMesh.position.y = 1.85;

    const skullGeo = new THREE.SphereGeometry(0.2, 10, 10);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xe6eef8, roughness: 0.4 });
    const skull = new THREE.Mesh(skullGeo, skinMat);
    this.headMesh.add(skull);

    // Black mourning veil
    const veilGeo = new THREE.BoxGeometry(0.32, 0.45, 0.32);
    const veilMat = new THREE.MeshStandardMaterial({ color: 0x111620, roughness: 0.9, transparent: true, opacity: 0.85 });
    const veil = new THREE.Mesh(veilGeo, veilMat);
    veil.position.set(0, 0.05, 0);
    this.headMesh.add(veil);

    // Glowing weeping cyan eyes
    [-0.06, 0.06].forEach(x => {
      const eye = new THREE.Mesh(new THREE.SphereGeometry(0.03, 6, 6), new THREE.MeshBasicMaterial({ color: 0x00e5ff }));
      eye.position.set(x, -0.02, 0.18);
      this.headMesh.add(eye);
    });

    this.mesh.add(this.headMesh);

    // Pale slender arms
    const armGeo = new THREE.CylinderGeometry(0.04, 0.035, 0.75, 6);
    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.3, 1.5, 0);
    const lMesh = new THREE.Mesh(armGeo, skinMat);
    lMesh.position.y = -0.35;
    this.leftArm.add(lMesh);
    this.mesh.add(this.leftArm);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.3, 1.5, 0);
    const rMesh = new THREE.Mesh(armGeo, skinMat);
    rMesh.position.y = -0.35;
    this.rightArm.add(rMesh);
    this.mesh.add(this.rightArm);

    this.dangerAura = new THREE.PointLight(0x0099ff, 0, 10, 2);
    this.dangerAura.position.set(0, 1.5, 0);
    this.mesh.add(this.dangerAura);
  }

  // --- 3. The Surgeon Baseline ---
  buildSurgeonMesh() {
    const coatColor = this.config.color || 0x771515;

    const torsoGeo = new THREE.CylinderGeometry(0.32, 0.42, 1.15, 8);
    const torsoMat = new THREE.MeshStandardMaterial({ color: coatColor, roughness: 0.85, metalness: 0.1 });
    const torso = new THREE.Mesh(torsoGeo, torsoMat);
    torso.position.y = 1.25;
    this.mesh.add(torso);

    this.headMesh = new THREE.Group();
    this.headMesh.position.y = 1.95;

    const skullGeo = new THREE.SphereGeometry(0.24, 12, 12);
    const skinMat = new THREE.MeshStandardMaterial({ color: 0xd8d0cb, roughness: 0.7 });
    const skull = new THREE.Mesh(skullGeo, skinMat);
    this.headMesh.add(skull);

    const maskGeo = new THREE.BoxGeometry(0.28, 0.16, 0.15);
    const maskMat = new THREE.MeshStandardMaterial({ color: 0x334444 });
    const mask = new THREE.Mesh(maskGeo, maskMat);
    mask.position.set(0, -0.06, 0.16);
    this.headMesh.add(mask);

    [-0.08, 0.08].forEach(eyeX => {
      const eyeGeo = new THREE.SphereGeometry(0.035, 8, 8);
      const eyeMat = new THREE.MeshBasicMaterial({ color: 0xff0022 });
      const eye = new THREE.Mesh(eyeGeo, eyeMat);
      eye.position.set(eyeX, 0.04, 0.22);
      this.headMesh.add(eye);
    });

    this.mesh.add(this.headMesh);

    this.rightArm = new THREE.Group();
    this.rightArm.position.set(0.42, 1.7, 0);
    const rArmGeo = new THREE.CylinderGeometry(0.08, 0.07, 0.8, 6);
    const armMat = new THREE.MeshStandardMaterial({ color: coatColor });
    const rArmMesh = new THREE.Mesh(rArmGeo, armMat);
    rArmMesh.position.y = -0.38;
    this.rightArm.add(rArmMesh);

    const sawGeo = new THREE.BoxGeometry(0.04, 0.55, 0.14);
    const sawMat = new THREE.MeshStandardMaterial({ color: 0x999999, metalness: 0.8, roughness: 0.3 });
    const saw = new THREE.Mesh(sawGeo, sawMat);
    saw.position.set(0, -0.85, 0.12);
    saw.rotation.x = 0.5;
    this.rightArm.add(saw);
    this.mesh.add(this.rightArm);

    this.leftArm = new THREE.Group();
    this.leftArm.position.set(-0.42, 1.7, 0);
    const lArmMesh = new THREE.Mesh(rArmGeo, armMat);
    lArmMesh.position.y = -0.38;
    this.leftArm.add(lArmMesh);
    this.mesh.add(this.leftArm);

    const legGeo = new THREE.CylinderGeometry(0.1, 0.08, 0.8, 6);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1e });
    this.leftLeg = new THREE.Mesh(legGeo, legMat);
    this.leftLeg.position.set(-0.18, 0.4, 0);
    this.mesh.add(this.leftLeg);

    this.rightLeg = new THREE.Mesh(legGeo, legMat);
    this.rightLeg.position.set(0.18, 0.4, 0);
    this.mesh.add(this.rightLeg);

    this.dangerAura = new THREE.PointLight(0xff0022, 0, 8, 2);
    this.dangerAura.position.set(0, 1.5, 0);
    this.mesh.add(this.dangerAura);
  }

  triggerGraveRise(spawnX, spawnZ, audio) {
    this.mesh.position.set(spawnX, -2.2, spawnZ);
    this.targetY = 0;
    this.isRising = true;
    this.riseProgress = 0;
    if (audio) audio.playCorpseRising();
  }

  setChasing(chasing) {
    this.isChasing = chasing;
    if (this.dangerAura) {
      this.dangerAura.intensity = chasing ? 2.8 : 0;
    }
  }

  update(delta, player, collision, audio) {
    // If currently rising from grave, animate upward emergence
    if (this.isRising) {
      this.riseProgress += delta * 0.9;
      this.mesh.position.y = -2.2 + this.riseProgress * 2.2;
      this.mesh.rotation.y += delta * 1.5;
      if (this.riseProgress >= 1.0) {
        this.mesh.position.y = 0;
        this.isRising = false;
        this.setChasing(true);
        if (audio) audio.playJumpscareStinger();
      }
      return { distToPlayer: 999, isChasing: false };
    }

    const aiStatus = this.ai.update(delta, player, collision, audio);

    // Procedural walk/sprint animation
    this.animTime += delta * (this.isChasing ? 14 : 5.5);
    const swing = Math.sin(this.animTime) * (this.isChasing ? 0.85 : 0.4);

    if (this.leftLeg && this.rightLeg) {
      this.leftLeg.rotation.x = swing;
      this.rightLeg.rotation.x = -swing;
    }

    if (this.leftArm && this.rightArm) {
      if (this.config.id === 'WIDOW') {
        // Floating weep gesture
        this.leftArm.rotation.x = -0.8 + Math.sin(this.animTime * 0.5) * 0.15;
        this.rightArm.rotation.x = -0.8 - Math.sin(this.animTime * 0.5) * 0.15;
      } else {
        this.leftArm.rotation.x = -swing;
        this.rightArm.rotation.x = swing + (this.isChasing ? 0.8 : 0.2);
      }
    }

    // Occasional twitch or weeping gesture
    if (this.headMesh) {
      if (Math.random() < 0.05) {
        this.headMesh.rotation.z = (Math.random() - 0.5) * 0.45;
      } else {
        this.headMesh.rotation.z *= 0.88;
      }
    }

    return aiStatus;
  }
}
