// English content: the Abyss (the hallway). Session 1 (day 17: stolen).
// The Abyss has one move: no bottom. Cards never advance on their own (autoplay is the Owl's move); they only move when the player swipes up.
// Every card is a finished little story, never a half sentence (that's the Owl's move too). The only pull is "there's more below."
// The guessing check uses the player's own numbers as evidence; no "studies show people underestimate time."
// Cards are all made up and don't look like any real app: no avatars, usernames, like counts, red dots, notifications, "new posts."
// Subjects stay in the same order as Chinese: Victoria's 12 card pictures are matched by n % 12.
// Rule: if a line would make the player want to come back, either flag it or don't write it, no matter who says it. Ending: escalation (flag.escalationAbyss).
// Written on its own in American English. Author: Claude (Mark)  Reviewer: (none)  Status: draft
const ABYSS_EN_SUBJECTS = ["An orange cat", "The baker downstairs", "An eighty-year-old skateboarder", "A crow that can open doors", "The kid on cleanup duty next door", "A lopsided tomato", "The corner store at 4 a.m.", "A goldfish that got lost", "The library's book-return box", "A lifeguard who can't swim", "A bus that only goes one stop", "A rooster that crows right on time"];
const ABYSS_EN_EVENTS = ["learned a new word", "was late for the first time", "lent an umbrella to a stranger", "practiced saying hello in a mirror", "turned up in a picture book", "found a key lost three years ago", "lost a hat to the wind", "decided to do nothing at all today", "counted every cloud in the sky", "misplaced a shadow for an afternoon", "got a letter with no name on it", "danced in the rain"];
const ABYSS_EN_ENDINGS = ["Then everyone went home to sleep.", "It was a windy day.", "After that, everyone forgot about it.", "That's all.", "The next day, everything was the same.", "Nobody thought it was strange.", "Dinner was noodles that night.", "Then it got dark.", "Somebody smiled about it.", "Nothing much happened after that.", "It was a Tuesday.", "Then someone had a glass of water."];

Game.content.register("en", "abyss", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- Back in the city ----
    "abyss.cityIntro": ["The clock tower rings the hour now. But on the far side of the city, there's a hallway that never closes.", "Nobody who goes in can tell you how long they were in there."],
    "abyss.zeroIntro": ["Go take a look. I'll wait at the entrance.", "...There was never a door there. I'll just stand where it starts."],

    // ---- The hallway mini-game ----
    "abyss.eyebrow": "The hallway",
    "abyss.swipeHint": "Swipe up",
    "abyss.exit": "Leave",
    "abyss.subjects": ABYSS_EN_SUBJECTS,
    "abyss.events": ABYSS_EN_EVENTS,
    "abyss.endings": ABYSS_EN_ENDINGS,
    "abyss.stop": "Wait.",

    // ---- Guess vs. real ----
    "abyss.guessTimeQ": "How long do you think you were in there?",
    // lo / hi in seconds; "close" allows half a step on either side (30 s)
    "abyss.guessTimeOptions": [
      { v: "lt1", label: "Under a minute", lo: 0, hi: 60 },
      { v: "1", label: "About a minute", lo: 60, hi: 90 },
      { v: "2", label: "About 2 minutes", lo: 90, hi: 150 },
      { v: "3", label: "About 3 minutes", lo: 150, hi: 240 },
      { v: "5", label: "5 minutes or more", lo: 240, hi: 100000 },
    ],
    "abyss.guessCardsQ": "How many cards did you see?",
    // Card counts; "close" allows half a step on either side (5 cards)
    "abyss.guessCardsOptions": [
      { v: "lt10", label: "Fewer than 10", lo: 0, hi: 9 },
      { v: "10", label: "10 to 20", lo: 10, hi: 20 },
      { v: "20", label: "21 to 40", lo: 21, hi: 40 },
      { v: "40", label: "41 to 60", lo: 41, hi: 60 },
      { v: "60", label: "More than 60", lo: 61, hi: 100000 },
    ],
    "abyss.exitedSelf": "You walked out on your own. No bottom, and you still walked out.",

    // ---- The reveal ----
    "abyss.endNotWall": "The end of the hallway isn't a wall. It's more hallway.",
    "abyss.boast": ["I didn't steal anything from you.", "I only took one thing: “the end.”", "A book has a last page. A meal gets finished. An episode has credits. I don't."],
    "abyss.zeroAfter": "It doesn't have to pull you. It just has to keep you from finding a place to stop.",

    // ---- Map: when you scroll ----
    "abyss.mapAsk": "Where do you scroll? When?",
    "abyss.cuePrefill": { app: "The feed" },
    // If the map already has a cue with one of these apps, skip the invite
    "abyss.feedApps": ["Short videos", "The feed", "Streams"],
    "abyss.mapDone": "Got it.",

    // ---- Real-world task: just notice ----
    "abyss.task": ["Just one thing this time.", "Next time you finish scrolling, guess how long it was before you check the real time.", "You don't have to scroll less. Guess, then look. Come tell me how far off you were."],

    // ---- Ending (endHook: escalation) ----
    "abyss.teaser": "Next time, I'll open three hallways for you.",
    "flag.escalationAbyss": "“More next time” is how you get someone looking forward to it right now. That's escalation.",
  },
  fn: {
    // Card n (from 0): returns [story, ending]. Combinations, not real content.
    "abyss.card"({ n }) {
      const S = ABYSS_EN_SUBJECTS, E = ABYSS_EN_EVENTS, N = ABYSS_EN_ENDINGS;
      const s = S[n % S.length], e = E[(n * 5 + Math.floor(n / S.length)) % E.length], end = N[(n * 7 + 3) % N.length];
      return [`${s} ${e}.`, end];
    },
    "abyss.reveal"({ sec, n }) {
      const m = Math.floor(sec / 60), s = sec % 60;
      const t = m ? `${m} ${m === 1 ? "minute" : "minutes"} ${s} seconds` : `${s} seconds`;
      return `You were in there for ${t} and saw ${n} ${n === 1 ? "card" : "cards"}.`;
    },
    "abyss.guessTimeLine"({ result }) {
      if (result === "less") return "Your time guess was lower than the real time.";
      if (result === "more") return "Your time guess was higher than the real time.";
      return "Your time guess was right on.";
    },
    "abyss.guessCardsLine"({ result }) {
      if (result === "less") return "You guessed fewer cards than you saw.";
      if (result === "more") return "You guessed more cards than you saw.";
      return "Your card guess was right on.";
    },
  },
});
