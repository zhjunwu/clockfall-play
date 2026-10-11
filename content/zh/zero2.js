// 中文剧本库：零复发线第 2 局（第 28 天：零的小红点、零的地图）。Mark_V072，Mary_V061 修改。
// 零的小红点：静止、很淡、不闪——这一刻是玩家发现朋友出了事，不是"被偷"演示（Mary_V061 第 2 点）。
// 零的地图只有一条（深夜、钟楼下、有点孤单、老同伴）——"孤单"是零自己的线索，不进任何对玩家说的魔鬼台词。
// 红线：零失手的原因是它自己的线索，绝不是玩家没来。
// 结尾：悬念（endHook: cliffhanger），专用亮牌说破"用担心一个角色拉人回来"。
// 作者：Claude（Mark）  审核人：（空）  状态：draft（Fable 5.1 润色，Junwu 2026-10-11 同意）
Game.content.register("zh", "zero2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero2.dot": "集市的角落里，有一个小红点。很淡，不闪，就在那里。",
    "zero2.recognizeQ": "这是谁的？",
    "zero2.options": [
      { id: "notice", label: "一条普通的通知" },
      { id: "chest", label: "宝箱魔的" },
      { id: "zero", label: "这是零的" },
    ],
    "zero2.right": "这是零的。它以前就是干这个的。",
    "zero2.lookAgain": "再看看那条尾巴。",
    "zero2.foundMap": "小红点下面压着一张纸。是零的字。",
    "zero2.mapTitle": "零的魔鬼地图",
    // 零的那一条：什么时候 / 在哪里 / 什么心情 / 打开什么
    "zero2.mapCells": [
      { id: "night", label: "什么时候", value: "深夜" },
      { id: "tower", label: "在哪里", value: "钟楼下" },
      { id: "lonely", label: "什么心情", value: "有点孤单" },
      { id: "oldFriend", label: "打开什么", value: "老同伴说“今天是你入行一周年”" },
    ],
    "zero2.mapNote": "我只放了一个。",
    "zero2.howItHappened": ["深夜，一个人，在老地方。", "老同伴来了，说今天是个日子。", "它就想：就一个。"],
    "zero2.earliestQ": "像你给自己做的那样：这一条里，最早的是哪一格？",
    "zero2.earliestDone": "见到它的时候，从这一格说起。",
    "zero2.tower": ["钟楼顶上，有一点红光亮着。", "它还在城里。"],
    "flag.cliffhangerZero": "我让你担心一个角色，好让你下次回来。很多游戏都这么做。",
  },
  fn: {},
});
