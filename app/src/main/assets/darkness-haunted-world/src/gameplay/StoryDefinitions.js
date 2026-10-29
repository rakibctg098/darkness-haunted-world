/**
 * DARKNESS: THE HAUNTED WORLD - Phase 3
 * Data-Driven Story System & Horror Scenarios
 * Supports custom stories, cemetery corpse awakening, and weeping spirit encounters
 */

export const STORY_TEMPLATES = {
  THE_LAST_PATIENT: {
    id: "THE_LAST_PATIENT",
    title: "The Last Patient",
    tagline: "Trapped in the psychiatric ward with the deranged Chief Surgeon.",
    location: "HOSPITAL",
    primaryEnemy: "SURGEON",
    difficulty: "NORMAL",
    weather: "FOGGY_INDOOR",
    ambientAudio: "HOSPITAL_AMB",
    description: "You awaken locked inside St. Jude Psychiatric Ward. Dr. Vance has taken the master generator key and hunts you with rusty bone saws. Restore high voltage and escape through the blast gate.",
    objectives: [
      { id: "find_key", title: "Find Generator Key", desc: "Locate Dr. Vance's key inside the Doctor's Office." },
      { id: "unlock_door", title: "Unlock Substation", desc: "Unlock the iron substation door in the north corridor." },
      { id: "power_up", title: "Start Generator", desc: "Flip the high-voltage breaker to power the security exit." },
      { id: "escape", title: "ESCAPE THE HOSPITAL", desc: "The Surgeon is charging! Reach the blast door to survive!" }
    ]
  },

  THE_CURSED_GRAVEYARD: {
    id: "THE_CURSED_GRAVEYARD",
    title: "Rise of the Corpse",
    tagline: "The dead do not rest beneath the cursed earth.",
    location: "GRAVEYARD",
    primaryEnemy: "CORPSE",
    difficulty: "NIGHTMARE",
    weather: "MIDNIGHT_THUNDER",
    ambientAudio: "GRAVEYARD_WIND",
    description: "Deep in the forgotten cemetery, thunder cracks and soil erupts! An ancient awakened corpse crawls from an unholy grave, snarling and sprinting after you in the dark. Find the Crypt Relic and break the unholy seal!",
    objectives: [
      { id: "find_relic", title: "Find Crypt Seal", desc: "Search the mossy mausoleum for the silver crypt seal." },
      { id: "avoid_corpse", title: "Evade the Risen Corpse", desc: "The undead creature has broken through the mud! Run and stay out of reach!" },
      { id: "escape_gate", title: "Unlock Cemetery Gate", desc: "Use the seal on the rusted iron cemetery gates to escape the nightmare!" }
    ]
  },

  THE_WEEPING_WIDOW: {
    id: "THE_WEEPING_WIDOW",
    title: "The Weeping Shadow",
    tagline: "Follow the heartbreaking cries into the dark...",
    location: "HOSPITAL",
    primaryEnemy: "WIDOW",
    difficulty: "HARD",
    weather: "BLOOD_MOON",
    ambientAudio: "WEEPING_GHOST",
    description: "Heart-wrenching sobs echo through the abandoned medical wards. Eleanor Blackwood, the weeping widow, lurks in the mist. When her crying stops, she is standing right behind you.",
    objectives: [
      { id: "find_locket", title: "Find Eleanor's Locket", desc: "Locate the antique mourning locket left in Room 102." },
      { id: "power_exit", title: "Restore Gate Power", desc: "Activate emergency power to unlock the outer gate." },
      { id: "banish_run", title: "Escape the Weeping Spirit", desc: "Sprint to freedom before her icy grip stops your heart!" }
    ]
  },

  CREMATION_RITUAL: {
    id: "CREMATION_RITUAL",
    title: "The Cremation Secret",
    tagline: "Smoke, ashes, and shadowy silhouettes that devour light.",
    location: "HOSPITAL",
    primaryEnemy: "SHADOW",
    difficulty: "NORMAL",
    weather: "SMOKY_DARK",
    ambientAudio: "ASH_DRONE",
    description: "An umbral shadow creeps through darkened halls. It hates flashlight beams but strikes with lethal fury the second your battery drains.",
    objectives: [
      { id: "gather_fuel", title: "Find Generator Fuel", desc: "Collect the diesel can from the storage cabinet." },
      { id: "keep_light", title: "Preserve Flashlight", desc: "Keep batteries charged to repel the creeping shadow entity." },
      { id: "escape_facility", title: "Escape the Facility", desc: "Breach the final containment exit." }
    ]
  }
};
