// English content: Chest Demon session 3 (day 6): the fight, the baker's dream, the market coming back, the Owl teaser.
// The fight (Mary_V021): a health bar, three rounds, each round the temptation escalates in three steps; no countdown;
// the player can hold at any time and the earlier they hold the harder the hit; the chest always works; no fail state.
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "battle", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "battle.eyebrow": "The market · showdown",
    "battle.intro": ["Here it comes. For real this time.", "It'll turn it up a notch at a time. Hold whenever you like. The earlier, the better."],
    "battle.hpLabel": "Chest Demon",
    "battle.stepStop": "Holding is a hit",
    "battle.stepRecognize": "Which move was that?",
    "battle.recognizeOptions": [
      { rule: "luck", label: "Beginner's luck" },
      { rule: "pause", label: "You slow down, I light up" },
      { rule: "plan", label: "Your last planned one" },
      { rule: "near", label: "So close" },
    ],
    "battle.stepChoose": "And then?",
    "battle.btnSetNumber": "Pick a number",
    "battle.btnWalk": "Walk",
    "battle.stage3bait": "Just one more.",
    "battle.hit": "A hit.",
    "battle.crit": "Critical. You held before it finished talking.",
    "battle.lateHit": "A hit. It had turned everything up and you still stopped.",
    "battle.readRight": "Right. A piece of the disguise cracks off.",
    "battle.misread": "Still can't see me properly, can you.",
    "battle.tappedHeal": "Opened. It licks its lips.",
    "battle.round3Setup": "Last round. You pick a number. I promise the last one's big.",
    "battle.round3Glow": "That was the last one. Jackpot. ...One more?",
    "battle.finalBlow": "Straight after a jackpot, you walked. Nothing scares the Chest Demon more.",
    "battle.shatter": ["The Chest Demon's shell breaks.", "There's nothing inside. There never was."],
    "battle.zeroAfter": "Come on. Someone to rescue. The shell's open; the door's behind it.",
    "battle.walked": "You walked. It switched moves and came after you again.",
    "battle.openFirst": "Open up to your number first",

    // ---- The baker's dream ----
    "baker.eyebrow": "The baker's dream",
    "baker.dreamIntro": ["Behind the broken chest there's a small door. The baker's dream is on the other side.", "There's a chest in there too. He opens it in exactly the order you did on day one."],
    "baker.dreamDefault": ["Behind the broken chest there's a small door. The baker's dream is on the other side.", "There's a chest in there too. He's been opening it for a long time."],
    "baker.watch": "Watch. He's opening.",
    "baker.nowHold": "Here. Hold for him.",
    "baker.held": "The chest goes dark. The baker looks up.",
    "baker.awake": ["...Thank you.", "I think I've been opening boxes in here. How long?", "Doesn't matter. I need to light the oven. Bread takes three hours. Can't rush it."],
    // The rescued are companions, not cautionary tales
    "baker.strongerThanHim": "You did better than him that day. He hadn't learned yet.",

    // ---- The market comes back ----
    "market.revived": ["The third lamp in the market comes on.", "The stalls open one by one. It smells of bread.", "The great clock doesn't strike. But it runs a little steadier."],
    "market.companion": "The baker stays in the market.",

    // ---- Owl teaser (end hook: cliffhanger) ----
    "teaser.owl": "In the distance, the bell tower. It's dark now, and the tower's lights are on. ...Past midnight, they're still on.",
  },
  fn: {
    // Round 1 whisper: the player's own cues. Returns a set; the engine picks one.
    "demonTaunt"({ when, where, mood, app, who }) {
      const lines = [];
      if (when) lines.push(`${when}, right? That's when you cave the fastest.`);
      if (where) lines.push(`${where}. Your thumb's scrolling before you've even decided.`);
      if (mood) lines.push(`${mood}? Who wouldn't want one. Just one.`);
      if (app) lines.push(`${app}. I've got stalls all through it. You've seen them.`);
      if (who) lines.push("Doesn't matter who's around. I'm not picky.");
      if (!lines.length) lines.push("You know where I wait for you.", "Just one. One is nothing.", "Pausing? Lovely. Watch me glow.");
      return lines;
    },
    // Round 2 whisper: quotes the patrol report back at the player
    // whenLabel / doing are the options' in-sentence phrases ("late at night", "in the middle of homework")
    "demonQuotePatrol"({ kind, whenLabel, doing, what }) {
      const t = whenLabel ? ` ${whenLabel}` : " the other day";
      const d = doing ? `, ${doing}` : "";
      if (kind === "noticed" && what === "held") return `You held off${t}${d}? Not so easy today.`;
      if (kind === "noticed") return `You noticed me${t}${d}? Noticing. What good is noticing.`;
      if (kind === "notAppear") return "You said I didn't show up? I'm always there.";
      if (kind) return "You said you realized afterwards? Afterwards is mine.";
      return "You didn't report anything. I'll take that as every day.";
    },
    "battle.attackLine"({ rule }) {
      if (rule === "luck") return "Here, start with a big one.";
      if (rule === "pause") return "Pausing? Watch me glow.";
      if (rule === "plan") return "Last one. The last one's always good.";
      if (rule === "near") return "So close! One away.";
      return "Maybe the next one.";
    },
    "battle.roundOf"({ i, total }) {
      return `Round ${i} of ${total}`;
    },
    // Zero answers the demon's put-down right after the hit lands
    "battle.zeroRebut"({ kind, what }) {
      if (kind === "noticed" && what !== "held") return "That's what it's good for.";
      if (kind === "later" || kind === "nowRemember") return "It doesn't get to decide that. Afterwards is yours too.";
      return null;
    },
  },
});
