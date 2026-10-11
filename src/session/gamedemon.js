// 最后一战：游戏魔。停 → 认 → 选。
// 本模块不引用账本（Game.ledger）：难度只来自传入的 firstHoldStreak / autoStop；推钟通过 onLeave 回调。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;
  const cfg = () => G.config;

  function surfSeconds(player) {
    const c = cfg();
    if (player.autoStop) return c.surfAutoStopSec;
    if (player.lostAutoStop) return c.surfMaxSec;
    return Math.min(c.surfMaxSec, c.surfBaseSec + c.surfPerStreakSec * player.firstHoldStreak);
  }

  // 第一拍：停。台词先出现，"按住"区域约 1.5 秒后才亮起；"第一时间"的 3 秒窗口从它亮起时开始算。
  function stepStop({ lines, sec, distract }) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk demon">
          ${paras(lines)}
          <p class="eyebrow holdcue" id="holdcue" hidden>${fmt(G.t("gameDemon.stepStop"))}</p>
          <div class="surf" id="surf" hidden><div class="bar" id="bar"></div><span class="label">${fmt(G.t(G.hold.useAlt() ? "hold.altPrompt" : "hold.prompt"))}</span></div>
          ${distract ? `<button type="button" class="btn-quiet distract" id="distract" hidden>${fmt(G.t("gameDemon.distractBtn"))}</button>` : ""}
        </div>
      `, { name: "endfight-stop" });
      const el = G.router.$("#surf");
      let appeared = null, firstDown = null;
      el.addEventListener("pointerdown", () => (firstDown = firstDown || performance.now()), { once: true });
      setTimeout(() => {
        if (!G.router.$("#surf")) return;
        G.router.$("#holdcue").hidden = false;
        el.hidden = false;
        const d = G.router.$("#distract");
        if (d) {
          d.hidden = false;
          d.addEventListener("click", () => G.events.log("distract", { choice: "tapped" }));
        }
        appeared = performance.now();
      }, cfg().holdRevealDelayMs);
      G.hold.surf(el, { sec, onProgress: (p) => G.router.$("#bar").style.setProperty("--p", Math.round(p * 100)) }).then((r) => {
        resolve({ appearToHoldMs: firstDown && appeared ? Math.max(0, firstDown - appeared) : null, released: r.released, alt: r.alt, surfSec: sec });
      });
    });
  }

  // 第二拍：认。first=true 时由零代答。
  function stepName({ first, endHook }) {
    if (first) {
      return G.screens
        .talk({ speaker: "zero", lines: [].concat(G.t("zero.teachStop"), G.t("zero.nameHookForYou"), G.t("zero.nextTimeYou")) })
        .then(() => ({ answer: endHook, correct: true, byZero: true }));
    }
    return new Promise((resolve) => {
      const opts = G.t("gameDemon.hookOptions");
      G.router.show(`
        <div class="stack talk demon">
          <p class="eyebrow">${fmt(G.t("gameDemon.stepName"))}</p>
          <div class="stack" id="hooks">
            ${(Array.isArray(opts) ? opts : []).map((o) => `<button type="button" class="btn-choice" data-id="${esc(o.id)}">${esc(o.label)}</button>`).join("")}
          </div>
        </div>
      `, { name: "endfight-name" });
      G.router.$$("#hooks button").forEach((b) =>
        b.addEventListener("click", () => resolve({ answer: b.dataset.id, correct: b.dataset.id === endHook }))
      );
    });
  }

  // 第三拍：选。深夜时只改"离开"的含义（去睡觉），不再说"现在几点了"。
  function stepChoose({ allowStay, late }) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="stack talk demon">
          <p class="eyebrow">${fmt(G.t("gameDemon.stepChoose"))}</p>
          ${btn("leave", G.t(late ? "gameDemon.leaveMeansSleep" : "gameDemon.btnLeave"))}
          ${allowStay ? btn("stay", G.t("gameDemon.btnStay"), "btn-quiet") : ""}
          ${btn("noUrge", G.t("gameDemon.btnNoUrge"), "btn-quiet")}
          ${!allowStay && !late ? `<p class="hint">${fmt(G.t("gameDemon.nothingToStayFor"))}</p>` : ""}
        </div>
      `, { name: "endfight-choose" });
      ["leave", "stay", "noUrge"].forEach((id) => {
        const b = G.router.$("#" + id);
        if (b) b.addEventListener("click", () => resolve(id));
      });
    });
  }

  function updateStreaks(firstHold) {
    const c = cfg();
    G.state.update((s) => {
      const p = s.player;
      if (firstHold) {
        p.firstHoldStreak++;
        p.missStreak = 0;
        if (!p.autoStop && p.firstHoldStreak >= c.autoStopGainStreak) {
          p.autoStop = true;
          p.lostAutoStop = false;
        }
      } else {
        p.missStreak++;
        p.firstHoldStreak = 0;
        if (p.autoStop && p.missStreak >= c.autoStopLoseStreak) {
          p.autoStop = false;
          p.lostAutoStop = true;
        }
      }
    });
  }

  // 主流程。input: { session, sessionIndex, endHook, first, player:{firstHoldStreak,autoStop,lostAutoStop}, late, record, lastExit, onLeave }
  async function run(input) {
    const c = cfg();
    const sec = surfSeconds(input.player);
    const distract = !input.player.autoStop && sec >= c.surfDistractFromSec;
    const rec = input.record || {};
    const hes = (rec.hesitations || [])[0];
    const lines = input.first
      ? G.t("gameDemon.firstMeet")
      : G.f("gameDemonLine", {
          session: input.sessionIndex,
          hesitatedAt: hes && hes.at,
          hesitateMs: hes && hes.ms,
          lastExit: input.lastExit,
          hook: input.endHook,
          extends: input.training && input.training.extends,
          over: input.training && input.training.over,
          battleTaps: input.battle ? input.battle.taps : null,
        });

    G.fx.play("demon.appear", { who: "game" });
    const stop = await stepStop({ lines, sec, distract });
    const firstHold = stop.appearToHoldMs != null && stop.appearToHoldMs <= c.firstHoldWindowMs;
    // 第 1 局是零手把手教，不计入连续计数
    if (!input.first) updateStreaks(firstHold);
    G.events.log("endfight.stop", { appearToHoldMs: stop.appearToHoldMs == null ? -1 : Math.round(stop.appearToHoldMs), released: stop.released, surfSec: sec, held: true });
    // "走得越来越快"必须来自数据：这一次按住比之前几局的中位数快才算（Mary_V050 A2）
    const prevHolds = (G.state.get().player.holdHistory || []).slice();
    const median = (a) => { const b = a.slice().sort((x, y) => x - y); const m = Math.floor(b.length / 2); return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2; };
    const faster = stop.appearToHoldMs != null && prevHolds.length >= 2 && stop.appearToHoldMs < median(prevHolds);
    if (stop.appearToHoldMs != null) G.state.update((s) => (s.player.holdHistory = (s.player.holdHistory || []).concat(Math.round(stop.appearToHoldMs)).slice(-20)));

    const name = await stepName({ first: input.first, endHook: input.endHook });
    G.events.log("endfight.name", { hook: input.endHook, answer: name.answer, correct: name.correct });
    // 某一局认对后的一句旁白（schedule 的 nameRightLine，例如第 26 天"你已经会了。"）；认错什么都不说
    if (name.correct && input.session && input.session.nameRightLine) await G.screens.talk({ speaker: "narrator", lines: G.t(input.session.nameRightLine) });
    // 第一次自己认对钩子：一句小反馈（认出游戏自己的钩子值得被看见），然后如果还没有更高的称号，升看破者
    if (!input.first && name.correct) {
      if (!G.state.get().flags.firstRecognized) {
        G.state.update((s) => (s.flags.firstRecognized = true));
        const who = G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : "zero";
        await G.screens.talk({ speaker: who || "narrator", lines: G.t("gameDemon.recognized") });
      }
      if (G.titles) await G.titles.awardAndShow("seer");
    }

    // 深夜：第一次说"现在几点了？我不会每晚都提醒你"，之后只改"离开"的含义
    const late = input.late;
    if (late && !G.state.get().flags.lateNightNoticeShown) {
      await G.screens.talk({ speaker: "demon", lines: [].concat(G.t("gameDemon.lateNight"), G.t("gameDemon.lateNightOnce")) });
      G.state.update((s) => (s.flags.lateNightNoticeShown = true));
    }
    const allowStay = !input.first && !late;
    let choice = await stepChoose({ allowStay, late });

    if (choice === "stay") {
      const min = await askStayMinutes();
      G.events.log("endfight.choice", { choice: "stay", stayMin: min });
      const onTime = await stayMode(min);
      G.events.log("endfight.stay", { stayOnTime: onTime });
      choice = "leave";
    } else {
      G.events.log("endfight.choice", { choice });
    }

    await G.screens.talk({
      speaker: "demon",
      lines: choice === "noUrge" ? G.t("gameDemon.noUrge") : G.f("gameDemonDefeated", { session: input.sessionIndex, faster }),
      nextLabel: G.t("talk.leaveNow"),
    });
    // 玩家点了出口：立即停掉所有动画和声音，然后魔鬼退场
    G.fx.play("exit.tap", { choice });
    G.fx.play("demon.leave", { who: "game" });
    if (input.onLeave) input.onLeave(choice);
    return { choice, firstHold, named: name };
  }

  function askStayMinutes() {
    return new Promise((resolve) => {
      const c = cfg();
      const opts = [];
      for (let m = c.stayMinMin; m <= c.stayMaxMin; m++) opts.push(m);
      G.router.show(`
        <div class="stack talk demon">
          <p>${fmt(G.t("gameDemon.setStayMinutes"))}</p>
          <div class="row" id="mins">${opts.map((m) => `<button type="button" class="btn-choice" data-m="${m}">${m}</button>`).join("")}</div>
        </div>
      `, { name: "endfight-stay" });
      G.router.$$("#mins button").forEach((b) => b.addEventListener("click", () => resolve(Number(b.dataset.m))));
    });
  }

  // 带停止点继续：只开放图鉴与复习（M1 里只有倒计时与图鉴占位），到点游戏魔再出现。
  function stayMode(min) {
    return new Promise((resolve) => {
      const end = Date.now() + min * 60000;
      G.router.show(`
        <div class="stack center">
          <p class="eyebrow">${fmt(G.t("codex.title"))}</p>
          <p class="hint">${fmt(G.t("codex.empty"))}</p>
          <p class="timer" id="timer"></p>
        </div>
      `, { name: "stay" });
      const t = setInterval(() => {
        const left = Math.max(0, end - Date.now());
        const el = G.router.$("#timer");
        if (el) el.textContent = Math.ceil(left / 1000);
        if (left <= 0) {
          clearInterval(t);
          G.screens.talk({ speaker: "demon", lines: G.t("gameDemon.stayTimeUp"), nextLabel: G.t("gameDemon.btnLeave") }).then(() => resolve(true));
        }
      }, 250);
    });
  }

  G.gamedemon = { run, surfSeconds };
})();
