// 状态：结构、默认值、迁移、localStorage 读写。只存本机。
(function () {
  const G = window.Game;
  // 开发模式用独立的存储键，走查不会污染真实存档。
  const KEY = G.config.devEnabled ? "clockfall.state.dev" : G.config.fastDayMinutes ? "clockfall.state.fast" : "clockfall.state";
  const VERSION = 1;

  function defaults() {
    return {
      version: VERSION,
      lang: null,
      startedAt: null, // 第一次进入城市的时间戳
      calendar: { completedSessions: [], lastOpenDay: 0, sessionDoneOnDay: {}, patrolDoneOnDay: {} },
      rescued: [],
      map: { cues: [], insistCount: 0, guessed: {} },
      ledger: { stops: [], weeklyScreen: [], clockTicks: 0, dailyTickCount: {} },
      player: {
        title: "stolen",
        autoStop: false,
        firstHoldStreak: 0,
        missStreak: 0,
        rebuttalLine: "",
        loop: { links: [], cutLink: null },
      },
      sessions: {},
      inProgress: null, // { sessionId, phase: 'main'|'endfight', startedAt }
      flags: {
        lateNightNoticeShown: false,
        safetyNetCount: 0,
        safetyNetShown: false,
        weeklyAsked: [],
        cueInviteSent: {},
        jarShadowShown: false,
        holdAlternative: false,
        playtest: false,
        sound: true, // Junwu 2026-10-11：默认打开，极轻；只跟着玩家自己的动作响，深夜更轻（Mark_to_Victoria_V006）
      },
      codex: {},
      events: [],
    };
  }

  // 迁移：migrations[n] 把版本 n 升到 n+1
  const migrations = {};

  function migrate(s) {
    let v = s.version || 0;
    while (v < VERSION) {
      if (migrations[v]) migrations[v](s);
      v++;
      s.version = v;
    }
    // 补齐新字段
    const d = defaults();
    for (const k in d) if (!(k in s)) s[k] = d[k];
    for (const k in d.flags) if (!(k in s.flags)) s.flags[k] = d.flags[k];
    for (const k in d.player) if (!(k in s.player)) s.player[k] = d.player[k];
    return s;
  }

  let state = null;

  function load() {
    let raw = null;
    try {
      raw = localStorage.getItem(KEY);
    } catch (e) {}
    if (raw) {
      try {
        state = migrate(JSON.parse(raw));
        return state;
      } catch (e) {}
    }
    state = defaults();
    return state;
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      return false;
    }
  }

  function get() {
    return state || load();
  }

  function update(fn) {
    fn(get());
    save();
    return state;
  }

  function replace(next) {
    state = migrate(next);
    save();
    return state;
  }

  function reset() {
    state = defaults();
    save();
    return state;
  }

  G.state = { KEY, VERSION, defaults, load, save, get, update, replace, reset };
})();
