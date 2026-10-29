/**
 * Argon - Teacher Mode & Curriculum Solution Demonstrator
 * SHA-256 protected dashboard with solutions, pedagogical notes, and test suites.
 */
window.Argon = window.Argon || {};

function sha256Hex(ascii) {
      function rightRotate(v, amount) { return (v >>> amount) | (v << (32 - amount)); }
      const mathPow = Math.pow, maxWord = mathPow(2, 32), lengthProperty = "length";
      let i, j, result = "";
      const words = [], asciiBitLength = ascii[lengthProperty] * 8;
      let hash = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
      const k = [
        0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
        0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
        0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
        0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
        0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
        0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
        0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
        0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
      ];
      ascii += "\x80";
      while (ascii[lengthProperty] % 64 - 56) ascii += "\x00";
      for (i = 0; i < ascii[lengthProperty]; i++) {
        j = ascii.charCodeAt(i);
        if (j >> 8) return "";
        words[i >> 2] |= j << ((3 - i % 4) * 8);
      }
      words[words[lengthProperty]] = ((asciiBitLength / maxWord) | 0);
      words[words[lengthProperty]] = (asciiBitLength);
      for (j = 0; j < words[lengthProperty];) {
        const w = words.slice(j, j += 16), oldHash = hash;
        hash = hash.slice(0, 8);
        for (i = 0; i < 64; i++) {
          const w15 = w[i - 15], w2 = w[i - 2];
          const a = hash[0], e = hash[4];
          const temp1 = hash[7]
            + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
            + ((e & hash[5]) ^ ((~e) & hash[6]))
            + k[i]
            + (w[i] = (i < 16) ? w[i] : (
                w[i - 16]
                + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                + w[i - 7]
                + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
              ) | 0);
          const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
            + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
          hash = [(temp1 + temp2) | 0].concat(hash);
          hash[4] = (hash[4] + temp1) | 0;
        }
        for (i = 0; i < 8; i++) hash[i] = (hash[i] + oldHash[i]) | 0;
      }
      for (i = 0; i < 8; i++) {
        for (j = 3; j + 1; j--) {
          const b = (hash[i] >> (j * 8)) & 255;
          result += ((b < 16) ? 0 : "") + b.toString(16);
        }
      }
      return result;
    }

    function getTeacherPasswordHash() {
      return (Argon.config && Argon.config.teacherPasswordHash)
        ? Argon.config.teacherPasswordHash
        : "0c86f6fcae03526fb40c2b75d792577c7bae7143b0d8f058e237f8cacfbd8b51";
    }

    function verifyTeacherPassword(inputPwd) {
      return sha256Hex(String(inputPwd || "").trim()) === getTeacherPasswordHash();
    }

    function setTeacherPassword(plainText) {
      if (Argon.config) {
        Argon.config.teacherPasswordHash = sha256Hex(String(plainText || "").trim());
        return true;
      }
      return false;
    }
    Argon.setTeacherPassword = setTeacherPassword;

    function setTeacherMode(active) {
      teacherModeActive = !!active;
      $("#teacherDrawer").hidden = !teacherModeActive;
      $("#teacherBtn").classList.toggle("unlocked", teacherModeActive);
      $("#teacherBtn").textContent = teacherModeActive ? "👩‍🏫 Teacher (Unlocked)" : "👩‍🏫 Teacher Mode";
      if (!teacherModeActive) {
        $("#teacherOut").hidden = true;
        $("#teacherOut").innerHTML = "";
      } else {
        renderTeacherNotes();
      }
    }

    function renderTeacherSolution() {
      if (!teacherModeActive) return;
      const lesson = LESSONS[cur];
      const out = $("#teacherOut");
      out.hidden = false;
      out.innerHTML = "";
      const title = document.createElement("b");
      title.textContent = `1. Canonical Solution (${lesson.title}):`;
      const pre = document.createElement("pre");
      pre.textContent = lesson.solution;
      const btn = document.createElement("button");
      btn.className = "t-act";
      btn.style.marginTop = "6px";
      btn.textContent = "📥 Insert Solution into Editor";
      btn.onclick = () => {
        exitStep();
        $("#code").value = lesson.solution;
        handleLiveCodeInput();
      };
      out.append(title, pre, btn);
    }

    function renderTeacherNotes() {
      if (!teacherModeActive) return;
      const lesson = LESSONS[cur];
      const out = $("#teacherOut");
      out.hidden = false;
      const mistakes = (lesson.commonMistakes || []).length
        ? `<br><b>Common Student Mistakes:</b> ${escapeHtml(lesson.commonMistakes.join(" · "))}`
        : "";
      out.innerHTML = `<b>2. Teaching Notes (${escapeHtml(lesson.concept)}):</b><br>${escapeHtml(lesson.teacherExplanation)}${mistakes}`;
    }

    function demonstrateStepExecution() {
      if (!teacherModeActive) return;
      const lesson = LESSONS[cur];
      exitStep();
      $("#code").value = lesson.solution;
      handleLiveCodeInput();
      run();
    }

    function renderExpectedTestResults() {
      if (!teacherModeActive) return;
      const lesson = LESSONS[cur];
      const out = $("#teacherOut");
      out.hidden = false;
      const rows = (lesson.tests || []).map((t, idx) => {
        const envStr = Object.entries(t.environment || {}).map(([k, v]) => `${k}=${formatPythonValue(v)}`).join(", ") || "(base)";
        return `<tr><td style="padding:4px 6px;border-bottom:1px solid #eee">Test ${idx + 1}</td><td style="padding:4px 6px;border-bottom:1px solid #eee">${escapeHtml(t.label || envStr)}</td><td style="padding:4px 6px;border-bottom:1px solid #eee"><code>${escapeHtml(envStr)}</code></td><td style="padding:4px 6px;border-bottom:1px solid #eee;font-weight:700;color:#16a34a">${escapeHtml(t.want)}()</td></tr>`;
      }).join("");
      out.innerHTML = `<b>4. Expected Test Results:</b><table style="width:100%;margin-top:6px;border-collapse:collapse;font-size:0.8rem"><tr style="background:#fef3c7;text-align:left"><th style="padding:4px 6px">#</th><th style="padding:4px 6px">Scenario</th><th style="padding:4px 6px">Sensors</th><th style="padding:4px 6px">Expected</th></tr>${rows}</table>`;
    }

