let dead = false;
let keydown = false;
let startGame = false;

let lastTime = 0;
let positionY = 0;
let velocity = 0;
let scoreValue = 0;

let pillars = [];
let intervalId;

const score = document.getElementById('score');
const bird = document.getElementById("bird");
const gravity = .5;
const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

function gameLoop(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp;
    const rect = bird.getBoundingClientRect();

    if (rect.bottom > windowHeight || rect.bottom < 0) {
        dead = true;
    }

    if (!dead) {
        if(!startGame) {
            velocity = 0;
        } else {
            velocity += gravity;
        }
        
        positionY += velocity * deltaTime * 0.05;
        bird.style.transform = `translateY(${positionY}px)`;

        score.innerHTML = `${scoreValue}`;

        // moves each pillar from right to left
        pillars.forEach(pillar => {
            const pillarTop = document.querySelector('.pillar-top');
            const pillarBottom = document.querySelector('.pillar-bottom');

            const pillarTopRect = pillarTop.getBoundingClientRect();
            const pillarBottomRect = pillarBottom.getBoundingClientRect();

            pillar.pillarPositionX -= 10 * deltaTime * 0.05;
            pillar.style.transform = `translateX(${pillar.pillarPositionX}px)`;

            // if pillar moves off-screen, reset it
            if (pillar.pillarPositionX < -pillar.offsetWidth) {
                pillar.remove();
                pillars = pillars.filter(p => p !== pillar); 
            }

            // checks player rect against pillar top or bottom rect
            if (
                rect.top < pillarTopRect.bottom &&
                rect.bottom > pillarTopRect.top &&
                rect.left < pillarTopRect.right &&
                rect.right > pillarTopRect.left || 
                rect.top < pillarBottomRect.bottom &&
                rect.bottom > pillarBottomRect.top &&
                rect.left < pillarBottomRect.right &&
                rect.right > pillarBottomRect.left
            ) {
                dead = true;
            }

            if (pillar.pillarPositionX < rect.bottom) {
                if(!pillar.pillarPassed){
                    scoreValue += 1;
                }
                pillar.pillarPassed = true;
            }
        });

        requestAnimationFrame(gameLoop);
    // resets after die
    } else {

        positionY = 0;
        velocity = 0;
        scoreValue = 0;
        bird.style.transform = `translateY(${positionY}px)`;
        resetPillars();
        startGame = false;
        if (startGame) {
            dead = false;
            requestAnimationFrame(gameLoop);
        }

    }
}

requestAnimationFrame(gameLoop);


// player controls
document.addEventListener('keydown', function (event) {
    if (startGame) {
        if (event.code === 'Space' && !keydown) {
            velocity = -10;
            keydown = true;
        }
    } else {
        startGame = true;
    }
    
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space' && keydown) {
        keydown = false;
    }
});

// creates a new div element with random heights and adds it to pillars array
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
    let pillarPassed = false;

    document.body.appendChild(pillar);
    pillars.push(pillar);
}

// starts creating pillars every 1.5 seconds
function startInterval() {
    if (!intervalId) {
        intervalId = setInterval(createPillars, 1500);
    }
}

// clears and resets start interval 
function resetInterval() {
    clearInterval(intervalId);
    intervalId = null;
    startInterval();
}

// clears pillars array at death
function resetPillars() {
    pillars.forEach(pillar => pillar.remove());
    pillars = [];
    resetInterval();
}

// calls reset interval every 1.5 seconds
setTimeout(() => {
    resetInterval();
}, 1500);
