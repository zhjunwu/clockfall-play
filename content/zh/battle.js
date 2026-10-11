// 中文剧本库：宝箱魔第 3 局（第 6 天）：决战、面包师的梦境、集市复苏、夜枭预告。
// 决战（Mary_V021）：宝箱魔有一条血，三回合每回合砍一刀；每回合的诱惑分三级升级（低语 → 发光 → 加码），
// 没有倒计时，玩家任何时候按住都可以，越早停这一刀越重；认对追加伤害，认错不扣；宝箱始终可点，点了它回一点血。
// 没有失败状态：第 3 回合定数就是最后一击。
// 规则：只要一句话会让玩家想回游戏，要么亮牌，要么不写，不论借谁的嘴。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "battle", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- 决战 ----
    "battle.eyebrow": "集市 · 决战",
    "battle.intro": ["它来了。这次是真的。", "它会一点一点加码。你什么时候按住都行，越早越好。"],
    "battle.hpLabel": "宝箱魔",
    "battle.stepStop": "按住就是一刀",
    "battle.stepRecognize": "它刚才用的是哪一招？",
    "battle.recognizeOptions": [
      { rule: "luck", label: "新手好运" },
      { rule: "pause", label: "你想走，我就发光" },
      { rule: "plan", label: "计划的最后一次" },
      { rule: "near", label: "差一点" },
    ],
    "battle.stepChoose": "然后呢？",
    "battle.btnSetNumber": "定个数",
    "battle.btnWalk": "走",
    "battle.stage3bait": "就差一个。",
    "battle.hit": "一刀。",
    "battle.crit": "暴击。它还没说完你就按住了。",
    "battle.lateHit": "一刀。它已经加码到最后了，你还是停住了。",
    "battle.readRight": "认对了。伪装碎了一块。",
    "battle.misread": "你还是没看清我。",
    "battle.tappedHeal": "开了。它舔了舔嘴。",
    "battle.round3Setup": "来，最后一回合。你定个数，我保证最后一个是大的。",
    "battle.round3Glow": "最后一个了。大奖。……再来一个？",
    "battle.finalBlow": "刚中了大奖，你走了。宝箱魔最怕这个。",
    "battle.shatter": ["宝箱魔的壳碎了。", "里面什么都没有。它本来就是空的。"],
    "battle.zeroAfter": "走，去救人。它的壳碎了，门就在后面。",
    // 承认它会再来：诱惑不会因为一次拒绝就消失，下一次再停就是了
    "battle.walked": "你走了。它换了一招，又跟上来。",
    "battle.openFirst": "先开到你定的数",

    // ---- 面包师的梦境 ----
    "baker.eyebrow": "面包师的梦",
    "baker.dreamIntro": [
      "碎掉的宝箱后面有一扇小门。门里是面包师的梦。",
      "梦里也有一个宝箱。他开的顺序，和你第一天一模一样。",
    ],
    "baker.dreamDefault": ["碎掉的宝箱后面有一扇小门。门里是面包师的梦。", "梦里也有一个宝箱。他已经开了很久。"],
    "baker.watch": "看着。他在开。",
    "baker.nowHold": "就是这里。替他按住。",
    "baker.held": "宝箱灭了。面包师抬起头。",
    "baker.awake": ["……谢谢你。", "我好像一直在这儿开箱子。多久了？", "没关系。我得回去生火。面包要烤三个小时，急不来。"],
    // 被救者是同伴，不是反面教材
    "baker.strongerThanHim": "你那天比他强。他还没学会。",

    // ---- 集市复苏 ----
    "market.revived": ["集市的第三盏灯亮了。", "摊位一个一个重新打开。有面包的味道。", "大钟没有敲，但走得稳了一点。"],
    // 不预告巡逻日的近况；玩家自己发现
    "market.companion": "面包师留在了集市。",

    // ---- 夜枭预告（结尾钩子：cliffhanger） ----
    "teaser.owl": "远处是钟楼。天黑了，钟楼的灯亮着。……后半夜，它还亮着。",
  },
  fn: {
    // 第 1 级低语：用玩家自己的线索。返回一组，引擎抽一句。缺线索时用通用版。
    "demonTaunt"({ when, where, mood, app, who }) {
      const lines = [];
      if (when) lines.push(`${when}，对吧？那时候你最好说话。`);
      if (where) lines.push(`${where}。你在那儿的时候，手会自己动。`);
      if (mood) lines.push(`${mood}的时候，谁不想开一个？就一个。`);
      if (app) lines.push(`我在${app}里有好多摊位。你都见过。`);
      if (who) lines.push(`${who}的时候也一样。我不挑人。`);
      if (!lines.length) lines.push("你知道我在哪儿等你。", "就一个。开一个不算什么。", "你停下来了？那正好，我发个光。");
      return lines;
    },
    // 第 2 回合低语：引用巡逻报告。whenLabel 是"几点"的选项，doing 是"当时在做什么"，what 是 held/tapped。
    "demonQuotePatrol"({ kind, whenLabel, doing, what }) {
      const t = whenLabel ? whenLabel : "那天";
      const d = doing ? `${doing}的时候` : "";
      if (kind === "noticed" && what === "held") return `你说你${t}${d}停住了？今天可没那么容易。`;
      if (kind === "noticed") return `你说你${t}${d}注意到我了？注意到有什么用。`;
      if (kind === "notAppear") return "你说我没来？我一直在。";
      if (kind) return "你说你事后才想起来？事后想起来的，都算我的。";
      return "你什么都没报。那我就当你每天都在开。";
    },
    // 第 2 级：规则启动时它说的一句
    "battle.attackLine"({ rule }) {
      if (rule === "luck") return "来，先送你一个大的。";
      if (rule === "pause") return "你停下来了？那我发个光。";
      if (rule === "plan") return "最后一次了。最后一次我给你个好的。";
      if (rule === "near") return "差一点！就差一格。";
      return "下一次说不定。";
    },
    "battle.roundOf"({ i, total }) {
      return `第 ${i} 回合 / ${total}`;
    },
    // 魔鬼否定了玩家的报告，这一刀砍中之后零当场回一句。没有要回的就返回 null。
    "battle.zeroRebut"({ kind, what }) {
      if (kind === "noticed" && what !== "held") return "这就是用处。";
      if (kind === "later" || kind === "nowRemember") return "它说的不算。事后想起来，也是你的。";
      return null;
    },
  },
});
