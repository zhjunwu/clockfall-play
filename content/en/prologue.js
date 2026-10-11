// English content: the opening story (plays once on first launch; can be replayed from Settings). Requested by Junwu 2026-10-11; proposal Mark_V052, revisions Mary_V044; wording merges Mary_V046 and the writing agent's draft (core: the clock reminds you "this moment is yours"; a pendulum stops before it comes back).
// It only serves "start now": no teasers of specific sessions, no day counts, no rewards; Zero doesn't appear (its message comes right after). The last page is an honest disclosure plus the way out.
// At most two sentences per page. Written on its own in American English, not translated.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft (design review passed in Mary_V047; final polish by Fable 5.1, approved by Junwu 2026-10-11; Junwu read the final text, no changes)
Game.content.register("en", "prologue", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "prologue.pages": [
      { art: "clock", lines: ["No one in Clockfall ever checked a watch.", "One chime, and the bread came out warm; another, and the lamps went out and the city slept."] },
      { art: "bell", lines: ["The great clock didn't measure time.", "With every chime, it simply reminded everyone: this moment is yours."] },
      { art: "demons", lines: ["Then the demons came, small and slippery. They didn't rob anyone or burn anything.", "They only borrowed: a minute, an evening, again and again. Nothing they borrowed ever came back."] },
      { art: "hollow", lines: ["The great clock slowed, and people's eyes held nothing but a small square of cold light.", "They stopped baking, stopped talking, and their dreams all stopped at the same moment."] },
      { art: "districts", lines: ["In the market, people crowded around the treasure chests, and no one would be the first to leave. In the clock tower, the lights burned all night.", "Across the city, a hallway went on and on, and nobody had ever reached the end."] },
      { art: "hero", lines: ["Some of your time was borrowed, too.", "But you come from the clockkeepers: you can step into other people's dreams and, at the moment that matters most, stop beside them."] },
      { art: "pendulum", lines: ["At the far end of its arc, a pendulum stops for an instant before it comes back.", "Stopping isn't losing. It's how you take the moment back."] },
      { art: "way", lines: ["You don't have to beat anyone or become anyone. Just see through the demons' tricks: stop, name the trick, then choose for yourself.", "Each person you bring back wakes the city a little."] },
      { art: "dawn", lines: ["Someday, some morning, the great clock will ring again.", "Then time will go back to the people it belongs to."] },
      { art: "flag", flag: true, lines: ["An honest word before you go in: this game uses the demons' tricks too, and every time it does, it will tell you.", "You can leave whenever you want."] },
    ],
    "prologue.next": "Go on",
    "prologue.enter": "Enter the city",
    "prologue.skip": "Skip",
    "settings.prologue": "The opening story",
  },
  fn: {},
});
