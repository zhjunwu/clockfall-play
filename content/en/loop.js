// English content: day 25, "the loop." Mark_V067, revisions Mary_V055 / V059.
// The loop on the wall (three demons pinned into one loop; the people you rescued each say one line) → your loop (2 to 3 links, no need to fill every slot)
// → cracks in the loop (from real "I stopped" reports) → practice loop (name the demon, three gestures, no speed-up, no health bar, no Jar)
// → which link to cut first (real-world task) → Zero staring (endHook: cliffhanger, quiet).
// Science wording: the loop is a model to help understand, "this is how a lot of people's nights go," never "this is what addiction is" (for the reviewer).
// No conclusions in dialogue (rule 8): Zero says what it would do, not a rule.
// "In a worse mood" counts once toward the safety net and never shows up in any demon line.
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "loop", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "loop.eyebrow": "Below the clock tower · the loop",
    // ---- The loop on the wall ----
    "loop.pinIntro": "Zero pins three pictures to the wall and runs a single thread through them.",
    "loop.notThree": "They're not three things. They're one loop.",
    "loop.slots": [
      { id: "start", label: "What starts it" },
      { id: "hold", label: "What won't let you stop" },
      { id: "after", label: "What it leaves behind" },
    ],
    "loop.wallNodes": { start: "A small red dot", hold: "Chest Demon · the Abyss", after: "The Owl" },
    "loop.baker": "Back then, I'd open one and want another. Then I'd be worn out, and being worn out made me want to open more.",
    "loop.watchman": "The days were too long and the nights were too short. I wasn't keeping watch over the night. I was keeping watch over the little bit of time that was mine.",
    "loop.messenger": "I kept walking because I couldn't see the end. And since I couldn't see the end, I kept walking.",
    "loop.manyNights": "This is how a lot of people's nights go.",
    "loop.seen": "What a loop fears most is being seen. You see it now.",

    // ---- Your loop ----
    "loop.yours": "What about yours?",
    "loop.mine.hint": "Tap a spot and put something in it. Two links is enough.",
    "loop.mine.options": {
      start: ["A notification", "Not sure"],
      hold: [{ id: "chest", label: "Chest Demon" }, { id: "abyss", label: "The Abyss" }, { id: "none", label: "Neither" }],
      after: [{ id: "owl", label: "The Owl (staying up late)" }, { id: "tired", label: "More tired the next day" }, { id: "mood", label: "In a worse mood" }, { id: "none", label: "None of these" }],
    },
    "loop.mine.empty": "empty",
    "loop.mine.done": "Done",
    "loop.mine.saved": "This is your loop.",

    // ---- Cracks ----
    "loop.noCrack": ["No cracks yet. That's okay."],
    "loop.cutOne": "A loop has several links. You don't have to cut them all. Cut one and it can't turn.",

    // ---- Practice loop ----
    "loop.practice.eyebrow": "Training · the loop",
    "loop.practice.intro": "It's turning. Whoever it lands on makes a move. Hold first, then tap that one.",
    "loop.practice.whisper": { chest: "The next one could be it.", owl: "One more episode.", abyss: "There's more below." },
    "loop.practice.tapDemon": "Now tap it.",
    "loop.practice.again": "Try again.",
    "loop.practice.right": "You named it.",
    "loop.gesture.chest": "Pull down a stopping point",
    "loop.gesture.owl": "Drag the phone out the door",
    "loop.gesture.abyss": "Draw a door at the entrance",
    "loop.gesture.alt": "Tap here instead",
    "loop.practice.stopped": "It stopped. Not because you beat it, but because you saw every link.",
    "loop.demonNames": { chest: "Chest Demon", owl: "The Owl", abyss: "The Abyss" },

    // ---- Which link to cut ----
    "loop.cutQ": "This week, which link do you cut first?",
    "loop.cutMine": "I'd cut the first one.",
    "loop.cutDone": "Cutting it once counts. Come back and tell me.",
    // Only when the player picks the "In a worse mood" link: hint style, not Zero speaking; no pop-up, no follow-up (Mary_V059 B1)
    "loop.moodHelp": "If you're in a bad mood a lot, “Need help?” is in Settings.",

    // ---- Zero staring (quiet) ----
    "loop.stare": ["Zero stops below the clock tower, staring at that small red dot in the corner of the wall.", "This time, it doesn't snap out of it."],
  },
  fn: {
    "loop.cueLabel"({ when, where }) {
      return [when, where].filter(Boolean).join(" · ") || "Your cue";
    },
    "loop.cracks"({ n }) {
      return ["See? It isn't whole anymore.", `${n === 1 ? "That crack is" : `Those ${n} cracks are`} your doing.`];
    },
    // How to cut that link (from the three districts' real-world tasks)
    "loop.cutHow"({ slot, id, when, where }) {
      if (slot === "start") {
        const at = [when, where].filter(Boolean).map((x) => x.charAt(0).toLowerCase() + x.slice(1)).join(", ");
        return at ? `Next time it shows up (${at}), name it first: “There it is.”` : "Next time it shows up, name it first: “There it is.”";
      }
      if (id === "chest") return "Before you open any, say it first: “Only N.”";
      if (id === "abyss") return "Before you open it, draw a door: set a timer, decide how many, or move it to the second page.";
      if (id === "owl") return "At the time you picked, put your phone where you said it would sleep.";
      if (id === "tired") return "Find 10 minutes in the day that are only yours.";
      if (id === "mood") return "When your mood drops, notice it first: this link is turning. You don't have to do anything about it right away.";
      return "Next time the loop gets to this link, notice it first.";
    },
  },
});
