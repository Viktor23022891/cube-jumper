// "use strict";

// Імпортуємо дані рівнів (після реалізації JSON це буде видалено)
// import { levels } from "./levels.js";

// Ідентифікатори DOM-елементів
const CANVAS_ID = "gameCanvas"; // Унікальний ідентифікатор елемента <canvas>, де буде відображатися гра
const SCORE_DISPLAY_ID = "score"; // Унікальний ідентифікатор елемента, який показує поточний рахунок гравця
const LIVES_DISPLAY_ID = "lives"; // Унікальний ідентифікатор елемента, який показує кількість життів гравця
const MENU_ID = "menu"; // Унікальний ідентифікатор головного меню гри
const START_BUTTON_ID = "startButton"; // Унікальний ідентифікатор кнопки "Почати гру"
const RESTART_BUTTON_ID = "restartButton"; // Унікальний ідентифікатор кнопки для повного перезапуску гри
const PAUSE_SCREEN_ID = "pauseScreen"; // Унікальний ідентифікатор екрана паузи
const RESUME_BUTTON_ID = "resumeButton"; // Унікальний ідентифікатор кнопки "Продовжити" гру після паузи
const RESTART_LEVEL_BUTTON_ID = "restartLevelButton"; // Унікальний ідентифікатор кнопки для перезапуску поточного рівня
const MAIN_MENU_BUTTON_ID = "mainMenuButton"; // Унікальний ідентифікатор кнопки для повернення до головного меню
const GAME_OVER_SCREEN_ID = "gameOverScreen"; // Унікальний ідентифікатор екрана "Гра закінчена"
const FINAL_SCORE_DISPLAY_ID = "finalScore"; // Унікальний ідентифікатор елемента, який показує остаточний рахунок гравця після завершення гри
const PLAY_AGAIN_BUTTON_ID = "playAgainButton"; // Унікальний ідентифікатор кнопки "Грати знову" після завершення гри
const BACK_TO_MENU_BUTTON_ID = "backToMenuButton"; // Унікальний ідентифікатор кнопки для повернення до головного меню після завершення гри

// Налаштування гри - Константи, які визначають поведінку та зовнішній вигляд ігрових елементів
const PLAYER_WIDTH = 25; // Ширина кубика гравця в пікселях. Обрано невелике значення, щоб гравець не займав багато місця на екрані.
const PLAYER_HEIGHT = 25; // Висота кубика гравця в пікселях. Зазвичай дорівнює ширині для створення квадратної форми.
const PLAYER_COLOR = "#00bfff"; // Колір гравця у шістнадцятковому форматі (яскраво-блакитний). Обрано для кращої видимості на фоні.
const PLAYER_INITIAL_JUMP_STRENGTH = -15; // Початкова вертикальна швидкість, яка надається гравцю при стрибку. Від'ємне значення означає рух вгору. Значення -15 дає достатньо високий стрибок, але не надто високий.
const PLAYER_GRAVITY = 0.5; // Прискорення вниз, що діє на гравця (імітація гравітації). Значення 0.5 забезпечує реалістичне падіння.
const PLAYER_GROUND_SPEED = 4; // Горизонтальна швидкість гравця, коли він знаходиться на землі. Значення 4 дозволяє гравцю рухатися досить швидко, щоб проходити рівні, але не надто швидко, щоб втратити контроль.
const PLAYER_AIR_SPEED = 2; // Горизонтальна швидкість гравця, коли він знаходиться в повітрі. Зазвичай менша за наземну, щоб ускладнити керування під час стрибка.
const PLAYER_FLIGHT_FORCE = -0.5; // Сила, що штовхає гравця вгору, коли він утримує пробіл під час стрибка (імітація польоту). Невелике від'ємне значення дозволяє повільно підніматися.
const PLAYER_FLIGHT_DECAY = 0.01; // Швидкість, з якою зменшується сила польоту з часом. Невелике значення забезпечує поступове зниження підйомної сили.
const PLAYER_MAX_UPWARD_VELOCITY = -12; // Максимальна швидкість гравця вгору під час польоту. Обмежує швидкість підйому, щоб гра не виглядала нереалістично.
const PLAYER_FLIGHT_HEIGHT_REACHED_THRESHOLD = 5; // Невеликий поріг для визначення, коли гравець майже досяг вершини стрибка для початку фази польоту. Допомагає плавно переходити між стрибком і польотом.
const JUMP_TOLERANCE = 2; // Невелике значення, щоб допомогти визначити, чи гравець достатньо близько до платформи для приземлення. Використовується для більш точного визначення зіткнень.

const PLATFORM_COLOR = "#3cb371"; // Колір платформ, на які може стрибати гравець (зелений). Обрано для контрасту з гравцем та перешкодами.
const OBSTACLE_COLOR = "#ff6347"; // Колір перешкод, яких гравець повинен уникати (червоний). Червоний колір часто асоціюється з небезпекою.
const BONUS_ITEM_COLOR = "#ffd700"; // Колір бонусних предметів, які гравець може збирати (золотий). Золотий колір асоціюється з цінністю.
const BONUS_ITEM_RADIUS = 12; // Радіус круглих бонусних предметів у пікселях. Невеликий розмір, щоб не відволікати, але достатньо великий, щоб бути помітним.
const BONUS_ITEM_SCORE = 15; // Кількість очок, які нараховуються гравцю при зборі бонусного предмета. Обрано як помірну винагороду.
const PORTAL_COLOR = "#8a2be2"; // Колір порталу, який веде на наступний рівень (фіолетовий). Часто використовується для позначення магічних або особливих місць.

