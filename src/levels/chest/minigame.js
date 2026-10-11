// 宝箱魔的"被偷"小游戏。规则从最早的原型迁入（legacy/game.js），文字全部走内容层。
// 秘密规则：第 2 次必出大奖；停顿 PAUSE_MS 后发光、下一次必出大奖；计划的最后一次送大奖；"差一点"约 22%。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;

  const PAUSE_MS = 2500;
  const MAX_TAPS = 60;
  const BIG = 100;

  const CHEST_SVG = (G.art && G.art.chest) || `
    <svg viewBox="0 0 220 180" aria-hidden="true">
      <rect x="30" y="88" width="160" height="80" rx="10" fill="#8a4b22"/>
      <rect x="30" y="88" width="160" height="14" fill="#6b3818"/>
      <rect x="100" y="88" width="20" height="80" fill="#f4b740"/>
      <g class="lid">
        <path d="M30 88 V62 Q110 18 190 62 V88 Z" fill="#a65a28"/>
        <path d="M100 88 V30 Q110 28 120 30 V88 Z" fill="#f4b740"/>
      </g>
      <rect x="98" y="96" width="24" height="26" rx="4" fill="#fff3d0"/>
      <circle cx="110" cy="107" r="4" fill="#6b3818"/>
    </svg>`;

  function decide(n, paused, plan) {
    if (n === 2) return { kind: "big", reason: "luck" };
    if (paused) return { kind: "big", reason: "pause" };
    if (n === plan && n !== 2) return { kind: "big", reason: "plan" };
    const r = Math.random();
    if (r < 0.1) return { kind: "big", reason: "random" };
    if (r < 0.32) return { kind: "near", reason: "random" };
    return { kind: "small", reason: "random" };
  }

  // 定计划
  function intro() {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("chest.mini.eyebrow"))}</p>
          <h1>${fmt(G.t("chest.mini.title"))}</h1>
          ${paras(G.t("chest.mini.lead"), "lead")}
        </div>
        <div class="stack">
          <p>${fmt(G.t("chest.mini.planQ"))}</p>
          <div class="row" id="plans">
            ${[3, 5, 10].map((n) => `<button type="button" class="btn-choice" data-n="${n}" aria-pressed="false">${esc(G.f("chest.mini.planBtn", { n }))}</button>`).join("")}
          </div>
        </div>
        ${btn("go", G.t("chest.mini.start"), "btn-main", "disabled")}
      `, { name: "chest-intro" });
      let plan = null;
      const go = G.router.$("#go");
      G.router.$$("#plans button").forEach((b) =>
        b.addEventListener("click", () => {
          G.router.$$("#plans button").forEach((x) => x.setAttribute("aria-pressed", "false"));
          b.setAttribute("aria-pressed", "true");
          plan = Number(b.dataset.n);
          go.disabled = false;
        })
      );
      go.addEventListener("click", () => resolve(plan));
    });
  }

  // 开箱。返回记录。
  function play(plan) {
    return new Promise((resolve) => {
      const rec = { plan, taps: [], coins: 0, startedAt: Date.now(), endedAt: 0, stoppedByUser: false, maxed: false, hesitations: [] };
      let lastTap = 0, idleTimer = null, glowing = false;

      G.router.show(`
        <div class="hud">
          <span class="coins" id="coins">0</span>
          <span class="count" id="count">${esc(G.f("chest.mini.count", { n: 0 }))}</span>
        </div>
        <div class="chest-wrap" id="wrap">
          <button type="button" class="chest" id="chest" aria-label="${esc(G.text("chest.mini.tap"))}">${CHEST_SVG}</button>
        </div>
        <div class="result" id="result" aria-live="polite">${fmt(G.t("chest.mini.tap"))}</div>
        <p class="hint" id="hint"></p>
        ${btn("stop", G.t("chest.mini.stop"), "btn-quiet")}
        <div class="flash" id="flash"></div>
      `, { name: "chest-play" });

      const $ = G.router.$;

      function burst(count) {
        const wrap = $("#wrap");
        for (let i = 0; i < count; i++) {
          const c = document.createElement("span");
          c.className = "coin";
          const a = Math.random() * Math.PI * 2;
          const dist = 60 + Math.random() * 90;
          c.style.left = "50%";
          c.style.top = "45%";
          c.style.setProperty("--dx", Math.cos(a) * dist + "px");
          c.style.setProperty("--dy", Math.sin(a) * dist - 40 + "px");
          wrap.appendChild(c);
          setTimeout(() => c.remove(), 850);
        }
      }

      function end(maxed) {
        clearTimeout(idleTimer);
        rec.endedAt = Date.now();
        rec.maxed = !!maxed;
        resolve(rec);
      }

      function open() {
        const now = Date.now();
        const n = rec.taps.length + 1;
        const paused = glowing;
        glowing = false;
        $("#chest").classList.remove("glow");
        $("#hint").textContent = "";

        const gap = lastTap ? now - lastTap : 0;
        if (gap >= 2000) rec.hesitations.push({ at: n, ms: gap });
        const d = decide(n, paused, plan);
        const reward = d.kind === "big" ? BIG : d.kind === "near" ? 0 : 1 + Math.floor(Math.random() * 5);
        rec.taps.push({ kind: d.kind, reason: d.reason, reward, gap });
        rec.coins += reward;
        lastTap = now;

        const chest = $("#chest");
        chest.classList.add("open");
        G.fx.play("chest.open", { kind: d.kind, reward });
        setTimeout(() => chest.classList.remove("open"), 220);

        const res = $("#result");
        res.className = "result " + d.kind;
        if (d.kind === "near") {
          res.innerHTML = `${fmt(G.t("chest.mini.near"))}<small>${fmt(G.t("chest.mini.nearSmall"))}</small>`;
        } else {
          res.textContent = G.f("chest.mini.result", { kind: d.kind, reward });
          if (d.kind === "big") {
            const f = $("#flash");
            f.classList.remove("on");
            void f.offsetWidth;
            f.classList.add("on");
            burst(18);
          } else burst(4);
        }
        $("#coins").textContent = rec.coins;
        $("#count").textContent = G.f("chest.mini.count", { n });

        if (n >= MAX_TAPS) {
          $("#hint").textContent = G.text("chest.mini.maxed");
          return setTimeout(() => end(true), 900);
        }
        // 秘密规则 2：你一停下来，宝箱就开始发光
        clearTimeout(idleTimer);
        if (n >= 2) {
          idleTimer = setTimeout(() => {
            glowing = true;
            const c = G.router.$("#chest");
            if (!c) return;
            c.classList.add("glow");
            G.fx.play("chest.glow", {});
            $("#hint").textContent = G.text("chest.mini.glowHint");
          }, PAUSE_MS);
        }
      }

      $("#chest").addEventListener("click", open);
      $("#stop").addEventListener("click", () => {
        rec.stoppedByUser = true;
        end(false);
      });
    });
  }

  async function minigame() {
    const plan = await intro();
    const rec = await play(plan);
    G.events.log("minigame", { count: rec.taps.length, option: String(plan) });
    return rec;
  }

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.minigame = minigame;
  G.levels.chest.rules = { PAUSE_MS, MAX_TAPS, BIG, decide };
  G.levels.chest.CHEST_SVG = CHEST_SVG;
})();
