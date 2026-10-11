// English content: the Owl, session 2 (day 10: seeing through it + training).
// Seeing through: the Owl finishes its sentence (it gloats, and it can lie), then the player's own data answers it. The replay of the two days uses real data only
// (night two only gets the choice the player made). The button line follows the real scale. Only the episodes the player actually saw get listed.
// Tapped vs. autoplayed are shown separately. The name lives in the glossary.
// Training 1: the bedtime routine. When the time comes, "One more" really works (it really plays an episode) and the way out is always there. The ending follows what actually happened.
// Training 2: take back 10 minutes during the day.
// Tone: "revenge" only as "a lot of people feel this way." The daytime stuff is "a lot," not "bad." The game never backs up the demon's lies.
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it. No hook at the end (endHook: none).
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "owl2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Seeing through it ----
    "owl.xray.eyebrow": "The tower · seeing through it",
    "owl.xray.title": "How the loop gets going",
    "owl.revealSecondHalf": ["The later you go to bed, the less the next day belongs to you.", "And the less the day is yours, the more the night is worth.", "You spin that loop yourself. I just stand next to it."],
    "owl.xray.yourTwoDays": "Your two days",
    "owl.xray.line.myTime": "My time",
    "owl.xray.line.energy": "Energy",
    "owl.xray.day1": "Day one",
    "owl.xray.night1": "Night one",
    "owl.xray.day2": "Day two",
    "owl.xray.night2": "Night two",
    "owl.xray.night2Sleep": "Sleep",
    "owl.xray.night2More": "One more",
    "owl.xray.buttonNoticed": "I noticed",
    "owl.xray.buttonMissed": "I didn't notice",
    "owl.xray.buttonReplyNoticed": "Good. It counts on you not noticing.",
    "owl.xray.buttonReplyMissed": "A lot of people don't. That's what it counts on.",
    "owl.xray.buttonEarly": "You went to bed early the first night, so the button on night two didn't get any bigger. It only grows under one condition: the more tired you are, the bigger it gets.",
    "owl.xray.cliffsTitle": "The episodes you saw",
    "owl.xray.autoplayTitle": "Who tapped",
    "owl.xray.nameTitle": "This has a name",
    "owl.xray.name": [
      "A lot of people feel this way: none of the day is mine, only the night is. So even when you know you should sleep, you don't want the day to end.",
      "There's a name for it: {term:bedtimeProcrastination}.",
      "The Owl doesn't steal. It just waits for you to hand over the night.",
    ],

    // ---- Training 1: the bedtime routine ----
    "owl.ritual.eyebrow": "Training · the bedroom",
    "owl.ritual.intro": ["The way to beat it happens before it gets dark.", "First pick a time: lights out. Then decide where your phone sleeps tonight."],
    "owl.ritual.lightsOutQ": "Lights out at…?",
    // v is what the engine reads; label is what the player sees
    "owl.ritual.lightsOutOptions": [
      { v: "21:30", label: "9:30 PM" },
      { v: "22:00", label: "10:00 PM" },
      { v: "22:30", label: "10:30 PM" },
      { v: "23:00", label: "11:00 PM" },
      { v: "23:30", label: "11:30 PM" },
    ],
    "owl.ritual.phoneWhereQ": "Where does your phone sleep tonight?",
    // v fits after "you put it…" and is what sentences use; label is the button
    "owl.ritual.phoneWhereOptions": [
      { v: "outside my room", label: "Outside my room" },
      { v: "on my desk", label: "On my desk" },
      { v: "in the living room", label: "In the living room" },
      { v: "by my bed, face down", label: "By my bed, face down" },
    ],
    "owl.ritual.waiting": "It's dark out. Lights out is a little while away.",
    // Used instead when the player really is opening this late at night (doesn't repeat session 1's late-night line)
    "owl.ritual.waitingLate": "Say it's tonight. Lights out is a little while away.",
    "owl.ritual.timeUp": "It's time.",
    "owl.ritual.tempt": ["Just one.", "Your lights-out time isn't a law.", "It's not like you have first period tomorrow."],
    "owl.ritual.watch": "Watch one",
    "owl.ritual.oneMore": "One more",
    "owl.ritual.playing": "Playing",
    "owl.ritual.doIt": "Put your phone where you picked",
    "owl.ritual.phoneIcon": "Phone",

    // ---- Training 2: take back 10 minutes during the day ----
    "owl.slice.eyebrow": "Training · daytime",
    "owl.slice.intro": ["There's one more way, and it goes to the root.", "Night feels so precious because not one minute of the day is yours. So take a piece of the day back. It doesn't have to be big. 10 minutes."],
    "owl.slice.instruction": "Drop these 10 minutes into a gap.",
    "owl.slice.block": "My 10 minutes",
    // A vertical timeline: strings are booked, { gap } is the open slot between two things
    "owl.slice.schedule": ["Homeroom", "Morning classes", "Lunch", { gap: "After lunch" }, "Afternoon classes", { gap: "Walk home" }, "Homework", "Dinner", { gap: "After dinner" }, "Homework", "Shower"],
    "owl.slice.placed": "Done.",
    "owl.slice.owlLine": "…I can't reach that one.",
    "owl.slice.zeroLine": "Once 10 minutes of the day are yours, the night doesn't have to carry all your freedom by itself.",

    // ---- Real-world task: either one counts ----
    "owl.task2": ["Two things. Doing one is enough.", "Pick a night, and at the time you chose, put your phone where you said.", "Or find 10 minutes during the day that are only yours.", "If neither happens, come tell me anyway."],
  },
  fn: {
    // The player's own data answers "you spin that loop yourself"
    "owl.xray.rebut"({ episodes, auto }) {
      if (!episodes) return "You didn't let it get going the first night.";
      if (auto) return `It says you spin it yourself. But on night one, ${auto === 1 ? "1 episode was" : `${auto} episodes were`} started by the countdown, not you.`;
      return "Every episode you watched, you did tap. But out of those 10 things in the day, you didn't pick a single one.";
    },
    // The night-two button, by its real scale
    "owl.xray.buttonLine"({ scale }) {
      if (scale < 1.15) return "On night two, the “One more” button was a tiny bit bigger than on night one. The later you stay up, the bigger it gets.";
      if (scale < 1.4) return "Did you notice? On night two, the “One more” button got bigger.";
      return "Did you notice? On night two, the “One more” button was a lot bigger.";
    },
    // The episodes the player actually saw
    "owl.xray.noNextEpisode"({ episodes, examples }) {
      if (!episodes) return ["You didn't watch any.", "Those shows don't have a next episode anyway."];
      const ex = (examples || []).slice(0, 2);
      const list = ex.length === 2 ? `${ex[0]}, or ${ex[1]}` : ex[0] || "what happens next";
      return ["These shows don't have a next episode.", `I only ever wrote half a sentence. ${list.charAt(0).toUpperCase() + list.slice(1)}? I don't know either. I don't need to.`];
    },
    "owl.xray.plays"({ manual, auto }) {
      if (!manual && !auto) return "You didn't watch a single episode the first night.";
      const a = manual ? `You started ${manual === 1 ? "1 episode" : `${manual} episodes`} yourself` : "You didn't start a single one yourself";
      const b = auto ? `${auto === 1 ? "1 played" : `${auto} played`} on autoplay` : "nothing autoplayed";
      return `${a}, and ${b}.`;
    },
    "owl.xray.numbers"({ nightMin, dayMin, energyPct, misses }) {
      return `Night one “my time”: ${nightMin} min. Day two energy: ${energyPct}%, ${misses} missed, daytime “my time”: ${dayMin} min.`;
    },
    "owl.ritual.placeHint"({ where }) {
      return `Drag your phone over, or tap the phone and then tap “${where}.”`;
    },
    // End of training 1: what actually happened, no points off, no do-over
    "owl.ritual.result"({ extra, where }) {
      const w = where ? (where.startsWith("by my bed") ? "set it face down by your bed" : `put it ${where.replace(/^outside my/, "outside your").replace(/^on my/, "on your")}`) : "put it down";
      if (!extra) return `Right on time, you ${w}. Your phone went to sleep.`;
      return `You watched ${extra === 1 ? "1 extra episode" : `${extra} extra episodes`}, then you ${w}. Your phone went to sleep.`;
    },
  },
});
