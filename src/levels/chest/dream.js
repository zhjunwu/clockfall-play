// 宝箱魔第 3 局：面包师的梦境。回放玩家第 1 局的记录，在他当时被"发光"抓住（或计划的最后一次）的那一刻，替他按住。
// 第 1 局没被偷的玩家用默认梦境，零说"你那天比他强"。镜像不能变成羞辱：面包师醒来第一句是谢谢。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const STEP_MS = 650;

  // 找"那一刻"：第一次 reason=pause 的大奖之前那一下，否则超计划时的计划边界；都没有则 null
  function momentOf(rec) {
    if (!rec || !rec.taps || !rec.taps.length) return null;
    const i = rec.taps.findIndex((t) => t.reason === "pause");
    if (i > 0) return i; // 在第 i 次（0 基）开之前停
    if (rec.plan && rec.taps.length > rec.plan) return rec.plan; // 计划的最后一次之后
    return null;
  }

  function replay(taps, moment) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("baker.eyebrow"))}</p>
          <p class="hint" id="hint">${fmt(G.t("baker.watch"))}</p>
        </div>
        <div class="chest-wrap dream" id="wrap">
          <button type="button" class="chest" id="chest" aria-label="${esc(G.text("chest.mini.tap"))}" disabled>${G.levels.chest.CHEST_SVG}</button>
        </div>
        <div class="result" id="result" aria-live="polite"></div>
        <div class="surf" id="surf" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
      `, { name: "dream" });
      const $ = G.router.$;
      let i = 0;
      function step() {
        if (!G.router.$("#chest")) return;
        if (i === moment) {
          // 画面停住，但宝箱仍在发光、仍可点：玩家要选择按住，而不是只能按住
          const c = $("#chest");
          c.classList.add("glow", "bright");
          c.disabled = false;
          c.addEventListener("click", () => {
            const res = $("#result");
            if (!res) return;
            res.className = "result small";
            res.textContent = G.f("chest.mini.result", { kind: "small", reward: 1 + Math.floor(Math.random() * 5) });
            G.events.log("dream.tap", { count: 1 });
          });
          $("#hint").textContent = G.text("baker.nowHold");
          const surf = $("#surf");
          surf.hidden = false;
          G.hold.attach(surf, {
            onProgress: (p) => $("#bar").style.setProperty("--p", Math.round(p * 100)),
            onHold: () => {
              $("#chest").classList.remove("glow", "bright");
              $("#chest").disabled = true;
              $("#hint").textContent = G.text("baker.held");
              G.events.log("dream.hold", { held: true, count: i });
              setTimeout(resolve, 700);
            },
          });
          return;
        }
        const t = taps[i];
        const c = $("#chest");
        c.classList.add("open");
        setTimeout(() => c.classList.remove("open"), 220);
        const res = $("#result");
        res.className = "result " + t.kind;
        res.textContent = G.f("chest.mini.result", { kind: t.kind, reward: t.reward });
        i++;
        setTimeout(step, STEP_MS);
      }
      setTimeout(step, 600);
    });
  }

  async function dream(record) {
    let taps = record && record.taps ? record.taps : [];
    let moment = momentOf(record);
    const mirrored = moment != null;
    if (!mirrored) {
      // 默认梦境：固定 8 次，第 6 次前停
      taps = Array.from({ length: 8 }, (_, k) => ({ kind: k === 1 || k === 5 ? "big" : "small", reward: k === 1 || k === 5 ? 100 : 3 }));
      moment = 5;
    }
    await talk({ speaker: "narrator", lines: G.t(mirrored ? "baker.dreamIntro" : "baker.dreamDefault") });
    await replay(taps.slice(0, moment + 1), moment);
    await talk({ speaker: "baker", lines: G.t("baker.awake") });
    if (!mirrored) await talk({ speaker: "zero", lines: G.t("baker.strongerThanHim") });
    G.state.update((s) => {
      s.rescued = s.rescued || [];
      if (!s.rescued.includes("baker")) s.rescued.push("baker");
    });
    return { mirrored };
  }

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.dream = dream;
})();
