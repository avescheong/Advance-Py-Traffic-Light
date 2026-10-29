# 🛠️ How to Add a New Module to Argon

Argon is built around an extensible **Module Registry** (`Argon.registerModule`). This design makes it trivial to add brand-new curriculum tracks, coding challenges, robotics topics, or game mechanics without editing the core engine.

---

## ⚡ Quick Start: 3 Steps to Add a New Module

### Step 1: Create Your Module Folder
Create a folder under `js/modules/` for your module, e.g.:
```
js/modules/smart-highway/
  ├── lessons.js   (optional if you want to keep lessons separate)
  └── index.js     (registers the module)
```

### Step 2: Define and Register Your Module
In your module's `index.js`, call `Argon.registerModule()`:

```javascript
/**
 * Module: Smart Highway & Cruise Control
 */
(function() {
  if (!window.Argon || !window.Argon.registerModule) return;

  Argon.registerModule({
    id: "smart-highway",
    title: "⚡ Smart Highway & Cruise Control",
    description: "Learn while loops, speed governors, and lane safety.",
    competencies: [
      {
        id: "speed_governor",
        title: "Speed Governor",
        desc: "Keeping car speed within speed_limit",
        levels: [0],
        badge: "🏎️ Speed Master"
      }
    ],
    lessons: [
      {
        id: 1,
        title: "Highway Mission 1: Respect the Speed Limit",
        storyProblem: "You are on the highway and speed = 80, but limit = 60. Write an if statement to slow() if speed > limit, else go()!",
        concept: "Comparison with Variables",
        goalChecklist: [
          { label: "Check if speed > limit", test: code => /speed\s*>\s*limit/.test(code) },
          { label: "Call slow()", test: code => /\bslow\s*\(\s*\)/.test(code) },
          { label: "Add else: and go()", test: code => /else\s*:/.test(code) && /\bgo\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The vehicle is travelling over the speed limit.",
          knownInfo: "Sensors report current speed and limit.",
          pythonQuestion: "if speed > limit: slow() else: go()",
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
          "Structure Guide:\nif speed > limit:\n    slow()\nelse:\n    go()",
          "Guided Correction: Write `if speed > limit:` followed by `slow()`, then `else:` with `go()`."
        ],
        starterCode: "# Control highway cruising:\nif speed > limit:\n    slow()\n",
        solution: "if speed > limit:\n    slow()\nelse:\n    go()",
        variables: ["speed", "limit"],
        base: { speed: 80, limit: 60 },
        tests: [
          { environment: { speed: 80, limit: 60 }, want: "slow", label: "speed = 80 (Fast)" },
          { environment: { speed: 50, limit: 60 }, want: "go", label: "speed = 50 (Safe)" }
        ],
        teacherExplanation: "Demonstrate comparing two numerical variables with dynamic values.",
        commonMistakes: ["Using hardcoded numbers instead of the variable limit"],
        studentReflection: "I programmed an automated cruise control speed governor!"
      }
    ]
  });
})();
```

### Step 3: Include the Script in `index.html`
In `index.html`, add the script tag in the **Curriculum Modules** section right before `app.js`:

```html
  <!-- 5. Curriculum Modules & Registry -->
  <script src="js/modules/module-registry.js"></script>
  <script src="js/modules/traffic-light/lessons.js"></script>
  <script src="js/modules/traffic-light/index.js"></script>

  <!-- Your New Module Here: -->
  <script src="js/modules/smart-highway/index.js"></script>

  <!-- 6. Application Lifecycle & Bootstrap -->
  <script src="js/app.js"></script>
```

---

## 🎯 What Happens Automatically?

1. **Module Selector Dropdown Appears**:
   When Argon detects 2 or more registered modules, it automatically displays a stylish **Module Selector** in the top navigation bar (`#moduleSelect`).
   Students or teachers can switch tracks with 1 click!

2. **Scoped LocalStorage Progress**:
   Progress is automatically isolated to each module using the key `argon_progress_<module_id>`. Completing missions in one module preserves progress in others.

3. **Dynamic Level Tabs**:
   The level tabs bar (`#tabs`) automatically repopulates with the selected module's mission count and sandbox challenge.

4. **Dedicated Badge Journeys**:
   The **My Python Badges** modal (`#journeyBtn`) dynamically renders only the competencies and badges defined for the active module.

---

## 📋 Complete Lesson Schema Reference

Each object in the `lessons` array supports the following fields:

| Field | Type | Description |
|---|---|---|
| `id` | `number` | Unique mission number within this module (1, 2, 3...) |
| `title` | `string` | Display title shown in level tab tooltip and mission header |
| `storyProblem` | `string` | Real-world problem statement for the student |
| `concept` | `string` | Pedagogical concept tag (e.g. `"Variable Assignment"`) |
| `goalChecklist` | `Array<{label, test}>` | Auto-checking goals that tick off in real-time as student types |
| `learnFirst` | `Object` | 6-step interactive guide (`problem`, `knownInfo`, `pythonQuestion`, `whyPath`, `action`, `learned`) |
| `vocabulary` | `Array<{term, meaning}>` | Interactive vocabulary chips students can tap for explanations |
| `hints` | `string[3]` | Tiered hints: Hint 1 (Clue), Hint 2 (Code Pattern), Hint 3 (Fix) |
| `starterCode` | `string` | Initial code loaded in the editor |
| `solution` | `string` | Teacher solution and auto-completion target |
| `variables` | `string[]` | Sensor variable names permitted in this mission |
| `base` | `Object` | Base environment dictionary (e.g. `{ light: "green" }`) |
| `tests` | `Array<{environment, want, label}>` | Test suite scenarios to verify student code correctness |
| `teacherExplanation` | `string` | Pedagogical notes visible only in Teacher Mode |
| `commonMistakes` | `string[]` | Common beginner pitfalls highlighted in Teacher Mode |
| `studentReflection` | `string` | Encouraging reflection shown upon passing all scenarios |
| `free` | `boolean` | Set `true` for open-ended sandbox playgrounds (optional) |

---

## 🎮 Included Example: Smart Pedestrian Module
A fully functional example module is already included in `js/modules/smart-pedestrian/index.js`.
To enable it, simply uncomment the `<script src="js/modules/smart-pedestrian/index.js"></script>` tag in `index.html`!
