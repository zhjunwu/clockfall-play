// English content: Zero storyline, session 1 (day 26: Zero's spot is empty). Mark_V072, revisions Mary_V061.
// Red line: Zero's relapse is never because the player wasn't there; no line may suggest "you weren't here, so it fell back."
// No chasing Zero, no previews ("we'll deal with it later," not "in a couple of days"); no rewarding attendance.
// The end fight has no hints from Zero; after naming the hook correctly the narrator says "You already know how." Naming it wrong gets nothing extra. endHook: none.
// Zero is always "it." Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "zero1", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero1.absent": "Zero isn't here. The spot where it usually stands is empty.",
    "zero1.notToday": "Today we just patrol. Zero's business can wait.",
    "zero1.market": ["The market's open. The baker's oven is warm.", "Someone stood at a stall for a while, bought a loaf, and left."],
    "zero1.youKnowIt": "You already know how.",
  },
  fn: {
    "zero1.companionNews"({ who }) {
      if (who === "baker") return ["It was alone under the clock tower last night. I called out to it. It didn't turn around.", "It's not here. The city still is."];
      return ["Someone saw it alone under the clock tower last night.", "It's not here. The city still is."];
    },
  },
});
