const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let player = {x: 300, y: 500, w: 100, h: 20};
let ball = {x: 200, y: 500, radius: 10};
let brick = {w: 46, h: 46, y: 32};

let devMode = false;
let dx = 2;
let dy = -2;

let bricks = ["brick", "brick", "brick", "brick"];

brickSpacing = 32;
brickTypes = [1, 2, 3, 4];

document.addEventListener("keydown", function (e) {
    switch (e.code) {
        case "ArrowRight":
            dx += 1;
            break;
        case "ArrowLeft":
            dx += -1;
            break;
        case "ArrowUp":
            dy += 1;
            break;
        case "ArrowDown":
            dy += -1;
            break;
        case "KeyJ":
            devMode = true;
    }
});

function ranArrayItem(arrayName) {
    let x = (Math.random() * arrayName.length);
    return arrayName[x]
}

let lives = 3;
let score = 0;

let brickX = brickPos();

function checkBrickCollision() {
    if (ball.x > brickX && ball.x < (brickX + brick.w) && ball.y > brick.y && ball.y < (brick.y + brick.h)) {
        console.log(`collision detected  @  Ball.x: ${ball.x}, Ball.y: ${ball.y}`);
        // dx = -dx;
    }
}

document.addEventListener('mousemove', logKey);

function logKey(e) {
    player.x = e.clientX - (player.w / 2);
}


function gameOver() {
    if (devMode === false) {
        if (ball.y + dy > canvas.height - ball.radius) {
            alert("GAME OVER")
        }
    }
}

function brickPos() {
    let x;
    for (let i = 2; i < 10; i++) {
        x = i * 64;
    }
    return x
}


function drawBrick() {
    for (let i = 2; i < 10; i++) {
        let x = i * 64;
        ctx.fillStyle = "rgb(50, 50, 100)";
        ctx.fillRect(x, brick.y, brick.w, brick.h);
    }

}

function paddleBallCollision() {
    if (ball.y === (player.y - player.h / 2)) {
        if (ball.x > player.x && ball.x < (player.x + player.w)) {
            dy = -dy
        }
    }
}


function maxMinPaddlePos() {
    if (player.x > (canvas.width - player.w)) {
        player.x = (canvas.width - player.w)
    } else if (player.x < 0) {
        player.x = 0
    }
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'rgb(200, 100, 200)';
    ctx.fill();
    ctx.closePath();
}

function ballWallCollision() {
    if (ball.x + dx > canvas.width - ball.radius || ball.x + dx < ball.radius) {
        dx = -dx;
    }
    if (ball.y + dy < ball.radius) {
        dy = -dy;
    }
    if (devMode === true) {
        if (ball.y + dy > canvas.height - ball.radius) {
            dy = -dy
        }
    }
}


function update(progress) {
    checkBrickCollision();
    paddleBallCollision();
    ballWallCollision();
    maxMinPaddlePos();
    gameOver();
    ball.x += dx;
    ball.y += dy;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBrick();
    ctx.fillStyle = "rgb(100, 50, 100)";
    ctx.fillRect(player.x, player.y, player.w, player.h);
    drawBall();

}

function loop(timestamp) {
    let progress = timestamp - lastRender;

    update(progress);
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}

let lastRender = 0;
window.requestAnimationFrame(loop);
