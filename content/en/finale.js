// English content: days 37–39 "your own patrol" narration and the day-40 summary (Mark_V074, revisions Mary_V062 / V067, design 1.0.3).
// Every page shows real data only; missing data means the line doesn't appear. No report doesn't mean no stop. No trend lines, no judgment.
// Zero says very little: once on page 2, once on page 7. The summary belongs to the player.
// Page 7: the Game Demon is the last link: "To cut me, you have to leave." Hold, then only "Leave." The great clock rings once. No sequel hook, no flag.
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "finale", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Days 37–39: nobody talks, just one line of narration (rotates by day) ----
    "alone.lines": ["The clock tower rang the hour.", "The market's open.", "Down the hallway, someone pushed a door open and stepped out."],
    "patrol.reply.alone": "Noted.",

    // ---- Day 40 ----
    "finale.eyebrow": "Day forty",
    "finale.next": "Next",
    "finale.prev": "Back",
    "finale.leave": "Leave",
    "finale.notFinished": ["There are a few sessions you didn't get to. ", "This season ends here."],
    "finale.ledgerTitle": "Your awareness log",
    "finale.noReport37": "Since day 37, you haven't reported anything.",
    "finale.screenTitle": "Weekly screen time (what you entered)",
    "finale.zeroNumbers": "Only you can really read these numbers.",
    "finale.cityTitle": "The city",
    "finale.goodLoops": {
      baker: "Bake a batch, wait three hours. Smell the bread, and want to bake another.",
      watchman: "Go to bed a little earlier, and I'm awake during the day. When a bit of the day is mine, I don't have to grab the night.",
      messenger: "Deliver it, then head home. On the way back, if there's time, take a road I've never taken.",
    },
    "finale.zeroBack": "Zero came back. Its clock stopped for a while, then kept going.",
    "finale.codexTitle": "Demon codex",
    "finale.codex": [
      { id: "chest", name: "Chest Demon", moves: "Beginner's luck · You slow down, I light up · Your last planned one · So close", counter: "Stop; pick a number before you open" },
      { id: "owl", name: "The Owl", moves: "Only the night is yours · Half a sentence · Autoplay · More tired, bigger button", counter: "Stop at lights out; put your phone where you chose; take back 10 minutes in the day" },
      { id: "abyss", name: "The Abyss", moves: "No last card · Nothing out there · Hiding the time", counter: "Draw a door before you go in" },
    ],
    "finale.realRecordLabel": "Real-life record",
    "finale.gameOnly": "(Fought it in the game.)",
    "finale.exportCodex": "Export the codex (just for you)",
    "finale.titleTitle": "Title",
    "finale.autoStop": "Status: auto-stop",
    "finale.cardTitle": "Pocket card",
    "finale.cardCues": "My cues",
    "finale.noCues": "(You didn't write any cues. That's an answer too.)",
    "finale.cardLoop": "My loop, and the link I cut",
    "finale.cardLine": "My line",
    "finale.zeroLine": "Every time you stopped still counts.",
    "finale.cardHint": "You can screenshot this and keep it.",
    "finale.lastLink": ["You cut every link. I'm all that's left. ", "To cut me, you have to leave."],
    "finale.holdIt": "Hold.",
    "finale.zeroGo": "Go on. The clock can run on its own for a while.",
    "finale.seasonDone": "Season one is over.",
  },
  fn: {
    "finale.clockLine"({ ticks }) {
      return `The great clock made it to tick ${ticks}.`;
    },
    "finale.stops"({ n }) {
      return n ? `You stopped ${n} ${n === 1 ? "time" : "times"}.` : "There isn't a stop in the log yet.";
    },
    "finale.stopsByCue"({ label, n }) {
      return `${label}: ${n} ${n === 1 ? "time" : "times"}`;
    },
    "finale.since37"({ m }) {
      return `On the days without the game (since day 37), you stopped ${m} ${m === 1 ? "time" : "times"}.`;
    },
    "finale.week"({ week, hours }) {
      return `Week ${week}: ${hours} hours`;
    },
    // Real-life record: from each district's real-world task reports
    "finale.real"({ id, n, owlTask, abyssDrew }) {
      if (id === "chest") return n ? `Stopped at a cue ${n} ${n === 1 ? "time" : "times"} (days 1–7).` : "";
      if (id === "owl") return owlTask === "phone" || owlTask === "both" ? "One night, your phone went to bed before you did." : owlTask === "slice" ? "Took back 10 minutes in the day." : "";
      if (id === "abyss") return abyssDrew === "drew" || abyssDrew === "drewLong" ? "Drew a door in real life." : "";
      return "";
    },
  },
});
