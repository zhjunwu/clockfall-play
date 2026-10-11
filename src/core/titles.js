// 称号：只看游戏内事件，不看现实报告次数。"自动停"是状态，不是称号，分开显示。
// 顺序：被偷者 → 看破者（第一次自己认对钩子）→ 猎魔人·一/二/三（每打败一个魔鬼）→ 解缚者（救回零）→ 守时人（以后的季）
(function () {
  const G = window.Game;
  const ORDER = ["stolen", "seer", "hunter1", "hunter2", "hunter3", "unbinder", "keeper"];

  function rank(id) {
    return ORDER.indexOf(id);
  }

  function current() {
    return G.state.get().player.title || "stolen";
  }

  // 授予更高的称号；返回是否升级
  function award(id) {
    if (rank(id) <= rank(current())) return false;
    G.state.update((s) => (s.player.title = id));
    G.events.log("title", { titleId: id });
    return true;
  }

  // 升级画面：简短，不夸
  function show(id) {
    const { fmt } = G.dom;
    return G.screens.talk({
      speaker: "narrator",
      eyebrow: G.t("title.earned"),
      lines: G.t("title." + id),
      nextLabel: G.t("talk.next"),
    });
  }

  async function awardAndShow(id) {
    if (award(id)) await show(id);
  }

  G.titles = { ORDER, current, award, show, awardAndShow };
})();
