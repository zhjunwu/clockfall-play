// 第 40 天总结（design.md 8.5 + 1.0.3，Mark_V074，Mary_V062）。回城与巡逻（零问）由 runner 做；这一局没有最后一战（schedule.noEndfight）。
// 七页，玩家自己翻，可以回翻；每页右上角"离开"直接到第 7 页。每一行只来自真实数据，没有的数据那一行不出现。
// 第 7 页：游戏魔是最后一环，按住，然后只有"离开"；按下时大钟敲响一下（clock.ring），之后城市只剩日历和设置。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;

  function data() {
    const s = G.state.get();
    const stops = s.ledger.stops.filter((x) => x.what === "held");
    const cues = G.map.cues().filter((c) => !c.guessed);
    const byCue = cues.map((c) => ({ label: G.f("loop.cueLabel", c), n: stops.filter((x) => x.cueId === c.id).length })).filter((x) => x.n);
    const playable = G.schedule.list.filter((x) => x.playable && x.id !== "finale");
    const unfinished = playable.filter((x) => !s.calendar.completedSessions.includes(x.id)).length;
    return {
      s, stops, cues, byCue, unfinished,
      ticks: s.ledger.clockTicks,
      since37: stops.filter((x) => x.day >= 37).length,
      reported37: s.ledger.stops.some((x) => x.day >= 37),
      weeks: s.ledger.weeklyScreen || [],
    };
  }

  function page1(d) {
    const pct = Math.round((d.ticks / G.config.clockMax) * 100);
    return `${G.art && G.art.clock ? G.art.clock(pct) : `<div class="bigclock" style="--pct:${pct}"><div class="hand"></div></div>`}
      ${paras([G.f("finale.clockLine", { ticks: d.ticks })])}
      ${d.unfinished ? `<p class="hint">${fmt(G.t("finale.notFinished").join(""))}</p>` : ""}`;
  }
  function page2(d) {
    const rows = d.byCue.map((x) => `<li>${esc(G.f("finale.stopsByCue", x))}</li>`).join("");
    const since = d.reported37 ? G.f("finale.since37", { m: d.since37 }) : G.text("finale.noReport37");
    const weeks = d.weeks.length ? `<p class="eyebrow">${fmt(G.t("finale.screenTitle"))}</p><ul class="plain">${d.weeks.map((w) => `<li>${esc(G.f("finale.week", { week: w.week, hours: Math.round((w.minutes / 60) * 10) / 10 }))}</li>`).join("")}</ul>` : "";
    return `<p class="eyebrow">${fmt(G.t("finale.ledgerTitle"))}</p>
      ${paras([G.f("finale.stops", { n: d.stops.length })])}
      ${rows ? `<ul class="plain">${rows}</ul>` : ""}
      ${paras([since])}
      ${weeks}
      <div class="talk zero"><p>${fmt(G.t("finale.zeroNumbers"))}</p></div>`;
  }
  function page3(d) {
    const loops = G.t("finale.goodLoops") || {};
    const rescued = (d.s.rescued || []).filter((r) => loops[r]);
    return `<p class="eyebrow">${fmt(G.t("finale.cityTitle"))}</p>
      ${rescued.map((r) => `<div class="${esc(["talk", r].join(" "))}"><p>${fmt(loops[r])}</p></div>`).join("")}
      ${d.s.sessions.zero5 ? paras([G.t("finale.zeroBack")]) : ""}`;
  }
  function realOf(id, d) {
    const chestHeld = d.stops.filter((x) => x.day <= 7).length;
    return G.f("finale.real", { id, n: chestHeld, owlTask: (d.s.sessions.owl3 && d.s.sessions.owl3.task && d.s.sessions.owl3.task.kind) || null, abyssDrew: (d.s.sessions.abyss3 && d.s.sessions.abyss3.task) || null });
  }
  function codexText(d) {
    const c = G.t("finale.codex") || [];
    return c.map((x) => `${x.name}\n${x.moves}\n${x.counter}\n${realOf(x.id, d) || G.text("finale.gameOnly")}`).join("\n\n");
  }
  function page4(d) {
    const c = G.t("finale.codex") || [];
    return `<p class="eyebrow">${fmt(G.t("finale.codexTitle"))}</p>
      ${c.map((x) => `<section class="codexpage"><b>${esc(x.name)}</b><p class="hint">${esc(x.moves)}</p><p>${esc(x.counter)}</p><p class="real"><span class="eyebrow">${fmt(G.t("finale.realRecordLabel"))}</span> ${esc(realOf(x.id, d) || G.text("finale.gameOnly"))}</p></section>`).join("")}
      ${btn("exportCodex", G.t("finale.exportCodex"), "btn-quiet")}
      <textarea id="codexBox" class="code" readonly hidden></textarea>`;
  }
  function page5(d) {
    const t = G.titles.current();
    return `<p class="eyebrow">${fmt(G.t("finale.titleTitle"))}</p>
      <h2>${fmt(G.t("title." + t))}</h2>
      ${d.s.player.autoStop ? `<p class="hint">${fmt(G.t("finale.autoStop"))}</p>` : ""}`;
  }
  function page6(d) {
    const loop = d.s.player.loop || {};
    const links = (loop.links || []).map((l) => esc(l.label)).join(" → ");
    const cut = loop.cutLink && (loop.links || []).find((l) => l.slot === loop.cutLink.slot);
    const line = d.s.player.rebuttalLine;
    return `<div class="amulet">
      <p class="eyebrow">${fmt(G.t("finale.cardTitle"))}</p>
      <p class="eyebrow">${fmt(G.t("finale.cardCues"))}</p>
      ${d.cues.length ? `<ul class="plain">${d.cues.map((c) => `<li>${esc(G.f("loop.cueLabel", c))}</li>`).join("")}</ul>` : paras([G.t("finale.noCues")])}
      ${links ? `<p class="eyebrow">${fmt(G.t("finale.cardLoop"))}</p><p>${links}${cut ? `　✂ ${esc(cut.label)}` : ""}</p>` : ""}
      ${line ? `<p class="eyebrow">${fmt(G.t("finale.cardLine"))}</p><p class="rebuttal">${esc(line)}</p>` : ""}
      <p class="zeroline">${fmt(G.t("finale.zeroLine"))}</p>
    </div>
    <p class="hint">${fmt(G.t("finale.cardHint"))}</p>`;
  }

  // 第 7 页：最后一环
  function lastLink() {
    return new Promise((resolve) => {
      const ring = G.art && G.art.ring ? G.art.ring({ nodes: [{ who: "demon", on: true }] }) : "";
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("finale.eyebrow"))}</p>
          <div class="ringwrap">${ring}</div>
          <div class="talk demon"><p>${fmt(G.t("finale.lastLink").join(""))}</p></div>
          <p class="hint" id="hint">${fmt(G.t("finale.holdIt"))}</p>
          <div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
          <div class="talk zero" id="zeroGo" hidden><p>${fmt(G.t("finale.zeroGo"))}</p></div>
        </div>
        ${btn("leaveFinal", G.t("finale.leave"), "btn-main", "hidden")}
      `, { name: "finale-leave" });
      const $ = G.router.$;
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          $("#surf").hidden = true;
          $("#hint").hidden = true;
          $("#zeroGo").hidden = false;
          $("#leaveFinal").hidden = false;
        },
      });
      $("#leaveFinal").addEventListener("click", () => {
        G.fx.play("clock.ring", {});
        G.fx.play("exit.tap", { choice: "seasonEnd" });
        resolve();
      });
    });
  }

  function pages() {
    const d = data();
    const P = [page1, page2, page3, page4, page5, page6];
    return new Promise((resolve) => {
      let i = 0;
      function show() {
        G.router.show(`
          <div class="stack finale" data-page="${i + 1}">
            <div class="row finaletop">${i > 0 ? btn("prev", G.t("finale.prev"), "btn-quiet") : ""}<span></span>${btn("toLeave", G.t("finale.leave"), "btn-quiet")}</div>
            ${P[i](d)}
          </div>
          ${btn("next", G.t("finale.next"))}
        `, { name: "finale-page" });
        G.fx.play("finale.page", { i: i + 1 });
        const $ = G.router.$;
        $("#next").addEventListener("click", () => (i < P.length - 1 ? (i++, show()) : resolve()));
        const pv = $("#prev");
        if (pv) pv.addEventListener("click", () => (i--, show()));
        $("#toLeave").addEventListener("click", resolve);
        const ex = $("#exportCodex");
        if (ex)
          ex.addEventListener("click", () => {
            const box = $("#codexBox");
            box.value = codexText(d);
            box.hidden = false;
            box.select();
          });
      }
      show();
    });
  }

  const session1 = [
    async () => {
      await pages();
      await lastLink();
      G.state.update((s) => (s.flags.seasonDone = true));
      G.events.log("finale", { option: "left" });
    },
  ];

  G.levels.finale = { session1 };
})();
