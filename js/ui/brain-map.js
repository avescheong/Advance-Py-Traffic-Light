/**
 * Argon - Live Cognitive Brain Map & Step Tracer
 * Visualizes the decision flowchart in real-time as the student types, and highlights steps.
 */
window.Argon = window.Argon || {};

function buildLiveBrainFlowchart(codeText) {
      const flowContainer = $("#brainFlow");
      if (!flowContainer) return;
      flowContainer.innerHTML = "";

      const lines = codeText.split("\n")
        .map((raw, idx) => ({ lineNum: idx + 1, text: raw.trim() }))
        .filter(l => l.text && !l.text.startsWith("#"));

      if (!lines.length) {
        flowContainer.innerHTML = `<span style="font-size:0.78rem;color:#64748b;">Type code in the editor to build your Smart Car's decision flowchart!</span>`;
        return;
      }

      lines.forEach((lineObj, index) => {
        const s = lineObj.text;
        const node = document.createElement("div");
        node.className = "flow-node";
        node.dataset.line = lineObj.lineNum;

        if (/^if\b/.test(s)) {
          node.classList.add("node-cond");
          const q = s.replace(/^if\s*/, "").replace(/:$/, "") || "...";
          node.innerHTML = `❓ <b>IF</b> <code>${escapeHtml(q)}</code>`;
        } else if (/^elif\b/.test(s)) {
          node.classList.add("node-cond");
          const q = s.replace(/^elif\s*/, "").replace(/:$/, "") || "...";
          node.innerHTML = `🔀 <b>ELIF</b> <code>${escapeHtml(q)}</code>`;
        } else if (/^else\b/.test(s)) {
          node.classList.add("node-cond");
          node.innerHTML = `↪️ <b>ELSE</b> (otherwise)`;
        } else if (/^(go|stop|slow|crawl)\s*\(\s*\)$/.test(s)) {
          node.classList.add("node-act");
          const cmd = s.match(/^(go|stop|slow|crawl)/)[1];
          const icons = { go: "🟢", stop: "🛑", slow: "🟡", crawl: "🐢" };
          node.innerHTML = `${icons[cmd] || "⚡"} <b>${cmd}()</b>`;
        } else if (/^[A-Za-z_]\w*\s*=\s*[^=]/.test(s)) {
          node.classList.add("node-set");
          node.innerHTML = `📦 <code>${escapeHtml(s)}</code>`;
        } else {
          node.innerHTML = `✏️ <code>${escapeHtml(s.slice(0, 22))}</code>`;
        }

        flowContainer.appendChild(node);
        if (index < lines.length - 1) {
          const arrow = document.createElement("span");
          arrow.className = "flow-arrow";
          arrow.textContent = "➜";
          flowContainer.appendChild(arrow);
        }
      });
    }

function highlightTraceLine(lineNum) {
      document.querySelectorAll("#view .ln").forEach(row => {
        row.classList.toggle("hl", +row.dataset.n === lineNum);
      });
      document.querySelectorAll("#brainFlow .flow-node").forEach(node => {
        node.classList.toggle("active-step", +node.dataset.line === lineNum);
      });
    }

Argon.buildLiveBrainFlowchart = buildLiveBrainFlowchart;
Argon.highlightTraceLine = highlightTraceLine;
