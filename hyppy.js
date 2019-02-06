let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let min = 80;
let max = canvas.width - min;
let dropGap = 100;
let firstY = 350;
let easeOut = 0.04;
let score = 0;
let collisionCount = 0;
let extraJumps = 0;
let highScore = 0;
let jumpPower = 17;
let gravity = 0.45;

let ball = {
    
	radius:20,
	falling:true,
	x:canvas.width/2,
	dx:0,
	y:canvas.height - 20,
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

// drop variables
let dropRadius = 15;
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
        color: "#069b00",
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
    drop.color = "#069b00";
    if (Math.random() >= 0.98) {
        drop.color = "#ff0000";
    } else if ( Math.random() >= 0.97) {
        drop.color = "gold";
    }
    drop.x = Math.random() * (max - min) + min;
    drop.y = highestY - 100;
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
    }
}

function mouseMoveHandler(e) {
    let mouseX = e.clientX - canvas.offsetLeft;
    let distanceX = mouseX - ball.x;
    let sqr = Math.sqrt(distanceX * distanceX);
    
    if (sqr > 0) {
        ball.x += distanceX;
        //v = k * v + (1 - k ) * tv;
    }
}

function handleClick() {
    while (ball.falling == false) {
    ball.dy -= jumpPower;
    ball.falling = true;
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

function camera(drop) {
    if (ball.y > canvas.height/3) {
            drop.y += drop.speed;
        } else {
            drop.y -= ball.dy;
            if (drop.speed > 0.5) {
                drop.y += 0.5 * drop.speed;
            }
        }
        
        if (collisionCount > 1 && ball.y >= 3 * canvas.height/4) {
            ball.y = 3 * canvas.height/4;
            drop.y -= ball.dy;
        }
}

function draw() {
    //canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#eee";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    //pallo
	ctx.fillStyle = "#457eff";
	ctx.beginPath();
	ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2)
	ctx.fill();
    
    drawDrops();
    
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, canvas.width - 90, 15);
    ctx.fillText("Your best: " + extraJumps, 2, 15);
    
    for (let j = 0; j < drops.length; j++) {
        let drop = drops[j];
        camera(drop);
        // törmäys
        if (Math.abs(drop.x - ball.x) < (ball.radius + dropRadius) && Math.abs(drop.y - ball.y) < (ball.radius + dropRadius)) {
            ball.y = drop.y - dropRadius;
            ball.dy = 0;
            ball.dy -= jumpPower;
            spawnDrop(drop);
            score++;
            collisionCount++;
            ball.falling = true;
            if (drop.color == "gold") {
                extraJumps++;
            }
            if (drop.color == "#ff0000") {
                extraJumps--;
            }
        }
        // putoavan pallon osuessa pohjalle
        if (drop.y - dropRadius > canvas.height * 1.75) {
            spawnDrop(drop);
        }
    }
    
	if (controller.up && ball.falling == false) {
        ball.dy -= jumpPower; // hyppyvoima
        ball.falling = true;
    }

	if (controller.left) {
        ball.dx -= 0.85;
    }

	if (controller.right) {
        ball.dx += 0.85;
    }

	ball.dy += gravity; // painovoima
	ball.x += ball.dx;
	ball.y += ball.dy;
	ball.dx *= 0.95; // kitka
	ball.dy *= 0.99; // ilmanvastus

	// pallon tippuessa maahan
	if (ball.y > canvas.height - ball.radius) {
        
	ball.falling = false;
	ball.y = canvas.height - ball.radius;
	ball.dy *= -0; // pomppuefekti
        if (score > highScore) {
            highScore = score;
        }
    score = 0;
    collisionCount = 0;
    extraJumps = 0;
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
  
draw();
