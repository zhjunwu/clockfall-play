// English content: the Chest Demon (the market). Sessions 1 and 2. Written independently, not translated.
// Voice: the Chest Demon is smug, slippery and small-minded; never cool enough to copy. Zero never says "you should".
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "chest", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- The market minigame (getting robbed) ----
    "chest.mini.eyebrow": "The market",
    "chest.mini.title": "Lucky Chest",
    "chest.mini.lead": "Only one stall in the market is still open. Tap the chest, get coins. Open as many as you like. Walk away whenever.",
    "chest.mini.planQ": "Before you start, pick a number: how many will you open?",
    "chest.mini.start": "Start",
    "chest.mini.tap": "Tap the chest",
    "chest.mini.stop": "I'm done",
    "chest.mini.glowHint": "The chest is glowing... the next one feels different.",
    "chest.mini.nearSmall": "one away from the jackpot",
    "chest.mini.near": "So close!",
    "chest.mini.maxed": "The vendor packs up.",

    // ---- Session 1: the reveal ----
    "chest.revealOpen": "Well. Look who's here.",
    "chest.revealClose": "My stall doesn't sell anything. It collects one thing: your time.",
    "chest.revealGloat": "Go on, go. You don't have to come here. I'll come to you. I've got stalls all over your phone.",

    // ---- Session 2: X-ray ----
    "chest.xray.eyebrow": "Pause · X-ray",
    "chest.xray.title": "That \"luck\" was arranged",
    "chest.xray.intro": "Zero has the Chest Demon pinned against a wall. It isn't worried. It's pleased with itself, and it tells you how it works, one rule at a time.",
    "chest.xray.timeline": "Every tap you made",
    "chest.xray.legend.small": "small win",
    "chest.xray.legend.big": "jackpot",
    "chest.xray.legend.near": "so close",
    "chest.xray.legend.rigged": "jackpot it arranged",
    "chest.xray.rulesTitle": "The rules, in its own words",
    // The demon explains what it does, never why it works. "Why" belongs to the glossary.
    "chest.rules": [
      { rule: "luck", title: "Beginner's luck", body: "Second tap, I always give you a big one. You decide you're lucky early, and the rest takes care of itself." },
      { rule: "pause", title: "You slow down, I light up", body: "Pause for more than two and a half seconds and I start glowing. Next tap is a jackpot, guaranteed. You pause exactly when you're deciding whether to leave. That's my favorite moment." },
      { rule: "plan", title: "Your last planned one", body: "You said five? Number five is a jackpot. Who walks away right after a jackpot?" },
      { rule: "near", title: "So close", body: "\"So close\" is the same as a miss. Zero coins. But it feels like you nearly had it. I didn't invent that. I just use it." },
      { rule: "random", title: "The rest is chance", body: "Small wins, one to five coins. A random jackpot now and then. You never know what the next one is. That's all it takes." },
    ],
    "chest.xray.stat.actual": "you opened",
    "chest.xray.stat.plan": "your number",
    "chest.xray.stat.time": "time",
    "chest.xray.nameTitle": "This has a name",
    "chest.xray.name": [
      "What it just described is called {term:variableReward}.",
      "You couldn't stop just now, and it wasn't the coins. It was \"maybe the next one\". The {term:nearMiss} is the same move.",
      "It doesn't only run a stall in the market. Plenty of apps have one. The chest just looks different. Not every app, though.",
    ],

    // ---- Session 2: training ----
    "training.eyebrow": "Training ground",
    "training.title": "The market, reopened",
    "training.stopIntro": ["There's one move in this whole game: hold first. Hold for a second and don't tap anything.", "While you're holding, you're out of its rhythm."],
    "training.setStopPoint": "Before you open anything, say a number. That's what we're training: when you hit the number, the chest glows, and you hold.",
    "training.youKnowNow": "It's going to glow. This time you know. Wanting to tap anyway is normal. That's the part we're training.",
    "training.reached": "That's your number. It's glowing. The chest still works.",
    "training.holdNow": "Hold",
    "training.held": "You stopped.",
    // Zero doesn't lecture. The demon says what it wants, out loud.
    "training.afterHold": "Walk, or pick another number. Either's fine.",
    "chest.afterHoldWhisper": "(quietly) No need for a number. Just keep tapping.",
    "training.btnLeave": "Walk",
    "training.btnExtend": "One more round, my number this time",
    "flag.extendOnce": "\"Just one more.\" My favorite sentence.",
    "training.marketClosed": "The vendor packs up. That's it for today.",
    "training.summaryTitle": "How training went",

    // The Jar Demon's small shadow (session 2 foreshadowing, unexplained)
    "jar.firstShadow": "...you already went over once anyway.",
    "zero.shooShadow": "Get lost. ...Ignore that. Let's keep going.",

    // ---- Session 2: real-world task and the progress hook ----
    "zero.stopTask": ["When it shows up in your spot, hold first. On the phone or just in your head. One second.", "Before you open anything, say a number.", "If it doesn't work, come back anyway. That counts too."],
    "chest.progressCliff": "Two of the market lamps are lit. One left. The baker is still behind the chest.",
  },
  fn: {
    "chest.mini.planBtn"({ n }) {
      return `${n}`;
    },
    "chest.mini.count"({ n }) {
      const k = n || 0;
      return k === 1 ? "1 opened" : `${k} opened`;
    },
    "chest.mini.result"({ kind, reward }) {
      if (kind === "big") return `Jackpot +${reward}!`;
      if (kind === "near") return "So close!";
      return `+${reward}`;
    },
    "chest.revealLine"({ plan, n, stoppedByUser }) {
      if (!n) return "Not a single one? ...Here for the view, are you.";
      if (n === 1) return "One. Fine. One still counts.";
      if (plan && n <= plan) return `You said ${plan}. You opened ${n}. ...Boring.`;
      if (plan && n > plan) return `You said ${plan}. You opened ${n}. ...I didn't do a thing. You tapped.`;
      return "Had fun, didn't you? Don't be shy. Everyone does. You gave me some time just now and I'm very happy with it.";
    },
    "chest.cliffLine"({ plan, n, hitSecond }) {
      if (n >= 2 && hitSecond) return "Do you know why your second tap was a jackpot...";
      if (n >= 2) return "Do you know why the chest kept glowing at you...";
      return "Do you know what would have happened if you'd opened one more...";
    },
    "verdict"({ plan, n, stoppedByUser, maxed }) {
      if (!n) return "You left without opening a single one. So its rules never got to touch you. Here's what it had ready.";
      if (maxed) return `You opened ${n}. The vendor closed, not you. Look at what happened in between.`;
      if (plan && n > plan) return `Your number was ${plan}. You opened ${n}, which is ${n - plan} more. You did the tapping. It picked the moments.`;
      return `Your number was ${plan}. You opened ${n}. You held the line. Think back: was there a "one more" in there somewhere? What was it doing right then?`;
    },
    "ruleHit"({ ruleId, count }) {
      if (ruleId === "random") return count ? `${count} of your jackpots were arranged` : "all random";
      if (ruleId === "near") return count ? `happened ${count} time${count === 1 ? "" : "s"}` : "didn't happen";
      if (!count) return "never got the chance";
      return count === 1 ? "used on you once" : `used on you ${count} times`;
    },
    "chest.xray.secs"({ secs }) {
      return `${secs}s`;
    },
    "stopPointPrompt"({ n }) {
      return n ? `Just ${n}.` : "How many?";
    },
    "training.overTap"({ over }) {
      if (over === 1) return "See?";
      if (over === 2) return "And another.";
      return `${over} over.`;
    },
    "training.summary"({ extends: ext, held, over }) {
      let a;
      if (held && !over) a = "You held when you hit your number.";
      else if (held) a = `You hit your number, opened ${over} more, then held.`;
      else a = `You hit your number and opened ${over} more. The vendor closed. That's fine. Next time.`;
      if (!ext) return a;
      return a + ` You went one more round${ext > 1 ? ` (${ext})` : ""}.`;
    },
  },
});
