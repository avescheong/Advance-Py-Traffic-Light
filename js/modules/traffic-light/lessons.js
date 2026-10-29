/**
 * Module 1: Traffic Light & Autonomous Car - Lessons & Competencies Data
 */
window.Argon = window.Argon || {};

    Argon.TRAFFIC_LIGHT_COMPETENCIES = [
      { id: "commands", title: "Commands", desc: "Calling car actions like go() and stop()", levels: [0], badge: "🚗 Ignition Starter" },
      { id: "variables", title: "Variables", desc: "Saving values inside memory boxes with =", levels: [1], badge: "📦 Memory Keeper" },
      { id: "if_eq", title: "if / ==", desc: "Asking True/False equality questions", levels: [2], badge: "🚦 Signal Reader" },
      { id: "else_elif", title: "else / elif", desc: "Choosing between two or three road branches", levels: [3, 4], badge: "🔀 Fork Navigator" },
      { id: "comparisons", title: "Comparisons", desc: "Checking !=, >, <, <=, ranges, and nested if", levels: [5, 6, 7, 8, 9, 10], badge: "📏 Safety Ranger" },
      { id: "and_or", title: "and / or", desc: "Joining two questions together", levels: [11, 12], badge: "🤝 Logic Linker" },
      { id: "booleans", title: "Boolean Logic", desc: "Using True, False, not, and combined rules", levels: [13, 14], badge: "🧠 Autopilot Master" }
    ];


    Argon.TRAFFIC_LIGHT_LESSONS = [
      {
        id: 1,
        title: "Mission 1: Start the Engine!",
        storyProblem: "Welcome, Junior Engineer! Your Smart Car is waiting at a green light, but its code says stop(). Change stop() to go() so the car drives forward!",
        concept: "Calling a Command Function",
        goalChecklist: [
          { label: "Type the go command", test: code => /\bgo\b/.test(code) },
          { label: "Add round brackets ()", test: code => /\bgo\s*\(\s*\)/.test(code) },
          { label: "Remove stop()", test: code => !/\bstop\s*\(\s*\)/.test(code) && /\bgo\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The car is stopped at the green light and waiting for your command to drive.",
          knownInfo: "The road ahead is open and light = \"green\".",
          pythonQuestion: "No question needed yet! We just tell Python which action command to run.",
          whyPath: "Python runs your command from top to bottom.",
          action: "Calling go() starts the motor and drives the car through the green light.",
          learned: "A command with brackets () tells the car to do an action right away!"
        },
        vocabulary: [
          { term: "go()", meaning: "A car command that tells the car to drive forward." },
          { term: "()", meaning: "Round brackets tell Python to run the command right now." }
        ],
        hints: [
          "Concept Clue: Look at the green command button below the code box—go() makes the car drive on!",
          "Structure Guide:\ngo()",
          "Guided Correction: Delete stop() on line 2 and type go() with round brackets ()."
        ],
        starterCode: "# Change stop() to go() below:\nstop()",
        solution: "go()",
        variables: ["light"],
        base: { light: "green" },
        tests: [
          { environment: { light: "green" }, want: "go", label: 'light = "green"' }
        ],
        teacherExplanation: "Introduce students to functions as actionable commands. Emphasize that parentheses () are required so Python knows to execute the command.",
        commonMistakes: ["Typing go without brackets ()", "Leaving stop() instead of changing it to go()"],
        studentReflection: "I can give the car a direct instruction using a command and brackets ()."
      },

      {
        id: 2,
        title: "Mission 2: The Memory Box =",
        storyProblem: "Variables are memory boxes that store information! The light just turned red. On line 2, type light = \"red\" using one = to save \"red\" before the if check.",
        concept: "Variable Assignment with =",
        goalChecklist: [
          { label: "Write variable name light", test: code => /^\s*light\b/m.test(code) },
          { label: "Use one = to save", test: code => /^\s*light\s*=\s*[^=]/m.test(code) },
          { label: "Save \"red\" in quotes", test: code => /^\s*light\s*=\s*["']red["']/m.test(code) }
        ],
        learnFirst: {
          problem: "The traffic light turned red, so we need to update the car's light memory box to \"red\".",
          knownInfo: "The variable box is named light. We want to store the word \"red\" inside it.",
          pythonQuestion: "First we save light = \"red\" with one =. Then Python asks: Is light == \"red\"?",
          whyPath: "Because we saved \"red\" into light, light == \"red\" becomes True!",
          action: "Python overrides the old sensor value and runs stop() to brake safely.",
          learned: "One = saves a value inside a memory box. Quote marks \"\" wrap text words."
        },
        vocabulary: [
          { term: "=", meaning: "One equal sign saves a new value inside a memory box (variable)." },
          { term: "\"red\"", meaning: "Quote marks tell Python this is a text word, not a variable name." }
        ],
        hints: [
          "Concept Clue: Use one = to put the word \"red\" inside the light memory box before the if line.",
          "Structure Guide:\nlight = \"___\"\nif light == \"red\":\n    stop()\nelse:\n    go()",
          "Guided Correction: On line 2 (above if), type light = \"red\" with quote marks around red."
        ],
        starterCode: '# Add light = "red" on line 2:\n\nif light == "red":\n    stop()\nelse:\n    go()',
        solution: 'light = "red"\nif light == "red":\n    stop()\nelse:\n    go()',
        variables: ["light"],
        base: { light: "green" },
        tests: [
          { environment: {}, want: "stop", label: 'base green overridden to "red"' },
          { environment: { light: "green" }, want: "stop", label: 'sensor light = "green" overridden to "red"' }
        ],
        teacherExplanation: "Clarify the difference between = and ==: one equal sign = stores data into a variable, while two == asks a question.",
        commonMistakes: ["Using == instead of = when saving a value", "Forgetting quote marks around \"red\""],
        studentReflection: "I know that one = saves a new value inside a memory box and replaces the old value."
      },

      {
        id: 3,
        title: "Mission 3: Ask a Question with if",
        storyProblem: "Now the traffic light changes by itself! Replace go() with an if question: when light == \"red\":, indent and call stop().",
        concept: "Decisions with if and ==",
        goalChecklist: [
          { label: "Ask if light == \"red\":", test: code => /if\s+light\s*==\s*["']red["']\s*:/.test(code) },
          { label: "End question with colon :", test: code => /if\s+.*:/.test(code) },
          { label: "Indent stop() underneath", test: code => /\n\s{2,}stop\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The car must brake when the light is red, and only drive on when it is green.",
          knownInfo: "The road sensor gives us the variable light (\"red\" or \"green\").",
          pythonQuestion: "Is light == \"red\"? (Are these two values the exact same?)",
          whyPath: "When light is \"red\", the answer is True, so Python runs the indented line inside if.",
          action: "If True, Python runs stop(). If False, Python skips stop().",
          learned: "Use if and == with a colon : to ask a question, and press Tab to indent the action."
        },
        vocabulary: [
          { term: "if", meaning: "Asks Python a True or False question before deciding what to do." },
          { term: "==", meaning: "Two equal signs ask: 'Are these two values the exact same?'" },
          { term: ":", meaning: "A colon ends the question line and means: 'Here comes the action!'" }
        ],
        hints: [
          "Concept Clue: Ask Python if light is equal to \"red\" using ==, then indent stop().",
          "Structure Guide:\nif light == \"___\":\n    ___()",
          "Guided Correction: Write if light == \"red\": on line 2, press Enter, and write stop() indented with spaces."
        ],
        starterCode: "# Ask if light is \"red\", then stop():\ngo()",
        solution: 'if light == "red":\n    stop()',
        variables: ["light"],
        tests: [
          { environment: { light: "red" }, want: "stop", label: 'light = "red"' },
          { environment: { light: "green" }, want: "go", label: 'light = "green"' }
        ],
        teacherExplanation: "Explain indentation as 'belonging'. The indented line only runs IF the question above it is True.",
        commonMistakes: ["Using one = instead of two ==", "Forgetting the colon : at the end of the if line", "Forgetting to indent stop() with Tab"],
        studentReflection: "I can ask Python a question with if and ==, and indent the action underneath."
      },

      {
        id: 4,
        title: "Mission 4: Two Roads with else",
        storyProblem: "Smart cars never guess! Add an else: branch to your code so when the light is NOT red, the car explicitly runs go().",
        concept: "Two-Way Branching with else",
        goalChecklist: [
          { label: "Keep if light == \"red\": stop()", test: code => /if\s+light\s*==\s*["']red["']\s*:\s*\n\s+stop\(\)/.test(code) },
          { label: "Add else: on a new line", test: code => /^else\s*:/m.test(code) },
          { label: "Indent go() under else:", test: code => /else\s*:\s*\n\s+go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "Our code knows when to stop(), but we need a clear rule for what to do when the light is not red.",
          knownInfo: "The light variable can be \"red\" or \"green\".",
          pythonQuestion: "Is light == \"red\"?",
          whyPath: "If True, Python runs stop(). If False, Python jumps to else: and runs go().",
          action: "The car brakes on red and drives forward on green.",
          learned: "else: means 'for everything else!' It never asks a question of its own."
        },
        vocabulary: [
          { term: "else:", meaning: "Runs when the if question above was False. Written as else: with no question." }
        ],
        hints: [
          "Concept Clue: Add else: at the start of a new line, then indent go() underneath it.",
          "Structure Guide:\nif light == \"red\":\n    stop()\n___:\n    ___()",
          "Guided Correction: Below stop(), write else: (lined up with if), press Enter, and indent go()."
        ],
        starterCode: 'if light == "red":\n    stop()',
        solution: 'if light == "red":\n    stop()\nelse:\n    go()',
        variables: ["light"],
        tests: [
          { environment: { light: "red" }, want: "stop", label: 'light = "red"' },
          { environment: { light: "green" }, want: "go", label: 'light = "green"' },
          { environment: { light: "red" }, want: "stop", label: 'light = "red"' }
        ],
        teacherExplanation: "Emphasize that else: has no condition attached to it. It is the universal fallback branch whenever the if condition is False.",
        commonMistakes: ["Writing a question after else (like else light == \"green\":)", "Indenting else: instead of lining it up with if"],
        studentReflection: "I understand that else: tells Python what to do when the if question is False."
      },

      {
        id: 5,
        title: "Mission 5: Three Colors with elif",
        storyProblem: "Traffic lights have 3 colors! Insert an elif branch between if and else so when light == \"yellow\":, the car calls slow().",
        concept: "Multi-Way Branching with elif",
        goalChecklist: [
          { label: "Use elif light == \"yellow\":", test: code => /elif\s+light\s*==\s*["']yellow["']\s*:/.test(code) },
          { label: "Indent slow() under elif", test: code => /elif\s+light\s*==\s*["']yellow["']\s*:\s*\n\s+slow\s*\(\s*\)/.test(code) },
          { label: "Keep else: go() at the end", test: code => /else\s*:\s*\n\s+go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "A yellow light means slow down, then stop—we need a middle choice between red and green!",
          knownInfo: "The light variable can be \"red\", \"yellow\", or \"green\".",
          pythonQuestion: "1st: Is light == \"red\"? 2nd (elif): Is light == \"yellow\"?",
          whyPath: "Python checks from top to bottom and picks the very first branch that is True.",
          action: "Red runs stop(), yellow runs slow(), and green falls through to else: go().",
          learned: "elif means 'else if'—it asks a second question only when the first question was False."
        },
        vocabulary: [
          { term: "elif", meaning: "Short for 'else if'. Asks a new question when earlier questions were False." },
          { term: "slow()", meaning: "Car command: slows the car down gently, then stops at the line." }
        ],
        hints: [
          "Concept Clue: Use elif to ask if light == \"yellow\": before the else: line.",
          "Structure Guide:\nif light == \"red\":\n    stop()\nelif light == \"___\":\n    ___()\nelse:\n    go()",
          "Guided Correction: Between stop() and else:, add elif light == \"yellow\": and indent slow() underneath."
        ],
        starterCode: 'if light == "red":\n    stop()\nelse:\n    go()',
        solution: 'if light == "red":\n    stop()\nelif light == "yellow":\n    slow()\nelse:\n    go()',
        variables: ["light"],
        tests: [
          { environment: { light: "red" }, want: "stop", label: 'light = "red"' },
          { environment: { light: "yellow" }, want: "slow", label: 'light = "yellow"' },
          { environment: { light: "green" }, want: "go", label: 'light = "green"' }
        ],
        teacherExplanation: "Explain the top-to-bottom chain: once one branch is True, Python runs that block and skips the rest of the ladder.",
        commonMistakes: ["Writing 'else if' as two words instead of elif", "Placing elif after else:"],
        studentReflection: "I can check three or more possibilities in order using if, elif, and else."
      },

      {
        id: 6,
        title: "Mission 6: Watch the Crosswalk !=",
        storyProblem: "Walkers 🚶 and road cones 🚧 can block the crosswalk! Change the if line to use != so if path != \"clear\":, the car calls stop().",
        concept: "Not Equal Operator (!=)",
        goalChecklist: [
          { label: "Use != (not equal)", test: code => /!=/.test(code) },
          { label: "Check if path != \"clear\":", test: code => /if\s+path\s*!=\s*["']clear["']\s*:/.test(code) },
          { label: "Keep stop() and else: go()", test: code => /stop\s*\(\s*\)/.test(code) && /go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "The road might be \"busy\" with walkers 🚶 or \"blocked\" by cones 🚧. We can only drive when it is \"clear\".",
          knownInfo: "The path variable can be \"clear\", \"busy\", or \"blocked\".",
          pythonQuestion: "Is path != \"clear\"? (Is the path different from \"clear\"?)",
          whyPath: "When path is \"busy\" or \"blocked\", path != \"clear\" is True, so the car brakes!",
          action: "Calls stop() for any hazard on the crosswalk; calls go() only when clear.",
          learned: "!= means 'is NOT equal to'. It is True whenever two values are different."
        },
        vocabulary: [
          { term: "!=", meaning: "Asks Python: 'Are these two values different (NOT equal)?'" }
        ],
        hints: [
          "Concept Clue: Use != to ask if path is not equal to \"clear\".",
          "Structure Guide:\nif path != \"___\":\n    stop()\nelse:\n    go()",
          "Guided Correction: Replace path == \"busy\" on line 2 with path != \"clear\"."
        ],
        starterCode: '# Use != so any path that is NOT "clear" stops:\nif path == "busy":\n    stop()\nelse:\n    go()',
        solution: 'if path != "clear":\n    stop()\nelse:\n    go()',
        variables: ["path"],
        base: { light: "green" },
        tests: [
          { environment: { path: "clear" }, want: "go", label: 'path = "clear"' },
          { environment: { path: "busy" }, want: "stop", label: 'path = "busy"' },
          { environment: { path: "blocked" }, want: "stop", label: 'path = "blocked"' },
          { environment: { path: "clear" }, want: "go", label: 'path = "clear"' }
        ],
        teacherExplanation: "Help students see why != is powerful: instead of writing separate checks for 'busy' and 'blocked', one check handles every hazard.",
        commonMistakes: ["Writing =! instead of !=", "Putting a space between ! and ="],
        studentReflection: "I know that != checks whether two values are different."
      },

      {
        id: 7,
        title: "Mission 7: Speed Limit with >",
        storyProblem: "The speed limit is 50 km/h! Look at the Speedometer HUD. Write an if/else rule: if speed > 50:, call crawl(); otherwise else: call go().",
        concept: "Greater Than Operator (>)",
        goalChecklist: [
          { label: "Ask if speed > 50:", test: code => /if\s+speed\s*>\s*50\s*:/.test(code) },
          { label: "Indent crawl() under if", test: code => /if\s+speed\s*>\s*50\s*:\s*\n\s+crawl\s*\(\s*\)/.test(code) },
          { label: "Add else: go()", test: code => /else\s*:\s*\n\s+go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "When our speed goes over 50 km/h, the car is going too fast and must slow down to crawl().",
          knownInfo: "The speedometer gives us speed as a number (like 30, 50, or 80).",
          pythonQuestion: "Is speed > 50? (Is the speed number bigger than 50?)",
          whyPath: "80 > 50 is True so Python calls crawl(). 30 > 50 and 50 > 50 are False so Python calls go().",
          action: "Slows to turtle mode (crawl()) when over 50; drives normally (go()) at 50 or below.",
          learned: "Use > to check if a number is greater than another. Numbers never use quote marks!"
        },
        vocabulary: [
          { term: ">", meaning: "Greater than. Checks if the left number is bigger than the right number." },
          { term: "crawl()", meaning: "Car command: drives forward very slowly (turtle mode)." }
        ],
        hints: [
          "Concept Clue: Ask Python if the speed is greater than 50 using >.",
          "Structure Guide:\nif speed > ___:\n    ___()\nelse:\n    go()",
          "Guided Correction: Write if speed > 50: (no quotes around 50), indent crawl(), then add else: and indent go()."
        ],
        starterCode: "# If speed > 50, crawl()! Otherwise go():\ngo()",
        solution: 'if speed > 50:\n    crawl()\nelse:\n    go()',
        variables: ["speed"],
        base: { light: "green" },
        tests: [
          { environment: { speed: 30 }, want: "go", label: "speed = 30" },
          { environment: { speed: 80 }, want: "crawl", label: "speed = 80" },
          { environment: { speed: 51 }, want: "crawl", label: "speed = 51" },
          { environment: { speed: 50 }, want: "go", label: "speed = 50 (at limit)" }
        ],
        teacherExplanation: "Point out that numbers are mathematical values and must not be wrapped in quotes. Also highlight that 50 > 50 is False.",
        commonMistakes: ["Putting quotes around the number: \"50\"", "Confusing > (greater than) with < (less than)"],
        studentReflection: "I can compare numbers using > without putting quote marks around numbers."
      },

      {
        id: 8,
        title: "Mission 8: Too Close! Using <",
        storyProblem: "Check the Laser Distance Ruler below the road! distance is how many meters we are behind the car ahead. If distance < 5:, call stop(); otherwise call go().",
        concept: "Less Than Operator (<)",
        goalChecklist: [
          { label: "Ask if distance < 5:", test: code => /if\s+distance\s*<\s*5\s*:/.test(code) },
          { label: "Indent stop() under if", test: code => /if\s+distance\s*<\s*5\s*:\s*\n\s+stop\s*\(\s*\)/.test(code) },
          { label: "Add else: go()", test: code => /else\s*:\s*\n\s+go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "If our car gets closer than 5 meters to the car ahead, we must brake immediately!",
          knownInfo: "The road ruler sensor gives us distance in meters.",
          pythonQuestion: "Is distance < 5? (Is the distance number smaller than 5?)",
          whyPath: "2 < 5 and 4 < 5 are True -> stop(). 20 < 5 and 5 < 5 are False -> go().",
          action: "Brakes with stop() when closer than 5 meters; drives on with go() when 5 meters or farther.",
          learned: "< checks if the left number is smaller than the right number."
        },
        vocabulary: [
          { term: "<", meaning: "Less than. The pointy tip points to the smaller number!" }
        ],
        hints: [
          "Concept Clue: Ask Python if distance is less than 5 using <.",
          "Structure Guide:\nif distance < ___:\n    ___()\nelse:\n    go()",
          "Guided Correction: Write if distance < 5:, indent stop(), and under else: indent go()."
        ],
        starterCode: "# If distance < 5, stop()! Otherwise go():\ngo()",
        solution: 'if distance < 5:\n    stop()\nelse:\n    go()',
        variables: ["distance"],
        base: { light: "green" },
        tests: [
          { environment: { distance: 2 }, want: "stop", label: "distance = 2 m" },
          { environment: { distance: 20 }, want: "go", label: "distance = 20 m" },
          { environment: { distance: 4 }, want: "stop", label: "distance = 4 m" },
          { environment: { distance: 5 }, want: "go", label: "distance = 5 m" }
        ],
        teacherExplanation: "Remind students that the small pointy end of < points to the smaller value. Note that at distance = 5, 5 < 5 is False.",
        commonMistakes: ["Using > instead of <", "Calling crawl() instead of stop()"],
        studentReflection: "I know that < checks if a number is smaller than another number."
      },

      {
        id: 9,
        title: "Mission 9: Exact Limits with <=",
        storyProblem: "In Mission 8, 5 meters didn't stop because 5 < 5 is False! Change < to <= (less than or equal to) so the car stops at 5 meters or closer.",
        concept: "Boundary Comparisons (<= and >=)",
        goalChecklist: [
          { label: "Use <= operator", test: code => /<=/.test(code) },
          { label: "Check if distance <= 5:", test: code => /if\s+distance\s*<=\s*5\s*:/.test(code) },
          { label: "Keep stop() and else: go()", test: code => /stop\s*\(\s*\)/.test(code) && /go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "5 meters is right on the safety line—we want the car to stop at 5 meters too, not just 4!",
          knownInfo: "distance is the meters to the car ahead.",
          pythonQuestion: "Is distance <= 5? (Is distance smaller than OR equal to 5?)",
          whyPath: "Both 4 <= 5 and 5 <= 5 are True! Only numbers bigger than 5 (like 6) are False.",
          action: "Calls stop() when distance is 5 or less; calls go() when distance is 6 or more.",
          learned: "<= includes the exact boundary number by combining < and = together."
        },
        vocabulary: [
          { term: "<=", meaning: "Less than or equal to. True when the number is smaller OR the exact same." },
          { term: ">=", meaning: "Greater than or equal to. True when the number is bigger OR the exact same." }
        ],
        hints: [
          "Concept Clue: Change < to <= so 5 meters is included in your stop rule.",
          "Structure Guide:\nif distance ___ 5:\n    stop()\nelse:\n    go()",
          "Guided Correction: On line 2, change distance < 5: to distance <= 5: with no space between < and =."
        ],
        starterCode: '# Change < to <= so 5 meters also stops:\nif distance < 5:\n    stop()\nelse:\n    go()',
        solution: 'if distance <= 5:\n    stop()\nelse:\n    go()',
        variables: ["distance"],
        base: { light: "green" },
        tests: [
          { environment: { distance: 5 }, want: "stop", label: "distance = 5 m (exact boundary)" },
          { environment: { distance: 4 }, want: "stop", label: "distance = 4 m" },
          { environment: { distance: 6 }, want: "go", label: "distance = 6 m" }
        ],
        teacherExplanation: "Highlight why boundary testing matters: changing < to <= fixes the exact 5-meter boundary case.",
        commonMistakes: ["Writing =< instead of <=", "Putting a space between < and ="],
        studentReflection: "I can include the exact boundary number in a comparison using <= or >=."
      },

      {
        id: 10,
        title: "Mission 10: Safe Distance Zones",
        storyProblem: "Let's build 2 safety zones! Keep if distance < 5: stop(), then insert elif distance < 15: crawl() before else: go().",
        concept: "Chained Range Comparisons",
        goalChecklist: [
          { label: "Keep if distance < 5: stop()", test: code => /if\s+distance\s*<\s*5\s*:/.test(code) },
          { label: "Add elif distance < 15:", test: code => /elif\s+distance\s*<\s*15\s*:/.test(code) },
          { label: "Indent crawl() under elif", test: code => /elif\s+distance\s*<\s*15\s*:\s*\n\s+crawl\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "We want to brake hard when very close (< 5m), drive slowly at medium distance (< 15m), and drive normally when far away.",
          knownInfo: "distance sensor on the road ruler.",
          pythonQuestion: "1st: Is distance < 5? 2nd (elif): Is distance < 15?",
          whyPath: "Python checks < 5 first. Only if distance is 5 or more does it check elif distance < 15.",
          action: "Under 5m -> stop(); 5m to 14m -> crawl(); 15m or more -> go().",
          learned: "When checking number ranges, always check the smallest, strictest number first!"
        },
        vocabulary: [
          { term: "Range logic", meaning: "Checking number thresholds in order from smallest to largest." }
        ],
        hints: [
          "Concept Clue: Add an elif branch between if and else to check if distance < 15.",
          "Structure Guide:\nif distance < 5:\n    stop()\nelif distance < ___:\n    ___()\nelse:\n    go()",
          "Guided Correction: Between stop() and else:, insert elif distance < 15: and indent crawl()."
        ],
        starterCode: 'if distance < 5:\n    stop()\nelse:\n    go()',
        solution: 'if distance < 5:\n    stop()\nelif distance < 15:\n    crawl()\nelse:\n    go()',
        variables: ["distance"],
        base: { light: "green" },
        tests: [
          { environment: { distance: 3 }, want: "stop", label: "distance = 3 m" },
          { environment: { distance: 10 }, want: "crawl", label: "distance = 10 m" },
          { environment: { distance: 14 }, want: "crawl", label: "distance = 14 m" },
          { environment: { distance: 15 }, want: "go", label: "distance = 15 m" }
        ],
        teacherExplanation: "Ask students what would happen if distance < 15 came first: a distance of 3m would match < 15 and crawl instead of stopping!",
        commonMistakes: ["Checking < 15 before < 5", "Calling slow() instead of crawl() for the < 15 zone"],
        studentReflection: "I understand why the order of number checks matters in if and elif."
      },

      {
        id: 11,
        title: "Mission 11: Inside the Question (Nested if)",
        storyProblem: "Sometimes we ask a question inside another answer! Inside the else: block, replace go() with an indented if/else that checks if distance < 5: stop(), else: go().",
        concept: "Nested Conditionals (Indentation Levels)",
        goalChecklist: [
          { label: "Indent if distance < 5: inside else:", test: code => /else\s*:\s*\n\s+if\s+distance\s*<\s*5\s*:/.test(code) },
          { label: "Double-indent stop() inside inner if", test: code => /if\s+distance\s*<\s*5\s*:\s*\n\s{6,}stop\s*\(\s*\)/.test(code) },
          { label: "Add inner else: with go()", test: code => /\n\s+else\s*:\s*\n\s{6,}go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "First we check if the light is red. When the light is NOT red, we still need to check if the car ahead is too close (< 5m)!",
          knownInfo: "Two sensors: light and distance.",
          pythonQuestion: "Outer question: Is light == \"red\"? Inner question (inside else): Is distance < 5?",
          whyPath: "The inner if is pushed in with Tab inside else:, so Python only asks it when light is not red.",
          action: "Stops if light is red OR if distance < 5; calls go() only when green and safe.",
          learned: "Putting an if inside another block is called a 'nested if'. Indentation shows what belongs inside what!"
        },
        vocabulary: [
          { term: "Nested if", meaning: "An if question indented inside another if or else block." }
        ],
        hints: [
          "Concept Clue: Inside else:, indent a new if distance < 5: check.",
          "Structure Guide:\nif light == \"red\":\n    stop()\nelse:\n    if distance < ___:\n        ___()\n    else:\n        go()",
          "Guided Correction: Under the outer else:, indent if distance < 5: (4 spaces), indent stop() (8 spaces), indent else: (4 spaces), and indent go() (8 spaces)."
        ],
        starterCode: 'if light == "red":\n    stop()\nelse:\n    go()',
        solution: 'if light == "red":\n    stop()\nelse:\n    if distance < 5:\n        stop()\n    else:\n        go()',
        variables: ["light", "distance"],
        tests: [
          { environment: { light: "red", distance: 10 }, want: "stop", label: 'light = "red", distance = 10 m' },
          { environment: { light: "green", distance: 3 }, want: "stop", label: 'light = "green", distance = 3 m' },
          { environment: { light: "green", distance: 12 }, want: "go", label: 'light = "green", distance = 12 m' }
        ],
        teacherExplanation: "Walk students through the two indentation levels: 4 spaces (1 Tab) for the inner if/else, and 8 spaces (2 Tabs) for the actions inside them.",
        commonMistakes: ["Not indenting the inner if/else under the outer else", "Forgetting to indent the inner stop() and go() a second time"],
        studentReflection: "I can place an if question inside an else block using indentation."
      },

      {
        id: 12,
        title: "Mission 12: Both Must Be True (and)",
        storyProblem: "We can ask two questions on one line using and! Update the if line so the car calls go() ONLY when light == \"green\" and path == \"clear\":.",
        concept: "Logical Operator: and",
        goalChecklist: [
          { label: "Use the word and", test: code => /\band\b/.test(code) },
          { label: "Check light == \"green\" and path == \"clear\":", test: code => /if\s+light\s*==\s*["']green["']\s+and\s+path\s*==\s*["']clear["']\s*:/.test(code) },
          { label: "Keep go() and else: stop()", test: code => /go\s*\(\s*\)/.test(code) && /stop\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "A green light isn't safe if someone is on the crosswalk! Both the light AND the path must be safe to drive.",
          knownInfo: "Two sensors: light and path.",
          pythonQuestion: "Is light == \"green\" and path == \"clear\"?",
          whyPath: "The word and is strict: BOTH questions must be True for the whole line to be True.",
          action: "Calls go() only when light is green AND path is clear; otherwise calls stop().",
          learned: "Use and to join two complete questions when both must be True at the same time."
        },
        vocabulary: [
          { term: "and", meaning: "Joins two questions. True ONLY when both sides are True." }
        ],
        hints: [
          "Concept Clue: Join light == \"green\" with path == \"clear\" using the word and.",
          "Structure Guide:\nif light == \"green\" and path == \"___\":\n    go()\nelse:\n    stop()",
          "Guided Correction: Change line 1 to: if light == \"green\" and path == \"clear\":"
        ],
        starterCode: 'if light == "green":\n    go()\nelse:\n    stop()',
        solution: 'if light == "green" and path == "clear":\n    go()\nelse:\n    stop()',
        variables: ["light", "path"],
        tests: [
          { environment: { light: "green", path: "clear" }, want: "go", label: "green & clear" },
          { environment: { light: "green", path: "busy" }, want: "stop", label: "green & busy" },
          { environment: { light: "red", path: "clear" }, want: "stop", label: "red & clear" }
        ],
        teacherExplanation: "Highlight a classic beginner mistake: writing 'if light == \"green\" and \"clear\":'. Explain that each side of 'and' must be a complete comparison.",
        commonMistakes: ["Writing 'and \"clear\"' instead of 'and path == \"clear\"'", "Using & instead of the word and"],
        studentReflection: "I can join two complete questions with and when both must be True."
      },

      {
        id: 13,
        title: "Mission 13: Either Can Be True (or)",
        storyProblem: "Slow down with crawl() if we are in a \"school\" zone 🏫 OR if the weather is \"rainy\" 🌧️! Update the if line using or.",
        concept: "Logical Operator: or",
        goalChecklist: [
          { label: "Use the word or", test: code => /\bor\b/.test(code) },
          { label: "Check zone == \"school\" or weather == \"rainy\":", test: code => /if\s+zone\s*==\s*["']school["']\s+or\s+weather\s*==\s*["']rainy["']\s*:/.test(code) },
          { label: "Keep crawl() and else: go()", test: code => /crawl\s*\(\s*\)/.test(code) && /go\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "Either a school zone 🏫 OR rainy weather 🌧️ (or both!) means we should slow down and drive carefully.",
          knownInfo: "Two sensors: zone (\"school\" or \"city\") and weather (\"rainy\" or \"sunny\").",
          pythonQuestion: "Is zone == \"school\" or weather == \"rainy\"?",
          whyPath: "or is flexible: if AT LEAST ONE side is True, the whole question is True!",
          action: "Calls crawl() in a school zone, in rain, or both; calls go() only in a sunny city.",
          learned: "Use or to join two questions when either one being True is enough."
        },
        vocabulary: [
          { term: "or", meaning: "Joins two questions. True if at least one side is True." }
        ],
        hints: [
          "Concept Clue: Use the word or to check if zone == \"school\" or weather == \"rainy\".",
          "Structure Guide:\nif zone == \"school\" or weather == \"___\":\n    crawl()\nelse:\n    go()",
          "Guided Correction: Change line 1 to: if zone == \"school\" or weather == \"rainy\":"
        ],
        starterCode: 'if zone == "school":\n    crawl()\nelse:\n    go()',
        solution: 'if zone == "school" or weather == "rainy":\n    crawl()\nelse:\n    go()',
        variables: ["zone", "weather"],
        base: { light: "green" },
        tests: [
          { environment: { zone: "school", weather: "sunny" }, want: "crawl", label: "school & sunny" },
          { environment: { zone: "city", weather: "rainy" }, want: "crawl", label: "city & rainy" },
          { environment: { zone: "city", weather: "sunny" }, want: "go", label: "city & sunny (all safe)" },
          { environment: { zone: "school", weather: "rainy" }, want: "crawl", label: "school & rainy (both)" }
        ],
        teacherExplanation: "Contrast 'and' vs 'or': 'and' needs both conditions to be True; 'or' only needs one of them to be True.",
        commonMistakes: ["Using and instead of or", "Writing 'or \"rainy\"' without 'weather =='"],
        studentReflection: "I know that or is True whenever at least one of its questions is True."
      },

      {
        id: 14,
        title: "Mission 14: True, False and not",
        storyProblem: "Listen for the ambulance 🚑! siren is already True or False. Write an if/else rule: if not siren:, call go(); otherwise else: call stop().",
        concept: "Booleans & Negation (not)",
        goalChecklist: [
          { label: "Ask if not siren:", test: code => /if\s+not\s+siren\s*:/.test(code) },
          { label: "Indent go() under if", test: code => /if\s+not\s+siren\s*:\s*\n\s+go\s*\(\s*\)/.test(code) },
          { label: "Add else: stop()", test: code => /else\s*:\s*\n\s+stop\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "When an ambulance siren is on (siren = True), our car must stop and wait. When there is no siren (siren = False), we can drive!",
          knownInfo: "siren is a True/False switch (called a Boolean).",
          pythonQuestion: "Is not siren? (Is the siren off?)",
          whyPath: "The word not flips True and False: when siren is False, not siren becomes True!",
          action: "Calls go() when siren is False; calls stop() when siren is True.",
          learned: "True and False are Boolean values. The word not flips True to False and False to True."
        },
        vocabulary: [
          { term: "True / False", meaning: "Special yes/no values in Python (always start with a capital T or F)." },
          { term: "not", meaning: "Flips a True/False value to its opposite." }
        ],
        hints: [
          "Concept Clue: Ask Python if not siren: to check that there is no ambulance.",
          "Structure Guide:\nif not ___:\n    go()\nelse:\n    stop()",
          "Guided Correction: Write if not siren:, indent go(), then write else: and indent stop()."
        ],
        starterCode: "# Drive with go() if not siren, otherwise stop():\nstop()",
        solution: 'if not siren:\n    go()\nelse:\n    stop()',
        variables: ["siren"],
        base: { light: "green" },
        tests: [
          { environment: { siren: false }, want: "go", label: "siren = False (quiet)" },
          { environment: { siren: true }, want: "stop", label: "siren = True (ambulance!)" }
        ],
        teacherExplanation: "Show students that because siren is already True or False, 'if not siren:' reads just like English ('if there is not a siren').",
        commonMistakes: ["Putting quotes around True or False", "Swapping go() and stop()"],
        studentReflection: "I can use True, False, and not to check on/off switches in Python."
      },

      {
        id: 15,
        title: "Mission 15: The Autonomous Brain (Boss Challenge)",
        storyProblem: "Final Boss Challenge! Add an elif branch: when light == \"yellow\" and not siren:, call slow(). Otherwise else: stop()!",
        concept: "Combined Complex Decision Logic",
        goalChecklist: [
          { label: "Check elif light == \"yellow\" and not siren:", test: code => /elif\s+light\s*==\s*["']yellow["']\s+and\s+not\s+siren\s*:/.test(code) },
          { label: "Indent slow() under elif", test: code => /elif\s+light\s*==\s*["']yellow["']\s+and\s+not\s+siren\s*:\s*\n\s+slow\s*\(\s*\)/.test(code) },
          { label: "Keep else: stop() at end", test: code => /else\s*:\s*\n\s+stop\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "A real self-driving car combines traffic lights AND emergency siren checks together!",
          knownInfo: "Two sensors: light (\"green\", \"yellow\", \"red\") and siren (True or False).",
          pythonQuestion: "1st: light == \"green\" and not siren? 2nd: light == \"yellow\" and not siren?",
          whyPath: "If an ambulance siren is True, both questions become False and Python jumps straight to else: stop()!",
          action: "Drives on green (if no siren), slows on yellow (if no siren), and stops for red or any siren.",
          learned: "You can combine if/elif/else, ==, and, and not to build a complete decision brain!"
        },
        vocabulary: [
          { term: "Combined Logic", meaning: "Using comparisons (==) and logic words (and, not) together in one question." }
        ],
        hints: [
          "Concept Clue: Insert an elif branch checking light == \"yellow\" and not siren before else:.",
          "Structure Guide:\nif light == \"green\" and not siren:\n    go()\nelif light == \"___\" and not ___:\n    slow()\nelse:\n    stop()",
          "Guided Correction: Between go() and else:, add elif light == \"yellow\" and not siren: and indent slow()."
        ],
        starterCode: 'if light == "green" and not siren:\n    go()\nelse:\n    stop()',
        solution: 'if light == "green" and not siren:\n    go()\nelif light == "yellow" and not siren:\n    slow()\nelse:\n    stop()',
        variables: ["light", "siren"],
        tests: [
          { environment: { light: "green", siren: false }, want: "go", label: "green & quiet" },
          { environment: { light: "green", siren: true }, want: "stop", label: "green & ambulance!" },
          { environment: { light: "yellow", siren: false }, want: "slow", label: "yellow & quiet" },
          { environment: { light: "yellow", siren: true }, want: "stop", label: "yellow & ambulance!" },
          { environment: { light: "red", siren: false }, want: "stop", label: "red & quiet" }
        ],
        teacherExplanation: "Celebrate this capstone level! Have students trace what happens when light is 'green' and siren is True to see why 'and not siren' protects the intersection.",
        commonMistakes: ["Writing 'elif \"yellow\" and not siren:' without 'light =='", "Forgetting 'and not siren' on the yellow branch"],
        studentReflection: "I can combine variables, comparisons, and logical operators to program a safe self-driving car!"
      },

      {
        id: 16,
        title: "Mission 16: Free Sandbox Playground 🎮",
        storyProblem: "You graduated from the Autonomous Coding Academy! Change light, path, speed, distance, weather, or siren, and test any Python rules you invent!",
        concept: "Creative Open-Ended Mastery",
        goalChecklist: [
          { label: "Experiment with variables (=)", test: code => /=/.test(code) },
          { label: "Write an if or elif decision", test: code => /\b(if|elif)\b/.test(code) },
          { label: "Call a car command ()", test: code => /\b(go|stop|slow|crawl)\s*\(\s*\)/.test(code) }
        ],
        learnFirst: {
          problem: "Design and test your own road scenarios and self-driving rules!",
          knownInfo: "You can set light, path, speed, distance, weather, zone, and siren to any values you like.",
          pythonQuestion: "Any question you write using if, elif, ==, !=, <, >, <=, >=, and, or, not!",
          whyPath: "Watch the Live Brain Map and Step Tracer evaluate your custom code.",
          action: "Your car obeys whatever rules you invent!",
          learned: "Experimenting with code is the best way to become a confident programmer."
        },
        vocabulary: [
          { term: "Sandbox", meaning: "A free playground where you can change variables and test your own ideas." }
        ],
        hints: [
          "Concept Clue: Try changing light = \"yellow\" to light = \"red\" or speed = 80 at the top.",
          "Structure Guide:\nspeed = 85\nif speed > 50:\n    crawl()\nelse:\n    go()",
          "Guided Correction: Try combining sensors, like: if light == \"green\" and distance > 10:"
        ],
        starterCode: 'light = "yellow"\nspeed = 65\nif light == "red":\n    stop()\nelif speed > 50:\n    crawl()\nelse:\n    go()',
        solution: 'light = "yellow"\nspeed = 65\nif light == "red":\n    stop()\nelif speed > 50:\n    crawl()\nelse:\n    go()',
        variables: ["light", "path", "speed", "distance", "siren", "weather", "zone"],
        base: { light: "green", path: "clear", speed: 30, distance: 20, siren: false, weather: "sunny", zone: "city" },
        free: true,
        tests: [
          { environment: {}, want: "free", label: "Custom Sandbox Run" }
        ],
        teacherExplanation: "Encourage students to invent their own challenges for a partner and predict which branch Python will take before pressing Run.",
        commonMistakes: [],
        studentReflection: "I can creatively design and test my own Python programs!"
      }
    ];

