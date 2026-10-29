/**
 * Argon - Road Test Runner & Mission Navigator
 * Manages test scenarios, step-by-step cognitive debugger, and mission tabs navigation.
 */
window.Argon = window.Argon || {};

function showFeedbackBanner(text, type) {
      const m = $("#msg");
      m.className = "msg " + type;
      m.textContent = text;
    }

function stopAutoPlay() {
      if (autoPlayTimer) {
        clearTimeout(autoPlayTimer);
        autoPlayTimer = null;
      }
      const btn = $("#autoPlayBtn");
      if (btn) btn.textContent = "▶ Auto-Play Steps";
    }

function exitStep() {
      stopAutoPlay();
      S = null;
      $("#view").hidden = true;
      $("#code").hidden = false;
      $("#keys").hidden = false;
      $("#stepbar").hidden = true;
      $("#run").hidden = false;
      $("#brainStatusTag").textContent = "Live Preview";
      highlightTraceLine(0);
      resetCarPosition();
      handleLiveCodeInput();
    }

function prepareTestSuiteExecution() {
      const L = LV[cur];
      $("#res").innerHTML = "";
      $("#next").hidden = true;
      showFeedbackBanner("", "");

      let parsedAst;
      try {
        parsedAst = parsePythonProgram($("#code").value, L.names);
      } catch (err) {
        if (err instanceof PyErr) {
          showFeedbackBanner("🐞 " + err.message, "bad");
          $("#coachBar").classList.add("warn");
          $("#pipSpeech").innerHTML = `<b>Coach Pip:</b> Oops! ${escapeHtml(err.message)}`;
          return null;
        }
        throw err;
      }

      const testRuns = [];
      for (const sc of (L.free ? [{}] : L.sc)) {
        const env0 = Object.assign({}, L.base || {}, sc);
        delete env0.want;
        delete env0.label;
        const env = Object.assign({}, env0);
        const ev = [];
        try {
          traceProgramExecution(parsedAst, env, ev);
        } catch (err) {
          showFeedbackBanner("🐞 Something went wrong while running your code.", "bad");
          return null;
        }
        if (!ev.some(x => x.k === "call")) {
          ev.push({ k: "call", n: 0, f: "go", auto: true });
        }
        const calls = ev.filter(x => x.k === "call");
        const got = calls[calls.length - 1].f;
        let good = L.free || got === sc.want;
        if (cur >= 3 && !L.free && ev.some(e => e.auto)) {
          good = false;
        }
        testRuns.push({
          sc,
          env0,
          ev,
          got,
          good,
          lab: sc.label || formatScenarioLabel(env0)
        });
      }

      return { L, T: testRuns };
    }

function run() {
      if (running) return;
      const suite = prepareTestSuiteExecution();
      if (!suite) return;

      const viewEl = $("#view");
      viewEl.innerHTML = "";
      $("#code").value.split("\n").forEach((lineText, idx) => {
        const row = document.createElement("div");
        row.className = "ln";
        row.dataset.n = idx + 1;
        const num = document.createElement("i");
        num.textContent = idx + 1;
        row.append(num, document.createTextNode(lineText));
        viewEl.appendChild(row);
      });

      S = { L: suite.L, T: suite.T, si: 0, ei: -1, rows: 0, testDone: false };
      $("#code").hidden = true;
      $("#keys").hidden = true;
      viewEl.hidden = false;
      $("#run").hidden = true;
      $("#stepbar").hidden = false;
      $("#brainStatusTag").textContent = "🔍 Step Tracer Active";
      introCurrentTestScenario();
    }

function introCurrentTestScenario() {
      const t = S.T[S.si];
      S.ei = -1;
      S.testDone = false;
      highlightTraceLine(0);
      setScene(t.env0);
      resetCarPosition();
      $("#bubble").textContent = "";
      $("#expl").textContent = `🧪 Scenario ${S.si + 1} of ${S.T.length} (${t.lab}): Press "Next Step ▶" or "Auto-Play Steps" to watch Python think!`;
      $("#step").textContent = "Next Step ▶";
    }

function appendScenarioResultRow(index) {
      const t = S.T[index];
      const row = document.createElement("div");
      row.className = "chip";
      row.textContent = S.L.free
        ? `🎮 Sandbox Result: Car ran ${t.got}()`
        : `${t.good ? "✅" : "❌"} Test ${index + 1} (${t.lab}) → Car ran ${t.got}()${t.good ? "" : ` (needed ${t.sc.want}())`}`;
      $("#res").appendChild(row);
      S.rows = index + 1;
    }

function finish() {
      const L = S.L;
      const allPassed = S.T.every(t => t.good);
      const wasDone = done.has(cur);
      exitStep();

      if (L.free) {
        showFeedbackBanner("🎮 Sandbox run complete! Try changing sensor values or adding new elif rules!", "info");
        return;
      }

      if (allPassed) {
        done.add(cur);
        saveProgress();
        updateProgressHeader();
        tabs();
        showFeedbackBanner("🎉 Awesome job! Every road test scenario passed!", "ok");
        $("#reflBox").hidden = false;
        $("#reflBox").textContent = `🌟 What you mastered: "${LESSONS[cur].studentReflection}"`;
        $("#pipSpeech").innerHTML = `<b>Coach Pip:</b> 🏆 Mission accomplished! Click <b>Next Mission ➜</b> when you're ready!`;
        if (cur < LV.length - 1) $("#next").hidden = false;
      } else {
        if (wasDone) updateProgressHeader();
        showFeedbackBanner("Almost there! Check the ❌ test result on the right, adjust your code, and try again.", "info");
        $("#pipSpeech").innerHTML = `<b>Coach Pip:</b> Look at the ❌ line under Road Sensors to see which test scenario needs fixing!`;
      }
    }

