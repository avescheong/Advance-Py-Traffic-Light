/**
 * Argon - 2.5D City Scene & Road Ruler
 * Updates traffic lights, weather, pedestrians/obstacles, speedometer, and road distance ruler.
 * Extensible: supports custom sensor handlers via Argon.registerSensorHandler()
 */
window.Argon = window.Argon || {};

(function() {
  // Built-in extensible sensor handlers dictionary
  const sensorHandlers = {
    light(val) {
      ["red", "yellow", "green"].forEach(color => {
        const el = $("#l-" + color);
        if (el) el.classList.toggle("on", val === color);
      });
    },

    path(val) {
      const walkerEl = $("#walker");
      if (!walkerEl) return;
      walkerEl.hidden = val === undefined || val === "clear";
      walkerEl.textContent = val === "blocked" ? "??" : "??";
    },

    weather(val) {
      const isRainy = val === "rainy";
      const sunEl = $("#sunE");
      if (sunEl) sunEl.textContent = isRainy ? "???" : "??";
      const stage = $("#sceneStage");
      if (stage) stage.classList.toggle("rainy-mode", isRainy);
    },

    speed(val) {
      const gaugeEl = $("#gauge");
      if (!gaugeEl) return;
      if (val !== undefined) {
        gaugeEl.style.display = "block";
        const clampedSpeed = Math.max(0, Math.min(100, val));
        const rot = -90 + (clampedSpeed / 100) * 180;
        const needle = $("#needle");
        if (needle) needle.style.transform = `rotate(${rot}deg)`;
        const gnum = $("#gnum");
        if (gnum) gnum.textContent = Math.round(val);
      } else {
        gaugeEl.style.display = "none";
      }
    },

    distance(val) {
      const rulerEl = $("#ruler");
      if (!rulerEl) return;
      if (val !== undefined) {
        rulerEl.hidden = false;
        const distVal = Math.max(0, Math.min(20, val));
        const pct = (distVal / 20) * 100;
        const lead = $("#lead");
        if (lead) lead.style.left = pct + "%";
        const span = $("#span");
        if (span) span.style.width = pct + "%";
        const dlab = $("#dlab");
        if (dlab) dlab.textContent = distVal + " m";
      } else {
        rulerEl.hidden = true;
      }
    }
  };

  function setScene(env) {
    if (!env) env = {};

    // 1. Run all registered sensor handlers
    Object.keys(sensorHandlers).forEach(key => {
      try {
        sensorHandlers[key](env[key], env);
      } catch (e) {
        console.warn(`Error running sensor handler for '${key}':`, e);
      }
    });

    // 2. Trigger active module's onSceneUpdate hook if implemented
    const activeMod = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModule() : null;
    if (activeMod && typeof activeMod.onSceneUpdate === "function") {
      try {
        activeMod.onSceneUpdate(env, {
          stage: $("#sceneStage"),
          car: $("#car"),
          bubble: $("#bubble")
        });
      } catch (e) {
        console.warn("Error in module.onSceneUpdate:", e);
      }
    }

    // 3. Update road status decoration badge
    const decoEl = $("#deco");
    if (decoEl) {
      if (env.siren) {
        decoEl.textContent = "?? Siren Screaming! Pull Over!";
      } else if (env.weather === "rainy") {
        decoEl.textContent = "??? Slippery Wet Road Condition";
      } else if (env.path === "busy") {
        decoEl.textContent = "?? Crosswalk Active";
      } else if (env.path === "blocked") {
        decoEl.textContent = "?? Road Work Ahead";
      } else {
        decoEl.textContent = "";
      }
    }

    // 4. Update dynamic sensor variables pill bar
    const varsContainer = $("#vars");
    if (varsContainer) {
      varsContainer.innerHTML = "";
      const titleSpan = document.createElement("span");
      titleSpan.style.cssText = "font-size:0.75rem;font-weight:700;color:#64748b;margin-right:2px;";
      titleSpan.textContent = "Road Sensors:";
      varsContainer.appendChild(titleSpan);

      const keys = Object.keys(env).filter(k => k !== "want" && k !== "label");
      if (keys.length === 0) {
        const pill = document.createElement("span");
        pill.className = "var-pill";
        pill.textContent = "Default Conditions";
        varsContainer.appendChild(pill);
      } else {
        keys.forEach(k => {
          const pill = document.createElement("span");
          pill.className = "var-pill";
          pill.textContent = `${k}: ${formatPythonValue(env[k])}`;
          varsContainer.appendChild(pill);
        });
      }
    }
  }

  function buildRuler() {
    const track = $("#rtrack");
    if (!track) return;
    track.querySelectorAll(".tk").forEach(el => el.remove());
    for (let m = 0; m <= 20; m++) {
      const tick = document.createElement("div");
      tick.className = "tk" + (m % 5 === 0 ? " mj" : "");
      tick.style.left = (m / 20) * 100 + "%";
      if (m % 5 === 0) {
        const label = document.createElement("b");
        label.textContent = m + "m";
        tick.appendChild(label);
      }
      track.appendChild(tick);
    }
  }

  Argon.setScene = setScene;
  Argon.buildRuler = buildRuler;
  window.setScene = setScene;
  window.buildRuler = buildRuler;
  Argon.registerSensorHandler = (name, fn) => {
    sensorHandlers[name] = fn;
  };
})();
