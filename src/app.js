// 启动与公共屏幕：语言选择、城市、设置（语言、求助、存档码）、日历、开发面板。
// 关卡内容由 session/runner 接管；这里只负责进门和公共入口。
(function () {
  const G = window.Game;
  const { esc, fmt, paras, btn } = G.dom;

  function boot() {
    G.router.init(document.getElementById("app"));
    G.state.load();
    const lang = G.i18n.detectInitial();
    if (!lang) return langScreen();
    G.i18n.setLang(lang);
    if (G.clock.isLateNight()) G.fx.play("night.enter", {});
    enterCity();
  }

  // ---------- 语言选择（首次） ----------
  function langScreen() {
    const p = G.i18n.packs;
    const text = (l, id) => {
      const c = p[l] && p[l].common && p[l].common.text;
      return c ? c[id] : "";
    };
    // 唯一一处两种语言同时出现：游戏名并排，按钮居中放大，别的什么都不加
    G.router.show(`
      <div class="langpick">
        <h1 class="langtitle">${G.i18n.LANGS.map((l) => `<span lang="${l}">${esc(text(l, "game.title"))}</span>`).join('<i aria-hidden="true">/</i>')}</h1>
        <div class="stack" id="langs">
          ${G.i18n.LANGS.map((l) => `<button type="button" class="btn-main" data-lang="${l}">${esc(text(l, "lang." + l) || l)}</button>`).join("")}
        </div>
      </div>
    `, { name: "lang" });
    G.router.$$("#langs button").forEach((b) =>
      b.addEventListener("click", () => {
        G.i18n.setLang(b.dataset.lang);
        G.events.log("lang", { lang: b.dataset.lang });
        enterCity();
      })
    );
  }

  // ---------- 进城 ----------
  // 第一次：直接开始第 1 局（假通知就是第一屏）。之后：城市。
  // 上次在最后一战期间关掉页面 = 离开：补记一格，在场角色说一句。
  function enterCity() {
    const s = G.state.get();
    // 开场故事：第一次进城前播一次（零的通知紧接在后面）
    if (!s.startedAt && G.prologue && !G.prologue.seen()) return G.prologue.play().then(enterCity);
    if (!s.startedAt) {
      G.state.update((x) => (x.startedAt = Date.now()));
      const first = G.schedule.list[0];
      if (G.schedule.beatsOf(first) && G.session) return G.session.start(first);
    }
    let closedNote = false;
    if (s.inProgress && s.inProgress.phase === "endfight") {
      const id = s.inProgress.sessionId;
      const playedDay = G.clock.dayOfTimestamp(s.inProgress.startedAt) || G.clock.today();
      G.ledger.tick("leave");
      G.state.update((x) => {
        x.sessions[id] = Object.assign(x.sessions[id] || {}, { exit: "closed", endedAt: Date.now() });
      });
      // 补记到玩的那一天，不占用今天的"一局"
      G.clock.markSessionDone(id, playedDay);
      G.events.log("session.end", { sessionId: id, choice: "closed" });
      closedNote = true;
    } else if (s.inProgress) {
      G.state.update((x) => (x.inProgress = null));
    }
    city({ closedNote });
  }

  function clockWidget() {
    const s = G.state.get();
    const pct = Math.min(100, Math.round((s.ledger.clockTicks / G.config.clockMax) * 100));
    return `<div class="bigclock" aria-hidden="true"><div class="hand" style="--pct:${pct}"></div></div>`;
  }

  // 当前称号；"自动停"是状态，分开显示
  function titleWidget() {
    const s = G.state.get();
    const t = s.player.title || "stolen";
    return `<p class="titleline"><span class="title">${fmt(G.t("title." + t))}</span>${s.player.autoStop ? `<span class="status">${fmt(G.t("status.autoStop"))}</span>` : ""}</p>`;
  }

  // 城市画面不主动预告下一局；时间信息只在日历页。
  function city(opts) {
    opts = opts || {};
    const day = G.clock.touch();
    const next = G.clock.nextSession();
    let entry = "";
    let note = "";
    if (opts.done) note = `<p class="hint">${fmt(G.t("city.doneForToday"))}</p>`;
    // 快进测试模式：城市画面上写明，免得测试的人以为是正式版
    if (G.config.fastDayMinutes) note = `<p class="hint fastnote">${fmt(G.f("test.fastday", { minutes: G.config.fastDayMinutes, day }))}</p>` + note;
    if (opts.closedNote) note = `<p class="hint">${fmt(G.t("gameDemon.closedIsLeave"))}</p>`;
    let patrolBtn = "";
    if (next) {
      const can = G.clock.canPlay(next);
      if (can.ok && G.schedule.beatsOf(next)) entry = btn("enter", G.t("city.enter"));
      else if (can.ok) entry = `<p class="hint">${fmt(G.t("lock.notYet"))}</p>`;
      else if (can.why === "onePerDay" && !note) note = `<p class="hint">${fmt(G.t("lock.catchUpOnePerDay"))}</p>`;
      // 今天没有主线可打、也没打过主线：可以巡逻（每天一次）。主线局里已含巡逻报告，同一天不再巡逻。
      const playedToday = !!G.state.get().calendar.sessionDoneOnDay[day];
      if (!(can.ok && G.schedule.beatsOf(next)) && !playedToday && day > 1 && G.patrolday) {
        patrolBtn = G.patrolday.doneToday() ? `<p class="hint">${fmt(G.t("city.patrolDone"))}</p>` : btn("patrol", G.t("city.patrol"), "btn-quiet");
      }
    }
    G.router.show(`
      <header class="topbar">
        <button type="button" class="icon" id="calendar" aria-label="${esc(G.text("calendar.icon"))}">◷</button>
        <button type="button" class="icon" id="settings" aria-label="${esc(G.text("settings.title"))}">≡</button>
      </header>
      <div class="stack center">
        <h1>${fmt(G.t("game.title"))}</h1>
        ${clockWidget()}
        ${titleWidget()}
        ${note}
        ${entry}
        ${patrolBtn}
      </div>
      ${G.config.devEnabled ? devPanel(day) : ""}
    `, { name: "city" });
    G.router.$("#settings").addEventListener("click", settings);
    G.router.$("#calendar").addEventListener("click", () => calendar(day));
    const e = G.router.$("#enter");
    if (e) e.addEventListener("click", () => G.session.start(next));
    const p = G.router.$("#patrol");
    if (p) p.addEventListener("click", () => G.patrolday.run());
    G.router.$$("[data-dev]").forEach((b) => b.addEventListener("click", () => devAction(b.dataset.dev)));
  }

  // ---------- 日历（点开才看到） ----------
  function calendar(day) {
    const next = G.clock.nextSession();
    G.router.show(`
      <div class="stack">
        <p>${next ? fmt(G.f("calendar.nextSession", { day: next.earliestDay, today: day })) : ""}</p>
        ${btn("back", G.t("settings.close"), "btn-quiet")}
      </div>
    `, { name: "calendar" });
    G.router.$("#back").addEventListener("click", () => city());
  }

  // ---------- 设置：语言、求助、存档码 ----------
  function resourceList() {
    const res = G.t("help.resources");
    if (!Array.isArray(res)) return `<p>${fmt(res)}</p>`;
    return `<ul class="resources">${res
      .map((r) => {
        const how = r.tel ? `<a href="tel:${esc(r.tel)}">${esc(r.how)}</a>` : esc(r.how);
        return `<li><b>${esc(r.name)}</b><span>${how}</span></li>`;
      })
      .join("")}</ul>`;
  }

  function settings() {
    const playtest = G.events.enabled;
    G.router.show(`
      <div class="stack">
        <h2>${fmt(G.t("settings.title"))}</h2>
        <section class="stack">
          <p class="eyebrow">${fmt(G.t("lang.switch"))}</p>
          <div class="row">
            ${G.i18n.LANGS.map((l) => `<button type="button" class="btn-choice" data-lang="${l}" aria-pressed="${l === G.i18n.lang}">${esc(G.i18n.packs[l].common.text["lang." + l])}</button>`).join("")}
          </div>
          ${G.prologue ? btn("replayPrologue", G.t("settings.prologue"), "btn-quiet") : ""}
        </section>
        <section class="stack">
          <label class="pick" for="altHold"><input type="checkbox" id="altHold" ${G.state.get().flags.holdAlternative ? "checked" : ""}><span>${fmt(G.t("a11y.holdAlternative"))}</span></label>
          <label class="pick" for="sound"><input type="checkbox" id="sound" ${G.state.get().flags.sound ? "checked" : ""}><span>${fmt(G.t("settings.sound"))}<small class="hint"> ${fmt(G.t("settings.soundNote"))}</small></span></label>
        </section>
        <section class="stack help">
          <p class="eyebrow">${fmt(G.t("help.menuEntry"))}</p>
          ${paras(G.t("help.notTherapy"))}
          ${resourceList()}
        </section>
        <section class="stack">
          <p class="eyebrow">${fmt(G.t("save.section"))}</p>
          <p class="hint">${fmt(G.t("save.exportWarning"))}</p>
          ${btn("export", G.t("save.export"), "btn-quiet")}
          <textarea id="exportBox" class="code" readonly hidden></textarea>
          <textarea id="importBox" class="code" placeholder="${esc(G.text("save.importPrompt"))}"></textarea>
          ${btn("import", G.t("save.import"), "btn-quiet")}
          <p class="hint" id="importMsg" aria-live="polite"></p>
        </section>
        ${playtest ? `<section class="stack">${btn("ptExport", G.t("playtest.export"), "btn-quiet")}<p class="hint" id="ptMsg" aria-live="polite">${fmt(G.t("playtest.sendHint"))}</p><textarea id="ptBox" class="code" readonly hidden></textarea></section>` : ""}
        ${btn("back", G.t("settings.close"))}
      </div>
    `, { name: "settings" });
    G.router.$$("[data-lang]").forEach((b) =>
      b.addEventListener("click", () => {
        G.i18n.setLang(b.dataset.lang);
        settings();
      })
    );
    const rp = G.router.$("#replayPrologue");
    if (rp) rp.addEventListener("click", () => G.prologue.play({ replay: true }).then(settings));
    G.router.$("#sound").addEventListener("change", (e) => {
      G.state.update((s) => (s.flags.sound = !!e.target.checked));
      G.fx.play(e.target.checked ? "sound.on" : "sound.off", {});
    });
    G.router.$("#altHold").addEventListener("change", (e) => {
      G.state.update((s) => (s.flags.holdAlternative = !!e.target.checked));
      G.events.log("a11y", { option: e.target.checked ? "doubleTap" : "hold" });
    });
    G.router.$("#export").addEventListener("click", () => {
      const box = G.router.$("#exportBox");
      box.value = G.save.exportCode();
      box.hidden = false;
      box.select();
    });
    G.router.$("#import").addEventListener("click", () => {
      const r = G.save.importCode(G.router.$("#importBox").value);
      G.router.$("#importMsg").textContent = G.text(r.ok ? "save.importOk" : "save.importBad");
      if (r.ok) G.i18n.setLang(G.state.get().lang || G.i18n.lang);
    });
    const pt = G.router.$("#ptExport");
    if (pt)
      // 手机上：先弹系统分享（可直接发到聊天软件或邮件）；不支持就复制到剪贴板；都不行才显示文本框让玩家自己复制
      pt.addEventListener("click", async () => {
        const data = G.events.exportText();
        const msg = G.router.$("#ptMsg");
        const showBox = () => {
          const box = G.router.$("#ptBox");
          box.value = data;
          box.hidden = false;
          box.select();
        };
        if (navigator.share) {
          try {
            await navigator.share({ text: data });
            G.events.log("playtest.export", { option: "share" });
            return;
          } catch (e) {
            if (e && e.name === "AbortError") return; // 玩家自己取消了分享
          }
        }
        try {
          await navigator.clipboard.writeText(data);
          msg.textContent = G.text("playtest.copied");
          G.events.log("playtest.export", { option: "copy" });
        } catch (e) {
          showBox();
          msg.textContent = G.text("playtest.manualCopy");
          G.events.log("playtest.export", { option: "box" });
        }
      });
    G.router.$("#back").addEventListener("click", () => city());
  }

  // ---------- 开发面板（只在 ?dev=1） ----------
  function devPanel(day) {
    const o = G.clock.devOverride();
    const link = (d, h) => `?dev=1&day=${d}&hour=${h}&lang=${G.i18n.lang}`;
    return `
      <details class="dev">
        <summary>${fmt(G.t("dev.title"))} · day ${day} · ${G.clock.isLateNight() ? "late" : "day"}${o ? " · override" : ""}</summary>
        <div class="row">
          ${[1, 2, 3, 6, 7, 8, 25, 26, 36, 40].map((d) => `<a href="${link(d, 12)}">d${d}</a>`).join("")}
          <a href="${link(day, 23)}">23h</a>
          <a href="${link(day, 5)}">05h</a>
          <a href="?dev=1&lang=${G.i18n.lang}">real</a>
        </div>
        <div class="row">
          <button type="button" class="btn-quiet" data-dev="reset">reset</button>
          <button type="button" class="btn-quiet" data-dev="events">events</button>
          <button type="button" class="btn-quiet" data-dev="replay">replay</button>
        </div>
        <pre id="devOut"></pre>
      </details>`;
  }

  function devAction(what) {
    if (what === "reset") {
      G.state.reset();
      location.search = "?dev=1";
    } else if (what === "events") {
      G.router.$("#devOut").textContent = G.events.exportText();
    } else if (what === "replay") {
      // 重玩第 1 局（开发用）：清掉完成记录
      G.state.update((s) => {
        s.calendar.completedSessions = [];
        s.calendar.sessionDoneOnDay = {};
        s.inProgress = null;
      });
      city();
    }
  }

  G.app = { boot, city, settings, langScreen };
  document.addEventListener("DOMContentLoaded", boot);
})();
