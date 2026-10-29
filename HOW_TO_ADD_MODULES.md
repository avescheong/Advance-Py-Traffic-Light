# 🛠️ How to Add and Customize Modules in Argon

Argon is designed from the ground up to be **completely modular and non-hardcoded**. You can add new curriculum tracks, coding challenges, custom sensor variables, and vehicle/robotics actions without touching any core engine code.

---

## ⚡ Quick Start: 3 Steps to Add a New Module

### Step 1: Create Your Module Folder
Create a dedicated folder under `js/modules/` for your module, for example:
```
js/modules/smart-highway/
  ├── lessons.js   (optional: keep lesson data clean)
  └── index.js     (registers the module)
```

### Step 2: Define and Register Your Module
In your `index.js`, register your module with `Argon.registerModule()`:

```javascript
/**
 * Module: Smart Highway & Cruise Control
 */
(function() {
  if (!window.Argon || !window.Argon.registerModule) return;

  // Optional: Register custom action commands for this module!
  Argon.registerAction({
    name: "boost",
    icon: "🚀",
    description: "The vehicle activates highway turbo boost!",
    handler: async ({ car, bubble, sleep, getSimSpeedMultiplier }) => {
      car.classList.add("driving");
      car.style.transition = `left ${0.4 * getSimSpeedMultiplier()}s ease-in`;
      car.style.left = "460px";
      bubble.textContent = "🚀 TURBO BOOST!";
      await sleep(600);
      car.classList.remove("driving");
    }
  });

  Argon.registerModule({
    id: "smart-highway",
    title: "⚡ Smart Highway & Cruise Control",
    description: "Learn speed governors, threshold comparisons, and highway safety.",
    competencies: [
      {
        id: "speed_governor",
        title: "Speed Governor",
        desc: "Keeping vehicle speed safely below speed_limit",
        levels: [0],
        badge: "🏎️ Speed Master"
      }
    ],
    lessons: [
      Argon.createLesson({
        id: 1,
        title: "Highway Mission 1: Respect the Speed Limit",
        storyProblem: "You are on the highway and speed = 80, but limit = 60. Write an if statement to slow() if speed > limit, else boost()!",
        concept: "Comparison with Variables",
        goalChecklist: [
          { label: "Check if speed > limit", test: code => /speed\s*>\s*limit/.test(code) },
          { label: "Call slow()", test: code => /\bslow\s*\(\s*\)/.test(code) },
          { label: "Add else: and boost()", test: code => /else\s*:/.test(code) && /\bboost\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The vehicle is travelling over the speed limit.",
          knownInfo: "Sensors report current speed and limit.",
          pythonQuestion: "if speed > limit: slow() else: boost()",
          whyPath: "Driving within speed limits prevents highway collisions.",
          action: "slow() drops vehicle velocity to safe cruising levels.",
          learned: "Variables can be compared with other variables using >."
        },
        vocabulary: [
          { term: "limit", meaning: "A variable storing the highway speed ceiling." },
          { term: ">", meaning: "Greater-than operator. Returns True if left is bigger than right." }
        ],
        hints: [
          "Concept Clue: Compare speed > limit in your if question.",
          "Structure Guide:\nif speed > limit:\n    slow()\nelse:\n    boost()",
          "Guided Correction: Write `if speed > limit:` followed by `slow()`, then `else:` with `boost()`."
        ],
        starterCode: "# Control highway cruising:\nif speed > limit:\n    slow()\n",
        solution: "if speed > limit:\n    slow()\nelse:\n    boost()",
        variables: ["speed", "limit"],
        base: { speed: 80, limit: 60 },
        tests: [
          { environment: { speed: 80, limit: 60 }, want: "slow", label: "speed = 80 (Over limit)" },
          { environment: { speed: 50, limit: 60 }, want: "boost", label: "speed = 50 (Safe to boost)" }
        ],
        teacherExplanation: "Demonstrate comparing two numerical variables with dynamic values.",
        commonMistakes: ["Using hardcoded numbers instead of the variable limit"],
        studentReflection: "I programmed an automated cruise control speed governor!"
      })
    ]
  });
})();
```

