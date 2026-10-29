/**
 * DARKNESS: THE HAUNTED WORLD - Phase 2
 * Level 1: Abandoned Hospital (Expanded)
 * Features: Corridors, Reception, Room 101, Room 102 (ICU), Doctor's Office, Operating Room,
 * Generator Substation, Security Guard Booth, Interactive Hiding Lockers, Notes, Batteries, and Adrenaline Syringes.
 */

export class HospitalEnvironment {
  constructor(scene, collision, interaction, lighting) {
    this.scene = scene;
    this.collision = collision;
    this.interaction = interaction;
    this.lighting = lighting;

    // References to dynamic objects
    this.generatorKeyMesh = null;
    this.generatorDoorMesh = null;
    this.generatorSwitchMesh = null;
    this.exitGateMesh = null;
    this.isGeneratorDoorOpen = false;
    this.isPowerRestored = false;
    this.isExitOpen = false;

    // Checkpoint states
    this.checkpoints = {
      hasKey: false,
      hasPower: false
    };

    this.materials = this.createMaterials();
  }

  createMaterials() {
    return {
      wall: new THREE.MeshStandardMaterial({ color: 0x474c52, roughness: 0.9, metalness: 0.05 }),
      wallDark: new THREE.MeshStandardMaterial({ color: 0x2e3338, roughness: 0.95 }),
      floor: new THREE.MeshStandardMaterial({ color: 0x22262b, roughness: 0.7, metalness: 0.1 }),
      ceiling: new THREE.MeshStandardMaterial({ color: 0x1d2024, roughness: 0.95 }),
      doorWood: new THREE.MeshStandardMaterial({ color: 0x3d2b1f, roughness: 0.8 }),
      metalIron: new THREE.MeshStandardMaterial({ color: 0x55585c, metalness: 0.8, roughness: 0.4 }),
      metalRust: new THREE.MeshStandardMaterial({ color: 0x6e3b2e, roughness: 0.9 }),
      lockerMetal: new THREE.MeshStandardMaterial({ color: 0x334440, roughness: 0.6, metalness: 0.5 }),
      blood: new THREE.MeshBasicMaterial({ color: 0x8a0707 }),
      keyGlow: new THREE.MeshBasicMaterial({ color: 0xffd700 }),
      greenLight: new THREE.MeshBasicMaterial({ color: 0x00ff44 }),
      redLight: new THREE.MeshBasicMaterial({ color: 0xff1122 }),
      paper: new THREE.MeshStandardMaterial({ color: 0xede4c7, roughness: 0.9 }),
      adrenalineGreen: new THREE.MeshBasicMaterial({ color: 0x10b981 })
    };
  }

  build() {
    this.buildFloorsAndCeilings();
    this.buildWalls();
    this.buildProps();
    this.buildLockers();
    this.buildNotesAndPickups();
    this.setupLightingNodes();
  }

