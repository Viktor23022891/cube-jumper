// "use strict";

import { levels } from "./levels.js";

// DOM elements IDs
const CANVAS_ID = "gameCanvas"; // ID of the canvas element where the game is rendered
const SCORE_DISPLAY_ID = "score"; // ID of the element displaying the player's score
const LIVES_DISPLAY_ID = "lives"; // ID of the element displaying the player's lives
const MENU_ID = "menu"; // ID of the main menu screen
const START_BUTTON_ID = "startButton"; // ID of the button to start the game
const RESTART_BUTTON_ID = "restartButton"; // ID of the button to restart the entire game
const PAUSE_SCREEN_ID = "pauseScreen"; // ID of the pause screen
const RESUME_BUTTON_ID = "resumeButton"; // ID of the button to resume the game from pause
const RESTART_LEVEL_BUTTON_ID = "restartLevelButton"; // ID of the button to restart the current level
const MAIN_MENU_BUTTON_ID = "mainMenuButton"; // ID of the button to go back to the main menu
const GAME_OVER_SCREEN_ID = "gameOverScreen"; // ID of the game over screen
const FINAL_SCORE_DISPLAY_ID = "finalScore"; // ID of the element displaying the final score
const PLAY_AGAIN_BUTTON_ID = "playAgainButton"; // ID of the button to play the game again after game over
const BACK_TO_MENU_BUTTON_ID = "backToMenuButton"; // ID of the button to go back to the main menu after game over

// Game settings - Constants that define the behavior and appearance of game elements
const PLAYER_WIDTH = 25; // Width of the player cube
const PLAYER_HEIGHT = 25; // Height of the player cube
const PLAYER_COLOR = "#00bfff"; // Color of the player cube
const PLAYER_INITIAL_JUMP_STRENGTH = -15; // Initial vertical velocity applied when the player jumps (negative value goes upwards)
const PLAYER_GRAVITY = 0.5; // Downward acceleration applied to the player
const PLAYER_GROUND_SPEED = 4; // Horizontal movement speed of the player when on the ground
const PLAYER_AIR_SPEED = 2; // Horizontal movement speed of the player when in the air
const PLAYER_FLIGHT_FORCE = -0.5; // Upward force applied when the player holds the spacebar during a jump
const PLAYER_FLIGHT_DECAY = 0.01; // Rate at which the flight force decreases over time
const PLAYER_MAX_UPWARD_VELOCITY = -12; // Maximum upward speed the player can achieve during flight
const PLAYER_FLIGHT_HEIGHT_REACHED_THRESHOLD = 5; // Small threshold to determine when the player has reached near the peak of their jump for flight behavior
const JUMP_TOLERANCE = 2; // Small value to help detect if the player is close enough to a platform to land

const PLATFORM_COLOR = "#3cb371"; // Color of the platforms the player can jump on
const OBSTACLE_COLOR = "#ff6347"; // Color of the obstacles the player must avoid
const BONUS_ITEM_COLOR = "#ffd700"; // Color of the bonus items the player can collect
const BONUS_ITEM_RADIUS = 12; // Radius of the circular bonus items
const BONUS_ITEM_SCORE = 15; // Score awarded when a bonus item is collected
const PORTAL_COLOR = "#8a2be2"; // Color of the portal that leads to the next level

const INITIAL_LIVES = 3; // Starting number of lives the player has
const INITIAL_LEVEL = 1; // Starting level of the game
const INITIAL_SCORE = 0; // Initial score of the player

// Get DOM elements - References to HTML elements used to interact with the game
const canvas = document.getElementById(CANVAS_ID); // The main drawing area for the game
const ctx = canvas.getContext("2d"); // 2D rendering context for the canvas
const scoreDisplay = document.getElementById(SCORE_DISPLAY_ID); // Element to display the current score
const livesDisplay = document.getElementById(LIVES_DISPLAY_ID); // Element to display the remaining lives
const menu = document.getElementById(MENU_ID); // The main menu screen element
const startButton = document.getElementById(START_BUTTON_ID); // Button to start the game
const restartButton = document.getElementById(RESTART_BUTTON_ID); // Button to restart the entire game
const pauseScreen = document.getElementById(PAUSE_SCREEN_ID); // The pause screen element
const resumeButton = document.getElementById(RESUME_BUTTON_ID); // Button to resume the game
const restartLevelButton = document.getElementById(RESTART_LEVEL_BUTTON_ID); // Button to restart the current level
const mainMenuButton = document.getElementById(MAIN_MENU_BUTTON_ID); // Button to return to the main menu
const gameOverScreen = document.getElementById(GAME_OVER_SCREEN_ID); // The game over screen element
const finalScoreDisplay = document.getElementById(FINAL_SCORE_DISPLAY_ID); // Element to display the final score
const playAgainButton = document.getElementById(PLAY_AGAIN_BUTTON_ID); // Button to play again after game over
const backToMenuButton = document.getElementById(BACK_TO_MENU_BUTTON_ID); // Button to go back to the main menu after game over

