/**
 * Argon - Live Typing Reactive Graphic Engine
 * Reacts to every keystroke before Run is pressed:
 * dynamically parses variable assignments and live action calls for any module!
 */
window.Argon = window.Argon || {};

(function() {
  function triggerLiveGraphicReactions(codeText) {
    const car = $("#car");
    const bubble = $("#bubble");
    const stopLine = $("#stopLine");
    const badge = $("#liveBadge");

    if (!car || !bubble) return;

    const lesson = LESSONS[cur] || {};
    const cleanCode = (codeText || "")
      .split("\n")
      .map(l => l.replace(/#.*$/, ""))
      .join("\n");

    // 1. Dynamic Variable Assignment Parsing: varName = value
    const baseEnv = Object.assign({}, lesson.base || {}, lesson.sc && lesson.sc[0] ? lesson.sc[0] : {});
    const dynamicEnv = Object.assign({}, baseEnv);
    const assignRegex = /\b([a-zA-Z_]\w*)\s*=\s*(True|False|\d+(?:\.\d+)?|"[^"\\]*"|'[^'\\]*')/g;
    let match;
    while ((match = assignRegex.exec(cleanCode)) !== null) {
      const varName = match[1];
      const rawVal = match[2];
      let val;
      if (rawVal === "True") val = true;
      else if (rawVal === "False") val = false;
      else if (/^\d/.test(rawVal)) val = Number(rawVal);
      else val = rawVal.slice(1, -1);
      dynamicEnv[varName] = val;
    }
    setScene(dynamicEnv);

    // 2. Car LiDAR Radar Waves spin when conditions are present
    const hasCondition = /\b(if|elif)\b/.test(cleanCode);
    const lidarDome = $("#lidarDome");
    if (lidarDome) {
      lidarDome.setAttribute("fill", hasCondition ? "#f59e0b" : "#38bdf8");
    }

    // 3. Dynamic Action Previews
    const activeReactions = [];
    const availableActions = Argon.getActions ? Argon.getActions() : ["go", "stop", "slow", "crawl"];
    availableActions.forEach(act => {
      const pattern = new RegExp(`\\b${act}\\s*\\(\\s*\\)`);
      if (pattern.test(cleanCode)) {
        const icon = Argon.getActionIcon(act) || "?";
        activeReactions.push(`${icon} ${act}() ready`);
      }
    });

    const hasStop = /\bstop\s*\(\s*\)/.test(cleanCode);
    const hasGo = /\bgo\s*\(\s*\)/.test(cleanCode);
    const hasSlow = /\bslow\s*\(\s*\)/.test(cleanCode);

    if (stopLine) stopLine.classList.toggle("active-stop", hasStop);

    const beam = $("#headlightBeam");
    if (beam) {
      beam.setAttribute("opacity", hasGo ? "0.85" : hasSlow ? "0.55" : "0.15");
    }
    const brakeGlow = $("#brakeGlow");
    if (brakeGlow) {
      brakeGlow.setAttribute("opacity", hasStop ? "0.9" : "0.05");
    }

    // 4. Live Badge Feedback
    if (badge) {
      if (activeReactions.length > 0) {
        badge.textContent = `? Live: ${activeReactions.join(" ? ")}`;
        badge.classList.add("active");
      } else if (hasCondition) {
        badge.textContent = "?? LiDAR Question Active";
        badge.classList.add("active");
      } else {
        badge.textContent = "? Live Sensor Link Ready";
        badge.classList.remove("active");
      }
    }
  }

  function handleLiveCodeInput() {
    const codeText = $("#code") ? $("#code").value : "";
    updateLineNumbers();
    renderGoalChecklist(codeText);
    buildLiveBrainFlowchart(codeText);
    triggerLiveGraphicReactions(codeText);
    updateCoachPipLiveFeedback(codeText);
  }

  Argon.triggerLiveGraphicReactions = triggerLiveGraphicReactions;
  Argon.handleLiveCodeInput = handleLiveCodeInput;
  window.triggerLiveGraphicReactions = triggerLiveGraphicReactions;
  window.handleLiveCodeInput = handleLiveCodeInput;
})();