function initTeacher() {
  const teacherBtn = $("#teacherBtn");
  const teacherModal = $("#teacherModal");
  const teacherPwdInput = $("#teacherPwdInput");
  const teacherAuthError = $("#teacherAuthError");
  const teacherAuthForm = $("#teacherAuthForm");
  const closeTeacherBtn = $("#closeTeacherBtn");

  if (teacherBtn) {
    teacherBtn.onclick = () => {
      if (teacherModeActive) {
        $("#teacherDrawer").hidden = !$("#teacherDrawer").hidden;
      } else {
        if (teacherPwdInput) teacherPwdInput.value = "";
        if (teacherAuthError) teacherAuthError.hidden = true;
        if (teacherModal) teacherModal.hidden = false;
        if (teacherPwdInput) teacherPwdInput.focus();
      }
    };
  }

  if (closeTeacherBtn) {
    closeTeacherBtn.onclick = () => { if (teacherModal) teacherModal.hidden = true; };
  }

  if (teacherAuthForm) {
    teacherAuthForm.onsubmit = () => {
      if (verifyTeacherPassword(teacherPwdInput.value)) {
        teacherModal.hidden = true;
        setTeacherMode(true);
      } else {
        if (teacherAuthError) teacherAuthError.hidden = false;
      }
      return false;
    };
  }

  if ($("#lockTeacherBtn")) $("#lockTeacherBtn").onclick = () => setTeacherMode(false);
  if ($("#tRevealBtn")) $("#tRevealBtn").onclick = renderTeacherSolution;
  if ($("#tNotesBtn")) $("#tNotesBtn").onclick = renderTeacherNotes;
  if ($("#tDemoBtn")) $("#tDemoBtn").onclick = demonstrateStepExecution;
  if ($("#tTestsBtn")) $("#tTestsBtn").onclick = renderExpectedTestResults;
  if ($("#tResetBtn")) $("#tResetBtn").onclick = () => { setTeacherMode(false); load(cur); };
}

Argon.sha256Hex = sha256Hex;
Argon.verifyTeacherPassword = verifyTeacherPassword;
Argon.setTeacherMode = setTeacherMode;
Argon.renderTeacherSolution = renderTeacherSolution;
Argon.renderTeacherNotes = renderTeacherNotes;
Argon.demonstrateStepExecution = demonstrateStepExecution;
Argon.renderExpectedTestResults = renderExpectedTestResults;
Argon.initTeacher = initTeacher;
