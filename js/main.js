const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let player = {x: 300, y: 500, w: 100, h: 20};
let ball = {x: 200, y: 500, radius: 10};

let devMode = false;
let dx = 2;
let dy = -2;

let brickIndex = 0;

let bricks = genBricks();

// let display = document.getElementById("display");

function genBrick(x, y, color="red"){
    brickIndex++;
    return {
        id: brickIndex,
        color: color,
        w: 60,
        h: 40,
        x: x,
        y: y
    }
}

function killBrick(brickId){
    let brick = bricks[brickId];
    brick.h = 0;
    brick.w = 0;
    brick.x = 0;
    brick.y = 0;
}

function genBricks(rows= 6, columns= 3){
    let bricks = [];
    for (let row = 1; row < rows + 1; row++) {
        for (let col = 1; col < columns + 1; col++) {
            let r = 50 + (20 * col);
            let g = 50 + (20 * col);
            let b = 100 - (10 * col);
            let color = `rgb(${r}, ${g}, ${b})`;
            console.log(row, col);
            bricks.push(genBrick(row * 64, col * 64, color))
        }
    }
    return bricks;
}

document.addEventListener("keydown", function (e) {
    switch (e.code) {
        case "ArrowRight":
            dx += 1;
            break;
        case "ArrowLeft":
            dx += -1;
            break;
        case "ArrowDown":
            dy += 1;
            break;
        case "ArrowUp":
            dy += -1;
            break;
        case "KeyJ":
            devMode = true;
    }
});

let lives = 3;
let score = 0;

function brickCollision() {
    for (let i = 0; i < bricks.length; i++) {
        let brick = bricks[i];
        let xRadius = ball.x + (ball.radius);
        let yRadius = ball.y + (ball.radius);
        if  (xRadius > brick.x && xRadius < (brick.x + brick.w) &&
            yRadius > brick.y && yRadius < (brick.y + brick.h)) {
            killBrick(brick.id);
            console.log(`collision detected  @  Ball.x: ${ball.x}, Ball.y: ${ball.y}`);
            return true;
        }
    }
}

function checkBrickCollision() {
    console.log(dx + " " + dy);
    if (brickCollision() === true) {
        console.log(bricks);
        if (dy > dx) {
            dx = -dx;
        } else if (dx > dy) {
            dy = -dy;
        }
    }

}

document.addEventListener('mousemove', logKey);

function logKey(e) {
    player.x = e.clientX - (player.w / 2);
}

function gameOver() {
    if (devMode === false) {
        if (ball.y + dy > canvas.height - ball.radius) {
            console.log("GAME OVER")
        }
    }
}

function drawBrick() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
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

function drawPaddle() {
    ctx.fillStyle = "rgb(100, 50, 100)";
    ctx.fillRect(player.x, player.y, player.w, player.h);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBrick();
    drawPaddle();
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