const INITIAL_LIVES = 3; // Початкова кількість життів гравця. Три життя - стандартна кількість для багатьох ігор, забезпечує певний рівень складності.
const INITIAL_LEVEL = 1; // Початковий рівень гри.
const INITIAL_SCORE = 0; // Початковий рахунок гравця.

// Отримуємо DOM-елементи - Посилання на HTML-елементи, які використовуються для взаємодії з грою
const canvas = document.getElementById(CANVAS_ID); // Основна область для малювання гри
const ctx = canvas.getContext("2d"); // Двовимірний контекст рендерингу для canvas, використовується для малювання фігур, тексту тощо.
const scoreDisplay = document.getElementById(SCORE_DISPLAY_ID); // Елемент для відображення поточного рахунку
const livesDisplay = document.getElementById(LIVES_DISPLAY_ID); // Елемент для відображення кількості життів
const menu = document.getElementById(MENU_ID); // Елемент головного меню
const startButton = document.getElementById(START_BUTTON_ID); // Кнопка для початку гри
const restartButton = document.getElementById(RESTART_BUTTON_ID); // Кнопка для перезапуску всієї гри
const pauseScreen = document.getElementById(PAUSE_SCREEN_ID); // Елемент екрана паузи
const resumeButton = document.getElementById(RESUME_BUTTON_ID); // Кнопка для продовження гри
const restartLevelButton = document.getElementById(RESTART_LEVEL_BUTTON_ID); // Кнопка для перезапуску поточного рівня
const mainMenuButton = document.getElementById(MAIN_MENU_BUTTON_ID); // Кнопка для повернення в головне меню
const gameOverScreen = document.getElementById(GAME_OVER_SCREEN_ID); // Елемент екрана "Гра закінчена"
const finalScoreDisplay = document.getElementById(FINAL_SCORE_DISPLAY_ID); // Елемент для відображення остаточного рахунку
const playAgainButton = document.getElementById(PLAY_AGAIN_BUTTON_ID); // Кнопка для повторного запуску гри після її завершення
const backToMenuButton = document.getElementById(BACK_TO_MENU_BUTTON_ID); // Кнопка для повернення в головне меню після завершення гри

// Базовий клас для всіх ігрових об'єктів - Забезпечує загальну структуру для об'єктів у грі
class GameObject {
  constructor(x, y, width, height, color) {
    // Присвоюємо властивості ігровому об'єкту
    Object.assign(this, { x, y, width, height, color });
    // Метод Object.assign копіює значення всіх власних перелічуваних властивостей з одного або більше вихідних об'єктів до цільового об'єкта.
    // В даному випадку, він копіює властивості x, y, width, height та color безпосередньо до створеного об'єкта GameObject.
  }
  // Метод для малювання ігрового об'єкта на canvas
  draw = (ctx) => {
    ctx.fillStyle = this.color; // Встановлюємо колір заливки для об'єкта
    ctx.fillRect(this.x, this.y, this.width, this.height); // Малюємо заповнений прямокутник на заданих координатах (x, y) з заданою шириною та висотою.
  };
  // Метод для перевірки, чи цей ігровий об'єкт зіштовхується з іншим ігровим об'єктом
  checkCollision = (other) =>
    this.x < other.x + other.width &&
    this.x + this.width > other.x &&
    this.y < other.y + other.height &&
    this.y + this.height > other.y;
  // Ця умова перевіряє, чи перетинаються два прямокутники.
  // Перша частина (this.x < other.x + other.width) перевіряє, чи ліва сторона цього об'єкта знаходиться лівіше за праву сторону іншого об'єкта.
  // Друга частина (this.x + this.width > other.x) перевіряє, чи права сторона цього об'єкта знаходиться правіше за ліву сторону іншого об'єкта.
  // Третя частина (this.y < other.y + other.height) перевіряє, чи верхня сторона цього об'єкта знаходиться вище за нижню сторону іншого об'єкта.
  // Четверта частина (this.y + this.height > other.y) перевіряє, чи нижня сторона цього об'єкта знаходиться нижче за верхню сторону іншого об'єкта.
  // Якщо всі чотири умови є істинними, значить об'єкти перетинаються, тобто відбулося зіткнення.
}

