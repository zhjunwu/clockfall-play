// 中文剧本库：公共文字（M0）。独立撰写，不是英文的翻译。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "common", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "game.title": "晨钟堡",
    "lang.choose": "选择语言",
    "lang.switch": "语言",
    "lang.zh": "中文",
    "lang.en": "English",
    "settings.title": "设置",
    "settings.close": "返回",
    "calendar.icon": "日历",
    "lock.notYet": "这一局还在路上。",
    "lock.catchUpOnePerDay": "今天的一局已经打完了。",
    "city.enter": "进城",
    "city.doneForToday": "今天就到这里。",
    "talk.next": "继续",
    "talk.silence": "……",
    "talk.leaveNow": "走",
    "codex.title": "魔鬼图鉴",
    "codex.empty": "还是空的。",
    "playtest.export": "导出试玩数据",
    // 称号（只看游戏内事件）与"自动停"状态（分开显示）
    "title.earned": "你现在是",
    "title.stolen": "被偷者",
    "title.seer": "看破者",
    "title.hunter1": "猎魔人 · 一",
    "title.hunter2": "猎魔人 · 二",
    "title.hunter3": "猎魔人 · 三",
    "title.unbinder": "解缚者",
    "title.keeper": "守时人",
    "status.autoStop": "自动停",
    "a11y.holdAlternative": "用点两下代替长按",
    "settings.sound": "声音",
    "settings.soundNote": "很轻，只在你点、按住的时候响。深夜会更轻。不想要就关掉。",
    "save.export": "导出存档码",
    "save.exportWarning": "存档码里有你写的话。只给你自己用，别发给别人。",
    "save.import": "导入存档码",
    "save.importPrompt": "把存档码粘贴到这里",
    "save.importOk": "读进来了。",
    "save.importBad": "这段不像存档码，再检查一下。",
    "save.copy": "复制",
    "dev.title": "开发",
  },
  fn: {
    // 日历图标点开后的说明。零不主动预告，只有玩家点开才看到。
    "calendar.nextSession"({ day, today }) {
      if (!day) return "没有下一局了。";
      if (today != null && day <= today) return "下一局今天就能打。";
      const left = today != null ? day - today : null;
      if (left === 1) return "下一局：明天。";
      if (left === 2) return "下一局：后天。";
      return `下一局：第 ${day} 天。`;
    },
  },
});
