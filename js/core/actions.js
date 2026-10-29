/**
 * Argon - Dynamic Action & Command Registry
 * Allows defining and registering vehicle and robotics actions (e.g. go, stop, slow, crawl, turn_left, horn).
 * Eliminates hardcoded command names across parser, brain map, coach pip, and animations.
 */
window.Argon = window.Argon || {};

(function() {
  const actions = new Map();

  const ActionRegistry = {
    /**
     * Register a new action command.
     * @param {Object} def
     * @param {string} def.name - Python command name, e.g. 'go' for go()
     * @param {string} [def.icon='?'] - Visual emoji/icon displayed in flowcharts & feedback
     * @param {string} [def.description] - Feedback description
     * @param {Function} [def.handler] - Optional async animation handler: ({ car, bubble, stopLine, ... }) => Promise
     */
    register(def) {
      if (!def || !def.name) {
        throw new Error("Action must have a valid 'name' property.");
      }
      actions.set(def.name, {
        name: def.name,
        icon: def.icon || "?",
        description: def.description || `The vehicle executes ${def.name}().`,
        handler: def.handler || null
      });
    },

    get(name) {
      return actions.get(name);
    },

    getAll() {
      return Array.from(actions.values());
    },

    getNames() {
      return Array.from(actions.keys());
    },

    getIcon(name) {
      const act = actions.get(name);
      return act ? act.icon : "?";
    },

    getDescription(name) {
      const act = actions.get(name);
      return act ? act.description : "";
    },

    isCommand(name) {
      return actions.has(String(name || "").trim());
    },

    isCall(str) {
      const m = String(str || "").trim().match(/^([a-zA-Z_]\w*)\s*\(\s*\)$/);
      return m ? actions.has(m[1]) : false;
    }
  };

  Argon.ActionRegistry = ActionRegistry;
  Argon.registerAction = def => ActionRegistry.register(def);
  Argon.getAction = name => ActionRegistry.get(name);
  Argon.getActions = () => ActionRegistry.getNames();
  Argon.getActionIcon = name => ActionRegistry.getIcon(name);
  Argon.getActionDescription = name => ActionRegistry.getDescription(name);
  Argon.isActionCommand = name => ActionRegistry.isCommand(name);
  Argon.isActionCall = str => ActionRegistry.isCall(str);

  // Register standard autonomous vehicle driving actions
  Argon.registerAction({
    name: "go",
    icon: "??",
    description: "The car drives smoothly through the intersection ??"
  });

  Argon.registerAction({
    name: "stop",
    icon: "??",
    description: "The car brakes firmly at the white stop line ??"
  });

  Argon.registerAction({
    name: "slow",
    icon: "??",
    description: "The car slows down gently and stops at the line ??"
  });

  Argon.registerAction({
    name: "crawl",
    icon: "??",
    description: "The car drives through in slow turtle mode ??"
  });
})();
