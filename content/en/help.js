// English content library: safety net and help resources. Entries must be verified by a reviewer before "reviewed".
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "help", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "help.menuEntry": "Need help?",
    // Safety net: shown once, gently, by whoever is present; never a diagnosis
    "help.safetyMoods": ["A bit lonely"],
    "help.gentleCheck": ["One thing, and then I won't bring it up again.", "It sounds like things have been rough lately. That isn't something a trick fixes. \"Need help?\" is always in Settings, and these are open any time."],
    "help.gentleCheckNeutral": ["It sounds like things have been rough lately. That isn't something a trick fixes.", "\"Need help?\" is always in Settings, and these are open any time."],
    "help.notTherapy": [
      "This game is about phones and attention. It isn't therapy, and it can't replace it.",
      "If you've been feeling low a lot, can't sleep, or don't want to talk to anyone, that's not something a trick can fix. Talk to an adult you trust, or use one of these.",
    ],
    // Verified by Junwu 2026-10-11 against public sources (988, Crisis Text Line, findahelpline.com).
    "help.resources": [
      { name: "988 Suicide & Crisis Lifeline (US)", how: "Call or text 988", tel: "988" },
      { name: "Crisis Text Line (US)", how: "Text HOME to 741741" },
      { name: "Outside the US", how: "findahelpline.com lists helplines by country" },
      { name: "Emergency", how: "Call your local emergency number" },
    ],
  },
});
