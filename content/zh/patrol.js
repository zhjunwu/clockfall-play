// 中文剧本库：巡逻报告、回城、"你的钟"。第 2 局起用。
// 巡逻报告只问有没有停，不问成功；四个选项都得分；"没停住"也是有效报告。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "patrol", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 回城 ----
    "city.return.eyebrow": "回城",

    // ---- 巡逻报告 ----
    "patrol.eyebrow": "巡逻报告",
    "patrol.question": "上次之后，它来了吗？你注意到了吗？",
    "patrol.options": [
      { id: "noticed", label: "来了，我当时就注意到了" },
      { id: "later", label: "来了，我事后才想起来" },
      { id: "nowRemember", label: "来了，我没注意到，现在想起来了" },
      { id: "notAppear", label: "它没来" },
    ],
    "patrol.whichCue": "在哪儿？",
    "patrol.otherCue": "别的地方",
    "patrol.reply.noticed": "当时就注意到了。这就是第一步，后面的都从这儿来。",
    "patrol.reply.later": "事后想起来也算。想起来的那一下，也是你的。",
    "patrol.reply.nowRemember": "现在想起来了，就是现在注意到了。记上。",
    "patrol.reply.notAppear": "没来就没来。不是每天都有魔鬼。",
    "patrol.stoppedQ": "那一次，你有没有先按住？",
    "patrol.stoppedYes": "按住了",
    "patrol.stoppedNo": "没按住",
    "patrol.stoppedReplyYes": "按住了。好。",
    "patrol.stoppedReplyNo": "没按住也算一次。你注意到了，这件事已经发生了。",
    "patrol.reportAnother": "再报一次",
    "patrol.done": "报完了",
    // 第 3 局起对"当时就注意到了"追问细节，都可跳过。这是试玩第 4 个指标的数据来源。
    "patrol.detailWhen": "大概几点？",
    // 每个选项有 label（按钮）和 phrase（嵌进句子里的说法）。中文的 phrase 等于 label。
    "patrol.detailWhenOptions": [
      { label: "早上", phrase: "早上" },
      { label: "中午", phrase: "中午" },
      { label: "下午", phrase: "下午" },
      { label: "傍晚", phrase: "傍晚" },
      { label: "晚上", phrase: "晚上" },
      { label: "深夜", phrase: "深夜" },
    ],
    "patrol.detailWhat": "当时在做什么？",
    "patrol.detailWhatOptions": [
      { label: "写作业", phrase: "写作业" },
      { label: "吃饭", phrase: "吃饭" },
      { label: "躺着", phrase: "躺着" },
      { label: "等人", phrase: "等人" },
      { label: "走路", phrase: "走路" },
      { label: "上课", phrase: "上课" },
      { label: "和人说话", phrase: "和人说话" },
      { label: "说不清", phrase: "" },
    ],
    "patrol.detailSkip": "不记得了",
    // 周屏幕时间（第 2 周起，每周一次，可跳过，不评价）
    "patrol.weeklyScreenTime": "这周手机系统显示你用了多久？去设置里看一眼，填个大概。不想填就跳过。",
    "patrol.howToFind": ["iPhone：设置 → 屏幕使用时间", "安卓：设置 → 数字健康（或“健康使用手机”）"],
    "patrol.weeklyUnit": "小时 / 周",
    "patrol.weeklySave": "记下",
    "patrol.weeklySkip": "跳过",

    // ---- 你的钟（第 2 局开头的身份揭示） ----
    "zero.yourClock": [
      "这是你的钟。慢了一点。所有人的钟都慢了，你的还好。",
      "你是守钟人的后代，只有你能进别人的梦。所以我才找你。先把集市那个搞定。",
    ],
  },
  fn: {
    // 回城一句话（覆盖 zero.js 里的占位版本）
    "zero.returnLine"({ session, clockDelta, lastPatrol }) {
      if (!session || session <= 1) return "来了。";
      if (clockDelta > 0) return "钟快了一点。是你干的。";
      return "钟还是那样。它不会倒走。";
    },
    // 巡逻报告里显示一条线索："睡前 · 床上 · 睡不着 · 短视频"
    "patrol.cueLabel"({ when, where, mood, app }) {
      return [when, where, mood, app].filter(Boolean).join(" · ") || "那个地方";
    },
  },
});
