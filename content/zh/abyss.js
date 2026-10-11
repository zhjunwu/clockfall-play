// 中文剧本库：无底渊（长廊）。第 1 局（第 17 天：被偷）。第 2、3 局之后补。
// 无底渊只有一招：没有底。卡片不自己走（自动前进是夜枭的招），只在玩家往上划时前进；每张卡都是讲完的小故事，不留半句（半句是夜枭的招）。
// 拉人的只能是"下面还有"。估计对照的证据是玩家自己的数据，不引用"人会低估时间"的研究。
// 卡片全部虚构，不模仿任何真实 App 的外观：没有头像、用户名、点赞数、红点、通知、"新内容"。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。本局结尾：加码（endHook: escalation，亮牌 flag.escalationAbyss）。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
const ABYSS_ZH_SUBJECTS = ["一只橘猫", "楼下的面包师", "一个八十岁的滑板手", "一只会开门的乌鸦", "隔壁班的值日生", "一颗长歪的西红柿", "凌晨的便利店", "一条迷路的金鱼", "图书馆的还书箱", "一位不会游泳的救生员", "一辆只开一站的公交", "一只每天准时叫的公鸡"];
const ABYSS_ZH_EVENTS = ["学会了一个新词", "第一次迟到了", "把雨伞借给了陌生人", "在镜子前练习打招呼", "发现自己被画进了一本书", "找到了丢了三年的钥匙", "被一阵风吹走了帽子", "决定今天什么都不做", "数清了天上有几朵云", "把影子弄丢了一下午", "收到一封没有署名的信", "在雨里跳了一支舞"];
const ABYSS_ZH_ENDINGS = ["然后就回家睡觉了。", "那天风很大。", "后来大家都忘了这件事。", "就这样。", "第二天一切照旧。", "谁也没觉得奇怪。", "那天晚饭是面条。", "然后天就黑了。", "它自己笑了一下。", "后来就没什么了。", "那天是星期二。", "然后它去喝了口水。"];

Game.content.register("zh", "abyss", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 回城 ----
    "abyss.cityIntro": ["钟楼报时了。可城的另一头，有一条长廊一直开着。", "进去的人，没有一个说得出自己在里面待了多久。"],
    "abyss.zeroIntro": ["你进去看看。我在入口等你。", "……那里本来没有门。我就站在入口。"],

    // ---- 长廊小游戏 ----
    "abyss.eyebrow": "长廊",
    "abyss.swipeHint": "往上划",
    "abyss.exit": "出去",
    // 卡片 = 主语 + 一件小事 + 收尾。每张都讲完，不留下一张的胃口。
    "abyss.subjects": ABYSS_ZH_SUBJECTS,
    "abyss.events": ABYSS_ZH_EVENTS,
    "abyss.endings": ABYSS_ZH_ENDINGS,
    "abyss.stop": "等等。",

    // ---- 估计对照 ----
    "abyss.guessTimeQ": "你觉得你在里面待了多久？",
    // lo / hi 是秒；判定"猜得准"时两边各放宽半档（30 秒）
    "abyss.guessTimeOptions": [
      { v: "lt1", label: "不到 1 分钟", lo: 0, hi: 60 },
      { v: "1", label: "大约 1 分钟", lo: 60, hi: 90 },
      { v: "2", label: "大约 2 分钟", lo: 90, hi: 150 },
      { v: "3", label: "大约 3 分钟", lo: 150, hi: 240 },
      { v: "5", label: "5 分钟以上", lo: 240, hi: 100000 },
    ],
    "abyss.guessCardsQ": "看了几张？",
    // 张数；判定时两边各放宽半档（5 张）
    "abyss.guessCardsOptions": [
      { v: "lt10", label: "10 张以下", lo: 0, hi: 9 },
      { v: "10", label: "10～20", lo: 10, hi: 20 },
      { v: "20", label: "21～40", lo: 21, hi: 40 },
      { v: "40", label: "41～60", lo: 41, hi: 60 },
      { v: "60", label: "60 张以上", lo: 61, hi: 100000 },
    ],
    "abyss.exitedSelf": "你自己走出来的。没有底，你也走出来了。",

    // ---- 现形 ----
    "abyss.endNotWall": "长廊的尽头不是墙。是更多的长廊。",
    "abyss.boast": ["我没偷你什么。", "我只拿走了一样东西：“到底了”。", "书有最后一页，饭有吃完的时候，一集有片尾。我没有。"],
    "abyss.zeroAfter": "它不用拉你。它只要让你一直找不到停的地方。",

    // ---- 地图：刷的时候 ----
    "abyss.mapAsk": "你在哪儿刷？什么时候？",
    "abyss.cuePrefill": { app: "刷动态" },
    // 地图里已有这些 App 的线索就不再邀请
    "abyss.feedApps": ["短视频", "刷动态", "直播"],
    "abyss.mapDone": "记下了。",

    // ---- 现实任务：只观察 ----
    "abyss.task": ["这次只做一件事。", "下一次刷完，先猜一下你刷了多久，再去看真实的时间。", "不用少刷。猜，然后看。回来告诉我差了多少。"],

    // ---- 结尾（endHook: escalation） ----
    "abyss.teaser": "下次，我给你开三条长廊。",
    "flag.escalationAbyss": "“下次给你更多”，是想让你现在就开始期待。这就是加码。",
  },
  fn: {
    // 第 n 张卡（从 0 起）：返回 [正文, 收尾]。组合出来的，不重复的错觉来自组合，不来自真实内容。
    "abyss.card"({ n }) {
      const S = ABYSS_ZH_SUBJECTS, E = ABYSS_ZH_EVENTS, N = ABYSS_ZH_ENDINGS;
      const s = S[n % S.length], e = E[(n * 5 + Math.floor(n / S.length)) % E.length], end = N[(n * 7 + 3) % N.length];
      return [`${s}${e}。`, end];
    },
    "abyss.reveal"({ sec, n }) {
      const m = Math.floor(sec / 60), s = sec % 60;
      const t = m ? `${m} 分 ${s} 秒` : `${s} 秒`;
      return `你在里面待了 ${t}，看了 ${n} 张。`;
    },
    // result: "less"（猜少了）/ "close" / "more"（猜多了）。只陈述，不评价。
    "abyss.guessTimeLine"({ result }) {
      if (result === "less") return "你猜的时间比实际少。";
      if (result === "more") return "你猜的时间比实际多。";
      return "时间你猜得很准。";
    },
    "abyss.guessCardsLine"({ result }) {
      if (result === "less") return "张数你猜少了。";
      if (result === "more") return "张数你猜多了。";
      return "张数你猜得很准。";
    },
  },
});