// Base class for all game objects - Provides a common structure for objects in the game
class GameObject {
  constructor(x, y, width, height, color) {
    // Assign properties to the game object
    Object.assign(this, { x, y, width, height, color });
  }
  // Method to draw the game object on the canvas
  draw = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  };
  // Method to check if this game object is colliding with another game object
  checkCollision = (other) =>
    this.x < other.x + other.width &&
    this.x + this.width > other.x &&
    this.y < other.y + other.height &&
    this.y + this.height > other.y;
}

// Player class - Represents the player-controlled character in the game
class Player extends GameObject {
  constructor(x, y) {
    super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
    this.velocityX = 0; // Horizontal velocity of the player
    this.velocityY = 0; // Vertical velocity of the player
    this.isJumping = false; // Flag indicating if the player is currently jumping
    this.jumpStrength = PLAYER_INITIAL_JUMP_STRENGTH; // Initial jump force
    this.gravity = PLAYER_GRAVITY; // Force pulling the player downwards
    this.groundSpeed = PLAYER_GROUND_SPEED; // Speed on the ground
    this.airSpeed = PLAYER_AIR_SPEED; // Speed in the air
    this.flightForce = PLAYER_FLIGHT_FORCE; // Upward force during flight
    this.flightDecay = PLAYER_FLIGHT_DECAY; // Rate at which flight force decreases
    this.maxUpwardVelocity = PLAYER_MAX_UPWARD_VELOCITY; // Maximum upward speed during flight
    this.initialJumpHeight = 0; // Height at which the jump started
    this.peakJumpHeight = 0; // Highest point reached during the jump
    this.isOnGround = false; // Flag indicating if the player is currently touching the ground
  }
  // Update the player's position and state
  update = () => {
    this.velocityY += this.gravity; // Apply gravity
    this.x += this.velocityX; // Move horizontally
    this.y += this.velocityY; // Move vertically
    this.constrainToBounds(); // Keep the player within the game boundaries

    // Update peak jump height
    if (this.isJumping && this.velocityY < 0 && this.y < this.peakJumpHeight) {
      this.peakJumpHeight = this.y;
    }
  };
  // Prevent the player from going outside the canvas bounds
  constrainToBounds = () => {
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    if (this.y < 0) this.y = 0;
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.velocityY = 0;
      this.isJumping = false;
      this.flightForce = PLAYER_FLIGHT_FORCE; // Reset flight force when landing
      this.isOnGround = true;
    }
  };
  // Make the player jump
  jump = () => {
    if (!this.isJumping) {
      this.velocityY = this.jumpStrength;
      this.isJumping = true;
      this.flightForce = PLAYER_FLIGHT_FORCE; // Reset flight force on new jump
      this.initialJumpHeight = this.y;
      this.peakJumpHeight = this.y;
      this.isOnGround = false;
    }
  };
  // Apply flight mechanics when the spacebar is held during a jump
  applyFlight = () => {
    if (this.isJumping && game.keys["Space"]) {
      // Ascend while space is held and moving upwards
      if (this.velocityY < 0) {
        this.velocityY += this.flightForce;
        this.flightForce -= this.flightDecay; // Decrease flight force over time
        if (this.flightForce < -1.0) {
          this.flightForce = -1.0; // Minimum flight force
        }
        if (this.velocityY < this.maxUpwardVelocity) {
          this.velocityY = this.maxUpwardVelocity; // Limit upward velocity
        }
      }
      // Slow descent after reaching peak height
      else if (
        this.y <=
        this.peakJumpHeight + PLAYER_FLIGHT_HEIGHT_REACHED_THRESHOLD
      ) {
        this.velocityY += 0.1; // Gentle downward force
      }
    } else if (this.isJumping) {
      // Fall faster if space is released
      if (this.velocityY > 0) {
        this.velocityY += this.gravity * 1.5; // Increased gravity for faster fall
      }
    }
  };
  // Draw the player on the canvas with a gradient effect
  draw = (ctx) => {
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.width,
      this.y + this.height
    );
    gradient.addColorStop(0, this.color);
    gradient.addColorStop(1, "#0080ff");
    ctx.fillStyle = gradient;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#00cfff";
    ctx.lineWidth = 1;
    ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4);
  };
}

