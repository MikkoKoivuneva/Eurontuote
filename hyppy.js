let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let min = 80;
let max = canvas.width - min;
let dropGap = 100;
let firstY = 350;
let easeOut = 0.04;
let score = 0;
let highScore = 0;

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
let totalDrops = 7;
let drops = [];
for (let i = 0; i < totalDrops; i++) {
    addDrop();
}

function addDrop() {
    let drop = {
        width: dropRadius,
        x: 0,
        y: 0,
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
    drop.x = Math.random() * (max - min) + min;
    drop.y = highestY - 100;
    highestY -= dropGap;
    drop.speed = 0.5;  
}

function mouseMoveHandler(e) {
    let mouseX = e.clientX - canvas.offsetLeft;
    let distanceX = mouseX - ball.x;
    let sqr = Math.sqrt(distanceX * distanceX);
    
    if (sqr > 0) {
        ball.x += easeOut * distanceX;
        //v = k * v + (1 - k ) * tv;
    }
}

function handleClick() {
    while (ball.falling == false) {
    ball.dy -= 17;
    ball.falling = true;
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
    
    for (let i = 0; i < drops.length; i++) {
        let drop = drops[i];
        ctx.fillStyle = "#069b00";
        ctx.beginPath();
        ctx.arc(drop.x, drop.y, drop.width, 0, Math.PI*2);
        ctx.fill();
    }
    
    ctx.font = "16px Arial";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + score, canvas.width - 90, 15);
    ctx.fillText("Your best: " + highScore, 2, 15);
    
    for (let j = 0; j < drops.length; j++) {
        let drop = drops[j];
        if(ball.y > canvas.height/3) {
            drop.y += drop.speed;
        } else {
            drop.y += 5;
        }
        // törmäys
        if (Math.abs(drop.x - ball.x) < (ball.radius + dropRadius) && Math.abs(drop.y - ball.y) < (ball.radius + dropRadius)) {
            ball.y = drop.y - dropRadius;
            ball.dy = 0;
            ball.dy -= 18;
            spawnDrop(drop);
            score++;
            ball.falling = true;
        }

        // putoavan pallon osuessa pohjalle
        if (drop.y - dropRadius > canvas.height) {
            spawnDrop(drop);
        }
    }
    
	if (controller.up && ball.falling == false) {
        ball.dy -= 17; // hyppyvoima
        ball.falling = true;
    }

	if (controller.left) {
        ball.dx -= 0.85;
    }

	if (controller.right) {
        ball.dx += 0.85;
    }

	ball.dy += 0.5; // painovoima
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