// Клас гравця - Представляє керованого гравцем персонажа в грі
class Player extends GameObject {
  constructor(x, y) {
    super(x, y, PLAYER_WIDTH, PLAYER_HEIGHT, PLAYER_COLOR);
    this.velocityX = 0; // Горизонтальна швидкість гравця (пікселів за кадр)
    this.velocityY = 0; // Вертикальна швидкість гравця (пікселів за кадр)
    this.isJumping = false; // Прапорець, що вказує, чи гравець зараз стрибає
    this.jumpStrength = PLAYER_INITIAL_JUMP_STRENGTH; // Початкова сила стрибка (вертикальна швидкість вгору)
    this.gravity = PLAYER_GRAVITY; // Сила, що тягне гравця вниз (прискорення)
    this.groundSpeed = PLAYER_GROUND_SPEED; // Швидкість руху по землі
    this.airSpeed = PLAYER_AIR_SPEED; // Швидкість руху в повітрі
    this.flightForce = PLAYER_FLIGHT_FORCE; // Сила, що піднімає гравця вгору під час "польоту" (утримання пробілу)
    this.flightDecay = PLAYER_FLIGHT_DECAY; // Швидкість, з якою зменшується сила польоту
    this.maxUpwardVelocity = PLAYER_MAX_UPWARD_VELOCITY; // Максимальна швидкість гравця вгору під час польоту
    this.initialJumpHeight = 0; // Висота, на якій почався стрибок
    this.peakJumpHeight = 0; // Найвища точка, досягнута під час стрибка
    this.isOnGround = false; // Прапорець, що вказує, чи гравець зараз торкається землі
  }
  // Оновлюємо позицію та стан гравця на кожному кадрі гри
  update = () => {
    this.velocityY += this.gravity; // Застосовуємо силу тяжіння, збільшуючи вертикальну швидкість вниз
    this.x += this.velocityX; // Переміщуємо гравця по горизонталі на основі його горизонтальної швидкості
    this.y += this.velocityY; // Переміщуємо гравця по вертикалі на основі його вертикальної швидкості
    this.constrainToBounds(); // Перевіряємо, чи гравець не вийшов за межі ігрового поля

    // Оновлюємо найвищу точку стрибка
    if (this.isJumping && this.velocityY < 0 && this.y < this.peakJumpHeight) {
      this.peakJumpHeight = this.y;
      // Якщо гравець все ще стрибає, його вертикальна швидкість від'ємна (рух вгору), і його поточна висота менша за попередню найвищу точку,
      // то ми оновлюємо найвищу точку стрибка до поточної висоти.
    }
  };
  // Забороняємо гравцю виходити за межі canvas
  constrainToBounds = () => {
    if (this.x < 0) this.x = 0; // Якщо гравець вийшов за ліву межу, повертаємо його назад
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width; // Якщо гравець вийшов за праву межу, повертаємо його назад
    if (this.y < 0) this.y = 0; // Якщо гравець вийшов за верхню межу, повертаємо його назад
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height; // Якщо гравець впав нижче нижньої межі, встановлюємо його на рівень землі
      this.velocityY = 0; // Зупиняємо вертикальну швидкість
      this.isJumping = false; // Вказуємо, що гравець більше не стрибає
      this.flightForce = PLAYER_FLIGHT_FORCE; // Скидаємо силу польоту при приземленні
      this.isOnGround = true; // Вказуємо, що гравець знову на землі
    }
  };
  // Змушуємо гравця стрибнути
  jump = () => {
    if (!this.isJumping) {
      this.velocityY = this.jumpStrength; // Надаємо гравцю початкову вертикальну швидкість вгору
      this.isJumping = true; // Вказуємо, що гравець почав стрибок
      this.flightForce = PLAYER_FLIGHT_FORCE; // Скидаємо силу польоту при новому стрибку
      this.initialJumpHeight = this.y; // Запам'ятовуємо початкову висоту стрибка
      this.peakJumpHeight = this.y; // Початково вважаємо поточну висоту найвищою точкою
      this.isOnGround = false; // Гравець більше не на землі
    }
  };
  // Застосовуємо механіку польоту, коли пробіл утримується під час стрибка
  applyFlight = () => {
    if (this.isJumping && game.keys["Space"]) {
      // Піднімаємося, поки утримується пробіл і гравець рухається вгору
      if (this.velocityY < 0) {
        this.velocityY += this.flightForce; // Додаємо до вертикальної швидкості силу польоту (яка є від'ємною, тобто штовхає вгору)
        this.flightForce -= this.flightDecay; // Зменшуємо силу польоту з часом
        if (this.flightForce < -1.0) {
          this.flightForce = -1.0; // Встановлюємо мінімальне значення сили польоту, щоб запобігти її надмірному зменшенню
        }
        if (this.velocityY < this.maxUpwardVelocity) {
          this.velocityY = this.maxUpwardVelocity; // Обмежуємо максимальну швидкість підйому
        }
      }
      // Уповільнюємо спуск після досягнення найвищої точки
      else if (
        this.y <=
        this.peakJumpHeight + PLAYER_FLIGHT_HEIGHT_REACHED_THRESHOLD
      ) {
        this.velocityY += 0.1; // Додаємо невелику силу вниз, щоб уповільнити спуск
      }
    } else if (this.isJumping) {
      // Швидше падаємо, якщо пробіл відпущено
      if (this.velocityY > 0) {
        this.velocityY += this.gravity * 1.5; // Збільшуємо силу тяжіння, щоб гравець швидше падав
      }
    }
  };
  // Малюємо гравця на canvas з ефектом градієнта
  draw = (ctx) => {
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.width,
      this.y + this.height
    ); // Створюємо лінійний градієнт, що йде зліва зверху вправо вниз об'єкта
    gradient.addColorStop(0, this.color); // Початковий колір градієнта (верхній лівий кут)
    gradient.addColorStop(1, "#0080ff"); // Кінцевий колір градієнта (нижній правий кут)
    ctx.fillStyle = gradient; // Встановлюємо градієнт як колір заливки
    ctx.fillRect(this.x, this.y, this.width, this.height); // Малюємо заповнений прямокутник з градієнтною заливкою
    ctx.strokeStyle = "#00cfff"; // Встановлюємо колір обводки
    ctx.lineWidth = 1; // Встановлюємо товщину обводки
    ctx.strokeRect(this.x + 2, this.y + 2, this.width - 4, this.height - 4); // Малюємо обводку всередині прямокутника, створюючи ефект внутрішньої рамки
  };
}

