// 宝箱魔第 1 局：被偷。节拍见 docs/helper/Mary_V003.md 1.2。
// 假通知 → 零的第一张明牌 → 集市小游戏 → 现形 → 地图一条 → 现实任务 → 悬念（runner 亮牌并进入最后一战）
(function () {
  const G = window.Game;
  const { fmt, paras, btn } = G.dom;
  const talk = (o) => G.screens.talk(o);

  // 假通知：两个选择都进城。"不理它"是玩家第一个"我做到了"的瞬间，零的台词分支。
  function notice(ctx) {
    return new Promise((resolve) => {
      G.router.show(`
        <div class="notice" id="notice">
          <span class="reddot" aria-hidden="true"></span>
          <b>${fmt(G.t("notice.title"))}</b>
          <p>${fmt(G.t("notice.body"))}</p>
          <div class="row">
            ${btn("tap", G.t("notice.open"), "btn-choice")}
            ${btn("ignore", G.t("notice.ignore"), "btn-choice")}
          </div>
        </div>
      `, { name: "notice" });
      G.router.$("#tap").addEventListener("click", () => {
        ctx.tapped = true;
        G.events.log("notice", { choice: "tap" });
        resolve();
      });
      G.router.$("#ignore").addEventListener("click", () => {
        ctx.tapped = false;
        G.events.log("notice", { choice: "ignore" });
        resolve();
      });
    });
  }

  function recordInfo(rec) {
    rec = rec || { plan: null, taps: [], stoppedByUser: false };
    return {
      plan: rec.plan,
      n: rec.taps.length,
      stoppedByUser: rec.stoppedByUser,
      hitSecond: !!(rec.taps[1] && rec.taps[1].kind === "big"),
    };
  }

  const session1 = [
    notice,
    () => talk({ speaker: "narrator", lines: G.t("city.firstLook") }),
    async (ctx) => {
      if (ctx.tapped) {
        await talk({ speaker: "zero", lines: G.t("zero.whyTapped") });
        await talk({ speaker: "zero", lines: G.t("zero.iDidThat") });
      } else {
        await talk({ speaker: "zero", lines: G.t("zero.whyNotTapped") });
      }
      await G.flags.show("redDot");
    },
    () => talk({ speaker: "zero", lines: G.t("zero.whyYou") }),
    async (ctx) => {
      ctx.record = await G.levels.chest.minigame();
      G.state.update((s) => (s.sessions.chest1 = Object.assign(s.sessions.chest1 || {}, { record: ctx.record })));
    },
    (ctx) => (
      G.fx.play("chest.reveal", {}),
      talk({
        speaker: "chest",
        lines: [G.t("chest.revealOpen"), G.f("chest.revealLine", recordInfo(ctx.record)), G.t("chest.revealClose")],
        extraHtml: `<p class="gloat">${fmt(G.t("chest.revealGloat"))}</p>`,
      })
    ),
    () => talk({ speaker: "zero", lines: G.t("zero.beforeMap") }),
    async () => {
      await G.mapform.flow({ intro: true, insist: true });
      if (G.map.cues().length) await talk({ speaker: "narrator", lines: G.t("map.firstShadow") });
      else await talk({ speaker: "zero", lines: G.t("map.noCueRespect") });
    },
    () => talk({ speaker: "zero", lines: G.t("zero.observeTask") }),
    // 悬念：宝箱魔的声音停在半句，按记录分支。runner 随后按 endHook 亮牌。
    (ctx) => talk({ speaker: "chest", lines: G.f("chest.cliffLine", recordInfo(ctx.record)), nextLabel: G.t("talk.silence") }),
  ];

  G.levels.chest = G.levels.chest || {};
  G.levels.chest.session1 = session1;
})();
