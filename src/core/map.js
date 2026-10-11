// 魔鬼地图：线索的增删、零的猜测、坚持次数。数据只存本机。
(function () {
  const G = window.Game;

  function cues() {
    return G.state.get().map.cues;
  }

  function add(cue) {
    const c = {
      id: "c" + Date.now().toString(36),
      when: cue.when || null,
      where: cue.where || null,
      mood: cue.mood || null,
      app: cue.app || null,
      who: cue.who || null,
      addedDay: G.clock.today(),
      guessed: !!cue.guessed,
    };
    G.state.update((s) => s.map.cues.push(c));
    G.events.log("map", { accepted: true, option: c.guessed ? "guess" : "own" });
    if (G.safety && !c.guessed) G.safety.bumpIfMood(c.mood);
    return c;
  }

  function remove(id) {
    G.state.update((s) => (s.map.cues = s.map.cues.filter((c) => c.id !== id)));
  }

  // 零可以"坚持"要一条线索的次数（最多两次）
  function canInsist() {
    return G.state.get().map.insistCount < G.config.mapInsistMax;
  }

  function markInsisted() {
    G.state.update((s) => s.map.insistCount++);
  }

  function markSkipped() {
    G.events.log("map", { skipped: true });
  }

  // 零按时段猜一条（内容函数）
  function guess() {
    const h = new Date(G.clock.now()).getHours();
    const g = G.f("zero.guessCue", { hourOfDay: h });
    return typeof g === "object" ? g : null;
  }

  // 给台词函数用的线索：优先玩家自己填的，其次零的猜测，否则 null（函数自己兜底）
  function primary() {
    const list = cues();
    return list.find((c) => !c.guessed) || list[0] || null;
  }

  // 给魔鬼台词用的线索：心情只保留中性或疲惫类，其余（孤单、难过、自己写的……）去掉，台词改用别的格或通用句
  function forDemon(cue) {
    if (!cue) return null;
    const ok = G.t("map.moodTauntable");
    const c = Object.assign({}, cue);
    if (!(Array.isArray(ok) && c.mood && ok.includes(c.mood))) c.mood = null;
    return c;
  }

  G.map = { cues, add, remove, canInsist, markInsisted, markSkipped, guess, primary, forDemon };
})();
