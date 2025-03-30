// Function to load game configuration from game_config.json
async function loadConfig() {
  const response = await fetch("game_config.json");
  const config = await response.json();

  // Populate input fields with general settings
  document.getElementById("gravity").value = config.gameSettings.gravity;
  document.getElementById("jumpStrength").value =
    config.gameSettings.jumpStrength;
  document.getElementById("airResistance").value =
    config.gameSettings.airResistance;
  document.getElementById("surfaceFriction").value =
    config.gameSettings.surfaceFriction;

  // Populate input fields with player settings
  document.getElementById("playerWidth").value =
    config.gameSettings.player.width;
  document.getElementById("playerHeight").value =
    config.gameSettings.player.height;
  document.getElementById("playerColor").value =
    config.gameSettings.player.color;
  document.getElementById("playerGroundSpeed").value =
    config.gameSettings.player.groundSpeed;
  document.getElementById("playerAirSpeed").value =
    config.gameSettings.player.airSpeed;
  document.getElementById("playerFlightForce").value =
    config.gameSettings.player.flightForce;
  document.getElementById("playerFlightForceReduction").value =
    config.gameSettings.player.flightForceReduction;
  document.getElementById("playerMaxUpwardVelocity").value =
    config.gameSettings.player.maxUpwardVelocity;
  document.getElementById("playerMaxFlightHeight").value =
    config.gameSettings.player.maxFlightHeight;

  // Populate input fields with other game settings
  document.getElementById("initialLives").value =
    config.gameSettings.initialLives;
  document.getElementById("bonusItemScore").value =
    config.gameSettings.bonusItemScore;
  document.getElementById("platformColor").value =
    config.gameSettings.platformColor;
  document.getElementById("obstacleColor").value =
    config.gameSettings.obstacleColor;
  document.getElementById("bonusItemColor").value =
    config.gameSettings.bonusItemColor;
  document.getElementById("bonusItemRadius").value =
    config.gameSettings.bonusItemRadius;
  document.getElementById("portalColor").value =
    config.gameSettings.portalColor;

  // Get the level editor div
  const levelEditor = document.getElementById("levelEditor");
  levelEditor.innerHTML = ""; // Clear previous content

  // Loop through each level in the configuration
  config.levels.forEach((level, index) => {
    const levelDiv = document.createElement("div");
    levelDiv.classList.add("level-config");
    levelDiv.innerHTML = `<h3>Level ${index + 1} (${level.name})</h3>`;

    // Display platforms for the current level
    if (level.platforms && level.platforms.length > 0) {
      const platformsDiv = document.createElement("div");
      platformsDiv.innerHTML = '<h4>Platforms:</h4><ul class="object-list">';
      level.platforms.forEach((platform) => {
        platformsDiv.innerHTML += `<li class="object-item">x: ${platform.x}, y: ${platform.y}, width: ${platform.width}, height: ${platform.height}</li>`;
      });
      platformsDiv.innerHTML += "</ul>";
      levelDiv.appendChild(platformsDiv);
    }

    // Display enemies for the current level
    if (level.enemies && level.enemies.length > 0) {
      const enemiesDiv = document.createElement("div");
      enemiesDiv.innerHTML = '<h4>Enemies:</h4><ul class="object-list">';
      level.enemies.forEach((enemy) => {
        enemiesDiv.innerHTML += `<li class="object-item">type: ${enemy.type}, x: ${enemy.x}, y: ${enemy.y}, width: ${enemy.width}, height: ${enemy.height}</li>`;
      });
      enemiesDiv.innerHTML += "</ul>";
      levelDiv.appendChild(enemiesDiv);
    }

    // Display bonuses for the current level
    if (level.bonuses && level.bonuses.length > 0) {
      const bonusesDiv = document.createElement("div");
      bonusesDiv.innerHTML = '<h4>Bonuses:</h4><ul class="object-list">';
      level.bonuses.forEach((bonus) => {
        bonusesDiv.innerHTML += `<li class="object-item">type: ${bonus.type}, x: ${bonus.x}, y: ${bonus.y}</li>`;
      });
      bonusesDiv.innerHTML += "</ul>";
      levelDiv.appendChild(bonusesDiv);
    }

    // Display portal for the current level
    if (level.portal) {
      const portalDiv = document.createElement("div");
      portalDiv.innerHTML = `<h4>Portal:</h4><p class="object-item">x: ${level.portal.x}, y: ${level.portal.y}, width: ${level.portal.width}, height: ${level.portal.height}</p>`;
      levelDiv.appendChild(portalDiv);
    }

    // Display player start position for the current level
    if (level.playerStart) {
      const playerStartDiv = document.createElement("div");
      playerStartDiv.innerHTML = `<h4>Player Start:</h4><p class="object-item">x: ${level.playerStart.x}, y: ${level.playerStart.y}</p>`;
      levelDiv.appendChild(playerStartDiv);
    }

    levelEditor.appendChild(levelDiv);
  });
}

// Function to save the configuration (currently logs to console)
function saveConfig() {
  const config = {
    gameSettings: {
      gravity: parseFloat(document.getElementById("gravity").value),
      jumpStrength: parseInt(document.getElementById("jumpStrength").value),
      airResistance: parseFloat(document.getElementById("airResistance").value),
      surfaceFriction: parseFloat(
        document.getElementById("surfaceFriction").value
      ),
      player: {
        width: parseInt(document.getElementById("playerWidth").value),
        height: parseInt(document.getElementById("playerHeight").value),
        color: document.getElementById("playerColor").value,
        groundSpeed: parseFloat(
          document.getElementById("playerGroundSpeed").value
        ),
        airSpeed: parseFloat(document.getElementById("playerAirSpeed").value),
        flightForce: parseFloat(
          document.getElementById("playerFlightForce").value
        ),
        flightForceReduction: parseFloat(
          document.getElementById("playerFlightForceReduction").value
        ),
        maxUpwardVelocity: parseInt(
          document.getElementById("playerMaxUpwardVelocity").value
        ),
        maxFlightHeight: parseInt(
          document.getElementById("playerMaxFlightHeight").value
        ),
      },
      initialLives: parseInt(document.getElementById("initialLives").value),
      bonusItemScore: parseInt(document.getElementById("bonusItemScore").value),
      platformColor: document.getElementById("platformColor").value,
      obstacleColor: document.getElementById("obstacleColor").value,
      bonusItemColor: document.getElementById("bonusItemColor").value,
      bonusItemRadius: parseInt(
        document.getElementById("bonusItemRadius").value
      ),
      portalColor: document.getElementById("portalColor").value,
    },
    levels: [], // In a more advanced version, you would collect level data from the UI here
  };

  // For now, just log the configuration to the console
  console.log(JSON.stringify(config, null, 2));
  alert("Configuration saved to console (for now)!");

  // In a real application, you would send this data to a server to save it
  // or implement a way to save it locally (e.g., using localStorage).
}

// Load the configuration when the page loads
loadConfig();
