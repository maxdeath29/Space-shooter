const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

const background = new Image();
background.scr = "images/space.png"

function game() {
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
}

// Imagem da Nave Espacial
const spaceShipImage = new Image();
spaceShipImage.src = "assets/spaceship.png";

// Nave Espacial
const spaceship = {
  x: canvas.width / 2,
  y: canvas.height - 60,
  width: 50,
  height: 50,
  speed: 6,
};

// Projéteis
const bullets = [];

// Inimigos
const enemies = [];

// Placar
let score = 0;

// Vidas
let lives = 3;

// Estado do jogo
let gamePaused = true; // Inicia pausado

// Controles do teclado
const keys = {};

function drawSpaceShip() {
  ctx.drawImage(spaceShipImage, spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawBullets() {
  ctx.fillStyle = "lightblue";
  for (const bullet of bullets) {
    ctx.fillRect(bullet.x, bullet.y, 5, 10);
  }
}

const enemyImage = new Image();
enemyImage.src = "assets/space-alien.png";

function drawEnemy(enemy) {
    ctx.drawImage(enemyImage, enemy.x, enemy.y, 30, 30);
}

function drawScore() {
  const scoreElement = document.getElementById("scoreValue");
  scoreElement.textContent = score;
}

function drawLife() {
  const lifeElement = document.getElementById("lifeValue");
  lifeElement.textContent = lives;
}

function checkCollisions() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i];

    for (let j = enemies.length - 1; j >= 0; j--) {
      const enemy = enemies[j];

      // Verificar colisão entre projétil e inimigo
      if (
        bullet.x < enemy.x + 30 &&
        bullet.x + 5 > enemy.x &&
        bullet.y < enemy.y + 30 &&
        bullet.y + 10 > enemy.y
      ) {
        // Remover projétil
        bullets.splice(i, 1);

        // Incrementar o placar
        score++;

        // Reposicionar inimigo aleatoriamente
        enemy.y = 0;
        enemy.x = Math.random() * (canvas.width - 30);
      }
    }
  }

  // Verificar colisão entre nave e inimigo
  for (const enemy of enemies) {
    if (
      spaceship.x < enemy.x + 30 &&
      spaceship.x + spaceship.width > enemy.x &&
      spaceship.y < enemy.y + 30 &&
      spaceship.y + spaceship.height > enemy.y
    ) {
      // Diminuir vidas
      lives--;

      // Reposicionar inimigo aleatoriamente
      enemy.y = 0;
      enemy.x = Math.random() * (canvas.width - 30);

      // Redefinir posição da nave
      spaceship.x = canvas.width / 2;
      spaceship.y = canvas.height - 50;

      // Atualizar o elemento HTML que exibe as vidas
      drawLife();
    }

    // Se o inimigo sair da tela, reposicione aleatoriamente no topo
    if (enemy.y > canvas.height) {
      enemy.y = 0;
      enemy.x = Math.random() * (canvas.width - 30);

      // Diminuir vidas
      lives--;

      // Atualizar o elemento HTML que exibe as vidas
      drawLife();
    }
  }
}

function update() {
  if (gamePaused) return;

  // Atualizar posição dos inimigos
  for (const enemy of enemies) {
    enemy.y += enemy.speed;
  }

  // Atualizar posição da nave
  if (keys.ArrowLeft && spaceship.x > 0) {
    spaceship.x -= spaceship.speed;
  }
  if (keys.ArrowRight && spaceship.x < canvas.width - spaceship.width) {
    spaceship.x += spaceship.speed;
  }

  // Atualizar posição dos projéteis
  for (const bullet of bullets) {
    bullet.y -= 10;
  }

  checkCollisions();

  // Remover projéteis fora do canvas
  bullets.forEach((bullet, index) => {
    if (bullet.y < 0) {
      bullets.splice(index, 1);
    }
  });

  // Verificar se o jogador perdeu todas as vidas
  if (lives <= 0) {
    gamePaused = true;
    document.getElementById("gameOverButton").style.display = "block";
    alert("Game Over! Your score: " + score);
    // Reiniciar o jogo após a mensagem de Game Over
    resetGame();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSpaceShip();
  drawBullets();

  // Desenhar inimigos
  for (const enemy of enemies) {
    drawEnemy(enemy);
  }

  drawScore();
  drawLife();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  // Reiniciar variáveis
  score = 0;
  lives = 3;
  gamePaused = true;

  // Limpar arrays de projéteis e inimigos
  bullets.length = 0;
  enemies.length = 0;

  // Adicionar inimigo inicial
  enemies.push({ x: Math.random() * (canvas.width - 30), y: 0, speed: 2 });

  // Atualizar o elemento HTML que exibe as vidas
  drawLife();

  // Mostrar o botão de início e ocultar o botão de Game Over
  document.getElementById("startButton").style.display = "block";
  document.getElementById("gameOverButton").style.display = "none";
}

// Controles do teclado
window.addEventListener("keydown", (e) => {
  keys[e.key] = true;

  // Disparar projétil
  if (e.key === " ") {
    bullets.push({ x: spaceship.x + spaceship.width / 2 - 2.5, y: spaceship.y });
  }
});

window.addEventListener("keyup", (e) => {
  keys[e.key] = false;
});

// Botão de início
const startButton = document.getElementById("startButton");
startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  gamePaused = false;
  gameLoop();
});

// Botão de Game Over
const gameOverButton = document.getElementById("gameOverButton");
gameOverButton.addEventListener("click", () => {
  gameOverButton.style.display = "none";
  gamePaused = false;
  gameLoop();
});

function init() {
  // Adicionar inimigo inicial
  enemies.push({ x: Math.random() * (canvas.width - 30), y: 0, speed: 3 });
}

init();
