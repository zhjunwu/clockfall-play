// English content: Zero, the demon map, and the flag cards. Written independently for English-speaking teens;
// not a translation of the Chinese. Zero talks short and straight, never preaches. Flags are the game owning up, not lecturing.
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "zero", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Opening: a screen that looks like a notification ----
    "notice.title": "Clockfall",
    "notice.body": "Someone's waiting for you.",
    "notice.open": "Open it",
    "notice.ignore": "Ignore it",

    // ---- First look at the city ----
    // Don't say "screen": the square glint in the hollow people's eyes says it for us.
    "city.firstLook": [
      "Grey. All of it.",
      "There are people in the street, but nobody is walking. They stand there with a small square of light in their eyes.",
      "The great clock in the middle of the city is still going. Slowly.",
    ],
    "zero.whyTapped": "Why did you open that?",
    "zero.iDidThat": [
      "...Because I made you.",
      "I'm Zero. That used to be my job: dropping red dots. Three thousand a day. Whoever saw one, tapped it.",
      "I quit. But that one just now was the last one. I had to get you in here.",
    ],
    // Player chose "Ignore it"
    "zero.whyNotTapped": [
      "You didn't tap it. That's rare. Most people do.",
      "I'm Zero. That red dot was mine. It used to be my job, three thousand a day.",
      "I quit. And since you wouldn't come to me, I came to you.",
    ],
    "zero.whyYou": [
      "Everyone in this city has had their time stolen. Not by one thing. By a crew.",
      "I'll show you the first one. It's in the market.",
    ],

    // ---- After the reveal: into the map ----
    "zero.beforeMap": ["Don't listen to it right now.", "Tell me one thing first: out there, in real life, where does it find you?"],

    // ---- The demon map ----
    "map.intro": "Demons don't just show up. They pick a time, a place, a mood. What are yours?",
    "map.title": "My demon map",
    "map.when.label": "When",
    "map.where.label": "Where",
    "map.mood.label": "How you're feeling",
    "map.app.label": "What you open",
    "map.who.label": "Who's around",
    "map.when": ["In bed before sleep", "Stuck on homework", "Right after waking up", "While eating", "Between classes", "On the way home", "Weekend afternoon", "Woke up in the night"],
    "map.where": ["Bed", "Desk", "Couch", "Bathroom", "Bus or train", "Classroom", "Dinner table"],
    // Moods: neutral first, some positive, always a "can't tell", no clinical words
    // Demons may only quote these moods (neutral or tired). Lonely, stressed, can't sleep, or custom text never go into a demon line.
    "map.moodTauntable": ["Bored", "Tired", "Avoiding something", "Annoyed", "Just finished something"],
    "map.mood": ["Bored", "Tired", "Avoiding something", "Stressed", "Annoyed", "A bit lonely", "Happy, want to chill", "Just finished something", "Can't sleep", "Can't tell"],
    "map.app": ["Short videos", "Games", "Messages", "Shows", "The feed", "Streams", "Shopping apps"],
    "map.who": ["Alone", "Family", "Classmates", "Friends"],
    "map.custom": "Something else",
    "map.customPlaceholder": "e.g. waiting for the bus",
    "map.done": "That's the one",
    "map.skip": "I'd rather not",
    "map.zeroGuess": "Want me to guess? You can fix it.",
    "map.acceptGuess": "Close enough",
    "map.editGuess": "Fix it",
    "map.summary": "Like this?",
    "map.back": "Start over",
    "map.next": "Next",
    "map.noCueRespect": "No demon, then. Some people really don't have one. Noted.",
    "map.firstShadow": "A shadow rises on the map. Right where you said.",

    // ---- Real-world task after session 1: notice, nothing more ----
    "zero.observeTask": ["Next time it shows up, you don't have to resist.", "Just notice one thing: it's here.", "Then come back and tell me."],

    // ---- Flag cards ----
    "flag.redDot": "That red dot was mine. It has one job: make you tap.",
    "flag.cliffhanger": "I stopped the story halfway on purpose. I want you to come back.",
    "flag.cliffhangerQuiet": "That scene was a cliffhanger.",
    "flag.progress": "One lamp left. That \"almost there\" feeling is something I built.",
    "flag.collection": "There's an empty page in the codex. Empty slots make people want to fill them. I know.",
    "flag.escalation": "An extra minute, and a gift on top? Yes. That's the upsell.",
    "flag.escalationTruth": "You'd have got that page tomorrow anyway. I just wanted staying to feel like the only way not to lose it.",
    "flag.label": "Cards on the table",
  },
  fn: {
    // Zero guesses a cue from the time of day
    "zero.guessCue"({ hourOfDay }) {
      const h = hourOfDay == null ? 21 : hourOfDay;
      if (h >= 22 || h < 6) return { when: "In bed before sleep", where: "Bed", mood: "Can't sleep", app: "Short videos" };
      if (h >= 6 && h < 9) return { when: "Right after waking up", where: "Bed", mood: "Avoiding something", app: "The feed" };
      if (h >= 9 && h < 12) return { when: "Between classes", where: "Classroom", mood: "Bored", app: "Short videos" };
      if (h >= 12 && h < 14) return { when: "While eating", where: "Dinner table", mood: "Bored", app: "Short videos" };
      if (h >= 14 && h < 18) return { when: "On the way home", where: "Bus or train", mood: "Tired", app: "Games" };
      return { when: "Stuck on homework", where: "Desk", mood: "Annoyed", app: "Short videos" };
    },
    // Zero says what the guess is based on: a small card on the table. Only the time, never "most people".
    "zero.guessBasis"({ hourOfDay }) {
      const h = hourOfDay == null ? 21 : hourOfDay;
      if (h >= 22 || h < 6) return "It's late, so I'm guessing: in bed, can't sleep, short videos. Fix it if I'm wrong.";
      if (h >= 6 && h < 9) return "It's morning, so I'm guessing: just woke up, still in bed, not ready to get up, the feed. Fix it if I'm wrong.";
      if (h >= 9 && h < 12) return "It's school hours, so I'm guessing: between classes, in the classroom, bored, short videos. Fix it if I'm wrong.";
      if (h >= 12 && h < 14) return "It's lunchtime, so I'm guessing: eating, bored, short videos. Fix it if I'm wrong.";
      if (h >= 14 && h < 18) return "It's the afternoon, so I'm guessing: on the way home, tired, games. Fix it if I'm wrong.";
      return "It's evening, so I'm guessing: stuck on homework, at your desk, annoyed, short videos. Fix it if I'm wrong.";
    },
  },
});
