// 零复发线第 4 局（第 34 天）：零的梦境——联手战（零的圈）。回城（同伴）与巡逻由 runner 做。Mark_V072，Mary_V061。
// 深夜（夜枭：拖手机出门）→ 老同伴（小红点：停、认）→ 中间陪零坐一会儿（什么都不按，圈变慢）→ 只放一个（宝箱魔：拉出停止点）
// → 破罐魔（点出玩家第 31 天写的那句）→ 零"我已经回不去了"→ 按住把那句说出口 → 零的钟走起来。endHook: none。
// 没有血条。认错：圈最多加速一格，破罐魔"错了吧？反正……"，用那句回它就恢复原速。
(function () {
  const G = window.Game;
  const { esc, fmt, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const ORDER = ["owl", "dot", "chest", "jar"];
  const RING = ["owl", "dot", "chest", "jar"]; // 零不在圈上：它坐在中间（Mary_V066 C3）
  const who = () => (G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : null) || "narrator";

  function line() {
    return G.state.get().player.rebuttalLine || G.text("zero4.fallbackLine");
  }
  function nodes(active) {
    const names = G.t("zero4.nodes") || {};
    return RING.map((id) => ({ id, who: id, label: names[id] || id, cls: id === active ? "active" : "" }));
  }
  // 圈上四个魔鬼；圆心是孤单的零（Victoria 的 G.art.zero 有就用，没有就用文字占位）
  function ring(active, opts) {
    const names = G.t("zero4.nodes") || {};
    const zeroArt = G.art && G.art.zero ? G.art.zero : "";
    const center = `<div class="ringcenter ${active === "zero" ? "on" : ""}" aria-hidden="true">${zeroArt}<span class="nlabel">${esc(names.zero || "")}</span></div>`;
    return G.levels.loop.ringHtml(nodes(active), opts).replace(/<\/div>$/, center + "</div>");
  }

  // 破罐魔的"错了吧？反正……"：点出那句话回它
  function jarRetort(extraLine) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("zero4.eyebrow"))}</p>
          <div class="talk jar"><p>${fmt(extraLine)}</p></div>
          <button type="button" class="btn-choice rebuttalbtn" id="retort"><span class="hint">${fmt(G.t("zero4.useLine"))}</span><span class="rebuttal">${esc(line())}</span></button>
        </div>
      `, { name: "zero4-retort" });
      G.router.$("#retort").addEventListener("click", resolve);
    });
  }

  // 一只魔鬼的一轮：按住 → 点它（点错：加速一格 + 破罐魔 + 用那句回 → 恢复）→ 返回认错次数
  function turn(demon, state) {
    const wh = G.t("zero4.whisper") || {};
    return new Promise((resolve) => {
      let misses = 0, held = false;
      function render() {
        G.router.show(`
          <div class="stack">
            <p class="eyebrow">${fmt(G.t("zero4.eyebrow"))}</p>
            <div class="talk ${esc(demon === "dot" ? "zero" : demon)}"><p>${fmt(wh[demon] || "")}</p></div>
            <div class="${state.fast ? "fast" : ""}">${ring(demon, { buttons: true, spin: !held })}</div>
            <p class="hint" id="hint">${fmt(G.t(held ? "zero4.tapIt" : "zero4.holdFirst"))}</p>
            <div class="surf" id="surf" ${held ? "hidden" : ""}><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
          </div>
        `, { name: "zero4-turn" });
        const $ = G.router.$;
        if (held) {
          const h = G.router.el.querySelector(".ringhits");
          if (h) h.hidden = false;
        }
        if (!held)
          G.hold.attach($("#surf"), {
            onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
            onHold: () => {
              held = true;
              render();
            },
          });
        G.router.$$(".ringhit").forEach((b) =>
          b.addEventListener("click", async () => {
            if (!held) return;
            if (b.dataset.id === demon) {
              G.fx.play("loop.recognized", { demon });
              return resolve(misses);
            }
            misses++;
            G.fx.play("loop.misread", { demon: b.dataset.id });
            // 最多加速一格；用那句回它，立刻恢复原速
            state.fast = true;
            G.fx.play("zero4.speed", { fast: true });
            await jarRetort(G.text("zero4.wrong"));
            state.fast = false;
            G.fx.play("zero4.speed", { fast: false });
            await talk({ speaker: "narrator", lines: G.t("zero4.speedBack") });
            render();
          })
        );
      }
      render();
    });
  }

  // 陪零坐一会儿：点一下坐下，然后什么都不用做；3 秒后圈慢下来
  function sit() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("zero4.eyebrow"))}</p>
          ${ring("zero", { spin: true })}
          <p id="sitText">${fmt(G.t("zero4.sitQ"))}</p>
        </div>
        ${btn("sit", G.t("zero4.sit"))}
      `, { name: "zero4-sit" });
      const $ = G.router.$;
      $("#sit").addEventListener("click", () => {
        $("#sit").hidden = true;
        $("#sitText").textContent = G.text("zero4.sitting");
        G.fx.play("zero4.sit", {});
        setTimeout(() => {
          if (!G.router.$("#sitText")) return;
          G.router.$$(".spin").forEach((el) => el.classList.add("slow"));
          $("#sitText").textContent = G.text("zero4.slowed");
          setTimeout(resolve, 1200);
        }, 3000);
      });
    });
  }

  function sayToZero() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("zero4.eyebrow"))}</p>
          <div class="talk zero"><p>${fmt(G.t("zero4.cantGoBack"))}</p></div>
          <p class="rebuttal said">${esc(line())}</p>
          <p class="hint">${fmt(G.t("zero4.sayLine"))}</p>
          <div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
      `, { name: "zero4-say" });
      const $ = G.router.$;
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => resolve(),
      });
    });
  }

  const session4 = [
    () => talk({ speaker: "narrator", lines: G.t("zero4.asleep") }),
    () => talk({ speaker: who(), lines: G.t("zero4.companion") }),
    () => talk({ speaker: "narrator", lines: G.t("zero4.enter"), extraHtml: ring(null, {}) }),
    async (ctx) => {
      const state = { fast: false };
      let misses = 0;
      for (const d of ORDER) {
        if (d === "chest") await sit(); // 老同伴之后，陪零坐一会儿
        misses += await turn(d, state);
        if (d === "owl") await G.levels.loop.gesture("owl");
        if (d === "chest") await G.levels.loop.gesture("chest");
        if (d === "jar") await jarRetort(G.text("zero4.gestureJar"));
      }
      ctx.misses = misses;
    },
    async (ctx) => {
      await sayToZero();
      G.fx.play("zero.clockMoves", {});
      await talk({ speaker: "narrator", lines: G.t("zero4.clockMoves") });
      await talk({ speaker: "zero", lines: G.t("zero4.awake") });
      G.ledger.tick("training");
      G.state.update((s) => (s.sessions.zero4 = { misses: ctx.misses }));
      G.events.log("zero4.end", { count: ctx.misses });
    },
  ];

  G.levels.zero = G.levels.zero || {};
  G.levels.zero.session4 = session4;
})();
