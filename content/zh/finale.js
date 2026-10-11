// 中文剧本库：第 37～39 天"自己的巡逻"的旁白与第 40 天总结（Mark_V074，Mary_V062 修改，design 1.0.3）。
// 每一页只说真实数据；没有的数据那一行不出现。没报告不等于没停。不画趋势线、不评价。
// 零的话少：总结是玩家自己的，零只在第 2 页说一句、第 7 页说一句。
// 第 7 页：游戏魔是圈上最后一环——"你要剪我，就得离开"；按住，然后只有"离开"。按下"离开"时大钟敲响一下。不放续集钩、不亮牌。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "finale", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 第 37～39 天：没有人说话，只有一行旁白（按天轮换） ----
    "alone.lines": ["钟楼报了时。", "集市开着。", "长廊里有人推门出去。"],
    "patrol.reply.alone": "记下了。",

    // ---- 第 40 天 ----
    "finale.eyebrow": "第四十天",
    "finale.next": "下一页",
    "finale.prev": "上一页",
    "finale.leave": "离开",
    "finale.notFinished": ["有几局你没有走到。", "这一季到这里。"],
    "finale.ledgerTitle": "觉察账本",
    "finale.noReport37": "第 37 天起，你没有报告。",
    "finale.screenTitle": "每周屏幕时间（你填的）",
    "finale.zeroNumbers": "这些数字，只有你自己能读懂。",
    "finale.cityTitle": "城",
    // 被救的人：好圈（他们各自的习惯，不是建议）
    "finale.goodLoops": {
      baker: "烤一炉面包，等三个钟头。闻到香味，就想再烤一炉。",
      watchman: "早一点睡，白天就醒着。白天有一小块是我的，夜里就不用去抢。",
      messenger: "送到就回。回来的路上，有空就走一条没走过的路。",
    },
    "finale.zeroBack": "零回来了。它的钟停过一阵，又接着走。",
    "finale.codexTitle": "魔鬼图鉴",
    "finale.codex": [
      { id: "chest", name: "宝箱魔", moves: "新手好运、你想走就发光、计划的最后一次、差一点", counter: "停；开之前先定个数" },
      { id: "owl", name: "夜枭", moves: "只有夜晚是你的、只说半句、自动下一集、越累按钮越大", counter: "关灯时间到了就停；手机放到你选的地方；白天找回 10 分钟" },
      { id: "abyss", name: "无底渊", moves: "没有最后一张、门外什么都没有、藏起时间", counter: "进去之前画一扇门" },
    ],
    "finale.realRecordLabel": "现实战记",
    "finale.gameOnly": "（游戏里打过。）",
    "finale.exportCodex": "导出图鉴（只给你自己看）",
    "finale.titleTitle": "称号",
    "finale.autoStop": "状态：自动停",
    "finale.cardTitle": "护身卡",
    "finale.cardCues": "我的线索",
    "finale.noCues": "（你没有写线索。那也算一种答案。）",
    "finale.cardLoop": "我的圈，和我剪断的那一环",
    "finale.cardLine": "我的那句话",
    "finale.zeroLine": "你停下的那些次，都还算数。",
    "finale.cardHint": "可以截图留着。",
    "finale.lastLink": ["你剪了所有的环。只剩我了。", "你要剪我，就得离开。"],
    "finale.holdIt": "按住。",
    "finale.zeroGo": "去吧。钟会自己走一会儿。",
    "finale.seasonDone": "第一季结束了。",
  },
  fn: {
    "finale.clockLine"({ ticks }) {
      return `大钟走到了第 ${ticks} 格。`;
    },
    "finale.stops"({ n }) {
      return n ? `你停了 ${n} 次。` : "账本上还没有一次停。";
    },
    "finale.stopsByCue"({ label, n }) {
      return `${label}：${n} 次`;
    },
    "finale.since37"({ m }) {
      return `没有游戏陪着你的这几天（第 37 天起），你停了 ${m} 次。`;
    },
    "finale.week"({ week, hours }) {
      return `第 ${week} 周：${hours} 小时`;
    },
    // 现实战记：来自各关现实任务的真实报告
    "finale.real"({ id, n, owlTask, abyssDrew }) {
      if (id === "chest") return n ? `在线索上停住了 ${n} 次（第 1～7 天）。` : "";
      if (id === "owl") return owlTask === "phone" || owlTask === "both" ? "有一晚，手机比你先睡。" : owlTask === "slice" ? "白天找回过 10 分钟。" : "";
      if (id === "abyss") return abyssDrew === "drew" || abyssDrew === "drewLong" ? "现实里画过一扇门。" : "";
      return "";
    },
  },
});
