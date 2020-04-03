const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const gameOverWrapper = document.getElementById("gameOverWrapper");
const winWrapper = document.getElementById("winWrapper");

let r;
let c;

let ranBallX = Math.floor(Math.random() * canvas.width);
let player = {x: 300, y: 500, w: 100, h: 20};
let ball = {x: ranBallX, y: 450, radius: 10};

let devMode = false;
let dx = 2;
let dy = -2;

let xOffset;

let getHighScore = getUrlParam("highscore", false);

let brickIndex = 0;

let bricks = genBricks();

let pause = false;

let display = document.getElementById("display");

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

function setUrlParam() {
    window.location.href = `http://localhost:63342/breakOut/index.html?highscore=${highScore}`
}

let highScore = 0;

let doHighScore = false;


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

function brickCollision() {
    for (let i = 0; i < bricks.length; i++) {
        brick = bricks[i];
        let xRadius = ball.x + (ball.radius);
        let yRadius = ball.y + (ball.radius);
        if (xRadius > brick.x && (ball.x - ball.radius) < (brick.x + brick.w) &&
            yRadius > brick.y && (ball.y - ball.radius) < (brick.y + brick.h)) {
            killBrick(brick.id);
            dy = -dy;
            score++;
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
    dx = 2;
    dy = -2;
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

function scoreBoard() {
    if (score < highScore) {
        display.innerHTML = `Score: ${score} \xa0\xa0\ Lives:  ${lives} \xa0\xa0\ High Score: ${highScore}`
    } else if (score > highScore) {
        highScore = score;
        doHighScore = true;
        let saveHighScore = document.cookie = getHighScore;

        display.innerHTML = `Score: ${score} \xa0\xa0\ Lives: ${lives} \xa0\xa0\ High Score: ${highScore}`
    }
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
    setUrlParam();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    genBricks();
    dx = 2;
    dy = -2;
    lives = 3;
    score = 0;
    pause = false;
    gameOverWrapper.style.display = "none";
    winWrapper.style.display = "none";
}

function win() {
    if (score >= r * c) {
        pause = true;
        winWrapper.style.display = "block";
    }
}

function update(progress) {
    if (getHighScore === false) {
        highScore = score;
    } else {

    }


    scoreBoard();
    brickCollision();
    paddleBallCollision();
    ballWallCollision();
    maxMinPaddlePos();
    win();
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
