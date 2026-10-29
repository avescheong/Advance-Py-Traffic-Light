/**
 * Argon - Core State & Utilities
 * Global state variables, selectors, string formatting, and async timing helpers.
 */
window.Argon = window.Argon || {};

// Global element selectors
window.$ = selector => document.querySelector(selector);
window.$$ = selector => document.querySelectorAll(selector);

// HTML entity escaping
function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Simulation speed & timing
function getSimSpeedMultiplier() {
  const sel = $("#speedSelect");
  return sel ? parseFloat(sel.value) || 1 : (Argon.config ? Argon.config.defaultSpeedMultiplier : 1);
}

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms * getSimSpeedMultiplier()));

// Formatting helpers
const formatPythonValue = v => (v === true ? "True" : v === false ? "False" : JSON.stringify(v));
const extractConditionText = lineText => lineText.replace(/^(if|elif)\s+/, "").replace(/:$/, "").trim();

// Dynamic proxy to ActionRegistry descriptions for backward compatibility
const ACTION_DESCRIPTIONS = new Proxy({}, {
  get: (_, prop) => (Argon.getActionDescription ? Argon.getActionDescription(prop) : "")
});

function describeUsedVariables(exprText, env) {
  const seen = [];
  (exprText.match(/[A-Za-z_]\w*/g) || []).forEach(word => {
    if (word in env && !seen.includes(word)) seen.push(word);
  });
  return seen.map(w => `${w} is ${formatPythonValue(env[w])}`).join(", ");
}

const formatScenarioLabel = sc =>
  Object.entries(sc)
    .filter(([k]) => k !== "want" && k !== "label")
    .map(([k, v]) => `${k} = ${formatPythonValue(v)}`)
    .join(", ");

// Global application runtime state
window.cur = 0;
window.running = false;
window.autoPlayTimer = null;
window.done = new Set();
window.S = null;
window.teacherModeActive = false;
window.hintTier = 0;

// Reactive aliases for active module curriculum
Object.defineProperty(window, "LV", {
  get() {
    const mod = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModule() : null;
    return mod ? mod.adaptedLessons : [];
  },
  configurable: true
});

Object.defineProperty(window, "LESSONS", {
  get() {
    const mod = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModule() : null;
    return mod ? mod.lessons : [];
  },
  configurable: true
});

Argon.escapeHtml = escapeHtml;
Argon.getSimSpeedMultiplier = getSimSpeedMultiplier;
Argon.sleep = sleep;
Argon.formatPythonValue = formatPythonValue;
Argon.extractConditionText = extractConditionText;
Argon.describeUsedVariables = describeUsedVariables;
Argon.formatScenarioLabel = formatScenarioLabel;
