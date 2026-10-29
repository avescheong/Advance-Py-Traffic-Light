# 🚦 Argon Traffic Light Python — Pro Edition

Argon is an interactive educational learning simulator and cognitive Python environment designed to teach children and beginners autonomous vehicle programming, decision logic, and computer science concepts.

---

## 📁 Modular Architecture & File Structure

The project is built on a clean, modular, and maintainable architecture with standalone CSS and JavaScript modules—**zero hardcoded assumptions**.

```
argon/
├── index.html                           # Primary clean entry point
├── README.md                            # Complete architecture guide
├── HOW_TO_ADD_MODULES.md                # Guide to adding future modules & custom sensors/actions
│
├── css/                                 # Standalone Component Stylesheets
│   ├── main.css                         # Master stylesheet aggregator
│   ├── base.css                         # Variables, typography, reset, tactile 3D buttons
│   ├── layout.css                       # Top navbar, module selector, tabs, 2-column responsive grid
│   ├── editor.css                       # Mission story, line gutter, code editor, syntax toolbar
│   ├── stage.css                        # 2.5D city scene, weather, traffic lights, car SVG, HUD, ruler
│   ├── brain-map.css                    # Cognitive brain map flowchart, step tracer, test chips
│   └── modals.css                       # Badges journey modal, teacher mode drawer & authentication
│
└── js/                                  # Standalone JavaScript Subsystems
    ├── core/
    │   ├── config.js                    # Centralized settings (teacher password, timings, storage keys)
    │   ├── actions.js                   # Dynamic Action Registry (go, stop, slow, crawl + custom commands)
    │   └── state.js                     # Runtime reactive state, DOM helpers ($), timing & formatters
    ├── engine/
    │   ├── parser.js                    # Python tokenizer & AST parser (dynamic action validation)
    │   └── interpreter.js               # AST execution tracer & condition evaluator
    ├── simulation/
    │   ├── scene.js                     # 2.5D city scene & extensible Sensor Registry
    │   └── car.js                       # Autonomous car motion controller & dynamic action animations
    ├── ui/
    │   ├── editor.js                    # Code gutter, smart indentation, dynamic quick-insert syntax toolbar
    │   ├── coach-pip.js                 # Robo-Coach Pip reactive feedback & animated SVG cues
    │   ├── checklist.js                 # Live mission checklist auto-evaluator
    │   ├── brain-map.js                 # Real-time visual decision flowchart with registered action icons
    │   ├── reactions.js                 # Dynamic real-time keystroke variable & action preview engine
    │   ├── badges.js                    # LocalStorage progress, competency badges, 6-step guide
    │   ├── teacher.js                   # Configurable teacher authentication, pedagogical notes, solutions
    │   └── test-runner.js               # Test suite runner, step debugger, configurable default actions
    ├── modules/                         # Extensible Curriculum Tracks
    │   ├── module-registry.js           # Central Module Registry & createLesson helper
    │   ├── traffic-light/               # Module 1 (Default): Traffic Light & Autonomous Car
    │   │   ├── index.js                 # Module 1 registration
    │   │   └── lessons.js               # 16 complete missions data and competencies
    │   └── smart-pedestrian/            # Module 2 (Example): Smart Pedestrian & Sensor Safety
    │       └── index.js                 # Ready-to-use sample module
    └── app.js                           # Application lifecycle coordinator and bootstrap
```

---

## 🚀 How to Run

1. **Directly in Browser (No Server Required)**
   Double-click [`index.html`](index.html) in file explorer to open in Microsoft Edge, Google Chrome, Safari, or Firefox.
   It runs completely offline out-of-the-box!

2. **Using a Local Server (Optional)**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## 🧩 Modularity & Future-Proofing Design

### 1. Dynamic Action Registry (`Argon.registerAction`)
Action commands are no longer hardcoded into regexes. Modules can register new actions (e.g. `horn()`, `boost()`, `turn_left()`) complete with:
- Custom visual emoji icon (rendered in flowchart and feedback).
- Custom animation handler.
- Automatic recognition in Python parser, Coach Pip, and Brain Map.
- Automatic inclusion in the Quick Blocks toolbar (`#keys`).

### 2. Extensible Sensor Registry (`Argon.registerSensorHandler`)
Sensor variables (e.g. `light`, `speed`, `distance`, `path`, `weather`, `battery`) are decoupled from the scene renderer. Any new sensor can register visual reaction handlers with `Argon.registerSensorHandler(name, fn)`.

### 3. Dynamic Quick-Insert Toolbar
The `#keys` toolbar is dynamically built at runtime. It presents standard Python syntax keys, the module's registered command functions, and any custom snippets defined by the mission.

### 4. Dynamic Live Typing Engine
The reactive typing engine dynamically scans for any typed variable assignment (`varName = value`), updates the scene environment, and previews any registered action in real time before "Run" is clicked.

### 5. Configurable Settings (`Argon.config`)
All global parameters (default module, teacher password, storage prefix, animation timings) are isolated in [`js/core/config.js`](js/core/config.js) and can be modified at runtime via clean methods like `Argon.setTeacherPassword()`.

### 6. Central Module Registry (`Argon.registerModule`)
Curriculum tracks register dynamically. When multiple modules are detected, Argon automatically renders an arcade module switcher dropdown in the header, scopes student progress per module, and adapts level tabs seamlessly.