### Step 3: Include Your Module Script in `index.html`
Add one line to [`index.html`](file:///c:/Users/Asus/Desktop/argon/index.html) under the **Curriculum Modules** section:

```html
  <!-- 5. Curriculum Modules & Registry -->
  <script src="js/modules/module-registry.js"></script>
  <script src="js/modules/traffic-light/lessons.js"></script>
  <script src="js/modules/traffic-light/index.js"></script>

  <!-- Your New Module: -->
  <script src="js/modules/smart-highway/index.js"></script>
```

---

## 🎯 What Happens Automatically? (Zero Boilerplate)

1. **Automatic Module Switcher**:
   When 2 or more modules are registered, Argon automatically displays the **Module Selector** (`#moduleSelect`) in the navigation bar.

2. **Dynamic Quick Blocks Toolbar (`#keys`)**:
   Action command pills (e.g. `boost()`, `go()`, `stop()`) are generated dynamically based on registered actions.

3. **Dynamic Brain Map**:
   Custom commands appear in the Live Cognitive Flowchart with their registered emoji icons.

4. **Dynamic Python Parser**:
   The Python mini-interpreter dynamically validates all registered action commands without any hardcoded command lists.

5. **Live Keystroke Previews**:
   The reactive engine dynamically parses any variable assignment (e.g. `speed = 70`, `limit = 60`, `obstacle = True`) and updates the scene in real time.

6. **Scoped Progress Tracking**:
   LocalStorage progress is automatically isolated to each module using `argon_progress_<module_id>`.

---

## 🔧 Extensibility APIs Reference

### 1. `Argon.registerAction(def)`
Register a custom vehicle, drone, or robotics action:
```javascript
Argon.registerAction({
  name: "horn",              // Function name: horn()
  icon: "📢",               // Emoji displayed in flowchart & feedback
  description: "Sounds warning horn at pedestrians 📢",
  handler: async ({ car, bubble, sleep }) => {
    bubble.textContent = "📢 BEEP BEEP!";
    await sleep(500);
  }
});
```

### 2. `Argon.registerSensorHandler(name, handlerFn)`
Register a visual scene reaction for a new sensor variable:
```javascript
Argon.registerSensorHandler("battery", (val, env) => {
  const icon = val < 20 ? "🪫" : "🔋";
  // update UI element or badge
});
```

### 3. `Argon.setTeacherPassword(plainTextPassword)`
Change the teacher password at runtime without calculating SHA-256 hashes manually:
```javascript
Argon.setTeacherPassword("superTeacher2026");
```

### 4. `Argon.config`
Centralized application settings in [`js/core/config.js`](file:///c:/Users/Asus/Desktop/argon/js/core/config.js):
- `defaultModuleId`: ID of the initial module to load.
- `storagePrefix`: LocalStorage key prefix (`"argon_progress_"`).
- `timings`: Step delays and auto-play speeds.
- `teacherPasswordHash`: SHA-256 hash of teacher unlock key.

### 5. `Argon.createLesson(options)`
Helper utility with sensible defaults for any optional fields:
- `id`: Unique mission number.
- `title`: Mission display title.
- `storyProblem`: Problem statement.
- `concept`: Pedagogical concept tag.
- `starterCode`: Initial code loaded in editor.
- `solution`: Canonical teacher solution.
- `variables`: Permitted sensor variable names.
- `base`: Base environment dictionary.
- `tests`: Array of test scenarios `{ environment, want, label }`.
- `defaultAction`: Default fallback action (defaults to `"go"`).
- `requireExplicitAction`: Set `false` for introductory lessons where car can drive by default.
- `free`: Set `true` for open-ended sandbox playgrounds.
