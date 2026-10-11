// "停"：按住检测，以及冲浪条。有"点两下"的无障碍替代（flags.holdAlternative）。
(function () {
  const G = window.Game;

  // 触屏"幽灵点击"（Mary_V063 A1）：按住完成后屏幕立刻换了，手指还按着；抬起时浏览器会在同一位置合成一次点击，
  // 落到新屏幕的按钮上替玩家作答。办法：按住完成时"吞掉"这根手指抬起前后的点击——直到抬起，再加 400 ms。
  let swallowUntilUp = false, swallowUntil = 0;
  function armSwallow() {
    swallowUntilUp = true;
  }
  const lift = () => {
    if (!swallowUntilUp) return;
    swallowUntilUp = false;
    swallowUntil = performance.now() + 400;
  };
  document.addEventListener("pointerup", lift, true);
  document.addEventListener("pointercancel", lift, true);
  document.addEventListener("touchend", lift, true);
  document.addEventListener(
    "click",
    (e) => {
      if (swallowUntilUp || performance.now() < swallowUntil) {
        e.stopPropagation();
        e.preventDefault();
      }
    },
    true
  );

  function useAlt() {
    try {
      return !!G.state.get().flags.holdAlternative;
    } catch (e) {
      return false;
    }
  }

  // 按住 ms 毫秒触发 onHold。返回解除函数。
  // onProgress(p) 0..1；onCancel() 松手过早。
  function attach(el, { ms, onHold, onProgress, onCancel }) {
    ms = ms || G.config.holdMs;
    let timer = null, start = 0, raf = null, lastTap = 0, done = false;

    function tickProgress() {
      if (!start) return;
      const p = Math.min(1, (performance.now() - start) / ms);
      if (onProgress) onProgress(p);
      if (p < 1) raf = requestAnimationFrame(tickProgress);
    }
    function down(e) {
      if (done) return;
      e.preventDefault();
      if (useAlt()) {
        const now = performance.now();
        if (now - lastTap < G.config.doubleTapWindowMs) {
          done = true;
          if (onProgress) onProgress(1);
          armSwallow();
          onHold({ alt: true, heldMs: 0 });
        }
        lastTap = now;
        return;
      }
      start = performance.now();
      G.fx.play("hold.start", {});
      tickProgress();
      timer = setTimeout(() => {
        done = true;
        start = 0;
        G.fx.play("hold.done", {});
        armSwallow();
        onHold({ alt: false, heldMs: ms });
      }, ms);
    }
    function up() {
      if (done || !start) return;
      clearTimeout(timer);
      cancelAnimationFrame(raf);
      const held = performance.now() - start;
      start = 0;
      G.fx.play("hold.release", { heldMs: held });
      if (onProgress) onProgress(0);
      if (onCancel) onCancel({ heldMs: held });
    }
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", up);
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }

  // 冲浪：按住 sec 秒。松手不算失败，可再按；记录是否松过手。
  // 计时用 setTimeout 而不是 requestAnimationFrame：标签页在后台或无头环境里 rAF 可能停。
  // 返回 Promise<{ released:boolean, totalMs:number, alt:boolean }>
  function surf(el, { sec, onProgress }) {
    return new Promise((resolve) => {
      const need = sec * 1000;
      let acc = 0, start = 0, raf = null, released = false, finished = false;
      function frame() {
        if (!start) return;
        const total = acc + (performance.now() - start);
        G.fx.play("hold.progress", { p: Math.min(1, total / need) });
        if (onProgress) onProgress(Math.min(1, total / need));
        if (total >= need) return finish(false);
        raf = setTimeout(frame, 50);
      }
      function finish(alt) {
        if (finished) return;
        finished = true;
        cleanup();
        armSwallow();
        G.fx.play("hold.done", { surf: true });
        resolve({ released, totalMs: need, alt });
      }
      function down(e) {
        if (finished) return;
        e.preventDefault();
        if (useAlt()) return finish(true);
        start = performance.now();
        G.fx.play("hold.start", { surf: true });
        frame();
      }
      function up() {
        if (finished || !start) return;
        acc += performance.now() - start;
        start = 0;
        released = true;
        G.fx.play("hold.release", { surf: true });
        clearTimeout(raf);
      }
      function cleanup() {
        el.removeEventListener("pointerdown", down);
        el.removeEventListener("pointerup", up);
        el.removeEventListener("pointercancel", up);
        el.removeEventListener("pointerleave", up);
        clearTimeout(raf);
      }
      el.addEventListener("pointerdown", down);
      el.addEventListener("pointerup", up);
      el.addEventListener("pointercancel", up);
      el.addEventListener("pointerleave", up);
    });
  }

  G.hold = { attach, surf, useAlt, _swallowing: () => swallowUntilUp || performance.now() < swallowUntil };
})();
