/**
 * Argon - Global Application Configuration
 * Centralized settings: modify here to adjust defaults without modifying internal logic.
 */
window.Argon = window.Argon || {};

Argon.config = {
  // Application metadata
  appName: "Argon Autonomous Coding Academy",
  version: "2.1.0",

  // Default active module ID
  defaultModuleId: "traffic-light",

  // Storage key prefix for student learning records (scoped per module)
  storagePrefix: "argon_progress_",
  legacyStorageKey: "tlp_v2_learning_record",

  // Teacher Mode authentication
  // Default password: 'teacher' (SHA-256 hash below)
  // To change at runtime: Argon.setTeacherPassword("myNewPassword")
  teacherPasswordHash: "0c86f6fcae03526fb40c2b75d792577c7bae7143b0d8f058e237f8cacfbd8b51",

  // Default simulation speed multiplier
  defaultSpeedMultiplier: 1.0,

  // Animation delay timings (in ms before speed multiplier)
  timings: {
    conditionCheck: 750,
    variableUpdate: 500,
    branchDecision: 450,
    actionExecution: 850,
    autoPlayInterval: 550
  },

  // Developer / Debug mode
  debug: false
};
