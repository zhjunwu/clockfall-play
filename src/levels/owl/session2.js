// 夜枭第 2 局：看穿 + 修炼（第 10 天）。回城与巡逻报告由 runner 做；"昨晚几点放下"已在巡逻报告与地图睡眠格里，不再单问。
// 看穿（夜枭后半句 → 数据拆穿 → 两天回放 → 按钮 → 看过的集 → 主动/自动 → 名字）→ 修炼一 睡前仪式 → 修炼二 白天 10 分钟 → 现实任务。
// endHook: none（本局不放钩子）。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const EPISODE_MS = 6000;

  function rec() {
    const s = G.state.get();
    return (s.sessions.owl1 && s.sessions.owl1.record) || { episodes: 0, manualPlays: 0, autoPlays: 0, cliffsSeen: [], nightMin: 0, dayMin: 0, energy: 1, day2Misses: 0, early: true, bigButton: 1, secondNight: "sleep" };
  }

  // 两天回放：四格。第二晚只有一个选择标记，不画不存在的分钟与精力。
  function twoDays(r) {
    const cell = (label, myTime, energy, mark) => `
      <div class="daycell">
        <p class="eyebrow">${fmt(G.t(label))}</p>
        ${mark ? `<p class="mark">${fmt(G.t(mark))}</p>` : `
        <div class="minibar"><span>${fmt(G.t("owl.xray.line.myTime"))}</span><i style="--v:${Math.min(100, myTime / 1.8)}"></i><b>${esc(G.f("owl.minutes", { n: myTime }))}</b></div>
        ${energy != null ? `<div class="minibar energy"><span>${fmt(G.t("owl.xray.line.energy"))}</span><i style="--v:${Math.round(energy * 100)}"></i><b>${Math.round(energy * 100)}%</b></div>` : ""}`}
      </div>`;
    return `<div class="twodays">
      ${cell("owl.xray.day1", 0, 1)}
      ${cell("owl.xray.night1", r.nightMin || 0, null)}
      ${cell("owl.xray.day2", r.dayMin || 0, r.energy == null ? 1 : r.energy)}
      ${cell("owl.xray.night2", 0, null, r.secondNight === "oneMore" ? "owl.xray.night2More" : "owl.xray.night2Sleep")}
    </div>`;
  }

  function xrayScreen(r) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.xray.eyebrow"))}</p>
          <h1>${fmt(G.t("owl.xray.title"))}</h1>
          <p class="eyebrow">${fmt(G.t("owl.xray.yourTwoDays"))}</p>
          ${twoDays(r)}
          <p class="hint">${fmt(G.f("owl.xray.numbers", { nightMin: r.nightMin || 0, dayMin: r.dayMin || 0, energyPct: Math.round((r.energy == null ? 1 : r.energy) * 100), misses: r.day2Misses || 0 }))}</p>
        </div>
        ${btn("next", G.t("talk.next"))}
      `, { xray: true, name: "owl-xray" });
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  // 按钮：早睡的直接说；否则按实际倍数说一句，只有明显变大时才问"注意到了吗"
  async function buttonBeat(r) {
    if (r.early) return talk({ speaker: "zero", lines: G.t("owl.xray.buttonEarly") });
    const scale = r.bigButton || 1;
    const line = G.f("owl.xray.buttonLine", { scale });
    if (scale < 1.15) return talk({ speaker: "zero", lines: line });
    const noticed = await new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">${paras(line)}</div>
        <div class="row">${btn("y", G.t("owl.xray.buttonNoticed"), "btn-choice")}${btn("n", G.t("owl.xray.buttonMissed"), "btn-choice")}</div>
      `, { xray: true, name: "owl-button" });
      G.router.$("#y").addEventListener("click", () => resolve(true));
      G.router.$("#n").addEventListener("click", () => resolve(false));
    });
    G.events.log("owl.buttonNoticed", { correct: noticed });
    return talk({ speaker: "zero", lines: G.t(noticed ? "owl.xray.buttonReplyNoticed" : "owl.xray.buttonReplyMissed") });
  }

  // 看过的集：只列玩家实际看过的那几集
  function cliffsBeat(r) {
    const all = G.t("owl.episodeCliff");
    const seen = (r.cliffsSeen || []).map((i) => (Array.isArray(all) ? all[i] : null)).filter(Boolean);
    // 例子来自内容数组（与悬念句下标一一对应），引擎不做字符串处理
    const unknown = G.t("owl.episodeUnknown");
    const examples = (r.cliffsSeen || []).map((i) => (Array.isArray(unknown) ? unknown[i] : null)).filter(Boolean);
    const list = seen.length ? `<ul class="cliffs">${seen.map((c) => `<li>${esc(c)}</li>`).join("")}</ul>` : "";
    return talk({
      speaker: "owl",
      eyebrow: r.episodes ? G.t("owl.xray.cliffsTitle") : null,
      lines: G.f("owl.xray.noNextEpisode", { episodes: r.episodes || 0, examples }),
      extraHtml: list,
      xray: true,
    });
  }

  // 修炼一：睡前仪式。选项可以是字符串，或 { v, label }（英文关灯时间显示 "9:30 PM"，值仍是 "21:30"）
  function pick(qId, optsId, name) {
    const raw = G.t(optsId);
    const opts = (Array.isArray(raw) ? raw : []).map((o) => (o && typeof o === "object" ? o : { v: o, label: o }));
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("owl.ritual.eyebrow"))}</p>
          <p>${fmt(G.t(qId))}</p>
          <div class="chips" id="chips">${opts.map((o) => `<button type="button" class="chip" data-v="${esc(o.v)}">${esc(o.label)}</button>`).join("")}</div>
        </div>
      `, { name });
      G.router.$$("#chips .chip").forEach((c) => c.addEventListener("click", () => resolve(c.dataset.v)));
    });
  }

  // 到点：夜枭诱惑；"再看一集"真的可以点（真的播一集，不缩短），然后诱惑再来；出口（按住 → 放手机）一直在。
  // 关灯时间（"21:30"）往后 n 集的钟面文字
  function clockAt(lightsOut, n) {
    const [h, m] = String(lightsOut).split(":").map(Number);
    const t = h * 60 + (m || 0) + 30 * n;
    return G.f("owl.clock", { h: Math.floor(t / 60), m: t % 60 });
  }

  function ritualNight({ lightsOut, where }) {
    const tempts = G.t("owl.ritual.tempt");
    return new Promise((resolve) => {
      let extra = 0, playing = false, ti = 0;
      const late = G.clock.isLateNight();
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.ritual.eyebrow"))}</p>
          <div class="tvtop"><p class="hint" id="state">${fmt(G.t(late ? "owl.ritual.waitingLate" : "owl.ritual.waiting"))}</p><span class="tvclock" id="clock">${esc(clockAt(lightsOut, 0))}</span></div>
          <div class="talk owl"><p id="say"></p></div>
          <div class="tv" id="tv" hidden><div class="playing run" id="playing"><i></i><span>${fmt(G.t("owl.ritual.playing"))}</span></div></div>
          <div class="ritualrow">
            ${btn("more", G.t("owl.ritual.watch"), "btn-choice tempt", "hidden")}
          </div>
          <div class="surf" id="surf" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
      `, { name: "owl-ritual" });
      const $ = G.router.$;
      // 压缩时间：等待 1.5 秒即到点，不让玩家现实里等。到点前诱惑按钮与按住圆环都不出现。
      setTimeout(() => {
        if (!G.router.$("#say")) return;
        $("#state").textContent = G.text("owl.ritual.timeUp");
        $("#say").textContent = Array.isArray(tempts) ? tempts[0] : "";
        $("#more").hidden = false;
        $("#surf").hidden = false;
      }, 1500);
      // 每多看一集，时钟往后走 30 分钟：真实数据，不是惩罚
      const clockAfter = (n) => clockAt(lightsOut, n);
      $("#more").addEventListener("click", () => {
        if (playing) return;
        playing = true;
        extra++;
        G.events.log("owl.ritual.more", { count: extra });
        $("#more").textContent = G.text("owl.ritual.oneMore");
        $("#clock").textContent = clockAfter(extra);
        $("#tv").hidden = false;
        const p = $("#playing");
        p.classList.remove("run");
        void p.offsetWidth;
        p.classList.add("run");
        setTimeout(() => {
          if (!G.router.$("#tv")) return;
          playing = false;
          $("#tv").hidden = true;
          ti++;
          if (Array.isArray(tempts)) $("#say").textContent = tempts[ti % tempts.length];
        }, EPISODE_MS);
      });
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => resolve({ extra }),
      });
    });
  }

  function placePhone(where) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.ritual.eyebrow"))}</p>
          <p>${fmt(G.t("owl.ritual.doIt"))}</p>
          <div class="phonedrop">
            <button type="button" class="phone" id="phone">${fmt(G.t("owl.ritual.phoneIcon"))}</button>
            <div class="spot" id="spot">${esc(where)}</div>
          </div>
          <p class="hint">${fmt(G.f("owl.ritual.placeHint", { where }))}</p>
        </div>
      `, { name: "owl-place" });
      const spot = G.router.$("#spot"), phone = G.router.$("#phone");
      let finished = false;
      const done = () => {
        if (finished) return;
        finished = true;
        phone.style.transform = "";
        spot.classList.add("filled");
        spot.appendChild(phone);
        G.fx.play("owl.phoneDown", { where });
        setTimeout(resolve, 500);
      };
      // 指针事件拖动（触屏、鼠标都可用）；也接受先点手机再点位置（无障碍）
      let drag = null, armed = false;
      phone.addEventListener("pointerdown", (e) => {
        drag = { x: e.clientX, y: e.clientY, moved: false };
        try { phone.setPointerCapture(e.pointerId); } catch (err) {}
      });
      phone.addEventListener("pointermove", (e) => {
        if (!drag) return;
        const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
        if (Math.abs(dx) + Math.abs(dy) > 6) drag.moved = true;
        if (drag.moved) phone.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      phone.addEventListener("pointerup", (e) => {
        if (!drag) return;
        const moved = drag.moved;
        drag = null;
        if (!moved) return;
        const r = spot.getBoundingClientRect();
        const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
        if (inside) done();
        else phone.style.transform = "";
      });
      phone.addEventListener("pointercancel", () => ((drag = null), (phone.style.transform = "")));
      phone.addEventListener("click", () => ((armed = true), phone.classList.add("armed"), spot.classList.add("armed")));
      spot.addEventListener("click", () => armed && done());
    });
  }

  async function ritual() {
    await talk({ speaker: "zero", lines: G.t("owl.ritual.intro") });
    const lightsOut = await pick("owl.ritual.lightsOutQ", "owl.ritual.lightsOutOptions", "owl-ritual-time");
    const where = await pick("owl.ritual.phoneWhereQ", "owl.ritual.phoneWhereOptions", "owl-ritual-where");
    const r = await ritualNight({ lightsOut, where });
    await placePhone(where);
    G.ledger.tick("training");
    await talk({ speaker: "narrator", lines: G.f("owl.ritual.result", { extra: r.extra, where }) });
    return { lightsOut, where, extra: r.extra };
  }

  // 修炼二：把"我的 10 分钟"放进一个空隙。日程是一条竖的时间线，空隙是夹在两件事之间的虚线格。
  function slice() {
    const sched = G.t("owl.slice.schedule");
    const items = (Array.isArray(sched) ? sched : []).map((x) =>
      typeof x === "string"
        ? `<li class="slot busy">${esc(x)}</li>`
        : `<li><button type="button" class="slot gap" data-v="${esc(x.gap)}">${esc(x.gap)}</button></li>`
    );
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.slice.eyebrow"))}</p>
          <p>${fmt(G.t("owl.slice.instruction"))}</p>
          <div class="block" id="block">${fmt(G.t("owl.slice.block"))}</div>
          <ol class="schedule" id="gaps">${items.join("")}</ol>
        </div>
      `, { name: "owl-slice" });
      let picked = false;
      G.router.$$("#gaps .gap").forEach((g, gi) =>
        g.addEventListener("click", () => {
          if (picked) return;
          picked = true;
          g.classList.add("filled");
          g.textContent = G.text("owl.slice.block");
          G.router.$("#block").hidden = true;
          G.events.log("owl.slice", { option: "gap" + gi }); // 日志只记序号，不记选项文字
          setTimeout(() => resolve(g.dataset.v), 600);
        })
      );
    });
  }

  const session2 = [
    // 看穿
    () => talk({ speaker: "owl", lines: G.t("owl.revealSecondHalf"), xray: true }),
    (ctx) => {
      ctx.owl = rec();
      return talk({ speaker: "zero", lines: G.f("owl.xray.rebut", { episodes: ctx.owl.episodes || 0, auto: ctx.owl.autoPlays || 0 }), xray: true });
    },
    (ctx) => xrayScreen(ctx.owl),
    (ctx) => buttonBeat(ctx.owl),
    (ctx) => cliffsBeat(ctx.owl),
    (ctx) => talk({ speaker: "narrator", eyebrow: G.t("owl.xray.autoplayTitle"), lines: G.f("owl.xray.plays", { manual: ctx.owl.manualPlays || 0, auto: ctx.owl.autoPlays || 0 }), xray: true }),
    () => talk({ speaker: "zero", eyebrow: G.t("owl.xray.nameTitle"), lines: G.t("owl.xray.name"), xray: true }),
    // 修炼一
    async (ctx) => {
      ctx.ritual = await ritual();
      G.state.update((s) => (s.sessions.owl2 = Object.assign(s.sessions.owl2 || {}, { ritual: ctx.ritual })));
    },
    // 修炼二
    async (ctx) => {
      await talk({ speaker: "zero", lines: G.t("owl.slice.intro") });
      ctx.slice = await slice();
      await talk({ speaker: "owl", lines: G.t("owl.slice.owlLine") });
      await talk({ speaker: "zero", lines: [G.t("owl.slice.placed"), G.t("owl.slice.zeroLine")] });
      G.state.update((s) => (s.sessions.owl2 = Object.assign(s.sessions.owl2 || {}, { slice: ctx.slice })));
    },
    () => talk({ speaker: "zero", lines: G.t("owl.task2") }),
  ];

  G.levels.owl = G.levels.owl || {};
  G.levels.owl.session2 = session2;
})();
