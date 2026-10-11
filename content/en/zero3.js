// English content: Zero storyline, session 3 (day 31: the rebuttal fight). Mark_V072, revisions Mary_V061, polish (zh) Fable 5.1.
// The Jar Demon's first real appearance (the abstinence-violation effect: after one slip, "might as well…").
// Pick a rebuttal (three angles, never labeled), make it your own with word blocks (2 swappable spots; typing box closed by default),
// and say it to the Jar (hold) three times. Vow branch: "never again" etc. → the Jar laughs; Zero's first words: "No promises. Just say what you're doing now."
// The Jar doesn't break (it will come back; that's true). Ends on Zero: "...Say that again." endHook: none.
// The player's sentence stays on the device only (player.rebuttalLine), never in the log. Reviewer: please check the vow wording.
// Every word-block combination must read correctly. Zero is "it." Written on its own in American English. Author: Claude (Mark)  Status: draft
Game.content.register("en", "zero3", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero3.eyebrow": "Under the clock tower",
    "zero3.found": "Under the clock tower, Zero is crouched in the corner. The dot on its chest is glowing red.",
    "zero3.zeroAway": "Stay back. There's no going back for me.",
    "zero3.jarEnter": ["See? It's already cracked.", "Once a jar is cracked, what's one more fall?"],
    "zero3.zeroTrail": "Might as well…",
    "zero3.pickQ": "Say something back. Pick the one that sounds most like you.",
    // Three candidates; { opts } are swappable word blocks (tap to cycle), the first is the default
    "zero3.candidates": [
      { id: "fact", parts: [{ opts: ["One time", "Yesterday", "This once"] }, " isn't ", { opts: ["everything", "the whole story", "forever"] }, "."] },
      { id: "kind", parts: [{ opts: ["If a friend", "If a classmate", "If someone I care about"] }, " slipped up, I wouldn't say they're done for. ", { opts: ["So I won't say it to myself", "Same goes for me", "I deserve the same"] }, "."] },
      { id: "act", parts: [{ opts: ["Stopping now", "Stopping right here", "Stopping this minute"] }, " is closer than stopping ", { opts: ["tomorrow", "next time", "someday"] }, "."] },
    ],
    "zero3.editHint": "Tap the underlined words to swap them for something you'd say.",
    "zero3.typeToggle": "Write it my own way",
    "zero3.typePlaceholder": "Write here (it stays on your phone)",
    "zero3.useIt": "Use this",
    "zero3.sayIt": "Say it out loud",
    "zero3.editAgain": "Change it",
    "zero3.cracked": "The crack in the jar gets a little wider.",
    "zero3.jarAgain": ["Didn't you say that last time?", "It's already ruined. Might as well let go."],
    // Vow branch: any of these in the sentence
    "zero3.vowWords": ["never again", "Never again", "never ever", "Never ever", "I'll never", "I will never", "won't ever"],
    "zero3.jarVow": "Never again? Then the next time you slip, I get to come back.",
    "zero3.zeroVow": "No promises. Just say what you're doing now.",
    "zero3.jarLeave": ["The Jar Demon shrinks back into the corner.", "It didn't break. It'll be back. But right now, it can't say a thing."],
    "zero3.zeroAsk": "…Say that again.",
  },
  fn: {},
});
