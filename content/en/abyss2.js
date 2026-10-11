// English content: the Abyss, session 2 (day 19: seeing through it + drawing a door). Mark_V058, revisions Mary_V049.
// Seeing through it: the player pries open the gaps between cards themselves. Every card was finished; what pulls you is that there's no last one.
// Training: the wall lesson (you can't draw a door inside; refused once) → draw a door outside (pick one of three kinds) → go in; when the door lights, the pull is still there; hold, walk out.
// Ending: the codex "Doors" page; the fourth slot, "a door in real life," is never filled inside the game (collection hook).
// A demon can twist things but can't make up data: the opening taunt follows the player's real guesses from session 1.
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "abyss2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Patrol: last session's real-world task ----
    "abyss2.task.eyebrow": "Patrol report · the hallway",
    "abyss2.task.q": "Last time you finished scrolling, did you guess first and then check? How far off were you?",
    "abyss2.task.options": [
      { id: "lessMuch", label: "I guessed way too low" },
      { id: "less", label: "I guessed a little low" },
      { id: "close", label: "Pretty close" },
      { id: "more", label: "I guessed too high" },
      { id: "notTried", label: "I didn't try it this time" },
    ],
    "abyss2.task.skip": "I'd rather not say",
    "abyss2.task.reply.number": "Got it. That's your own number.",
    "abyss2.task.reply.notTried": "Not trying is on the record too.",
    "abyss2.task.reply.skip": "That's fine.",

    // ---- Seeing through it ----
    "abyss2.xray.eyebrow": "The hallway · seeing through it",
    "abyss2.xray.rewind": "Let's rewind that part.",
    "abyss2.xray.find": "Every card was finished. Look closely: where could you have stopped?",
    "abyss2.xray.more": "...and plenty more",
    // Revealed inside each gap, in order
    "abyss2.xray.gapLines": ["This one was finished.", "This was the last line on a page.", "This was where the credits roll.", "This was where you could look up."],
    "abyss2.xray.found": "I found them",
    "abyss2.xray.zero1": "Every card was finished. What pulls you isn't any one card. It's that there's no last one.",
    "abyss2.xray.zero2": ["A book has a last page. A meal gets finished. An episode has credits.", "You don't have to think about those. They tell you on their own: you can stop here. The hallway sanded all of them away."],
    "abyss2.xray.abyss": "So what if I did? You're not going to stop on your own.",
    "abyss2.xray.zero3": "Yes, you will. You just have to do it before you go in.",

    // ---- Training: the wall lesson ----
    "abyss2.inside.eyebrow": "Training · inside the hallway",
    "abyss2.inside.go": "Go in first.",
    "abyss2.inside.nowDraw": "Now draw a door.",
    "abyss2.drawBtn": "Draw a door",
    "abyss2.inside.refused": "You can't draw a door in here.",
    "abyss2.inside.zero": "See? Once you're in, there's nowhere to draw one. Come out.",

    // ---- Training: draw it outside ----
    "abyss2.wall.eyebrow": "Training · the hallway entrance",
    "abyss2.wall.say": "Draw it out here.",
    "abyss2.wall.hint": "Drag a door shape on the wall, or tap “Draw a door.”",
    "abyss2.type.q": "When does the door open?",
    "abyss2.types": [
      { type: "count", title: "Count door", options: [{ v: 5, label: "At card 5" }, { v: 10, label: "At card 10" }] },
      { type: "time", title: "Time door", options: [{ v: 30, label: "After 30 seconds" }, { v: 60, label: "After 1 minute" }] },
      { type: "feel", title: "Feeling door", options: [{ v: "bored", label: "When I start scrolling out of boredom" }, { v: "forgot", label: "When I can't remember the last card" }] },
    ],

    // ---- Training: walk to the door ----
    "abyss2.corridor.eyebrow": "Training · the hallway",
    "abyss2.door": "Door",
    "abyss2.feelTap": "Tap the door when it's time",
    "abyss2.doorTempt": "There's nothing out there. There's so much more in here.",
    "abyss2.doorOut": "Leave",
    "abyss2.yours": "You set that yourself.",
    "abyss2.leftBeforeDoor": "The door hadn't even lit up, and you walked out on your own.",

    // ---- Real-world task ----
    "abyss2.realQ": "Pick a door for real life.",
    "abyss2.realOptions": [
      { id: "timer", label: "Set a timer before I open it" },
      { id: "count", label: "Say “after these few, I'm getting up” first" },
      { id: "page2", label: "Move it to the second page of my phone" },
    ],
    "abyss2.realDone": "Whether you draw it or not, come back and tell me.",

    // ---- Codex: Doors (endHook: collection) ----
    "codex.doors.title": "Codex · Doors",
    "codex.doors.seen": "Seen",
    "codex.doors.practiced": "Practiced",
    "codex.doors.real": "A door in real life",
    "codex.doors.realNote": "This slot is outside the game.",
  },
  fn: {
    // Opening taunt: the demon can twist things but can't make up data
    "abyss2.boast"({ sec, n, exited, cardResult, timeResult }) {
      if (!n) return "You've been in my hallway, right? Lost count, didn't you.";
      const m = Math.floor(sec / 60), s = sec % 60;
      const t = m ? `${m} ${m === 1 ? "minute" : "minutes"} ${s} seconds` : `${s} seconds`;
      const left = exited ? " You left before you were done." : "";
      const base = `Last time you spent ${t} in here and saw ${n} ${n === 1 ? "card" : "cards"}.${left}`;
      if (cardResult === "close" && timeResult === "close") return `${base} You guessed right? ...Won't happen twice.`;
      return `${base} You couldn't even keep count.`;
    },
    "abyss2.realQIntro"({ app }) {
      const a = app ? (app.startsWith("The ") ? "t" + app.slice(1) : app) : null;
      return a ? `Real life has doors too. Pick one and draw it before you open ${a} next time.` : "Real life has doors too. Pick one and draw it before you open that app next time.";
    },
    "abyss2.doorResult"({ k }) {
      return k ? `After the door lit up, you saw ${k} more ${k === 1 ? "card" : "cards"}, then stopped.` : "The moment the door lit up, you stopped.";
    },
    "abyss2.doorLabel"({ label }) {
      return `Door: ${label}`;
    },
  },
});
