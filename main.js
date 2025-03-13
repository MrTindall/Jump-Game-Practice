let dead = false;
let keydown = false;
let startGame = false;

let lastTime = 0;
let positionY = 0;
let velocity = 0;
let scoreValue = 0;

let pillars = [];
let intervalId;

const gameContainer = document.querySelector('.game-container');
const score = document.getElementById('score');
const bird = document.getElementById("bird");
const gravity = .5;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

requestAnimationFrame(gameLoop);

// Game loop
function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    const rect = bird.getBoundingClientRect();

    // Check for bird death (out of bounds)
    if (rect.bottom > windowHeight || rect.bottom < 0) {
        dead = true;
    }

    if (!dead) {
        if (startGame) {
            velocity += gravity * (deltaTime / 16.67);
            positionY += velocity * (deltaTime / 16.67);
            bird.style.transform = `translateY(${positionY}px)`;
        }

        score.innerHTML = `${scoreValue}`;

        pillars.forEach(pillar => {
            const pillarTop = document.querySelector('.pillar-top');
            const pillarBottom = document.querySelector('.pillar-bottom');

            const pillarTopRect = pillarTop.getBoundingClientRect();
            const pillarBottomRect = pillarBottom.getBoundingClientRect();

            const timeScale = deltaTime / 16.67; // Normalize to 60 FPS
            pillar.pillarPositionX -= 10 * timeScale;
            pillar.style.transform = `translateX(${pillar.pillarPositionX}px)`;

            // Remove pillar when it's off-screen
            if (pillar.pillarPositionX < -pillar.offsetWidth) {
                pillar.remove();
                pillars = pillars.filter(p => p !== pillar);
            }

            // Collision detection with pillars
            if (
                (rect.top < pillarTopRect.bottom &&
                    rect.bottom > pillarTopRect.top &&
                    rect.left < pillarTopRect.right &&
                    rect.right > pillarTopRect.left) ||
                (rect.top < pillarBottomRect.bottom &&
                    rect.bottom > pillarBottomRect.top &&
                    rect.left < pillarBottomRect.right &&
                    rect.right > pillarBottomRect.left)
            ) {
                dead = true;
            }

            // Score for passing pillars
            if (pillar.pillarPositionX < rect.bottom) {
                if (!pillar.pillarPassed) {
                    scoreValue += 1;
                }
                pillar.pillarPassed = true;
            }
        });
    }

    // Game over reset
    if (dead) {
        positionY = 0;
        velocity = 0;
        scoreValue = 0;
        bird.style.transform = `translateY(${positionY}px)`;
        resetPillars();
        startGame = false;
        dead = false;
    }

    // Always keep the loop running
    requestAnimationFrame(gameLoop);
}

// Player controls (keydown)
document.addEventListener('keydown', function (event) {
    if (!startGame && event.code === 'Space') {
        startGame = true;
        velocity = -10;
        startInterval();
    } else if (startGame && event.code === 'Space' && !keydown) {
        velocity = -10;
        keydown = true;
    }
});

// Player controls (keyup)
document.addEventListener('keyup', function (event) {
    if (event.code === 'Space' && keydown) {
        keydown = false;
    }
});

// Creates a new pillar with random height
function createPillars() {
    let pillar = document.createElement('div');
    pillar.pillarPositionX = window.innerWidth;
    let pillarOffset = Math.round((Math.sign(Math.random() - 0.5) * Math.random()) * 20);

    pillar.classList.add('pillars');
    pillar.innerHTML = `
        <div class="pillar-top"></div>
        <div class="pillar-space"></div>
        <div class="pillar-bottom"></div>
    `;

    const pillarTop = pillar.querySelector('.pillar-top');
    const pillarSpace = pillar.querySelector('.pillar-space');
    const pillarBottom = pillar.querySelector('.pillar-bottom');

    pillarTop.style.height = pillarOffset + 40 + 'vh';
    pillarSpace.style.height = pillarOffset + 40 + 'vh';
    pillarBottom.style.height = 40 - pillarOffset + 'vh';
    let pillarPassed = false;

    gameContainer.appendChild(pillar);
    pillars.push(pillar);
}

// Starts creating pillars every 1.5 seconds if the game is active
function startInterval() {
    if (!intervalId && startGame) {
        intervalId = setInterval(createPillars, 1500);
    }
}

// Clears and resets the interval if the game is not active
function resetInterval() {
    clearInterval(intervalId);
    intervalId = null;
    if (startGame) {
        startInterval();
    }
}

// Clears pillars array at death
function resetPillars() {
    pillars.forEach(pillar => pillar.remove());
    pillars = [];
    clearInterval(intervalId);
    intervalId = null;
}

// Ensures pillars start creating every 1.5 seconds only when the game starts
setTimeout(() => {
    if (startGame) {
        resetInterval();
    }
}, 1500);
