let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.style.width = window.innerWidth + "px";
canvas.style.height = window.innerHeight + "px";

let min = canvas.width / 9;
let max = canvas.width - min;
let dropGap = canvas.height / 5.9;
let firstY = 35 * canvas.height / 59;
let easeOut = 0.04;
let score = 1500;
let collisionCount = 0;
let altitude = -1 * 10 * canvas.height / 59;
let jumps = 1;
let highScore = 0;
let jumpPower = canvas.height / 34;
let gravity = jumpPower / 38;
let altitudeFixer = -0.3 * canvas.height + 203;
let gameIsOver = false;
let hasJumped = false;

let ball = {
    
	radius:canvas.width/36,
	falling:true,
	x:canvas.width/2,
	dx:0,
	y:canvas.height - canvas.width/36,
	dy:0
    
	};

let controller = {

	left:false,
	right:false,
	up:false,
	down:false,
	keyListener:function(event) {

        let key_state = (event.type == "keydown")?true:false;

        switch(event.keyCode) {

        case 37:// left key
                controller.left = key_state;
        break;
        case 38:// up key
                controller.up = key_state;
        break;
        case 39:// right key
                controller.right = key_state;
        break;
                
		}
    }
};

window.addEventListener("mousemove", mouseMoveHandler, false);
canvas.addEventListener("click", handleClick, false);
window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);
document.addEventListener("touchstart", touchHandler);
document.addEventListener("touchmove", touchHandler);

let dropRadius = ball.radius * 0.75;
let totalDrops = 12;
let drops = [];
for (let i = 0; i < totalDrops; i++) {
    addDrop();
}

function addDrop() {
    let drop = {
        width: dropRadius,
        x: 0,
        y: 0,
        color: "#fff500",
    }
    spawnDrop(drop);
    drops.push(drop);
}

function spawnDrop(drop) {
    let highestY = firstY;
    for (let i = 0; i < drops.length; i++) {
         if (drops[i].y < highestY) {
             highestY = drops[i].y;
         }
    }
    drop.color = "#fff500";
    if (score < 500) {
        if (Math.random() >= 0.98 && jumps < 5) {
            drop.color = "white";
        } else if (Math.random() >= 0.96 && jumps > 0) {
            drop.color = "#000000";
        }
    } else if (score < 1000) {
        if (Math.random() >= 0.99 && jumps < 5) {
            drop.color = "white";
        } else if (Math.random() >= 0.97 && jumps > 0) {
            drop.color = "#000000";
        }
    } else if (score < 1500) {
        if (Math.random() >= 0.995 && jumps < 2) {
            drop.color = "white";
        } else if (Math.random() >= 0.98 && jumps > 0) {
            drop.color = "#000000";
        }
    } else {
        if (Math.random() >= 0.995 && jumps < 1) {
            drop.color = "white";
        } else if (Math.random() >= 0.97 && jumps > 0) {
            drop.color = "#000000";
        }
    }
    drop.x = Math.random() * (max - min) + min;
    drop.y = highestY - dropGap;
    highestY -= dropGap;
    drop.speed = 0.5;
    
    if (Math.random() >= 0.9 && score > 1) {
        drop.speed *= 1.25;
    } else if (Math.random() >= 0.9 && score > 49) {
        drop.speed *= 1.5;
    } else if (Math.random() >= 0.8 && score > 99) {
        drop.speed *= 2;
    } else if (Math.random() >= 0.7 && score > 149) {
        drop.speed *= 3;
    } else if (Math.random() >= 0.6 && score > 199) {
        drop.speed *= 4;
    } else if (Math.random() >= 0.5 && score > 249) {
        drop.speed *= 5;
    } else if (Math.random() >= 0.4 && score > 499) {
        drop.speed *= 7.5;
    }
}

function mouseMoveHandler(e) {
    let mouseX = e.clientX - canvas.offsetLeft;
    let distanceX = mouseX - ball.x;
    let sqr = Math.sqrt(distanceX * distanceX);
    
    if (sqr > 0) {
        ball.x += distanceX;
    }
}

function preventBehavior(e) {
    e.preventDefault(); 
}

document.addEventListener("touchmove", preventBehavior, {passive: false});

function handleClick() {
    if (ball.falling == false || jumps > 0) {
        ball.dy = 0;
        ball.dy -= jumpPower;
        ball.falling = true;
        if (jumps > 0) {
            jumps--;
        }
    }
    
    if (gameIsOver == true) {
        gameIsOver = false;
        location.reload();
    }
    hasJumped = true;
}

function touchHandler(e) {
    if (e.touches) {
        ball.x = e.touches[0].pageX - canvas.offsetLeft - ball.radius;
        e.preventDefault();
    }
}

