// 声音（Victoria）。只做反馈音：跟着玩家自己的动作或屏幕上正在发生的剧情事件。没有背景音乐，没有开场音。
// Junwu 的限制（Mark_to_Victoria_V006）：
//   默认打开、极轻；不像通知（素材里没有叮、铃、提示音）；宝箱奖励只一个平的声音，不按大小变；
//   页面不可见时完全静音；深夜窗口降到 40%（Game.fx.volumeScale）；点了出口 / 去睡觉之后全静音。
// 另加一条：页面打开后、玩家第一次点按之前一律不响，保证"打开游戏时不响"（例如关掉算离开的补记会让大钟走一格）。
(function () {
  const G = window.Game;
  const MASTER = 0.35;  // 总音量上限。素材已统一到很轻（RMS 约 -28 dBFS），再乘这个
  const SRC = (name) => `assets/audio/${name}.mp3`;
  let armed = false;    // 玩家点按过
  let hushed = false;   // 出口（离开 / 去睡觉）之后，本次打开剩下的时间全部静音
  let seenXray = false; // 本次打开里看过宝箱的 X 光
  const playing = new Set();

  function arm() {
    armed = true;
  }
  document.addEventListener("pointerdown", arm, true);
  document.addEventListener("keydown", arm, true);

  function stopAll(keep) {
    playing.forEach((a) => { if (a !== keep) { try { a.pause(); } catch (e) {} } });
    playing.clear();
  }
  let ringing = null;  // 第一季结束的钟声：赛季结束这个出口不掐断它
  document.addEventListener("visibilitychange", () => { if (document.hidden) stopAll(); });

  function play(name) {
    if (!armed || hushed || document.hidden) return;
    const v = G.fx.volumeScale() * MASTER;  // 声音关闭时 volumeScale() 为 0
    if (v <= 0) return;
    try {
      const a = new Audio(SRC(name));
      a.volume = Math.min(1, v);
      playing.add(a);
      a.addEventListener("ended", () => playing.delete(a), { once: true });
      const p = a.play();
      if (p && p.catch) p.catch(() => playing.delete(a));
      return a;
    } catch (e) {}
  }

  // 看穿之后，宝箱的声音换成干、平、机械的那一版（Mary_to_Victoria_V001 五）
  function chestDry() {
    if (seenXray) return true;
    try {
      return G.state.get().calendar.completedSessions.includes("chest2");
    } catch (e) {
      return false;
    }
  }
  new MutationObserver(() => {
    if (document.body.classList.contains("xray")) seenXray = true;
  }).observe(document.body, { attributes: true, attributeFilter: ["class"] });

  const on = G.fx.on;
  on("hold.done", () => play("hold_done"));
  on("flag.show", () => play("flag_show"));          // 安静样式 flag.quiet 不出声
  on("chest.open", () => play(chestDry() ? "chest_open_dry" : "chest_open"));  // 不看奖励大小，永远同一个声音
  on("chest.shatter", () => play("chest_shatter"));
  on("clock.tick", () => play("clock_tick"));
  on("prologue.page", (d) => { if (d.i > 0) play("page_turn"); });  // 第 1 页是打开时出现的，不响
  on("owl.phoneDown", () => play("phone_down"));
  on("district.revive", () => play("revive"));
  on("abyss.doorOpen", () => play("door_open"));
  // 第一季结束：玩家按"离开"那一刻，大钟敲响一下（Mark_V076、V083）。低、远、余音长，全游戏只响这一次。
  on("clock.ring", () => { ringing = play("clock_ring") || null; });
  // 刻意不出声：墙拒绝画门（abyss.doorRefused），那一下是"空"；长廊划卡（abyss.card），划动不该变得更顺手（Mary_to_Victoria_V010）。

  // 出口：离开这一局、去睡觉。立刻停，之后这次打开里不再出任何声音（出口那一下本身也不响）。
  on("exit.tap", (d) => {
    stopAll(d && d.choice === "seasonEnd" ? ringing : null);
    hushed = true;
  });
  on("sound.off", stopAll);

  G.sound = { play, stopAll };
})();
