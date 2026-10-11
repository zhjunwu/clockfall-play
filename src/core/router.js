// 屏幕切换。每次切换都重算游戏日（跨夜开着游戏也能对）。
(function () {
  const G = window.Game;
  let app = null;
  let current = null;

  function init(el) {
    app = el;
  }

  // 显示一屏。html 是已转义好的字符串；opts.xray 切换看穿模式的样式。
  function show(html, opts) {
    opts = opts || {};
    try {
      G.clock.touch();
    } catch (e) {}
    document.body.classList.toggle("xray", !!opts.xray);
    app.innerHTML = html;
    window.scrollTo(0, 0);
    current = opts.name || null;
    return app;
  }

  function $(sel) {
    return app.querySelector(sel);
  }

  function $$(sel) {
    return [...app.querySelectorAll(sel)];
  }

  G.router = { init, show, $, $$, get current() { return current; }, get el() { return app; } };
})();