// Клас платформи - Представляє тверді поверхні, на які може приземлитися гравець
class Platform extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, PLATFORM_COLOR);
  }
  // Малюємо платформу на canvas з ледь помітним візерунком
  draw = (ctx) => {
    ctx.fillStyle = this.color; // Встановлюємо колір заливки платформи
    ctx.fillRect(this.x, this.y, this.width, this.height); // Малюємо заповнений прямокутник для платформи
    ctx.strokeStyle = "#2e8b57"; // Встановлюємо колір ліній візерунка
    ctx.lineWidth = 2; // Встановлюємо товщину ліній візерунка
    for (let i = 0; i < this.width; i += 15) {
      ctx.beginPath(); // Починаємо новий шлях для малювання
      ctx.moveTo(this.x + i, this.y); // Переміщуємо "олівець" на початок лінії (верхня точка)
      ctx.lineTo(this.x + i, this.y + this.height); // Проводимо лінію до кінцевої точки (нижня точка)
      ctx.stroke(); // Малюємо лінію
    }
    // Цей цикл створює вертикальні лінії на платформі через кожні 15 пікселів, додаючи візуальний ефект.
  };
}

// Клас перешкоди - Представляє небезпеки, яких гравець повинен уникати
class Obstacle extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, OBSTACLE_COLOR);
  }
  // Малюємо перешкоду на canvas у вигляді шипастої фігури
  draw = (ctx) => {
    ctx.fillStyle = this.color; // Встановлюємо колір заливки перешкоди
    ctx.beginPath(); // Починаємо новий шлях для малювання
    ctx.moveTo(this.x, this.y + this.height / 2); // Переміщуємо "олівець" до середини лівої сторони
    ctx.lineTo(this.x + this.width / 4, this.y); // Проводимо лінію до верхньої точки зліва
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y); // Проводимо лінію до верхньої точки справа
    ctx.lineTo(this.x + this.width, this.y + this.height / 2); // Проводимо лінію до середини правої сторони
    ctx.lineTo(this.x + (this.width * 3) / 4, this.y + this.height); // Проводимо лінію до нижньої точки справа
    ctx.lineTo(this.x + this.width / 4, this.y + this.height); // Проводимо лінію до нижньої точки зліва
    ctx.closePath(); // Замикаємо шлях, з'єднуючи останню точку з початковою
    ctx.fill(); // Заповнюємо фігуру кольором

    // Додаємо внутрішній візерунок для більшої деталізації
    ctx.fillStyle = "#cc5339"; // Встановлюємо інший відтінок червоного для внутрішнього візерунка
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

// Клас бонусного предмета - Предмети для збору, які збільшують рахунок гравця
class BonusItem extends GameObject {
  constructor(x, y, radius = BONUS_ITEM_RADIUS) {
    super(x - radius, y - radius, 2 * radius, 2 * radius, BONUS_ITEM_COLOR);
    this.radius = radius; // Зберігаємо радіус для використання при малюванні
  }
  // Малюємо бонусний предмет на canvas у вигляді блискучої монети
  draw = (ctx) => {
    const centerX = this.x + this.radius; // Обчислюємо координату X центру кола
    const centerY = this.y + this.radius; // Обчислюємо координату Y центру кола
    const gradient = ctx.createRadialGradient(
      centerX,
      centerY,
      0,
      centerX,
      centerY,
      this.radius
    ); // Створюємо радіальний градієнт (коловий), що йде від центру до країв
    gradient.addColorStop(0, "#ffffcc"); // Початковий колір градієнта (центр - світло-жовтий)
    gradient.addColorStop(0.7, this.color); // Середній колір градієнта (основний колір бонусного предмета - золотий)
    gradient.addColorStop(1, "#b8860b"); // Кінцевий колір градієнта (край - темно-золотий)
    ctx.fillStyle = gradient; // Встановлюємо градієнт як колір заливки
    ctx.beginPath(); // Починаємо новий шлях для малювання
    ctx.arc(centerX, centerY, this.radius, 0, Math.PI * 2); // Малюємо коло (дугу) з центром у (centerX, centerY), радіусом this.radius, від 0 до 360 градусів (повне коло)
    ctx.fill(); // Заповнюємо коло градієнтом

    // Додаємо відблиск для ефекту блиску
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)"; // Білий колір з 50% прозорістю
    ctx.beginPath();
    ctx.arc(
      centerX - this.radius / 3,
      centerY - this.radius / 3,
      this.radius / 4,
      0,
      Math.PI * 2
    ); // Малюємо менше коло для відблиску у верхній лівій частині
    ctx.fill();
  };
}

