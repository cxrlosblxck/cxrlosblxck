const fs = require("fs");

// =============================
// CONFIG
// =============================
const WIDTH = 900;
const HEIGHT = 240;

const COLORS = {
  background: "#020111",
  star: "#ffffff",
  player: "#00F5FF",
  enemy: "#FF3366",
  laser: "#FFE600",
  hud: "#FFFFFF"
};

// =============================
// HELPERS
// =============================
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// =============================
// BACKGROUND
// =============================
function createStars(count = 30) {
  let stars = "";
  for (let i = 0; i < count; i++) {
    const x = random(0, WIDTH);
    const y = random(0, HEIGHT);
    stars += `<circle cx="${x}" cy="${y}" r="1.5" fill="${COLORS.star}">
      <animate attributeName="opacity" values="1;0;1" dur="${random(2,5)}s" repeatCount="indefinite"/>
    </circle>`;
  }
  return stars;
}

// =============================
// SPRITES
// =============================
function playerSprite(x = WIDTH / 2, y = HEIGHT - 40) {
  return `<polygon points="${x-10},${y} ${x+10},${y} ${x},${y-20}" fill="${COLORS.player}"/>`;
}

function enemySprite(x, y) {
  return `<rect x="${x}" y="${y}" width="20" height="20" fill="${COLORS.enemy}">
    <animate attributeName="y" from="${y}" to="${HEIGHT}" dur="6s" repeatCount="indefinite"/>
    <animate attributeName="x" values="${x};${x+40};${x};${x-40};${x}" dur="6s" repeatCount="indefinite"/>
  </rect>`;
}

function laser(x, y = HEIGHT - 60) {
  return `<rect x="${x}" y="${y}" width="4" height="20" fill="${COLORS.laser}">
    <animate attributeName="y" from="${y}" to="0" dur="2s" repeatCount="indefinite"/>
  </rect>`;
}

// =============================
// HUD
// =============================
function score() {
  return `<text x="20" y="30" fill="${COLORS.hud}" font-size="16" font-family="monospace">SCORE: 0000</text>`;
}
function level() {
  return `<text x="20" y="50" fill="${COLORS.hud}" font-size="16" font-family="monospace">LEVEL: 1</text>`;
}
function lives() {
  return `<text x="20" y="70" fill="${COLORS.hud}" font-size="16" font-family="monospace">LIVES: ♥ ♥ ♥</text>`;
}

// =============================
// ENEMIES
// =============================
function enemyFormation(rows = 2, cols = 5) {
  let formation = "";
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = 100 + c * 100;
      const y = 20 + r * 40;
      formation += enemySprite(x, y);
    }
  }
  return formation;
}

// =============================
// BUILD SVG
// =============================
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" style="background:${COLORS.background}">
  ${createStars()}
  ${score()}
  ${level()}
  ${lives()}
  ${enemyFormation()}
  ${laser(WIDTH/2)}
  ${playerSprite()}
</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/galaga.svg", svg);