// Platform class - Represents solid surfaces the player can land on
class Platform extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, PLATFORM_COLOR);
  }
  // Draw the platform on the canvas with a subtle pattern
  draw = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
    ctx.strokeStyle = "#2e8b57";
    ctx.lineWidth = 2;
    for (let i = 0; i < this.width; i += 15) {
      ctx.beginPath();
      ctx.moveTo(this.x + i, this.y);
      ctx.lineTo(this.x + i, this.y + this.height);
      ctx.stroke();
    }
  };
}

// Obstacle class - Represents hazards the player must avoid
class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, OBSTACLE_COLOR);
  }
  // Draw the obstacle on the canvas with a spiky shape
  draw = (ctx) => {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width / 4, this.y);
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y);
    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y + this.height);
    ctx.lineTo(this.x + this.width / 4, this.y + this.height);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#cc5339";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 4, this.y + this.height / 4);
    ctx.lineTo(this.x + this.width / 2, this.y + this.height / 6);
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y + this.height / 4);
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y + (this.height * 3) / 4);
    ctx.lineTo(this.x + this.width / 2, this.y + (this.height * 5) / 6);
    ctx.lineTo(this.x + this.width / 4, this.y + (this.height * 3) / 4);
    ctx.closePath();
    ctx.fill();
  };
}

// Bonus item class - Collectible items that increase the player's score
class BonusItem extends GameObject {
  constructor(x, y, radius = BONUS_ITEM_RADIUS) {
    super(x - radius, y - radius, 2 * radius, 2 * radius, BONUS_ITEM_COLOR);
    this.radius = radius;
  }
  // Draw the bonus item on the canvas as a shiny coin
  draw = (ctx) => {
    const centerX = this.x + this.radius;
    const centerY = this.y + this.radius;
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      this.radius
    );
    gradient.addColorStop(0, "#ffffcc");
    gradient.addColorStop(0.7, this.color);
    gradient.addColorStop(1, "#b8860b");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(
      centerX - this.radius / 3,
      centerY - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI * 2
    );
    ctx.fill();
  };
}

// Portal class - Represents the exit to the next level
class Portal extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, PORTAL_COLOR);
  }
  // Draw the portal on the canvas with a pulsating, colorful effect
  draw = (ctx, frameCount) => {
    const centerX = this.x + this.width / 2;
    const centerY = this.y + this.height / 2;
    const radiusX = this.width / 2;
    const radiusY = this.height / 2;
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.width,
      this.y + this.height
    );
    const color1 = `hsl(${(frameCount * 2) % 360}, 70%, 50%)`; // Cycle through hues for color 1
    const color2 = `hsl(${(frameCount * 2 + 180) % 360}, 70%, 50%)`; // Cycle through hues for color 2 (opposite end of spectrum)
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#dda0dd";
    ctx.lineWidth = 2;
    ctx.ellipse(centerX, centerY, radiusX - 3, radiusY - 3, 0, 0, Math.PI * 2);
    ctx.stroke();
  };
}

// Game class - Manages the overall game state and logic
class Game {
  constructor() {
    this.player = null; // Reference to the player object
    this.platforms = []; // Array to hold platform objects
    this.obstacles = []; // Array to hold obstacle objects
    this.bonusItems = []; // Array to hold bonus item objects
    this.portal = null; // Reference to the portal object
    this.score = INITIAL_SCORE; // Current score of the player
    this.lives = INITIAL_LIVES; // Number of lives the player has
    this.level = INITIAL_LEVEL; // Current level of the game
    this.gameActive = false; // Flag indicating if the game is currently active
    this.isPaused = false; // Flag indicating if the game is paused
    this.keys = {}; // Object to track which keys are currently pressed
    this.levels = levels; // Array of level data loaded from levels.js
    this.frameCount = 0; // Counter for the number of frames rendered, used for animations
  }

  // Reset the game state to its initial values
  resetGameState = () => {
    this.score = INITIAL_SCORE;
    this.lives = INITIAL_LIVES;
    this.level = INITIAL_LEVEL;
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI(); // Update the score and lives display
    this.hideScreens(); // Hide any active game screens (menu, pause, game over)
    canvas.classList.remove("blurred"); // Remove blur effect from the canvas
  };

  // Start the game
  startGame = () => {
    this.resetGameState(); // Reset the game state
    this.loadLevel(this.level - 1); // Load the first level
    this.gameLoop(); // Start the game loop
  };

