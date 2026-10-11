// 中文术语表。每条：name（标准名）、teen（对青少年说的名字）、definition（一句话）、source（出处）。
// 剧本里用 {term:variableReward} 引用，渲染为 teen，点开看 definition；出处默认折叠。
// 定义不能说得比证据满：动物实验要说是动物实验，赌博研究要说是赌博研究。
// 心理学表述须经审核人核实后才能标 reviewed。条目清单见 docs/content-contract.md 第 4 节。
// 作者：Claude（Mark）  审核人：（空）  状态：draft
Game.content.register("zh", "glossary", {
  meta: { author: "Claude (Mark)", reviewer: "", status: "draft" },
  text: {
    "term.sourceLabel": "出处",
    "term.variableReward": {
      name: "可变比率强化",
      teen: "可变奖励",
      definition: "奖励不按固定次数出现、猜不到哪一次会有的时候，行为往往更频繁，也更难停下来。这最早是在动物实验里发现的，后来在人身上也看到了类似的现象。",
      source: "Ferster & Skinner（1957）的操作性条件反射研究；待审核人核实表述。",
    },
    "term.nearMiss": {
      name: "近失效应",
      teen: "差一点",
      definition: "\"差一点就中\"其实和没中一样，没有任何奖励，但人往往会觉得自己\"快成功了\"，于是更想再试一次。这个现象主要是在赌博研究里发现的。",
      source: "赌博研究中的近失效应（如 Reid, 1986；Clark 等, 2009）；待审核人核实表述。",
    },
    "term.bedtimeProcrastination": {
      name: "睡前拖延",
      teen: "睡前拖延",
      definition: "明明没有什么事拦着，也知道该睡了，却一再推迟上床的时间。研究者把它叫作睡前拖延。很多人描述的那种\"白天不是我的，只有夜里是\"的感觉，常被叫作\"报复性熬夜\"，这个说法目前多见于访谈和大众讨论，不是定论。",
      source: "Kroese 等（2014）提出的睡前拖延概念；\"报复性熬夜\"一词的来源待审核人核实。",
    },
    "term.labeling": {
      name: "情绪标记",
      teen: "叫出它的名字",
      definition: "把正在发生的情绪用一个词说出来，研究发现能让情绪反应减弱一些。用在冲动上，这是正念防复发里常用的觉察练习：它不会让冲动消失，但能在\"想做\"和\"去做\"之间多出一点空间。",
      source: "情绪标记研究（如 Lieberman 等, 2007）；正念防复发（Marlatt 等）中的觉察练习；待审核人核实表述。",
    },
  },
});
