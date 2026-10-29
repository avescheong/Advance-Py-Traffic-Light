/**
 * Argon - Main Application Orchestrator & Bootstrapper
 * Binds UI buttons, hooks module switching, and boots the application.
 */
(function() {
  function initApp() {
    // 1. Initialize Editor & Teacher subsystems
    if (Argon.initEditor) Argon.initEditor();
    if (Argon.initTeacher) Argon.initTeacher();

    // 2. Bind Student Guide & Hint buttons
    const learnToggleBtn = $("#learnToggleBtn");
    if (learnToggleBtn) {
      learnToggleBtn.onclick = () => {
        const dr = $("#learnDrawer");
        if (dr) dr.hidden = !dr.hidden;
      };
    }

    const hintBtn = $("#hintBtn");
    if (hintBtn) hintBtn.onclick = advanceHint;

    const resetCodeBtn = $("#resetCodeBtn");
    if (resetCodeBtn) {
      resetCodeBtn.onclick = () => {
        if (running) return;
        exitStep();
        $("#code").value = LV[cur].start || "";
        handleLiveCodeInput();
      };
    }

    // 3. Bind Journey / Badges Modal
    const journeyBtn = $("#journeyBtn");
    const closeJourneyBtn = $("#closeJourneyBtn");
    const journeyModal = $("#journeyModal");

    if (journeyBtn) {
      journeyBtn.onclick = () => {
        renderLearningRecordModal();
        if (journeyModal) journeyModal.hidden = false;
      };
    }
    if (closeJourneyBtn) {
      closeJourneyBtn.onclick = () => {
        if (journeyModal) journeyModal.hidden = true;
      };
    }

    // 4. Bind Test Runner action controls
    if ($("#run")) $("#run").onclick = run;
    if ($("#instantRunBtn")) $("#instantRunBtn").onclick = runFastCheck;
    if ($("#step")) $("#step").onclick = step;
    if ($("#autoPlayBtn")) $("#autoPlayBtn").onclick = toggleAutoPlaySteps;
    if ($("#skip")) $("#skip").onclick = skip;
    if ($("#edit")) $("#edit").onclick = exitStep;
    if ($("#next")) $("#next").onclick = () => load(cur + 1);

    // 5. Bind Module Switching
    const moduleSelect = $("#moduleSelect");
    if (moduleSelect) {
      moduleSelect.addEventListener("change", e => {
        const selectedModId = e.target.value;
        if (selectedModId && Argon.ModuleRegistry) {
          exitStep();
          done.clear();
          Argon.ModuleRegistry.setActiveModule(selectedModId);
          loadSavedProgress();
          load(0);
        }
      });
    }

    // When a new module is registered, update selector
    if (Argon.ModuleRegistry) {
      Argon.ModuleRegistry.onModuleChange(() => {
        exitStep();
        done.clear();
        loadSavedProgress();
        load(0);
      });
      Argon.ModuleRegistry.updateModuleSelectorUI();
    }

    // 6. Boot Application
    loadSavedProgress();
    buildRuler();
    load(0);
  }

  // Auto-boot on DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }

  Argon.init = initApp;
})();
