// 中文剧本库：第 25 天"圈"。Mark_V067，Mary_V055 修改。
// 墙上的圈（三只魔鬼连成一个圈，被救者各说一句）→ 你的圈（2～5 环，不强求放满）→ 圈上的裂缝（来自真实的"停住了"报告）
// → 练习圈（简化联手战：认魔鬼，三个手势，不加速，没有血条和破罐魔）→ 剪哪一环（现实任务）→ 零发呆（endHook: cliffhanger，安静样式）。
// 科学表述：圈是帮助理解的模型，说"很多人的夜晚是这样转的"，不说"成瘾就是这样一个圈"（交审核人）。
// 结论不放进台词（规则 8）："越靠前越省力"改成零的个人做法"我会先剪最前面那一环。"
// "心情更差"给安全网记一次，不进任何魔鬼台词。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "loop", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "loop.eyebrow": "钟楼下 · 圈",
    // ---- 墙上的圈 ----
    "loop.pinIntro": "零把三张画钉到墙上，用一根线连起来。",
    "loop.notThree": "它们不是三个。是一个圈。",
    "loop.slots": [
      { id: "start", label: "开始" },
      { id: "hold", label: "停不下来" },
      { id: "after", label: "后果" },
    ],
    "loop.wallNodes": { start: "一个小红点", hold: "宝箱魔 · 无底渊", after: "夜枭" },
    "loop.baker": "我那时候开一个，想再开一个。开完了又累，累了就更想开。",
    "loop.watchman": "白天太长，夜里太短。我守的不是夜，是我自己的那一点时间。",
    "loop.messenger": "我一直走，是因为一直看不到头。看不到头，就一直走。",
    "loop.manyNights": "很多人的夜晚，是这样转的。",
    "loop.seen": "圈最怕的，是你看见它。你现在看见了。",

    // ---- 你的圈 ----
    "loop.yours": "你的呢？",
    "loop.mine.hint": "点一个位置，放一样东西进去。两环就可以。",
    "loop.mine.options": {
      start: ["一条通知", "说不清"],
      hold: [{ id: "chest", label: "宝箱魔" }, { id: "abyss", label: "无底渊" }, { id: "none", label: "都不是" }],
      after: [{ id: "owl", label: "夜枭（睡晚了）" }, { id: "tired", label: "第二天更累" }, { id: "mood", label: "心情更差" }, { id: "none", label: "都不是" }],
    },
    "loop.mine.empty": "空着",
    "loop.mine.done": "就是这样",
    "loop.mine.saved": "这是你的圈。",

    // ---- 裂缝 ----
    "loop.noCrack": ["还没有裂缝。没关系。"],
    "loop.cutOne": "圈有好几环。你不用全剪，剪一环，它就转不起来了。",

    // ---- 练习圈 ----
    "loop.practice.eyebrow": "训练场 · 圈",
    "loop.practice.intro": "它转起来了。转到谁，谁出招。先按住，再点它。",
    "loop.practice.whisper": { chest: "下一次说不定。", owl: "再看一集。", abyss: "下面还有。" },
    "loop.practice.tapDemon": "现在点它。",
    "loop.practice.again": "再来。",
    "loop.practice.right": "认出来了。",
    "loop.gesture.chest": "往下拉出一个停止点",
    "loop.gesture.owl": "把手机拖出门",
    "loop.gesture.abyss": "在入口画一扇门",
    "loop.gesture.alt": "点这里代替",
    "loop.practice.stopped": "它停了。不是你打赢了它，是你每一环都看见了。",
    "loop.demonNames": { chest: "宝箱魔", owl: "夜枭", abyss: "无底渊" },

    // ---- 剪哪一环 ----
    "loop.cutQ": "这一周，先剪哪一环？",
    "loop.cutMine": "我会先剪最前面那一环。",
    "loop.cutDone": "剪一次就算。回来告诉我。",
    // 只在玩家选剪"心情更差"那一环时出现：提示样式，不是零说的；不弹窗、不追问（Mary_V059 B1）
    "loop.moodHelp": "如果心情差的时候很多，“设置”里有“需要帮助”。",

    // ---- 零发呆（安静） ----
    "loop.stare": ["零停在钟楼下，盯着墙角那个小红点。", "这一次，它没有回过神来。"],
  },
  fn: {
    // 你的圈里"开始"一格的线索标签
    "loop.cueLabel"({ when, where }) {
      return [when, where].filter(Boolean).join(" · ") || "你的线索";
    },
    "loop.cracks"({ n }) {
      return [`你看，它已经不是完整的了。`, `这 ${n} 道，是你自己弄出来的。`];
    },
    // 剪那一环时的具体做法（来自前三关的现实任务）
    "loop.cutHow"({ slot, id, when, where }) {
      if (slot === "start") return when || where ? `下次在${[when, where].filter(Boolean).join("、")}，它来的时候，你先认出来：“是它。”` : "下次它来的时候，你先认出来：“是它。”";
      if (id === "chest") return "开之前，先说：“我只开 N 个。”";
      if (id === "abyss") return "打开之前，先画一扇门：设个计时器，或者说好看几个，或者把它挪到第二页。";
      if (id === "owl") return "到你定的时间，把手机放到你选的地方。";
      if (id === "tired") return "白天找一块 10 分钟，只属于你。";
      if (id === "mood") return "心情差的时候，先认出来：这一环在转。不用马上做什么。";
      return "下次它转到这一环，你先认出来。";
    },
  },
});
