// English glossary. Each entry: name (standard term), teen (what we call it to players), definition (one line), source.
// Definitions never claim more than the evidence: animal studies are called animal studies, gambling research is called gambling research.
// Referenced from scripts as {term:variableReward}; rendered as "teen", tap to see the definition; source folded by default.
// Psychology wording must be checked by a reviewer before "reviewed". Entry list: docs/content-contract.md section 4.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "glossary", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "term.sourceLabel": "Source",
    "term.variableReward": {
      name: "Variable-ratio reinforcement",
      teen: "a maybe-reward",
      definition: "When a reward doesn't come every time and you can't tell which time it will, the behavior tends to happen more often and is harder to stop. This was first shown in animal experiments; similar patterns have since been seen in people.",
      source: "Ferster & Skinner (1957), operant conditioning schedules. Wording to be verified by a reviewer.",
    },
    "term.nearMiss": {
      name: "Near-miss effect",
      teen: "near-miss",
      definition: "A \"nearly won\" is really a loss; it pays nothing. But people tend to feel they almost had it, and want another go. Most of the evidence comes from gambling research.",
      source: "Near-miss studies in gambling research (e.g. Reid, 1986; Clark et al., 2009). Wording to be verified by a reviewer.",
    },
    "term.bedtimeProcrastination": {
      name: "Bedtime procrastination",
      teen: "bedtime procrastination",
      definition: "Putting off going to bed again and again, even though nothing is stopping you and you know it's time to sleep. A lot of people describe it as \"none of the day is mine, only the night is.\" That feeling is often called \"revenge bedtime procrastination\"; the phrase mostly comes from interviews and popular discussion, and isn't an established finding.",
      source: "Kroese et al. (2014) introduced the concept of bedtime procrastination. Origin of the \"revenge\" phrase to be verified by a reviewer.",
    },
    "term.labeling": {
      name: "Affect labeling",
      teen: "naming it",
      definition: "Putting a word on what you're feeling right now has been found to take some of the edge off the feeling. Applied to an urge, it's a common awareness exercise in mindfulness-based relapse prevention: it doesn't make the urge go away, but it opens a small gap between wanting to and doing it.",
      source: "Affect labeling research (e.g. Lieberman et al., 2007); awareness practice in mindfulness-based relapse prevention (Marlatt and colleagues). Wording to be verified by a reviewer.",
    },
  },
});
