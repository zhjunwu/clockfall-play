// 试玩事件日志。只记选项 ID、时长、计数；绝不记自由文本。只存本机，由玩家自己导出。
(function () {
  const G = window.Game;

  // 允许写入的字段白名单。check_boundaries.py 会核对这里的列表。
  const ALLOWED = [
    "type", "at", "day", "lateNight", "sessionId", "phase",
    "ms", "holdMs", "appearToHoldMs", "held", "released", "surfSec",
    "hook", "answer", "correct", "choice", "stayMin", "stayOnTime",
    "option", "skipped", "accepted", "count", "tick", "lang", "titleId",
  ];

  // 默认关闭。?playtest=1 开启并持久化到 flags.playtest；只在试玩模式下记录与导出。
  function isEnabled() {
    try {
      const s = G.state.get();
      if (G.config.playtestParam && !s.flags.playtest) G.state.update((x) => (x.flags.playtest = true));
      return !!s.flags.playtest;
    } catch (e) {
      return false;
    }
  }

  function log(type, data) {
    if (!isEnabled()) return;
    const e = { type, at: Date.now() };
    try {
      e.day = G.clock.today();
      e.lateNight = G.clock.isLateNight();
    } catch (x) {}
    if (data) {
      for (const k in data) {
        if (ALLOWED.includes(k) && typeof data[k] !== "object") e[k] = data[k];
      }
    }
    G.state.update((s) => {
      s.events.push(e);
      if (s.events.length > 5000) s.events.splice(0, s.events.length - 5000);
    });
  }

  function exportText() {
    const s = G.state.get();
    return JSON.stringify({ version: s.version, lang: s.lang, events: s.events });
  }

  function clear() {
    G.state.update((s) => (s.events = []));
  }

  G.events = {
    ALLOWED,
    log,
    exportText,
    clear,
    get enabled() { return isEnabled(); },
  };
})();
