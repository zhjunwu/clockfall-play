// 零复发线第 3 局（第 31 天）：反驳战。回城（同伴）与巡逻由 runner 做。Mark_V072，Mary_V061。
// 找到零 → 破罐魔出场 → 选一句 → 用词块改成自己的话（打字框默认收起）→ 三次对着破罐魔说出口（按住）
// → 发誓分支（零："别发誓。说你现在做什么。"，可改可不改）→ 破罐魔缩回角落 → 零"……你刚才那句，再说一遍。" endHook: none。
// 玩家那句话只存本机（player.rebuttalLine），绝不写进事件日志。
(function () {
  const G = window.Game;
  const { esc, fmt, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);

  // 编辑器：候选句的词块可点换；也可展开打字。返回 { text, typed, sel }
  function editor(cand, prev) {
    const parts = cand.parts || [];
    const sel = (prev && prev.sel) || parts.map(() => 0);
    return new Promise((resolve) => {
      const lineOf = () => parts.map((p, i) => (typeof p === "string" ? p : p.opts[sel[i] % p.opts.length])).join("");
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("zero3.eyebrow"))}</p>
          <p class="hint">${fmt(G.t("zero3.editHint"))}</p>
          <p class="rebuttal" id="line">${parts.map((p, i) => (typeof p === "string" ? esc(p) : `<button type="button" class="word" data-i="${i}">${esc(p.opts[sel[i] % p.opts.length])}</button>`)).join("")}</p>
          <button type="button" class="btn-quiet" id="toggle">${fmt(G.t("zero3.typeToggle"))}</button>
          <textarea id="typed" class="code" maxlength="80" hidden placeholder="${esc(G.text("zero3.typePlaceholder"))}"></textarea>
        </div>
        ${btn("use", G.t("zero3.useIt"))}
      `, { name: "zero3-edit" });
      const $ = G.router.$;
      const ta = $("#typed");
      if (prev && prev.typed) {
        ta.hidden = false;
        ta.value = prev.text;
      }
      G.router.$$(".word").forEach((w) =>
        w.addEventListener("click", () => {
          const i = Number(w.dataset.i);
          sel[i] = (sel[i] + 1) % parts[i].opts.length;
          w.textContent = parts[i].opts[sel[i]];
        })
      );
      $("#toggle").addEventListener("click", () => {
        ta.hidden = !ta.hidden;
        if (!ta.hidden) {
          if (!ta.value) ta.value = lineOf();
          ta.focus();
        }
      });
      $("#use").addEventListener("click", () => {
        const typed = !ta.hidden && ta.value.trim().length > 0;
        resolve({ text: typed ? ta.value.trim() : lineOf(), typed, sel: sel.slice() });
      });
    });
  }

  function pickCandidate() {
    const cands = G.t("zero3.candidates");
    const C = Array.isArray(cands) ? cands : [];
    const show = (c) => c.parts.map((p) => (typeof p === "string" ? p : p.opts[0])).join("");
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk zero">
          <p class="eyebrow">${fmt(G.t("zero3.eyebrow"))}</p>
          <p>${fmt(G.t("zero3.pickQ"))}</p>
          <div class="stack" id="opts">${C.map((c, i) => `<button type="button" class="btn-choice" data-i="${i}">${esc(show(c))}</button>`).join("")}</div>
        </div>
      `, { name: "zero3-pick" });
      G.router.$$("#opts button").forEach((b) => b.addEventListener("click", () => resolve(C[Number(b.dataset.i)])));
    });
  }

  // 说出口：破罐魔这一句在上，玩家那句在中间；按住 = 说出口；"改一改"回到编辑器
  function sayIt(jarLine, line) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("zero3.eyebrow"))}</p>
          <div class="talk jar"><p>${fmt(jarLine)}</p></div>
          <p class="rebuttal said">${esc(line)}</p>
          <p class="hint">${fmt(G.t("zero3.sayIt"))}</p>
          <div class="surf" id="surf"><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
        </div>
        ${btn("edit", G.t("zero3.editAgain"), "btn-quiet")}
      `, { name: "zero3-say" });
      const $ = G.router.$;
      G.hold.attach($("#surf"), {
        onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
        onHold: () => resolve("said"),
      });
      $("#edit").addEventListener("click", () => resolve("edit"));
    });
  }

  function hasVow(text) {
    const words = G.t("zero3.vowWords");
    return Array.isArray(words) && words.some((w) => text.includes(w));
  }

  async function battle() {
    const cand = await pickCandidate();
    let cur = await editor(cand);
    let edits = 0, vowed = false;
    const jarLines = [].concat(G.t("zero3.jarEnter").slice(-1), G.t("zero3.jarAgain"));
    for (let round = 0; round < 3; round++) {
      // 发誓分支：只触发一次；之后可改可不改
      if (!vowed && hasVow(cur.text)) {
        vowed = true;
        await talk({ speaker: "jar", lines: G.t("zero3.jarVow") });
        await talk({ speaker: "zero", lines: G.t("zero3.zeroVow") });
      }
      for (;;) {
        const r = await sayIt(jarLines[round] || jarLines[jarLines.length - 1], cur.text);
        if (r === "said") break;
        edits++;
        cur = await editor(cand, cur);
      }
      G.fx.play("jar.crack", { round: round + 1 });
      await talk({ speaker: "narrator", lines: G.t("zero3.cracked") });
    }
    // 只存本机；日志里只记选了哪一句、改了几次、是否打字、是否发过誓
    G.state.update((s) => (s.player.rebuttalLine = cur.text));
    G.events.log("zero3.rebuttal", { option: cand.id + (cur.typed ? "-typed" : "-blocks"), count: edits, held: vowed });
    return { cand: cand.id, typed: cur.typed, edits, vowed };
  }

  const session3 = [
    () => talk({ speaker: "narrator", lines: G.t("zero3.found") }),
    () => talk({ speaker: "zero", lines: G.t("zero3.zeroAway") }),
    () => {
      G.fx.play("demon.appear", { who: "jar" });
      return talk({ speaker: "jar", lines: G.t("zero3.jarEnter") });
    },
    () => talk({ speaker: "zero", lines: G.t("zero3.zeroTrail") }),
    async (ctx) => {
      ctx.rebuttal = await battle();
      G.state.update((s) => (s.sessions.zero3 = ctx.rebuttal));
    },
    () => {
      G.fx.play("demon.leave", { who: "jar" });
      return talk({ speaker: "narrator", lines: G.t("zero3.jarLeave") });
    },
    () => talk({ speaker: "zero", lines: G.t("zero3.zeroAsk") }),
  ];

  G.levels.zero = G.levels.zero || {};
  G.levels.zero.session3 = session3;
})();
