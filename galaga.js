const fs = require("fs");

const WIDTH = 900;
const HEIGHT = 280;

const COLORS = {
  bg: "#03020a",
  star1: "#ffffff",
  star2: "#a0c4ff",
  star3: "#ffd6a5",
  player: "#00F5FF",
  laser: "#FFE600",
  enemy1: "#FF3366",
  enemy2: "#00FF88",
  enemy3: "#FF00FF",
  hud: "#00F5FF",
  hudDim: "#005f5f",
  explosion: "#FF6600"
};

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rFloat(min, max) {
  return (Math.random() * (max - min) + min).toFixed(2);
}

// =============================
// DEFS
// =============================
function defs() {
  return `
  <defs>
    <filter id="glow-laser" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-enemy" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="1.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-player" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <radialGradient id="nebula" cx="50%" cy="30%" r="70%">
      <stop offset="0%" stop-color="#1a0b2e" stop-opacity="0.6"/>
      <stop offset="50%" stop-color="#0d0221" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#03020a" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="hudGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#00F5FF" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#00F5FF" stop-opacity="0.02"/>
    </linearGradient>
  </defs>
  `;
}

// =============================
// ESTRELLAS
// =============================
function createStarsLayer(count, color, speedMin, speedMax, rMin, rMax, opacity) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = random(0, WIDTH);
    const y = random(0, HEIGHT);
    const r = rFloat(rMin, rMax);
    const speed = rFloat(speedMin, speedMax);
    const delay = rFloat(0, 5);
    stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${opacity}">
      <animate attributeName="cy" from="${y}" to="${HEIGHT + 10}" dur="${speed}s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="${opacity};${opacity * 0.3};${opacity}" dur="${rFloat(2, 4)}s" repeatCount="indefinite"/>
    </circle>`;
  }
  return stars;
}

function shootingStar() {
  const x = random(-100, WIDTH - 100);
  const y = random(0, HEIGHT / 2);
  const begin = rFloat(2, 10);
  return `<line x1="${x}" y1="${y}" x2="${x - 40}" y2="${y + 15}" stroke="#ffffff" stroke-width="1" opacity="0">
    <animate attributeName="opacity" values="0;0.8;0" dur="1.2s" begin="${begin}s" repeatCount="indefinite"/>
    <animate attributeName="x1" from="${x}" to="${x + 200}" dur="1.2s" begin="${begin}s" repeatCount="indefinite"/>
    <animate attributeName="x2" from="${x - 40}" to="${x + 160}" dur="1.2s" begin="${begin}s" repeatCount="indefinite"/>
    <animate attributeName="y1" from="${y}" to="${y + 80}" dur="1.2s" begin="${begin}s" repeatCount="indefinite"/>
    <animate attributeName="y2" from="${y + 15}" to="${y + 95}" dur="1.2s" begin="${begin}s" repeatCount="indefinite"/>
  </line>`;
}

// =============================
// NAVE CON MOVIMIENTO + LÁSERES
// =============================
function playerGroup() {
  // La nave se dibuja en (0,0) y el grupo se traslada con animateTransform
  // Valores: x,y — la nave patrulla de izquierda a derecha con ondas suaves
  const values = [
    "100,230", "220,210", "340,245", "460,205", 
    "580,235", "700,215", "820,230", 
    "700,215", "580,235", "460,205", "340,245", "220,210", "100,230"
  ].join(";");

  return `
  <g>
    <animateTransform attributeName="transform" type="translate" 
      values="${values}" 
      dur="14s" 
      repeatCount="indefinite" 
      calcMode="spline" 
      keySplines="0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1;0.4 0 0.2 1"/>
    
    <!-- Motores -->
    <ellipse cx="-12" cy="5" rx="3" ry="6" fill="#FF6600" opacity="0.8">
      <animate attributeName="ry" values="6;10;6" dur="0.15s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.15s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="12" cy="5" rx="3" ry="6" fill="#FF6600" opacity="0.8">
      <animate attributeName="ry" values="6;10;6" dur="0.15s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.15s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="12" rx="15" ry="4" fill="#00F5FF" opacity="0.15">
      <animate attributeName="rx" values="15;20;15" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Nave -->
    <g filter="url(#glow-player)">
      <polygon points="-8,-5 -20,10 -8,5" fill="${COLORS.player}" opacity="0.9"/>
      <polygon points="8,-5 20,10 8,5" fill="${COLORS.player}" opacity="0.9"/>
      <polygon points="-8,8 8,8 0,-18" fill="${COLORS.player}"/>
      <polygon points="-3,-2 3,-2 0,-10" fill="#ffffff" opacity="0.9"/>
    </g>
    
    <!-- Glow aura -->
    <circle cx="0" cy="0" r="25" fill="${COLORS.player}" opacity="0.08">
      <animate attributeName="r" values="25;30;25" dur="2s" repeatCount="indefinite"/>
    </circle>
    
    <!-- LÁSERES: disparan desde la nave y suben -->
    ${laser(-8, 1.2, 0.5)}
    ${laser(8, 1.2, 1.5)}
    ${laser(-8, 1.0, 3.0)}
    ${laser(8, 1.0, 4.0)}
    ${laser(0, 0.9, 5.5)}
    ${laser(-8, 1.1, 7.0)}
    ${laser(8, 1.1, 8.5)}
    ${laser(0, 0.8, 10.0)}
    ${laser(-8, 1.0, 11.5)}
    ${laser(8, 1.0, 13.0)}
  </g>`;
}

function laser(xOffset, speed, beginSec) {
  return `
  <g filter="url(#glow-laser)">
    <rect x="${xOffset - 2}" y="-28" width="4" height="16" rx="2" fill="${COLORS.laser}" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="${speed}s" begin="${beginSec}s" repeatCount="indefinite"/>
      <animate attributeName="y" from="-28" to="-320" dur="${speed}s" begin="${beginSec}s" repeatCount="indefinite"/>
    </rect>
    <rect x="${xOffset - 1}" y="-28" width="2" height="16" rx="1" fill="#ffffff" opacity="0">
      <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.8;1" dur="${speed}s" begin="${beginSec}s" repeatCount="indefinite"/>
      <animate attributeName="y" from="-28" to="-320" dur="${speed}s" begin="${beginSec}s" repeatCount="indefinite"/>
    </rect>
  </g>`;
}

// =============================
// ENEMIGOS
// =============================
function enemyType1(x, y) {
  const d = `M${x},${y} L${x + 10},${y + 8} L${x},${y + 16} L${x - 10},${y + 8} Z`;
  const wingL = `M${x - 10},${y + 8} L${x - 18},${y + 4} L${x - 10},${y + 12} Z`;
  const wingR = `M${x + 10},${y + 8} L${x + 18},${y + 4} L${x + 10},${y + 12} Z`;
  return `<g filter="url(#glow-enemy)">
    <path d="${wingL}" fill="${COLORS.enemy1}" opacity="0.7"/>
    <path d="${wingR}" fill="${COLORS.enemy1}" opacity="0.7"/>
    <path d="${d}" fill="${COLORS.enemy1}"/>
    <circle cx="${x}" cy="${y + 8}" r="3" fill="#ffffff" opacity="0.8"/>
  </g>`;
}

function enemyType2(x, y) {
  const body = `M${x},${y + 4} L${x + 4},${y + 12} L${x},${y + 16} L${x - 4},${y + 12} Z`;
  const wingL = `M${x - 4},${y + 6} Q${x - 16},${y} ${x - 4},${y + 14} Z`;
  const wingR = `M${x + 4},${y + 6} Q${x + 16},${y} ${x + 4},${y + 14} Z`;
  return `<g filter="url(#glow-enemy)">
    <path d="${wingL}" fill="${COLORS.enemy2}" opacity="0.8"/>
    <path d="${wingR}" fill="${COLORS.enemy2}" opacity="0.8"/>
    <path d="${body}" fill="${COLORS.enemy2}"/>
    <circle cx="${x}" cy="${y + 8}" r="2.5" fill="#ffffff"/>
  </g>`;
}

function enemyType3(x, y) {
  return `<g filter="url(#glow-enemy)">
    <ellipse cx="${x}" cy="${y + 8}" rx="14" ry="10" fill="none" stroke="${COLORS.enemy3}" stroke-width="1" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite"/>
    </ellipse>
    <rect x="${x - 8}" y="${y}" width="16" height="16" rx="3" fill="${COLORS.enemy3}"/>
    <circle cx="${x - 4}" cy="${y + 6}" r="2" fill="#ffffff"/>
    <circle cx="${x + 4}" cy="${y + 6}" r="2" fill="#ffffff"/>
    <rect x="${x - 3}" y="${y + 11}" width="6" height="2" fill="#ffffff"/>
  </g>`;
}

// Enemigo que "explota" (colisión visual)
function enemyWithExplosion(x, y, type, explodeAtSec, cycleDur = 20) {
  const t1 = (explodeAtSec / cycleDur).toFixed(3);
  const t2 = ((explodeAtSec + 0.15) / cycleDur).toFixed(3);
  const t3 = ((explodeAtSec + 0.8) / cycleDur).toFixed(3);
  const t4 = ((explodeAtSec + 1.5) / cycleDur).toFixed(3);
  
  const sprite = type === 1 ? enemyType1(x, y) : type === 2 ? enemyType2(x, y) : enemyType3(x, y);
  
  return `
  <g>
    <!-- El enemigo parpadea y desaparece al ser "impactado" -->
    <g>
      <animate attributeName="opacity" 
        values="1;1;0.2;0;1;1" 
        keyTimes="0;${t1};${t2};${t3};${t4};1" 
        dur="${cycleDur}s" 
        repeatCount="indefinite"/>
      ${sprite}
    </g>
    <!-- Explosión sincronizada -->
    ${explosion(x, y, explodeAtSec, cycleDur)}
  </g>`;
}

// =============================
// EXPLOSIONES
// =============================
function explosion(x, y, delay, cycleDur) {
  let particles = "";
  const colors = [COLORS.explosion, "#FFCC00", "#FF3366", "#ffffff", "#FF6600"];
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2;
    const dist = random(15, 30);
    const dx = Math.cos(angle) * dist;
    const dy = Math.sin(angle) * dist;
    const color = colors[i % colors.length];
    const r = rFloat(2, 4);
    particles += `
    <circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.5s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="${x};${x + dx}" dur="0.5s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y + dy}" dur="0.5s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="r" values="${r};0" dur="0.5s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }
  // Flash central
  particles += `
  <circle cx="${x}" cy="${y}" r="8" fill="#ffffff" opacity="0">
    <animate attributeName="opacity" values="0;0.9;0" dur="0.3s" begin="${delay}s" repeatCount="indefinite"/>
    <animate attributeName="r" values="4;20;4" dur="0.3s" begin="${delay}s" repeatCount="indefinite"/>
  </circle>`;
  return particles;
}

