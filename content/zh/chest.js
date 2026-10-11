// 中文剧本库：宝箱魔（集市）。第 1 局（被偷）与第 2 局（看穿、修炼）。第 3 局在 M3 补。
// 语气约定：宝箱魔得意、油滑、小气，但不酷到让人想学它；零不说"你应该""对你好"。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "chest", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 集市小游戏（被偷） ----
    "chest.mini.eyebrow": "集市",
    "chest.mini.title": "幸运宝箱",
    "chest.mini.lead": "集市上只剩这一个摊位还开着。点宝箱，开出金币。想开多少开多少，随时可以走。",
    "chest.mini.planQ": "开之前先定个数：你打算开几次？",
    "chest.mini.start": "开始",
    "chest.mini.tap": "点宝箱",
    "chest.mini.stop": "我不开了",
    "chest.mini.glowHint": "宝箱在发光……下一次好像不一样。",
    "chest.mini.nearSmall": "就差一格就是大奖",
    "chest.mini.near": "差一点！",
    "chest.mini.maxed": "摊主收摊了。",

    // ---- 第 1 局：现形 ----
    "chest.revealOpen": "哎呀。你来了啊。",
    "chest.revealClose": "我这个摊子不卖东西。我只收一样：你的时间。",
    "chest.revealGloat": "走吧走吧。你不来这儿，我也会去找你。我在你手机里有好多摊位。",

    // ---- 第 2 局：看穿（X 光） ----
    "chest.xray.eyebrow": "暂停 · 看穿",
    "chest.xray.title": "刚才的\"运气\"，是它安排的",
    "chest.xray.intro": "零把宝箱魔按在墙上。它倒不慌，反而挺得意，一条一条讲给你听。",
    "chest.xray.timeline": "你的每一次",
    "chest.xray.legend.small": "小奖",
    "chest.xray.legend.big": "大奖",
    "chest.xray.legend.near": "差一点",
    "chest.xray.legend.rigged": "它安排的大奖",
    "chest.xray.rulesTitle": "宝箱魔自己说的规则",
    // 规则条目：rule 对应引擎规则 ID。由宝箱魔第一人称说出，得意，不解释心理学。
    "chest.rules": [
      { rule: "luck", title: "新手好运", body: "第二次，一定给你个大的。你一开始就觉得自己手气好，后面就好办了。" },
      { rule: "pause", title: "你想走，我就发光", body: "你一停下来超过两秒半，我就开始发光，下一次必中。你停下来，正是你在想要不要走的时候。我最喜欢那个时候。" },
      { rule: "plan", title: "计划的最后一次", body: "你说开 5 次？第 5 次我送你个大奖。刚中了大奖，谁舍得停。" },
      { rule: "near", title: "差一点", body: "\"差一点\"和没中是一回事，都是零。但你会觉得\"快中了\"。这个我没发明，我只是用。" },
      { rule: "random", title: "剩下的全看运气", body: "小奖一到五个金币，偶尔随机来个大的。你永远猜不到下一次是什么。这就够了。" },
    ],
    "chest.xray.stat.actual": "实际次数",
    "chest.xray.stat.plan": "你的计划",
    "chest.xray.stat.time": "用时",
    "chest.xray.nameTitle": "这个机制有名字",
    // 零只给名字，讲的是"你"刚才的经历，不讲人类；结论和出处在术语表里
    "chest.xray.name": [
      "它说的这一套，有个名字，叫{term:variableReward}。",
      "你刚才停不下来，不是因为金币多，是因为下一次说不定。{term:nearMiss}也是同一招。",
      "它不是只在集市上摆摊。很多应用里都有它，只是宝箱换了个样子。不是所有应用都这样。",
    ],

    // ---- 第 2 局：修炼 ----
    "training.eyebrow": "训练场",
    "training.title": "集市重开",
    "training.stopIntro": [
      "对付它，全游戏就一个动作：先按住。按住一秒，什么都别点。",
      "按住的时候，你就不在它的节奏里了。",
    ],
    "training.setStopPoint": "开之前，先说一个数。这次我们练的是这个：到了数，宝箱会发光，你按住。",
    "training.youKnowNow": "它会发光。这次你知道了。知道了还想点，这很正常，这就是要练的。",
    "training.reached": "到数了。它开始发光。宝箱还能点。",
    "training.holdNow": "按住",
    "training.held": "你停住了。",
    // 不由零讲道理；让魔鬼自己说出它想要的（明牌的方式）
    "training.afterHold": "走，或者再定一个数。都行。",
    "chest.afterHoldWhisper": "不用定数嘛。接着点就好。",
    "training.btnLeave": "走",
    "training.btnExtend": "再开一次，这次我定数",
    // 第一次续：亮牌（游戏自首）
    "flag.extendOnce": "就再一个。这句话是我最喜欢的。",
    "training.marketClosed": "摊主收摊了。今天到这儿。",
    "training.summaryTitle": "训练场结算",

    // 破罐魔的小影子（第 2 局伏笔，不解释）
    "jar.firstShadow": "……反正已经续过了。",
    "zero.shooShadow": "走开。……别理它，我们继续。",

    // ---- 第 2 局：现实任务与悬念（进度钩） ----
    "zero.stopTask": [
      "回去之后，它在你那个地方出现的时候，先按住。手机也行，心里也行，一秒。",
      "开之前，说一个数。",
      "做不到也回来告诉我。做不到也算。",
    ],
    // 进度钩：三盏灯 = 三局，看得见还差一局；面包师 = 想得到的东西
    "chest.progressCliff": "集市的灯亮了两盏。还剩一盏。面包师还在宝箱后面。",
  },
  fn: {
    "chest.mini.planBtn"({ n }) {
      return `${n} 次`;
    },
    "chest.mini.count"({ n }) {
      return `已开 ${n || 0} 次`;
    },
    "chest.mini.result"({ kind, reward }) {
      if (kind === "big") return `大奖 +${reward}！`;
      if (kind === "near") return "差一点！";
      return `+${reward}`;
    },
    "chest.revealLine"({ plan, n, stoppedByUser }) {
      if (!n) return "一次都没开？……你是来看风景的吗。";
      if (n === 1) return "就开了一次。行吧，一次也是开了。";
      if (plan && n <= plan) return `你说开 ${plan} 次，就开了 ${n} 次。……真没意思。`;
      // 超过计划：点出来。它在撒谎（"我什么都没做"），第 2 局揭秘时正好拆穿。
      if (plan && n > plan) return `你说开 ${plan} 次。你开了 ${n} 次。……我什么都没做，是你自己点的。`;
      return "开得挺开心的吧？别不好意思，大家都这样。你刚才给了我一些时间，我很满意。";
    },
    "chest.cliffLine"({ plan, n, hitSecond }) {
      if (n >= 2 && hitSecond) return "你知道为什么你第二次就中了吗……";
      if (n >= 2) return "你知道那个宝箱为什么一直在对你发光吗……";
      return "你知道你要是再开一次会发生什么吗……";
    },
    // 看穿的第一句：按计划与实际分支
    "verdict"({ plan, n, stoppedByUser, maxed }) {
      if (!n) return "你一次都没开就走了。那它的规则还没来得及用在你身上。看看它准备了什么。";
      if (maxed) return `你开了 ${n} 次，是摊主替你收的摊。看看这中间发生了什么。`;
      // 操纵是真的，选择权仍在玩家手里："看穿操纵者"和"自控"之间的那条线
      if (plan && n > plan) return `你计划开 ${plan} 次，实际开了 ${n} 次，多了 ${n - plan} 次。点是你点的，时机是它安排的。`;
      return `你计划开 ${plan} 次，实际开了 ${n} 次，守住了。回想一下，中间有没有"再来一次"的念头？它当时在干什么？`;
    },
    // 规则触发情况："在你身上触发了 2 次"
    "ruleHit"({ ruleId, count }) {
      if (ruleId === "random") return count ? `你一共拿到了 ${count} 个它安排的大奖` : "全部随机";
      if (ruleId === "near") return count ? `出现了 ${count} 次` : "没出现";
      if (!count) return "没来得及用在你身上";
      return count === 1 ? "在你身上用了一次" : `在你身上用了 ${count} 次`;
    },
    // 用时
    "chest.xray.secs"({ secs }) {
      return `${secs} 秒`;
    },
    // 定停止点："我只开 5 个"
    "stopPointPrompt"({ n }) {
      return n ? `我只开 ${n} 个。` : "我只开几个？";
    },
    // 到数之后又点了：宝箱魔说一句
    "training.overTap"({ over }) {
      if (over === 1) return "看吧。";
      if (over === 2) return "又一个。";
      return `超了 ${over} 次。`;
    },
    // 训练场结算：如实写，不评价
    "training.summary"({ extends: ext, held, over }) {
      let a;
      if (held && !over) a = "到数的时候你按住了。";
      else if (held) a = `到数之后你又开了 ${over} 次，然后按住了。`;
      else a = `到数之后你又开了 ${over} 次，摊主收了摊。没关系，下次再练。`;
      if (!ext) return a;
      return a + ` 你续了 ${ext} 次。`;
    },
  },
});
