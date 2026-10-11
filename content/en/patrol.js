// English content: patrol report, return to the city, "your clock", weekly screen time. Written independently.
// The patrol report only asks whether you noticed; every answer counts; "didn't hold" is still a valid report.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "patrol", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "city.return.eyebrow": "Back in the city",

    "patrol.eyebrow": "Patrol report",
    "patrol.question": "Since last time: did it show up? Did you notice?",
    "patrol.options": [
      { id: "noticed", label: "It did, and I noticed right then" },
      { id: "later", label: "It did, I realized afterwards" },
      { id: "nowRemember", label: "It did, I didn't notice, I'm remembering now" },
      { id: "notAppear", label: "It didn't show up" },
    ],
    "patrol.whichCue": "Where?",
    "patrol.otherCue": "Somewhere else",
    "patrol.reply.noticed": "Noticed it right then. That's the first step. Everything else starts there.",
    "patrol.reply.later": "Afterwards counts. The moment you realized was yours too.",
    "patrol.reply.nowRemember": "Remembering now is noticing now. Logged.",
    "patrol.reply.notAppear": "Then it didn't. Not every day has a demon in it.",
    "patrol.stoppedQ": "That time, did you hold first?",
    "patrol.stoppedYes": "I held",
    "patrol.stoppedNo": "I didn't",
    "patrol.stoppedReplyYes": "You held. Good.",
    "patrol.stoppedReplyNo": "Even without holding, it counts. You noticed. That already happened.",
    "patrol.reportAnother": "Report another",
    "patrol.done": "That's all",
    // From session 3: follow-up details, only after "noticed right then", all skippable
    "patrol.detailWhen": "Roughly when?",
    // Each option has a label (button) and a phrase (how it sits inside a sentence)
    "patrol.detailWhenOptions": [
      { label: "Morning", phrase: "in the morning" },
      { label: "Midday", phrase: "around midday" },
      { label: "Afternoon", phrase: "in the afternoon" },
      { label: "Early evening", phrase: "in the early evening" },
      { label: "Evening", phrase: "in the evening" },
      { label: "Late night", phrase: "late at night" },
    ],
    "patrol.detailWhat": "What were you doing?",
    "patrol.detailWhatOptions": [
      { label: "Homework", phrase: "in the middle of homework" },
      { label: "Eating", phrase: "while eating" },
      { label: "Lying down", phrase: "lying in bed" },
      { label: "Waiting for someone", phrase: "waiting for someone" },
      { label: "Walking", phrase: "walking somewhere" },
      { label: "In class", phrase: "in class" },
      { label: "Talking to someone", phrase: "talking to someone" },
      { label: "Can't tell", phrase: "" },
    ],
    "patrol.detailSkip": "Don't remember",
    // Weekly screen time (from week 2, once a week, skippable, no judgement)
    "patrol.weeklyScreenTime": "How much does your phone say you used it this week? Check Settings and put in a rough number, or skip it.",
    "patrol.howToFind": ["iPhone: Settings → Screen Time", "Android: Settings → Digital Wellbeing"],
    "patrol.weeklyUnit": "hours / week",
    "patrol.weeklySave": "Save",
    "patrol.weeklySkip": "Skip",

    // "Your clock" (session 2)
    "zero.yourClock": [
      "This is your clock. It's a little slow. Everyone's is. Yours isn't bad.",
      "You're from the clockkeeper's line. Only you can go into other people's dreams. That's why I came for you. First, the market.",
    ],
  },
  fn: {
    "zero.returnLine"({ session, clockDelta, lastPatrol }) {
      if (!session || session <= 1) return "You're here.";
      if (clockDelta > 0) return "The clock's a bit faster. That was you.";
      return "The clock's where it was. It never goes backwards.";
    },
    "patrol.cueLabel"({ when, where, mood, app }) {
      return [when, where, mood, app].filter(Boolean).join(" · ") || "that spot";
    },
  },
});
