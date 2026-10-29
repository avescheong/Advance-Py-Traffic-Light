/**
 * Argon - Code Editor Controls & Toolbar
 * Handles line numbers gutter, tab indentation, smart enter indentation, and quick-insert blocks.
 */
window.Argon = window.Argon || {};

function updateLineNumbers() {
      const codeText = $("#code").value || "";
      const lineCount = Math.max(1, codeText.split("\n").length);
      const nums = [];
      for (let i = 1; i <= lineCount; i++) nums.push(i);
      $("#lineGutter").innerHTML = nums.join("<br>");
    }

const codeTextarea = $("#code");

function insertTextAtCursor(text) {
      codeTextarea.setRangeText(text, codeTextarea.selectionStart, codeTextarea.selectionEnd, "end");
      codeTextarea.focus();
      handleLiveCodeInput();
    }

function initEditor() {
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
      insertTextAtCursor(snippet);
      if (snippet === '""') {
        codeEl.setSelectionRange(codeEl.selectionStart - 1, codeEl.selectionStart - 1);
      }
    });
  }
}

Argon.updateLineNumbers = updateLineNumbers;
Argon.insertTextAtCursor = insertTextAtCursor;
Argon.initEditor = initEditor;
