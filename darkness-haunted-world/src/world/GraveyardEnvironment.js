/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Level 2: Cursed Graveyard 3D Procedural Environment
 * Features: Open Graves, Mossy Gravestones, Stone Mausoleums, Iron Gates,
 * Mud Mounds, Lightning Flashes, and the Corpse Awakening Grave!
 */

export class GraveyardEnvironment {
  constructor(scene, collision, interaction, lighting) {
    this.scene = scene;
    this.collision = collision;
    this.interaction = interaction;
    this.lighting = lighting;

    this.cryptKeyMesh = null;
    this.cemeteryGateMesh = null;
    this.awakeningGraveMesh = null;
    this.isGateUnlocked = false;
    this.hasCorpseRisen = false;

    this.materials = this.createMaterials();
  }

  createMaterials() {
    return {
      mudFloor: new THREE.MeshStandardMaterial({ color: 0x181a17, roughness: 0.95 }),
      tombstone: new THREE.MeshStandardMaterial({ color: 0x484c4f, roughness: 0.9, metalness: 0.1 }),
      crossMoss: new THREE.MeshStandardMaterial({ color: 0x3d433b, roughness: 0.85 }),
      mausoleumStone: new THREE.MeshStandardMaterial({ color: 0x2e3236, roughness: 0.95 }),
      ironFence: new THREE.MeshStandardMaterial({ color: 0x1f2226, metalness: 0.85, roughness: 0.4 }),
      openMud: new THREE.MeshStandardMaterial({ color: 0x221a14, roughness: 1.0 }),
      relicSilver: new THREE.MeshStandardMaterial({ color: 0xdde5ed, metalness: 0.95, roughness: 0.2 }),
      graveGlow: new THREE.MeshBasicMaterial({ color: 0xff5500 }),
      fogColor: 0x090d12
    };
  }

  build() {
    this.setupAtmosphere();
    this.buildTerrainAndPerimeter();
    this.buildGravesAndTombstones();
    this.buildMausoleum();
    this.buildAwakeningGrave();
    this.buildExitGate();
  }

  setupAtmosphere() {
    this.scene.fog = new THREE.FogExp2(this.materials.fogColor, 0.052);
    const moon = new THREE.DirectionalLight(0x1a2b40, 0.5);
    moon.position.set(-15, 30, 10);
    this.scene.add(moon);
  }

  buildTerrainAndPerimeter() {
    // Wet Muddy Cemetery Ground
    const groundGeo = new THREE.PlaneGeometry(70, 70);
    groundGeo.rotateX(-Math.PI / 2);
    const ground = new THREE.Mesh(groundGeo, this.materials.mudFloor);
    ground.position.set(0, 0, -10);
    this.scene.add(ground);

    // Wrought Iron Cemetery Perimeter Fence
    this.addFenceLine(-22, -22, 22, -22); // North
    this.addFenceLine(-22, 14, 22, 14);   // South
    this.addFenceLine(-22, -22, -22, 14); // West
    this.addFenceLine(22, -22, 22, 14);   // East
  }

  addFenceLine(x1, z1, x2, z2) {
    const dx = x2 - x1;
    const dz = z2 - z1;
    const len = Math.hypot(dx, dz);
    const angle = Math.atan2(dx, dz);

    const fenceGeo = new THREE.BoxGeometry(0.15, 2.4, len);
    const fence = new THREE.Mesh(fenceGeo, this.materials.ironFence);
    fence.position.set((x1 + x2) / 2, 1.2, (z1 + z2) / 2);
    fence.rotation.y = angle;
    this.scene.add(fence);

    const halfW = Math.abs(dx) / 2 + 0.3;
    const halfD = Math.abs(dz) / 2 + 0.3;
    this.collision.addBox(
      (x1 + x2) / 2 - halfW, (x1 + x2) / 2 + halfW,
      (z1 + z2) / 2 - halfD, (z1 + z2) / 2 + halfD,
      -1, 3
    );
  }

