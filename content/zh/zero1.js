// 中文剧本库：零复发线第 1 局（第 26 天：零的位置空着）。Mark_V072，Mary_V061 修改。
// 红线：零复发的原因绝不能是玩家没来；任何一句都不暗示"你不在，所以它掉回去了"。
// 不追零、不预告（"他的事，先放着"）；不奖励出席（不说"你来了就好"）。
// 最后一战没有零的提示；认对后旁白"你已经会了。"，认错什么都不说（schedule.nameRightLine）。endHook: none。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "zero1", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero1.absent": "零不在。它平时站的地方空着。",
    "zero1.notToday": "今天就巡逻。它的事，先放着。",
    "zero1.market": ["集市开着。面包师的炉子是热的。", "有人在摊位前站了一会儿，买了一个面包，走了。"],
    "zero1.youKnowIt": "你已经会了。",
  },
  fn: {
    // 同伴说零的近况：只讲看见的，不催、不预告
    "zero1.companionNews"({ who }) {
      if (who === "baker") return ["它昨晚一个人在钟楼下。我叫它，它没回头。", "它不在，城还在。"];
      return ["昨晚有人看见它一个人在钟楼下。", "它不在，城还在。"];
    },
  },
});
