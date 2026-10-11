// 无底渊：没有底的长廊（Mary_V006 3.1，Mary_V040 B1、C1、C2）。
// 竖向卡片流，一屏一张。卡片不自己走：只在玩家往上划（或滚轮、方向键、点卡片）时前进；张数 = 玩家真实看到的张数。
// 没有滚动条、页码、时钟。"出去"按钮固定在右下角，一直在。2 分 30 秒是上限，到点卡片停住。
// 然后问估计（时间、张数），再亮出真实数据，按区间判定（两边各放宽半档）。
(function () {
  const G = window.Game;
  const { esc, fmt, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const CAP_MS = 150000;
  const SWIPE_PX = 40;

  function cardHtml(n) {
    const c = G.f("abyss.card", { n });
    const [body, end] = Array.isArray(c) ? c : [String(c), ""];
    return `<div class="feedcard" data-n="${n}"><i class="feedart" style="--hue:${(n * 47) % 360}"></i><p>${esc(body)}</p><p class="hint">${esc(end)}</p></div>`;
  }

  function feed() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("abyss.eyebrow"))}</p>
        </div>
        <div class="feed" id="feed" tabindex="0" aria-live="polite">${cardHtml(0)}</div>
        <p class="hint swipehint" id="swipehint">${fmt(G.t("abyss.swipeHint"))}</p>
        <div class="feedexit">${btn("exit", G.t("abyss.exit"), "btn-quiet")}</div>
      `, { name: "abyss-feed" });
      const $ = G.router.$;
      const box = $("#feed");
      const start = Date.now();
      let n = 0, done = false, y0 = null;

      function next() {
        if (done) return;
        n++;
        box.innerHTML = cardHtml(n);
        const h = $("#swipehint");
        if (h) h.hidden = true;
        G.fx.play("abyss.card", { n });
      }
      function finish(exited) {
        if (done) return;
        done = true;
        clearTimeout(cap);
        const sec = Math.min(CAP_MS, Date.now() - start) / 1000;
        G.events.log("abyss.feed", { count: n + 1, ms: Math.round(sec * 1000), option: exited ? "exit" : "cap" });
        resolve({ sec: Math.round(sec), n: n + 1, exited });
      }
      const cap = setTimeout(() => finish(false), CAP_MS);

      box.addEventListener("pointerdown", (e) => (y0 = e.clientY));
      box.addEventListener("pointerup", (e) => {
        if (y0 == null) return;
        const dy = e.clientY - y0;
        y0 = null;
        // 往上划；几乎没动就当作点了一下（无障碍）
        if (dy < -SWIPE_PX || Math.abs(dy) < 6) next();
      });
      box.addEventListener("wheel", (e) => {
        if (e.deltaY > 20) next();
      }, { passive: true });
      box.addEventListener("keydown", (e) => {
        if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
          e.preventDefault();
          next();
        }
      });
      $("#exit").addEventListener("click", () => finish(true));
    });
  }

  function choose(qId, optsId, name) {
    const opts = G.t(optsId);
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p>${fmt(G.t(qId))}</p>
          <div class="stack" id="opts">${(Array.isArray(opts) ? opts : []).map((o, i) => `<button type="button" class="btn-choice" data-i="${i}">${esc(o.label)}</button>`).join("")}</div>
        </div>
      `, { name });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(opts[Number(b.dataset.i)])));
    });
  }

  // 落在所选区间内或离边界不到半档 = 准；比区间大 = 猜少了；比区间小 = 猜多了
  function judge(actual, opt, half) {
    if (actual > opt.hi + half) return "less";
    if (actual < opt.lo - half) return "more";
    return "close";
  }

  async function minigame() {
    const r = await feed();
    await talk({ speaker: "zero", lines: G.t("abyss.stop") });
    const gt = await choose("abyss.guessTimeQ", "abyss.guessTimeOptions", "abyss-guessTime");
    const gc = await choose("abyss.guessCardsQ", "abyss.guessCardsOptions", "abyss-guessCards");
    const timeResult = judge(r.sec, gt, 30);
    const cardResult = judge(r.n, gc, 5);
    G.events.log("abyss.guess", { option: gt.v + "+" + gc.v, answer: timeResult + "+" + cardResult });
    const lines = [G.f("abyss.reveal", { sec: r.sec, n: r.n }), G.f("abyss.guessTimeLine", { result: timeResult }), G.f("abyss.guessCardsLine", { result: cardResult })];
    await talk({ speaker: "zero", lines });
    if (r.exited) await talk({ speaker: "zero", lines: G.t("abyss.exitedSelf") });
    return { sec: r.sec, n: r.n, exited: r.exited, guessTime: gt.v, guessCards: gc.v, timeResult, cardResult };
  }

  G.levels.abyss = G.levels.abyss || {};
  G.levels.abyss.minigame = minigame;
})();
