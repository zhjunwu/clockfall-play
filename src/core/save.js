// 存档码：完整状态 ↔ 可复制的文本。包含玩家自己写的一切，导出前显示 save.exportWarning。
(function () {
  const G = window.Game;

  function toB64(str) {
    const bytes = new TextEncoder().encode(str);
    let bin = "";
    bytes.forEach((b) => (bin += String.fromCharCode(b)));
    return btoa(bin);
  }

  function fromB64(b64) {
    const bin = atob(b64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  }

  function exportCode(subset) {
    const s = G.state.get();
    const obj = subset ? subset(s) : s;
    return G.config.saveCodePrefix + toB64(JSON.stringify(obj));
  }

  // 返回 { ok, state } 或 { ok:false, reason }
  function parseCode(code) {
    code = (code || "").trim();
    const p = G.config.saveCodePrefix;
    if (!code.startsWith(p)) return { ok: false, reason: "prefix" };
    try {
      const obj = JSON.parse(fromB64(code.slice(p.length)));
      if (!obj || typeof obj !== "object" || !("version" in obj)) return { ok: false, reason: "shape" };
      return { ok: true, state: obj };
    } catch (e) {
      return { ok: false, reason: "decode" };
    }
  }

  function importCode(code) {
    const r = parseCode(code);
    if (!r.ok) return r;
    G.state.replace(r.state);
    return { ok: true };
  }

  // 图鉴分享：只含图鉴与玩家的现实战记
  function exportCodex() {
    return exportCode((s) => ({ version: s.version, codexOnly: true, codex: s.codex }));
  }

  G.save = { exportCode, parseCode, importCode, exportCodex };
})();
