const bird = document.getElementById("bird");
const gravity = .5;
let dead = false;
let lastTime = 0;
let positionY = 0;
let keydown = false;
let velocity = 0;
let intervalId;
let pillars = [];

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
console.log(windowHeight);

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    const rect = bird.getBoundingClientRect();

    if (rect.bottom > windowHeight || rect.bottom < 0) {
        dead = true;
    }

    if (!dead) {
        // applied gravity for bird
        velocity += gravity;
        positionY += velocity * deltaTime * 0.05;
        bird.style.transform = `translateY(${positionY}px)`;

        // automatic pillar movement
        pillars.forEach(pillar => {
            pillar.pillarPositionX -= 10 * deltaTime * 0.05;
            pillar.style.transform = `translateX(${pillar.pillarPositionX}px)`;

            // If pillar moves off-screen, reset it
            if (pillar.pillarPositionX < -pillar.offsetWidth) {
                pillar.remove();
                pillars = pillars.filter(p => p !== pillar);  // Remove from pillars array
            }
        });

        requestAnimationFrame(gameLoop);
    } else {
        positionY = 0;
        velocity = 0;
        bird.style.transform = `translateY(${positionY}px)`;
        dead = false;
        resetPillars();  // Reset pillars when the game restarts
        requestAnimationFrame(gameLoop);
    }
}

requestAnimationFrame(gameLoop);

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !keydown) {
        velocity = -10;
        keydown = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space' && keydown) {
        keydown = false;
    }
});

function createPillars() {
    let pillar = document.createElement('div');
    pillar.pillarPositionX = window.innerWidth;
    let pillarOffset = Math.round((Math.sign(Math.random() - 0.5) * Math.random()) * 20);
    console.log(pillarOffset);

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

    document.body.appendChild(pillar);
    pillars.push(pillar);
}


function startInterval() {
    if (!intervalId) {
        intervalId = setInterval(createPillars, 1500);
    }
}

function resetInterval() {
    clearInterval(intervalId);
    intervalId = null;
    startInterval();
}

function resetPillars() {
    // Clear all existing pillars when the game is reset
    pillars.forEach(pillar => pillar.remove());
    pillars = [];
    resetInterval();
}

setTimeout(() => {
    resetInterval();
}, 1500);
