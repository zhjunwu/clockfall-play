// 内容约定的机器可读版本（docs/content-contract.md 的代码形式）。
// 按里程碑逐步扩充；每种语言各自有"当前要求齐全"的里程碑列表（英文剧本在 M4 补齐）。
// checks.html 以此为准检查。
(function () {
  const G = window.Game;

  const enums = {
    hooks: ["cliffhanger", "progress", "collection", "escalation", "none"],
    patrolOptions: ["noticed", "later", "nowRemember", "notAppear"],
    doorKinds: ["count", "time", "feeling"],
    rebuttalSeeds: ["fact", "kind", "action"],
    chestRules: ["luck", "pause", "plan", "near", "random"],
    titles: ["stolen", "seer", "hunter1", "hunter2", "hunter3", "unbinder", "keeper"],
  };

  // M0：骨架、语言选择、设置、求助入口、存档码、日历、锁定
  const m0 = {
    ids: [
      "game.title", "lang.choose", "lang.switch", "lang.zh", "lang.en",
      "settings.title", "settings.close",
      "help.menuEntry", "help.notTherapy", "help.resources",
      "save.export", "save.import", "save.exportWarning", "save.importPrompt", "save.importOk", "save.importBad", "save.copy",
      "calendar.icon", "lock.notYet", "lock.catchUpOnePerDay",
      "city.enter", "city.doneForToday", "dev.title", "a11y.holdAlternative", "settings.sound", "settings.soundNote",
    ],
    fns: ["calendar.nextSession"],
  };

  // M1：宝箱魔第 1 局
  const m1 = {
    ids: [
      "talk.next", "talk.silence", "talk.leaveNow",
      "notice.title", "notice.body", "notice.open", "notice.ignore",
      "city.firstLook",
      "zero.whyTapped", "zero.iDidThat", "zero.whyNotTapped", "zero.whyYou", "zero.beforeMap", "zero.observeTask",
      "zero.teachStop", "zero.nameHookForYou", "zero.nextTimeYou",
      "map.intro", "map.title", "map.when.label", "map.where.label", "map.mood.label", "map.app.label", "map.who.label",
      "map.when", "map.where", "map.mood", "map.moodTauntable", "map.app", "map.who",
      "map.custom", "map.customPlaceholder", "map.done", "map.skip", "map.zeroGuess", "map.acceptGuess", "map.editGuess", "map.summary", "map.back", "map.next", "map.noCueRespect", "map.firstShadow",
      "flag.label", "flag.redDot", "flag.cliffhanger", "flag.cliffhangerQuiet", "flag.progress", "flag.collection", "flag.escalation", "flag.escalationTruth",
      "chest.mini.eyebrow", "chest.mini.title", "chest.mini.lead", "chest.mini.planQ", "chest.mini.start", "chest.mini.tap", "chest.mini.stop",
      "chest.mini.glowHint", "chest.mini.near", "chest.mini.nearSmall", "chest.mini.maxed",
      "chest.revealOpen", "chest.revealClose", "chest.revealGloat",
      "hold.prompt", "hold.altPrompt", "hold.holding", "hold.done",
      "gameDemon.firstMeet", "gameDemon.stepStop", "gameDemon.stepName", "gameDemon.stepChoose", "gameDemon.hookOptions",
      "gameDemon.btnLeave", "gameDemon.btnStay", "gameDemon.btnNoUrge", "gameDemon.nothingToStayFor", "gameDemon.noUrge",
      "gameDemon.setStayMinutes", "gameDemon.stayTimeUp", "gameDemon.closedIsLeave", "gameDemon.distractBtn", "gameDemon.recognized",
      "gameDemon.lateNight", "gameDemon.lateNightOnce", "gameDemon.leaveMeansSleep",
      "codex.title", "codex.empty",
      "playtest.export",
    ],
    fns: [
      "zero.guessCue", "zero.guessBasis", "zero.returnLine",
      "chest.mini.planBtn", "chest.mini.count", "chest.mini.result", "chest.revealLine", "chest.cliffLine",
      "gameDemonLine", "gameDemonDefeated",
    ],
  };

  // M2：宝箱魔第 2 局（巡逻报告、你的钟、看穿、修炼）
  const m2 = {
    ids: [
      "city.return.eyebrow",
      "patrol.eyebrow", "patrol.question", "patrol.options", "patrol.whichCue", "patrol.otherCue",
      "patrol.reply.noticed", "patrol.reply.later", "patrol.reply.nowRemember", "patrol.reply.notAppear",
      "patrol.stoppedQ", "patrol.stoppedYes", "patrol.stoppedNo", "patrol.stoppedReplyYes", "patrol.stoppedReplyNo",
      "patrol.reportAnother", "patrol.done",
      "zero.yourClock",
      "chest.xray.eyebrow", "chest.xray.title", "chest.xray.intro", "chest.xray.timeline",
      "chest.xray.legend.small", "chest.xray.legend.big", "chest.xray.legend.near", "chest.xray.legend.rigged",
      "chest.xray.rulesTitle", "chest.rules", "chest.xray.stat.actual", "chest.xray.stat.plan", "chest.xray.stat.time",
      "chest.xray.nameTitle", "chest.xray.name",
      "term.sourceLabel", "term.variableReward", "term.nearMiss", "term.labeling",
      "training.eyebrow", "training.title", "training.stopIntro", "training.setStopPoint", "training.youKnowNow",
      "training.reached", "training.holdNow", "training.held", "training.afterHold", "chest.afterHoldWhisper", "training.btnLeave", "training.btnExtend",
      "flag.extendOnce", "training.marketClosed", "training.summaryTitle",
      "jar.firstShadow", "zero.shooShadow",
      "zero.stopTask", "chest.progressCliff",
    ],
    fns: ["verdict", "ruleHit", "chest.xray.secs", "stopPointPrompt", "training.summary", "training.overTap", "patrol.cueLabel"],
  };

  // M3：宝箱魔第 3 局（决战、梦境、复苏、预告）、巡逻细节、巡逻日与小喽啰
  const m3 = {
    ids: [
      "patrol.detailWhen", "patrol.detailWhenOptions", "patrol.detailWhat", "patrol.detailWhatOptions", "patrol.detailSkip",
      "battle.eyebrow", "battle.intro", "battle.hpLabel", "battle.stepStop", "battle.stepRecognize", "battle.recognizeOptions",
      "battle.stepChoose", "battle.btnSetNumber", "battle.btnWalk", "battle.stage3bait", "battle.hit", "battle.crit", "battle.lateHit",
      "battle.readRight", "battle.misread", "battle.tappedHeal", "battle.round3Setup", "battle.round3Glow", "battle.finalBlow",
      "battle.shatter", "battle.zeroAfter", "battle.walked", "battle.openFirst",
      "title.earned", "title.stolen", "title.seer", "title.hunter1", "title.hunter2", "title.hunter3", "title.unbinder", "title.keeper", "status.autoStop",
      "baker.eyebrow", "baker.dreamIntro", "baker.dreamDefault", "baker.watch", "baker.nowHold", "baker.held", "baker.awake", "baker.strongerThanHim",
      "market.revived", "market.companion", "teaser.owl",
      "city.patrol", "city.patrolDone",
      "minion.eyebrow", "minion.intro", "minion.skip", "minion.holdFirst", "minion.whichOne", "minion.redDot", "minion.autoplay", "minion.streak",
      "minion.killed", "minion.escaped", "minion.done",
      "rescued.baker", "zero.patrolEnd", "alone.patrolLine",
    ],
    fns: ["demonTaunt", "demonQuotePatrol", "battle.attackLine", "battle.roundOf", "battle.zeroRebut", "companion.returnLine", "companion.patrolEnd"],
  };

  // M4：周屏幕时间
  const m4 = {
    ids: ["patrol.weeklyScreenTime", "patrol.howToFind", "patrol.weeklyUnit", "patrol.weeklySave", "patrol.weeklySkip"],
    fns: [],
  };

  // M5：夜枭第 1 局、安全网
  const m5 = {
    ids: [
      "owl.towerLit", "owl.zeroIntro", "owl.mini.eyebrow", "owl.day1.title", "owl.day.instruction", "owl.dayTasks", "owl.myTime", "owl.myTimeEmpty",
      "owl.night.title", "owl.night.intro", "owl.realLateNight", "owl.episodeCliff", "owl.sleepBtn", "owl.watchBtn", "owl.oneMoreBtn", "owl.playing", "owl.cuePrefill",
      "owl.day2.title", "owl.energy", "owl.night2.intro",
      "owl.revealFirstHalf", "owl.revealPause", "owl.mapAsk", "map.bedtimePlanned", "map.phoneDownActual", "map.timeOptions", "owl.mapDone",
      "owl.observeTask", "owl.cliff",
      "help.safetyMoods", "help.gentleCheck", "help.gentleCheckNeutral",
    ],
    fns: ["owl.episode", "owl.countdown", "owl.clock", "owl.tasksDone", "owl.nightSummary", "owl.day2.intro", "owl.day2.slower", "owl.daySlot", "owl.myTimeTotal", "owl.minutes"],
  };

  // M6：夜枭第 2 局（看穿、睡前仪式、白天 10 分钟）
  const m6 = {
    ids: [
      "owl.xray.eyebrow", "owl.xray.title", "owl.revealSecondHalf", "owl.xray.yourTwoDays", "owl.xray.line.myTime", "owl.xray.line.energy",
      "owl.xray.day1", "owl.xray.night1", "owl.xray.day2", "owl.xray.night2", "owl.xray.night2Sleep", "owl.xray.night2More",
      "owl.xray.buttonNoticed", "owl.xray.buttonMissed", "owl.xray.buttonReplyNoticed", "owl.xray.buttonReplyMissed", "owl.xray.buttonEarly",
      "owl.xray.cliffsTitle", "owl.xray.autoplayTitle", "owl.xray.nameTitle", "owl.xray.name", "term.bedtimeProcrastination",
      "owl.ritual.eyebrow", "owl.ritual.intro", "owl.ritual.lightsOutQ", "owl.ritual.lightsOutOptions", "owl.ritual.phoneWhereQ", "owl.ritual.phoneWhereOptions",
      "owl.ritual.waiting", "owl.ritual.waitingLate", "owl.ritual.timeUp", "owl.ritual.tempt", "owl.ritual.watch", "owl.ritual.oneMore", "owl.episodeUnknown", "owl.ritual.playing",
      "owl.ritual.doIt", "owl.ritual.phoneIcon",
      "owl.slice.eyebrow", "owl.slice.intro", "owl.slice.instruction", "owl.slice.block", "owl.slice.schedule",
      "owl.slice.placed", "owl.slice.owlLine", "owl.slice.zeroLine", "owl.task2",
    ],
    fns: ["owl.xray.rebut", "owl.xray.buttonLine", "owl.xray.noNextEpisode", "owl.xray.plays", "owl.xray.numbers", "owl.ritual.result", "owl.ritual.placeHint"],
  };

  // M7：夜枭第 3 局（决战、守夜人、钟楼复苏、长廊预告）
  const m7 = {
    ids: [
      "owl3.task.eyebrow", "owl3.task.q", "owl3.task.options", "owl3.task.skip", "owl3.task.nightQ", "owl3.task.nightOptions", "owl3.task.timeQ", "owl3.task.whereQ",
      "owl3.task.whereOther", "owl3.task.dontRemember", "owl3.task.reply.phone", "owl3.task.reply.slice", "owl3.task.reply.both", "owl3.task.reply.none", "owl3.task.reply.skip",
      "owl3.eyebrow", "owl3.intro", "owl3.lateNote", "owl3.hpLabel", "owl3.nights", "owl3.before", "owl3.timeUp", "owl3.oneMore", "owl3.playing", "owl3.stepStop",
      "owl3.n1.mechanic", "owl3.n1.bait", "owl3.n2.mechanic", "owl3.n2.bait", "owl3.n3.whisper", "owl3.n3.mechanicGrow", "owl3.n3.mechanicStuck", "owl3.n3.bait",
      "owl3.healed", "owl3.autoHealed", "owl3.hit", "owl3.crit", "owl3.lateHit", "owl3.stepRecognize", "owl3.moves", "owl3.readRight", "owl3.misread",
      "owl3.door.step", "owl3.door.icon", "owl3.door.done", "owl3.finalBlow", "owl3.deflate", "owl3.owlLast", "owl3.zeroLast", "owl3.zeroAfter",
      "watchman.eyebrow", "watchman.intro", "watchman.introDefault", "watchman.watch", "watchman.now", "watchman.again", "watchman.door", "watchman.early", "watchman.done",
      "watchman.awake", "watchman.fasterThanHim", "tower.revived", "tower.companion", "teaser.abyss",
    ],
    fns: ["owl3.whisper1", "owl3.whisper2", "owl3.zeroRebut", "owl3.n3.open", "owl3.countdown", "owl3.result", "owl3.doorHint", "owl3.doorLabel"],
  };

  // M8：无底渊第 1 局（长廊、估计对照、现形、地图、加码预告）
  const m8 = {
    ids: [
      "abyss.cityIntro", "abyss.zeroIntro", "abyss.eyebrow", "abyss.swipeHint", "abyss.exit", "abyss.subjects", "abyss.events", "abyss.endings", "abyss.stop",
      "abyss.guessTimeQ", "abyss.guessTimeOptions", "abyss.guessCardsQ", "abyss.guessCardsOptions", "abyss.exitedSelf",
      "abyss.endNotWall", "abyss.boast", "abyss.zeroAfter", "abyss.mapAsk", "abyss.cuePrefill", "abyss.feedApps", "abyss.mapDone", "abyss.task", "abyss.teaser",
      "flag.escalationAbyss",
    ],
    fns: ["abyss.card", "abyss.reveal", "abyss.guessTimeLine", "abyss.guessCardsLine"],
  };

  G.contract = {
    enums,
    milestones: { m0, m1, m2, m3, m4, m5, m6, m7, m8 },
    // 每种语言当前要求齐全的里程碑
    requiredByLang: { zh: ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m8"], en: ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7"] },
    idsFor(lang) {
      return (this.requiredByLang[lang] || []).flatMap((m) => this.milestones[m].ids);
    },
    fnsFor(lang) {
      return (this.requiredByLang[lang] || []).flatMap((m) => this.milestones[m].fns);
    },
  };
})();
