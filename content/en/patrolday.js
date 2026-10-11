// English content: patrol days (days with no main session): minions, news from the rescued, a closing line. No hooks.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "patrolday", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "city.patrol": "Patrol",
    "city.patrolDone": "You've patrolled today.",
    "minion.eyebrow": "Small things in the streets",
    "minion.intro": "A few minions. Hold and they freeze; name one and it's gone. Get the name wrong and it just runs off.",
    "minion.skip": "Leave them",
    "minion.holdFirst": "Hold first",
    "minion.whichOne": "What is it?",
    "minion.redDot": "Red dot",
    "minion.autoplay": "Autoplay countdown",
    "minion.streak": "Streak flame",
    "minion.killed": "Gone.",
    "minion.escaped": "It ran off. That's fine.",
    "minion.done": "All clear.",
    // Independent little scenes, never a serial
    "rescued.baker": [
      "The baker made walnut bread today.",
      "The baker's asleep in front of his stall.",
      "The baker left a loaf at the foot of the bell tower. Didn't say who it was for.",
      "The baker's teaching a kid to knead.",
    ],
    "zero.patrolEnd": ["Patrol's done.", "The city's still here. So are you."],
    "alone.patrolLine": "The city is quiet. The clock is running.",
  },
  fn: {
    // While Zero is missing (days 26–35): a small pool, random, no nudging, no previews
    "companion.returnLine"({ who }) {
      const baker = [
        "Zero's not here. The place is empty. I'm keeping an eye on the market for it.",
        "No sign of Zero yet. I've kept the oven going.",
        "There was a light over by the bell tower last night. Don't know if it was Zero.",
        "You're here. Zero isn't back.",
      ];
      if (who === "baker") return baker;
      return "Zero's not here.";
    },
    // Only the present, never tomorrow
    "companion.patrolEnd"({ who }) {
      if (who === "baker") return "That's today. The oven's still warm.";
      return "That's today.";
    },
  },
});
