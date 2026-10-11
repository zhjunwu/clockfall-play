// English content: the Abyss, session 3 (day 22): the real-door report, the showdown (three hallways), rescuing the hallway messenger, the hallway coming back, Zero staring.
// You name the move: no last card / nothing out there / hiding the time. Any move it actually used this round counts.
// Stopping is always exactly as easy as usual. The exit never moves.
// Demon lines never use loneliness or sadness (Mary_V036 A2), not even as a generic line.
// Ending: Zero stares at a red dot (endHook: cliffhanger, quiet style), the last hint of the Zero storyline.
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "abyss3", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Patrol: the real door ----
    "abyss3.task.eyebrow": "Patrol report · doors",
    "abyss3.task.options": [
      { id: "drew", label: "I drew it" },
      { id: "drewLong", label: "I drew it, but still went in for a long time" },
      { id: "no", label: "I didn't" },
    ],
    "abyss3.task.skip": "I'd rather not say",
    "abyss3.task.reply.drew": "You drew it. Got it.",
    "abyss3.task.reply.drewLong": "Drawing it counts too. You put the door up. Whether you walk out is another thing. Both count.",
    "abyss3.task.reply.no": "Not drawing it is on the record too.",
    "abyss3.task.reply.skip": "That's fine.",

    // ---- Showdown ----
    "abyss3.eyebrow": "The hallway · showdown",
    "abyss3.intro": ["It's done waiting for you to walk in. It's opening hallways right in front of you, one after another.", "Three of them. For each one, draw the door first, then go in. Once the door lights up, you can stop any time."],
    "abyss3.hpLabel": "The Abyss",
    "abyss3.corridors": ["First hallway", "Second hallway", "Third hallway"],
    "abyss3.entrance.say": "Door first.",
    "abyss3.entrance.hint": "Drag a door shape on the wall, or tap “Draw a door.”",
    "abyss3.goIn": "Just go in",
    "abyss3.noDoorInside": "You can't draw a door in here.",
    "abyss3.noDoorAfter": "Doors get drawn outside. Next hallway, door first.",
    // Hallway 1: no last card
    "abyss3.m1.whisper": "There's more below.",
    "abyss3.m1.mechanic": "Where'd the door go? It got pushed way down.",
    "abyss3.m1.bait": "A little further and you'll reach the bottom.",
    // Hallway 2: nothing out there
    "abyss3.m2.whisper": "There's nothing out there. There's so much more in here.",
    "abyss3.m2.mechanic": "See? Everything past that door is gray.",
    "abyss3.m2.bait": "Why go out? Nothing's happening out there anyway.",
    // Hallway 3: hiding the time
    "abyss3.m3.whisper": "It's only been a minute.",
    "abyss3.m3.mechanic": "What does the door say? Can't read it anymore, can you.",
    "abyss3.m3.bait": "You just got here.",
    "abyss3.healed": "Another card. It sinks a little deeper.",
    "abyss3.hit": "A hit.",
    "abyss3.crit": "Critical. You held before it finished talking.",
    "abyss3.lateHit": "A hit. It had turned everything up and you still stopped.",
    "abyss3.stepRecognize": "Which move was that?",
    "abyss3.moves": [
      { move: "noBottom", label: "No last card" },
      { move: "outside", label: "Nothing out there" },
      { move: "hideTime", label: "Hiding the time" },
    ],
    "abyss3.readRight": "Right. A crack opens in the wall, and light gets in.",
    "abyss3.misread": "You haven't quite seen it yet. That's fine. Seeing it takes practice.",
    "abyss3.doorOut": "Leave",
    "abyss3.finalBlow": "Third hallway, and you stopped at the door and walked out on your own.",
    "abyss3.deflate": ["The Abyss caves in on itself.", "The end of the hallway was a wall after all. And the wall has a door."],
    "abyss3.zeroAfter": "There's someone else in the hallway. Come on.",

    // ---- Rescuing the hallway messenger ----
    "messenger.eyebrow": "The hallway messenger",
    "messenger.intro": ["Someone is walking at the end of the hallway. He's the hallway messenger; he carries letters across the city.", "He's been walking a long time, and the letters are still in his bag."],
    "messenger.now": "He hasn't gone in yet. Now's the moment.",
    "messenger.inside": "He went in. When he comes out, he'll pass the entrance again.",
    "messenger.stopped": "He reaches the door, stops, looks up at it, and turns back out.",
    "messenger.awake": ["...I walked all this way and forgot where I was going.", "This letter is for the baker. I'll go deliver it."],
    // Only if the player walked out early on their own in session 1 (real data)
    "messenger.aheadOfHim": "That day, you found the way out before he did.",

    // ---- The hallway comes back ----
    "corridor.revived": ["Windows open up along the hallway walls, and every so often there's a door.", "Halfway down, someone pushes one open and steps out into the sun.", "The great clock doesn't ring, but it keeps time a little steadier."],
    "corridor.companion": "The hallway messenger stayed in the city. He says from now on, once a letter is delivered, he comes home.",

    // ---- Zero staring (endHook: cliffhanger, quiet) ----
    "zero.stare": ["Zero stops below the clock tower, staring at a small red dot in the corner of the wall.", "It stares longer than last time."],
    "zero.stareBack": "...Let's go. That's enough for today.",
  },
  fn: {
    "abyss3.task.q"({ door }) {
      return door ? `The door you picked last time (${door.charAt(0).toLowerCase() + door.slice(1)}): did you draw it?` : "The door you picked last time: did you draw it?";
    },
    "abyss3.doorLabel"({ type, v }) {
      if (type === "time") return `Door: after ${v} seconds`;
      if (type === "feel") return "Door: when I start scrolling out of boredom";
      return `Door: at card ${v}`;
    },
    "abyss3.hideTimeRebut"({ sec, n }) {
      return `You spent ${sec} seconds in this hallway and saw ${n} ${n === 1 ? "card" : "cards"}. It said it had only been a minute.`;
    },
    "abyss3.result"({ noDoor, k }) {
      const a = noDoor ? `${noDoor === 1 ? "One hallway" : `${noDoor} hallways`} you entered without a door, and then you walked out on your own.` : "Three hallways, and you drew the door first every time.";
      const b = k ? ` After the doors lit up, you saw ${k} more ${k === 1 ? "card" : "cards"} in all.` : "";
      return a + b;
    },
  },
});
