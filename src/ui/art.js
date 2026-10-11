// 角色与大钟的 SVG（Victoria）。只有图形，没有任何玩家可见文字。
// 颜色全部走 style.css 的 token；红色只出现在魔鬼眼睛与零胸口的小红点（design 4.3）。
// 分层是为了动：每层有 class，动画在 style.anim.css。
(function () {
  const G = window.Game;

  // 大钟：100 格，走过的格是琥珀色，一根重指针。pct 0～100。
  function clock(pct) {
    let ticks = "";
    for (let i = 0; i < 100; i++) {
      const a = (i * 3.6 * Math.PI) / 180;
      const long = i % 10 === 0;
      const r1 = long ? 76 : 80;
      const x1 = 100 + Math.sin(a) * r1, y1 = 100 - Math.cos(a) * r1;
      const x2 = 100 + Math.sin(a) * 87, y2 = 100 - Math.cos(a) * 87;
      ticks += `<line class="tk${i < pct ? " lit" : ""}${long ? " long" : ""}" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/>`;
    }
    return `<svg class="art-clock" viewBox="0 0 200 200" aria-hidden="true">
      <defs><radialGradient id="ckFace" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#1d2230"/><stop offset="1" stop-color="#0b0d12"/></radialGradient></defs>
      <circle class="halo" cx="100" cy="100" r="96"/>
      <circle cx="100" cy="100" r="92" fill="url(#ckFace)" stroke="var(--gold-deep)" stroke-width="3"/>
      <circle cx="100" cy="100" r="70" fill="none" stroke="var(--line)" stroke-width="1"/>
      <g class="ticks">${ticks}</g>
      <g class="hand" style="--pct:${pct}">
        <path d="M100 30 L106 92 Q100 104 94 92 Z" fill="var(--gold)"/>
        <path d="M100 108 L103 124 L97 124 Z" fill="var(--gold-deep)"/>
      </g>
      <circle cx="100" cy="100" r="7" fill="var(--gold-deep)" stroke="var(--gold)" stroke-width="2"/>
    </svg>`;
  }

  // 主角：戴兜帽的小个子，兜帽里是暗的，提一盏钟形灯笼。灯笼亮度由 --lamp（0～1）控制。
  const hero = `<svg class="art-hero" viewBox="0 0 120 200" aria-hidden="true">
    <defs><radialGradient id="lampGlow"><stop offset="0" stop-color="var(--gold)" stop-opacity=".9"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></radialGradient></defs>
    <circle class="lamp-halo" cx="93" cy="128" r="34" fill="url(#lampGlow)"/>
    <g class="body">
      <path d="M52 18 C34 20 28 44 32 62 C22 88 18 140 14 192 L96 192 C90 150 84 100 76 64 C82 44 72 18 52 18 Z" fill="#07090d"/>
      <path d="M46 34 C40 42 40 56 46 62 C54 64 62 60 64 52 C64 42 58 34 46 34 Z" fill="#000"/>
      <path d="M70 92 C78 100 84 106 90 110" stroke="#07090d" stroke-width="7" stroke-linecap="round" fill="none"/>
    </g>
    <g class="lantern">
      <line x1="92" y1="108" x2="93" y2="116" stroke="#2a3140" stroke-width="2"/>
      <path d="M85 118 Q93 112 101 118 L104 138 L82 138 Z" fill="#141821" stroke="#2a3140" stroke-width="1.5"/>
      <ellipse class="flame" cx="93" cy="129" rx="5" ry="7" fill="var(--gold)"/>
      <rect x="80" y="137" width="26" height="3" rx="1.5" fill="#2a3140"/>
    </g>
  </svg>`;

  // 零：逗号形，青色描边，胸口一点暗红（design 4.3：它的老本行，复发线的伏笔）。
  // 常态是几乎发黑的暗红，读起来不像魔鬼的红；复发时 .relapse 才变成魔鬼红并发光。
  const zero = `<svg class="art-zero" viewBox="0 0 80 90" aria-hidden="true">
    <g class="body">
      <path class="tail" d="M50 46 C56 60 50 76 32 84 C40 72 42 62 38 52 Z" fill="#10131a" stroke="var(--xray)" stroke-opacity=".6" stroke-width="1.5"/>
      <circle cx="40" cy="34" r="20" fill="#10131a" stroke="var(--xray)" stroke-opacity=".6" stroke-width="1.5"/>
      <circle class="dot" cx="40" cy="38" r="2.6"/>
    </g>
  </svg>`;

  // 宝箱魔：合、开两态是一只漂亮的普通宝箱（被偷演示里的诱饵，全游戏最诱人的东西）。
  // 现形（.revealed）时才露出牙和红眼：盖子原来是嘴。壳碎（.shattered）是泄气，不是爆炸。
  // 保留 viewBox 与 .lid 的转轴（30,88），style.css 的开盖动画照常工作。
  let teeth = "";
  for (let x = 34; x < 186; x += 7) teeth += `<path d="M${x} 88 L${x + 3.5} ${x % 14 === 6 ? 99 : 95} L${x + 7} 88 Z"/>`;
  const chest = `<svg viewBox="0 0 220 180" aria-hidden="true" class="art-chest">
    <ellipse class="inner" cx="110" cy="84" rx="76" ry="16"/>
    <g class="box">
      <rect x="30" y="88" width="160" height="80" rx="8" fill="#231c18"/>
      <rect class="brass" x="30" y="112" width="160" height="6"/>
      <rect class="brass" x="30" y="142" width="160" height="6"/>
      <rect class="brass" x="40" y="88" width="8" height="80"/>
      <rect class="brass" x="172" y="88" width="8" height="80"/>
      <path class="crack" d="M112 92 L104 116 L116 134 L106 166" fill="none" stroke="#0b0d12" stroke-width="3"/>
      <rect class="brass" x="99" y="96" width="22" height="24" rx="3"/>
      <circle cx="110" cy="106" r="3.5" fill="#0b0d12"/>
    </g>
    <g class="lid">
      <path d="M30 88 V64 Q110 22 190 64 V88 Z" fill="#2c231d"/>
      <path class="brass-line" d="M30 70 Q110 30 190 70" fill="none" stroke-width="5"/>
      <path class="brass-line" d="M30 84 L190 84" fill="none" stroke-width="4"/>
      <g class="teeth" fill="#d9d2c0">${teeth}</g>
      <g class="eyes"><circle cx="86" cy="60" r="4.5"/><circle cx="134" cy="60" r="4.5"/></g>
    </g>
  </svg>`;

  // 空壳人：灰色，没有五官，眼睛位置一块方形冷光（极慢起伏，不闪）。
  const hollow = `<svg class="art-hollow" viewBox="0 0 40 100" aria-hidden="true">
    <path d="M20 6 C12 6 9 13 10 20 C11 26 14 28 14 30 C6 34 4 60 6 98 L34 98 C36 60 34 34 26 30 C26 28 29 26 30 20 C31 13 28 6 20 6 Z" fill="var(--grey)" opacity=".75"/>
    <rect class="glare" x="14" y="15" width="12" height="7" rx="1" fill="#cfe3f0"/>
  </svg>`;

  G.art = { clock, hero, zero, chest, hollow };
})();
