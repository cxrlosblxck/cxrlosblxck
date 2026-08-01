const fs = require("fs");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" style="background:black">
  <!-- Nave -->
  <polygon points="390,180 410,180 400,160" fill="cyan"/>
  <!-- Disparo -->
  <rect x="398" y="140" width="4" height="20" fill="yellow">
    <animate attributeName="y" from="140" to="0" dur="2s" repeatCount="indefinite"/>
  </rect>
  <!-- Enemigo -->
  <rect x="390" y="20" width="20" height="20" fill="red">
    <animate attributeName="x" from="390" to="600" dur="5s" repeatCount="indefinite"/>
  </rect>
</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/galaga.svg", svg);
