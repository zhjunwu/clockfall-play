// 安全网：多次选孤单、难过类情绪，或夜枭关多次选"几乎没睡"时，在场角色轻轻提一句并给出求助渠道，只提一次。
// 不做诊断。任何一天都必须能触发（无人在场时用中性的系统文字）。
(function () {
  const G = window.Game;
  const THRESHOLD = 2;

  function bump(reason) {
    G.state.update((s) => (s.flags.safetyNetCount = (s.flags.safetyNetCount || 0) + 1));
    G.events.log("safety.bump", { option: reason });
  }

  // 地图里选了需要留意的情绪
  function bumpIfMood(mood) {
    const list = G.t("help.safetyMoods");
    if (Array.isArray(list) && mood && list.includes(mood)) bump("mood");
  }

  function due() {
    const s = G.state.get();
    return (s.flags.safetyNetCount || 0) >= THRESHOLD && !s.flags.safetyNetShown;
  }

  // speaker: "zero" / "baker" / null（无人在场）
  async function maybeShow(speaker) {
    if (!due()) return false;
    G.state.update((s) => (s.flags.safetyNetShown = true));
    G.events.log("safety.shown", { option: speaker || "none" });
    const res = G.t("help.resources");
    const list = Array.isArray(res) ? `<ul class="resources">${res.map((r) => `<li><b>${G.dom.esc(r.name)}</b><span>${G.dom.esc(r.how)}</span></li>`).join("")}</ul>` : "";
    await G.screens.talk({
      speaker: speaker || "narrator",
      lines: G.t(speaker ? "help.gentleCheck" : "help.gentleCheckNeutral"),
      extraHtml: list,
    });
    return true;
  }

  G.safety = { bump, bumpIfMood, due, maybeShow };
})();
