// 语言与内容查找。引擎只按 ID 取文字；缺失显示 BUILTIN 里的那一句，不回退到另一种语言。
(function () {
  const G = window.Game;

  // 引擎里唯一允许的内置文字：某语言缺内容时显示的提示。两种语言各一份。
  const BUILTIN = {
    zh: { missing: "该语言尚未提供" },
    en: { missing: "Not yet available in this language" },
  };

  const LANGS = ["zh", "en"];
  const packs = { zh: {}, en: {} }; // packs[lang][group] = { meta, text, fn, fnTable }
  let current = null;
  const listeners = [];

  function register(lang, group, pack) {
    if (!packs[lang]) packs[lang] = {};
    packs[lang][group] = pack;
  }

  function findText(lang, id) {
    const groups = packs[lang] || {};
    for (const name in groups) {
      const t = groups[name].text;
      if (t && Object.prototype.hasOwnProperty.call(t, id)) return { found: true, value: t[id], group: name };
    }
    return { found: false };
  }

  function findFn(lang, name) {
    const groups = packs[lang] || {};
    for (const g in groups) {
      const f = groups[g].fn;
      if (f && typeof f[name] === "function") return { found: true, fn: f[name], group: g };
    }
    return { found: false };
  }

  function missing(id) {
    return { missing: true, id, text: (BUILTIN[current] || BUILTIN.zh).missing };
  }

  // 取静态文字。返回字符串或数组/对象；缺失返回标记对象。
  function t(id) {
    const r = findText(current, id);
    return r.found ? r.value : missing(id);
  }

  // 取字符串（缺失时返回内置提示），用于直接渲染。
  function text(id) {
    const v = t(id);
    if (v && v.missing) return v.text;
    return typeof v === "string" ? v : String(v);
  }

  // 调用动态文字函数。函数自身必须兜底；这里只兜"函数不存在"和"函数抛错"。
  function f(name, args) {
    const r = findFn(current, name);
    if (!r.found) return missing(name).text;
    try {
      const v = r.fn(args || {});
      return v == null ? missing(name).text : v;
    } catch (e) {
      return missing(name).text;
    }
  }

  function term(id) {
    const v = t("term." + id);
    return v && v.missing ? null : v;
  }

  function has(id) {
    return findText(current, id).found;
  }

  function setLang(lang) {
    if (!LANGS.includes(lang)) lang = "zh";
    current = lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.documentElement.dataset.lang = lang;
    // 标签页标题只在这里设一次（游戏名）。别处禁止改标题：那是提醒手法。
    const title = findText(lang, "game.title");
    if (title.found) document.title = String(title.value);
    try {
      const st = G.state && G.state.get();
      if (st && st.lang !== lang) G.state.update((s) => (s.lang = lang));
    } catch (e) {}
    listeners.forEach((fn) => fn(lang));
  }

  function onChange(fn) {
    listeners.push(fn);
  }

  function detectInitial() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    const st = G.state && G.state.get();
    if (st && LANGS.includes(st.lang)) return st.lang;
    return null; // 首次：让玩家选
  }

  G.i18n = { LANGS, BUILTIN, packs, register, setLang, onChange, detectInitial, has, get lang() { return current; } };
  G.content = { register };
  G.t = t;
  G.text = text;
  G.f = f;
  G.term = term;
})();
