const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const livesDisplay = document.getElementById("lives");
const menu = document.getElementById("menu");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const pauseScreen = document.getElementById("pauseScreen");
const resumeButton = document.getElementById("resumeButton");
const restartLevelButton = document.getElementById("restartLevelButton");
const mainMenuButton = document.getElementById("mainMenuButton");
const gameOverScreen = document.getElementById("gameOverScreen");
const finalScoreDisplay = document.getElementById("finalScore");
const playAgainButton = document.getElementById("playAgainButton");
const backToMenuButton = document.getElementById("backToMenuButton");

class GameObject {
  constructor(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  checkCollision(other) {
    return (
      this.x < other.x + other.width &&
      this.x + this.width > other.x &&
      this.y < other.y + other.height &&
      this.y + this.height > other.y
    );
  }
}

class Player extends GameObject {
  constructor(x, y) {
    super(x, y, 20, 20, "blue");
    this.velocityX = 0;
    this.velocityY = 0;
    this.isJumping = false;
    this.jumpStrength = -10;
    this.gravity = 0.5;
  }

  update() {
    this.velocityY += this.gravity;
    this.x += this.velocityX;
    this.y += this.velocityY;

    // Keep player within screen bounds
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isJumping = false;
    }
  }

  jump() {
    this.velocityY = this.jumpStrength;
    this.isJumping = true;
  }
}

class Platform extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, "green");
  }
}

class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, "red");
  }
}

class BonusItem extends GameObject {
  constructor(x, y, radius) {
    super(x - radius, y - radius, 2 * radius, 2 * radius, "yellow");
    this.radius = radius;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(
      this.x + this.radius,
      this.y + this.radius,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

class Portal extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, "purple");
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      this.height / 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }
}

class Game {
  constructor() {
    this.player = null;
    this.platforms = [];
    this.obstacles = [];
    this.bonusItems = [];
    this.portal = null;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.gameActive = false;
    this.isPaused = false;
    this.keys = {};
    this.levels = [
      {
        platforms: [
          new Platform(0, 450, 200, 30),
          new Platform(250, 400, 150, 30),
          new Platform(450, 350, 200, 30),
          new Platform(0, 250, 100, 30),
          new Platform(550, 200, 90, 30),
          new Platform(0, canvas.height - 30, canvas.width, 30), // Ground
        ],
        obstacles: [new Obstacle(300, 370, 30, 30)],
        bonusItems: [
          new BonusItem(100, 420, 10),
          new BonusItem(300, 370 - 20, 10),
          new BonusItem(500, 320, 10),
        ],
        portal: new Portal(580, 170, 20, 30),
        playerStart: { x: 50, y: 420 },
      },
      {
        platforms: [
          new Platform(50, 400, 100, 30),
          new Platform(200, 350, 200, 30),
          new Platform(450, 300, 150, 30),
          new Platform(0, canvas.height - 30, canvas.width, 30), // Ground
        ],
        obstacles: [
          new Obstacle(250, 320, 30, 30),
          new Obstacle(500, 270, 30, 30),
        ],
        bonusItems: [
          new BonusItem(100, 370, 10),
          new BonusItem(300, 320, 10),
          new BonusItem(500, 270 - 20, 10),
        ],
        portal: new Portal(550, 270, 20, 30),
        playerStart: { x: 70, y: 370 },
      },
    ];
    this.isSpacebarDown = false;
    this.jumpInterval = 10; // Adjust for continuous jump speed
    this.lastJumpTime = 0;
  }

  start() {
    this.level = 1;
    this.score = 0;
    this.lives = 3;
    this.loadLevel(this.level - 1);
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI();
    this.hideScreens();
    this.gameLoop();
  }

  restartGame() {
    this.level = 1;
    this.score = 0;
    this.lives = 3;
    this.loadLevel(0);
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI();
    this.hideScreens();
    this.gameLoop();
  }

  restartLevel() {
    this.loadLevel(this.level - 1);
    this.player.velocityX = 0;
    this.player.velocityY = 0;
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI();
    this.hideScreens();
    this.gameLoop();
  }

  loadLevel(levelIndex) {
    const levelData = this.levels[levelIndex];
    if (!levelData) {
      this.gameOver();
      return;
    }
    this.platforms = levelData.platforms;
    this.obstacles = levelData.obstacles;
    this.bonusItems = levelData.bonusItems;
    this.portal = levelData.portal;
    this.player = new Player(levelData.playerStart.x, levelData.playerStart.y);
  }

