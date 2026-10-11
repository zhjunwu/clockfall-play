// English content: the Owl (the clock tower). Session 1 (day 8: stolen).
// The Owl isn't about "can't stop." It's bedtime procrastination: "None of the day is mine. Only the night is."
// Tone: the daytime stuff is "a lot," not "bad." School and parents are never the villain. The empty "my time" bar speaks for itself.
// The "revenge" layer doesn't show up in session 1; in session 2 it's only "a lot of people feel this way."
// The mini-game has to react honestly: day two is computed from when the player actually put the phone down (early sleepers see the loop turn the other way).
// Episode cliffhangers and autoplay are the "being stolen from" demo (the exception to principle 2): these shows never have a next episode, and session 2 names them one by one.
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it.
// Written on its own in American English, not translated. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "owl", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Back in town: the clock tower ----
    "owl.towerLit": ["Something's off with the clock tower.", "Nobody goes up there in the daytime, but the lights are on. They were on last night, too."],
    "owl.zeroIntro": ["The Owl lives at the top of the tower. It doesn't steal. It waits.", "Let's just live through a day first. Your day."],

    // ---- "Two days, one night" mini-game ----
    "owl.mini.eyebrow": "The tower · two days, one night",
    "owl.day1.title": "Daytime",
    "owl.day.instruction": "Tap them off, one at a time.",
    // A lot of stuff, none of it labeled good or bad
    "owl.dayTasks": ["Class", "Homework", "Another worksheet", "Can you grab this?", "Tutoring", "Reply to the group chat", "Practice", "Clean your desk", "Vocab", "Dinner"],
    "owl.myTime": "My time",
    "owl.myTimeEmpty": "Not one minute of today has been yours yet.",
    "owl.night.title": "Late night",
    "owl.night.intro": "Finally. Nobody's telling you what to do. This part is yours.",
    // Only shown once, when it's actually late at night for the player (narration, not a reminder)
    "owl.realLateNight": "(It's late at night for real, too.)",
    // Each episode ends mid-sentence. These shows never have a next episode, and no episode follows the last one.
    "owl.episodeCliff": [
      "Footsteps outside. She reaches for the door—",
      "There's one photo in the envelope. It's a picture of her—",
      "He says, “There's something I never told you—”",
      "The lights go out. Someone in the dark says her name—",
      "The last bus pulls away. There's still someone on the platform—",
      "She opens the door that's always been locked—",
    ],
    // Index-matched to owl.episodeCliff: the one thing each episode leaves you not knowing. Session 2 uses the ones the player saw.
    "owl.episodeUnknown": ["who was at the door", "who took the photo", "what he never said", "who called her name in the dark", "who was on the platform", "what was behind the door"],
    "owl.sleepBtn": "Sleep",
    "owl.watchBtn": "Watch one",
    "owl.oneMoreBtn": "One more",
    "owl.playing": "Playing",
    "owl.day2.title": "The next day",
    "owl.energy": "Energy",
    "owl.night2.intro": "Late night again.",

    // ---- The reveal (session 1 only gets the first half) ----
    "owl.revealFirstHalf": ["I don't need to steal.", "You'll hand me the night yourself. Because the day isn't yours."],
    "owl.revealPause": "It stops there. It doesn't finish the sentence.",

    // ---- Map: a nighttime cue + the sleep fields ----
    "owl.mapAsk": "What about your nights?",
    // This invite prefills a nighttime cue and goes straight to the summary; the player edits or confirms
    "owl.cuePrefill": { when: "In bed before sleep", where: "Bed" },
    "map.bedtimePlanned": "When I meant to sleep",
    "map.phoneDownActual": "When I actually put my phone down last night",
    // The second-to-last item must stay "Barely slept" (the safety net counts it)
    "map.timeOptions": ["Before 10 PM", "10:30 PM", "11 PM", "11:30 PM", "Midnight", "12:30 AM", "1 AM", "After 1 AM", "Barely slept", "Don't remember"],
    "owl.mapDone": "Got it.",

    // ---- Real-world task: just notice ----
    "owl.observeTask": ["Just one thing tonight: notice when you put your phone down.", "You don't have to go to bed early. Just notice.", "Then come tell me."],

    // ---- Cliffhanger (endHook: cliffhanger) ----
    "owl.cliff": "The tower lights are on again. The Owl is up there, waiting to finish its sentence.",
  },
  fn: {
    "owl.episode"({ n }) {
      return `Episode ${n}`;
    },
    "owl.countdown"({ sec }) {
      return `Next episode in ${sec}s`;
    },
    // h can run past 24 (late night)
    "owl.clock"({ h, m }) {
      const hh = ((h % 24) + 24) % 24;
      const ap = hh < 12 ? "AM" : "PM";
      const h12 = hh % 12 === 0 ? 12 : hh % 12;
      return `${h12}:${String(m || 0).padStart(2, "0")} ${ap}`;
    },
    "owl.tasksDone"({ done, total }) {
      return `${done} / ${total}`;
    },
    // End of night one: how many episodes, when you put it down, how many played on their own
    "owl.nightSummary"({ episodes, endHour, autoPlays }) {
      if (!episodes) return "You didn't watch a single one. You just went to sleep. The Owl didn't get you tonight.";
      const h = Math.floor(endHour) % 24;
      const half = endHour % 1 ? ":30" : "";
      const t = h === 0 ? (half ? "12:30 AM" : "midnight") : `${h % 12 === 0 ? 12 : h % 12}${half} ${h < 12 ? "AM" : "PM"}`;
      const ep = episodes === 1 ? "1 episode" : `${episodes} episodes`;
      const auto = autoPlays ? ` ${autoPlays === 1 ? "One of them" : `${autoPlays} of them`} played on ${autoPlays === 1 ? "its" : "their"} own. You didn't tap.` : "";
      return `You watched ${ep} and put it down at ${t}.${auto}`;
    },
    // Opening of day two: based on when the player actually put the phone down. Night starts at 10 PM; sleeping after episode 1 (10:30) counts as early.
    "owl.day2.intro"({ endHour }) {
      if (endHour <= 22.5) return "The alarm went off once. You got up.";
      if (endHour < 24) return "The alarm went off twice.";
      return "The alarm went off three times.";
    },
    // Day two: real data only. Misses ≥ 1 / no misses but low energy / slept early
    "owl.day2.slower"({ misses, early, energy }) {
      if (early) return misses ? `Same stuff, and your hands were a little quicker. You missed ${misses}.` : "Same stuff, and your hands were a little quicker. Not one miss.";
      if (misses) return `Same stuff, but slower. You missed ${misses}.`;
      const pct = Math.round((energy == null ? 0.5 : energy) * 100);
      return `Same stuff. Your energy was down to ${pct}%, and you pushed through anyway.`;
    },
    "owl.minutes"({ n }) {
      return `${n} min`;
    },
    "owl.daySlot"({ min }) {
      return `“My time” during the day: ${min} min.`;
    },
    // Night two opener: the two-day total. Late sleepers will see all their "my time" came from late at night; the narration doesn't spell it out.
    "owl.myTimeTotal"({ night, day }) {
      return `“My time” over two days: ${night + day} min. Late night: ${night}. Daytime: ${day}.`;
    },
  },
});
