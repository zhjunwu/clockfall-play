// 全局命名空间。所有模块往 window.Game 上挂，index.html 按依赖顺序加载。
// 引擎里不能出现任何玩家可见的文字（见 docs/architecture.md 第 3.3 节）。
(function () {
  if (window.Game) return;
  window.Game = {
    version: "0.1.0",
    modules: {},
    levels: {},
    checks: {},
  };
})();
