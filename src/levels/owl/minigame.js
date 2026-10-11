// 夜枭的"被偷"小游戏："两天一夜"。
// 白天：别人安排的事一件件点掉，"我的时间"条一直是 0。深夜：一集接一集，每集结尾半句悬念 + 自动倒计时，角落时钟走向凌晨。
// 第二天由第一晚实际放下的时间计算：精力、按钮大小（手"慢"来自更容易点错，不是人为延迟）、"我的时间"的增减。
// 早睡的玩家看到圈反着转。第二晚"再看一集"按钮的大小 = 熬夜程度，不用旁白说破。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);
  const EPISODE_MS = 6000; // 一集的现实时间（剧情 30 分钟）
  const COUNTDOWN_S = 5;
  const MAX_EPISODES = 6; // 到 2:00

  function tasksOf() {
    const t = G.t("owl.dayTasks");
    return Array.isArray(t) ? t.slice(0, 10) : [];
  }

  // 白天：按顺序点掉 10 件事。energy 0.4～1 决定按钮大小。返回 { misses, ms }
  function day({ energy, title, myTimeMin, note }) {
    const tasks = tasksOf();
    return new Promise((resolve) => {
      let cur = 0, misses = 0;
      const start = performance.now();
      // 精力低 → 按钮变小（更容易点错），但不低于 60%；"点两下"无障碍模式下不缩小
      const scale = G.hold.useAlt() ? 1 : Math.max(0.6, 0.7 + 0.3 * energy);
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.mini.eyebrow"))}</p>
          <h2>${fmt(title)}</h2>
          ${note ? `<p class="hint">${fmt(note)}</p>` : ""}
          <p class="hint">${fmt(G.t("owl.day.instruction"))}</p>
          <div class="mytime"><span class="eyebrow">${fmt(G.t("owl.myTime"))}</span><div class="bar"><i style="width:${Math.min(100, myTimeMin)}%"></i></div><span class="num">${esc(G.f("owl.minutes", { n: myTimeMin }))}</span></div>
          ${energy < 1 ? `<div class="mytime"><span class="eyebrow">${fmt(G.t("owl.energy"))}</span><div class="bar energy"><i style="width:${Math.round(energy * 100)}%"></i></div></div>` : ""}
          <p class="eyebrow" id="count">${esc(G.f("owl.tasksDone", { done: 0, total: tasks.length }))}</p>
          <div class="tasks" id="tasks" style="--scale:${scale}">
            ${tasks.map((t, i) => `<button type="button" class="task" data-i="${i}" ${i === 0 ? 'data-cur="1"' : ""}>${esc(t)}</button>`).join("")}
          </div>
        </div>
      `, { name: "owl-day" });
      const grid = G.router.$("#tasks");
      grid.addEventListener("click", (e) => {
        const b = e.target.closest(".task");
        if (!b || b.disabled) return;
        const i = Number(b.dataset.i);
        if (i !== cur) {
          misses++;
          b.classList.add("miss");
          setTimeout(() => b.classList.remove("miss"), 250);
          return;
        }
        b.disabled = true;
        b.removeAttribute("data-cur");
        cur++;
        G.router.$("#count").textContent = G.f("owl.tasksDone", { done: cur, total: tasks.length });
        const next = grid.querySelector(`[data-i="${cur}"]`);
        if (next) next.setAttribute("data-cur", "1");
        else setTimeout(() => resolve({ misses, ms: performance.now() - start }), 500);
      });
    });
  }

  // 深夜：从 22:00 起，一集 30 分钟剧情时间；每看一集"我的时间"+30（这是诱惑本身，要让玩家看到它涨）。
  // 返回 { episodes, endHour, manualPlays, autoPlays }（endHour = 22 + 集数 / 2）
  function night({ bigButton, realLate }) {
    const cliffs = G.t("owl.episodeCliff");
    // 打乱的是下标，这样第 2 局能按下标列出玩家实际看过的那几集
    const order = Array.isArray(cliffs) ? cliffs.map((_, i) => i).sort(() => Math.random() - 0.5) : [];
    const seen = [];
    return new Promise((resolve) => {
      let ep = 0, timer = null, tick = null, done = false, manual = 0, auto = 0;
      const clockOf = (n) => ({ h: 22 + Math.floor(n / 2), m: (n % 2) * 30 });
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.mini.eyebrow"))}</p>
          <div class="tvtop"><h2>${fmt(G.t("owl.night.title"))}</h2><span class="tvclock" id="clock">${esc(G.f("owl.clock", clockOf(0)))}</span></div>
          ${paras(G.t("owl.night.intro"))}
          ${realLate ? `<p class="hint">${fmt(G.t("owl.realLateNight"))}</p>` : ""}
          <div class="mytime"><span class="eyebrow">${fmt(G.t("owl.myTime"))}</span><div class="bar"><i id="mtbar" style="width:0%"></i></div><span class="num" id="mtnum">${esc(G.f("owl.minutes", { n: 0 }))}</span></div>
          <div class="tv" id="tv">
            <p class="eyebrow" id="epno"></p>
            <div class="playing" id="playing" hidden><i></i><span>${fmt(G.t("owl.playing"))}</span></div>
            <p class="cliff" id="cliff"></p>
            <p class="hint" id="countdown" hidden></p>
          </div>
          <div class="row choices" id="choices" hidden>
            ${btn("sleep", G.t("owl.sleepBtn"), "btn-choice")}
            ${btn("oneMore", G.t("owl.watchBtn"), "btn-choice")}
          </div>
        </div>
      `, { name: "owl-night" });
      const $ = G.router.$;

      function finish(slept) {
        if (done) return;
        done = true;
        clearTimeout(timer);
        clearInterval(tick);
        const endHour = 22 + ep / 2;
        G.events.log("owl.night", { count: ep, option: slept ? "sleep" : "auto" });
        resolve({ episodes: ep, endHour, manualPlays: manual, autoPlays: auto, cliffsSeen: seen });
      }
      function playEpisode() {
        if (!G.router.$("#tv")) return;
        ep++;
        $("#clock").textContent = G.f("owl.clock", clockOf(ep - 1));
        $("#epno").textContent = G.f("owl.episode", { n: ep });
        $("#cliff").textContent = "";
        $("#countdown").hidden = true;
        $("#choices").hidden = true;
        $("#oneMore").textContent = G.text("owl.oneMoreBtn");
        const pl = $("#playing");
        pl.hidden = false;
        pl.classList.remove("run");
        void pl.offsetWidth;
        pl.classList.add("run");
        timer = setTimeout(() => {
          if (!G.router.$("#tv")) return;
          $("#playing").hidden = true;
          const ci = order.length ? order[(ep - 1) % order.length] : -1;
          if (ci >= 0) seen.push(ci);
          $("#cliff").textContent = ci >= 0 ? cliffs[ci] : "";
          $("#clock").textContent = G.f("owl.clock", clockOf(ep));
          // 看完一集，"我的时间"+30
          $("#mtbar").style.width = Math.min(100, ep * 30 / 1.8) + "%";
          $("#mtnum").textContent = G.f("owl.minutes", { n: ep * 30 });
          if (ep >= MAX_EPISODES) return finish(false);
          let left = COUNTDOWN_S;
          const cd = $("#countdown");
          cd.hidden = false;
          cd.textContent = G.f("owl.countdown", { sec: left });
          $("#choices").hidden = false;
          tick = setInterval(() => {
            left--;
            if (!G.router.$("#countdown")) return clearInterval(tick);
            cd.textContent = G.f("owl.countdown", { sec: left });
            if (left <= 0) {
              clearInterval(tick);
              auto++;
              G.events.log("owl.autoplay", { count: ep });
              G.fx.play("owl.autoplay", { episode: ep });
              playEpisode();
            }
          }, 1000);
        }, EPISODE_MS);
      }
      // 第一集前先给"睡觉 / 再看一集"的机会（0 集就睡也可以）
      $("#choices").hidden = false;
      $("#sleep").addEventListener("click", () => finish(true));
      $("#oneMore").addEventListener("click", () => {
        clearInterval(tick);
        manual++;
        playEpisode();
      });
    });
  }

  // 第二晚：只有开场和两个按钮；点哪个都结束。"再看一集"按钮大小 = 熬夜程度。
  function night2({ bigButton, nightMin, dayMin }) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack">
          <p class="eyebrow">${fmt(G.t("owl.mini.eyebrow"))}</p>
          <div class="tvtop"><h2>${fmt(G.t("owl.night.title"))}</h2><span class="tvclock">${esc(G.f("owl.clock", { h: 22, m: 0 }))}</span></div>
          ${paras(G.t("owl.night2.intro"))}
          <p class="hint">${fmt(G.f("owl.myTimeTotal", { night: nightMin, day: dayMin }))}</p>
          <div class="choices2" id="choices">
            ${btn("sleep2", G.t("owl.sleepBtn"), "btn-choice")}
            ${btn("oneMore2", G.t("owl.oneMoreBtn"), "btn-choice grow")}
          </div>
        </div>
      `, { name: "owl-night2" });
      // 放大的是字号和内边距（布局内），不是 transform；"睡觉"按钮尺寸不变、完整可见、可点
      G.router.$("#oneMore2").style.setProperty("--grow", String(bigButton));
      G.router.$("#sleep2").addEventListener("click", () => resolve("sleep"));
      G.router.$("#oneMore2").addEventListener("click", () => resolve("oneMore"));
    });
  }

  async function minigame() {
    const rec = {};
    const d1 = await day({ energy: 1, title: G.t("owl.day1.title"), myTimeMin: 0, note: G.t("owl.myTimeEmpty") });
    rec.day1Misses = d1.misses;
    const realLate = G.clock.isLateNight() && !G.state.get().flags.owlRealLateShown;
    if (realLate) G.state.update((s) => (s.flags.owlRealLateShown = true));
    const n1 = await night({ bigButton: 1, realLate });
    rec.episodes = n1.episodes;
    rec.endHour = n1.endHour;
    rec.manualPlays = n1.manualPlays;
    rec.autoPlays = n1.autoPlays;
    rec.cliffsSeen = n1.cliffsSeen;
    await talk({ speaker: "narrator", lines: G.f("owl.nightSummary", { episodes: n1.episodes, endHour: n1.endHour, autoPlays: n1.autoPlays }) });

    // 第二天：由第一晚真实决定。看完第 1 集（22:30）就睡算早睡。
    const early = n1.episodes <= 1;
    const lateHours = Math.max(0, n1.endHour - 22.5);
    const energy = early ? 1 : Math.max(0.4, 1 - lateHours * 0.2);
    const nightMin = n1.episodes * 30; // 深夜换来的"我的时间"：真实承认
    const dayMin = early ? 10 : 0; // 第二天白天的空档
    rec.early = early;
    rec.energy = energy;
    rec.nightMin = nightMin;
    rec.dayMin = dayMin;
    const d2 = await day({ energy, title: G.t("owl.day2.title"), myTimeMin: dayMin, note: G.f("owl.day2.intro", { endHour: n1.endHour }) });
    rec.day2Misses = d2.misses;
    await talk({ speaker: "narrator", lines: [G.f("owl.day2.slower", { misses: d2.misses, early, energy }), G.f("owl.daySlot", { min: dayMin })] });
    // 第二晚"再看一集"按钮的实际倍数记进记录，第 2 局按它说话、回放并排画出两晚的按钮
    rec.bigButton = early ? 1 : 1 + (1 - energy) * 1.2;
    rec.secondNight = await night2({ bigButton: rec.bigButton, nightMin, dayMin });
    G.events.log("owl.minigame", { count: rec.episodes, option: rec.secondNight });
    return rec;
  }

  G.levels.owl = G.levels.owl || {};
  G.levels.owl.minigame = minigame;
})();
