/**
 * Argon - Live Typing Reactive Graphic Engine
 * Reacts to every keystroke before Run is pressed:
 * live traffic lamp preview, car headlights/brakes, radar scan, speedometer gauge.
 */
window.Argon = window.Argon || {};

function triggerLiveGraphicReactions(codeText) {
      if (running || S) return; // Don't override active step execution

      const car = $("#car");
      const bubble = $("#bubble");
      const stopLine = $("#stopLine");
      const pole = $("#trafficPole");
      const gauge = $("#gauge");
      const ruler = $("#ruler");
      const zebra = $("#zebraCross");
      const badge = $("#liveBadge");

      // Strip comments for live analysis
      const cleanCode = codeText.split("\n").map(l => l.replace(/#.*$/, "")).join("\n");

      // 1. Live Variable Assignment Previews (e.g. light = "red", speed = 80, distance = 4, weather = "rainy")
      const lesson = LV[cur];
      const baseEnv = Object.assign({}, lesson.base || {}, lesson.sc && lesson.sc[0] ? lesson.sc[0] : {});
      delete baseEnv.want;
      delete baseEnv.label;

      const lightAssign = cleanCode.match(/\blight\s*=\s*["'](red|yellow|green)["']/);
      if (lightAssign) baseEnv.light = lightAssign[1];

      const speedAssign = cleanCode.match(/\bspeed\s*=\s*(\d+)/);
      if (speedAssign) baseEnv.speed = parseInt(speedAssign[1], 10);

      const distAssign = cleanCode.match(/\bdistance\s*=\s*(\d+)/);
      if (distAssign) baseEnv.distance = parseInt(distAssign[1], 10);

      const pathAssign = cleanCode.match(/\bpath\s*=\s*["'](clear|busy|blocked)["']/);
      if (pathAssign) baseEnv.path = pathAssign[1];

      const weatherAssign = cleanCode.match(/\bweather\s*=\s*["'](sunny|rainy)["']/);
      if (weatherAssign) baseEnv.weather = weatherAssign[1];

      const sirenAssign = cleanCode.match(/\bsiren\s*=\s*(True|False)/);
      if (sirenAssign) baseEnv.siren = sirenAssign[1] === "True";

      setScene(baseEnv);

      // 2. Highlight sensors mentioned in the student's code
      pole.classList.toggle("sensor-focus", /\blight\b/.test(cleanCode));
      gauge.classList.toggle("sensor-focus", /\bspeed\b/.test(cleanCode));
      ruler.classList.toggle("sensor-focus", /\bdistance\b/.test(cleanCode));
      zebra.classList.toggle("sensor-focus", /\bpath\b/.test(cleanCode));

      // 3. Car LiDAR Radar Waves spin when `if` or `elif` is present
      const hasCondition = /\b(if|elif)\b/.test(cleanCode);
      car.classList.toggle("scanning", hasCondition);

      // 4. Car Live Action Previews (Headlights, Brake lights, Turtle badge, Engine rev)
      const hasGo = /\bgo\s*\(\s*\)/.test(cleanCode);
      const hasStop = /\bstop\s*\(\s*\)/.test(cleanCode);
      const hasSlow = /\bslow\s*\(\s*\)/.test(cleanCode);
      const hasCrawl = /\bcrawl\s*\(\s*\)/.test(cleanCode);

      car.classList.toggle("lights-on", hasGo);
      car.classList.toggle("preview-rev", hasGo && !hasStop);
      car.classList.toggle("braking", hasStop || hasSlow);
      car.classList.toggle("crawling", hasCrawl);
      stopLine.classList.toggle("active-stop", hasStop);

      // 5. Live Status Bubble & Badge Feedback
      const activeReactions = [];
      if (lightAssign) activeReactions.push(`📦 light="${lightAssign[1]}"`);
      if (hasCondition) activeReactions.push(`📡 LiDAR Scanning`);
      if (hasGo) activeReactions.push(`🟢 go() ready`);
      if (hasStop) activeReactions.push(`🛑 stop() ready`);
      if (hasSlow) activeReactions.push(`🟡 slow() ready`);
      if (hasCrawl) activeReactions.push(`🐢 crawl() ready`);

      if (activeReactions.length) {
        bubble.textContent = "⚡ Live: " + activeReactions.join(" · ");
        badge.textContent = "🟢 Live Graphic Link Active";
      } else {
        bubble.textContent = "";
        badge.textContent = "⚡ Live Sensor Link Ready";
      }
    }

function handleLiveCodeInput() {
      const codeText = $("#code").value;
      updateLineNumbers();
      renderGoalChecklist(codeText);
      buildLiveBrainFlowchart(codeText);
      triggerLiveGraphicReactions(codeText);
      updateCoachPipLiveFeedback(codeText);
    }

Argon.triggerLiveGraphicReactions = triggerLiveGraphicReactions;
Argon.handleLiveCodeInput = handleLiveCodeInput;
