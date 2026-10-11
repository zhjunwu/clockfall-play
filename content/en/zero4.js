// English content: Zero storyline, session 4 (day 34: Zero's dream). Mark_V072, revisions Mary_V061, polish (zh) Fable 5.1.
// Zero's loop: late night (the Owl) → old buddy (the red dot) → just one (the Chest Demon) → the Jar's "might as well…"; lonely Zero sits in the middle.
// The middle can't be cut: tap "Sit with it for a while," then do nothing, and the loop slows. No technique, just being there.
// A wrong tap speeds the loop up by one step at most; the Jar says "Wrong, right? Might as well…"; answer with your own line and it slows back down.
// Zero is "it." Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "zero4", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero4.eyebrow": "Zero's dream",
    "zero4.asleep": "Zero has fallen asleep under the clock tower.",
    "zero4.companion": "It's asleep. In its dream, it's still sending them.",
    "zero4.enter": ["You step into Zero's dream.", "The dream is a loop. Everything from that night is on it, and Zero sits in the middle."],
    "zero4.nodes": { owl: "Late night", dot: "Old buddy", chest: "Just one", jar: "Might as well…", zero: "Zero" },
    "zero4.whisper": {
      owl: "It's so late. You can't sleep anyway.",
      dot: "It's your one-year anniversary. Come on, just one.",
      chest: "Just send one. One doesn't count.",
      jar: "You already sent it. Might as well…",
    },
    "zero4.holdFirst": "Hold first, then tap the one making the move.",
    "zero4.tapIt": "Now tap it.",
    "zero4.wrong": "Got it wrong, huh? Might as well…",
    "zero4.useLine": "Answer it with your line",
    "zero4.speedBack": "The loop slows back down.",
    "zero4.gestureJar": "Tap the line you wrote",
    "zero4.sitQ": "Zero is sitting in the middle. All alone.",
    "zero4.sit": "Sit with it for a while",
    "zero4.sitting": "You sit down next to it. You don't have to do anything.",
    "zero4.slowed": "The loop slows down.",
    "zero4.cantGoBack": "I can't go back now.",
    "zero4.sayLine": "Hold, and say your line to it.",
    "zero4.clockMoves": "Zero's clock moves, just a little. Then it ticks forward one more.",
    "zero4.awake": "…I dreamed about you.",
    // Fallback if the player never wrote a rebuttal on day 31 (shouldn't happen)
    "zero4.fallbackLine": "One time isn't everything.",
  },
  fn: {},
});
