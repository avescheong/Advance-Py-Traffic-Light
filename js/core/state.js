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
      return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
    }

// Simulation speed & timing
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms * getSimSpeedMultiplier()));

    function getSimSpeedMultiplier() {
      const sel = $("#speedSelect");
      return sel ? parseFloat(sel.value) || 1 : 1;
    }

// Formatting helpers
const formatPythonValue = v => v === true ? "True" : v === false ? "False" : JSON.stringify(v);
const extractConditionText = lineText => lineText.replace(/^(if|elif)\s+/, "").replace(/:$/, "").trim();
const ACTION_DESCRIPTIONS = {
      stop: "The car brakes firmly at the white stop line 🛑",
      slow: "The car slows down gently and stops at the line 🟡",
      crawl: "The car drives through in slow turtle mode 🐢",
      go: "The car drives smoothly through the intersection 🟢"
    };
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
