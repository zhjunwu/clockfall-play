// 无底渊第 2 局：看穿 + 画门（第 19 天）。回城与通用巡逻由 runner 做（patrolDetail: false）。Mark_V058，Mary_V049。
// 第 1 局任务报告 → 看穿（撑开卡片之间的缝）→ 撞墙一课（里面画门被拒一次）→ 门外画门、选条件 → 进去、门亮、按住、出门
// → 现实里的门 → 图鉴"门"这一页（第四格永远在游戏外）→ runner 亮牌 collection。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const SWIPE_PX = 40;

  function rec1() {
    const s = G.state.get();
    return (s.sessions.abyss1 && s.sessions.abyss1.record) || {};
  }

  // 全屏划动层（同第 1 局）：返回 { next 回调注册, n() }
  function swipeLayer(layer, onNext) {
    let y0 = null;
    layer.addEventListener("pointerdown", (e) => (y0 = e.clientY));
    layer.addEventListener("pointerup", (e) => {
      if (y0 == null) return;
      const dy = e.clientY - y0;
      y0 = null;
      if (dy < -SWIPE_PX || Math.abs(dy) < 6) onNext();
    });
    layer.addEventListener("wheel", (e) => e.deltaY > 20 && onNext(), { passive: true });
    layer.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") {
        e.preventDefault();
        onNext();
      }
    });
    layer.focus();
  }

  // ---- 巡逻：第 1 局的现实任务 ----
  function taskReport() {
    const opts = G.t("abyss2.task.options");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("abyss2.task.eyebrow"))}</p>
          <p>${fmt(G.t("abyss2.task.q"))}</p>
          <div class="stack" id="opts">${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
        ${btn("skip", G.t("abyss2.task.skip"), "btn-quiet")}
      `, { name: "abyss2-task" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id)));
      G.router.$("#skip").addEventListener("click", () => resolve("skip"));
    }).then(async (kind) => {
      G.events.log("abyss2.task", { option: kind });
      const reply = kind === "skip" ? "abyss2.task.reply.skip" : kind === "notTried" ? "abyss2.task.reply.notTried" : "abyss2.task.reply.number";
      await talk({ speaker: "zero", lines: G.t(reply) });
      return kind;
    });
  }

  // ---- 看穿：撑开卡片之间的缝 ----
  function xray(n) {
    const shown = Math.max(3, Math.min(n || 6, 12));
    const lines = G.t("abyss2.xray.gapLines");
    const L = Array.isArray(lines) ? lines : [];
    return new Promise((resolve) => {
      const parts = [];
      for (let i = 0; i < shown; i++) {
        const c = G.f("abyss.card", { n: i });
        parts.push(`<div class="minicard">${esc(Array.isArray(c) ? c[0] : String(c))}</div>`);
        if (i < shown - 1) parts.push(`<button type="button" class="gap" data-i="${i}" aria-label="${esc(G.text("abyss2.xray.find"))}"></button>`);
      }
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("abyss2.xray.eyebrow"))}</p>
          <div class="talk zero"><p>${fmt(G.t("abyss2.xray.find"))}</p></div>
          <div class="strip" id="strip">${parts.join("")}${n > shown ? `<p class="hint">${fmt(G.t("abyss2.xray.more"))}</p>` : ""}</div>
        </div>
        ${btn("found", G.t("abyss2.xray.found"), "btn-quiet")}
      `, { xray: true, name: "abyss2-xray" });
      let opened = 0;
      G.router.$$("#strip .gap").forEach((g) =>
        g.addEventListener("click", () => {
          if (g.classList.contains("open") || opened >= 3) return; // 第三条之后停一下再走，期间不再计数
          g.classList.add("open");
          g.textContent = L.length ? L[opened % L.length] : "";
          opened++;
          G.fx.play("abyss.gap", { i: Number(g.dataset.i) });
          if (opened >= 3) setTimeout(() => resolve(3), 900);
        })
      );
      G.router.$("#found").addEventListener("click", () => resolve(opened));
    });
  }

  // ---- 修炼 3a：撞墙一课 ----
  function inside() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack"><p class="eyebrow">${fmt(G.t("abyss2.inside.eyebrow"))}</p>
          <div class="talk zero"><p id="say">${fmt(G.t("abyss2.inside.go"))}</p></div>
        </div>
        <div class="feed" id="feed" aria-live="polite">${G.levels.abyss.cardHtml(20)}</div>
        <p class="hint refused" id="refused" aria-live="polite"></p>
        <div class="feedlayer" id="feedlayer" tabindex="0"></div>
        <div class="feeddraw" id="drawwrap" hidden>${btn("draw", G.t("abyss2.drawBtn"), "btn-choice")}</div>
        <div class="feedexit">${btn("exit", G.t("abyss.exit"), "btn-quiet")}</div>
      `, { name: "abyss2-inside" });
      const $ = G.router.$;
      let n = 20, swipes = 0, refused = 0;
      swipeLayer($("#feedlayer"), () => {
        n++;
        swipes++;
        $("#feed").innerHTML = G.levels.abyss.cardHtml(n);
        G.fx.play("abyss.card", { n });
        if (swipes === 3) {
          $("#say").textContent = G.text("abyss2.inside.nowDraw");
          $("#drawwrap").hidden = false;
        }
      });
      $("#draw").addEventListener("click", () => {
        refused++;
        G.fx.play("abyss.doorRefused", { count: refused });
        const r = $("#refused");
        r.textContent = G.text("abyss2.inside.refused");
        r.classList.remove("flash");
        void r.offsetWidth;
        r.classList.add("flash");
        if (refused === 1) $("#say").textContent = G.text("abyss2.inside.zero");
      });
      $("#exit").addEventListener("click", () => {
        G.events.log("abyss2.inside", { count: refused });
        resolve(refused);
      });
    });
  }

  // ---- 修炼 3b：门外画门 ----
  function wall() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("abyss2.wall.eyebrow"))}</p>
          <div class="talk zero"><p>${fmt(G.t("abyss2.wall.say"))}</p></div>
          <div class="wall" id="wall"><i class="drawn" id="drawn" hidden></i></div>
          <p class="hint">${fmt(G.t("abyss2.wall.hint"))}</p>
          ${btn("draw", G.t("abyss2.drawBtn"), "btn-choice")}
        </div>
      `, { name: "abyss2-wall" });
      const $ = G.router.$;
      const w = $("#wall");
      let start = null, done = false;
      const finish = () => {
        if (done) return;
        done = true;
        $("#drawn").hidden = false;
        G.fx.play("abyss.doorDrawn", {});
        setTimeout(resolve, 500);
      };
      w.addEventListener("pointerdown", (e) => (start = { x: e.clientX, y: e.clientY }));
      w.addEventListener("pointerup", (e) => {
        if (!start) return;
        const big = Math.abs(e.clientX - start.x) > 30 && Math.abs(e.clientY - start.y) > 40;
        start = null;
        if (big) finish();
      });
      $("#draw").addEventListener("click", finish);
    });
  }

  function chooseType() {
    const types = G.t("abyss2.types");
    const T = Array.isArray(types) ? types : [];
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("abyss2.wall.eyebrow"))}</p>
          <p>${fmt(G.t("abyss2.type.q"))}</p>
          ${T.map((t, ti) => `<section class="doortype"><p class="eyebrow">${esc(t.title)}</p><div class="stack">${t.options.map((o, oi) => `<button type="button" class="btn-choice" data-t="${ti}" data-o="${oi}">${esc(o.label)}</button>`).join("")}</div></section>`).join("")}
        </div>
      `, { name: "abyss2-doorType" });
      G.router.$$("[data-t]").forEach((b) =>
        b.addEventListener("click", () => {
          const t = T[Number(b.dataset.t)], o = t.options[Number(b.dataset.o)];
          resolve({ type: t.type, v: o.v, label: o.label });
        })
      );
    });
  }

  // ---- 修炼 3c：进去，门亮，按住，出门 ----
  function corridor(door) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack"><p class="eyebrow">${fmt(G.t("abyss2.corridor.eyebrow"))}</p>
          <div class="talk abyss"><p id="say"></p></div>
        </div>
        <div class="feed" id="feed" aria-live="polite">${G.levels.abyss.cardHtml(40)}</div>
        <div class="feedlayer" id="feedlayer" tabindex="0"></div>
        <div class="walldoor" id="walldoor" data-type="${esc(door.type)}">
          <button type="button" class="doorbtn" id="door">${fmt(G.f("abyss2.doorLabel", { label: door.label }))}${door.type === "feel" ? `<small>${fmt(G.t("abyss2.feelTap"))}</small>` : ""}</button>
          <div class="surf" id="surf" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
        <div class="feedexit">${btn("exit", G.t("abyss.exit"), "btn-quiet")}</div>
      `, { name: "abyss2-corridor" });
      const $ = G.router.$;
      const start = Date.now();
      let n = 40, seen = 0, lit = false, held = false, k = 0, timer = null;
      function light() {
        if (lit) return;
        lit = true;
        clearInterval(timer);
        $("#walldoor").classList.add("lit");
        $("#say").textContent = G.text("abyss2.doorTempt");
        $("#surf").hidden = false;
        G.fx.play("abyss.doorLit", { type: door.type });
      }
      swipeLayer($("#feedlayer"), () => {
        if (held) return;
        n++;
        seen++;
        if (lit) k++;
        $("#feed").innerHTML = G.levels.abyss.cardHtml(n);
        G.fx.play("abyss.card", { n });
        if (door.type === "count" && seen + 1 >= door.v) light();
      });
      if (door.type === "time") timer = setInterval(() => (Date.now() - start) / 1000 >= door.v && light(), 500);
      $("#door").addEventListener("click", () => {
        if (door.type === "feel" && !lit) return light(); // 感觉门：玩家自己觉得到了就点它
        if (held) {
          G.events.log("abyss2.door", { option: door.type, count: k });
          resolve({ k, seen: seen + 1, lit: true });
        }
      });
      // 出口一直在：门没亮也可以直接出去（也是一次停）
      $("#exit").addEventListener("click", () => {
        clearInterval(timer);
        G.events.log("abyss2.door", { option: "plainExit", count: k });
        resolve({ k, seen: seen + 1, plainExit: true, lit });
      });
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          held = true;
          $("#walldoor").classList.add("open");
          $("#surf").hidden = true;
          $("#door").textContent = G.text("abyss2.doorOut");
          G.fx.play("abyss.doorOpen", {});
        },
      });
    });
  }

  function realDoor() {
    const opts = G.t("abyss2.realOptions");
    const apps = G.t("abyss.feedApps");
    const cue = G.map.cues().filter((c) => Array.isArray(apps) && apps.includes(c.app)).pop();
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p>${fmt(G.f("abyss2.realQIntro", { app: cue ? cue.app : null }))}</p>
          <p class="eyebrow">${fmt(G.t("abyss2.realQ"))}</p>
          <div class="stack" id="opts">${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
      `, { name: "abyss2-real" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(b.dataset.id)));
    });
  }

  // 图鉴"门"：练过的那一格亮，另两格"见过"，第四格永远在游戏外
  function codex(practiced) {
    const types = G.t("abyss2.types");
    const T = Array.isArray(types) ? types : [];
    G.state.update((s) => {
      s.codex = s.codex || {};
      s.codex.doors = { practiced, seen: T.map((t) => t.type) };
    });
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("codex.doors.title"))}</p>
          <div class="codexgrid">
            ${T.map((t) => `<div class="codexcell ${t.type === practiced ? "on" : ""}"><b>${esc(t.title)}</b><small>${fmt(G.t(t.type === practiced ? "codex.doors.practiced" : "codex.doors.seen"))}</small></div>`).join("")}
            <div class="codexcell outside"><b>${fmt(G.t("codex.doors.real"))}</b><small>${fmt(G.t("codex.doors.realNote"))}</small></div>
          </div>
        </div>
        ${btn("next", G.t("talk.next"))}
      `, { name: "abyss2-codex" });
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  const session2 = [
    async (ctx) => {
      ctx.task = await taskReport();
      G.state.update((s) => (s.sessions.abyss2 = Object.assign(s.sessions.abyss2 || {}, { task: ctx.task })));
    },
    // 看穿
    () => {
      const r = rec1();
      return talk({ speaker: "abyss", lines: G.f("abyss2.boast", { sec: r.sec || 0, n: r.n || 0, exited: !!r.exited, cardResult: r.cardResult, timeResult: r.timeResult }), xray: true });
    },
    () => talk({ speaker: "zero", lines: G.t("abyss2.xray.rewind"), xray: true }),
    async (ctx) => {
      ctx.gaps = await xray(rec1().n);
    },
    () => talk({ speaker: "zero", lines: [].concat(G.t("abyss2.xray.zero1"), G.t("abyss2.xray.zero2")), xray: true }),
    () => talk({ speaker: "abyss", lines: G.t("abyss2.xray.abyss"), xray: true }),
    () => talk({ speaker: "zero", lines: G.t("abyss2.xray.zero3"), xray: true }),
    // 修炼
    async (ctx) => {
      ctx.refused = await inside();
      await wall();
      ctx.door = await chooseType();
      const r = await corridor(ctx.door);
      G.ledger.tick("training");
      // 门没亮就自己出来：不说"这是你自己定的"，也不说"门一亮你就停了"（Mary_V050 A1）
      await talk({ speaker: "zero", lines: r.lit ? [G.t("abyss2.yours"), G.f("abyss2.doorResult", { k: r.k })] : G.t("abyss2.leftBeforeDoor") });
      G.state.update((s) => (s.sessions.abyss2 = Object.assign(s.sessions.abyss2 || {}, { door: { type: ctx.door.type, v: ctx.door.v, k: r.k, lit: !!r.lit }, gaps: ctx.gaps, refused: ctx.refused })));
    },
    // 现实里的门
    async (ctx) => {
      ctx.real = await realDoor();
      G.events.log("abyss2.real", { option: ctx.real });
      G.state.update((s) => (s.sessions.abyss2 = Object.assign(s.sessions.abyss2 || {}, { real: ctx.real })));
      await talk({ speaker: "zero", lines: G.t("abyss2.realDone") });
    },
    // 图鉴"门"。零不说话；runner 随后亮牌（收集）。
    (ctx) => codex(ctx.door ? ctx.door.type : null),
  ];

  G.levels.abyss = G.levels.abyss || {};
  G.levels.abyss.session2 = session2;
})();
