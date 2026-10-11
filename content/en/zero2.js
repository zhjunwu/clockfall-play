// English content: Zero storyline, session 2 (day 28: Zero's red dot, Zero's map). Mark_V072, revisions Mary_V061, polish (zh) Fable 5.1.
// Zero's red dot is still and faint: this is a friend in trouble, not a temptation demo.
// Zero's map has a single cue (late night, under the clock tower, a little lonely, an old buddy). The loneliness is Zero's own and never shows up in a demon line aimed at the player.
// Ending: cliffhanger, with a custom flag that names the trick (making you worry about a character).
// Zero is always "it." Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "zero2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero2.dot": "In a corner of the market, there's a small red dot. Faint. Not blinking. Just there.",
    "zero2.recognizeQ": "Whose is it?",
    "zero2.options": [
      { id: "notice", label: "Just a regular notification" },
      { id: "chest", label: "The Chest Demon's" },
      { id: "zero", label: "It's Zero's" },
    ],
    "zero2.right": "It's Zero's. This used to be its job.",
    "zero2.lookAgain": "Look at the little tail again.",
    "zero2.foundMap": "There's a piece of paper under the red dot. Zero's handwriting.",
    "zero2.mapTitle": "Zero's demon map",
    "zero2.mapCells": [
      { id: "night", label: "When", value: "Late at night" },
      { id: "tower", label: "Where", value: "Under the clock tower" },
      { id: "lonely", label: "Mood", value: "A little lonely" },
      { id: "oldFriend", label: "What opened it", value: "An old buddy said “It's your one-year anniversary on the job”" },
    ],
    "zero2.mapNote": "I only sent one.",
    "zero2.howItHappened": ["Late at night, alone, in the old spot.", "An old buddy showed up and said today was a special day.", "And it thought: just one."],
    "zero2.earliestQ": "Like you did with your own map: which box on this one comes first?",
    "zero2.earliestDone": "When we find it, we'll start from that box.",
    "zero2.tower": ["At the top of the clock tower, a red light is on.", "It's still in the city."],
    "flag.cliffhangerZero": "I made you worry about a character so you'd come back. A lot of games do this.",
  },
  fn: {},
});
