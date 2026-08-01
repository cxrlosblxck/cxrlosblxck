const fs = require("fs");

// =============================
// CONFIG
// =============================
const WIDTH = 900;
const HEIGHT = 280;

const COLORS = {
  bg: "#03020a",
  star1: "#ffffff",
  star2: "#a0c4ff",
  star3: "#ffd6a5",
  player: "#00F5FF",
  playerGlow: "#00F5FF",
  laser: "#FFE600",
  laserGlow: "#FFE600",
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
// BACKGROUND
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

function createShootingStar() {
  const x = random(-100, WIDTH - 100);
  const y = random(0, HEIGHT / 2);
  return `<line x1="${x}" y1="${y}" x2="${x - 40}" y2="${y + 15}" stroke="#ffffff" stroke-width="1" opacity="0">
    <animate attributeName="opacity" values="0;0.8;0" dur="1.5s" begin="${rFloat(3, 8)}s" repeatCount="indefinite"/>
    <animate attributeName="x1" from="${x}" to="${x + 200}" dur="1.5s" begin="${rFloat(3, 8)}s" repeatCount="indefinite"/>
    <animate attributeName="x2" from="${x - 40}" to="${x + 160}" dur="1.5s" begin="${rFloat(3, 8)}s" repeatCount="indefinite"/>
    <animate attributeName="y1" from="${y}" to="${y + 80}" dur="1.5s" begin="${rFloat(3, 8)}s" repeatCount="indefinite"/>
    <animate attributeName="y2" from="${y + 15}" to="${y + 95}" dur="1.5s" begin="${rFloat(3, 8)}s" repeatCount="indefinite"/>
  </line>`;
}

// =============================
// PLAYER — Nave con movimiento automático
// =============================
function playerSprite() {
  // La nave se mueve automáticamente por el path definido
  // Usamos animateMotion para seguir un path de patrulla + esquive
  const path = `
    M 100,${HEIGHT - 50} 
    C 150,${HEIGHT - 50} 200,${HEIGHT - 70} 250,${HEIGHT - 50}
    C 300,${HEIGHT - 30} 350,${HEIGHT - 80} 400,${HEIGHT - 50}
    C 450,${HEIGHT - 20} 500,${HEIGHT - 90} 550,${HEIGHT - 50}
    C 600,${HEIGHT - 30} 650,${HEIGHT - 70} 700,${HEIGHT - 50}
    C 750,${HEIGHT - 40} 800,${HEIGHT - 60} 850,${HEIGHT - 50}
    C 800,${HEIGHT - 40} 750,${HEIGHT - 30} 700,${HEIGHT - 50}
    C 650,${HEIGHT - 70} 600,${HEIGHT - 20} 550,${HEIGHT - 50}
    C 500,${HEIGHT - 90} 450,${HEIGHT - 20} 400,${HEIGHT - 50}
    C 350,${HEIGHT - 80} 300,${HEIGHT - 30} 250,${HEIGHT - 50}
    C 200,${HEIGHT - 70} 150,${HEIGHT - 50} 100,${HEIGHT - 50}
  `;
  
  // También agregamos un pequeño "tilt" cuando se mueve (autoRotate)
  return `
  <g>
    <animateMotion dur="20s" repeatCount="indefinite" path="${path.replace(/\s+/g, ' ').trim()}" rotate="auto"/>
    
    <!-- Motores -->
    <ellipse cx="-12" cy="5" rx="3" ry="6" fill="#FF6600" opacity="0.8">
      <animate attributeName="ry" values="6;9;6" dur="0.15s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.15s" repeatCount="indefinite"/>
    </ellipse>
    <ellipse cx="12" cy="5" rx="3" ry="6" fill="#FF6600" opacity="0.8">
      <animate attributeName="ry" values="6;9;6" dur="0.15s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.3;0.8" dur="0.15s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Sombra -->
    <ellipse cx="0" cy="12" rx="15" ry="4" fill="#00F5FF" opacity="0.15">
      <animate attributeName="rx" values="15;18;15" dur="2s" repeatCount="indefinite"/>
    </ellipse>
    
    <!-- Ala izquierda -->
    <polygon points="-8,-5 -20,10 -8,5" fill="${COLORS.player}" opacity="0.9"/>
    <!-- Ala derecha -->
    <polygon points="8,-5 20,10 8,5" fill="${COLORS.player}" opacity="0.9"/>
    <!-- Cuerpo -->
    <polygon points="-8,8 8,8 0,-18" fill="${COLORS.player}"/>
    <!-- Cabina -->
    <polygon points="-3,-2 3,-2 0,-10" fill="#ffffff" opacity="0.9"/>
    
    <!-- Glow -->
    <circle cx="0" cy="0" r="25" fill="${COLORS.player}" opacity="0.1">
      <animate attributeName="r" values="25;28;25" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.1;0.05;0.1" dur="2s" repeatCount="indefinite"/>
    </circle>
  </g>`;
}

// =============================
// LÁSERES — Disparan desde la nave en movimiento
// =============================
function lasersFromPlayer() {
  // Los láseres usan el mismo path que la nave pero con offset de tiempo
  // para simular que disparan mientras se mueve
  const path = `
    M 100,${HEIGHT - 50} 
    C 150,${HEIGHT - 50} 200,${HEIGHT - 70} 250,${HEIGHT - 50}
    C 300,${HEIGHT - 30} 350,${HEIGHT - 80} 400,${HEIGHT - 50}
    C 450,${HEIGHT - 20} 500,${HEIGHT - 90} 550,${HEIGHT - 50}
    C 600,${HEIGHT - 30} 650,${HEIGHT - 70} 700,${HEIGHT - 50}
    C 750,${HEIGHT - 40} 800,${HEIGHT - 60} 850,${HEIGHT - 50}
    C 800,${HEIGHT - 40} 750,${HEIGHT - 30} 700,${HEIGHT - 50}
    C 650,${HEIGHT - 70} 600,${HEIGHT - 20} 550,${HEIGHT - 50}
    C 500,${HEIGHT - 90} 450,${HEIGHT - 20} 400,${HEIGHT - 50}
    C 350,${HEIGHT - 80} 300,${HEIGHT - 30} 250,${HEIGHT - 50}
    C 200,${HEIGHT - 70} 150,${HEIGHT - 50} 100,${HEIGHT - 50}
  `;
  const cleanPath = path.replace(/\s+/g, ' ').trim();
  
  let lasers = "";
  // 3 láseres que disparan en diferentes momentos del recorrido
  const shots = [
    { offset: 0, dur: 20, laserSpeed: 1.2, side: -8 },
    { offset: 3, dur: 20, laserSpeed: 1.2, side: 8 },
    { offset: 6, dur: 20, laserSpeed: 1.0, side: 0 },
    { offset: 10, dur: 20, laserSpeed: 1.0, side: -8 },
    { offset: 13, dur: 20, laserSpeed: 1.2, side: 8 },
    { offset: 16, dur: 20, laserSpeed: 0.8, side: 0 },
  ];
  
  shots.forEach((shot, i) => {
    lasers += `
    <g filter="url(#glow-laser)">
      <!-- Láser que sigue la nave y luego sube -->
      <rect x="${shot.side - 2}" y="-25" width="4" height="18" rx="2" fill="${COLORS.laser}">
        <animateMotion dur="${shot.dur}s" begin="${shot.offset}s" repeatCount="indefinite" path="${cleanPath}"/>
        <animate attributeName="y" from="-25" to="-${HEIGHT}" dur="${shot.laserSpeed}s" begin="${shot.offset}s" repeatCount="indefinite"/>
        <animate attributeName="height" values="18;24;18" dur="0.1s" repeatCount="indefinite"/>
      </rect>
      <!-- Brillo -->
      <rect x="${shot.side - 1}" y="-25" width="2" height="18" rx="1" fill="#ffffff">
        <animateMotion dur="${shot.dur}s" begin="${shot.offset}s" repeatCount="indefinite" path="${cleanPath}"/>
        <animate attributeName="y" from="-25" to="-${HEIGHT}" dur="${shot.laserSpeed}s" begin="${shot.offset}s" repeatCount="indefinite"/>
      </rect>
    </g>`;
  });
  
  return lasers;
}

// =============================
// ENEMIGOS
// =============================
function enemyType1(x, y, delay = 0) {
  const d = `M${x},${y} L${x + 10},${y + 8} L${x},${y + 16} L${x - 10},${y + 8} Z`;
  const wingL = `M${x - 10},${y + 8} L${x - 18},${y + 4} L${x - 10},${y + 12} Z`;
  const wingR = `M${x + 10},${y + 8} L${x + 18},${y + 4} L${x + 10},${y + 12} Z`;
  
  return `<g filter="url(#glow-enemy)">
    <path d="${wingL}" fill="${COLORS.enemy1}" opacity="0.7"/>
    <path d="${wingR}" fill="${COLORS.enemy1}" opacity="0.7"/>
    <path d="${d}" fill="${COLORS.enemy1}"/>
    <circle cx="${x}" cy="${y + 8}" r="3" fill="#ffffff" opacity="0.8"/>
  </g>
  <animateTransform attributeName="transform" type="translate" 
    values="0,0; 0,5; 0,0" dur="2s" begin="${delay}s" repeatCount="indefinite"/>`;
}

function enemyType2(x, y, delay = 0) {
  const body = `M${x},${y + 4} L${x + 4},${y + 12} L${x},${y + 16} L${x - 4},${y + 12} Z`;
  const wingL = `M${x - 4},${y + 6} Q${x - 16},${y} ${x - 4},${y + 14} Z`;
  const wingR = `M${x + 4},${y + 6} Q${x + 16},${y} ${x + 4},${y + 14} Z`;
  
  return `<g filter="url(#glow-enemy)">
    <path d="${wingL}" fill="${COLORS.enemy2}" opacity="0.8"/>
    <path d="${wingR}" fill="${COLORS.enemy2}" opacity="0.8"/>
    <path d="${body}" fill="${COLORS.enemy2}"/>
    <circle cx="${x}" cy="${y + 8}" r="2.5" fill="#ffffff"/>
  </g>
  <animateTransform attributeName="transform" type="translate" 
    values="0,0; 0,4; 0,0" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/>`;
}

function enemyType3(x, y, delay = 0) {
  return `<g filter="url(#glow-enemy)">
    <ellipse cx="${x}" cy="${y + 8}" rx="14" ry="10" fill="none" stroke="${COLORS.enemy3}" stroke-width="1" opacity="0.5">
      <animate attributeName="opacity" values="0.5;0.2;0.5" dur="1s" repeatCount="indefinite"/>
    </ellipse>
    <rect x="${x - 8}" y="${y}" width="16" height="16" rx="3" fill="${COLORS.enemy3}"/>
    <circle cx="${x - 4}" cy="${y + 6}" r="2" fill="#ffffff"/>
    <circle cx="${x + 4}" cy="${y + 6}" r="2" fill="#ffffff"/>
    <rect x="${x - 3}" y="${y + 11}" width="6" height="2" fill="#ffffff"/>
  </g>
  <animateTransform attributeName="transform" type="translate" 
    values="0,0; 0,3; 0,0" dur="2.5s" begin="${delay}s" repeatCount="indefinite"/>`;
}

// =============================
// FORMACIÓN
// =============================
function enemyFormation() {
  let formation = "";
  const startX = 120;
  const startY = 25;
  const spacingX = 90;
  const spacingY = 40;
  
  for (let c = 0; c < 5; c++) formation += enemyType3(startX + c * spacingX, startY, c * 0.2);
  for (let c = 0; c < 6; c++) formation += enemyType2(startX - 45 + c * spacingX, startY + spacingY, c * 0.15);
  for (let c = 0; c < 6; c++) formation += enemyType1(startX - 45 + c * spacingX, startY + spacingY * 2, c * 0.1);
  
  return `<g>
    ${formation}
    <animateTransform attributeName="transform" type="translate" 
      values="0,0; 40,0; 0,0; -40,0; 0,0" 
      dur="8s" repeatCount="indefinite"/>
  </g>`;
}

// =============================
// ENEMIGOS ATACANDO
// =============================
function attackingEnemies() {
  let attackers = "";
  const paths = [
    { x: 200, type: 1, delay: 2, dur: 4 },
    { x: 500, type: 2, delay: 5, dur: 5 },
    { x: 700, type: 1, delay: 8, dur: 4.5 },
    { x: 350, type: 2, delay: 12, dur: 5.5 },
    { x: 600, type: 1, delay: 15, dur: 4 }
  ];
  
  paths.forEach(p => {
    const yValues = `0; 60; 120; 180; ${HEIGHT - 40}; 180; 120; 60; 0`;
    const xValues = `${p.x}; ${p.x + 60}; ${p.x + 80}; ${p.x + 60}; ${p.x}; ${p.x - 60}; ${p.x - 80}; ${p.x - 60}; ${p.x}`;
    const pairs = xValues.split(';').map((xv, i) => `${xv.trim()},${yValues.split(';')[i].trim()}`).join(';');
    
    attackers += `<g>
      <animateTransform attributeName="transform" type="translate" 
        values="${pairs}" 
        dur="${p.dur}s" begin="${p.delay}s" repeatCount="indefinite"/>
      ${p.type === 1 ? enemyType1(0, 0) : enemyType2(0, 0)}
    </g>`;
  });
  
  return attackers;
}

// =============================
// EXPLOSIONES
// =============================
function explosion(x, y, delay = 0) {
  let particles = "";
  const colors = [COLORS.explosion, "#FFCC00", "#FF3366", "#ffffff"];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const dx = Math.cos(angle) * 25;
    const dy = Math.sin(angle) * 25;
    const color = colors[i % colors.length];
    particles += `
    <circle cx="${x}" cy="${y}" r="${rFloat(1.5, 3)}" fill="${color}" opacity="0">
      <animate attributeName="opacity" values="0;1;0" dur="0.6s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cx" values="${x};${x + dx}" dur="0.6s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="cy" values="${y};${y + dy}" dur="0.6s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="r" values="3;0" dur="0.6s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`;
  }
  return particles;
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
    <animate attributeName="width" values="100;80;100" dur="4s" repeatCount="indefinite"/>
  </rect>
  <text x="${WIDTH - 160}" y="32" fill="${COLORS.hud}" font-size="9" font-family="monospace" opacity="0.7">SHIELD ENERGY</text>
  `;
}

function arcadeTitle() {
  return `
  <text x="${WIDTH - 20}" y="35" fill="${COLORS.hud}" font-size="20" font-family="monospace" font-weight="bold" text-anchor="end" opacity="0.9">
    GALAGA
    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="2s" repeatCount="indefinite"/>
  </text>
  <text x="${WIDTH - 20}" y="52" fill="${COLORS.hudDim}" font-size="9" font-family="monospace" text-anchor="end">
    ARCADE EDITION
    <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite"/>
  </text>
  `;
}

// =============================
// BUILD SVG
// =============================
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}" style="background:${COLORS.bg}">
  ${defs()}
  
  <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="url(#nebula)"/>
  
  <!-- Estrellas parallax -->
  <g opacity="0.3">${createStarsLayer(15, COLORS.star3, 8, 12, 0.5, 1, 0.4)}</g>
  <g opacity="0.6">${createStarsLayer(25, COLORS.star2, 5, 8, 0.8, 1.5, 0.6)}</g>
  <g opacity="0.9">${createStarsLayer(20, COLORS.star1, 3, 5, 1, 2, 0.9)}</g>
  
  ${createShootingStar()}
  ${createShootingStar()}
  
  <!-- Formación -->
  ${enemyFormation()}
  
  <!-- Atacantes -->
  ${attackingEnemies()}
  
  <!-- Explosiones -->
  ${explosion(300, 120, 3)}
  ${explosion(600, 80, 6)}
  ${explosion(450, 160, 9)}
  ${explosion(200, 100, 11)}
  ${explosion(750, 140, 14)}
  
  <!-- Láseres que disparan desde la nave en movimiento -->
  ${lasersFromPlayer()}
  
  <!-- Nave que se mueve sola -->
  ${playerSprite()}
  
  <!-- HUD -->
  ${hud()}
  ${arcadeTitle()}
  
  <!-- Scanlines CRT -->
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
console.log("✅ Galaga SVG con nave en movimiento generado en dist/galaga.svg");
