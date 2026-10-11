// 第 25 天"圈"之局（Mark_V067，Mary_V055）。回城与巡逻由 runner 做。
// 墙上的圈 → 你的圈（三格，至少两格）→ 裂缝（ledger 里真实的"当时注意到并按住了"）→ 练习圈（认魔鬼 + 专属手势，不加速、无血条）
// → 剪哪一环（现实任务）→ 零发呆（.stare.near；runner 随后安静亮牌 cliffhanger）。
// 画面部件优先用 Victoria 的 Game.art.loop*（如果有），否则用这里的朴素占位。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const DEMONS = ["chest", "abyss", "owl"];
  // 日志里只记 ID：线索、自定义文字都只记类别
  const PREFIX_CUE = "cue:", PREFIX_TXT = "text" + ":";
  const linkKind = (l) => l.slot + "-" + (l.id.startsWith(PREFIX_CUE) ? "cue" : l.id.startsWith(PREFIX_TXT) ? "custom" : l.id);

  // 一个圈：nodes = [{ id, label, cls, who }]，opts = { buttons, spin, cracks }
  // 有 Victoria 的 Game.art.ring 就用它画；需要点的时候（练习圈），在同样的位置叠一层透明按钮（圈停转后才出现）。
  const R = 38;
  const pos = (i, n) => { const a = (i / n) * 2 * Math.PI - Math.PI / 2; return [50 + R * Math.cos(a), 50 + R * Math.sin(a)]; };
  function ringHtml(nodes, opts) {
    opts = opts || {};
    const n = nodes.length || 1;
    const hits = opts.buttons
      ? `<div class="ringhits" hidden>${nodes.map((x, i) => { const [l, t] = pos(i, n); return `<button type="button" class="loopnode ringhit ${x.cls || ""}" data-id="${esc(x.id)}" style="left:${l.toFixed(1)}%;top:${t.toFixed(1)}%" aria-label="${esc(x.label)}"></button>`; }).join("")}</div>`
      : "";
    if (G.art && G.art.ring) {
      const art = G.art.ring({ nodes: nodes.map((x) => ({ who: x.who || "none", label: esc(x.label), on: (x.cls || "").includes("active") })), cracks: opts.cracks || 0, spin: !!opts.spin });
      return `<div class="ringwrap">${art}${hits}</div>`;
    }
    const items = nodes.map((x, i) => { const [l, t] = pos(i, n); return `<div class="loopnode ${x.cls || ""}" style="left:${l}%;top:${t}%">${esc(x.label)}</div>`; }).join("");
    const cracks = Array.from({ length: Math.min(opts.cracks || 0, 12) }, (_, i) => `<i class="crack" style="--r:${(i * 360) / Math.max(1, Math.min(opts.cracks, 12)) + 20}deg"></i>`).join("");
    return `<div class="ringwrap"><div class="loopring ${opts.spin ? "spin" : ""}" aria-hidden="true"><div class="loopline"></div>${cracks}${items}</div>${hits}</div>`;
  }
  // 你的圈每一环画成什么：开始 = 小红点；停不下来 / 后果里是魔鬼的用它的小像
  const whoOf = (l) => (l.slot === "start" ? "dot" : ["chest", "abyss", "owl"].includes(l.id) ? l.id : "none");

  // 墙上的圈：小红点（开始）→ 宝箱魔、无底渊（停不下来）→ 夜枭（后果）→ 回到开始
  function wallNodes() {
    const slots = G.t("loop.slots"), names = G.t("loop.demonNames") || {};
    const sl = {};
    (Array.isArray(slots) ? slots : []).forEach((x) => (sl[x.id] = x.label));
    return [
      { id: "start", who: "dot", label: sl.start || "" },
      { id: "chest", who: "chest", label: `${sl.hold || ""}：${names.chest || ""}` },
      { id: "abyss", who: "abyss", label: names.abyss || "" },
      { id: "owl", who: "owl", label: `${sl.after || ""}：${names.owl || ""}` },
    ];
  }

  // ---- 你的圈 ----
  function mine() {
    const slots = G.t("loop.slots");
    const S = Array.isArray(slots) ? slots : [];
    const opt = G.t("loop.mine.options") || {};
    const cues = G.map.cues().filter((c) => !c.guessed);
    const startOpts = cues.map((c) => ({ id: "cue:" + c.id, label: G.f("loop.cueLabel", c), cue: c })).concat((opt.start || []).map((x) => ({ id: PREFIX_TXT + x, label: x })));
    const pick = {};
    return new Promise((resolve) => {
      function render() {
        const filled = Object.keys(pick).length;
        G.router.show(`
          <div class="stack">
            <p class="eyebrow">${fmt(G.t("loop.eyebrow"))}</p>
            <div class="talk zero"><p>${fmt(G.t("loop.yours"))}</p></div>
            <p class="hint">${fmt(G.t("loop.mine.hint"))}</p>
            ${S.map((s) => {
              const list = s.id === "start" ? startOpts : (opt[s.id] || []).map((x) => (typeof x === "string" ? { id: x, label: x } : x));
              return `<section class="loopslot"><p class="eyebrow">${esc(s.label)}：${esc(pick[s.id] ? pick[s.id].label : G.text("loop.mine.empty"))}</p>
                <div class="chips">${list.map((o) => `<button type="button" class="chip ${pick[s.id] && pick[s.id].id === o.id ? "on" : ""}" data-slot="${esc(s.id)}" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}</div></section>`;
            }).join("")}
          </div>
          ${btn("done", G.t("loop.mine.done"), "btn-main", filled >= 2 ? "" : "disabled")}
        `, { name: "loop-mine" });
        G.router.$$("[data-slot]").forEach((b) =>
          b.addEventListener("click", () => {
            const slot = b.dataset.slot;
            const list = slot === "start" ? startOpts : (opt[slot] || []).map((x) => (typeof x === "string" ? { id: x, label: x } : x));
            pick[slot] = list.find((o) => o.id === b.dataset.id);
            render();
          })
        );
        G.router.$("#done").addEventListener("click", () => {
          if (Object.keys(pick).length < 2) return;
          resolve(S.filter((s) => pick[s.id]).map((s) => ({ slot: s.id, id: pick[s.id].id, label: pick[s.id].label, cue: pick[s.id].cue || null })));
        });
      }
      render();
    });
  }

  // ---- 练习圈：一只魔鬼的一轮 ----
  function turn(demon) {
    const names = G.t("loop.demonNames") || {};
    const wh = G.t("loop.practice.whisper") || {};
    const nodes = DEMONS.map((d) => ({ id: d, who: d, label: names[d] || d, cls: d === demon ? "active" : "" }));
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("loop.practice.eyebrow"))}</p>
          <div class="talk ${esc(demon)}"><p id="say">${esc(wh[demon] || "")}</p></div>
          <div id="ringwrap">${ringHtml(nodes, { buttons: true, spin: true })}</div>
          <p class="hint" id="hint">${fmt(G.t("loop.practice.intro"))}</p>
          <div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
      `, { name: "loop-practice" });
      const $ = G.router.$;
      let held = false, misses = 0;
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => {
          held = true;
          $("#surf").hidden = true;
          $("#hint").textContent = G.text("loop.practice.tapDemon");
          // 停转（节点回到起始位置），然后才能点
          G.router.$$(".spin").forEach((el) => el.classList.remove("spin"));
          const h = G.router.el.querySelector(".ringhits");
          if (h) h.hidden = false;
        },
      });
      G.router.$$(".loopnode").forEach((b) =>
        b.addEventListener("click", () => {
          if (!held) return;
          if (b.dataset.id !== demon) {
            misses++;
            $("#hint").textContent = G.text("loop.practice.again"); // 不加速、不扣什么，只是再来
            return;
          }
          G.fx.play("loop.recognized", { demon });
          resolve(misses);
        })
      );
    });
  }

  // 专属手势：拖动（方向见 dir）或点"代替"按钮
  function gesture(demon) {
    const dir = demon === "chest" ? "down" : demon === "owl" ? "right" : "draw";
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("loop.practice.eyebrow"))}</p>
          <div class="talk zero"><p>${fmt(G.t("loop.practice.right"))}</p></div>
          <p>${fmt(G.t("loop.gesture." + demon))}</p>
          <div class="gesturepad" id="pad" data-dir="${dir}"><i class="gesturehandle"></i></div>
          ${btn("alt", G.t("loop.gesture.alt"), "btn-quiet")}
        </div>
      `, { name: "loop-gesture" });
      const pad = G.router.$("#pad");
      let start = null, done = false;
      const finish = (how) => {
        if (done) return;
        done = true;
        pad.classList.add("done");
        G.fx.play("loop.gesture", { demon, how });
        setTimeout(resolve, 500);
      };
      pad.addEventListener("pointerdown", (e) => (start = { x: e.clientX, y: e.clientY }));
      pad.addEventListener("pointerup", (e) => {
        if (!start) return;
        const dx = e.clientX - start.x, dy = e.clientY - start.y;
        start = null;
        if ((dir === "down" && dy > 40) || (dir === "right" && dx > 60) || (dir === "draw" && Math.abs(dx) > 30 && Math.abs(dy) > 40)) finish("drag");
      });
      G.router.$("#alt").addEventListener("click", () => finish("alt"));
    });
  }

  function cut(links) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("loop.eyebrow"))}</p>
          <p>${fmt(G.t("loop.cutQ"))}</p>
          <p class="hint">${fmt(G.t("loop.cutMine"))}</p>
          <div class="stack" id="opts">${links.map((l, i) => `<button type="button" class="btn-choice ${i === 0 ? "suggested" : ""}" data-i="${i}">${esc(l.label)}</button>`).join("")}</div>
        </div>
      `, { name: "loop-cut" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(links[Number(b.dataset.i)])));
    });
  }

  // 零发呆：比第 22 天站得更近，这一次没有回过神来；"继续"2 秒后淡入
  function stare() {
    return new Promise((resolve) => {
      G.fx.play("zero.stare", { near: true });
      const lines = G.t("loop.stare");
      G.router.show(`
        <div class="stack stare near">
          <div class="stareart" aria-hidden="true"><i class="zeroshape"></i><i class="reddot"></i></div>
          <p>${fmt(Array.isArray(lines) ? lines[0] : lines)}</p>
          <p class="hint" id="later" hidden>${fmt(Array.isArray(lines) ? lines[1] : "")}</p>
        </div>
        ${btn("next", G.t("talk.next"), "btn-main fadein", "hidden")}
      `, { name: "loop-stare" });
      setTimeout(() => {
        if (!G.router.$("#next")) return;
        G.router.$("#later").hidden = false;
        G.router.$("#next").hidden = false;
      }, 2000);
      G.router.$("#next").addEventListener("click", resolve);
    });
  }

  const session1 = [
    // 墙上的圈
    () => talk({ speaker: "narrator", lines: G.t("loop.pinIntro"), extraHtml: ringHtml(wallNodes()) }),
    () => talk({ speaker: "zero", lines: G.t("loop.notThree"), extraHtml: ringHtml(wallNodes()) }),
    () => talk({ speaker: "baker", lines: G.t("loop.baker") }),
    () => talk({ speaker: "watchman", lines: G.t("loop.watchman") }),
    () => talk({ speaker: "messenger", lines: G.t("loop.messenger") }),
    () => talk({ speaker: "zero", lines: [G.t("loop.manyNights"), G.t("loop.seen")], extraHtml: ringHtml(wallNodes()) }),
    // 你的圈
    async (ctx) => {
      ctx.links = await mine();
      // 玩家自己说出的"心情更差"：和地图里"有点孤单"一样给安全网记一次（不触发、不弹东西）
      if (ctx.links.some((l) => l.slot === "after" && l.id === "mood")) G.safety.bump("mood");
      G.state.update((s) => (s.player.loop = Object.assign(s.player.loop || {}, { links: ctx.links.map((l) => ({ slot: l.slot, id: l.id, label: l.label })) })));
      G.events.log("loop.mine", { count: ctx.links.length, option: ctx.links.map(linkKind).join("+") });
      await talk({ speaker: "zero", lines: G.t("loop.mine.saved"), extraHtml: ringHtml(ctx.links.map((l) => ({ id: l.slot, who: whoOf(l), label: l.label }))) });
      await G.safety.maybeShow("zero");
    },
    // 裂缝：真实的"当时注意到并按住了"
    async (ctx) => {
      const n = G.state.get().ledger.stops.filter((x) => x.kind === "noticed" && x.what === "held").length;
      ctx.cracks = n;
      G.fx.play("loop.cracks", { n });
      await talk({ speaker: "zero", lines: [].concat(n ? G.f("loop.cracks", { n }) : G.t("loop.noCrack"), G.t("loop.cutOne")), extraHtml: ringHtml(ctx.links.map((l) => ({ id: l.slot, who: whoOf(l), label: l.label })), { cracks: n }) });
    },
    // 练习圈
    async (ctx) => {
      let misses = 0;
      for (const d of DEMONS) {
        misses += await turn(d);
        await gesture(d);
      }
      ctx.practiceMisses = misses;
      G.ledger.tick("training");
      await talk({ speaker: "zero", lines: G.t("loop.practice.stopped") });
    },
    // 剪哪一环
    async (ctx) => {
      const pick = await cut(ctx.links);
      const c = pick.cue || {};
      G.state.update((s) => (s.player.loop = Object.assign(s.player.loop || {}, { cutLink: { slot: pick.slot, id: pick.id } })));
      G.events.log("loop.cut", { option: linkKind(pick), count: ctx.links.indexOf(pick) });
      await talk({ speaker: "zero", lines: [G.f("loop.cutHow", { slot: pick.slot, id: pick.id, when: c.when, where: c.where }), G.t("loop.cutDone")] });
      G.state.update((s) => (s.sessions.loop = { links: ctx.links.length, cracks: ctx.cracks, misses: ctx.practiceMisses, cut: pick.slot }));
    },
    // 零发呆；runner 随后安静亮牌
    () => stare(),
  ];

  G.levels.loop = G.levels.loop || {};
  G.levels.loop.session1 = session1;
})();