// =============================
// FORMACIÓN + COLISIONES
// =============================
function enemyFormation() {
  let formation = "";
  const startX = 130;
  const startY = 25;
  const spacingX = 85;
  const spacingY = 38;
  
  // Fila 1: Jefes (algunos con explosión)
  for (let c = 0; c < 5; c++) {
    const x = startX + c * spacingX;
    const y = startY;
    // Algunos explotan en momentos específicos
    if (c === 1) formation += enemyWithExplosion(x, y, 3, 5.5);
    else if (c === 3) formation += enemyWithExplosion(x, y, 3, 9.0);
    else formation += `<g>${enemyType3(x, y)}</g>`;
  }
  
  // Fila 2: Mariposas
  for (let c = 0; c < 6; c++) {
    const x = startX - 42 + c * spacingX;
    const y = startY + spacingY;
    if (c === 2) formation += enemyWithExplosion(x, y, 2, 3.0);
    else if (c === 4) formation += enemyWithExplosion(x, y, 2, 7.5);
    else formation += `<g>${enemyType2(x, y)}</g>`;
  }
  
  // Fila 3: Abejas
  for (let c = 0; c < 6; c++) {
    const x = startX - 42 + c * spacingX;
    const y = startY + spacingY * 2;
    if (c === 0) formation += enemyWithExplosion(x, y, 1, 1.5);
    else if (c === 5) formation += enemyWithExplosion(x, y, 1, 11.0);
    else formation += `<g>${enemyType1(x, y)}</g>`;
  }
  
  return `<g>
    ${formation}
    <animateTransform attributeName="transform" type="translate" 
      values="0,0; 35,0; 0,0; -35,0; 0,0" 
      dur="7s" repeatCount="indefinite"/>
  </g>`;
}

