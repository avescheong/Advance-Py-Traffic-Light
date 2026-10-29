/**
 * Module 2: Smart Pedestrian & Sensor Safety (Example Extension Module)
 * Demonstrates how easily new curriculum modules can be added on top of existing ones.
 */
(function() {
  if (!window.Argon || !window.Argon.registerModule) return;

  Argon.registerModule({
    id: "smart-pedestrian",
    title: "?? Smart Pedestrian & Sensor Safety",
    description: "Learn advanced sensors, obstacle braking, and ultrasonic distance zones.",
    competencies: [
      { id: "crosswalk", title: "Crosswalk Scanner", desc: "Detecting pedestrians with path != 'clear'", levels: [0], badge: "?? Crosswalk Guard" },
      { id: "ultrasonic", title: "Ultrasonic Proximity", desc: "Stopping when distance <= 5 meters", levels: [1], badge: "?? Sonar Specialist" }
    ],
    lessons: [
      {
        id: 1,
        title: "Pedestrian Mission 1: Crosswalk Alert",
        storyProblem: "A pedestrian is crossing the street (path = 'busy'). Write an if statement to stop() if path == 'busy', else go()!",
        concept: "Crosswalk Path Checking",
        goalChecklist: [
          { label: "Check if path == 'busy'", test: code => /path\s*==\s*["']busy["']/.test(code) },
          { label: "Call stop()", test: code => /\bstop\s*\(\s*\)/.test(code) },
          { label: "Add else: and go()", test: code => /else\s*:/.test(code) && /\bgo\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The autonomous car must yield to people crossing the road.",
          knownInfo: "Sensor variable path indicates if a walker is on the zebra crossing.",
          pythonQuestion: "if path == \"busy\": stop() else: go()",
          whyPath: "Safety first! Pedestrians always have the right of way.",
          action: "stop() prevents accidents; go() continues when the path clears.",
          learned: "Sensors help your code react to unpredictable obstacles in the real world."
        },
        vocabulary: [
          { term: "path", meaning: "A sensor variable storing 'clear', 'busy', or 'blocked'." }
        ],
        hints: [
          "Concept Clue: Ask if path == \"busy\": then indent stop().",
          "Structure Guide:\nif path == \"busy\":\n    stop()\nelse:\n    go()",
          "Guided Correction: Write an if branch for 'busy', then else: with go()."
        ],
        starterCode: "# Protect the crosswalk!\nif path == \"busy\":\n    stop()\n",
        solution: "if path == \"busy\":\n    stop()\nelse:\n    go()",
        variables: ["path"],
        base: { path: "busy" },
        tests: [
          { environment: { path: "busy" }, want: "stop", label: 'path = "busy"' },
          { environment: { path: "clear" }, want: "go", label: 'path = "clear"' }
        ],
        teacherExplanation: "Emphasize conditional branching with strings and real-world safety logic.",
        commonMistakes: ["Forgetting else:", "Comparing path with numbers instead of 'busy'"],
        studentReflection: "I programmed an autonomous car to protect pedestrian lives!"
      }
    ]
  });
})();
