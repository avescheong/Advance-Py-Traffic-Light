/**
 * Argon - Live Mission Goal Checklist
 * Automatically tests student code against mission goals and displays live checkmarks.
 */
window.Argon = window.Argon || {};

function renderGoalChecklist(codeText) {
      const lesson = LESSONS[cur];
      const container = $("#goalChecklist");
      if (!container) return;
      const goals = lesson.goalChecklist || [];
      container.innerHTML = "";

      goals.forEach(g => {
        let passed = false;
        try { passed = !!g.test(codeText); } catch (e) { passed = false; }
        const item = document.createElement("div");
        item.className = "goal-item" + (passed ? " done" : "");
        item.innerHTML = `<span class="goal-check-icon">${passed ? "✓" : "○"}</span><span>${g.label}</span>`;
        container.appendChild(item);
      });
    }

Argon.renderGoalChecklist = renderGoalChecklist;
