// 表现层（Victoria）：监听 Game.fx 的事件，给引擎画好的屏幕加画面与动画。不改游戏逻辑，不产生玩家可见文字。
// 城市画面：背景（灰 → 琥珀，亮度随大钟格数）、SVG 大钟、主角与灯笼。
// 宝箱魔的局里（集市）：背景换成集市，压暗以保证对白可读；暖度 = 集市状态（0 死去 / 1 半复苏 / 2 复苏）。
// 夜枭的局里（钟楼区）：反过来。死去 = 满窗冷白光（整夜不睡）；复苏 = 冷光熄灭，只留钟面一盏琥珀。
// 出口（exit.tap）立即停掉所有动画；prefers-reduced-motion 的处理在 style.anim.css。
(function () {
  const G = window.Game;
  const app = document.getElementById("app");
  let shownPct = null;  // 上次画在城市上的格数，用来让"快一格"在回城时看得见
  let backdrop = null;
  const revivedNow = {};
  let zeroRelapsed = false;  // zero.relapse 到 zero.return 之间（零线第二阶段才会触发）  // district.revive 当场触发时，不等存档就让城区复苏

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
    backdrop.innerHTML = `<div class="layer dead"></div><div class="layer moon"></div><div class="layer cold"></div><div class="layer alive"></div>`;
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

  // 城区状态：第 2 局（看穿）之后半复苏，第 3 局（救回被俘者）之后复苏。
  const DISTRICT_OF = { chest: "market", owl: "tower", abyss: "corridor" };
  function districtState(level) {
    if (revivedNow[DISTRICT_OF[level]]) return 2;
    try {
      const done = G.state.get().calendar.completedSessions;
      return done.includes(level + "3") ? 2 : done.includes(level + "2") ? 1 : 0;
    } catch (e) {
      return 0;
    }
  }

  // 钟楼区：冷白窗光随复苏熄灭
  function setCold(v) {
    ensureBackdrop().style.setProperty("--cold", v.toFixed(3));
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

  // 开场故事：每页的画面位按 data-art 填进去。图片只在翻到那一页时才加载（背景图写在元素上）。
  function decoratePrologue() {
    const el = app.querySelector(".prologue-art");
    if (!el || el.dataset.filled) return;
    el.dataset.filled = "1";
    el.classList.add("pa", "pa-" + el.dataset.art);
    el.innerHTML = G.art.prologue(el.dataset.art);
  }

  // 对白屏：零和魔鬼说话时，第一句上方出现小像（零：Victoria_V010；魔鬼：Victoria_V013）。
  function decorateSpeaker() {
    const t = app.querySelector(".talk");
    if (!t || t.querySelector(".talk-who")) return;
    let html = "";
    if (t.classList.contains("zero")) html = zeroRelapsed ? G.art.zero.replace('class="art-zero"', 'class="art-zero relapse"') : G.art.zero;
    else for (const k in G.art.portraits) if (t.classList.contains(k)) html = G.art.portraits[k];
    if (!html) return;
    const who = document.createElement("div");
    who.className = "talk-who";
    who.setAttribute("aria-hidden", "true");
    who.innerHTML = html;
    t.insertBefore(who, t.firstChild);
  }

  // 无底渊第 3 局：零发呆那一屏换成零的剪影；走向长廊的信使换成人形剪影（Mark_to_Victoria_V011）
  function decorateAbyss3() {
    const z = app.querySelector(".stareart .zeroshape:not(.art)");
    if (z) { z.classList.add("art"); z.innerHTML = G.art.zero; }
    const w = app.querySelector(".messengerlane .walker:not(.art)");
    if (w) { w.classList.add("art"); w.innerHTML = G.art.walker; }
  }

  function decorate() {
    if (G.router.current === "prologue") decoratePrologue();
    decorateFeedArt();
    decorateSpeaker();
    decorateAbyss3();
    const onCity = G.router.current === "city";
    const level = onCity || document.body.classList.contains("xray") ? null : levelInProgress();
    const district = DISTRICT_OF[level];
    document.body.classList.toggle("scene-city", onCity);
    document.body.classList.toggle("scene-on", onCity || !!district);
    if (onCity) {
      setScene("city", false);
      setCold(0);
      decorateCity();
    } else if (district) {
      const st = districtState(level);
      setScene(district, true);
      setWarmth(st * 50);
      setCold(district === "tower" ? 1 - st / 2 : 0);
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

  // 城区复苏：集市是琥珀光铺开；钟楼是冷白窗光慢慢熄灭，钟面亮起琥珀（Mark_to_Victoria_V005）。
  on("district.revive", (d) => {
    if (!d.district) return;
    revivedNow[d.district] = true;
    setScene(d.district, true);
    document.body.classList.add("scene-on");
    setWarmth(100);
    setCold(0);
  });

  // 零复发：胸口那一点慢慢变成魔鬼红并停住，不闪、不脉冲、不配音效（Mary_to_Victoria_V006 一）。
  on("zero.relapse", () => { zeroRelapsed = true; app.querySelectorAll(".art-zero").forEach((z) => z.classList.add("relapse")); });
  on("zero.return", () => { zeroRelapsed = false; app.querySelectorAll(".art-zero").forEach((z) => z.classList.remove("relapse")); });

  // 无底渊：卡片"刷"走。引擎换卡后才发事件，所以每次留一份副本，下一张来时让副本向上滑走（Mary_to_Victoria_V006 二）。
  let lastCard = null;
  on("abyss.card", () => {
    decorateFeedArt();
    const feed = app.querySelector(".feed");
    const card = feed && feed.querySelector(".feedcard");
    if (!card) return;
    if (lastCard && lastCard.isConnected === false) {
      lastCard.classList.add("ghost");
      feed.appendChild(lastCard);
      lastCard.addEventListener("animationend", (e) => e.target.remove(), { once: true });
    }
    card.classList.add("enter");
    lastCard = card.cloneNode(true);
    lastCard.classList.remove("enter");
  });

  // 无底渊第 2 局：在长廊里画门，墙不接受——一道淡灰的门框一闪就散，"空"，不是惩罚（Mark_to_Victoria_V010）。
  on("abyss.doorRefused", () => {
    const feed = app.querySelector(".feed");
    if (!feed) return;
    const d = document.createElement("i");
    d.className = "ghostdoor";
    d.setAttribute("aria-hidden", "true");
    feed.appendChild(d);
    d.addEventListener("animationend", () => d.remove(), { once: true });
    setTimeout(() => d.remove(), 1500);
  });
  // 门外画门：青色线条描出来；门亮 = 青；门开 = 门里透出琥珀光
  on("abyss.doorDrawn", () => app.querySelectorAll(".wall").forEach((w) => w.classList.add("drawn-in")));
  on("abyss.doorLit", () => app.querySelectorAll(".wall").forEach((w) => w.classList.add("lit")));
  on("abyss.doorOpen", () => app.querySelectorAll(".wall").forEach((w) => w.classList.add("open")));

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
