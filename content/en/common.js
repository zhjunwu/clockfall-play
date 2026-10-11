// English content library: common strings (M0). Written independently; not a translation of the Chinese.
// Author: Claude (Mark)  Reviewer: (none)  Status: draft
Game.content.register("en", "common", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "game.title": "Clockfall",
    "lang.choose": "Choose a language",
    "lang.switch": "Language",
    "lang.zh": "中文",
    "lang.en": "English",
    "settings.title": "Settings",
    "settings.close": "Back",
    "calendar.icon": "Calendar",
    "lock.notYet": "This part isn't here yet.",
    "lock.catchUpOnePerDay": "You've done today's part.",
    "city.enter": "Enter the city",
    "city.doneForToday": "That's it for today.",
    "save.export": "Export save code",
    "save.exportWarning": "Your save code contains things you wrote. Keep it to yourself.",
    "save.import": "Import save code",
    "save.importPrompt": "Paste your save code here",
    "save.importOk": "Loaded.",
    "save.importBad": "That doesn't look like a save code. Check it and try again.",
    "save.copy": "Copy",
    "dev.title": "Dev",
    "a11y.holdAlternative": "Double-tap instead of holding",
    "settings.sound": "Sound",
    "settings.soundNote": "Very soft, and only when you tap or hold. Even softer late at night. Turn it off anytime.",
    "talk.next": "Go on",
    "talk.silence": "...",
    "talk.leaveNow": "Go",
    "codex.title": "Demon codex",
    "codex.empty": "Still empty.",
    "playtest.export": "Export playtest data",
    // Titles (in-game events only) and the "auto-stop" status (shown separately)
    "title.earned": "You are now",
    "title.stolen": "Pickpocketed",
    "title.seer": "Seer",
    "title.hunter1": "Hunter · I",
    "title.hunter2": "Hunter · II",
    "title.hunter3": "Hunter · III",
    "title.unbinder": "Unbinder",
    "title.keeper": "Clockkeeper",
    "status.autoStop": "auto-stop",
  },
  fn: {
    "calendar.nextSession"({ day, today }) {
      if (!day) return "Nothing more is scheduled.";
      if (today != null && day <= today) return "The next part is open today.";
      const left = today != null ? day - today : null;
      if (left === 1) return "Next part: tomorrow.";
      return `Next part: day ${day}.`;
    },
  },
});