  buildGravesAndTombstones() {
    // Rows of ancient tombstones with collision
    const gravePositions = [
      { x: -14, z: 6 }, { x: -10, z: 6 }, { x: -6, z: 6 }, { x: 6, z: 6 }, { x: 10, z: 6 }, { x: 14, z: 6 },
      { x: -14, z: 0 }, { x: -10, z: 0 }, { x: -6, z: 0 }, { x: 6, z: 0 }, { x: 10, z: 0 }, { x: 14, z: 0 },
      { x: -14, z: -6 }, { x: -10, z: -6 }, { x: -6, z: -6 }, { x: 6, z: -6 }, { x: 10, z: -6 }, { x: 14, z: -6 },
      { x: -14, z: -12 }, { x: -10, z: -12 }, { x: -6, z: -12 }, { x: 6, z: -12 }, { x: 10, z: -12 }, { x: 14, z: -12 }
    ];

    gravePositions.forEach((pos, i) => {
      this.createTombstone(pos.x, pos.z, i % 2 === 0);
    });
  }

  createTombstone(x, z, isCross = false) {
    const group = new THREE.Group();

    if (isCross) {
      // Celtic Cross
      const vGeo = new THREE.BoxGeometry(0.24, 1.6, 0.18);
      const hGeo = new THREE.BoxGeometry(0.9, 0.22, 0.18);
      const v = new THREE.Mesh(vGeo, this.materials.crossMoss);
      const h = new THREE.Mesh(hGeo, this.materials.crossMoss);
      v.position.y = 0.8;
      h.position.y = 1.1;
      group.add(v, h);
    } else {
      // Arched Headstone
      const stoneGeo = new THREE.BoxGeometry(0.75, 1.25, 0.22);
      const stone = new THREE.Mesh(stoneGeo, this.materials.tombstone);
      stone.position.y = 0.62;
      group.add(stone);
    }

    // Dirt mound at base
    const moundGeo = new THREE.BoxGeometry(0.9, 0.12, 1.8);
    const mound = new THREE.Mesh(moundGeo, this.materials.openMud);
    mound.position.set(0, 0.06, 0.7);
    group.add(mound);

    // Random tilt
    group.rotation.y = (Math.random() - 0.5) * 0.4;
    group.rotation.z = (Math.random() - 0.5) * 0.12;

    group.position.set(x, 0, z);
    this.scene.add(group);
    this.collision.addBox(x - 0.55, x + 0.55, z - 0.55, z + 1.6, -1, 2);
  }

  buildMausoleum() {
    // Stone Mausoleum holding the Crypt Seal at the far West (X: -16, Z: -18)
    const mGroup = new THREE.Group();

    const wallsGeo = new THREE.BoxGeometry(4.5, 3.8, 5.0);
    const walls = new THREE.Mesh(wallsGeo, this.materials.mausoleumStone);
    walls.position.y = 1.9;
    mGroup.add(walls);

    // Sloped roof
    const roofGeo = new THREE.ConeGeometry(3.6, 1.4, 4);
    roofGeo.rotateY(Math.PI / 4);
    const roof = new THREE.Mesh(roofGeo, this.materials.mausoleumStone);
    roof.position.y = 4.4;
    mGroup.add(roof);

    mGroup.position.set(-15, 0, -17);
    this.scene.add(mGroup);
    this.collision.addBox(-17.5, -12.5, -19.8, -14.2, -1, 4.5);

    // Silver Crypt Relic on the Mausoleum Altar
    const relicGroup = new THREE.Group();
    const relicGeo = new THREE.TorusGeometry(0.18, 0.05, 8, 16);
    const relic = new THREE.Mesh(relicGeo, this.materials.relicSilver);
    relicGroup.add(relic);

    const relicGlow = new THREE.PointLight(0xaaccff, 0.9, 3.5, 2);
    relicGlow.position.y = 0.2;
    relicGroup.add(relicGlow);

    relicGroup.position.set(-15, 1.2, -14.2);
    this.scene.add(relicGroup);
    this.cryptKeyMesh = relicGroup;

    this.interaction.register({
      id: 'crypt_seal_relic',
      mesh: relicGroup,
      distance: 2.6,
      label: 'Silver Crypt Seal',
      prompt: 'Take Silver Crypt Seal [TAP]',
      onInteract: (game) => {
        game.inventory.addItem('crypt_seal');
        relicGroup.visible = false;
        game.interaction.unregister('crypt_seal_relic');
        if (game.audio) game.audio.playPickupSound();
        game.hud.showNotification('Obtained: Silver Crypt Seal! Run to the Cemetery Gate!');
        game.objectives.advanceTo(3);
      }
    });
  }

