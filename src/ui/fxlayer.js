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
  const revivedNow = {};  // district.revive 当场触发时，不等存档就让城区复苏
  let zeroEvent = null;
  let pendingRing = false; // clock.ring 之后，回到城市时大钟荡开钟声波纹    // zero.relapse / zero.return 当场触发时，不等存档

  // 零的状态：第 25 天"圈"之后失踪（复发），零线最后一局（zero5，第 36 天）救回。design 4.4。
  // 存档推算，重新打开也对；当场的事件优先。
  function zeroAway() {
    if (zeroEvent) return zeroEvent === "relapse";
    try {
      const done = G.state.get().calendar.completedSessions;
      return done.includes("loop") && !done.includes("zero5");
    } catch (e) {
      return false;
    }
  }

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
    // 零平时站在主角旁边；失踪期（第 26～35 天）那里只剩虚线空位（Mark_V072"零平时站的位置空着"）
    const z = zeroAway() ? G.art.zero.replace('class="art-zero"', 'class="art-zero absent"') : G.art.zero;
    scene.innerHTML = G.art.clock(from) + G.art.hero + `<div class="cityzero">${z}</div>`;
    if (pendingRing) {
      pendingRing = false;
      scene.classList.add("ringing");
      const enter = app.querySelector("#enter");
      if (enter) { enter.classList.remove("btn-main"); enter.classList.add("btn-quiet"); app.classList.add("cityafter"); }
      scene.insertAdjacentHTML("beforeend", `<svg class="pa-rings city-rings" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="60"/><circle cx="100" cy="100" r="60"/></svg>`);
    }
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
    const away = zeroAway();
    if (t.classList.contains("zero")) html = away ? G.art.zero.replace('class="art-zero"', 'class="art-zero relapse"') : G.art.zero;
    else for (const k in G.art.portraits) if (t.classList.contains(k)) html = G.art.portraits[k];
    // 零失踪期间，同伴说话时上方是零的空位：一个虚线轮廓（design 4.4"零的位置空着"）
    if (!html && away && /\b(baker|watchman|messenger)\b/.test(t.className)) html = G.art.zero.replace('class="art-zero"', 'class="art-zero absent"');
    if (!html) return;
    const who = document.createElement("div");
    who.className = "talk-who";
    who.setAttribute("aria-hidden", "true");
    who.innerHTML = html;
    t.insertBefore(who, t.firstChild);
  }

  // 长廊卡片：色块换成主语对应的小场景（content 的主语按 n % 12 轮换，画也按 n % 12）。
  function decorateFeedArt() {
    app.querySelectorAll(".feedcard[data-n] .feedart:not(.art)").forEach((el) => {
      const n = Number(el.closest(".feedcard").dataset.n) % 12;
      el.classList.add("art");
      el.style.backgroundImage = `url(assets/img/feed/s${String(n).padStart(2, "0")}.webp)`;
    });
  }

  // 无底渊第 3 局：零发呆那一屏换成零的剪影；走向长廊的信使换成人形剪影（Mark_to_Victoria_V011）
  function decorateAbyss3() {
    const z = app.querySelector(".stareart .zeroshape:not(.art)");
    if (z) { z.classList.add("art"); z.innerHTML = G.art.zero; }
    const w = app.querySelector(".messengerlane .walker:not(.art)");
    if (w) { w.classList.add("art"); w.innerHTML = G.art.walker; }
  }

  function decorateJar() {
    if (!jarOn || app.querySelector(".jar-corner")) return;
    const j = document.createElement("div");
    j.className = "jar-corner";
    j.setAttribute("aria-hidden", "true");
    j.innerHTML = G.art.portraits.jar;
    app.insertBefore(j, app.firstChild);
    if (jarCrack) j.querySelector(".art-jar").setAttribute("data-crack", jarCrack);
  }

  // 零线：第 28 天零的小红点换成静止的红色逗号（Mark_V077 的 .zerodot 占位）
  function decorateZeroLine() {
    app.querySelectorAll(".zerodot:not(.art)").forEach((d) => { d.classList.add("art"); d.innerHTML = G.art.zeroDot; });
  }

  // 第 40 天总结：图鉴每一节配魔鬼小像（按 data-id，没有就按顺序：宝箱魔、夜枭、无底渊）
  function decorateFinale() {
    if (!/^finale/.test(G.router.current || "")) return;
    const order = ["chest", "owl", "abyss"];
    app.querySelectorAll(".codexpage:not(.art)").forEach((sec, i) => {
      const id = sec.dataset.id || order[i];
      sec.classList.add("art");
      if (G.art.portraits[id]) sec.insertAdjacentHTML("afterbegin", `<div class="codexface" aria-hidden="true">${G.art.portraits[id]}</div>`);
    });
  }

  // 场景背景：城市、城区、零发呆
  function decorateScene() {
    const onCity = G.router.current === "city";
    const finale = /^finale/.test(G.router.current || "");
    // 零发呆：背景是安睡态的钟楼区，"回家路上停住了"（Mark V065 第 3 条、Mary V053）
    const staring = !!app.querySelector(".stare");
    const level = onCity || document.body.classList.contains("xray") ? null : levelInProgress();
    const district = DISTRICT_OF[level];
    document.body.classList.toggle("scene-city", onCity);
    document.body.classList.toggle("scene-on", onCity || !!district || staring || finale);
    if (finale) {
      setScene("city", true);
      setWarmth(clockPct());
      setCold(0);
    } else if (staring) {
      setScene("tower", true);
      setWarmth(55);  // 钟面光晕压一半，不和发呆那两句字抢（Mary_V060 A1）
      setCold(0);
    } else if (onCity) {
      setScene("city", false);
      setCold(0);
      decorateCity();
    } else if (district) {
      const st = districtState(level);
      setScene(district, true);
      setWarmth(st * 50);
      setCold(district === "tower" ? 1 - st / 2 : 0);
    }
  }

  // 每一步各自独立：一步出错（比如引擎改了某个类名）只丢那一处画面，不拖垮其他步，也不影响游戏本身。
  // 错误照样打到控制台，tools/art/smoke.sh 会把它当失败。
  const STEPS = [() => G.router.current === "prologue" && decoratePrologue(), decorateFeedArt, decorateSpeaker, decorateAbyss3, decorateScene, decorateChest, decorateJar, decorateFinale, decorateZeroLine];
  function decorate() {
    STEPS.forEach((step) => {
      try {
        step();
      } catch (e) {
        console.error("fxlayer", e);
      }
    });
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
  on("zero.relapse", () => { zeroEvent = "relapse"; app.querySelectorAll(".art-zero:not(.absent)").forEach((z) => z.classList.add("relapse")); });
  on("zero.return", () => { zeroEvent = "return"; app.querySelectorAll(".art-zero").forEach((z) => z.classList.remove("relapse")); });

  // 第 26 天：旁白"零不在"——这一句上方是零的空位
  on("zero.absent", () => {
    const t = app.querySelector(".talk");
    if (!t || t.querySelector(".talk-who")) return;
    t.insertAdjacentHTML("afterbegin", `<div class="talk-who" aria-hidden="true">${G.art.zero.replace('class="art-zero"', 'class="art-zero absent"')}</div>`);
  });
  // 第 28 天：钟楼顶上的红光。死去的城，尖顶一点小红光，静止、不闪
  on("zero.towerLight", () => {
    setScene("city", true);
    setWarmth(0);
    document.body.classList.add("scene-on");
    const b = ensureBackdrop();
    let l = b.querySelector(".towerlight");
    if (!l) { l = document.createElement("i"); l.className = "towerlight"; b.appendChild(l); }
    // 背景是 cover + 顶部居中：按屏幕换算尖顶在城市图上的位置（横 50.7%、纵 10%）
    const W = Math.max(innerWidth, innerHeight * 720 / 1052), H = W * 1052 / 720;
    l.style.left = (innerWidth / 2 + (0.507 - 0.5) * W) + "px";
    l.style.top = (0.10 * H) + "px";
  });
  // 第 31 天：每反驳一轮，破罐魔的裂缝深一层；第 3 轮歪倒、泄气
  let jarCrack = 0;
  on("jar.crack", (d) => {
    jarCrack = Math.min(3, (d && d.round) || jarCrack + 1);
    document.querySelectorAll(".art-jar").forEach((j) => j.setAttribute("data-crack", jarCrack));
  });
  // 第 36 天零回来：胸口的红 3 秒褪回暗红，身上亮一次暖光
  on("zero.return", () => app.querySelectorAll(".art-zero").forEach((z) => { z.classList.remove("relapse", "absent"); z.classList.add("back"); }));
  // 练习圈：认错——被点到的魔鬼歪一下、红眼亮一下，像在笑；认对——它的伪装褪成灰色虚线
  on("loop.misread", (d) => app.querySelectorAll(`.ring .node-${d.demon}`).forEach((n) => { n.classList.remove("smirk"); void n.offsetWidth; n.classList.add("smirk"); }));
  on("loop.recognized", (d) => app.querySelectorAll(`.ring .node-${d.demon}`).forEach((n) => n.classList.add("seen")));

  // 破罐魔：出场后每一屏的右上角都蹲着它（design 4.3"总在画面角落"），不动。
  // 它占自己的一小行，不叠在文字或按钮上（Mary 的出口规则）；退场就消失。
  let jarOn = false;
  on("demon.appear", (d) => {
    if (d.who !== "jar") return;
    jarOn = true;
    decorateJar();
  });
  on("demon.leave", (d) => {
    if (d.who !== "jar") return;
    jarOn = false;
    app.querySelectorAll(".jar-corner").forEach((j) => j.remove());
  });

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

  // 夜枭："睡觉"是故事里的选择，不是出口。只让屏幕暗下来，不配声音（Mary_to_Victoria_V010）。
  on("owl.sleep", () => app.querySelectorAll(".tv").forEach((t) => t.classList.add("off")));

  // 夜枭：过了关灯时间，时钟从中性变成屏幕的冷白。
  on("owl.lightsOut", () => app.querySelectorAll(".tvclock").forEach((c) => c.classList.add("past")));

  // 出口：瞬间生效。任何表现层的东西都不能让"离开"慢半拍。
  // 第一季结束：大钟敲响。画面在回到城市之后才荡开，不拖慢离开（Mark_V076、V083）。
  on("clock.ring", () => { pendingRing = true; });

  on("exit.tap", (d) => {
    if (d && d.choice === "seasonEnd") return;  // 赛季结束的离开之后要让钟声波纹荡完；城市此时本来就没有别的动画
    document.body.classList.add("fx-stop");
    const clear = () => { document.body.classList.remove("fx-stop"); document.removeEventListener("pointerdown", clear, true); };
    setTimeout(() => document.addEventListener("pointerdown", clear, true), 0);
  });

  G.fxlayer = { decorate };
})();
