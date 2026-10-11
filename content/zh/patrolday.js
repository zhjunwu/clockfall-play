// 中文剧本库：巡逻日（没有主线的日子）：小喽啰、被救者近况、结束一句。不留钩子。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "patrolday", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "city.patrol": "巡逻",
    "city.patrolDone": "今天巡逻过了。",
    // ---- 小喽啰 ----
    "minion.eyebrow": "城里有小东西",
    "minion.intro": "几个小喽啰。按住，它们就定住；再点出它的名字，就没了。认错了它只是跑掉。",
    "minion.skip": "不管它们",
    "minion.holdFirst": "先按住",
    "minion.whichOne": "这是什么？",
    "minion.redDot": "小红点",
    "minion.autoplay": "自动播放倒计时",
    "minion.streak": "连签火苗",
    "minion.killed": "没了。",
    "minion.escaped": "它跑了。没关系。",
    "minion.done": "清完了。",
    // ---- 被救者近况（彼此独立，不连载） ----
    "rescued.baker": [
      "面包师今天烤了核桃的。",
      "面包师在摊子前打了个盹。",
      "面包师把一块面包放在钟楼下面，没说给谁。",
      "面包师在教一个小孩揉面。",
    ],
    "rescued.watchman": [
      "守夜人在钟楼下扫台阶。",
      "守夜人今天早早就熄了灯。",
      "守夜人在白天的太阳底下坐了一会儿。",
      "守夜人在给钟擦灰。",
    ],
    "rescued.messenger": [
      "信使送完一封信，往回走了。",
      "信使在长廊的窗边停了一下。",
      "信使今天走了一条没走过的路。",
      "信使把空包挂在门后。",
    ],
    // ---- 结束 ----
    "zero.patrolEnd": ["巡逻完了。", "城还在。你也在。"],
    "alone.patrolLine": "城很安静。钟在走。",
  },
  fn: {
    // 零失踪期间（第 26～35 天）同伴的回城台词：小句库，随机抽，不催促、不预告
    "companion.returnLine"({ who }) {
      const baker = [
        "零不在。它的位置空着。我替它看着集市。",
        "还没见到零。炉子我一直开着。",
        "钟楼那边昨晚有光。",
        "零还没回来。",
      ];
      if (who === "baker") return baker;
      return "零不在。";
    },
    // 只讲现在，不讲明天
    "companion.patrolEnd"({ who }) {
      if (who === "baker") return "今天就这样。炉子还热着。";
      return "今天就这样。";
    },
  },
});
