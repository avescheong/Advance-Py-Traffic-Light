/**
 * Argon - Robo-Coach Pip Reactive Co-Pilot
 * Provides real-time typing feedback, syntax tips, cheerleading, and SVG eye expressions.
 */
window.Argon = window.Argon || {};

function updateCoachPipLiveFeedback(codeText) {
      const lesson = LESSONS[cur];
      const bar = $("#coachBar");
      const speech = $("#pipSpeech");
      if (!bar || !speech) return;

      bar.classList.remove("warn", "pulse");

      const rawLines = codeText.split("\n").filter(l => l.trim() && !l.trim().startsWith("#"));
      if (!rawLines.length) {
        speech.innerHTML = `<b>Coach Pip:</b> Start typing your Python code below! Tap any button on the toolbar if you want a shortcut.`;
        return;
      }

      // Check for common real-time syntax tips to help 10-year-olds immediately
      for (let i = 0; i < rawLines.length; i++) {
        const line = rawLines[i].trim();
        if (Argon.isActionCommand ? Argon.isActionCommand(line) : /^(go|stop|slow|crawl)$/.test(line)) {
          bar.classList.add("warn");
          speech.innerHTML = `<b>Coach Pip:</b> Almost there! Add round brackets <code>()</code> after <b>${line}()</b> so the car knows to run the action!`;
          return;
        }
        if (/^(if|elif)\b/.test(line) && /=[^=]/.test(line.replace(/!=/g, "").replace(/<=/g, "").replace(/>=/g, ""))) {
          bar.classList.add("warn");
          speech.innerHTML = `<b>Coach Pip:</b> Heads up! Inside an <code>if</code> question, use <b>two equal signs <code>==</code></b> to compare values (one <code>=</code> is for saving).`;
          return;
        }
        if (/^(if|elif|else)\b/.test(line) && !line.endsWith(":")) {
          bar.classList.add("warn");
          speech.innerHTML = `<b>Coach Pip:</b> Don't forget to put a colon <code>:</code> at the end of your <code>${line.split(/\s+/)[0]}</code> line!`;
          return;
        }
      }

      // Check how many checklist goals are completed
      const goals = lesson.goalChecklist || [];
      const doneCount = goals.filter(g => {
        try { return g.test(codeText); } catch (e) { return false; }
      }).length;

      if (goals.length && doneCount === goals.length) {
        bar.classList.add("pulse");
        speech.innerHTML = `<b>Coach Pip:</b> 🎉 All ${goals.length} mission checklist steps look complete! Press <b>▶ Run &amp; Watch Car</b> to test your Smart Car!`;
      } else {
        const nextGoal = goals.find(g => {
          try { return !g.test(codeText); } catch (e) { return true; }
        });
        speech.innerHTML = `<b>Coach Pip:</b> Nice typing! Next step: <b>${nextGoal ? nextGoal.label : "Press ▶ Run & Watch Car!"}</b>`;
      }
    }

Argon.updateCoachPipLiveFeedback = updateCoachPipLiveFeedback;
window.updateCoachPipLiveFeedback = updateCoachPipLiveFeedback;