// =============================
// ENEMIGOS ATACANDO
// =============================
function attackingEnemies() {
  let attackers = "";
  const configs = [
    { x: 220, type: 1, delay: 1, dur: 4 },
    { x: 480, type: 2, delay: 4, dur: 5 },
    { x: 680, type: 1, delay: 7, dur: 4.5 },
    { x: 380, type: 2, delay: 10, dur: 5.5 },
    { x: 580, type: 1, delay: 13, dur: 4 }
  ];
  
  configs.forEach(cfg => {
    const yVals = `0; 50; 100; 160; ${HEIGHT - 50}; 160; 100; 50; 0`;
    const xVals = `${cfg.x}; ${cfg.x + 50}; ${cfg.x + 70}; ${cfg.x + 50}; ${cfg.x}; ${cfg.x - 50}; ${cfg.x - 70}; ${cfg.x - 50}; ${cfg.x}`;
    const pairs = xVals.split(';').map((xv, i) => `${xv.trim()},${yVals.split(';')[i].trim()}`).join(';');
    
    const sprite = cfg.type === 1 ? enemyType1(0, 0) : enemyType2(0, 0);
    
    attackers += `<g>
      <animateTransform attributeName="transform" type="translate" 
        values="${pairs}" 
        dur="${cfg.dur}s" begin="${cfg.delay}s" repeatCount="indefinite"/>
      ${sprite}
      <!-- Explosión cuando el atacante "es destruido" al volver arriba -->
      ${explosion(0, 0, cfg.delay + cfg.dur - 0.5, cfg.dur + 2)}
    </g>`;
  });
  
  return attackers;
}

