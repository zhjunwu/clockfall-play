// 中文剧本库：夜枭第 2 局（第 10 天：看穿 + 修炼）。
// 看穿：夜枭说完后半句（它得意，可以说谎），然后用玩家自己的数据拆穿它；回放两天（全部来自真实数据，第二晚只有一个选择标记）；
// 按第二晚按钮的实际倍数说话；只列玩家实际看过的那几集；主动 / 自动分开；名字交给术语表。
// 修炼一：睡前仪式。到点诱惑时"再看一集"真的可以点（点了真的播一集），出口一直在；结尾按真实结果说话。
// 修炼二：白天找回 10 分钟。
// 分寸："报复"只说成"很多人有这种感觉"；白天的事是"多"，不是"坏"；游戏不替魔鬼的谎话背书。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。本局结尾不放钩子（endHook: none）。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "owl2", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 看穿 ----
    "owl.xray.eyebrow": "钟楼 · 看穿",
    "owl.xray.title": "圈是怎么转起来的",
    "owl.revealSecondHalf": ["你越晚睡，第二天就越不是你的。", "白天越不是你的，夜晚就越珍贵。", "这个圈是你自己转的。我只是站在旁边。"],
    "owl.xray.yourTwoDays": "你的两天",
    "owl.xray.line.myTime": "我的时间",
    "owl.xray.line.energy": "精力",
    "owl.xray.day1": "第一天白天",
    "owl.xray.night1": "第一晚",
    "owl.xray.day2": "第二天白天",
    "owl.xray.night2": "第二晚",
    "owl.xray.night2Sleep": "睡觉",
    "owl.xray.night2More": "再看一集",
    "owl.xray.buttonNoticed": "注意到了",
    "owl.xray.buttonMissed": "没注意到",
    "owl.xray.buttonReplyNoticed": "注意到了就好。它靠的就是你注意不到。",
    "owl.xray.buttonReplyMissed": "很多人注意不到。它靠的就是这个。",
    "owl.xray.buttonEarly": "你第一晚睡得早，第二晚那个按钮没有变大。它变大是有条件的：你越累，它越大。",
    "owl.xray.cliffsTitle": "你看过的那几集",
    "owl.xray.autoplayTitle": "谁点的",
    "owl.xray.nameTitle": "这个有名字",
    "owl.xray.name": [
      "很多人有这种感觉：白天的时间都不是我的，只有深夜是。所以明知道该睡，就是不想让这一天结束。",
      "它有个名字，叫{term:bedtimeProcrastination}。",
      "夜枭不偷。它只等你把夜晚交出来。",
    ],

    // ---- 修炼一：睡前仪式 ----
    "owl.ritual.eyebrow": "训练场 · 卧室",
    "owl.ritual.intro": ["对付它的办法，要在天黑之前做。", "先定一个时间：几点关灯。再决定：手机今晚睡在哪儿。"],
    "owl.ritual.lightsOutQ": "几点关灯？",
    "owl.ritual.lightsOutOptions": ["21:30", "22:00", "22:30", "23:00", "23:30"],
    "owl.ritual.phoneWhereQ": "手机今晚睡在哪儿？",
    // 选项写成能直接接在"放到了"后面的地方
    "owl.ritual.phoneWhereOptions": ["卧室外", "书桌上", "客厅", "床头，扣着"],
    "owl.ritual.waiting": "天黑了。离关灯时间还有一会儿。",
    // 现实里是深夜窗口时打开这一局，开场改用这一句（不重复第 1 局的深夜旁白）
    "owl.ritual.waitingLate": "假设今晚。离关灯时间还有一会儿。",
    "owl.ritual.timeUp": "到点了。",
    "owl.ritual.tempt": ["就一集。", "你定的时间又不是法律。", "明天又没早课。"],
    "owl.ritual.watch": "看一集",
    "owl.ritual.oneMore": "再看一集",
    "owl.ritual.playing": "播放中",
    "owl.ritual.doIt": "把手机放到你选的地方",
    "owl.ritual.phoneIcon": "手机",

    // ---- 修炼二：白天找回 10 分钟 ----
    "owl.slice.eyebrow": "训练场 · 白天",
    "owl.slice.intro": ["还有一个办法，在根上。", "夜晚之所以那么珍贵，是因为白天一分钟都不是你的。那就在白天拿回一块。不用多，10 分钟。"],
    "owl.slice.instruction": "把这 10 分钟放进一个空隙里。",
    "owl.slice.block": "我的 10 分钟",
    // 一条竖的时间线：字符串是排满的事，{ gap } 是夹在两件事之间的空隙
    "owl.slice.schedule": ["早读", "上午课", "午饭", { gap: "午饭后" }, "下午课", { gap: "放学路上" }, "作业", "晚饭", { gap: "晚饭后" }, "作业", "洗漱"],
    "owl.slice.placed": "放进去了。",
    "owl.slice.owlLine": "……这一块我够不着。",
    "owl.slice.zeroLine": "白天有了 10 分钟是你的，夜晚就不用扛起全部的自由。",

    // ---- 现实任务：两个做到一个即可 ----
    "owl.task2": ["两件事，做到一件就行。", "选一晚，在你定的时间，把手机放到你选的地方。", "或者，白天找一块 10 分钟，只属于你。", "做不到也回来告诉我。"],
  },
  fn: {
    // 用玩家自己的数据拆穿夜枭"这个圈是你自己转的"
    "owl.xray.rebut"({ episodes, auto }) {
      if (!episodes) return "你第一晚没让它转起来。";
      if (auto) return `它说是你自己转的。可第一晚有 ${auto} 集，是倒计时替你点的。`;
      return "你点的每一集都是你点的。可白天那 10 件事，没有一件是你选的。";
    },
    // 第二晚按钮：按实际倍数分三支；早睡的另有一句
    "owl.xray.buttonLine"({ scale }) {
      if (scale < 1.15) return "第二晚那个“再看一集”的按钮，比第一晚大了一点点。你睡得越晚，它长得越大。";
      if (scale < 1.4) return "你注意到了吗？第二晚那个“再看一集”的按钮，大了一些。";
      return "你注意到了吗？第二晚那个“再看一集”的按钮，大了一圈。";
    },
    // 看过的集：0 集 / 看过的那几集
    "owl.xray.noNextEpisode"({ episodes, examples }) {
      if (!episodes) return ["你一集都没看。", "那些剧本来也没有下一集。"];
      const ex = (examples || []).slice(0, 2).join("、");
      return ["这些剧没有下一集。", `我只写了半句。${ex}，我也不知道。我不需要知道。`];
    },
    // 主动 / 自动分开显示
    "owl.xray.plays"({ manual, auto }) {
      if (!manual && !auto) return "第一晚你一集都没看。";
      const a = manual ? `你自己点开了 ${manual} 集` : "你一集都没自己点开";
      const b = auto ? `自动播了 ${auto} 集` : "没有自动播放";
      return `${a}，${b}。`;
    },
    // 两天的数字
    "owl.xray.numbers"({ nightMin, dayMin, energyPct, misses }) {
      return `第一晚"我的时间"：${nightMin} 分钟。第二天精力：${energyPct}%，点错 ${misses} 次，白天"我的时间"：${dayMin} 分钟。`;
    },
    // 放手机那一屏的操作提示（触屏上也要一看就会）
    "owl.ritual.placeHint"({ where }) {
      return `把手机拖过去，或者点手机，再点“${where}”。`;
    },
    // 修炼一的结尾：按真实结果说话，不扣分、不重来
    "owl.ritual.result"({ extra, where }) {
      const w = where ? (where.startsWith("床头") ? "扣在了床头" : `放到了${where}`) : "放下了";
      if (!extra) return `到点就${w}。手机睡了。`;
      return `你多看了 ${extra} 集，然后${w}。手机睡了。`;
    },
  },
});
