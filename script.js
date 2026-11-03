const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const ui = {
    score: document.getElementById("ui-score"),
    best: document.getElementById("ui-best"),
    level: document.getElementById("ui-level"),
    food: document.getElementById("ui-food"),
    foodBar: document.getElementById("ui-food-bar"),
    effect: document.getElementById("ui-effect"),
    pauseBtn: document.getElementById("btn-pause"),
    restartBtn: document.getElementById("btn-restart"),
};

const TILE = 30;
const COLS = 15;
const ROWS = 15;
canvas.width = COLS * TILE;
canvas.height = ROWS * TILE;

const levels = [
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,0,1,1,1,0,1,1,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
        [1,0,1,1,1,1,0,1,1,1,1,0,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,0,1,1,1,1,0,0,0,1],
        [1,1,1,0,1,0,0,0,0,0,1,0,1,1,1],
        [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
        [1,0,1,1,1,0,0,0,0,0,1,1,1,0,1],
        [1,0,0,0,0,0,1,1,1,0,0,0,0,0,1],
        [1,1,1,0,1,0,0,0,0,0,1,0,1,1,1],
        [1,0,0,0,1,1,1,0,1,1,1,0,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,1,0,1,1,1,1,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
    [
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,0,1,1,0,1,0,0,0,1,0,1,1,0,1],
        [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,0,1,0,1,1,0,0,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1],
        [1,0,1,0,1,0,1,1,1,0,1,0,1,0,1],
        [1,0,1,0,0,0,0,0,0,0,0,0,1,0,1],
        [1,0,0,0,1,1,0,1,0,1,1,0,0,0,1],
        [1,0,1,0,0,0,0,1,0,0,0,0,1,0,1],
        [1,0,1,1,0,1,0,0,0,1,0,1,1,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    ],
];

const START = { x: 1, y: 1 };

const isTouch = window.matchMedia("(pointer: coarse)").matches;
const tapOrEnter = isTouch ? "Tap the screen" : "Press Enter";
const SWIPE_MIN = 24;

const BASE_SPEED = 220;
const MIN_SPEED = 120;
const FOOD_GOAL = 8;
const POWER_CHANCE = 0.25;
const POWER_LIFE = 50;
const EFFECT_TIME = 40;

const POWER_TYPES = {
    gold: { color: "#ffd700", label: "GOLD" },
    slow: { color: "#00e5ff", label: "SLOW" },
    ghost: { color: "#d0a0ff", label: "GHOST" },
};

const DIRS = {
    arrowup: { x: 0, y: -1 },
    w: { x: 0, y: -1 },
    arrowdown: { x: 0, y: 1 },
    s: { x: 0, y: 1 },
    arrowleft: { x: -1, y: 0 },
    a: { x: -1, y: 0 },
    arrowright: { x: 1, y: 0 },
    d: { x: 1, y: 0 },
};

let maze = levels[0];
let levelIndex = 0;
let snake = [];
let direction = { x: 1, y: 0 };
let inputQueue = [];
let food = { x: -1, y: -1 };
let powerUp = null;
let effect = { type: null, ticks: 0 };
let score = 0;
let eaten = 0;
let highScore = loadHighScore();
let state = "start";
let lastMove = 0;
let particles = [];
let shake = 0;

function loadHighScore() {
    try {
        return parseInt(localStorage.getItem("mazesnake_best")) || 0;
    } catch (e) {
        return 0;
    }
}

function saveHighScore() {
    try {
        localStorage.setItem("mazesnake_best", highScore);
    } catch (e) {}
}

function drawFloor() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 0) {
                ctx.fillStyle = (row + col) % 2 === 0 ? "#1a1a2e" : "#16213e";
                ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
            }
        }
    }
}

function drawMaze() {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            if (maze[row][col] === 1) {
                ctx.fillStyle = "#3a3aff";
                ctx.fillRect(col * TILE, row * TILE, TILE, TILE);
            }
        }
    }
}

function drawFood() {
    ctx.fillStyle = "#ff3b3b";
    ctx.beginPath();
    ctx.arc(
        food.x * TILE + TILE / 2,
        food.y * TILE + TILE / 2,
        TILE / 3,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawPowerUp() {
    if (!powerUp) return;
    if (powerUp.life < 15 && Math.floor(powerUp.life / 3) % 2 === 0) return;
    const cx = powerUp.x * TILE + TILE / 2;
    const cy = powerUp.y * TILE + TILE / 2;
    ctx.fillStyle = POWER_TYPES[powerUp.type].color;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE / 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, TILE / 2.3, 0, Math.PI * 2);
    ctx.stroke();
}

function drawSnake() {
    ctx.globalAlpha = effect.type === "ghost" ? 0.5 : 1;
    for (let i = snake.length - 1; i >= 0; i--) {
        ctx.fillStyle = i === 0 ? "#7CFC00" : "#32CD32";
        ctx.fillRect(
            snake[i].x * TILE + 2,
            snake[i].y * TILE + 2,
            TILE - 4,
            TILE - 4
        );
    }
    ctx.globalAlpha = 1;
}

function drawParticles() {
    for (const p of particles) {
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
}

function drawOverlay(title, lines) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#fff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 36px Arial";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 50);
    ctx.font = "16px Arial";
    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], canvas.width / 2, canvas.height / 2 + i * 26);
    }
}

