// 中文剧本库：零复发线第 5 局（第 36 天：零回来）。Mark_V072，Mary_V061 修改。
// 零的钟没有回到零点，只是停过一阵（和 A4 一致：钟永不倒走）。第 36 天零讲自己那句；对玩家那句留给以后玩家失手时。
// 同伴只说欢迎，不说教。零把玩家第 31 天那句话还给玩家。最后说明规则："接下来的巡逻，你自己来。"（不说"三天"，Mary_V061 第 6 点）
// endHook: none。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "zero5", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "zero5.back": ["零站在它平时的位置。", "胸口那一点，又是暗红了。"],
    "zero5.shorter": "第二次回来的路，比第一次短多了。",
    "zero5.clock": "零的小钟上，有一段停住的灰。灰的后面，接着走。",
    "zero5.notErased": "我停的那几天，没有把前面的抹掉。",
    "zero5.forYou": "如果哪天你也失手了，记得：你停下的那些次，都还算数。",
    "zero5.welcome": { baker: "欢迎回来。", watchman: "钟楼下的那一盏，我替你关了。", messenger: "你那张地图，我送回给你。" },
    "zero5.giveBack": "这句是你的。你留着。",
    "zero5.ownPatrol": "接下来的巡逻，你自己来。我在，但不说话。",
  },
  fn: {},
});
