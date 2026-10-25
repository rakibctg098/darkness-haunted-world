/**
 * DARKNESS: THE HAUNTED WORLD
 * Finite State Machine for Enemy AI
 * States: IDLE, PATROL, INVESTIGATE, DETECT, CHASE, ATTACK, SEARCH
 */

export class EnemyAI {
  constructor(enemy, config) {
    this.enemy = enemy;
    this.config = config;

    this.state = 'PATROL';
    this.patrolWaypoints = [];
    this.currentWaypointIndex = 0;

    this.targetPos = new THREE.Vector3();
    this.lastKnownPlayerPos = new THREE.Vector3();
    this.searchTimer = 0;
    this.attackCooldownTimer = 0;
    this.stateTimer = 0;
    this.hasSpottedPlayer = false;
  }

  setWaypoints(points) {
    this.patrolWaypoints = points;
    if (points.length > 0) {
      this.targetPos.copy(points[0]);
    }
  }

  update(delta, player, collision, audio) {
    this.attackCooldownTimer = Math.max(0, this.attackCooldownTimer - delta);
    this.stateTimer -= delta;

    const enemyPos = this.enemy.mesh.position;
    const playerPos = player.position;

    // Distance to player
    const distToPlayer = enemyPos.distanceTo(playerPos);

    // 1. Line of Sight & Hearing Sense checks
    const hasSight = distToPlayer <= this.config.detectionRange &&
                     collision.hasLineOfSight(enemyPos, playerPos);

    // Hearing check (sprinting creates loud sound)
    const hearsPlayer = (player.isSprinting && distToPlayer <= this.config.hearingRangeSprint) ||
                        (player.isMoving && distToPlayer <= this.config.hearingRangeWalk);

    // 2. State Machine Transitions
    switch (this.state) {
      case 'IDLE':
        if (hasSight) {
          this.triggerAlert(playerPos, audio);
        } else if (hearsPlayer) {
          this.investigate(playerPos);
        } else if (this.stateTimer <= 0) {
          this.advancePatrol();
        }
        break;

      case 'PATROL':
        if (hasSight) {
          this.triggerAlert(playerPos, audio);
        } else if (hearsPlayer) {
          this.investigate(playerPos);
        } else {
          // Move towards current patrol waypoint
          const reached = this.moveTowards(this.targetPos, this.config.patrolSpeed, delta, collision);
          if (reached) {
            this.state = 'IDLE';
            this.stateTimer = 1.5 + Math.random() * 2.5; // Idle pause
          }
        }
        break;

      case 'INVESTIGATE':
        if (hasSight) {
          this.triggerAlert(playerPos, audio);
        } else {
          const reached = this.moveTowards(this.targetPos, this.config.investigateSpeed, delta, collision);
          if (reached || this.stateTimer <= 0) {
            this.startSearch(playerPos);
          }
        }
        break;

      case 'DETECT':
        // Brief freeze & screech before chase
        if (this.stateTimer <= 0) {
          this.state = 'CHASE';
          this.enemy.setChasing(true);
        }
        break;

      case 'CHASE':
        this.lastKnownPlayerPos.copy(playerPos);

        if (distToPlayer <= this.config.attackRange) {
          this.state = 'ATTACK';
        } else if (hasSight) {
          // Direct pursuit
          this.moveTowards(playerPos, this.config.chaseSpeed, delta, collision);
        } else {
          // Lost sight - run to last known position
          const reached = this.moveTowards(this.lastKnownPlayerPos, this.config.chaseSpeed, delta, collision);
          if (reached) {
            this.startSearch(this.lastKnownPlayerPos);
          }
        }
        break;

      case 'ATTACK':
        if (this.attackCooldownTimer <= 0) {
          player.takeDamage(this.config.attackDamage);
          this.attackCooldownTimer = this.config.attackCooldown;
        }
        if (distToPlayer > this.config.attackRange) {
          this.state = 'CHASE';
        }
        break;

      case 'SEARCH':
        this.searchTimer -= delta;
        // Turn around and scan
        this.enemy.mesh.rotation.y += delta * 1.5;
        if (hasSight) {
          this.triggerAlert(playerPos, audio);
        } else if (this.searchTimer <= 0) {
          this.enemy.setChasing(false);
          this.advancePatrol();
        }
        break;
    }

    return {
      state: this.state,
      distToPlayer,
      isChasing: this.state === 'CHASE' || this.state === 'ATTACK'
    };
  }

  triggerAlert(playerPos, audio) {
    if (this.state !== 'CHASE' && this.state !== 'DETECT') {
      this.state = 'DETECT';
      this.stateTimer = 0.6; // 600ms alert hesitation
      this.targetPos.copy(playerPos);
      this.enemy.setChasing(true);
      if (audio) audio.playJumpscareStinger();
    }
  }

  investigate(soundPos) {
    if (this.state !== 'CHASE' && this.state !== 'DETECT') {
      this.state = 'INVESTIGATE';
      this.targetPos.copy(soundPos);
      this.stateTimer = 8.0;
    }
  }

  startSearch(searchCenter) {
    this.state = 'SEARCH';
    this.searchTimer = 6.0;
    this.targetPos.copy(searchCenter);
  }

  advancePatrol() {
    this.state = 'PATROL';
    if (this.patrolWaypoints.length > 0) {
      this.currentWaypointIndex = (this.currentWaypointIndex + 1) % this.patrolWaypoints.length;
      this.targetPos.copy(this.patrolWaypoints[this.currentWaypointIndex]);
    }
  }

  moveTowards(dest, speed, delta, collision) {
    const enemyPos = this.enemy.mesh.position;
    const dx = dest.x - enemyPos.x;
    const dz = dest.z - enemyPos.z;
    const dist = Math.hypot(dx, dz);

    if (dist < 0.35) {
      return true; // Arrived
    }

    const normX = dx / dist;
    const normZ = dz / dist;

    // Face destination smoothly
    const targetAngle = Math.atan2(normX, normZ);
    this.enemy.mesh.rotation.y = targetAngle;

    // Collision-aware position step
    const desiredX = enemyPos.x + normX * speed * delta;
    const desiredZ = enemyPos.z + normZ * speed * delta;

    if (!collision.isColliding(desiredX, desiredZ, 0.45)) {
      enemyPos.x = desiredX;
      enemyPos.z = desiredZ;
    } else {
      // Try slide along X or Z
      if (!collision.isColliding(desiredX, enemyPos.z, 0.45)) {
        enemyPos.x = desiredX;
      } else if (!collision.isColliding(enemyPos.x, desiredZ, 0.45)) {
        enemyPos.z = desiredZ;
      }
    }

    return false;
  }
}
