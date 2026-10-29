/**
 * Argon - Competency Tracking, Badges & 6-Step Guide
 * Tracks progress in LocalStorage scoped to module, displays badges modal & learn-first drawer.
 */
window.Argon = window.Argon || {};

const STORAGE_PREFIX = "argon_progress_";
const LEGACY_STORAGE_KEY = "tlp_v2_learning_record";

function getActiveCompetencies() {
  const mod = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModule() : null;
  return mod && mod.competencies ? mod.competencies : [];
}

function getModuleStorageKey() {
  const modId = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModuleId() : "traffic-light";
  return STORAGE_PREFIX + (modId || "default");
}

function loadSavedProgress() {
  try {
    const modId = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModuleId() : "traffic-light";
    let raw = localStorage.getItem(getModuleStorageKey());
    // Fallback/migration from legacy key for traffic-light module
    if (!raw && modId === "traffic-light") {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    }
    if (!raw) return;
    const data = JSON.parse(raw);
    const activeLessons = Argon.ModuleRegistry ? Argon.ModuleRegistry.getActiveModule().lessons : [];
    if (Array.isArray(data.completed)) {
      data.completed.forEach(idx => {
        if (typeof idx === "number" && idx >= 0 && idx < activeLessons.length) done.add(idx);
      });
    }
  } catch (e) {}
}

function saveProgress() {
  try {
    const completed = Array.from(done);
    const comps = getActiveCompetencies();
    const earnedBadges = comps.filter(c => c.levels.every(l => done.has(l))).map(c => c.id);
    localStorage.setItem(getModuleStorageKey(), JSON.stringify({ completed, earnedBadges, updatedAt: Date.now() }));
  } catch (e) {}
}

function updateProgressHeader() {
  const lessons = Argon.ModuleRegistry && Argon.ModuleRegistry.getActiveModule()
    ? Argon.ModuleRegistry.getActiveModule().lessons
    : [];
  const challengeCount = Math.max(1, lessons.length - 1); // exclude free sandbox
  const completedChallenges = Array.from(done).filter(i => i < challengeCount).length;
  const pct = Math.round((completedChallenges / challengeCount) * 100);
  const comps = getActiveCompetencies();
  const earnedCount = comps.filter(c => c.levels.every(l => done.has(l))).length;

  if ($("#progText")) $("#progText").textContent = `${completedChallenges}/${challengeCount} (${pct}%)`;
  if ($("#progFill")) $("#progFill").style.width = pct + "%";
  if ($("#badgeSummary")) $("#badgeSummary").textContent = `?? ${earnedCount}/${comps.length}`;
}

function renderLearningRecordModal() {
  const lessons = Argon.ModuleRegistry && Argon.ModuleRegistry.getActiveModule()
    ? Argon.ModuleRegistry.getActiveModule().lessons
    : [];
  const challengeCount = Math.max(1, lessons.length - 1);
  const completedChallenges = Array.from(done).filter(i => i < challengeCount).length;
  $("#journeySummary").textContent = `? ${completedChallenges} of ${challengeCount} Missions Completed`;

  const sList = $("#skillList");
  const bGrid = $("#badgeGrid");
  sList.innerHTML = "";
  bGrid.innerHTML = "";

  let nextSkill = null;
  const comps = getActiveCompetencies();
  comps.forEach(comp => {
    const mastered = comp.levels.every(l => done.has(l));
    if (!mastered && !nextSkill) nextSkill = comp;

    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:10px;background:#f8fafc;border:1px solid #e2e8f0;font-size:0.86rem;";
    row.innerHTML = `<span>${mastered ? "?" : "?"}</span><div><b>${comp.title}</b> ? <span style="color:#475569">${comp.desc}</span></div>`;
    sList.appendChild(row);

    const badge = document.createElement("span");
    badge.className = "badge-chip" + (mastered ? " earned" : "");
    badge.textContent = comp.badge;
    bGrid.appendChild(badge);
  });

  const banner = $("#nextSkillBanner");
  if (nextSkill) {
    const nextLvl = nextSkill.levels.find(l => !done.has(l)) + 1;
    banner.innerHTML = `<b>?? Next Badge Goal:</b> ${nextSkill.title} ? <i>${nextSkill.desc}</i> (Try Mission ${nextLvl}!)`;
  } else {
    banner.innerHTML = `<b>?? Congratulations!</b> You have mastered every concept and earned all ${comps.length} Autonomous Engineer badges!`;
  }
}