function updateUI() {
    ui.score.textContent = score;
    ui.best.textContent = highScore;
    ui.level.textContent = (levelIndex + 1) + "/" + levels.length;
    ui.food.textContent = eaten + "/" + FOOD_GOAL;
    ui.foodBar.style.width = (eaten / FOOD_GOAL) * 100 + "%";

    if (effect.type) {
        ui.effect.textContent = POWER_TYPES[effect.type].label + " " + effect.ticks;
        ui.effect.style.color = POWER_TYPES[effect.type].color;
    } else {
        ui.effect.textContent = "No power-up";
        ui.effect.style.color = "";
    }

    ui.pauseBtn.textContent = state === "paused" ? "Resume" : "Pause";
    ui.pauseBtn.disabled = state !== "playing" && state !== "paused";
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    if (shake > 0) {
        ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake);
    }
    drawFloor();
    drawMaze();
    drawFood();
    drawPowerUp();
    drawSnake();
    drawParticles();
    ctx.restore();

    if (state === "start") {
        drawOverlay("MAZE SNAKE", [
            isTouch ? "Swipe or use the D-pad to move" : "Arrow keys or WASD to move",
            isTouch ? "Use the Pause button to pause" : "P to pause",
            tapOrEnter + " to start",
        ]);
    } else if (state === "paused") {
        drawOverlay("PAUSED", [
            isTouch ? "Tap the screen to continue" : "Press P to continue",
        ]);
    } else if (state === "levelclear") {
        drawOverlay("LEVEL CLEAR!", [
            "Next: Level " + (levelIndex + 1),
            tapOrEnter + " to continue",
        ]);
    } else if (state === "gameover") {
        const lines = ["Score: " + score + "   Best: " + highScore];
        if (score > 0 && score === highScore) lines.push("New high score!");
        lines.push(tapOrEnter + " to restart");
        drawOverlay("GAME OVER", lines);
    } else if (state === "win") {
        drawOverlay("YOU WIN!", [
            "Final score: " + score,
            "Best: " + highScore,
            tapOrEnter + " to play again",
        ]);
    }
}

function randomFreeTile() {
    let x, y;
    do {
        x = Math.floor(Math.random() * COLS);
        y = Math.floor(Math.random() * ROWS);
    } while (
        maze[y][x] === 1 ||
        snake.some((seg) => seg.x === x && seg.y === y) ||
        (food.x === x && food.y === y) ||
        (powerUp && powerUp.x === x && powerUp.y === y)
    );
    return { x, y };
}

function placeFood() {
    food = randomFreeTile();
}

function spawnPowerUp() {
    const types = Object.keys(POWER_TYPES);
    const type = types[Math.floor(Math.random() * types.length)];
    const tile = randomFreeTile();
    powerUp = { x: tile.x, y: tile.y, type: type, life: POWER_LIFE };
}

function collectPowerUp() {
    const type = powerUp.type;
    spawnParticles(powerUp.x, powerUp.y, POWER_TYPES[type].color, 15);
    if (type === "gold") {
        score += 5;
    } else {
        effect = { type: type, ticks: EFFECT_TIME };
    }
    powerUp = null;
}

function spawnParticles(tx, ty, color, count) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        particles.push({
            x: tx * TILE + TILE / 2,
            y: ty * TILE + TILE / 2,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1,
            color: color,
        });
    }
}

function updateParticles() {
    for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.04;
    }
    particles = particles.filter((p) => p.life > 0);
    if (shake > 0) shake = Math.max(0, shake - 0.6);
}

function loadLevel(i) {
    levelIndex = i;
    maze = levels[i];
    snake = [{ x: START.x, y: START.y }, { x: START.x, y: START.y }];
    direction = { x: 1, y: 0 };
    inputQueue = [];
    food = { x: -1, y: -1 };
    powerUp = null;
    effect = { type: null, ticks: 0 };
    eaten = 0;
    placeFood();
}

function startGame() {
    score = 0;
    loadLevel(0);
    state = "playing";
    lastMove = performance.now();
}

function finishRun() {
    if (score > highScore) {
        highScore = score;
        saveHighScore();
    }
}

function die() {
    if (navigator.vibrate) navigator.vibrate(200);
    state = "gameover";
    shake = 12;
    spawnParticles(snake[0].x, snake[0].y, "#ff3b3b", 25);
    finishRun();
}

