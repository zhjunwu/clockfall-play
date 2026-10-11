// 可调参数。试玩后按数据调整，不改引擎代码。
(function () {
  const G = window.Game;
  const params = new URLSearchParams(location.search);
  G.config = {
    // 开发模式：只由显式参数 ?dev=1 开启，与协议无关。试玩者双击打开不会看到开发面板。
    // 开发模式使用独立的存储键，不碰真实存档。
    devEnabled: params.get("dev") === "1",
    // 试玩模式：?playtest=1 开启事件日志并持久化这个开关。
    playtestParam: params.get("playtest") === "1",

    // 时间
    dayStartHour: 6, // 游戏日边界：本地 06:00
    lateNightFrom: 23, // 深夜窗口 23:00 到次日 05:59
    totalDays: 40,
    weeklyAskFromWeek: 2, // 周屏幕时间从第 2 周起问
    weeklyAskToWeek: 6,

    // 大钟
    clockMax: 100,
    tick: { noticed: 2, later: 1, nowRemember: 1, notAppear: 0, leave: 1, noUrge: 1, training: 1 },
    dailyRealTickLimit: 2, // 现实部分每天最多计 2 次

    // 最后一战
    firstHoldWindowMs: 3000, // "第一时间按住" = "按住"区域亮起后 3 秒内
    holdRevealDelayMs: 1500, // 台词先出现，"按住"区域延迟亮起，给人读字的时间
    surfBaseSec: 10,
    surfPerStreakSec: 2,
    surfMaxSec: 30,
    surfAutoStopSec: 15,
    surfDistractFromSec: 20,
    autoStopGainStreak: 5,
    autoStopLoseStreak: 2,
    stayMinMin: 1,
    stayMaxMin: 3,

    // "停"
    holdMs: 1000,
    doubleTapWindowMs: 1500,

    // 地图
    mapInsistMax: 2, // 零坚持要一条线索最多两次

    // 练习场
    trainingExtendMax: 1,

    // 存档码前缀
    saveCodePrefix: "CF1.",
  };
})();