function renderLearnFirst(lesson) {
      $("#conceptTag").textContent = `📘 ${lesson.concept}`;
      const lf = lesson.learnFirst || {};
      const drawer = $("#learnDrawer");
      drawer.innerHTML = "";

      const steps = [
        ["1. Road Problem", lf.problem],
        ["2. Sensor Info", lf.knownInfo],
        ["3. Python Question", lf.pythonQuestion],
        ["4. Why This Path?", lf.whyPath],
        ["5. Car Action", lf.action],
        ["6. Key Takeaway", lf.learned]
      ];

      steps.forEach(([title, text]) => {
        const box = document.createElement("div");
        box.className = "q6-item";
        box.innerHTML = `<b>${title}</b><span>${escapeHtml(text || "")}</span>`;
        drawer.appendChild(box);
      });

      const vBar = $("#vocabBar");
      const vPop = $("#vocabPop");
      vBar.innerHTML = "";
      vPop.hidden = true;

      if (Array.isArray(lesson.vocabulary) && lesson.vocabulary.length) {
        const lbl = document.createElement("span");
        lbl.style.cssText = "font-size:0.76rem;font-weight:700;color:#475569;";
        lbl.textContent = "🔑 Tap a Python word:";
        vBar.appendChild(lbl);

        lesson.vocabulary.forEach(v => {
          const btn = document.createElement("button");
          btn.className = "vocab-pill";
          btn.textContent = v.term;
          btn.onclick = () => {
            const already = btn.classList.contains("active") && !vPop.hidden;
            vBar.querySelectorAll(".vocab-pill").forEach(p => p.classList.remove("active"));
            if (already) {
              vPop.hidden = true;
            } else {
              btn.classList.add("active");
              vPop.hidden = false;
              vPop.innerHTML = `<b>${escapeHtml(v.term)}</b> → ${escapeHtml(v.meaning)}`;
            }
          };
          vBar.appendChild(btn);
        });
      }
    }

window.hintTier = 0;
function resetHints() {
      hintTier = 0;
      $("#hintBtn").textContent = "💡 Hint 1";
      $("#hintPanel").hidden = true;
      $("#hintPanel").innerHTML = "";
    }
function advanceHint() {
      const lesson = LESSONS[cur];
      const hints = lesson.hints || [];
      const panel = $("#hintPanel");
      panel.hidden = false;
      panel.innerHTML = "";

      if (hintTier === 0) {
        hintTier = 1;
        panel.innerHTML = `<b>💡 Hint 1 (Concept Clue):</b> ${escapeHtml(hints[0] || "")}`;
        $("#hintBtn").textContent = "💡 Hint 2 (Structure)";
      } else if (hintTier === 1) {
        hintTier = 2;
        panel.innerHTML = `<b>🧩 Hint 2 (Code Pattern):</b><pre>${escapeHtml(hints[1] || "")}</pre>`;
        $("#hintBtn").textContent = "💡 Hint 3 (Guided Fix)";
      } else {
        hintTier = 0;
        let mistakeHtml = "";
        if (Array.isArray(lesson.commonMistakes) && lesson.commonMistakes.length) {
          mistakeHtml = `<div style="margin-top:4px;font-size:0.78rem;">⚠️ <b>Watch out for:</b> ${escapeHtml(lesson.commonMistakes.join(" · "))}</div>`;
        }
        panel.innerHTML = `<b>🎯 Hint 3 (Guided Solution Step):</b> ${escapeHtml(hints[2] || "")}${mistakeHtml}`;
        $("#hintBtn").textContent = "💡 Restart Hints";
      }
    }

Argon.loadSavedProgress = loadSavedProgress;
Argon.saveProgress = saveProgress;
Argon.updateProgressHeader = updateProgressHeader;
Argon.renderLearningRecordModal = renderLearningRecordModal;
Argon.renderLearnFirst = renderLearnFirst;
Argon.resetHints = resetHints;
Argon.advanceHint = advanceHint;
