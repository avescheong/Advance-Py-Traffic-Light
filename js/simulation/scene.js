/**
 * Argon - 2.5D City Scene & Road Ruler
 * Updates traffic lights, weather, pedestrians/obstacles, speedometer, and road distance ruler.
 */
window.Argon = window.Argon || {};

function setScene(env) {
      ["red", "yellow", "green"].forEach(color => {
        $("#l-" + color).classList.toggle("on", env.light === color);
      });

      const walkerEl = $("#walker");
      walkerEl.hidden = env.path === undefined || env.path === "clear";
      walkerEl.textContent = env.path === "blocked" ? "🚧" : "🚶";

      const isRainy = env.weather === "rainy";
      $("#sunE").textContent = isRainy ? "🌧️" : "☀️";
      $("#sceneStage").classList.toggle("rainy-mode", isRainy);

      const decoEl = $("#deco");
      decoEl.textContent = env.siren === true ? "🚑" : env.zone === "school" ? "🏫" : "";
      decoEl.classList.toggle("siren-flash", env.siren === true);

      // Render active sensor pills
      const varsContainer = $("#vars");
      varsContainer.innerHTML = "";
      const titleSpan = document.createElement("span");
      titleSpan.style.fontWeight = "700";
      titleSpan.style.color = "#475569";
      titleSpan.style.marginRight = "4px";
      titleSpan.textContent = "📡 Road Sensors:";
      varsContainer.appendChild(titleSpan);

      Object.entries(env).forEach(([key, val]) => {
        const pill = document.createElement("span");
        pill.className = "sensor-pill";
        pill.textContent = `${key} = ${formatPythonValue(val)}`;
        varsContainer.appendChild(pill);
      });

      // Speedometer HUD
      const gaugeEl = $("#gauge");
      gaugeEl.style.display = env.speed === undefined ? "none" : "block";
      if (env.speed !== undefined) {
        const clampedSpeed = Math.max(0, Math.min(120, +env.speed || 0));
        $("#needle").style.transform = `rotate(${(clampedSpeed / 120) * 180}deg)`;
        $("#gnum").textContent = `${env.speed} km/h`;
      }

      // Laser Distance Ruler
      const rulerEl = $("#ruler");
      rulerEl.hidden = env.distance === undefined;
      if (env.distance !== undefined) {
        const distVal = Math.max(0, +env.distance || 0);
        const pct = (Math.min(distVal, 20) / 20) * 100;
        $("#lead").style.left = pct + "%";
        $("#span").style.width = pct + "%";
        $("#dlab").textContent = env.distance + " m";
      }
    }

function buildRuler() {
      const track = $("#rtrack");
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
