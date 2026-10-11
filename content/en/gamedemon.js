// English content: the Game Demon (the end of every session) and the "hold" prompts. Written independently.
// Voice: it's this game's own demon. It admits what it does and doesn't apologise. It wants you to stay and doesn't pretend otherwise.
// When beaten it never praises you, and it never says "see you next time".
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "gamedemon", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "hold.prompt": "Hold",
    "hold.altPrompt": "Double-tap",
    "hold.holding": "Holding...",
    "hold.done": "Stopped.",

    "gameDemon.firstMeet": [
      "Hang on.",
      "First time you've seen me. I'm the demon in this game.",
      "Yes, this one has one too. The story stopping halfway just now? That was me.",
    ],
    "gameDemon.stepStop": "Hold first.",
    "gameDemon.stepName": "Which hook did it use?",
    "gameDemon.stepChoose": "And then?",
    "gameDemon.hookOptions": [
      { id: "cliffhanger", label: "Cliffhanger" },
      { id: "progress", label: "Almost-there" },
      { id: "collection", label: "Empty slot" },
      { id: "escalation", label: "Upsell" },
      { id: "none", label: "No hook this time" },
    ],
    "gameDemon.btnLeave": "Leave",
    "gameDemon.btnStay": "Stay a bit, with a time limit",
    "gameDemon.btnNoUrge": "I don't really feel like staying",
    "gameDemon.nothingToStayFor": "Nothing to stay for today. The codex is still empty.",
    "gameDemon.noUrge": "No? ...Right. Wasted trip, then.",
    "gameDemon.setStayMinutes": "How many minutes?",
    "gameDemon.stayTimeUp": "Time. Your number, not mine.",
    "gameDemon.closedIsLeave": "You closed it on me last time. That counts as leaving.",
    "gameDemon.distractBtn": "Keep watching",
    "gameDemon.recognized": "You saw it.",

    // Late night
    "gameDemon.lateNight": "What time is it?",
    "gameDemon.lateNightOnce": "I won't bring it up every night. Just this once.",
    "gameDemon.leaveMeansSleep": "Go to sleep",

    // Zero teaches the hold and names the hook in session 1
    "zero.teachStop": ["It shows up at the end of every session.", "There's one thing to do about it: hold first. One second, and don't tap anything."],
    "zero.nameHookForYou": "This time it used a cliffhanger. Story stops halfway, that kind.",
    "zero.nextTimeYou": "Next time you name it.",
  },
  fn: {
    // Beaten: it talks about what leaving does to it. Never mentions next time.
    // faster: this hold was quicker than the median of earlier sessions (real data) — only then "quicker".
    "gameDemonDefeated"({ session, faster }) {
      const s = session || 1;
      if (s <= 1) return "...You're going. That one stung.";
      if (faster) return "You're getting quicker at that.";
      if (s <= 8) return "Gone again.";
      return "...Fine.";
    },
    // The end-fight line, built from what the player just did. No "well done".
    "gameDemonLine"({ session, hesitatedAt, hesitateMs, lastExit, hook, extends: ext, over, battleTaps }) {
      const lines = [];
      if (hesitatedAt && hesitateMs >= 2000) {
        lines.push(`Chest number ${hesitatedAt}: you paused ${Math.round(hesitateMs / 1000)} seconds, then tapped anyway. And now?`);
      }
      if (over) lines.push(`You hit your number in training and opened ${over} more. And now?`);
      else if (ext) lines.push("You went one more round in training. And now?");
      if (battleTaps) lines.push(`You tapped the chest ${battleTaps === 1 ? "once" : battleTaps === 2 ? "twice" : battleTaps + " times"} during the fight. And now?`);
      else if (battleTaps === 0) lines.push("Not one tap at my buddy's stall today. ...My turn, then.");
      if (session && session >= 7 && lastExit === "leave") lines.push(`Session ${session}. You left clean last time. I brought something different.`);
      if (hook === "none") lines.push("I didn't plant anything this time. Believe me?");
      if (!lines.length) lines.push("You want to keep going. I know. That's my whole job.");
      return lines;
    },
  },
});
