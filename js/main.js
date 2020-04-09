const canvas=document.getElementById("canvas"),ctx=canvas.getContext("2d"),gameOverWrapper=document.getElementById("gameOverWrapper"),winWrapper=document.getElementById("winWrapper"),cheatWrapper=document.getElementById("cheatWrapper");let r,c;window.localStorage.setItem("ch","false");let xOffset,speed=2,round=1,ranBallX=Math.floor(Math.random()*canvas.width),player={x:300,y:500,w:100,h:20},ball={x:ranBallX,y:450,radius:10},devMode=!1,dx=speed,dy=-speed,brickIndex=0,bricks=genBricks(),pause=!1,display=document.getElementById("display"),highScore=0;function getUrlVars(){let e={};window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,function(a,l,r){e[l]=r});return e}function getUrlParam(e,a){let l=a;return window.location.href.indexOf(e)>-1&&(l=getUrlVars()[e]),l}function genBrick(e,a,l="red"){return{id:++brickIndex,color:l,w:60,h:40,x:e,y:a}}function killBrick(e){let a=bricks[e-1];a.h=0,a.w=0,a.x=0,a.y=0}function genBricks(e=10,a=4){let l=[];r=e,c=a;for(let r=1;r<e+1;r++)for(let e=1;e<a+1;e++){let a=`rgb(${50+20*e}, ${50+20*e}, ${100-10*e})`;l.push(genBrick(64*r,64*e,a))}return l}null===window.localStorage.getItem("Speed")&&window.localStorage.setItem("Speed","2"),null!==window.localStorage.getItem("hScore")&&(highScore=window.localStorage.getItem("hScore")),document.addEventListener("keydown",function(e){switch(e.code){case"ArrowRight":dx+=1;break;case"ArrowLeft":dx+=-1;break;case"ArrowDown":dy+=1;break;case"ArrowUp":dy+=-1;break;case"KeyJ":devMode=!0}!1===pause?"KeyP"===e.code&&(pause=!0):"KeyP"===e.code&&(pause=!1)});let brick,lives=3,score=0;const xRadius=()=>ball.x+ball.radius,yRadius=()=>ball.y+ball.radius;function brickCollision(){for(let e=0;e<bricks.length;e++)if(brick=bricks[e],xRadius()<brick.x-brick.width&&console.log("less than x"),xRadius()>=brick.x&&ball.x-ball.radius<=brick.x+brick.w&&yRadius()>=brick.y&&ball.y-ball.radius<=brick.y+brick.h){let e=brick.x,a=brick.w;return console.table(brick),console.log(xRadius(),e+a,"x:"+e),killBrick(brick.id),speed+=.1,xRadius()===e||xRadius()+60===e+a||xRadius()+60===e||xRadius()+59===e+a||xRadius()+59===e||xRadius()+61===e+a||xRadius()+61===e||xRadius()-20===e+a||xRadius()-20===e||xRadius()-19===e+a||xRadius()-19===e||xRadius()-21===e+a||xRadius()-21===e?dx=-dx:dy=-dy,++score>highScore&&(highScore=score,window.localStorage.setItem("hScore",highScore)),!0}}function logKey(e){player.x=e.clientX-player.w/2-xOffset}function gameOver(){pause=!0,lives=3,score=0,gameOverWrapper.style.display="block"}function die(){lives--,ranBallX=Math.floor(Math.random()*canvas.width),dx=speed,dy=-speed,player.x=300,player.y=500,ball.x=ranBallX,ball.y=500}function drawBrick(){for(let e=0;e<bricks.length;e++){const a=bricks[e];ctx.fillStyle=a.color,ctx.fillRect(a.x,a.y,a.w,a.h)}}function paddleBallCollision(){ball.y+ball.radius>player.y&&ball.y<player.y+player.w/2&&ball.x>player.x&&ball.x<player.x+player.w&&(dy=-dy)}function maxMinPaddlePos(){player.x>canvas.width-player.w?player.x=canvas.width-player.w:player.x<0&&(player.x=0)}function scoreBoard(){display.innerHTML=`Score: ${score}    Lives:  ${lives}    High Score: ${highScore}`}function drawBall(){ranBallX<=40?ranBallX=40:ranBallX>=canvas.width-40&&(ranBallX=canvas.width-40),ctx.beginPath(),ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI),ctx.fillStyle="rgb(200, 100, 200)",ctx.fill(),ctx.closePath()}function ballWallCollision(){(ball.x+dx>canvas.width-ball.radius||ball.x+dx<ball.radius)&&(dx=-dx),ball.y+dy<ball.radius&&(dy=-dy),!0===devMode&&ball.y+dy>canvas.height-ball.radius&&(dy=-dy)}function newGame(){ctx.clearRect(0,0,canvas.width,canvas.height),location.reload(),genBricks(),dx=speed,dy=-speed,pause=!1,gameOverWrapper.style.display="none",winWrapper.style.display="none"}function win(){score>=r*c*round&&(dx=speed,dy=-speed,round++,pause=!0,winWrapper.style.display="block")}function update(e){(score>r*c||highScore>r*c*round)&&window.localStorage.setItem("ch","true"),paddleBallCollision(),ballWallCollision(),maxMinPaddlePos(),win(),scoreBoard(),brickCollision(),xOffset=window.innerWidth/2-canvas.width/2,!1===devMode&&ball.y+dy>=canvas.height-ball.radius&&die(),lives<=0&&gameOver(),ball.x+=dx,ball.y+=dy,"true"===window.localStorage.getItem("ch")&&(cheatWrapper.style.display="block")}function drawPaddle(){ctx.fillStyle="rgb(100, 50, 100)",ctx.fillRect(player.x,player.y,player.w,player.h)}function draw(){ctx.clearRect(0,0,canvas.width,canvas.height),drawBrick(),drawPaddle(),drawBall()}function loop(e){!1===pause&&update(e-lastRender),draw(),lastRender=e,window.requestAnimationFrame(loop)}document.addEventListener("mousemove",logKey);let lastRender=0;window.requestAnimationFrame(loop);