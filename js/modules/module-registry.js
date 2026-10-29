/**
 * Argon - Module Registry & Curriculum Framework
 * Manages curriculum tracks, dynamic module switching, and lesson validation.
 * Non-hardcoded architecture for future module extensions.
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
      defaultAction: lesson.defaultAction || "go",
      requireExplicitAction: lesson.requireExplicitAction,
      sc: (lesson.tests || []).map(t => Object.assign({}, t.environment || {}, { want: t.want, label: t.label }))
    };
  }

  /**
   * Helper utility to create a new lesson with sensible defaults.
   * Ensures new lessons are friendly and maintainable.
   */
  function createLesson(def) {
    return {
      id: def.id || 1,
      title: def.title || "Untitled Mission",
      storyProblem: def.storyProblem || "Drive safely through the intersection.",
      concept: def.concept || "Python Basics",
      goalChecklist: def.goalChecklist || [],
      learnFirst: def.learnFirst || {},
      vocabulary: def.vocabulary || [],
      hints: def.hints || [],
      starterCode: def.starterCode || "",
      solution: def.solution || "",
      variables: def.variables || [],
      base: def.base || {},
      tests: def.tests || [],
      teacherExplanation: def.teacherExplanation || "",
      commonMistakes: def.commonMistakes || [],
      studentReflection: def.studentReflection || "I accomplished this mission!",
      free: !!def.free,
      quickSnippets: def.quickSnippets || []
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
     * @param {Function} [mod.onSceneUpdate] - Custom visual hook: (env, elements) => void
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
        competencies: mod.competencies || [],
        onSceneUpdate: mod.onSceneUpdate || null
      };
      modules.set(mod.id, moduleRecord);

      // Default active module to config or first registered
      const defaultId = Argon.config ? Argon.config.defaultModuleId : null;
      if (!activeModuleId || (defaultId && mod.id === defaultId)) {
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
    createLesson,

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
  Argon.createLesson = createLesson;
})();