  // Restart the entire game from the beginning
  restartGame = () => {
    this.resetGameState();
    this.loadLevel(0); // Load the first level (index 0)
    this.gameLoop();
  };

  // Restart the current level
  restartLevel = () => {
    this.loadLevel(this.level - 1); // Reload the current level
    this.player.velocityX = 0; // Reset player's horizontal velocity
    this.player.velocityY = 0; // Reset player's vertical velocity
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI();
    this.hideScreens();
    canvas.classList.remove("blurred");
    this.gameLoop();
  };

  // Load a specific level from the levels data
  loadLevel = (levelIndex) => {
    const levelData = this.levels[levelIndex];
    if (!levelData) {
      this.gameOver(); // If there's no more levels, trigger game over
      return;
    }
    // Create platform objects from the level data
    this.platforms = levelData.platforms.map(
      (p) => new Platform(p.x, p.y, p.width, p.height)
    );
    // Create obstacle objects from the level data
    this.obstacles = levelData.obstacles.map(
      (o) => new Obstacle(o.x, o.y, o.width, o.height)
    );
    // Create bonus item objects from the level data
    this.bonusItems = levelData.bonusItems.map((b) => new BonusItem(b.x, b.y));
    // Create the portal object from the level data
    this.portal = new Portal(
      levelData.portal.x,
      levelData.portal.y,
      levelData.portal.width,
      levelData.portal.height
    );
    // Set the player's starting position from the level data
    const { x, y } = levelData.playerStart;
    this.player = new Player(x, y);
    this.player.velocityY = 0; // Reset player's vertical velocity on level load
  };

  // Update the score and lives displayed on the screen
  updateUI = () => {
    scoreDisplay.textContent = `Score: ${this.score}`;
    livesDisplay.textContent = `Lives: ${this.lives}`;
  };

  // Hide all game screens (menu, pause, game over)
  hideScreens = () => {
    menu.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    restartButton.classList.remove("hidden"); // Make the restart button visible during gameplay
    canvas.classList.remove("blurred");
  };

  // Show the main menu screen
  showMenu = () => {
    this.gameActive = false;
    menu.classList.remove("hidden");
    restartButton.classList.add("hidden"); // Hide the restart button on the menu
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    canvas.classList.remove("blurred");
  };

  // Pause the game
  pauseGame = () => {
    if (this.gameActive) {
      this.isPaused = true;
      pauseScreen.classList.remove("hidden");
      canvas.classList.add("blurred"); // Apply blur effect when paused
    }
  };

  // Resume the game from pause
  resumeGame = () => {
    this.isPaused = false;
    pauseScreen.classList.add("hidden");
    canvas.classList.remove("blurred");
    this.gameLoop(); // Continue the game loop
  };

  // Trigger game over sequence
  gameOver = () => {
    this.gameActive = false;
    gameOverScreen.classList.remove("hidden");
    finalScoreDisplay.textContent = `Final Score: ${this.score}`;
    restartButton.classList.add("hidden"); // Hide the restart button on game over screen
    canvas.classList.add("blurred"); // Apply blur effect on game over
  };

  // Handle player input (keyboard)
  handleInput = () => {
    let speed = this.player.groundSpeed;
    if (this.player.isJumping) {
      speed = this.player.airSpeed;
    }
    this.player.velocityX = 0; // Reset horizontal velocity each frame

    // Move left if left arrow key or 'A' is pressed
    if (this.keys["ArrowLeft"] || this.keys[37]) {
      this.player.velocityX = -speed;
    }
    // Move right if right arrow key or 'D' is pressed
    if (this.keys["ArrowRight"] || this.keys[39]) {
      this.player.velocityX = speed;
    }
  };

  // Update the game state for the current frame
  update = () => {
    if (!this.gameActive || this.isPaused) return; // Don't update if the game is not active or paused

    this.handleInput(); // Process player input

    if (this.player.isJumping) {
      this.player.applyFlight(); // Apply flight mechanics if the player is jumping
    }

    this.player.update(); // Update the player's position and state
    this.checkCollisions(); // Check for collisions between game objects
    this.checkBonusItemCollection(); // Check if the player has collected any bonus items
    this.checkPortalCollision(); // Check if the player has reached the portal
    this.checkFallOffScreen(); // Check if the player has fallen off the bottom of the screen

    this.frameCount++; // Increment the frame counter
  };

