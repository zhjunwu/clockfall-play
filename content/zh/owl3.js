// 中文剧本库：夜枭第 3 局（第 13 天）：巡逻（第 2 局现实任务）、决战（三个夜晚）、救守夜人、钟楼复苏、长廊预告。
// 决战认"招"不认魔鬼（Mary 的递进规则）。四招都是第 1、2 局玩家亲眼见过的：只有夜晚是你的 / 只说半句 / 自动下一集 / 越累按钮越大。
// "再看一集"始终可点：真的播一集，时钟 +30 分钟，夜枭回 1 格血；没有失败，最后一晚出门就是最后一击。
// 夜枭歪曲巡逻报告时，零一定当场回一句（不论这一刀砍没砍中）。第 3 晚的旁白与按钮按前两晚真实的 extra 说话。
// 魔鬼台词只引用中性或疲惫类心情（G.map.forDemon）。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。本局结尾：长廊预告（endHook: cliffhanger）。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "owl3", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 巡逻：第 2 局的现实任务 ----
    "owl3.task.eyebrow": "巡逻报告 · 夜里",
    "owl3.task.q": "两件事，做到了哪一件？",
    "owl3.task.options": [
      { id: "phone", label: "手机放到了定的地方" },
      { id: "slice", label: "白天找到了 10 分钟" },
      { id: "both", label: "两件都做到了" },
      { id: "none", label: "都没做到" },
    ],
    "owl3.task.skip": "不想说",
    "owl3.task.nightQ": "哪一晚？",
    "owl3.task.nightOptions": ["昨晚", "前天晚上", "更早"],
    "owl3.task.timeQ": "几点放下的？",
    "owl3.task.whereQ": "放在哪儿？",
    "owl3.task.whereOther": "别的地方",
    "owl3.task.dontRemember": "不记得了",
    "owl3.task.reply.phone": "记下了。那一晚，手机比你先睡。",
    "owl3.task.reply.slice": "记下了。那 10 分钟它够不着。",
    "owl3.task.reply.both": "两件都记下了。",
    "owl3.task.reply.none": "都没做到也记下了。说实话的这一条，也是你的。",
    "owl3.task.reply.skip": "不说也行。",

    // ---- 决战 ----
    "owl3.eyebrow": "钟楼 · 决战",
    "owl3.intro": ["它下来了。这次不等你交出夜晚，它来拿。", "三个晚上。每晚到了关灯时间，它就出招。你什么时候按住都行，越早越好。"],
    "owl3.lateNote": "（假设今晚。现实里你该睡了，这一局打完就去。）",
    "owl3.hpLabel": "夜枭",
    "owl3.nights": ["第一晚", "第二晚", "第三晚"],
    "owl3.before": "剧在播。还没到关灯时间，这一段是你的。",
    "owl3.timeUp": "到点了。",
    "owl3.oneMore": "再看一集",
    "owl3.playing": "播放中",
    "owl3.stepStop": "按住就是一刀",
    // 第 1 晚：只有夜晚是你的。低语用玩家夜里的线索（fn owl3.whisper1），第 2 级画面上淡出白天的事
    "owl3.n1.mechanic": "白天那些，都是别人的。现在这一段，是你的。",
    "owl3.n1.bait": "就一集。这一集是你今天唯一选的东西。",
    // 第 2 晚：半句话 → 自动下一集
    "owl3.n2.mechanic": "你不想知道后面吗？",
    "owl3.n2.bait": "你不用点。我替你点。",
    // 第 3 晚：越累，按钮越大
    "owl3.n3.whisper": "你今天那么累，不放松一下怎么撑得到明天？",
    "owl3.n3.mechanicGrow": "看，它自己大起来了。",
    // 没多看过的玩家：按钮想长大，长不动
    "owl3.n3.mechanicStuck": "……怎么不大？",
    "owl3.n3.bait": "就这一集。最后一集。我保证。",
    "owl3.healed": "又一集。它舔了舔羽毛。",
    "owl3.autoHealed": "倒计时替你点了。它舔了舔羽毛。",
    "owl3.hit": "一刀。",
    "owl3.crit": "暴击。它还没说完你就按住了。",
    "owl3.lateHit": "一刀。它已经加码到最后了，你还是停住了。",
    "owl3.stepRecognize": "它刚才用的是哪一招？",
    "owl3.moves": [
      { move: "myTime", label: "只有夜晚是你的" },
      { move: "cliff", label: "只说半句" },
      { move: "autoplay", label: "自动下一集" },
      { move: "bigger", label: "越累，按钮越大" },
    ],
    "owl3.readRight": "认对了。它的羽毛掉了一片。",
    "owl3.misread": "你还没看清它。没关系，看清是练出来的。",
    "owl3.door.step": "把手机拿出门。",
    "owl3.door.icon": "手机",
    "owl3.door.done": "门关上了。手机在外面。",
    "owl3.finalBlow": "第三晚，你把手机拿出了门。夜枭最怕这个。",
    "owl3.deflate": ["夜枭的羽毛塌了下去。", "原来它这么小。"],
    "owl3.owlLast": "……我每晚都在。",
    "owl3.zeroLast": "它在。你也在。",
    "owl3.zeroAfter": "钟楼顶上还有一个人。走。",

    // ---- 救守夜人 ----
    "watchman.eyebrow": "守夜人的梦",
    "watchman.intro": ["钟楼顶上有一扇小窗。窗里是守夜人的梦。", "他在看剧。看的那几集，和你第一晚一模一样。"],
    "watchman.introDefault": ["钟楼顶上有一扇小窗。窗里是守夜人的梦。", "他在看剧。一集接一集，已经很久了。"],
    "watchman.watch": "看着。他在看。",
    "watchman.now": "就是这里。替他把手机放到门外。",
    "watchman.again": "又一集。倒计时还会来。",
    "watchman.door": "门外",
    "watchman.early": "你没等它开始数。",
    "watchman.done": "手机在门外。屏幕暗了。守夜人抬起头。",
    "watchman.awake": ["……几点了？", "我守了很多年夜。后来忘了自己在守什么。", "钟楼该报时了。我去敲钟。"],
    // 只在玩家第 1 局第一晚确实早睡时说（真实数据）；被救者是同伴，不是反面教材
    "watchman.fasterThanHim": "那天晚上你比他快一步。他还没学会。",

    // ---- 钟楼复苏（冷白窗光熄灭，只留报时那一盏琥珀） ----
    "tower.revived": ["钟楼的灯一盏一盏关了。只有报时的那一盏还亮着。", "整点到了。钟楼敲了一下。", "大钟没有敲，但走得稳了一点。"],
    "tower.companion": "守夜人留在了钟楼。",

    // ---- 无底渊预告（结尾钩子：cliffhanger） ----
    "teaser.abyss": "城的另一头有一条长廊。很长。墙上一扇门都没有。",
  },
  fn: {
    // 第 1 晚低语：用玩家夜里的线索（心情已由 G.map.forDemon 过滤）。返回一组，引擎抽一句。
    "owl3.whisper1"({ when, where, mood, app }) {
      const lines = [];
      if (when) lines.push(`${when}了。白天那些都是别人的，现在这一段是你的。`);
      if (where) lines.push(`在${where}，没人找你。这是今天唯一属于你的地方。`);
      if (mood) lines.push(`${mood}了一天，就该用一个晚上补回来。`);
      if (app) lines.push(`${app}里的东西，白天你连看一眼的时间都没有。`);
      if (!lines.length) lines.push("终于没人安排你了。", "今天你还一分钟都没给过自己。");
      // 通用句多备几条：多看几集时按顺序轮换，不重复
      lines.push("明天的事明天再说。现在是你的。", "这么安静，多难得。", "你忙了一整天，这一点点算什么。");
      return lines;
    },
    // 第 2 晚低语：引用巡逻报告（夜枭会歪曲）。night / time / where 是玩家选的原样标签，句子在这里拼：
    // 时间换成口语读法，"不记得 / 几乎没睡 / 1:00 以后"不进句子；地点复用第 2 局"放到了…"的说法。
    "owl3.whisper2"({ kind, night, time, where }) {
      if (kind === "phone" || kind === "both") {
        const nights = { "昨晚": "昨晚", "前天晚上": "前天晚上", "更早": "之前有一晚" };
        const spoken = { "22:00 前": "不到十点", "22:30": "十点半", "23:00": "十一点", "23:30": "十一点半", "0:00": "十二点", "0:30": "十二点半", "1:00": "一点" };
        const n = nights[night] || "有一晚";
        const t = spoken[time] ? `${spoken[time]}就` : "";
        const w = !where ? "放下了" : where.startsWith("床头") ? "扣在了床头" : `放到了${where}`;
        return `你说你${n}${t}把手机${w}？一晚而已。今晚可不一样。`;
      }
      if (kind === "slice") return "白天偷回 10 分钟？那点时间够干什么。";
      if (kind === "none") return "你说都没做到？那就对了。夜晚本来就是我的。";
      return "你什么都没说。那我就当你每晚都在。";
    },
    // 零的回答：夜枭歪曲了报告，这一回合结束时一定出现
    "owl3.zeroRebut"({ kind }) {
      if (kind === "phone" || kind === "both") return "那一晚是真的。一晚就是一晚，它说的不算。";
      if (kind === "slice") return "10 分钟它够不着，所以它说不值钱。";
      if (kind === "none") return "你说了实话。它最怕的不是你做到，是你说实话。";
      return "不说也可以。它当什么，不算数。";
    },
    // 第 3 晚开场：按前两晚真实多看的集数
    "owl3.n3.open"({ extra }) {
      if (!extra) return "第三晚。前两晚你都按时关了灯。";
      return `第三晚。前两晚你多看了 ${extra} 集。`;
    },
    "owl3.countdown"({ sec }) {
      return `下一集 ${sec} 秒后自动播放`;
    },
    // 结尾：按真实数据
    "owl3.result"({ extra, auto }) {
      if (!extra) return "三个晚上，你都在关灯时间停住了。";
      const a = auto ? `，其中 ${auto} 集是它替你点的` : "";
      return `你多看了 ${extra} 集${a}。然后你还是把手机拿出了门。`;
    },
    // 出门那一格：第 2 局选的地方；选的是"床头，扣着"或没选，写"卧室外"——决战要的就是出门
    "owl3.doorLabel"({ where }) {
      return !where || String(where).startsWith("床头") ? "卧室外" : where;
    },
    "owl3.doorHint"({ door }) {
      return `把手机拖过去，或者点手机，再点“${door}”。`;
    },
  },
});