// Клас порталу - Представляє вихід на наступний рівень
class Portal extends GameObject {
  constructor(x, y, width, height) {
    super(x, y, width, height, PORTAL_COLOR);
  }
  // Малюємо портал на canvas з пульсуючим, кольоровим ефектом
  draw = (ctx, frameCount) => {
    const centerX = this.x + this.width / 2; // Обчислюємо координату X центру порталу
    const centerY = this.y + this.height / 2; // Обчислюємо координату Y центру порталу
    const radiusX = this.width / 2; // Обчислюємо горизонтальний радіус еліпса
    const radiusY = this.height / 2; // Обчислюємо вертикальний радіус еліпса
    const gradient = ctx.createLinearGradient(
      this.x,
      this.y,
      this.x + this.width,
      this.y + this.height
    ); // Створюємо лінійний градієнт для порталу
    const color1 = `hsl(${(frameCount * 2) % 360}, 70%, 50%)`; // Генеруємо перший колір градієнта, змінюючи відтінок залежно від номера кадру (створює ефект пульсації)
    const color2 = `hsl(${(frameCount * 2 + 180) % 360}, 70%, 50%)`; // Генеруємо другий колір градієнта, протилежний першому на колірному колі
    gradient.addColorStop(0, color1); // Встановлюємо перший колір на початку градієнта
    gradient.addColorStop(1, color2); // Встановлюємо другий колір в кінці градієнта
    ctx.fillStyle = gradient; // Встановлюємо градієнт як колір заливки
    ctx.beginPath(); // Починаємо новий шлях для малювання
    ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2); // Малюємо еліпс (основу порталу)
    // Параметри: (центр X, центр Y, радіус по X, радіус по Y, кут повороту, початковий кут, кінцевий кут)
    ctx.fill(); // Заповнюємо еліпс градієнтом
    ctx.strokeStyle = "#dda0dd"; // Встановлюємо колір обводки
    ctx.lineWidth = 2; // Встановлюємо товщину обводки
    ctx.ellipse(centerX, centerY, radiusX - 3, radiusY - 3, 0, 0, Math.PI * 2); // Малюємо внутрішній еліпс для візуального ефекту
    ctx.stroke(); // Малюємо обводку
  };
}

// Клас гри - Керує загальним станом та логікою гри
class Game {
  constructor() {
    this.player = null; // Посилання на об'єкт гравця
    this.platforms = []; // Масив для зберігання об'єктів платформ
    this.obstacles = []; // Масив для зберігання об'єктів перешкод
    this.bonusItems = []; // Масив для зберігання об'єктів бонусних предметів
    this.portal = null; // Посилання на об'єкт порталу
    this.score = INITIAL_SCORE; // Поточний рахунок гравця
    this.lives = INITIAL_LIVES; // Кількість життів гравця
    this.level = INITIAL_LEVEL; // Поточний рівень гри
    this.gameActive = false; // Прапорець, що вказує, чи гра зараз активна
    this.isPaused = false; // Прапорець, що вказує, чи гра на паузі
    this.keys = {}; // Об'єкт для відстеження натиснутих клавіш
    this.levelsData = null; // Тут будуть зберігатися дані рівнів, завантажені з JSON
    this.frameCount = 0; // Лічильник кількості відмальованих кадрів, використовується для анімацій
  }

  // Скидаємо стан гри до початкових значень
  resetGameState = () => {
    this.score = INITIAL_SCORE; // Встановлюємо початковий рахунок
    this.lives = INITIAL_LIVES; // Встановлюємо початкову кількість життів
    this.level = INITIAL_LEVEL; // Встановлюємо початковий рівень
    this.gameActive = true; // Гра стає активною
    this.isPaused = false; // Гра не на паузі
    this.updateUI(); // Оновлюємо відображення рахунку та життів на екрані
    this.hideScreens(); // Ховаємо всі активні екрани (меню, паузу, кінець гри)
    canvas.classList.remove("blurred"); // Знімаємо ефект розмиття з canvas
  };

