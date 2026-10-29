/**
 * Argon - Code Editor Controls & Toolbar
 * Handles line numbers gutter, smart indentation, and dynamic quick-insert syntax toolbar.
 */
window.Argon = window.Argon || {};

(function() {
  function updateLineNumbers() {
    const codeEl = $("#code");
    if (!codeEl) return;
    const codeText = codeEl.value || "";
    const lineCount = Math.max(1, codeText.split("\n").length);
    const nums = [];
    for (let i = 1; i <= lineCount; i++) nums.push(i);
    const gutter = $("#lineGutter");
    if (gutter) gutter.innerHTML = nums.join("<br>");
  }

  function insertTextAtCursor(text) {
    const codeTextarea = $("#code");
    if (!codeTextarea) return;
    codeTextarea.setRangeText(text, codeTextarea.selectionStart, codeTextarea.selectionEnd, "end");
    codeTextarea.focus();
    handleLiveCodeInput();
  }

  function renderQuickKeysToolbar(lesson) {
    const keysBar = $("#keys");
    if (!keysBar) return;

    keysBar.innerHTML = "";

    const label = document.createElement("span");
    label.className = "keys-label";
    label.style.cssText = "font-size:0.75rem;font-weight:700;color:#64748b;margin-right:4px;";
    label.textContent = "?? Quick Blocks:";
    keysBar.appendChild(label);

    const baseKeys = [
      { label: "? Tab", insert: "    ", title: "Indent 4 spaces" },
      { label: ":", insert: ":" },
      { label: '" "', insert: '""' },
      { label: "==", insert: "==" },
      { label: "=", insert: "=" },
      { label: "!=", insert: "!=" },
      { label: ">", insert: ">" },
      { label: "<", insert: "<" },
      { label: "<=", insert: "<=" },
      { label: "if", insert: "if " },
      { label: "elif", insert: "elif " },
      { label: "else:", insert: "else:\n    " },
      { label: "and", insert: "and " },
      { label: "or", insert: "or " },
      { label: "not", insert: "not " }
    ];

    baseKeys.forEach(k => {
      const btn = document.createElement("button");
      btn.dataset.i = k.insert;
      btn.textContent = k.label;
      if (k.title) btn.title = k.title;
      keysBar.appendChild(btn);
    });

    // Dynamic actions registered in ActionRegistry
    const availableActions = Argon.getActions ? Argon.getActions() : ["go", "stop", "slow", "crawl"];
    availableActions.forEach(act => {
      const btn = document.createElement("button");
      btn.className = "cmd-key";
      btn.dataset.i = `${act}()`;
      btn.textContent = `${act}()`;
      keysBar.appendChild(btn);
    });

    // Custom snippets if defined on lesson
    if (lesson && Array.isArray(lesson.quickSnippets)) {
      lesson.quickSnippets.forEach(snip => {
        const btn = document.createElement("button");
        btn.dataset.i = snip.insert || snip.label;
        btn.textContent = snip.label;
        keysBar.appendChild(btn);
      });
    }
  }

  function initEditor() {
    renderQuickKeysToolbar(window.LESSONS ? window.LESSONS[window.cur || 0] : null);
    const codeEl = $("#code");
    if (!codeEl) return;

    codeEl.addEventListener("input", handleLiveCodeInput);

    codeEl.addEventListener("keydown", e => {
      if (e.key === "Tab") {
        e.preventDefault();
        insertTextAtCursor("    ");
      } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        run();
      } else if (e.key === "Enter") {
        e.preventDefault();
        const start = codeEl.selectionStart;
        const lineStart = codeEl.value.lastIndexOf("\n", start - 1) + 1;
        const currentLine = codeEl.value.slice(lineStart, start);
        let indent = currentLine.match(/^ */)[0];
        if (currentLine.trim().endsWith(":")) indent += "    ";
        insertTextAtCursor("\n" + indent);
      }
    });

    const keysBar = $("#keys");
    if (keysBar) {
      keysBar.addEventListener("click", e => {
        const btn = e.target.closest("button");
        if (!btn) return;
        const snippet = btn.dataset.i;
        if (!snippet) return;
        insertTextAtCursor(snippet);
        if (snippet === '""') {
          codeEl.setSelectionRange(codeEl.selectionStart - 1, codeEl.selectionStart - 1);
        }
      });
    }
  }

  Argon.updateLineNumbers = updateLineNumbers;
  Argon.insertTextAtCursor = insertTextAtCursor;
  Argon.renderQuickKeysToolbar = renderQuickKeysToolbar;
  window.renderQuickKeysToolbar = renderQuickKeysToolbar;
  Argon.initEditor = initEditor;
  window.updateLineNumbers = updateLineNumbers;
  window.insertTextAtCursor = insertTextAtCursor;
  window.renderQuickKeysToolbar = renderQuickKeysToolbar;
  window.initEditor = initEditor;
})();