// =============================
// HUD
// =============================
function hud() {
  return `
  <rect x="10" y="8" width="200" height="75" rx="8" fill="url(#hudGrad)" stroke="${COLORS.hudDim}" stroke-width="1" opacity="0.8"/>
  <line x1="20" y1="20" x2="100" y2="20" stroke="${COLORS.hud}" stroke-width="1" opacity="0.5"/>
  <text x="20" y="35" fill="${COLORS.hud}" font-size="14" font-family="monospace" font-weight="bold">
    SCORE: <tspan fill="#FFE600">004250</tspan>
  </text>
  <text x="20" y="52" fill="${COLORS.hud}" font-size="12" font-family="monospace">
    LEVEL: <tspan fill="#00FF88">03</tspan>
  </text>
  <text x="20" y="68" fill="${COLORS.hud}" font-size="10" font-family="monospace" opacity="0.6">
    HI-SCORE: 009800
  </text>
  <g transform="translate(20, 78)">
    <text x="0" y="10" fill="${COLORS.hud}" font-size="10" font-family="monospace">LIVES:</text>
    ${[0, 1, 2].map(i => `
    <g transform="translate(${55 + i * 18}, 2) scale(0.5)">
      <polygon points="0,0 6,10 0,8 -6,10" fill="${COLORS.player}"/>
    </g>`).join('')}
  </g>
  <rect x="${WIDTH - 160}" y="15" width="140" height="6" rx="3" fill="none" stroke="${COLORS.hudDim}" stroke-width="1"/>
  <rect x="${WIDTH - 160}" y="15" width="100" height="6" rx="3" fill="${COLORS.player}" opacity="0.8">
    <animate attributeName="width" values="100;70;100" dur="3s" repeatCount="indefinite"/>
  </rect>
  <text x="${WIDTH - 160}" y="32" fill="${COLORS.hud}" font-size="9" font-family="monospace" opacity="0.7">SHIELD ENERGY</text>
  `;
}

function arcadeTitle() {
  return `
  <text x="${WIDTH - 20}" y="35" fill="${COLORS.hud}" font-size="20" font-family="monospace" font-weight="bold" text-anchor="end" opacity="0.9">
    GALAGA
    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2s" repeatCount="indefinite"/>
  </text>
  <text x="${WIDTH - 20}" y="52" fill="${COLORS.hudDim}" font-size="9" font-family="monospace" text-anchor="end">
    ARCADE EDITION
    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
  </text>
  `;
}

// =============================
// BUILD
// =============================
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:${COLORS.bg}">
  ${defs()}
  
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#nebula)"/>
  
  <g opacity="0.3">${createStarsLayer(15, COLORS.star3, 8, 12, 0.5, 1, 0.4)}</g>
  <g opacity="0.6">${createStarsLayer(25, COLORS.star2, 5, 8, 0.8, 1.5, 0.6)}</g>
  <g opacity="0.9">${createStarsLayer(20, COLORS.star1, 3, 5, 1, 2, 0.9)}</g>
  
  ${shootingStar()}
  ${shootingStar()}
  
  ${enemyFormation()}
  ${attackingEnemies()}
  
  <!-- Nave + láseres (van encima de enemigos para que se vean) -->
  ${playerGroup()}
  
  ${hud()}
  ${arcadeTitle()}
  
  <defs>
    <pattern id="scanlines" x="0" y="0" width="1" height="4" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="1" height="2" fill="#000000" opacity="0.08"/>
    </pattern>
  </defs>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#scanlines)" pointer-events="none"/>
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="none" stroke="#000000" stroke-width="20" opacity="0.3" rx="10"/>
</svg>`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/galaga.svg", svg);
console.log("✅ Galaga generado: dist/galaga.svg");
