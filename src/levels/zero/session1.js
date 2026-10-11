// 零复发线第 1 局（第 26 天）：零的位置空着。回城（同伴）与巡逻（同伴问）由 runner 做。
// 空位 → 同伴说零的近况（不追、不预告）→ 看一眼复苏的集市 → 最后一战没有零的提示（认对后旁白"你已经会了。"）。
(function () {
  const G = window.Game;
  const talk = (o) => G.screens.talk(o);
  const who = () => (G.patrolday ? G.patrolday.whoIsPresent(G.clock.today()) : null) || "narrator";

  const session1 = [
    () => {
      G.fx.play("zero.absent", {});
      return talk({ speaker: "narrator", lines: G.t("zero1.absent") });
    },
    () => talk({ speaker: who(), lines: G.f("zero1.companionNews", { who: who() }) }),
    () => talk({ speaker: who(), lines: G.t("zero1.notToday") }),
    () => {
      G.fx.play("district.show", { district: "market" });
      return talk({ speaker: "narrator", lines: G.t("zero1.market") });
    },
  ];

  G.levels.zero = G.levels.zero || {};
  G.levels.zero.session1 = session1;
})();