  buildFloorsAndCeilings() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(64, 64);
    floorGeo.rotateX(-Math.PI / 2);
    const floor = new THREE.Mesh(floorGeo, this.materials.floor);
    floor.position.set(0, 0, -10);
    this.scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(64, 64);
    ceilingGeo.rotateX(Math.PI / 2);
    const ceiling = new THREE.Mesh(ceilingGeo, this.materials.ceiling);
    ceiling.position.set(0, 3.8, -10);
    this.scene.add(ceiling);
  }

  addWall(x, z, width, depth, height = 3.8, mat = this.materials.wall) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, height / 2, z);
    this.scene.add(mesh);

    const halfW = width / 2;
    const halfD = depth / 2;
    this.collision.addBox(x - halfW, x + halfW, z - halfD, z + halfD, -1, height + 1);
    return mesh;
  }

  buildWalls() {
    // --- Reception Area (Z from 4 to 12, X from -8 to 8) ---
    this.addWall(0, 12, 16, 0.4); // South perimeter
    this.addWall(-8, 8, 0.4, 8);  // West reception wall
    this.addWall(8, 8, 0.4, 8);   // East reception wall
    this.addWall(-4.5, 4, 7, 0.4);
    this.addWall(4.5, 4, 7, 0.4);

    // --- Main Central Corridor (Z from 4 to -26, X from -2.4 to 2.4) ---
    this.addWall(-2.4, 1, 0.4, 6);
    this.addWall(-2.4, -13, 0.4, 10);
    this.addWall(-2.4, -22, 0.4, 4);

    this.addWall(2.4, 1, 0.4, 6);
    this.addWall(2.4, -13, 0.4, 10);
    this.addWall(2.4, -22, 0.4, 4);

    // North End Exit Wall with gate gap
    this.addWall(-4.5, -26, 5, 0.4);
    this.addWall(4.5, -26, 5, 0.4);

    // --- West Wing: Doctor's Office (Z: 0 to -6, X: -11.5 to -2.4) ---
    this.addWall(-11.5, -2, 0.4, 6);
    this.addWall(-7, 1, 9, 0.4);
    this.addWall(-7, -4, 9, 0.4);

    // Room 101 (Z: -8 to -16, X: -11.5 to -2.4)
    this.addWall(-11.5, -12, 0.4, 8);
    this.addWall(-7, -8, 9, 0.4);
    this.addWall(-7, -16, 9, 0.4);
    this.addWall(-3, -12, 1.2, 0.4);

    // Phase 2: Room 102 (ICU Ward) (Z: -16 to -24, X: -11.5 to -2.4)
    this.addWall(-11.5, -20, 0.4, 8);
    this.addWall(-7, -24, 9, 0.4);
    this.addWall(-3, -20, 1.2, 0.4);

    // --- East Wing: Operating Room (Z: 0 to -6, X: 2.4 to 11.5) ---
    this.addWall(11.5, -2, 0.4, 6);
    this.addWall(7, 1, 9, 0.4);
    this.addWall(7, -4, 9, 0.4);

    // Generator Room (Z: -8 to -16, X: 2.4 to 11.5)
    this.addWall(11.5, -12, 0.4, 8);
    this.addWall(7, -8, 9, 0.4);
    this.addWall(7, -16, 9, 0.4);

    // Phase 2: Security Guard Booth (Z: -16 to -24, X: 2.4 to 11.5)
    this.addWall(11.5, -20, 0.4, 8);
    this.addWall(7, -24, 9, 0.4);
    this.addWall(3, -20, 1.2, 0.4);
  }

  buildLockers() {
    // Locker 1: Central West Hallway near Doctor's office
    this.createHidingLocker(-2.0, -1.8, Math.PI / 2, 'locker_1');

    // Locker 2: Room 101 inner corner
    this.createHidingLocker(-10.8, -15.0, 0, 'locker_2');

    // Locker 3: East Hallway near Generator approach
    this.createHidingLocker(2.0, -1.8, -Math.PI / 2, 'locker_3');
  }

  createHidingLocker(x, z, facingAngle, id) {
    const group = new THREE.Group();

    // Locker cabinet
    const bodyGeo = new THREE.BoxGeometry(0.8, 2.4, 0.75);
    const body = new THREE.Mesh(bodyGeo, this.materials.lockerMetal);
    body.position.y = 1.2;
    group.add(body);

    // Front door ventilation slits (dark recesses)
    for (let i = 0; i < 4; i++) {
      const slitGeo = new THREE.BoxGeometry(0.5, 0.04, 0.02);
      const slitMat = new THREE.MeshBasicMaterial({ color: 0x111618 });
      const slit = new THREE.Mesh(slitGeo, slitMat);
      slit.position.set(0, 1.6 + i * 0.12, 0.38);
      group.add(slit);
    }

    group.position.set(x, 0, z);
    group.rotation.y = facingAngle;
    this.scene.add(group);

    this.collision.addBox(x - 0.45, x + 0.45, z - 0.45, z + 0.45, -1, 3);

    // Register interactive hiding spot
    this.interaction.register({
      id: id,
      mesh: group,
      distance: 2.4,
      label: 'Metal Hospital Locker',
      prompt: 'Hide in Locker [TAP]',
      onInteract: (game) => {
        if (!game.player.isHiding) {
          game.player.enterHiding({
            position: { x, z },
            facingAngle
          });
          game.hud.showNotification('You are hiding inside the locker. Breathe silently.');
        }
      }
    });
  }

  buildProps() {
    // Reception Desk
    this.createDesk(0, 7.5, 3.5, 1.2, 1.0);

    // Blood splatters
    this.createDecal(0.8, 0.01, 6.2, 1.8, 1.8, this.materials.blood);
    this.createDecal(-1.5, 0.01, -2, 1.2, 2.4, this.materials.blood);
    this.createDecal(0, 0.01, -15, 2.2, 3.5, this.materials.blood);

    // Room 101: Hospital Bed
    this.createHospitalBed(-8.5, -13);

    // Room 102 (ICU Ward): Overturned wheelchair & ICU gurney
    this.createHospitalBed(-8.5, -21);

    // Doctor's Office: Desk with Generator Key
    this.createDoctorDeskWithKey(-8.0, -1.5);

    // Operating Room: Surgical Table & Overhead Lamp
    this.createOperatingTable(7.5, -2.5);

    // Generator Room: Diesel Generator unit
    this.createGeneratorUnit(8.0, -13);

    // Security Guard Booth: Security Desk
    this.createSecurityBoothDesk(8.0, -21);

    // Exit Gate Blast Door
    this.createExitGate(0, -26);
  }

  createDesk(x, z, width, depth, height) {
    const geo = new THREE.BoxGeometry(width, height, depth);
    const desk = new THREE.Mesh(geo, this.materials.metalRust);
    desk.position.set(x, height / 2, z);
    this.scene.add(desk);
    this.collision.addBox(x - width / 2, x + width / 2, z - depth / 2, z + depth / 2, -1, height + 1);
  }

  createHospitalBed(x, z) {
    const group = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(1.4, 0.65, 2.5);
    const frameMat = new THREE.MeshStandardMaterial({ color: 0x3a4045, metalness: 0.6 });
    const frame = new THREE.Mesh(frameGeo, frameMat);
    frame.position.y = 0.4;
    group.add(frame);

    const matGeo = new THREE.BoxGeometry(1.3, 0.2, 2.4);
    const mat = new THREE.MeshStandardMaterial({ color: 0x8a857d, roughness: 0.9 });
    const mattress = new THREE.Mesh(matGeo, mat);
    mattress.position.y = 0.8;
    group.add(mattress);

    group.position.set(x, 0, z);
    this.scene.add(group);
    this.collision.addBox(x - 0.7, x + 0.7, z - 1.3, z + 1.3, -1, 2);
  }

  createDoctorDeskWithKey(x, z) {
    this.createDesk(x, z, 2.2, 1.2, 0.85);

    // Generator Key Mesh
    const keyGroup = new THREE.Group();
    const keyShaftGeo = new THREE.CylinderGeometry(0.025, 0.025, 0.28, 8);
    keyShaftGeo.rotateZ(Math.PI / 2);
    const keyShaft = new THREE.Mesh(keyShaftGeo, this.materials.keyGlow);
    keyGroup.add(keyShaft);

    const keyHeadGeo = new THREE.TorusGeometry(0.06, 0.02, 6, 12);
    const keyHead = new THREE.Mesh(keyHeadGeo, this.materials.keyGlow);
    keyHead.position.x = -0.15;
    keyGroup.add(keyHead);

    keyGroup.position.set(x, 0.92, z);
    this.scene.add(keyGroup);
    this.generatorKeyMesh = keyGroup;

    const keyLight = new THREE.PointLight(0xffcc00, 0.8, 3, 2);
    keyLight.position.set(x, 1.1, z);
    this.scene.add(keyLight);

    this.interaction.register({
      id: 'generator_key',
      mesh: keyGroup,
      distance: 2.5,
      label: 'Generator Key',
      prompt: 'Take Generator Key [TAP]',
      onInteract: (game) => {
        game.inventory.addItem('generator_key');
        keyGroup.visible = false;
        keyLight.visible = false;
        game.interaction.unregister('generator_key');
        if (game.audio) game.audio.playPickupSound();
        game.hud.showNotification('Obtained: Electrical Substation Key! (Checkpoint Saved)');
        this.checkpoints.hasKey = true;
        game.objectives.advanceTo(2);
      }
    });
  }

  createOperatingTable(x, z) {
    const opGroup = new THREE.Group();
    const baseGeo = new THREE.BoxGeometry(1.2, 0.9, 2.6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0x44484d, metalness: 0.7 });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 0.45;
    opGroup.add(base);

    const lampDomeGeo = new THREE.SphereGeometry(0.6, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2);
    lampDomeGeo.rotateX(Math.PI);
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x8899aa, metalness: 0.8 });
    const lamp = new THREE.Mesh(lampDomeGeo, lampMat);
    lamp.position.y = 3.2;
    opGroup.add(lamp);

    const opLight = new THREE.PointLight(0xaad5ff, 1.2, 8, 2);
    opLight.position.set(0, 2.9, 0);
    opGroup.add(opLight);

    opGroup.position.set(x, 0, z);
    this.scene.add(opGroup);
    this.collision.addBox(x - 0.7, x + 0.7, z - 1.4, z + 1.4, -1, 2);
  }

  createGeneratorUnit(x, z) {
    const genGroup = new THREE.Group();
    const boxGeo = new THREE.BoxGeometry(2.5, 1.8, 1.8);
    const boxMat = new THREE.MeshStandardMaterial({ color: 0x2d3a29, metalness: 0.5, roughness: 0.6 });
    const box = new THREE.Mesh(boxGeo, boxMat);
    box.position.y = 0.9;
    genGroup.add(box);

    const leverGeo = new THREE.BoxGeometry(0.12, 0.35, 0.12);
    const leverMat = new THREE.MeshStandardMaterial({ color: 0xee2222 });
    const lever = new THREE.Mesh(leverGeo, leverMat);
    lever.position.set(0, 1.2, 0.95);
    genGroup.add(lever);

    genGroup.position.set(x, 0, z);
    this.scene.add(genGroup);
    this.generatorSwitchMesh = genGroup;
    this.collision.addBox(x - 1.3, x + 1.3, z - 1.0, z + 1.0, -1, 2.5);

    // Generator Door
    const doorGeo = new THREE.BoxGeometry(0.2, 3.2, 2.2);
    this.generatorDoorMesh = new THREE.Mesh(doorGeo, this.materials.metalIron);
    this.generatorDoorMesh.position.set(3.0, 1.6, -11.0);
    this.scene.add(this.generatorDoorMesh);
    this.collision.addBox(2.8, 3.2, -12.1, -9.9, -1, 3.5, { id: 'door_generator' });

    this.interaction.register({
      id: 'generator_door',
      mesh: this.generatorDoorMesh,
      distance: 2.8,
      label: 'Substation Door',
      prompt: 'Locked Door [Requires Key]',
      onInteract: (game) => {
        if (this.isGeneratorDoorOpen) return;
        if (game.inventory.hasItem('generator_key')) {
          this.isGeneratorDoorOpen = true;
          this.collision.removeById('door_generator');
          this.generatorDoorMesh.position.y = -5;
          if (game.audio) game.audio.playDoorCreak();
          game.hud.showNotification('Substation Door Unlocked!');
          game.interaction.unregister('generator_door');
          game.objectives.advanceTo(3);
        } else {
          game.hud.showNotification('The heavy iron door is securely locked. Find the key in the Doctor\'s Office!');
        }
      }
    });

    this.interaction.register({
      id: 'generator_switch',
      mesh: genGroup,
      distance: 2.8,
      label: 'Main Generator Breaker',
      prompt: 'Activate Generator [TAP]',
      onInteract: (game) => {
        if (this.isPowerRestored) return;
        this.isPowerRestored = true;
        this.checkpoints.hasPower = true;
        if (game.audio) game.audio.playGeneratorStart();
        lever.rotation.x = 0.8;

        this.lighting.activateEmergencyMode();
        game.hud.showNotification('HIGH VOLTAGE RESTORED! (Checkpoint Saved)');
        game.hud.showScareFlash('WARNING: THE SURGEON IS SPRINTING TOWARDS YOU!');
        game.objectives.advanceTo(4);

        if (game.enemy) {
          game.enemy.mesh.position.set(0, 0, -18);
          game.enemy.ai.triggerAlert(game.player.position, game.audio);
        }

        this.enableExitGate(game);
      }
    });
  }

  createSecurityBoothDesk(x, z) {
    this.createDesk(x, z, 2.0, 1.2, 0.9);

    // Surveillance monitors
    const monGeo = new THREE.BoxGeometry(0.6, 0.45, 0.15);
    const monMat = new THREE.MeshBasicMaterial({ color: 0x051a24 });
    const mon = new THREE.Mesh(monGeo, monMat);
    mon.position.set(x, 1.15, z);
    this.scene.add(mon);

    // Adrenaline Syringe on the security desk!
    const syrGroup = new THREE.Group();
    const syrTubeGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.28, 8);
    const syrTube = new THREE.Mesh(syrTubeGeo, this.materials.adrenalineGreen);
    syrGroup.add(syrTube);

    syrGroup.position.set(x - 0.4, 0.95, z);
    this.scene.add(syrGroup);

    this.interaction.register({
      id: 'adrenaline_syringe',
      mesh: syrGroup,
      distance: 2.4,
      label: 'Adrenaline Auto-Injector',
      prompt: 'Take Adrenaline Syringe [TAP]',
      onInteract: (game) => {
        game.player.injectAdrenaline(12);
        syrGroup.visible = false;
        game.interaction.unregister('adrenaline_syringe');
        if (game.audio) game.audio.playPickupSound();
        game.hud.showNotification('Adrenaline Injected! (+30 HP, Speed & Stamina Maxed for 12s)');
      }
    });
  }

  buildNotesAndPickups() {
    // Battery 1 in Room 101 bedside table
    this.createTableWithBattery(-6.5, -14, 'battery_1');

    // Phase 2: Battery 2 in Room 102 bedside cabinet
    this.createTableWithBattery(-6.5, -22, 'battery_2');

    // Note 1: Reception Desk Lore
    this.createLoreNote(0.8, 7.8, 'note_1', 'Incident Report #104',
      'Incident Log (02:40 AM):\nDr. Vance refused to leave surgery when the containment seal broke. He claims he was ordered to "purge the infected minds". The south gate is sealed. The only way out is through the north blast door, but power is completely cut off.');

    // Note 2: Doctor Vance's Diary in Doctor's Office
    this.createLoreNote(-7.2, -1.8, 'note_2', 'Dr. Vance\'s Journal',
      'Chief Surgeon Vance Diary:\n"Their skulls hold only rot and fear. I have confiscated the yellow generator key and hidden it right here on my desk. If anyone tries to steal it, they will taste my bone saw. I will never let anyone leave St. Jude alive."');

    // Note 3: Security Officer's Warning Note in Security Booth
    this.createLoreNote(7.5, -20.5, 'note_3', 'Security Memo',
      'Officer Kane\'s Last Note:\n"He is using the darkness. He reacts immediately to the sound of sprinting footsteps. If you hear him, hide inside the lockers! Do not leave the locker until his footsteps fade away!"');
  }

  createTableWithBattery(x, z, id) {
    const standGeo = new THREE.BoxGeometry(0.7, 0.8, 0.7);
    const stand = new THREE.Mesh(standGeo, this.materials.metalIron);
    stand.position.set(x, 0.4, z);
    this.scene.add(stand);
    this.collision.addBox(x - 0.35, x + 0.35, z - 0.35, z + 0.35, -1, 1.5);

    const batGroup = new THREE.Group();
    const batGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 8);
    const batMat = new THREE.MeshStandardMaterial({ color: 0xf5b041, metalness: 0.6, roughness: 0.3 });
    const batMesh = new THREE.Mesh(batGeo, batMat);
    batGroup.add(batMesh);

    batGroup.position.set(x, 0.95, z);
    this.scene.add(batGroup);

    this.interaction.register({
      id: id,
      mesh: batGroup,
      distance: 2.5,
      label: 'Flashlight Battery',
      prompt: 'Take Battery [TAP]',
      onInteract: (game) => {
        game.player.addBattery(50);
        game.inventory.addBattery();
        batGroup.visible = false;
        game.interaction.unregister(id);
        if (game.audio) game.audio.playPickupSound();
        game.hud.showNotification('Flashlight Battery Recharged (+50%)');
      }
    });
  }

  createLoreNote(x, z, id, title, content) {
    const paperGeo = new THREE.BoxGeometry(0.35, 0.02, 0.45);
    const paper = new THREE.Mesh(paperGeo, this.materials.paper);
    paper.position.set(x, 0.88, z);
    this.scene.add(paper);

    this.interaction.register({
      id: id,
      mesh: paper,
      distance: 2.4,
      label: title,
      prompt: `Read ${title} [TAP]`,
      onInteract: (game) => {
        game.showNoteModal(title, content);
      }
    });
  }

  createExitGate(x, z) {
    const gateGroup = new THREE.Group();
    const frameGeo = new THREE.BoxGeometry(3.6, 3.4, 0.5);
    const frame = new THREE.Mesh(frameGeo, this.materials.metalIron);
    frame.position.y = 1.7;
    gateGroup.add(frame);

    this.exitLightMesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), this.materials.redLight);
    this.exitLightMesh.position.set(0, 3.2, 0.3);
    gateGroup.add(this.exitLightMesh);

    gateGroup.position.set(x, 0, z);
    this.scene.add(gateGroup);
    this.exitGateMesh = gateGroup;
    this.collision.addBox(x - 1.8, x + 1.8, z - 0.4, z + 0.4, -1, 3.5, { id: 'exit_gate' });

    this.interaction.register({
      id: 'exit_gate_interact',
      mesh: gateGroup,
      distance: 3.0,
      label: 'Main Security Exit',
      prompt: 'Exit Locked (Requires Generator Power)',
      onInteract: (game) => {
        if (!this.isPowerRestored) {
          game.hud.showNotification('The electronic blast lock is dead. Restore generator power first!');
        } else {
          game.onPlayerEscape();
        }
      }
    });
  }

  enableExitGate(game) {
    if (this.exitLightMesh) {
      this.exitLightMesh.material = this.materials.greenLight;
    }
  }

  createDecal(x, y, z, width, depth, material) {
    const geo = new THREE.PlaneGeometry(width, depth);
    geo.rotateX(-Math.PI / 2);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    this.scene.add(mesh);
  }

  setupLightingNodes() {
    this.lighting.addFlickeringCorridorLight(0, 3.6, 8, 0xd8e6f5, 1.3);
    this.lighting.addFlickeringCorridorLight(0, 3.6, 0, 0xd8e6f5, 1.2);
    this.lighting.addFlickeringCorridorLight(0, 3.6, -10, 0xd8e6f5, 1.3);
    this.lighting.addFlickeringCorridorLight(0, 3.6, -20, 0xd8e6f5, 1.3);

    // Warm room lights so objects, keys, and notes are immediately visible
    this.lighting.addFlickeringCorridorLight(-6.5, 3.4, -3, 0xffeacc, 1.2); // Doctor's Office
    this.lighting.addFlickeringCorridorLight(6.5, 3.4, -3, 0xccd5ff, 1.1);  // Room 101
    this.lighting.addFlickeringCorridorLight(-6.5, 3.4, -13, 0xccd5ff, 1.1); // Room 102 ICU
    this.lighting.addFlickeringCorridorLight(6.5, 3.4, -13, 0xffd599, 1.3); // Generator Substation

    this.lighting.addEmergencyBeacon(0, 3.6, -24);
    this.lighting.addEmergencyBeacon(0, 3.6, 6);
  }
}
