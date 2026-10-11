// 中文剧本库：夜枭（钟楼）。第 1 局（第 8 天：被偷）。第 2、3 局之后补。
// 夜枭的核心不是"停不下来"，而是睡前拖延："白天的时间都不是我的，只有深夜是。"
// 分寸：白天的事是"很多"，不是"坏"；不把学校、父母写成反派；白天的事不被定性，空着的"我的时间"自己说话。
// "报复"那层动机第 1 局不出现，第 2 局只说成"很多人有这种感觉"。
// 小游戏必须对玩家的选择真实地做出反应：第二天由第一晚实际放下的时间计算（早睡的人看到圈反着转）。
// 剧集悬念与自动倒计时是"被偷"演示（原则 2 的例外）：这些剧永远没有下一集，第 2 局一条条点名。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "owl", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 回城：钟楼 ----
    "owl.towerLit": ["钟楼那边不对。", "白天没人上去，灯却亮着。昨天夜里也亮着。"],
    "owl.zeroIntro": ["钟楼上住着夜枭。它不偷东西。它等。", "先过一天看看。你的一天。"],

    // ---- "两天一夜"小游戏 ----
    "owl.mini.eyebrow": "钟楼 · 两天一夜",
    "owl.day1.title": "白天",
    "owl.day.instruction": "一件一件点掉。",
    // 白天的事：多，但不定性
    "owl.dayTasks": ["上课", "作业", "再一张卷子", "帮我拿一下", "补习", "群里回一下", "练琴", "收拾桌子", "背单词", "吃饭"],
    "owl.myTime": "我的时间",
    "owl.myTimeEmpty": "今天还没有一分钟是你的。",
    "owl.night.title": "深夜",
    "owl.night.intro": "终于。没有人安排你了。这段时间是你的。",
    // 只在玩家现实里也是深夜时出现一次（剧情旁白，不是游戏魔的提醒）
    "owl.realLateNight": "（现实里，现在也是深夜。）",
    // 每集结尾的半句。这些剧永远没有下一集：任何一集都不接上一集。
    "owl.episodeCliff": [
      "门外有脚步声。她伸手去开门——",
      "信封里只有一张照片。照片上是她自己——",
      "他说：\"其实我一直没告诉你——\"",
      "灯灭了。有人在黑暗里叫她的名字——",
      "最后一班车开走了。站台上还有一个人——",
      "她打开那扇从来不开的门——",
    ],
    // 与 owl.episodeCliff 下标一一对应：每集留下的那个"不知道"。第 2 局按玩家看过的下标取用。
    "owl.episodeUnknown": ["门外是谁", "照片是谁拍的", "他没说出口的是什么", "黑暗里叫她的是谁", "站台上那个人是谁", "那扇门后面有什么"],
    "owl.sleepBtn": "睡觉",
    "owl.watchBtn": "看一集",
    "owl.oneMoreBtn": "再看一集",
    "owl.playing": "播放中",
    "owl.day2.title": "第二天",
    "owl.energy": "精力",
    "owl.night2.intro": "又到深夜了。",
    // 第二晚结束后不说破"按钮大了一圈"；第 2 局回放时零再问

    // ---- 现形（第 1 局只说前半句） ----
    "owl.revealFirstHalf": ["我不用偷。", "你自己会把夜晚交给我。因为白天不是你的。"],
    "owl.revealPause": "它停住了。后半句没说。",

    // ---- 地图：夜里的线索 + 睡眠格 ----
    "owl.mapAsk": "你的夜晚呢？",
    // 这一次的邀请预填夜里的线索，直接到汇总屏，玩家改或确认
    "owl.cuePrefill": { when: "睡前", where: "床上" },
    "map.bedtimePlanned": "打算几点睡",
    "map.phoneDownActual": "昨晚实际几点放下手机",
    "map.timeOptions": ["22:00 前", "22:30", "23:00", "23:30", "0:00", "0:30", "1:00", "1:00 以后", "几乎没睡", "不记得"],
    "owl.mapDone": "记下了。",

    // ---- 现实任务：只记录 ----
    "owl.observeTask": ["今晚只记一件事：你几点放下手机。", "不用早睡。只是记一下。", "回来告诉我。"],

    // ---- 悬念（endHook: cliffhanger）----
    "owl.cliff": "钟楼的灯又亮了。夜枭在上面，等着说后半句。",
  },
  fn: {
    "owl.episode"({ n }) {
      return `第 ${n} 集`;
    },
    "owl.countdown"({ sec }) {
      return `下一集 ${sec} 秒后自动播放`;
    },
    "owl.clock"({ h, m }) {
      return `${h % 24}:${String(m || 0).padStart(2, "0")}`;
    },
    "owl.tasksDone"({ done, total }) {
      return `${done} / ${total}`;
    },
    // 第一晚结束：看了几集、几点放下、其中几集是自动播的（很多集根本不是你选的）
    "owl.nightSummary"({ episodes, endHour, autoPlays }) {
      if (!episodes) return "你一集都没看，直接睡了。那夜枭今晚没等到你。";
      const h = Math.floor(endHour);
      const m = endHour % 1 ? "半" : "";
      const t = h >= 24 ? `${h - 24} 点${m}` : `${h} 点${m}`;
      const auto = autoPlays ? `其中 ${autoPlays} 集是自动播的，不是你点的。` : "";
      return `你看了 ${episodes} 集，${t}放下的。${auto}`;
    },
    // 第二天开场：由第一晚实际放下的时间决定。深夜从 22:00 起，看完第 1 集（22:30）就睡算早睡
    "owl.day2.intro"({ endHour }) {
      if (endHour <= 22.5) return "闹钟响了一次。你醒了。";
      if (endHour < 24) return "闹钟响了两次。";
      return "闹钟响了三次。";
    },
    // 第二天白天：只说真实数据。点错 ≥1 / 点错 0 但精力不满 / 早睡
    "owl.day2.slower"({ misses, early, energy }) {
      if (early) return misses ? `同样的事，手快了一点。点错了 ${misses} 次。` : "同样的事，手快了一点。一次没点错。";
      if (misses) return `同样的事，手慢了。点错了 ${misses} 次。`;
      const pct = Math.round((energy == null ? 0.5 : energy) * 100);
      return `同样的事。精力只剩 ${pct}%，你硬撑着点完了。`;
    },
    "owl.minutes"({ n }) {
      return `${n} 分钟`;
    },
    // 第二天白天结束：白天的"我的时间"有多少（早睡的有一点空档，熬夜的是 0）
    "owl.daySlot"({ min }) {
      return min > 0 ? `白天的"我的时间"：${min} 分钟。` : "白天的\"我的时间\"：0 分钟。";
    },
    // 第二晚开场：两天合计的账。熬夜的玩家会看到所有"我的时间"都来自深夜；不用旁白说破。
    "owl.myTimeTotal"({ night, day }) {
      return `两天的"我的时间"一共 ${night + day} 分钟：深夜 ${night}，白天 ${day}。`;
    },
  },
});
