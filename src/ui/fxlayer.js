// 表现层（Victoria）：监听 Game.fx 的事件，给引擎画好的屏幕加画面与动画。不改游戏逻辑，不产生玩家可见文字。
// 城市画面：背景（灰 → 琥珀，亮度随大钟格数）、SVG 大钟、主角与灯笼。
// 宝箱魔的局里（集市）：背景换成集市，压暗以保证对白可读；暖度 = 集市状态（0 死去 / 1 半复苏 / 2 复苏）。
// 出口（exit.tap）立即停掉所有动画；prefers-reduced-motion 的处理在 style.anim.css。
(function () {
  const G = window.Game;
  const app = document.getElementById("app");
  let shownPct = null;  // 上次画在城市上的格数，用来让"快一格"在回城时看得见
  let backdrop = null;
  let marketRevived = false;  // district.revive 当场触发时，不等存档就让集市亮起来

  function clockPct() {
    try {
      const s = G.state.get();
      return Math.min(100, Math.round((s.ledger.clockTicks / G.config.clockMax) * 100));
    } catch (e) {
      return 0;
    }
  }

  function ensureBackdrop() {
    if (backdrop) return backdrop;
    backdrop = document.createElement("div");
    backdrop.className = "backdrop";
    backdrop.setAttribute("aria-hidden", "true");
    backdrop.innerHTML = `<div class="layer dead"></div><div class="layer alive"></div>`;
    document.body.insertBefore(backdrop, document.body.firstChild);
    return backdrop;
  }

  // 暖度：0 时几乎全灰，100 时全暖。最低留一点，城市"还没死透"。
  function setWarmth(pct) {
    ensureBackdrop().style.setProperty("--alive", (0.04 + 0.96 * pct / 100).toFixed(3));
  }

  function setScene(name, dim) {
    const b = ensureBackdrop();
    b.dataset.scene = name || "";
    b.classList.toggle("dim", !!dim);
  }

  // 集市状态：看穿（第 2 局）之后半复苏，面包师被救（第 3 局）之后复苏。
  function marketState() {
    if (marketRevived) return 2;
    try {
      const done = G.state.get().calendar.completedSessions;
      return done.includes("chest3") ? 2 : done.includes("chest2") ? 1 : 0;
    } catch (e) {
      return 0;
    }
  }

  function levelInProgress() {
    try {
      const ip = G.state.get().inProgress;
      const s = ip && G.schedule.byId(ip.sessionId);
      return s ? s.level : null;
    } catch (e) {
      return null;
    }
  }

  function decorateCity() {
    const old = app.querySelector(".bigclock");
    if (!old || old.dataset.art) return false;
    const pct = clockPct();
    const from = shownPct === null ? pct : Math.min(shownPct, pct);
    const scene = document.createElement("div");
    scene.className = "cityscene";
    scene.dataset.art = "1";
    scene.setAttribute("aria-hidden", "true");
    scene.style.setProperty("--lamp", (0.25 + 0.75 * pct / 100).toFixed(3));
    scene.innerHTML = G.art.clock(from) + G.art.hero;
    old.replaceWith(scene);
    setWarmth(from);
    if (from < pct) {
      // 指针平滑走到位，走过的格逐一点亮，一次轻辉光。不放大、不加粒子（Mary_to_Victoria_V002 二）。
      setTimeout(() => {
        const svg = scene.querySelector(".art-clock");
        svg.querySelector(".hand").style.setProperty("--pct", pct);
        svg.querySelectorAll(".tk").forEach((t, i) => t.classList.toggle("lit", i < pct));
        svg.classList.add("ticked");
        setWarmth(pct);
      }, 400);
    }
    shownPct = pct;
    return true;
  }

  function decorateChest() {
    app.querySelectorAll(".chest").forEach((c) => c.classList.add("art"));
  }

  function decorate() {
    const onCity = G.router.current === "city";
    const inMarket = !onCity && levelInProgress() === "chest" && !document.body.classList.contains("xray");
    document.body.classList.toggle("scene-city", onCity);
    document.body.classList.toggle("scene-on", onCity || inMarket);
    if (onCity) {
      setScene("city", false);
      decorateCity();
    } else if (inMarket) {
      setScene("market", true);
      setWarmth(marketState() * 50);
    }
    decorateChest();
  }

  new MutationObserver(decorate).observe(app, { childList: true });

  // ---------- 事件 ----------
  const on = G.fx.on;

  on("hold.start", () => app.querySelectorAll(".surf").forEach((s) => s.classList.add("holding")));
  on("hold.release", () => app.querySelectorAll(".surf").forEach((s) => s.classList.remove("holding")));
  on("hold.done", () => app.querySelectorAll(".surf").forEach((s) => { s.classList.remove("holding"); s.classList.add("settled"); }));

  on("chest.reveal", () => app.querySelectorAll(".chest").forEach((c) => c.classList.add("revealed")));
  on("chest.shatter", () => app.querySelectorAll(".chest").forEach((c) => c.classList.add("revealed", "shattered")));

  // 集市复苏：琥珀光 1.2 秒铺开（钟楼复苏另做：冷白窗光一盏盏熄灭，Mark_to_Victoria_V005）。
  on("district.revive", (d) => {
    if (d.district !== "market") return;
    marketRevived = true;
    setScene("market", true);
    document.body.classList.add("scene-on");
    setWarmth(100);
  });

  // 夜枭：过了关灯时间，时钟从中性变成屏幕的冷白。
  on("owl.lightsOut", () => app.querySelectorAll(".tvclock").forEach((c) => c.classList.add("past")));

  // 出口：瞬间生效。任何表现层的东西都不能让"离开"慢半拍。
  on("exit.tap", () => {
    document.body.classList.add("fx-stop");
    const clear = () => { document.body.classList.remove("fx-stop"); document.removeEventListener("pointerdown", clear, true); };
    setTimeout(() => document.addEventListener("pointerdown", clear, true), 0);
  });

  G.fxlayer = { decorate };
})();