function nextLevel() {
    if (levelIndex + 1 >= levels.length) {
        state = "win";
        finishRun();
        return;
    }
    loadLevel(levelIndex + 1);
    state = "levelclear";
}

function getDelay() {
    let delay = Math.max(MIN_SPEED, BASE_SPEED - eaten * 5);
    if (effect.type === "slow") delay *= 1.6;
    return delay;
}

function update() {
    if (inputQueue.length > 0) {
        direction = inputQueue.shift();
    }

    const head = {
        x: snake[0].x + direction.x,
        y: snake[0].y + direction.y,
    };

    if (maze[head.y][head.x] === 1) {
        die();
        return;
    }

    const eatingFood = head.x === food.x && head.y === food.y;
    const body = eatingFood ? snake : snake.slice(0, -1);
    if (
        effect.type !== "ghost" &&
        body.some((seg) => seg.x === head.x && seg.y === head.y)
    ) {
        die();
        return;
    }

    snake.unshift(head);

    if (eatingFood) {
        score++;
        eaten++;
        if (navigator.vibrate) navigator.vibrate(15);
        spawnParticles(head.x, head.y, "#ff3b3b", 12);
        if (eaten >= FOOD_GOAL) {
            nextLevel();
            return;
        }
        placeFood();
        if (!powerUp && Math.random() < POWER_CHANCE) spawnPowerUp();
    } else {
        snake.pop();
    }

    if (powerUp && head.x === powerUp.x && head.y === powerUp.y) {
        collectPowerUp();
    }

    if (effect.ticks > 0) {
        effect.ticks--;
        if (effect.ticks === 0) effect.type = null;
    }

    if (powerUp) {
        powerUp.life--;
        if (powerUp.life <= 0) powerUp = null;
    }
}

function loop(timestamp) {
    if (state === "playing" && timestamp - lastMove > getDelay()) {
        update();
        lastMove = timestamp;
    }
    updateParticles();
    updateUI();
    draw();
    requestAnimationFrame(loop);
}

function confirmAction() {
    if (state === "start" || state === "gameover" || state === "win") {
        startGame();
    } else if (state === "levelclear") {
        state = "playing";
        lastMove = performance.now();
    } else if (state === "paused") {
        togglePause();
    }
}

function togglePause() {
    if (state === "playing") {
        state = "paused";
    } else if (state === "paused") {
        state = "playing";
        lastMove = performance.now();
    }
}

function queueDirection(dir) {
    if (state !== "playing") return;

    const last = inputQueue.length > 0
        ? inputQueue[inputQueue.length - 1]
        : direction;

    if (dir.x === -last.x && dir.y === -last.y) return;
    if (dir.x === last.x && dir.y === last.y) return;
    if (inputQueue.length < 2) inputQueue.push(dir);
}

document.addEventListener("keydown", (e) => {
    const key = e.key.toLowerCase();

    if (key.startsWith("arrow") || key === " ") e.preventDefault();

    if (key === "enter" || key === " ") {
        confirmAction();
        return;
    }

    if (key === "p") {
        togglePause();
        return;
    }

    const dir = DIRS[key];
    if (dir) queueDirection(dir);
});

ui.pauseBtn.addEventListener("click", (e) => {
    togglePause();
    e.currentTarget.blur();
});

ui.restartBtn.addEventListener("click", (e) => {
    startGame();
    e.currentTarget.blur();
});

let swipeStart = null;

canvas.addEventListener("pointerdown", (e) => {
    if (state !== "playing") {
        confirmAction();
        return;
    }
    swipeStart = { x: e.clientX, y: e.clientY };
    canvas.setPointerCapture(e.pointerId);
});

canvas.addEventListener("pointermove", (e) => {
    if (!swipeStart || state !== "playing") return;
    const dx = e.clientX - swipeStart.x;
    const dy = e.clientY - swipeStart.y;
    if (Math.abs(dx) < SWIPE_MIN && Math.abs(dy) < SWIPE_MIN) return;

    if (Math.abs(dx) > Math.abs(dy)) {
        queueDirection(dx > 0 ? DIRS.d : DIRS.a);
    } else {
        queueDirection(dy > 0 ? DIRS.s : DIRS.w);
    }
    swipeStart = { x: e.clientX, y: e.clientY };
});

canvas.addEventListener("pointerup", () => { swipeStart = null; });
canvas.addEventListener("pointercancel", () => { swipeStart = null; });

const DPAD = {
    up: DIRS.w,
    down: DIRS.s,
    left: DIRS.a,
    right: DIRS.d,
};

document.querySelectorAll(".dpad button").forEach((btn) => {
    btn.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        queueDirection(DPAD[btn.dataset.dir]);
    });
});

document.addEventListener("visibilitychange", () => {
    if (document.hidden && state === "playing") state = "paused";
});

document.addEventListener("contextmenu", (e) => {
    if (isTouch) e.preventDefault();
});

loadLevel(0);
requestAnimationFrame(loop);
