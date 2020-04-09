const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameOverWrapper = document.getElementById("gameOverWrapper");
const winWrapper = document.getElementById("winWrapper");
const cheatWrapper = document.getElementById("cheatWrapper");

let r;
let c;
window.localStorage.setItem("ch", "false");

let speed = 2;

let round = 1;
let ranBallX = Math.floor(Math.random() * canvas.width);
let player = {x: 300, y: 500, w: 100, h: 20};
let ball = {x: ranBallX, y: 450, radius: 10};

let devMode = false;
let dx = speed;
let dy = -speed;

let xOffset;
let brickIndex = 0;

let bricks = genBricks();

let pause = false;

let display = document.getElementById("display");

let highScore = 0;

if (window.localStorage.getItem("Speed") === null) {
    window.localStorage.setItem("Speed", "2")
}

if (window.localStorage.getItem("hScore") !== null) {
    highScore = window.localStorage.getItem("hScore");
}


function getUrlVars() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}

function getUrlParam(parameter, defaultValue) {
    let urlparameter = defaultValue;
    if (window.location.href.indexOf(parameter) > -1) {
        urlparameter = getUrlVars()[parameter];
    }
    return urlparameter;
}


function genBrick(x, y, color = "red") {
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

function killBrick(brickId) {
    let brick = bricks[brickId - 1];
    brick.h = 0;
    brick.w = 0;
    brick.x = 0;
    brick.y = 0;
}


function genBricks(rows = 10, columns = 4) {
    let bricks = [];
    r = rows;
    c = columns;
    for (let row = 1; row < rows + 1; row++) {
        for (let col = 1; col < columns + 1; col++) {
            let r = 50 + (20 * col);
            let g = 50 + (20 * col);
            let b = 100 - (10 * col);
            let color = `rgb(${r}, ${g}, ${b})`;
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
            break;
    }
    if (pause === false) {
        if (e.code === "KeyP") {
            pause = true;
        }
    } else {
        if (e.code === "KeyP") {
            pause = false;
        }
    }
});

let lives = 3;
let score = 0;

let brick;
const xRadius = () => ball.x + ball.radius;
const yRadius = () => ball.y + ball.radius;

function brickCollision() {
    for (let i = 0; i < bricks.length; i++) {
        brick = bricks[i];

        if (xRadius() < brick.x - brick.width) {
            console.log("less than x")
        }
        if (xRadius() >= brick.x && (ball.x - ball.radius) <= (brick.x + brick.w) &&
            yRadius() >= brick.y && (ball.y - ball.radius) <= (brick.y + brick.h)) {
            let x = brick.x;
            let w = brick.w;

            console.table(brick);
            console.log(xRadius(), x + w, "x:" + x);
            killBrick(brick.id);
            speed += 0.1;
            if (xRadius() === x || xRadius() + 60 === (x + w) || xRadius() + 60 === (x)
                || xRadius() + 59 === (x + w) || xRadius() + 59 === (x) || xRadius() + 61 === (x + w) || xRadius() + 61 === (x)
                || xRadius() - 20 === (x + w) || xRadius() - 20 === (x) || xRadius() - 19 === (x + w) || xRadius() - 19 === (x)
                || xRadius() - 21 === (x + w) || xRadius() - 21 === (x)) {
                dx = -dx;

            } else {
                dy = -dy;
            }

            score++;
            if (score > highScore) {
                highScore = score;

                window.localStorage.setItem("hScore", highScore);
            }

            return true;
        }
    }
}

document.addEventListener('mousemove', logKey);

function logKey(e) {
    player.x = e.clientX - (player.w / 2) - xOffset;
}

function gameOver() {
    pause = true;
    lives = 3;
    score = 0;
    gameOverWrapper.style.display = "block";
}

function die() {
    lives--;
    ranBallX = Math.floor(Math.random() * canvas.width);
    dx = speed;
    dy = -speed;
    player.x = 300;
    player.y = 500;
    ball.x = ranBallX;
    ball.y = 500;
}

function drawBrick() {
    for (let i = 0; i < bricks.length; i++) {
        const brick = bricks[i];

        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    }

}

function paddleBallCollision() {
    if ((ball.y + ball.radius) > player.y && ball.y < player.y + (player.w / 2)) {
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

function scoreBoard() {
    display.innerHTML = `Score: ${score} \xa0\xa0\ Lives:  ${lives} \xa0\xa0\ High Score: ${highScore}`;

}

function drawBall() {
    if (ranBallX <= 40) {
        ranBallX = 40
    } else if (ranBallX >= (canvas.width - 40)) {
        ranBallX = (canvas.width - 40)

    }
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

function newGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    location.reload();
    genBricks();
    dx = speed;
    dy = -speed;
    pause = false;
    gameOverWrapper.style.display = "none";
    winWrapper.style.display = "none";
}

function win() {
    if (score >= (r * c) * round) {
        dx = speed;
        dy = -speed;
        round++;
        pause = true;
        winWrapper.style.display = "block";
    }
}

function update(progress) {
    if (score > r * c || highScore > (r * c) * round) {
        window.localStorage.setItem("ch", "true")
    }
    paddleBallCollision();
    ballWallCollision();
    maxMinPaddlePos();
    win();
    scoreBoard();
    brickCollision();

    xOffset = ((window.innerWidth / 2) - (canvas.width / 2));
    if (devMode === false) {
        if (ball.y + dy >= canvas.height - ball.radius) {
            die();
        }
    }

    if (lives <= 0) {
        gameOver();
    }


    ball.x += dx;
    ball.y += dy;

    if (window.localStorage.getItem("ch") === "true") {
        cheatWrapper.style.display = "block";
    }
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

    if (pause === false) {
        update(progress);
    }
    draw();

    lastRender = timestamp;
    window.requestAnimationFrame(loop)
}

let lastRender = 0;
window.requestAnimationFrame(loop);