  /**
   * Завантажує дані рівнів з JSON-файлу "levels.json".
   *
   * Файл "levels.json" повинен бути масивом об'єктів рівнів. Кожен об'єкт рівня
   * визначає розташування та елементи одного ігрового рівня.
   *
   * Приклад структури "levels.json":
   * [
   * { // Представляє один рівень
   * "platforms": [ // Масив об'єктів платформ
   * { "x": number, "y": number, "width": number, "height": number },
   * // ... інші платформи ...
   * ],
   * "obstacles": [ // Масив об'єктів перешкод
   * { "x": number, "y": number, "width": number, "height": number },
   * // ... інші перешкоди ...
   * ],
   * "bonusItems": [ // Масив об'єктів бонусних предметів
   * { "x": number, "y": number },
   * // ... інші бонусні предмети ...
   * ],
   * "portal": { // Об'єкт, що визначає портал
   * "x": number,
   * "y": number,
   * "width": number,
   * "height": number
   * },
   * "playerStart": { // Об'єкт, що визначає початкову позицію гравця
   * "x": number,
   * "y": number
   * }
   * },
   * // ... інші рівні ...
   * ]
   *
   * Цей метод використовує API 'fetch' для асинхронного завантаження JSON-файлу
   * і потім розбирає JSON-дані в об'єкт JavaScript, який зберігається в 'this.levelsData'.
   * JSON (JavaScript Object Notation) - це легкий формат обміну даними, який легко
   * читається і пишеться людьми, а також легко обробляється машинами.
   */
  loadLevelsJSON = async () => {
    try {
      const response = await fetch("levels.json"); // Використовуємо fetch для завантаження JSON-файлу
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      this.levelsData = await response.json(); // Розбираємо JSON-відповідь в об'єкт JavaScript
    } catch (error) {
      console.error("Could not load levels:", error);
      // Тут можна додати обробку помилок, наприклад, показати повідомлення користувачеві
    }
  };

  // Починаємо гру
  startGame = async () => {
    await this.loadLevelsJSON(); // Спочатку завантажуємо дані рівнів
    if (this.levelsData) {
      this.resetGameState(); // Скидаємо стан гри
      this.loadLevel(this.level - 1); // Завантажуємо перший рівень (індекс 0)
      this.gameLoop(); // Запускаємо ігровий цикл
    } else {
      console.error("Game cannot start: Levels data failed to load.");
      // Можна відобразити повідомлення про помилку на екрані
    }
  };

  // Перезапускаємо всю гру з початку
  restartGame = () => {
    this.resetGameState();
    this.loadLevel(0); // Завантажуємо перший рівень (індекс 0)
    this.gameLoop();
  };

  // Перезапускаємо поточний рівень
  restartLevel = () => {
    this.loadLevel(this.level - 1); // Перезавантажуємо поточний рівень
    this.player.velocityX = 0; // Скидаємо горизонтальну швидкість гравця
    this.player.velocityY = 0; // Скидаємо вертикальну швидкість гравця
    this.gameActive = true;
    this.isPaused = false;
    this.updateUI();
    this.hideScreens();
    canvas.classList.remove("blurred");
    this.gameLoop();
  };

  // Завантажуємо конкретний рівень з даних рівнів
  loadLevel = (levelIndex) => {
    if (!this.levelsData || !this.levelsData[levelIndex]) {
      this.gameOver(); // Якщо більше немає рівнів, викликаємо закінчення гри
      return;
    }
    const levelData = this.levelsData[levelIndex];
    // Створюємо об'єкти платформ на основі даних рівня
    this.platforms = levelData.platforms.map(
      (p) => new Platform(p.x, p.y, p.width, p.height)
    );
    // Створюємо об'єкти перешкод на основі даних рівня
    this.obstacles = levelData.obstacles.map(
      (o) => new Obstacle(o.x, o.y, o.width, o.height)
    );
    // Створюємо об'єкти бонусних предметів на основі даних рівня
    this.bonusItems = levelData.bonusItems.map((b) => new BonusItem(b.x, b.y));
    // Створюємо об'єкт порталу на основі даних рівня
    this.portal = new Portal(
      levelData.portal.x,
      levelData.portal.y,
      levelData.portal.width,
      levelData.portal.height
    );
    // Встановлюємо початкову позицію гравця на основі даних рівня
    const { x, y } = levelData.playerStart;
    this.player = new Player(x, y);
    this.player.velocityY = 0; // Скидаємо вертикальну швидкість гравця при завантаженні рівня
  };

  // Оновлюємо відображення рахунку та життів на екрані
  updateUI = () => {
    scoreDisplay.textContent = `Рахунок: ${this.score}`;
    livesDisplay.textContent = `Життя: ${this.lives}`;
  };

  // Ховаємо всі ігрові екрани (меню, паузу, кінець гри)
  hideScreens = () => {
    menu.classList.add("hidden");
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    restartButton.classList.remove("hidden"); // Робимо кнопку перезапуску видимою під час гри
    canvas.classList.remove("blurred");
  };

  // Показуємо головне меню
  showMenu = () => {
    this.gameActive = false;
    menu.classList.remove("hidden");
    restartButton.classList.add("hidden"); // Ховаємо кнопку перезапуску в меню
    pauseScreen.classList.add("hidden");
    gameOverScreen.classList.add("hidden");
    canvas.classList.remove("blurred");
  };

  // Ставимо гру на паузу
  pauseGame = () => {
    if (this.gameActive) {
      this.isPaused = true;
      pauseScreen.classList.remove("hidden");
      canvas.classList.add("blurred"); // Застосовуємо ефект розмиття під час паузи
    }
  };