  // Check for collisions between the player and other game objects
  checkCollisions = () => {
    let onGround = false; // Flag to track if the player is currently on a platform
    this.platforms.forEach((platform) => {
      if (this.player.checkCollision(platform)) {
        // Collision with a platform from the top
        if (
          this.player.velocityY >= 0 &&
          this.player.y + this.player.height > platform.y - 1 - JUMP_TOLERANCE
        ) {
          this.player.y = platform.y - this.player.height;
          this.player.velocityY = 0;
          this.player.isJumping = false;
          this.player.isOnGround = true;
          onGround = true;
        }
        // Collision with a platform from the bottom
        else if (
          this.player.velocityY < 0 &&
          this.player.y < platform.y + platform.height
        ) {
          this.player.y = platform.y + platform.height;
          this.player.velocityY = 0;
        }
      }
    });
    this.obstacles.forEach((obstacle) => {
      if (this.player.checkCollision(obstacle)) {
        this.lives--; // Decrease player's lives on collision with an obstacle
        this.updateUI();
        if (this.lives <= 0) {
          this.gameOver(); // If no lives left, trigger game over
        } else {
          this.loadLevel(this.level - 1); // Otherwise, reload the current level
        }
      }
    });
    if (!onGround) this.player.isOnGround = false; // If not colliding with any platform, player is not on the ground
  };

  // Check if the player has collected any bonus items
  checkBonusItemCollection = () => {
    this.bonusItems = this.bonusItems.filter((bonus) => {
      if (this.player.checkCollision(bonus)) {
        this.score += BONUS_ITEM_SCORE; // Increase score
        this.updateUI();
        return false; // Remove the collected bonus item from the array
      }
      return true; // Keep the bonus item if not collected
    });
  };

  // Check if the player has reached the level exit portal
  checkPortalCollision = () => {
    if (this.portal && this.player.checkCollision(this.portal)) {
      this.level++; // Increment the level number
      this.loadLevel(this.level - 1); // Load the next level
      this.updateUI();
    }
  };

  // Check if the player has fallen off the bottom of the screen
  checkFallOffScreen = () => {
    if (this.player.y > canvas.height) {
      this.lives--; // Decrease player's lives
      this.updateUI();
      if (this.lives <= 0) {
        this.gameOver(); // Trigger game over if no lives left
      } else {
        this.loadLevel(this.level - 1); // Reload the current level
      }
    }
  };

  // Draw all game objects on the canvas
  draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas for the new frame
    this.platforms.forEach((platform) => platform.draw(ctx));
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx));
    this.bonusItems.forEach((item) => item.draw(ctx));
    this.portal?.draw(ctx, this.frameCount); // Draw the portal, if it exists
    this.player.draw(ctx);
  };

  // The main game loop, called repeatedly to update and render the game
  gameLoop = () => {
    if (!this.gameActive) return; // Stop the loop if the game is not active
    if (this.isPaused) {
      requestAnimationFrame(this.gameLoop); // Continue the loop if paused, but don't update game state
      return;
    }
    this.update(); // Update the game state
    this.draw(); // Render the game objects
    requestAnimationFrame(this.gameLoop); // Request the next frame
  };
}

let game; // Instance of the Game class

// Initialize the game
const initGame = () => {
  game = new Game(); // Create a new game instance
  game.showMenu(); // Show the main menu initially

  const startButton = document.getElementById(START_BUTTON_ID);
  startButton.addEventListener("click", game.startGame); // Start the game when the start button is clicked

  restartButton.addEventListener("click", game.restartGame); // Restart the entire game
  resumeButton.addEventListener("click", game.resumeGame); // Resume the game from pause
  restartLevelButton.addEventListener("click", game.restartLevel); // Restart the current level
  mainMenuButton.addEventListener("click", game.showMenu); // Go back to the main menu
  playAgainButton.addEventListener("click", game.restartGame); // Play again after game over
  backToMenuButton.addEventListener("click", game.showMenu); // Go back to the main menu after game over

  // Event listener for keyboard input (key down)
  document.addEventListener("keydown", (e) => {
    game.keys[e.key] = true; // Record that a key is pressed
    game.keys[e.keyCode] = true; // Also record key code for broader compatibility
    // Handle jump action on spacebar press
    if (
      (e.key === "Space" || e.keyCode === 32) &&
      game.gameActive &&
      !game.isPaused &&
      !game.player.isJumping
    ) {
      game.player.jump();
    }
    // Handle pause action on Escape key press
    if ((e.key === "Escape" || e.keyCode === 27) && game.gameActive) {
      game.pauseGame();
    }
  });

  // Event listener for keyboard input (key up)
  document.addEventListener("keyup", (e) => {
    game.keys[e.key] = false; // Record that a key is released
    game.keys[e.keyCode] = false; // Also record key code
  });
};

initGame(); // Call the function to initialize the game