function skip() {
      if (!S || running) return;
      stopAutoPlay();
      for (let i = S.rows; i < S.T.length; i++) appendScenarioResultRow(i);
      finish();
    }

async function step() {
      if (!S || running) return;
      if (S.testDone) {
        if (S.si < S.T.length - 1) {
          S.si++;
          introCurrentTestScenario();
        } else {
          finish();
        }
        return;
      }

      const t = S.T[S.si];
      const e = t.ev[++S.ei];
      const b = $("#bubble");
      const X = $("#expl");
      const car = $("#car");

      running = true;
      $("#step").disabled = true;
      highlightTraceLine(e.n);

      if (e.k === "cond") {
        car.classList.add("scanning");
        const ex = extractConditionText(e.s);
        const u = describeUsedVariables(ex, e.env);
        const q = `📡 LiDAR asks: Is ${ex}? (${u})`;
        b.textContent = `🤔 ${ex} ?`;
        X.textContent = q;
        await sleep(750);
        b.textContent = e.r ? "✅ True!" : "❌ False";
        X.textContent = q + (e.r ? " → ✅ True! Running indented block." : " → ❌ False. Skipping to next branch.");
        car.classList.remove("scanning");
      } else if (e.k === "set") {
        setScene(e.env);
        b.textContent = `📦 ${e.key} = ${formatPythonValue(e.val)}`;
        X.textContent = `📦 Memory Box Updated! ${e.key} now stores ${formatPythonValue(e.val)}.`;
        await sleep(500);
      } else if (e.k === "else") {
        b.textContent = "↪️ else:";
        X.textContent = "↪️ Earlier questions were False, so Python enters the else: branch!";
        await sleep(450);
      } else {
        X.textContent = e.auto
          ? "No command was called, so the car drives forward by default."
          : `🚀 Executing ${e.f}()! ${ACTION_DESCRIPTIONS[e.f]}`;
        await animateCarAction(e.f);
      }

      if (S.ei >= t.ev.length - 1) {
        S.testDone = true;
        appendScenarioResultRow(S.si);
        highlightTraceLine(0);
        X.textContent += S.L.free
          ? ""
          : t.good
          ? " ✅ Scenario passed!"
          : ` ❌ Needed ${t.sc.want}(), but code ran ${t.got}().`;
      }

      running = false;
      $("#step").disabled = false;
      $("#step").textContent = S.testDone
        ? S.si < S.T.length - 1
          ? "Next Scenario ▶"
          : "Finish & See Results ▶"
        : "Next Step ▶";

      if (autoPlayTimer && S) {
        autoPlayTimer = setTimeout(() => {
          if (S && !running) step();
        }, 550 * getSimSpeedMultiplier());
      }
    }

function toggleAutoPlaySteps() {
      if (!S) return;
      if (autoPlayTimer) {
        stopAutoPlay();
      } else {
        $("#autoPlayBtn").textContent = "⏸ Pause Auto-Play";
        autoPlayTimer = setTimeout(() => {
          if (S && !running) step();
        }, 150);
      }
    }

function runFastCheck() {
      if (running) return;
      run();
      if (S) skip();
    }

function tabs() {
      const tabsEl = $("#tabs");
      tabsEl.innerHTML = "";
      LV.forEach((L, idx) => {
        const btn = document.createElement("button");
        btn.className = "level-tab" + (idx === cur ? " active" : "") + (done.has(idx) ? " completed" : "");
        btn.textContent = (idx === LV.length - 1 ? "🎮" : idx + 1) + (done.has(idx) ? " ⭐" : "");
        btn.title = L.t;
        btn.onclick = () => {
          if (!running) load(idx);
        };
        tabsEl.appendChild(btn);
      });
    }

function load(levelIndex) {
      exitStep();
      cur = levelIndex;
      const L = LV[levelIndex];
      const lessonData = LESSONS[levelIndex];

      $("#title").textContent = L.t;
      $("#task").textContent = L.task;
      $("#code").value = L.start || "";
      $("#res").innerHTML = "";
      $("#next").hidden = true;
      showFeedbackBanner("", "");

      const initialEnv = Object.assign({}, L.base || {}, L.sc ? L.sc[0] : {});
      delete initialEnv.want;
      delete initialEnv.label;
      setScene(initialEnv);
      resetCarPosition();
      tabs();

      // Hide solution leakage in student view
      $("#peek").hidden = true;
      $("#ex").hidden = true;
      $("#ex").textContent = "";

      $("#reflBox").hidden = !done.has(levelIndex);
      if (done.has(levelIndex)) {
        $("#reflBox").textContent = `🌟 What you mastered: "${lessonData.studentReflection}"`;
      }

      renderLearnFirst(lessonData);
      resetHints();
      updateProgressHeader();
      handleLiveCodeInput();
      if (teacherModeActive) renderTeacherNotes();
    }

Argon.showFeedbackBanner = showFeedbackBanner;
Argon.stopAutoPlay = stopAutoPlay;
Argon.exitStep = exitStep;
Argon.prepareTestSuiteExecution = prepareTestSuiteExecution;
Argon.run = run;
Argon.introCurrentTestScenario = introCurrentTestScenario;
Argon.appendScenarioResultRow = appendScenarioResultRow;
Argon.finish = finish;
Argon.skip = skip;
Argon.step = step;
Argon.toggleAutoPlaySteps = toggleAutoPlaySteps;
Argon.runFastCheck = runFastCheck;
Argon.tabs = tabs;
Argon.load = load;
