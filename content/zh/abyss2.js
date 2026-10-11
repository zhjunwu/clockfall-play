// 中文剧本库：无底渊第 2 局（第 19 天：看穿 + 画门）。Mark_V058，Mary_V049 修改。
// 看穿：玩家亲手撑开卡片之间的缝——每一张都讲完了，拉人的是"没有最后一张"。不引研究，证据是玩家自己的数据。
// 修炼：撞墙一课（在里面画门，墙拒绝一次）→ 门外画门（三类选一）→ 进去，门亮后诱惑仍在，按住、出门。
// 结尾：图鉴"门"这一页，第四格"现实里的门"永远不在游戏里填满（收集钩，endHook: collection）。
// 魔鬼可以歪曲，但不能编造数据：开场嘲讽按第 1 局真实的估计结果分支。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "abyss2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 巡逻：第 1 局的现实任务 ----
    "abyss2.task.eyebrow": "巡逻报告 · 长廊",
    "abyss2.task.q": "上次刷完，你先猜了，再去看了吗？差了多少？",
    "abyss2.task.options": [
      { id: "lessMuch", label: "猜少了很多" },
      { id: "less", label: "猜少了一点" },
      { id: "close", label: "差不多" },
      { id: "more", label: "猜多了" },
      { id: "notTried", label: "这次没试" },
    ],
    "abyss2.task.skip": "不想说",
    "abyss2.task.reply.number": "记下了。这是你自己的数字。",
    "abyss2.task.reply.notTried": "没试也记下了。",
    "abyss2.task.reply.skip": "不说也行。",

    // ---- 看穿 ----
    "abyss2.xray.eyebrow": "长廊 · 看穿",
    "abyss2.xray.rewind": "我们把那一段倒回来看。",
    "abyss2.xray.find": "每一张都讲完了。你找找，哪里本来可以停？",
    "abyss2.xray.more": "……还有好多张",
    // 撑开的缝里依次出现（按顺序轮换）
    "abyss2.xray.gapLines": ["这一张讲完了。", "这里本来是一页的最后一行。", "这里本来是片尾。", "这里本来可以抬头。"],
    "abyss2.xray.found": "我找到了",
    "abyss2.xray.zero1": "每一张都讲完了。拉你的不是哪一张，是没有最后一张。",
    "abyss2.xray.zero2": ["书有最后一页，饭有吃完的时候，一集有片尾。", "这些地方不用你想，它们自己告诉你：可以停了。长廊把它们都抹平了。"],
    "abyss2.xray.abyss": "抹平了又怎样？你又不会自己停。",
    "abyss2.xray.zero3": "会的。只是要在进去之前。",

    // ---- 修炼：撞墙一课 ----
    "abyss2.inside.eyebrow": "训练场 · 长廊里面",
    "abyss2.inside.go": "先进去。",
    "abyss2.inside.nowDraw": "现在，画一扇门。",
    "abyss2.drawBtn": "画门",
    "abyss2.inside.refused": "在里面画不了门。",
    "abyss2.inside.zero": "看到了吗？进来以后，就没有地方画了。出来。",

    // ---- 修炼：门外画门 ----
    "abyss2.wall.eyebrow": "训练场 · 长廊入口",
    "abyss2.wall.say": "在门外画。",
    "abyss2.wall.hint": "在墙上拖出一扇门，或者点“画门”。",
    "abyss2.type.q": "门什么时候开？",
    "abyss2.types": [
      { type: "count", title: "数量门", options: [{ v: 5, label: "看到第 5 张" }, { v: 10, label: "看到第 10 张" }] },
      { type: "time", title: "时间门", options: [{ v: 30, label: "过了 30 秒" }, { v: 60, label: "过了 1 分钟" }] },
      { type: "feel", title: "感觉门", options: [{ v: "bored", label: "当我开始无聊地往下划的时候" }, { v: "forgot", label: "当我不记得上一张是什么的时候" }] },
    ],

    // ---- 修炼：走到门前 ----
    "abyss2.corridor.eyebrow": "训练场 · 长廊",
    "abyss2.door": "门",
    "abyss2.feelTap": "到了就点门",
    "abyss2.doorTempt": "门外什么都没有，里面还有好多。",
    "abyss2.doorOut": "出去",
    "abyss2.yours": "这是你自己定的。",
    "abyss2.leftBeforeDoor": "门还没亮，你就自己出来了。",

    // ---- 现实任务 ----
    "abyss2.realQ": "选一扇现实里的门。",
    "abyss2.realOptions": [
      { id: "timer", label: "打开之前，先设一个计时器" },
      { id: "count", label: "先说“看完这几个就起身”" },
      { id: "page2", label: "把它挪到手机第二页" },
    ],
    "abyss2.realDone": "画了没画，都回来告诉我。",

    // ---- 图鉴：门（endHook: collection） ----
    "codex.doors.title": "图鉴 · 门",
    "codex.doors.seen": "见过",
    "codex.doors.practiced": "练过",
    "codex.doors.real": "现实里的门",
    "codex.doors.realNote": "这一格在游戏外面。",
  },
  fn: {
    // 开场嘲讽：魔鬼可以歪曲，但不能编造数据
    "abyss2.boast"({ sec, n, exited, cardResult, timeResult }) {
      if (!n) return "你在我这儿待过，对吧？没数清吧。";
      const m = Math.floor(sec / 60), s = sec % 60;
      const t = m ? `${m} 分 ${s} 秒` : `${s} 秒`;
      const left = exited ? "还没看完就走了。" : "";
      const base = `上次你在我这儿待了 ${t}，看了 ${n} 张。${left}`;
      if (cardResult === "close" && timeResult === "close") return `${base}你猜对了？……下次就不一定了。`;
      return `${base}你自己都没数清。`;
    },
    "abyss2.realQIntro"({ app }) {
      return app ? `现实里也有门。挑一扇，下次打开${app}之前画上。` : "现实里也有门。挑一扇，下次打开那个 App 之前画上。";
    },
    // 门亮以后又看了几张（真实数据）
    "abyss2.doorResult"({ k }) {
      return k ? `门亮的时候你又看了 ${k} 张，然后停了。` : "门一亮你就停了。";
    },
    "abyss2.doorLabel"({ label }) {
      return `门：${label}`;
    },
  },
});
