const bird = document.getElementById("bird");
let dead = false;
let lastTime = 0;
let positionY = 0;
let keydown = false;
const gravity = .5;
let velocity = 0;

const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;
console.log(windowHeight);

function fall(timestamp) {
    let deltaTime = timestamp - lastTime;
    lastTime = timestamp
    const rect = bird.getBoundingClientRect();

    if (rect.bottom > windowHeight || rect.bottom < 0 ) {
        dead = true;
    }

    if(!dead) {
        velocity += gravity;
        positionY += velocity * deltaTime * 0.05;
        bird.style.transform = `translateY(${positionY}px)`

        requestAnimationFrame(fall);

    } else {
        positionY = 0;
        velocity = 0;
        bird.style.transform = `translateY(${positionY}px)`
        dead = false;

        requestAnimationFrame(fall);   
    }
    
}

requestAnimationFrame(fall);

document.addEventListener('keydown', function (event) {
    if (event.code === 'Space' && !keydown) {
        velocity = -10
        keydown = true;
    }
});

document.addEventListener('keyup', function (event) {
    if (event.code === 'Space' && keydown) {
        keydown = false;
    }
});
