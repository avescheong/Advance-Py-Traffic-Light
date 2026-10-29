# 🚦 Argon Traffic Light Python — Pro Edition

Argon is an interactive educational learning simulator and cognitive Python environment designed to teach children and beginners autonomous vehicle programming, decision logic, and computer science concepts.

---

## 📁 Project Architecture & File Structure

The project has been refactored from a single monolithic HTML file into a clean, modular, and maintainable architecture with standalone CSS and JavaScript modules.

```
argon/
├── index.html                           # Primary application entry point
├── README.md                            # Complete architecture guide
├── HOW_TO_ADD_MODULES.md                # Step-by-step guide to adding new curriculum modules
│
├── css/                                 # Standalone Modular Stylesheets
│   ├── main.css                         # Master bundle stylesheet
│   ├── base.css                         # CSS variables, typography, reset, tactile 3D buttons
│   ├── layout.css                       # Top navbar, module selector, tabs, 2-column responsive grid
│   ├── editor.css                       # Mission story, Coach Pip, line gutter, code box, toolbar
│   ├── stage.css                        # 2.5D city scene, weather, traffic lights, car SVG, HUD, ruler
│   ├── brain-map.css                    # Live cognitive brain map flowchart, step tracer, test chips
│   └── modals.css                       # Badges journey modal, teacher mode drawer & authentication
│
└── js/                                  # Standalone Modular JavaScript Subsystems
    ├── core/
    │   └── state.js                     # Global state, DOM helpers ($), timing, format utilities
    ├── engine/
    │   ├── parser.js                    # Python tokenizer and AST parser (if/elif/else/indentation)
    │   └── interpreter.js               # AST execution tracer and expression evaluator
    ├── simulation/
    │   ├── scene.js                     # 2.5D city stage, weather modes, road ruler
    │   └── car.js                       # Autonomous car drive animation, headlights, LiDAR radar
    ├── ui/
    │   ├── editor.js                    # Code gutter, smart indentation (Tab/Enter), quick-insert keys
    │   ├── coach-pip.js                 # Robo-Coach Pip reactive feedback & animated facial cues
    │   ├── checklist.js                 # Live mission checklist auto-evaluator
    │   ├── brain-map.js                 # Real-time visual decision flowchart generator
    │   ├── reactions.js                 # Real-time typing graphics preview engine
    │   ├── badges.js                    # LocalStorage progress, competency badges, 6-step guide
    │   ├── teacher.js                   # SHA-256 protected teacher mode, pedagogical notes, test suites
    │   └── test-runner.js               # Test suite runner, step-by-step cognitive debugger, level loader
    ├── modules/                         # Extensible Curriculum Modules
    │   ├── module-registry.js           # Central Module Registry for managing multiple tracks
    │   ├── traffic-light/               # Module 1 (Default): Traffic Light & Autonomous Car
    │   │   ├── index.js                 # Registers Module 1
    │   │   └── lessons.js               # 16 complete missions data and competencies
    │   └── smart-pedestrian/            # Module 2 (Example): Smart Pedestrian & Sensor Safety
    │       └── index.js                 # Ready-to-use sample module
    └── app.js                           # Application lifecycle coordinator and bootstrap
```

---

## 🚀 How to Run

1. **Directly in Browser (No Server Required)**
   Double-click `index.html` in file explorer to open in Microsoft Edge, Google Chrome, Safari, or Firefox.
   Because scripts use clean standalone script tags rather than CORS-restricted local ES modules, it runs completely offline out-of-the-box!

2. **Using a Local Server (Optional)**
   ```bash
   python -m http.server 8000
   ```
   Then open `http://localhost:8000` in your web browser.

---

## 🧩 Key Architectural Features

### 1. Standalone, Component-Based CSS
Each visual layer has its own stylesheet with zero style pollution:
- **`css/base.css`**: Arcade color scheme, theme variables, tactile 3D push-button animations (`.btn-3d`).
- **`css/layout.css`**: Sticky navigation header, level selection tabs, progress tracker, and mobile responsive breakpoints.
- **`css/editor.css`**: Code editor with custom line number gutter, quick-insert Python syntax pills, and Robo-Coach Pip avatar.
- **`css/stage.css`**: 2.5D perspective city road, animated clouds, rain overlay, SVG traffic lights, Smart Car with active headlights and spinning roof LiDAR radar.
- **`css/brain-map.css`**: Live cognitive decision flowchart nodes, diamond conditions, branch connectors, and step execution tracer.
- **`css/modals.css`**: Student achievement badges modal and teacher dashboard drawer.

### 2. Standalone, Decoupled JavaScript Subsystems
- **No Monolith**: Each concern (parser, interpreter, simulation, UI, badges, teacher tools) is fully isolated in its own file under `js/`.
- **Global Namespace (`Argon`)**: Modules attach cleanly to `window.Argon` while maintaining convenient global hooks (`$`, `LV`, `LESSONS`, `cur`, `running`).
- **Reactive Typing**: As students type in the editor, `reactions.js` immediately updates the stage (e.g. typing `light = "red"` switches the traffic light to red; typing `if` activates LiDAR radar waves; typing `go()` revs the car engine).
- **Cognitive Brain Map**: `brain-map.js` parses the active code on keystrokes and draws a visual node-and-branch flowchart matching Python's decision branches.
- **Step-by-Step Tracer**: `test-runner.js` steps line-by-line through the AST, highlighting lines, updating variable values in real-time, and animating car actions.

### 3. Extensible Module Registry System
- Adding new curriculum tracks is completely modular.
- Every module has its own competencies, missions, test scenarios, starter code, and solutions.
- The `ModuleRegistry` automatically handles progress tracking per module and displays an arcade dropdown when multiple modules are registered.
- See [`HOW_TO_ADD_MODULES.md`](HOW_TO_ADD_MODULES.md) for full instructions and examples.
