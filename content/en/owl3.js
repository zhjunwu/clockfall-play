// English content: the Owl, session 3 (day 13): the report on session 2's task, the showdown (three nights), the night watchman's dream, the tower coming back, the hallway teaser.
// In the showdown you name the move, not the demon. All four moves are ones the player saw in sessions 1 and 2:
// only the night is yours / half a sentence / autoplay / the more tired you are, the bigger the button.
// "One more" always works: it really plays an episode, the clock jumps 30 minutes, and the Owl gets 1 point of health back. No fail state.
// When the Owl twists the player's report, Zero always answers before the night ends. Night three's lines follow the real number of extra episodes.
// Demon lines only quote neutral or tired moods (G.map.forDemon).
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it. Ends on the hallway teaser (endHook: cliffhanger).
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "owl3", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Report: session 2's real-world task ----
    "owl3.task.eyebrow": "Patrol report · nights",
    "owl3.task.q": "Two things. Which one happened?",
    "owl3.task.options": [
      { id: "phone", label: "My phone went where I said" },
      { id: "slice", label: "I found 10 minutes during the day" },
      { id: "both", label: "Both" },
      { id: "none", label: "Neither" },
    ],
    "owl3.task.skip": "I'd rather not say",
    "owl3.task.nightQ": "Which night?",
    "owl3.task.nightOptions": ["Last night", "The night before", "Earlier"],
    "owl3.task.timeQ": "When did you put it down?",
    "owl3.task.whereQ": "Where did it go?",
    "owl3.task.whereOther": "Somewhere else",
    "owl3.task.dontRemember": "Don't remember",
    "owl3.task.reply.phone": "Got it. That night, your phone went to bed before you did.",
    "owl3.task.reply.slice": "Got it. It can't reach those 10 minutes.",
    "owl3.task.reply.both": "Got both.",
    "owl3.task.reply.none": "Got it. Neither. Being honest about it still counts, and that part is yours.",
    "owl3.task.reply.skip": "That's fine.",

    // ---- Showdown ----
    "owl3.eyebrow": "The tower · showdown",
    "owl3.intro": ["It's coming down. This time it's not waiting for you to hand over the night. It's coming to take it.", "Three nights. Every night at lights out, it makes a move. Hold whenever you like. The earlier, the better."],
    "owl3.lateNote": "(Say it's tonight. In real life it's time for bed, so go once this is done.)",
    "owl3.hpLabel": "The Owl",
    "owl3.nights": ["Night one", "Night two", "Night three"],
    "owl3.before": "A show is on. It isn't lights out yet, so this part is yours.",
    "owl3.timeUp": "It's time.",
    "owl3.oneMore": "One more",
    "owl3.playing": "Playing",
    "owl3.stepStop": "Holding is a hit",
    "owl3.n1.mechanic": "All that daytime stuff belonged to other people. This part belongs to you.",
    "owl3.n1.bait": "Just one. It's the only thing you got to pick all day.",
    "owl3.n2.mechanic": "Don't you want to know what happens?",
    "owl3.n2.bait": "You don't even have to press anything. I'll hit play for you.",
    "owl3.n3.whisper": "You're so tired today. How are you going to make it through tomorrow if you don't unwind a little?",
    "owl3.n3.mechanicGrow": "See that button? I made it bigger. You're tired, so I get to.",
    // For players who never watched extra: the button tries to grow and can't
    "owl3.n3.mechanicStuck": "…The button won't budge. Why won't it budge?",
    "owl3.n3.bait": "Just this one. The last one. I promise.",
    "owl3.healed": "Another episode. It preens its feathers.",
    "owl3.autoHealed": "The countdown tapped for you. It preens its feathers.",
    "owl3.hit": "A hit.",
    "owl3.crit": "Critical. You held before it finished talking.",
    "owl3.lateHit": "A hit. It had turned everything up and you still stopped.",
    "owl3.stepRecognize": "Which move was that?",
    "owl3.moves": [
      { move: "myTime", label: "Only the night is yours" },
      { move: "cliff", label: "Half a sentence" },
      { move: "autoplay", label: "Autoplay" },
      { move: "bigger", label: "More tired, bigger button" },
    ],
    "owl3.readRight": "Right. A feather drops.",
    "owl3.misread": "You haven't quite seen it yet. That's fine. Seeing it takes practice.",
    "owl3.door.step": "Take your phone out of the room.",
    "owl3.door.icon": "Phone",
    "owl3.door.done": "The door's shut. Your phone is on the other side.",
    "owl3.finalBlow": "Night three, and you took your phone out of the room. That's what the Owl hates most.",
    "owl3.deflate": ["The Owl's feathers sag.", "It's actually tiny."],
    "owl3.owlLast": "…I'm here every night.",
    "owl3.zeroLast": "So it's here. So are you.",
    "owl3.zeroAfter": "There's someone else at the top of the tower. Come on.",

    // ---- The night watchman's dream ----
    "watchman.eyebrow": "The watchman's dream",
    "watchman.intro": ["There's a little window at the top of the tower. Through it is the night watchman's dream.", "He's watching a show. The same episodes you watched on your first night."],
    "watchman.introDefault": ["There's a little window at the top of the tower. Through it is the night watchman's dream.", "He's watching a show. One episode after another. He's been at it a long time."],
    "watchman.watch": "Watch. He's watching.",
    "watchman.now": "Right here. Put his phone outside the door for him.",
    "watchman.again": "Another one. The countdown will come back.",
    "watchman.door": "Outside",
    "watchman.early": "You didn't wait for it to start counting.",
    "watchman.done": "The phone is outside. The screen goes dark. The watchman looks up.",
    "watchman.awake": ["…What time is it?", "I kept watch for years. At some point I forgot what I was watching for.", "The tower should be ringing the hour. I'll go ring it."],
    // Only if the player really did go to bed early on their first night
    "watchman.fasterThanHim": "That night, you were one step ahead of him. He hasn't learned it yet.",

    // ---- The tower comes back (the cold window light goes out; only the hour lamp stays amber) ----
    "tower.revived": ["The tower lights go off one by one. Only the one for ringing the hour stays lit.", "It's on the hour. The tower rings once.", "The big clock doesn't ring, but it keeps time a little steadier."],
    "tower.companion": "The watchman stayed at the tower.",

    // ---- Abyss teaser (endHook: cliffhanger) ----
    "teaser.abyss": "On the far side of town there's a hallway. A long one. There isn't a single door in its walls.",
  },
  fn: {
    // Night one whisper: the player's nighttime cue (mood already filtered). Returns a list; the engine picks one.
    "owl3.whisper1"({ when, where, mood, app }) {
      const lines = [];
      if (when) lines.push(`${when}, huh? Everything before this belonged to other people. This part is yours.`);
      if (where) lines.push(`${where}. Nobody needs anything from you there. It's the only spot today that's yours.`);
      if (mood) lines.push(`${mood} all day? You've earned a night to make up for it.`);
      if (app) lines.push(`${app}. You didn't get one second for that all day.`);
      if (!lines.length) lines.push("Finally, nobody's telling you what to do.", "You haven't given yourself one minute all day.");
      // A few more generic lines so watching extra episodes rotates instead of repeating
      lines.push("Tomorrow can wait. Right now is yours.", "It's so quiet. When does that ever happen?", "You were busy all day. This little bit is nothing.");
      return lines;
    },
    // Night two whisper: twisting the patrol report. night / time / where arrive as the labels the player picked; the sentence is built here.
    // Times become spoken English; "Don't remember", "Barely slept", "After 1 AM" stay out of the sentence. Places reuse session 2's phrasing.
    "owl3.whisper2"({ kind, night, time, where }) {
      if (kind === "phone" || kind === "both") {
        const nights = { "Last night": " last night", "The night before": " the night before last", "Earlier": " one night" };
        const spoken = { "Before 10 PM": " before ten", "10:30 PM": " at ten-thirty", "11 PM": " at eleven", "11:30 PM": " at eleven-thirty", "Midnight": " at midnight", "12:30 AM": " at twelve-thirty", "1 AM": " at one" };
        const w = !where ? " down" : where.startsWith("by my bed") ? " face down by your bed" : " " + where.replace("my ", "your ");
        return `You say you put your phone${w}${spoken[time] || ""}${nights[night] || " one night"}? One night. Tonight's different.`;
      }
      if (kind === "slice") return "You stole back 10 minutes in the daytime? What's that even good for.";
      if (kind === "none") return "Neither? Figures. The night was always mine.";
      return "You didn't say anything. So I'll assume I get you every night.";
    },
    // Zero always answers once the Owl twists the report
    "owl3.zeroRebut"({ kind }) {
      if (kind === "phone" || kind === "both") return "That night was real. One night is one night. What it says doesn't change that.";
      if (kind === "slice") return "It can't reach those 10 minutes, so it says they're worthless.";
      if (kind === "none") return "You told the truth. What it's afraid of isn't you pulling it off. It's you being honest.";
      return "You don't have to say. What it assumes doesn't count.";
    },
    "owl3.n3.open"({ extra }) {
      if (!extra) return "Night three. Both nights so far, you turned the lights out on time.";
      return `Night three. Over the last two nights you watched ${extra === 1 ? "1 extra episode" : `${extra} extra episodes`}.`;
    },
    "owl3.countdown"({ sec }) {
      return `Next episode in ${sec}s`;
    },
    "owl3.result"({ extra, auto }) {
      if (!extra) return "Three nights, and you stopped at lights out every time.";
      const ep = extra === 1 ? "1 extra episode" : `${extra} extra episodes`;
      const a = auto ? `, and ${auto === 1 ? "1 of them was" : `${auto} of them were`} the Owl tapping for you` : "";
      return `You watched ${ep}${a}. Then you took your phone out of the room anyway.`;
    },
    // The door slot: where the player chose in session 2; "by my bed" or nothing means "outside my room" (the point is getting it out)
    "owl3.doorLabel"({ where }) {
      return !where || String(where).startsWith("by my bed") ? "outside my room" : where;
    },
    "owl3.doorHint"({ door }) {
      return `Drag your phone over, or tap the phone and then tap “${door}.”`;
    },
  },
});
