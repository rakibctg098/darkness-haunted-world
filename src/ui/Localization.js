/**
 * DARKNESS: THE HAUNTED WORLD
 * Bilingual Localization Engine (বাংলা & English)
 * Developer: Made by Mohammad Rakib (https://t.me/appdevbyrakib)
 */

export const STRINGS = {
  bn: {
    // Game Title & Metadata
    GAME_TITLE: "ডার্কনেস",
    GAME_SUBTITLE: "দ্য হন্টেড ওয়ার্ল্ড (ভুতুড়ে দুনিয়া)",
    DEV_CREDIT: "Made by Mohammad Rakib",
    DEV_CHANNEL: "Telegram channel: https://t.me/appdevbyrakib",

    // Main Menu
    BTN_START: "খেলা শুরু করুন",
    BTN_STORY_CREATOR: "ভয়ংকর গল্প মেকার",
    BTN_CHAR_CUSTOMIZER: "চরিত্র ও লাইটিং মোড",
    BTN_SETTINGS: "সেটিংস",
    BTN_ABOUT: "গেম পরিচিতি",
    BTN_CREDITS: "ক্রেডিট",
    LANG_TOGGLE_BTN: "🌐 বাংলা / EN",
    BRIGHTNESS_BTN_NORMAL: "💡 হালকা ডার্ক (স্বাভাবিক)",
    BRIGHTNESS_BTN_BRIGHT: "💡 উজ্জ্বল দৃষ্টি",
    BRIGHTNESS_BTN_DARK: "💡 গাঢ় হরর",

    // HUD Stats & Buttons
    HUD_HP: "জীবন",
    HUD_STA: "শক্তি",
    HUD_BAT: "ব্যাটারি",
    HUD_BTN_FLASHLIGHT: "টর্চ",
    HUD_BTN_SPRINT: "দৌড়",
    HUD_BTN_CROUCH: "নিচু",
    HUD_BTN_INTERACT: "ধরুন",
    HUD_BTN_PAUSE: "বিরতি",
    HUD_LOCKER_EXIT: "লকার থেকে বের হন [TAP]",
    HUD_INTERACT_DEFAULT: "স্পর্শ করুন [TAP]",
    HUD_PICKUP_BATTERY: "🔋 ব্যাটারি চার্জ হয়েছে (+45%)",
    HUD_PICKUP_ADRENALINE: "💉 অ্যাড্রেনালিন ইনজেকশন কার্যকর! গতি বৃদ্ধি পেয়েছে!",
    HUD_CORPSE_AWAKEN: "⚠️ সাবধান! কবর থেকে লাশ জেগে উঠে ধাওয়া করছে!",

    // Objectives - Level 1 (Hospital)
    OBJ_HOSPITAL_1_TITLE: "জরুরি বিদ্যুৎ পুনরুদ্ধার",
    OBJ_HOSPITAL_1_DESC: "ডাক্তারের চেম্বার থেকে জেনারেটরের চাবিটি খুঁজে বের করুন।",
    OBJ_HOSPITAL_2_TITLE: "জেনারেটর চালু করুন",
    OBJ_HOSPITAL_2_DESC: "সাবস্টেশন রুমে গিয়ে প্রধান বিদ্যুৎ সুইচ অন করুন।",
    OBJ_HOSPITAL_3_TITLE: "হাসপাতাল থেকে পালান",
    OBJ_HOSPITAL_3_DESC: "জরুরি নিরাপত্তা গেট খুলে বাইরে বেরিয়ে যান। সার্জন থেকে সাবধান!",

    // Objectives - Level 2 (Cursed Graveyard)
    OBJ_GRAVE_1_TITLE: "অভিশপ্ত কবরস্থান",
    OBJ_GRAVE_1_DESC: "পুরোনো পাথুরে সমাধি (মউসোলিয়াম) থেকে সিলভার চাবিটি খুঁজে নিন।",
    OBJ_GRAVE_2_TITLE: "লাশ জেগে উঠেছে!",
    OBJ_GRAVE_2_DESC: "কবরের জীবন্ত লাশ ধাওয়া করছে! দ্রুত লোহার গেটে দৌড়ান!",
    OBJ_GRAVE_3_TITLE: "প্রধান লোহার গেট খুলুন",
    OBJ_GRAVE_3_DESC: "কবরস্থানের সীমানা পার হয়ে চিরতরে মুক্ত হন।",

    // Interactions
    PROMPT_TAKE_KEY: "চাবি নিন [TAP]",
    PROMPT_UNLOCK_DOOR: "দরজা খুলুন [TAP]",
    PROMPT_RESTORE_POWER: "পাওয়ার সুইচ অন করুন [TAP]",
    PROMPT_ESCAPE_GATE: "গেট খুলে পালান [TAP]",
    PROMPT_ENTER_LOCKER: "লকারে লুকান [TAP]",
    PROMPT_READ_NOTE: "চিঠি পড়ুন [TAP]",
    PROMPT_TAKE_BATTERY: "ব্যাটারি নিন [TAP]",
    PROMPT_TAKE_SYRINGE: "ইনজেকশন নিন [TAP]",
    PROMPT_EXAMINE_GRAVE: "খোলা কবর পরীক্ষা করুন [TAP]",
    PROMPT_TAKE_SILVER_KEY: "সিলভার চাবি নিন [TAP]",
    PROMPT_UNLOCK_CEMETERY: "কবরস্থানের গেট খুলুন [TAP]",

    // Settings
    SETTINGS_TITLE: "গেম সেটিংস",
    SETTINGS_LANG: "ভাষা / Language",
    SETTINGS_BRIGHTNESS: "দৃশ্যমানতা / লাইটিং মোড",
    BRIGHT_NORMAL: "হালকা ডার্ক (স্বাভাবিক ও স্পষ্ট - রেকমেন্ডেড)",
    BRIGHT_HIGH: "উজ্জ্বল দৃষ্টি (সবকিছু পরিষ্কার দেখা যাবে)",
    BRIGHT_DARK: "গাঢ় হরর অন্ধকার (খুব বেশি ডার্ক)",
    SETTINGS_GRAPHICS: "গ্রাফিক্স কোয়ালিটি",
    GRAPHICS_LOW: "কম (স্মুথ ৬০ FPS)",
    GRAPHICS_MED: "মাঝারি (রেকমেন্ডেড)",
    GRAPHICS_HIGH: "উচ্চ (হাই রেজুলেশন)",
    SETTINGS_MASTER_VOL: "মূল শব্দ ভলিউম",
    SETTINGS_SFX_VOL: "হরর ইফেক্ট সাউন্ড",
    SETTINGS_SENSITIVITY: "টাচ ঘোরানোর গতি",
    SETTINGS_VIBRATION: "কম্পন (Vibration)",
    SETTINGS_REDUCED_FLASH: "কম ফ্ল্যাশ মোড (চোখের সুরক্ষায়)",
    BTN_RESET: "রিসেট",
    BTN_CLOSE: "বন্ধ করুন",
    BTN_BACK: "ফিরে যান",

    // Pause Screen
    PAUSE_TITLE: "খেলা স্থগিত",
    BTN_RESUME: "চালিয়ে যান",
    BTN_RESTART: "পুনরায় শুরু",
    BTN_MAIN_MENU: "প্রধান মেনু",

    // Death Screen
    DEATH_TITLE: "আপনার মৃত্যু হয়েছে!",
    DEATH_SUBTITLE: "অন্ধকারের আত্মা আপনাকে ধরে ফেলেছে...",
    DEATH_CHECKPOINT: "চেকপয়েন্ট থেকে শুরু",

    // Victory Screen
    VICTORY_TITLE: "আপনি বেঁচে ফিরেছেন!",
    VICTORY_SUBTITLE: "অভিশপ্ত স্থান থেকে সফলভাবে পালিয়েছেন!",
    BTN_CONTINUE: "পরবর্তী লেভেল",

    // Story Creator
    STORY_CREATOR_TITLE: "হরর গল্প ও সিনারিও মেকার",
    STORY_SELECT_SUBTITLE: "একটি ভৌতিক গল্প বেছে নিন অথবা কাস্টমাইজ করুন:",
    STORY_TITLE_LABEL: "গল্পের শিরোনাম",
    STORY_LOC_LABEL: "ঘটনাস্থল",
    LOC_HOSPITAL: "পরিত্যক্ত হাসপাতাল (St. Jude)",
    LOC_GRAVEYARD: "অভিশপ্ত কবরস্থান (Cursed Graveyard)",
    STORY_ENEMY_LABEL: "ভুতুড়ে শত্রু",
    ENEMY_CORPSE: "কবর থেকে ওঠা জীবন্ত লাশ (Corpse)",
    ENEMY_SURGEON: "পাগল সার্জন (The Surgeon)",
    ENEMY_WIDOW: "কান্নারত সাদা শাড়ি পরা বিধবা ভূত (Weeping Widow)",
    ENEMY_SHADOW: "ছায়া দানব (Shadow Silhouette)",
    STORY_DIFF_LABEL: "কঠিনতা",
    DIFF_EASY: "সহজ (শত্রু আস্তে হাঁটে)",
    DIFF_NORMAL: "স্বাভাবিক হরর",
    DIFF_NIGHTMARE: "ভয়াবহ দুঃস্বপ্ন (দানব প্রচণ্ড দৌড়াবে)",
    STORY_WEEPING_LABEL: "ভুতুড়ে কান্নার আওয়াজ (Weeping Audio)",
    BTN_START_STORY: "গল্প শুরু করুন",

    // Character Customizer
    CHAR_CUSTOMIZER_TITLE: "চরিত্র ও লাইটিং মোড",
    CHAR_OUTFIT: "পোশাক",
    CHAR_FLASHLIGHT: "টর্চের আলোর রঙ",
    LIGHT_WARM: "হালকা হলুদ আলো (স্বাভাবিক)",
    LIGHT_WHITE: "উজ্জ্বল সাদা এলইডি",
    LIGHT_GREEN: "নাইটভিশন সবুজ",
    LIGHT_RED: "লাল ইনফ্রারেড",
    CHAR_EQUIP: "শুরুতে অতিরিক্ত সরঞ্জাম",
    EQUIP_NORMAL: "সাধারণ (শুধু টর্চ)",
    EQUIP_BATTERY: "প্রস্তুত (+১ অতিরিক্ত ব্যাটারি)",
    EQUIP_ADRENALINE: "সার্ভাইভার (+১ অ্যাড্রেনালিন ইনজেকশন)",
    CHAR_AGGR: "দানবের আক্রমণাত্মক ভাব",
    AGGR_NORMAL: "স্বাভাবিক ও সতর্ক",
    AGGR_RELENTLESS: "নাছোড়বান্দা ধাওয়া",
    AGGR_BERSERK: "মরণঘাতী পাগলামি",
    BTN_APPLY_MODS: "মোড সক্রিয় করুন",

    // About & Description
    ABOUT_TITLE: "ডার্কনেস পরিচিতি",
    ABOUT_TEXT: "ডার্কনেস: দ্য হন্টেড ওয়ার্ল্ড একটি বাস্তবসম্মত ৩ডি ফার্স্ট-পার্সন হরর সার্ভাইভাল গেম। পরিত্যক্ত হাসপাতাল এবং অভিশপ্ত কবরস্থানে রহস্যময় দানব ও কবর থেকে ওঠা লাশের হাত থেকে রক্ষা পেয়ে পালিয়ে যান। আলো ও স্বাভাবিক ডার্কনেস আপনার সুবিধার মতো পরিবর্তন করে নিতে পারেন।",
    ABOUT_CONTROLS: "কন্ট্রোল: স্ক্রিনের বাম পাশে আঙুল দিয়ে হাঁটুন (ভার্চুয়াল জয়স্টিক), ডান পাশে ড্র্যাগ করে চারিদিকে তাকান। টর্চ, দৌড়, নিচু হওয়া এবং যেকোনো জিনিস নেওয়ার বাটন স্ক্রিনের ডানে দেওয়া আছে।"
  },

  en: {
    // Game Title & Metadata
    GAME_TITLE: "DARKNESS",
    GAME_SUBTITLE: "THE HAUNTED WORLD",
    DEV_CREDIT: "Made by Mohammad Rakib",
    DEV_CHANNEL: "Telegram channel: https://t.me/appdevbyrakib",

    // Main Menu
    BTN_START: "START SURVIVAL",
    BTN_STORY_CREATOR: "STORY CREATOR",
    BTN_CHAR_CUSTOMIZER: "CHARACTER & MODS",
    BTN_SETTINGS: "SETTINGS",
    BTN_ABOUT: "ABOUT",
    BTN_CREDITS: "CREDITS",
    LANG_TOGGLE_BTN: "🌐 EN / বাংলা",
    BRIGHTNESS_BTN_NORMAL: "💡 Normal Light (Atmospheric)",
    BRIGHTNESS_BTN_BRIGHT: "💡 Bright Vision",
    BRIGHTNESS_BTN_DARK: "💡 Hardcore Darkness",

    // HUD Stats & Buttons
    HUD_HP: "HP",
    HUD_STA: "STA",
    HUD_BAT: "BAT",
    HUD_BTN_FLASHLIGHT: "LGT",
    HUD_BTN_SPRINT: "RUN",
    HUD_BTN_CROUCH: "CRH",
    HUD_BTN_INTERACT: "ACT",
    HUD_BTN_PAUSE: "||",
    HUD_LOCKER_EXIT: "Exit Locker [TAP]",
    HUD_INTERACT_DEFAULT: "Interact [TAP]",
    HUD_PICKUP_BATTERY: "🔋 Battery Recharged (+45%)",
    HUD_PICKUP_ADRENALINE: "💉 Adrenaline Active! Speed Boosted!",
    HUD_CORPSE_AWAKEN: "⚠️ BEWARE! The Corpse has risen from the grave!",

    // Objectives - Level 1 (Hospital)
    OBJ_HOSPITAL_1_TITLE: "RESTORE EMERGENCY POWER",
    OBJ_HOSPITAL_1_DESC: "Find the Generator Key inside Doctor's Office.",
    OBJ_HOSPITAL_2_TITLE: "START GENERATOR",
    OBJ_HOSPITAL_2_DESC: "Go to Substation and switch on the generator power.",
    OBJ_HOSPITAL_3_TITLE: "ESCAPE HOSPITAL",
    OBJ_HOSPITAL_3_DESC: "Unlock security blast gate and escape before The Surgeon finds you.",

    // Objectives - Level 2 (Cursed Graveyard)
    OBJ_GRAVE_1_TITLE: "CURSED GRAVEYARD",
    OBJ_GRAVE_1_DESC: "Find the Silver Relic Key inside the stone Mausoleum.",
    OBJ_GRAVE_2_TITLE: "THE CORPSE HAS RISEN!",
    OBJ_GRAVE_2_DESC: "The awakened corpse is sprinting! Run to the iron gate!",
    OBJ_GRAVE_3_TITLE: "UNLOCK CEMETERY GATE",
    OBJ_GRAVE_3_DESC: "Cross the iron gate and escape to survive.",

    // Interactions
    PROMPT_TAKE_KEY: "Take Key [TAP]",
    PROMPT_UNLOCK_DOOR: "Unlock Door [TAP]",
    PROMPT_RESTORE_POWER: "Flip Power Switch [TAP]",
    PROMPT_ESCAPE_GATE: "Open Exit Gate [TAP]",
    PROMPT_ENTER_LOCKER: "Hide in Locker [TAP]",
    PROMPT_READ_NOTE: "Read Note [TAP]",
    PROMPT_TAKE_BATTERY: "Take Battery [TAP]",
    PROMPT_TAKE_SYRINGE: "Take Adrenaline [TAP]",
    PROMPT_EXAMINE_GRAVE: "Examine Open Grave [TAP]",
    PROMPT_TAKE_SILVER_KEY: "Take Silver Key [TAP]",
    PROMPT_UNLOCK_CEMETERY: "Unlock Iron Gate [TAP]",

    // Settings
    SETTINGS_TITLE: "SETTINGS",
    SETTINGS_LANG: "Language",
    SETTINGS_BRIGHTNESS: "Brightness & Lighting Mode",
    BRIGHT_NORMAL: "Light Dark (Normal Clear - Recommended)",
    BRIGHT_HIGH: "Bright Vision (High Visibility)",
    BRIGHT_DARK: "Hardcore Darkness (Original Pitch Black)",
    SETTINGS_GRAPHICS: "Graphics Quality",
    GRAPHICS_LOW: "Low (Smooth 60 FPS)",
    GRAPHICS_MED: "Medium (Recommended)",
    GRAPHICS_HIGH: "High (Full Resolution)",
    SETTINGS_MASTER_VOL: "Master Volume",
    SETTINGS_SFX_VOL: "Sound Effects (SFX)",
    SETTINGS_SENSITIVITY: "Touch Look Sensitivity",
    SETTINGS_VIBRATION: "Vibration Feedback",
    SETTINGS_REDUCED_FLASH: "Reduced Flashing Mode",
    BTN_RESET: "Reset",
    BTN_CLOSE: "Close",
    BTN_BACK: "Back",

    // Pause Screen
    PAUSE_TITLE: "GAME PAUSED",
    BTN_RESUME: "RESUME",
    BTN_RESTART: "RESTART LEVEL",
    BTN_MAIN_MENU: "MAIN MENU",

    // Death Screen
    DEATH_TITLE: "YOU DIED",
    DEATH_SUBTITLE: "The Darkness claimed another soul...",
    DEATH_CHECKPOINT: "RESUME AT CHECKPOINT",

    // Victory Screen
    VICTORY_TITLE: "YOU ESCAPED",
    VICTORY_SUBTITLE: "Successfully escaped the cursed grounds!",
    BTN_CONTINUE: "NEXT LEVEL",

    // Story Creator
    STORY_CREATOR_TITLE: "STORY CREATOR",
    STORY_SELECT_SUBTITLE: "Select a Built-in Scenario or Customize:",
    STORY_TITLE_LABEL: "Story Title",
    STORY_LOC_LABEL: "Location",
    LOC_HOSPITAL: "Abandoned Hospital (St. Jude)",
    LOC_GRAVEYARD: "Cursed Graveyard",
    STORY_ENEMY_LABEL: "Awakened Entity",
    ENEMY_CORPSE: "The Risen Corpse (কবর থেকে লাশ)",
    ENEMY_SURGEON: "The Surgeon (Dr. Vance)",
    ENEMY_WIDOW: "The Weeping Widow (কান্না করা ভূত)",
    ENEMY_SHADOW: "The Shadow Silhouette",
    STORY_DIFF_LABEL: "Difficulty",
    DIFF_EASY: "Story (Slower Enemies)",
    DIFF_NORMAL: "Normal Horror",
    DIFF_NIGHTMARE: "Nightmare (Relentless Pursuit)",
    STORY_WEEPING_LABEL: "Ghost Weeping Ambience (কান্নার আওয়াজ)",
    BTN_START_STORY: "START STORY",

    // Character Customizer
    CHAR_CUSTOMIZER_TITLE: "CHARACTER & MODS",
    CHAR_OUTFIT: "Protagonist Outfit",
    CHAR_FLASHLIGHT: "Flashlight Tint",
    LIGHT_WARM: "Warm Atmospheric Halogen",
    LIGHT_WHITE: "Cold White LED",
    LIGHT_GREEN: "Nightvision Phosphor",
    LIGHT_RED: "Infrared Bloodlight",
    CHAR_EQUIP: "Starting Equipment",
    EQUIP_NORMAL: "Standard (Flashlight Only)",
    EQUIP_BATTERY: "Prepared (+1 Spare Battery)",
    EQUIP_ADRENALINE: "Survivor (+1 Adrenaline Rush)",
    CHAR_AGGR: "Monster Aggression",
    AGGR_NORMAL: "Normal Stalking",
    AGGR_RELENTLESS: "Relentless Pursuit",
    AGGR_BERSERK: "Berserk Nightmare",
    BTN_APPLY_MODS: "APPLY MODS",

    // About
    ABOUT_TITLE: "ABOUT DARKNESS",
    ABOUT_TEXT: "DARKNESS: THE HAUNTED WORLD is an atmospheric 3D first-person horror survival experience. Evade supernatural threats in the psychiatric hospital and the cursed cemetery. Customize lighting between Light Dark and Bright mode for comfortable viewing.",
    ABOUT_CONTROLS: "Controls: Left screen drag moves your player with the virtual joystick, right screen drag rotates camera look. Use the action buttons on the right to toggle flashlight, sprint, crouch, and interact."
  }
};

export class Localization {
  constructor() {
    // Default to Bengali ('bn') as requested, fallback or saved in localStorage
    const saved = localStorage.getItem('dhw_lang');
    this.currentLang = saved === 'en' ? 'en' : 'bn';
    this.listeners = [];
  }

  getLang() {
    return this.currentLang;
  }

  setLang(lang) {
    if (lang !== 'bn' && lang !== 'en') lang = 'bn';
    this.currentLang = lang;
    localStorage.setItem('dhw_lang', lang);
    this.notify();
  }

  toggle() {
    this.setLang(this.currentLang === 'bn' ? 'en' : 'bn');
  }

  t(key) {
    const table = STRINGS[this.currentLang] || STRINGS.bn;
    return table[key] || STRINGS.en[key] || key;
  }

  subscribe(callback) {
    this.listeners.push(callback);
    callback(this.currentLang);
  }

  notify() {
    for (const cb of this.listeners) {
      try {
        cb(this.currentLang);
      } catch (err) {
        console.error("Localization notification error:", err);
      }
    }
  }
}

export const i18n = new Localization();
