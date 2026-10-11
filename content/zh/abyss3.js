// 中文剧本库：无底渊第 3 局（第 22 天）：现实里的门报告、决战（三条长廊）、救长廊信使、长廊复苏、零发呆。Mark_V062，Mary_V052 修改。
// 决战认"招"：没有最后一张 / 门外什么都没有 / 藏起时间。本回合实际出过的招都算对。
// 停永远和平时一样容易（不做"更难按"，也不做"看起来更难"）。出口始终在原位。
// 魔鬼台词不引用孤单、难过（Mary_V036 A2）：通用句也不行。
// 结尾：零盯着小红点发呆（endHook: cliffhanger，安静样式）——零复发线的最后一个伏笔。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "abyss3", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 巡逻：现实里的门 ----
    "abyss3.task.eyebrow": "巡逻报告 · 门",
    "abyss3.task.options": [
      { id: "drew", label: "画了" },
      { id: "drewLong", label: "画了，但还是进去了很久" },
      { id: "no", label: "没画" },
    ],
    "abyss3.task.skip": "不想说",
    "abyss3.task.reply.drew": "画了。记下了。",
    "abyss3.task.reply.drewLong": "画了也记下了。门是画上了，走不走是另一回事，两件事都算。",
    "abyss3.task.reply.no": "没画也记下了。",
    "abyss3.task.reply.skip": "不说也行。",

    // ---- 决战 ----
    "abyss3.eyebrow": "长廊 · 决战",
    "abyss3.intro": ["它不等你进来了。它把长廊一条一条开到你面前。", "三条。每一条，先画门，再进去。门亮了，你随时可以停。"],
    "abyss3.hpLabel": "无底渊",
    "abyss3.corridors": ["第一条", "第二条", "第三条"],
    "abyss3.entrance.say": "先画门。",
    "abyss3.entrance.hint": "在墙上拖出一扇门，或者点“画门”。",
    "abyss3.goIn": "直接进去",
    "abyss3.noDoorInside": "在里面画不了门。",
    "abyss3.noDoorAfter": "门要在外面画。下一条，先画。",
    // 第 1 条：没有最后一张
    "abyss3.m1.whisper": "下面还有。",
    "abyss3.m1.mechanic": "门呢？被挤到下面去了。",
    "abyss3.m1.bait": "再往下一点，就到底了。",
    // 第 2 条：门外什么都没有
    "abyss3.m2.whisper": "门外什么都没有，里面还有好多。",
    "abyss3.m2.mechanic": "你看，门外一片灰。",
    "abyss3.m2.bait": "出去干什么？外面也没什么事。",
    // 第 3 条：藏起时间
    "abyss3.m3.whisper": "才一会儿。",
    "abyss3.m3.mechanic": "门上写的什么？看不清了吧。",
    "abyss3.m3.bait": "你才刚来。",
    "abyss3.healed": "又一张。它往下陷了一点。",
    "abyss3.hit": "一刀。",
    "abyss3.crit": "暴击。它还没说完你就按住了。",
    "abyss3.lateHit": "一刀。它已经加码到最后了，你还是停住了。",
    "abyss3.stepRecognize": "它刚才用的是哪一招？",
    "abyss3.moves": [
      { move: "noBottom", label: "没有最后一张" },
      { move: "outside", label: "门外什么都没有" },
      { move: "hideTime", label: "藏起时间" },
    ],
    "abyss3.readRight": "认对了。墙上裂开一道缝，透进光来。",
    "abyss3.misread": "你还没看清它。没关系，看清是练出来的。",
    "abyss3.doorOut": "出去",
    "abyss3.finalBlow": "第三条长廊，你在门前停住，自己走了出来。",
    "abyss3.deflate": ["无底渊塌了下去。", "长廊的尽头，原来是一面墙。墙上有门。"],
    "abyss3.zeroAfter": "长廊里还有一个人。走。",

    // ---- 救长廊信使 ----
    "messenger.eyebrow": "长廊信使",
    "messenger.intro": ["长廊尽头有一个人在走。他是长廊信使，替城里送信。", "他已经走了很久，信还在包里。"],
    "messenger.now": "他还没进去。就是现在。",
    "messenger.inside": "他进去了。等他出来，还会再经过入口。",
    "messenger.stopped": "他走到门前，停住，抬头看了看门，转身走了出来。",
    "messenger.awake": ["……我送了一路，忘了要送到哪儿。", "这封信是给面包师的。我去送。"],
    // 只在玩家第 1 局自己提前出去时说（真实数据）
    "messenger.aheadOfHim": "那天你比他先找到出口。",

    // ---- 长廊复苏 ----
    "corridor.revived": ["长廊的墙上开出了窗，隔一段就有一扇门。", "有人走到一半，推门出去晒太阳。", "大钟没有敲，但走得稳了一点。"],
    "corridor.companion": "长廊信使留在了城里。他说他以后送信，送到就回。",

    // ---- 零发呆（endHook: cliffhanger，安静样式） ----
    "zero.stare": ["零停在钟楼下，盯着墙角一个小红点。", "它看得比上次久。"],
    "zero.stareBack": "……走吧。今天就到这儿。",
  },
  fn: {
    "abyss3.task.q"({ door }) {
      return door ? `上次选的那扇门（${door}），画了吗？` : "上次选的那扇门，画了吗？";
    },
    "abyss3.doorLabel"({ type, v }) {
      if (type === "time") return `门：过了 ${v} 秒`;
      if (type === "feel") return "门：当我开始无聊地往下划的时候";
      return `门：看到第 ${v} 张`;
    },
    // 拆穿"藏起时间"：用这一条长廊的真实秒数和张数
    "abyss3.hideTimeRebut"({ sec, n }) {
      return `你在这条长廊里待了 ${sec} 秒，看了 ${n} 张。它说才一会儿。`;
    },
    // 结尾：按真实数据
    "abyss3.result"({ noDoor, k }) {
      const a = noDoor ? `有 ${noDoor} 条你没画门就进去了，然后你自己出来了。` : "三条长廊，你都先画了门。";
      const b = k ? `门亮以后你一共又看了 ${k} 张。` : "";
      return a + b;
    },
  },
});