  // Продовжуємо гру після паузи
  resumeGame = () => {
    this.isPaused = false;
    pauseScreen.classList.add("hidden");
    canvas.classList.remove("blurred");
    this.gameLoop(); // Продовжуємо ігровий цикл
  };

  // Викликаємо послідовність дій при закінченні гри
  gameOver = () => {
    this.gameActive = false;
    gameOverScreen.classList.remove("hidden");
    finalScoreDisplay.textContent = `Фінальний рахунок: ${this.score}`;
    restartButton.classList.add("hidden"); // Ховаємо кнопку перезапуску на екрані "Гра закінчена"
    canvas.classList.add("blurred"); // Застосовуємо ефект розмиття на екрані "Гра закінчена"
  };

  // Обробляємо введення гравця (клавіатура)
  handleInput = () => {
    let speed = this.player.groundSpeed; // Початково встановлюємо швидкість як наземну
    if (this.player.isJumping) {
      speed = this.player.airSpeed; // Якщо гравець стрибає, використовуємо повітряну швидкість
    }
    this.player.velocityX = 0; // Скидаємо горизонтальну швидкість на кожному кадрі, щоб запобігти нескінченному руху

    // Рухаємося вліво, якщо натиснута клавіша "стрілка вліво" або "A"
    if (this.keys["ArrowLeft"] || this.keys[37]) {
      this.player.velocityX = -speed; // Встановлюємо від'ємну горизонтальну швидкість для руху вліво
    }
    // Рухаємося вправо, якщо натиснута клавіша "стрілка вправо" або "D"
    if (this.keys["ArrowRight"] || this.keys[39]) {
      this.player.velocityX = speed; // Встановлюємо додатну горизонтальну швидкість для руху вправо
    }
  };

  // Оновлюємо стан гри для поточного кадру
  update = () => {
    if (!this.gameActive || this.isPaused) return; // Не оновлюємо гру, якщо вона не активна або на паузі

    this.handleInput(); // Обробляємо введення гравця

    if (this.player.isJumping) {
      this.player.applyFlight(); // Застосовуємо механіку польоту, якщо гравець стрибає
    }

    this.player.update(); // Оновлюємо позицію та стан гравця
    this.checkCollisions(); // Перевіряємо зіткнення між ігровими об'єктами
    this.checkBonusItemCollection(); // Перевіряємо, чи гравець зібрав якісь бонусні предмети
    this.checkPortalCollision(); // Перевіряємо, чи гравець досяг порталу
    this.checkFallOffScreen(); // Перевіряємо, чи гравець не впав за нижню межу екрана

    this.frameCount++; // Збільшуємо лічильник кадрів
  };

  // Перевіряємо зіткнення між гравцем та іншими ігровими об'єктами
  checkCollisions = () => {
    let onGround = false; // Прапорець, що вказує, чи гравець зараз на платформі
    this.platforms.forEach((platform) => {
      if (this.player.checkCollision(platform)) {
        // Зіткнення з платформою зверху
        if (
          this.player.velocityY >= 0 &&
          this.player.y + this.player.height > platform.y - 1 - JUMP_TOLERANCE
        ) {
          // Перевіряємо, чи гравець рухається вниз або стоїть на місці, і чи його нижня частина знаходиться трохи нижче верхньої частини платформи.
          // Додаємо JUMP_TOLERANCE для більш м'якого визначення приземлення.
          this.player.y = platform.y - this.player.height; // Встановлюємо гравця прямо над платформою
          this.player.velocityY = 0; // Зупиняємо вертикальну швидкість
          this.player.isJumping = false; // Вказуємо, що гравець більше не стрибає
          this.player.isOnGround = true; // Вказуємо, що гравець на землі
          onGround = true; // Встановлюємо прапорець, що гравець на землі
        }
        // Зіткнення з платформою знизу
        else if (
          this.player.velocityY < 0 &&
          this.player.y < platform.y + platform.height
        ) {
          // Перевіряємо, чи гравець рухається вгору, і чи його верхня частина знаходиться нижче нижньої частини платформи.
          this.player.y = platform.y + platform.height; // Встановлюємо гравця під платформою
          this.player.velocityY = 0; // Зупиняємо вертикальну швидкість
        }
      }
    });
    this.obstacles.forEach((obstacle) => {
      if (this.player.checkCollision(obstacle)) {
        this.lives--; // Зменшуємо кількість життів гравця при зіткненні з перешкодою
        this.updateUI(); // Оновлюємо відображення життів на екрані
        if (this.lives <= 0) {
          this.gameOver(); // Якщо життів не залишилося, викликаємо закінчення гри
        } else {
          this.loadLevel(this.level - 1); // Інакше перезавантажуємо поточний рівень
        }
      }
    });
    if (!onGround) this.player.isOnGround = false; // Якщо гравець не зіштовхнувся з жодною платформою, значить він не на землі
  };

