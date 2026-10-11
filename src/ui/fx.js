// 表现层事件总线。引擎只发事件，不管怎么表现（画面、动画、声音由 Victoria 的层监听）。
// 用法：Game.fx.play("hold.done", { ... })；监听：Game.fx.on("hold.done", (detail) => ...)。
// 事件名清单见 docs/helper/Victoria_V001.md 第七部分（加 owl.autoplay、exit.tap）。
// 声音默认关闭；设置里打开后，深夜窗口自动降低音量（由监听方按 Game.fx.volumeScale() 处理）。
(function () {
  const G = window.Game;
  const listeners = {};

  function on(name, fn) {
    (listeners[name] = listeners[name] || []).push(fn);
    return () => off(name, fn);
  }

  function off(name, fn) {
    listeners[name] = (listeners[name] || []).filter((f) => f !== fn);
  }

  function play(name, detail) {
    detail = detail || {};
    (listeners[name] || []).forEach((fn) => {
      try {
        fn(detail, name);
      } catch (e) {}
    });
    (listeners["*"] || []).forEach((fn) => {
      try {
        fn(detail, name);
      } catch (e) {}
    });
    try {
      document.dispatchEvent(new CustomEvent("game:fx", { detail: { name, detail } }));
    } catch (e) {}
  }

  function soundEnabled() {
    try {
      return !!G.state.get().flags.sound;
    } catch (e) {
      return false;
    }
  }

  // 深夜窗口音量降到 40%
  function volumeScale() {
    if (!soundEnabled()) return 0;
    try {
      return G.clock.isLateNight() ? 0.4 : 1;
    } catch (e) {
      return 1;
    }
  }

  function reducedMotion() {
    try {
      return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    } catch (e) {
      return false;
    }
  }

  G.fx = { on, off, play, soundEnabled, volumeScale, reducedMotion };
})();
