export const levels = [
  // This is an array that holds the data for each level in the game.
  // Each object in the array represents a single level.
  {
    // Data for the first level (index 0)
    platforms: [
      // An array of platform objects. Each object defines a platform's position and size.
      { x: 0, y: 445, width: 200, height: 30 }, // Platform at x=0, y=445, width=200, height=30
      { x: 300, y: 350, width: 150, height: 30 }, // Platform at x=300, y=350, width=150, height=30
      { x: 550, y: 300, width: 150, height: 30 }, // Platform at x=550, y=300, width=150, height=30
      { x: 0, y: 480 - 35, width: 800, height: 35 }, // Ground level platform. y is calculated based on canvas height (480).
    ],
    obstacles: [
      // An array of obstacle objects. Each object defines an obstacle's position and size.
      { x: 350, y: 320, width: 30, height: 30 }, // Obstacle at x=350, y=320, width=30, height=30
    ],
    bonusItems: [
      // An array of bonus item objects. Each object defines a bonus item's position.
      { x: 100, y: 415 }, // Bonus item at x=100, y=415
      { x: 300, y: 350 - 25 }, // Bonus item at x=300, y=325 (y is adjusted)
      { x: 600, y: 300 - 25 }, // Bonus item at x=600, y=275 (y is adjusted)
      { x: 150, y: 350 - 25 }, // Bonus item at x=150, y=325 (y is adjusted)
    ],
    portal: {
      // An object defining the portal's position and size. The player needs to reach this to complete the level.
      x: 600, // x-coordinate of the portal
      y: 250, // y-coordinate of the portal
      width: 30, // width of the portal
      height: 40, // height of the portal
    },
    playerStart: {
      // An object defining the starting position of the player for this level.
      x: 50, // Starting x-coordinate
      y: 415, // Starting y-coordinate
    },
  },
  {
    // Data for the second level (index 1)
    platforms: [
      { x: 50, y: 400, width: 150, height: 30 },
      { x: 300, y: 350, width: 150, height: 30 },
      { x: 550, y: 300, width: 150, height: 30 },
      { x: 0, y: 480 - 35, width: 800, height: 35 }, // Ground level
    ],
    obstacles: [{ x: 350, y: 320, width: 30, height: 30 }],
    bonusItems: [
      { x: 100, y: 370 },
      { x: 300, y: 350 - 25 },
      { x: 600, y: 300 - 25 },
      { x: 150, y: 350 - 25 },
    ],
    portal: { x: 600, y: 250, width: 30, height: 40 },
    playerStart: { x: 70, y: 365 },
  },
];
