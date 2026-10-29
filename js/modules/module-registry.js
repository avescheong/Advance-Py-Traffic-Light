/**
 * Argon - Module Registry
 * Allows dynamic registration and switching of learning curriculum modules.
 */
window.Argon = window.Argon || {};

(function() {
  const modules = new Map();
  let activeModuleId = null;
  const changeListeners = [];

  /**
   * Adapter for internal level runner structure.
   * Converts user-friendly lesson schema to runtime execution format.
   */
  function adaptLesson(lesson) {
    return {
      id: lesson.id,
      t: lesson.title,
      task: lesson.storyProblem,
      ex: lesson.solution,
      names: lesson.variables || [],
      base: lesson.base || {},
      free: !!lesson.free,
      start: lesson.starterCode || "",
      sc: (lesson.tests || []).map(t => Object.assign({}, t.environment || {}, { want: t.want, label: t.label }))
    };
  }

  const ModuleRegistry = {
    /**
     * Register a new curriculum module.
     * @param {Object} mod
     * @param {string} mod.id - Unique ID (e.g., 'traffic-light')
     * @param {string} mod.title - Display title
     * @param {string} [mod.description] - Overview description
     * @param {Array} mod.lessons - Array of mission objects
     * @param {Array} [mod.competencies] - Array of competency objects for badges
     */
    register(mod) {
      if (!mod || !mod.id) {
        throw new Error("Module must have a valid 'id' property.");
      }
      const adaptedLessons = (mod.lessons || []).map(adaptLesson);
      const moduleRecord = {
        id: mod.id,
        title: mod.title || mod.id,
        description: mod.description || "",
        lessons: mod.lessons || [],
        adaptedLessons: adaptedLessons,
        competencies: mod.competencies || []
      };
      modules.set(mod.id, moduleRecord);

      // Default active module to first registered
      if (!activeModuleId) {
        activeModuleId = mod.id;
      }

      this.updateModuleSelectorUI();
      return moduleRecord;
    },

    get(id) {
      return modules.get(id);
    },

    getAll() {
      return Array.from(modules.values());
    },

    getActiveModule() {
      return modules.get(activeModuleId) || null;
    },

    getActiveModuleId() {
      return activeModuleId;
    },

    setActiveModule(id) {
      if (!modules.has(id)) {
        console.warn(`Module "${id}" is not registered.`);
        return false;
      }
      if (activeModuleId === id) return true;
      activeModuleId = id;
      changeListeners.forEach(fn => {
        try { fn(modules.get(id)); } catch(e) { console.error(e); }
      });
      this.updateModuleSelectorUI();
      return true;
    },

    onModuleChange(fn) {
      changeListeners.push(fn);
    },

    adaptLesson,

    updateModuleSelectorUI() {
      const select = document.getElementById("moduleSelect");
      if (!select) return;
      const allMods = this.getAll();
      if (allMods.length <= 1) {
        select.style.display = "none";
        const label = select.previousElementSibling;
        if (label && label.classList.contains("module-label")) label.style.display = "none";
        return;
      }
      select.style.display = "inline-block";
      const label = select.previousElementSibling;
      if (label && label.classList.contains("module-label")) label.style.display = "inline-block";

      select.innerHTML = "";
      allMods.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m.id;
        opt.textContent = m.title;
        if (m.id === activeModuleId) opt.selected = true;
        select.appendChild(opt);
      });
    }
  };

  Argon.ModuleRegistry = ModuleRegistry;
  Argon.registerModule = mod => ModuleRegistry.register(mod);
  Argon.adaptLesson = adaptLesson;
})();
