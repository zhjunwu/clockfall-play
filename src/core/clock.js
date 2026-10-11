// 时间规则：游戏日（06:00 边界）、解锁、深夜窗口、周。全部按设备本地时间。
// 纯函数部分（带 _ 前缀的）不读状态，便于在 checks.html 里测试。
(function () {
  const G = window.Game;
  const DAY = 86400000;

  function cfg() {
    return G.config;
  }

  // 开发用时间旅行：?dev=1&day=6&hour=23。只在 devEnabled 时生效。
  function devOverride() {
    if (!cfg().devEnabled) return null;
    const q = new URLSearchParams(location.search);
    if (q.get("dev") !== "1") return null;
    const day = parseInt(q.get("day") || "", 10);
    const hour = parseInt(q.get("hour") || "", 10);
    if (!Number.isFinite(day)) return null;
    return { day, hour: Number.isFinite(hour) ? hour : 12 };
  }

  // 某个时间戳所在"游戏日"的起点（当天或前一天的 06:00）
  function _dayStart(ts, startHour) {
    const d = new Date(ts);
    const start = new Date(d.getFullYear(), d.getMonth(), d.getDate(), startHour, 0, 0, 0);
    if (d.getTime() < start.getTime()) start.setDate(start.getDate() - 1);
    return start.getTime();
  }

  // 第几天：第 1 天的起点是 startedAt 所在游戏日的 06:00
  function _dayOf(nowTs, startedAt, startHour) {
    const first = _dayStart(startedAt, startHour);
    const cur = _dayStart(nowTs, startHour);
    // 用日历日差，避免夏令时导致的非整日
    const a = new Date(first), b = new Date(cur);
    const days = Math.round((Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) / DAY);
    return days + 1;
  }

  function _isLateNight(ts, fromHour, startHour) {
    const h = new Date(ts).getHours();
    return h >= fromHour || h < startHour;
  }

  function _weekOf(day) {
    return Math.ceil(day / 7);
  }

  // 当前时间（含开发覆盖）
  function now() {
    const o = devOverride();
    const s = G.state.get();
    if (o && s.startedAt) {
      const first = _dayStart(s.startedAt, cfg().dayStartHour);
      const d = new Date(first);
      d.setDate(d.getDate() + (o.day - 1));
      d.setHours(o.hour, 0, 0, 0);
      // hour < 06 属于前一个游戏日的深夜；day 指游戏日，所以 hour<6 要加一天
      if (o.hour < cfg().dayStartHour) d.setDate(d.getDate() + 1);
      return d.getTime();
    }
    return Date.now();
  }

  // 当前游戏日（真实玩家只增不减；开发覆盖时直接取覆盖值，便于来回走查）。每次屏幕切换都应调用 touch()。
  function today() {
    const s = G.state.get();
    if (!s.startedAt) return 0;
    const d = _dayOf(now(), s.startedAt, cfg().dayStartHour);
    if (devOverride()) return d;
    return Math.max(d, s.calendar.lastOpenDay || 0);
  }

  function touch() {
    const d = today();
    if (devOverride()) return d;
    const s = G.state.get();
    if (d > (s.calendar.lastOpenDay || 0)) G.state.update((x) => (x.calendar.lastOpenDay = d));
    return d;
  }

  function isLateNight() {
    return _isLateNight(now(), cfg().lateNightFrom, cfg().dayStartHour);
  }

  function weekOf(day) {
    return _weekOf(day == null ? today() : day);
  }

  // 解锁判断：今天 ≥ 最早可玩日，今天还没完成主线局，前一局已完成
  function canPlay(session) {
    const s = G.state.get();
    const d = today();
    const sched = G.schedule.list;
    const idx = sched.findIndex((x) => x.id === session.id);
    const done = s.calendar.completedSessions;
    if (done.includes(session.id)) return { ok: false, why: "done" };
    if (idx > 0 && !done.includes(sched[idx - 1].id)) return { ok: false, why: "previous" };
    if (d < session.earliestDay) return { ok: false, why: "notYet", day: session.earliestDay };
    if (s.calendar.sessionDoneOnDay[d]) return { ok: false, why: "onePerDay" };
    return { ok: true };
  }

  // 下一局（第一个未完成的）
  function nextSession() {
    const done = G.state.get().calendar.completedSessions;
    return G.schedule.list.find((x) => !done.includes(x.id)) || null;
  }

  // 某个时间戳属于第几个游戏日（补记用）
  function dayOfTimestamp(ts) {
    const s = G.state.get();
    return s.startedAt ? _dayOf(ts, s.startedAt, cfg().dayStartHour) : 0;
  }

  // 记一局完成。day 可选：补记"关掉即离开"时用玩的那天，而不是重新打开的那天。
  function markSessionDone(id, day) {
    const d = day || today();
    G.state.update((s) => {
      if (!s.calendar.completedSessions.includes(id)) s.calendar.completedSessions.push(id);
      s.calendar.sessionDoneOnDay[d] = id;
      s.inProgress = null;
    });
  }

  G.clock = { DAY, _dayStart, _dayOf, _isLateNight, _weekOf, devOverride, now, today, touch, isLateNight, weekOf, canPlay, nextSession, markSessionDone, dayOfTimestamp };
})();
