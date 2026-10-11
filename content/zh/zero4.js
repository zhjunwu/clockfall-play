// 中文剧本库：零复发线第 4 局（第 34 天：零的梦境）。Mark_V072，Mary_V061 修改。
// 联手战（零的圈）：深夜（夜枭）→ 老同伴（小红点）→ 只放一个（宝箱魔）→ 破罐魔"反正已经……"；中间是孤单的零。
// 认 = 点圈上正在出招的那个；招 = 那一关的手势；破罐魔用玩家第 31 天写的那句回它。
// 孤单那一环不能剪：点一下"陪它坐一会儿"，然后什么都不用做，圈就慢下来——不给技巧，只要在场。
// 认错 / 用错：圈最多加速一格，破罐魔"错了吧？反正……"，用那句话回它，立刻恢复原速。失误本身就是在练"失手后不放弃"。
// 最后零说"我已经回不去了"，玩家按住把那句话说出口，零的钟重新走起来。endHook: none。
// 作者：Claude（Mark）  审核人：（空）  状态：draft（Fable 5.1 润色，Junwu 2026-10-11 同意）
Game.content.register("zh", "zero4", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero4.eyebrow": "零的梦",
    "zero4.asleep": "零在钟楼下睡着了。",
    "zero4.companion": "它睡着了。梦里还在放。",
    "zero4.enter": ["你走进零的梦。", "梦里是一个圈。那一晚的每一样都在圈上，零坐在中间。"],
    "zero4.nodes": { owl: "深夜", dot: "老同伴", chest: "只放一个", jar: "反正已经……", zero: "零" },
    "zero4.whisper": {
      owl: "这么晚了，反正睡不着。",
      dot: "今天是你入行一周年。来，就一个。",
      chest: "就放一个。放一个不算什么。",
      jar: "放都放了。反正已经……",
    },
    "zero4.holdFirst": "先按住，再点出招的那一个。",
    "zero4.tapIt": "现在点它。",
    "zero4.wrong": "错了吧？反正……",
    "zero4.useLine": "用你那句回它",
    "zero4.speedBack": "圈慢回来了。",
    "zero4.gestureJar": "点出你写的那句",
    "zero4.sitQ": "中间坐着零。它一个人。",
    "zero4.sit": "陪它坐一会儿",
    "zero4.sitting": "你坐在它旁边。什么都不用做。",
    "zero4.slowed": "圈慢下来了。",
    "zero4.cantGoBack": "我已经回不去了。",
    "zero4.sayLine": "按住，把你那句话说给它听。",
    "zero4.clockMoves": "零的钟，动了一下。然后，又走了一格。",
    "zero4.awake": "……我梦见你了。",
    // 玩家第 31 天没有写反驳时用这一句（不应该出现，留作保底）
    "zero4.fallbackLine": "一次不等于全部。",
  },
  fn: {},
});