  // Перевіряємо, чи гравець зібрав якісь бонусні предмети
  checkBonusItemCollection = () => {
    this.bonusItems = this.bonusItems.filter((bonus) => {
      if (this.player.checkCollision(bonus)) {
        this.score += BONUS_ITEM_SCORE; // Збільшуємо рахунок гравця
        this.updateUI(); // Оновлюємо відображення рахунку на екрані
        return false; // Видаляємо зібраний бонусний предмет з масиву
      }
      return true; // Залишаємо бонусний предмет, якщо він не був зібраний
    });
    // Метод filter створює новий масив з усіх елементів, які пройшли перевірку, задану в переданій функції.
    // В даному випадку, ми залишаємо в масиві bonusItems тільки ті предмети, з якими гравець не зіткнувся.
  };

  // Перевіряємо, чи гравець досяг порталу виходу з рівня
  checkPortalCollision = () => {
    if (this.portal && this.player.checkCollision(this.portal)) {
      this.level++; // Збільшуємо номер рівня
      this.loadLevel(this.level - 1); // Завантажуємо наступний рівень
      this.updateUI(); // Оновлюємо відображення рівня на екрані
    }
  };

  // Перевіряємо, чи гравець не впав за нижню межу екрана
  checkFallOffScreen = () => {
    if (this.player.y > canvas.height) {
      this.lives--; // Зменшуємо кількість життів гравця
      this.updateUI(); // Оновлюємо відображення життів на екрані
      if (this.lives <= 0) {
        this.gameOver(); // Якщо життів не залишилося, викликаємо закінчення гри
      } else {
        this.loadLevel(this.level - 1); // Інакше перезавантажуємо поточний рівень
      }
    }
  };

  // Малюємо всі ігрові об'єкти на canvas
  draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Очищаємо canvas для нового кадру
    this.platforms.forEach((platform) => platform.draw(ctx)); // Малюємо кожну платформу
    this.obstacles.forEach((obstacle) => obstacle.draw(ctx)); // Малюємо кожну перешкоду
    this.bonusItems.forEach((item) => item.draw(ctx)); // Малюємо кожен бонусний предмет
    this.portal?.draw(ctx, this.frameCount); // Малюємо портал, якщо він існує
    this.player.draw(ctx); // Малюємо гравця
  };

  // Основний ігровий цикл, викликається повторно для оновлення та відтворення гри
  gameLoop = () => {
    if (!this.gameActive) return; // Зупиняємо цикл, якщо гра не активна
    if (this.isPaused) {
      requestAnimationFrame(this.gameLoop); // Продовжуємо цикл, якщо гра на паузі, але не оновлюємо стан гри
      return;
    }
    this.update(); // Оновлюємо стан гри
    this.draw(); // Відтворюємо (малюємо) ігрові об'єкти
    requestAnimationFrame(this.gameLoop); // Запитуємо наступний кадр для анімації
    // requestAnimationFrame - це функція браузера, яка повідомляє браузеру, що ви хочете виконати анімацію,
    // і просить браузер викликати вказану функцію перед наступною перемальовкою.
    // Це забезпечує більш плавну анімацію та оптимізує використання ресурсів.
  };
}

let game; // Змінна для зберігання екземпляра класу Game

// Ініціалізуємо гру
const initGame = () => {
  game = new Game(); // Створюємо новий екземпляр класу Game
  game.showMenu(); // Показуємо головне меню при завантаженні гри

  const startButton = document.getElementById(START_BUTTON_ID);
  startButton.addEventListener("click", game.startGame); // Запускаємо гру при натисканні кнопки "Почати гру"

  restartButton.addEventListener("click", game.restartGame); // Перезапускаємо всю гру
  resumeButton.addEventListener("click", game.resumeGame); // Продовжуємо гру після паузи
  restartLevelButton.addEventListener("click", game.restartLevel); // Перезапускаємо поточний рівень
  mainMenuButton.addEventListener("click", game.showMenu); // Повертаємося до головного меню
  playAgainButton.addEventListener("click", game.restartGame); // Граємо знову після завершення гри
  backToMenuButton.addEventListener("click", game.showMenu); // Повертаємося до головного меню після завершення гри

  // Обробник подій для натискання клавіш на клавіатурі
  document.addEventListener("keydown", (e) => {
    game.keys[e.key] = true; // Записуємо, що клавіша натиснута (використовуємо властивість key)
    game.keys[e.keyCode] = true; // Також записуємо код клавіші для ширшої сумісності
    // Обробляємо дію стрибка при натисканні пробілу
    if (
      (e.key === "Space" || e.keyCode === 32) &&
      game.gameActive &&
      !game.isPaused &&
      !game.player.isJumping
    ) {
      game.player.jump(); // Викликаємо метод стрибка гравця
    }
    // Обробляємо дію паузи при натисканні клавіші Escape
    if ((e.key === "Escape" || e.keyCode === 27) && game.gameActive) {
      game.pauseGame(); // Викликаємо метод паузи гри
    }
  });

  // Обробник подій для відпускання клавіш на клавіатурі
  document.addEventListener("keyup", (e) => {
    game.keys[e.key] = false; // Записуємо, що клавіша відпущена (використовуємо властивість key)
    game.keys[e.keyCode] = false; // Також записуємо код клавіші
  });
};

initGame(); // Викликаємо функцію для ініціалізації гри
