const fs = require("fs");

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="200" style="background:black">
  <!-- Estrellas -->
  <circle cx="50" cy="30" r="2" fill="white">
    <animate attributeName="opacity" values="1;0;1" dur="3s" repeatCount="indefinite"/>
  </circle>
  <circle cx="200" cy="80" r="2" fill="white">
    <animate attributeName="opacity" values="1;0;1" dur="4s" repeatCount="indefinite"/>
  </circle>
  <circle cx="600" cy="50" r="2" fill="white">
    <animate attributeName="opacity" values="1;0;1" dur="5s" repeatCount="indefinite"/>
  </circle>

  <!-- Naves -->
  <polygon points="100,180 120,180 110,160" fill="cyan"/>
  <polygon points="390,180 410,180 400,160" fill="lime"/>
  <polygon points="680,180 700,180 690,160" fill="cyan"/>

  <!-- Disparos -->
  <rect x="108" y="140" width="4" height="20" fill="yellow">
    <animate attributeName="y" from="140" to="0" dur="2s" repeatCount="indefinite"/>
  </rect>
  <rect x="398" y="140" width="4" height="20" fill="yellow">
    <animate attributeName="y" from="140" to="0" dur="2s" repeatCount="indefinite"/>
  </rect>
  <rect x="688" y="140" width="4" height="20" fill="yellow">
    <animate attributeName="y" from="140" to="0" dur="2s" repeatCount="indefinite"/>
  </rect>

  <!-- Enemigos -->
  <rect x="100" y="20" width="20" height="20" fill="red">
    <animate attributeName="y" from="20" to="180" dur="6s" repeatCount="indefinite"/>
  </rect>
  <rect x="400" y="20" width="20" height="20" fill="red">
    <animate attributeName="y" from="20" to="180" dur="6s" repeatCount="indefinite"/>
  </rect>
  <rect x="700" y="20" width="20" height="20" fill="red">
    <animate attributeName="y" from="20" to="180" dur="6s" repeatCount="indefinite"/>
  </rect>
</svg>
`;

fs.mkdirSync("dist", { recursive: true });
fs.writeFileSync("dist/galaga.svg", svg);