  updateUI() {
    scoreDisplay.textContent = `Score: ${this.score}`;
    livesDisplay.textContent = `Lives: ${this.lives}`;
  }

  hideScreens() {
    menu.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    restartButton.classList.remove("hidden");
  }

  showMenu() {
    this.gameActive = false;
    menu.classList.remove("hidden");
    restartButton.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
  }

  pauseGame() {
    if (this.gameActive) {
      this.isPaused = true;
      pauseScreen.classList.remove("hidden");
    }
  }

  resumeGame() {
    this.isPaused = false;
    pauseScreen.classList.add("hidden");
    this.gameLoop();
  }

  gameOver() {
    this.gameActive = false;
    gameOverScreen.classList.remove("hidden");
    finalScoreDisplay.textContent = `Final Score: ${this.score}`;
    restartButton.classList.add("hidden");
  }

  handleInput() {
    if (this.keys["ArrowLeft"] || this.keys[37]) {
      this.player.velocityX = -3;
    } else if (this.keys["ArrowRight"] || this.keys[39]) {
      this.player.velocityX = 3;
    } else {
      this.player.velocityX = 0;
    }
  }

  update() {
    if (!this.gameActive || this.isPaused) return;

    this.handleInput();

    // Continuous jump/flight
    if (
      (this.keys["Space"] || this.keys[32]) &&
      Date.now() - this.lastJumpTime > this.jumpInterval
    ) {
      this.player.jump();
      this.lastJumpTime = Date.now();
    }

    this.player.update();

    // Platform collision
    this.platforms.forEach((platform) => {
      if (this.player.checkCollision(platform)) {
        if (
          this.player.velocityY > 0 &&
          this.player.y + this.player.height <= platform.y + 10
        ) {
          this.player.y = platform.y - this.player.height;
          this.player.velocityY = 0;
          this.player.isJumping = false;
        }
      }
    });

    // Obstacle collision
    this.obstacles.forEach((obstacle) => {
      if (this.player.checkCollision(obstacle)) {
        this.lives--;
        this.updateUI();
        if (this.lives <= 0) {
          this.gameOver();
        } else {
          this.loadLevel(this.level - 1);
        }
      }
    });

    // Bonus item collection
    for (let i = this.bonusItems.length - 1; i >= 0; i--) {
      const bonus = this.bonusItems[i];
      if (this.player.checkCollision(bonus)) {
        this.score += 10;
        this.bonusItems.splice(i, 1);
        this.updateUI();
      }
    }

    // Portal collision
    if (this.portal && this.player.checkCollision(this.portal)) {
      this.level++;
      this.loadLevel(this.level - 1);
      this.updateUI();
    }

    // Fall off screen
    if (this.player.y > canvas.height) {
      this.lives--;
      this.updateUI();
      if (this.lives <= 0) {
        this.gameOver();
      } else {
        this.loadLevel(this.level - 1);
      }
    }
  }

  draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.platforms.forEach((platform) => platform.draw(ctx));
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
    this.bonusItems.forEach((item) => item.draw(ctx));
    if (this.portal) {
      this.portal.draw(ctx);
    }
    this.player.draw(ctx);
  }

  gameLoop() {
    requestAnimationFrame(this.gameLoop.bind(this));
    this.update();
    this.draw();
  }
}

function initGame() {
  game = new Game();
  game.showMenu();

  startButton.addEventListener("click", () => {
    game.start();
  });

  restartButton.addEventListener("click", () => {
    game.restartGame();
  });

  document.addEventListener("keydown", (e) => {
    game.keys[e.key] = true;
    game.keys[e.keyCode] = true; // Also store key code
    console.log(`Key down: ${e.key} (Code: ${e.keyCode})`);
  });

  document.addEventListener("keyup", (e) => {
    game.keys[e.key] = false;
    game.keys[e.keyCode] = false; // Also remove key code
    console.log(`Key up: ${e.key} (Code: ${e.keyCode})`);
  });

  resumeButton.addEventListener("click", () => {
    game.resumeGame();
  });

  restartLevelButton.addEventListener("click", () => {
    game.restartLevel();
  });

  mainMenuButton.addEventListener("click", () => {
    game.showMenu();
  });

  playAgainButton.addEventListener("click", () => {
    game.restartGame();
  });

  backToMenuButton.addEventListener("click", () => {
    game.showMenu();
  });
}

initGame();