function drawDrops() {
    for (let i = 0; i < drops.length; i++) {
        let drop = drops[i];
        ctx.fillStyle = drop.color;
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.width, 0, Math.PI*2);
        ctx.fill();
    }
}

function moveScreen(drop) {
    if (ball.y > canvas.height/3) {
            drop.y += drop.speed;
        } else {
            drop.y -= ball.dy;
            if (drop.speed > 0.5) {
                drop.y += 0.5 * drop.speed;
            }
        }
        
    if (altitude - altitudeFixer >= 3 * canvas.height/4 && ball.y >= 3 * canvas.height/4) {
        ball.y = 3 * canvas.height/4;
        drop.y -= 16;
    }
}

function drawCanvas() {
    let background = new Image();
    background.src = "Hell1.2.jpg";
    background.onload = function(){
        ctx.drawImage(background,0,0);
        
        if (gameIsOver == true) {
            gameOver();
        }
    }
}

function drawInstructions() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width/5, canvas.height/4, 3 * canvas.width/5, canvas.height/2);
    ctx.globalAlpha = 1.0;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Move with your finger, tap to jump", canvas.width/2, canvas.height/2);
}

function satan666() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 1.0;
}

function draw() {
    
    drawCanvas();
    
	ctx.fillStyle = "#3b0067";
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2)
	ctx.fill();
    
    if (gameIsOver == false) {
        drawDrops();
    }
    
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, canvas.width - 90, 16);
    ctx.textAlign = "left";
    ctx.fillText("Extra jumps: " + jumps, 2, 16);
    
    if (hasJumped == false && score < 1) {
        drawInstructions();
    }
    
    for (let j = 0; j < drops.length; j++) {
        let drop = drops[j];
        moveScreen(drop);
        // törmäys
        if (Math.abs(drop.x - ball.x) < (ball.radius + dropRadius) && Math.abs(drop.y - ball.y) < (ball.radius + dropRadius)) {
            ball.y = drop.y - dropRadius;
            ball.dy = 0;
            ball.dy -= jumpPower;
            if (drop.color == "white") {
                jumps++;
            }
            if (drop.color == "#000000" && jumps > 0) {
                jumps--;
            }
            score++;
            collisionCount++;
            spawnDrop(drop);
            ball.falling = true;
        }
        // putoavan pallon osuessa pohjalle
        if (drop.y - dropRadius > canvas.height * 1.75) {
            spawnDrop(drop);
        }
        
        if (score >= 666 && score < 674) {
            drop.color = "red";
        }
        
        if (score == 666) {
            satan666();
        }
        
        if (gameIsOver == true) {
            drop.speed = 0;
        }
        
        if(Math.abs(ball.y - drop.y) > 3500) {
            gameIsOver = true;
        }
    }
    
	if (controller.up && (ball.falling == false || jumps > 0)) {
        ball.dy = 0;
        ball.dy -= jumpPower;
        ball.falling = true;
        if (jumps > 0) {
        jumps--;
        }
    }

	if (controller.left) {
        ball.dx -= 0.85;
    }

	if (controller.right) {
        ball.dx += 0.85;
    }

    altitude -= ball.dy;
	ball.dy += gravity; // painovoima
	ball.x += ball.dx;
	ball.y += ball.dy;
	ball.dx *= 0.95; // kitka
	ball.dy *= 0.99; // ilmanvastus
    
    if (gameIsOver == true) {
        ball.y = canvas.height - ball.radius;
    }
    
	// pallon tippuessa maahan
	if (ball.y > canvas.height - ball.radius) {
        
	ball.falling = false;
	ball.y = canvas.height - ball.radius;
	ball.dy *= -0; // pomppuefekti
    altitude = 28 * canvas.height/59;
        if (score > highScore) {
            highScore = score;
        }
        if (score > 0 && hasJumped == true) {
            gameIsOver = true;
        }
    
	}
	// pallon osuessa reunoille
	if (ball.x < ball.radius) {
        ball.x += 2;
        ball.dx *= -1;

    } else if (ball.x > canvas.width - ball.radius) {
        ball.x -= 2;
        ball.dx *= -1;
    }
    
    if (ball.y < canvas.height/3) {
        ball.y = canvas.height/3; 
    }
    
    requestAnimationFrame(draw);
}

function gameOver() {
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "white";
    ctx.fillRect(canvas.width/5, canvas.height/4, 3 * canvas.width/5, canvas.height/2);
    ctx.globalAlpha = 1.0;
    ctx.font = "20px Arial";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.fillText("Final score: " + score, canvas.width/2, canvas.height/3);
    ctx.fillText("Tap to play again", canvas.width/2, canvas.height/2);
    ctx.fillText("(White balls give you extra jumps,", canvas.width/2, 1.90*canvas.height/3);
    ctx.fillText("black ball takes one away)", canvas.width/2, 2.06 * canvas.height/3);
}

draw();
