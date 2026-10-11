// 亮牌小卡：游戏每用一次钩子就"自首"。普通样式弹卡；安静样式只在角落淡出一行。
(function () {
  const G = window.Game;
  const { fmt } = G.dom;

  // 返回 Promise，在玩家点掉（普通）或淡出结束（安静）后 resolve。
  // textId：某一局可以换一句更贴合语境的亮牌（schedule 的 flagId），钩子本身不变
  function show(hookId, { quiet, textId } = {}) {
    const id = textId || (quiet && hookId === "cliffhanger" ? "flag.cliffhangerQuiet" : "flag." + hookId);
    G.events.log("flag", { hook: hookId });
    G.fx.play(quiet ? "flag.quiet" : "flag.show", { hook: hookId });
    return new Promise((resolve) => {
      const card = document.createElement("div");
      card.className = "flagcard" + (quiet ? " quiet" : "");
      card.setAttribute("role", "status");
      card.innerHTML = `<span class="flaglabel">${fmt(G.t("flag.label"))}</span><p>${fmt(G.t(id))}</p>`;
      document.body.appendChild(card);
      // 用 setTimeout 而不是 requestAnimationFrame：后台标签页和无头环境里 rAF 可能不触发
      setTimeout(() => card.classList.add("on"), 20);
      const close = () => {
        card.classList.remove("on");
        setTimeout(() => {
          card.remove();
          resolve();
        }, 300);
      };
      if (quiet) setTimeout(close, 2600);
      else card.addEventListener("click", close);
    });
  }

  G.flags = { show };
})();
