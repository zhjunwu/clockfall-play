// English content: Zero storyline, session 5 (day 36: Zero comes back). Mark_V072, revisions Mary_V061, polish (zh) Fable 5.1.
// Zero's clock didn't reset; it just stopped for a while (consistent with A4: the clock never runs backward).
// Day 36 is Zero's line about itself; the line for the player is the one Zero gives for whenever they slip.
// Companions only say welcome back. Zero hands the player's day-31 line back. Last: the rule for the next patrols (no "three days"). endHook: none.
// Zero is "it." Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "zero5", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero5.back": ["Zero is standing where it always stands.", "The dot on its chest has gone back to dark red."],
    "zero5.shorter": "The way back was shorter this time.",
    "zero5.clock": "On Zero's little clock there's a gray stretch where it stopped. After the gray, it keeps going.",
    "zero5.notErased": "The days I stopped didn't wipe out the ones before.",
    "zero5.forYou": "If you ever slip, remember this: every time you stopped still counts.",
    "zero5.welcome": { baker: "Welcome back.", watchman: "That lamp under the tower? I turned it off for you.", messenger: "Your map. I brought it back for you." },
    "zero5.giveBack": "This line is yours. Keep it.",
    "zero5.ownPatrol": "From here on, you patrol on your own. I'm around. I just won't talk.",
  },
  fn: {},
});
