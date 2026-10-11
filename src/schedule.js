// 第一季日历（design.md 6.3）。每局：id、所属关卡、最早可玩日、结尾钩子（最后一战"认"的标准答案）。
// endHook 由写剧本的人在写那一局时决定；未写的局标 "tbd"，checks 对 tbd 报警告。
// 整季约束（checks 检查）：至少用到 3 种不同的钩子，至少 2 局是 none。
// beats 由各关卡模块在加载后挂上（Game.levels.<level>.<key>）。
(function () {
  const G = window.Game;

  const list = [
    // playable: 该局的 beats 已实现。playable 的局 endHook 不能是 tbd（checks 会失败）。
    { id: "chest1", level: "chest", key: "session1", earliestDay: 1, endHook: "cliffhanger", playable: true },
    { id: "chest2", level: "chest", key: "session2", earliestDay: 3, endHook: "progress", playable: true },
    { id: "chest3", level: "chest", key: "session3", earliestDay: 6, endHook: "cliffhanger", playable: true },
    { id: "owl1", level: "owl", key: "session1", earliestDay: 8, endHook: "cliffhanger", playable: true },
    { id: "owl2", level: "owl", key: "session2", earliestDay: 10, endHook: "none", playable: true },
    { id: "owl3", level: "owl", key: "session3", earliestDay: 13, endHook: "cliffhanger", playable: true, patrolDetail: false },
    { id: "abyss1", level: "abyss", key: "session1", earliestDay: 17, endHook: "escalation", flagId: "flag.escalationAbyss", playable: true },
    { id: "abyss2", level: "abyss", key: "session2", earliestDay: 19, endHook: "collection", playable: true, patrolDetail: false },
    { id: "abyss3", level: "abyss", key: "session3", earliestDay: 22, endHook: "cliffhanger", quietFlag: true, playable: true, patrolDetail: false },
    { id: "loop", level: "loop", key: "session1", earliestDay: 25, endHook: "cliffhanger", quietFlag: true },
    { id: "zero1", level: "zero", key: "session1", earliestDay: 26, endHook: "tbd" },
    { id: "zero2", level: "zero", key: "session2", earliestDay: 28, endHook: "tbd" },
    { id: "zero3", level: "zero", key: "session3", earliestDay: 31, endHook: "tbd" },
    { id: "zero4", level: "zero", key: "session4", earliestDay: 34, endHook: "tbd" },
    { id: "zero5", level: "zero", key: "session5", earliestDay: 36, endHook: "none" },
  ];

  function beatsOf(session) {
    const lv = G.levels[session.level];
    return lv && lv[session.key] ? lv[session.key] : null;
  }

  function byId(id) {
    return list.find((s) => s.id === id) || null;
  }

  G.schedule = { list, beatsOf, byId, summaryDay: 40 };
})();