  buildAwakeningGrave() {
    // The Cursed Open Grave in Central Clearing (X: 0, Z: -8)
    const graveGroup = new THREE.Group();

    // Dark pit
    const pitGeo = new THREE.BoxGeometry(1.6, 0.4, 2.8);
    const pit = new THREE.Mesh(pitGeo, new THREE.MeshBasicMaterial({ color: 0x050505 }));
    pit.position.y = -0.2;
    graveGroup.add(pit);

    // Erupted mud mounds around the grave
    const mudMoundGeo = new THREE.TorusGeometry(1.4, 0.35, 6, 12);
    mudMoundGeo.rotateX(Math.PI / 2);
    const mudMound = new THREE.Mesh(mudMoundGeo, this.materials.openMud);
    mudMound.position.y = 0.15;
    graveGroup.add(mudMound);

    // Broken wooden coffin boards
    const boardGeo = new THREE.BoxGeometry(0.25, 0.05, 1.2);
    const boardMat = new THREE.MeshStandardMaterial({ color: 0x2e1b10 });
    const board1 = new THREE.Mesh(boardGeo, boardMat);
    board1.position.set(-0.4, 0.2, 0.3);
    board1.rotation.y = 0.4;
    board1.rotation.z = 0.2;
    graveGroup.add(board1);

    // Blood red unholy glow inside the open pit
    this.pitLight = new THREE.PointLight(0xff3300, 1.2, 5, 2);
    this.pitLight.position.set(0, 0.4, 0);
    graveGroup.add(this.pitLight);

    graveGroup.position.set(0, 0, -8);
    this.scene.add(graveGroup);
    this.awakeningGraveMesh = graveGroup;

    // Trigger proximity: When player approaches within 6 meters, corpse erupts!
    this.interaction.register({
      id: 'grave_awakening_site',
      mesh: graveGroup,
      distance: 7.0,
      label: 'Disturbed Grave',
      prompt: 'Inspect Fresh Grave [TAP]',
      onInteract: (game) => {
        this.triggerCorpseAwakening(game);
      }
    });
  }

  triggerCorpseAwakening(game) {
    if (this.hasCorpseRisen) return;
    this.hasCorpseRisen = true;
    this.interaction.unregister('grave_awakening_site');

    if (game.audio) {
      game.audio.playThunderCrack();
      game.audio.playCorpseRising();
    }

    game.hud.showScareFlash('THE GRAVE HAS SHATTERED! RUN FOR YOUR LIFE!');
    game.hud.showNotification('THE CORPSE HAS RISEN FROM THE GRAVE!');

    // Animate enemy rising out of grave!
    if (game.enemy) {
      game.enemy.triggerGraveRise(0, -8, game.audio);
    }
    game.objectives.advanceTo(2);
  }

  buildExitGate() {
    // Heavy cemetery gate at North boundary (X: 0, Z: -22)
    const gateGroup = new THREE.Group();

    // Two stone gate pillars
    [-2.2, 2.2].forEach(px => {
      const pillarGeo = new THREE.BoxGeometry(0.8, 3.2, 0.8);
      const pillar = new THREE.Mesh(pillarGeo, this.materials.mausoleumStone);
      pillar.position.set(px, 1.6, 0);
      gateGroup.add(pillar);
    });

    // Iron gate grill
    const grillGeo = new THREE.BoxGeometry(3.6, 2.8, 0.12);
    const grill = new THREE.Mesh(grillGeo, this.materials.ironFence);
    grill.position.set(0, 1.4, 0);
    gateGroup.add(grill);

    gateGroup.position.set(0, 0, -22);
    this.scene.add(gateGroup);
    this.cemeteryGateMesh = gateGroup;

    this.collision.addBox(-2.6, 2.6, -22.5, -21.5, -1, 3.5, { id: 'cemetery_gate' });

    this.interaction.register({
      id: 'cemetery_gate_interact',
      mesh: gateGroup,
      distance: 3.2,
      label: 'Cemetery Iron Gate',
      prompt: 'Iron Gate [Locked with Seal]',
      onInteract: (game) => {
        if (!game.inventory.hasItem('crypt_seal')) {
          game.hud.showNotification('The heavy rusted gate is sealed by dark magic. Find the Silver Crypt Seal in the Mausoleum!');
        } else {
          // Escaped cemetery!
          game.onPlayerEscape();
        }
      }
    });
  }
}
