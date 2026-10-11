// 中文剧本库：游戏魔（每局结尾的最后一战）与"停"的提示。
// 游戏魔：这个游戏自己的魔鬼。它坦白，但不道歉；它想留你，但不装好人。被打败时不夸你。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "gamedemon", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    // ---- "停"的操作提示 ----
    "hold.prompt": "按住",
    "hold.altPrompt": "点两下",
    "hold.holding": "按着……",
    "hold.done": "停住了。",

    // ---- 游戏魔 ----
    "gameDemon.firstMeet": [
      "等一下。",
      "这是你第一次见我。我是这个游戏里的魔鬼。",
      "对，这个游戏也有。刚才那个故事停在一半，就是我干的。",
    ],
    "gameDemon.stepStop": "先按住。",
    "gameDemon.stepName": "它用的是哪个钩子？",
    "gameDemon.stepChoose": "然后呢？",
    "gameDemon.hookOptions": [
      { id: "cliffhanger", label: "悬念钩" },
      { id: "progress", label: "进度钩" },
      { id: "collection", label: "收集钩" },
      { id: "escalation", label: "加码钩" },
      { id: "none", label: "这局没用钩子" },
    ],
    "gameDemon.btnLeave": "离开",
    "gameDemon.btnStay": "再待一会，但定个时间",
    "gameDemon.btnNoUrge": "今天没什么想继续的",
    "gameDemon.nothingToStayFor": "今天没什么可留的。图鉴还是空的。",
    "gameDemon.noUrge": "没有？……行。那我今天白来了。",
    "gameDemon.setStayMinutes": "几分钟？",
    "gameDemon.stayTimeUp": "时间到了。你定的。",
    "gameDemon.closedIsLeave": "你上次直接关掉了。那就是离开。",
    "gameDemon.distractBtn": "继续看",
    "gameDemon.recognized": "你认出它了。",

    // 深夜规则
    "gameDemon.lateNight": "现在几点了？",
    "gameDemon.lateNightOnce": "我不会每晚都提醒你。今天说一次。",
    "gameDemon.leaveMeansSleep": "去睡觉",

    // 零在第 1 局替玩家认钩子，并教"停"
    "zero.teachStop": [
      "它每局结尾都会出来。",
      "对付它只要一件事：先按住。按住一秒，什么都别点。",
    ],
    "zero.nameHookForYou": "这局它用的是悬念钩。故事停在一半那种。",
    "zero.nextTimeYou": "下次你自己认。",
  },
  fn: {
    // 被打败：讲离开对它的伤害，强化"离开是胜利"。一句都不提下一次。
    // faster：这一次按住比之前几局的中位数快（真实数据），才说"越来越快"。
    "gameDemonDefeated"({ session, faster }) {
      const s = session || 1;
      if (s <= 1) return "……你走了。这一下挺疼。";
      if (faster) return "你走得越来越快了。";
      if (s <= 8) return "又走了。";
      return "……行。";
    },
    // 最后一战的台词，由本局数据生成。不说"你真棒"。
    "gameDemonLine"({ session, hesitatedAt, hesitateMs, lastExit, hook, extends: ext, over, battleTaps }) {
      const lines = [];
      if (hesitatedAt && hesitateMs >= 2000) {
        lines.push(`你刚才在第 ${hesitatedAt} 个宝箱前停了 ${Math.round(hesitateMs / 1000)} 秒，最后还是点了。现在呢？`);
      }
      // 引用训练场刚发生的事
      if (over) lines.push(`你刚才到了数还多开了 ${over} 个。现在呢？`);
      else if (ext) lines.push("你刚才在训练场续了一次。现在呢？");
      // 引用决战刚发生的事
      if (battleTaps) lines.push(`你刚才在决战里还点了 ${battleTaps} 次。现在呢？`);
      else if (battleTaps === 0) lines.push("今天一次都没点过我那个兄弟。……那我试试。");
      if (session && session >= 7 && lastExit === "leave") {
        lines.push(`第 ${session} 局了。你上次走得很干脆。今天我准备了点别的。`);
      }
      if (hook === "none") lines.push("这局我什么都没放。你信吗？");
      if (!lines.length) lines.push("想接着玩吧？我知道。我就是干这个的。");
      return lines;
    },
  },
});
