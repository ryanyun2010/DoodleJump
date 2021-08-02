var ground;
var player;
var platforms;
var left;
var right;
var gravity;
var centerFocusY;
var score;
var playing;

function setup() {
    left = false;
    right = false;
    gravity = 0.1;
    centerFocusY = 250;
    score = 0;
    playing = true;
    createCanvas(500, 500);
    platforms = [
        {
            x: 100,
            y: 350,
            w: 100,
            h: 10
        },
        {
            x: 200,
            y: 250,
            w: 100,
            h: 10
        },
        {
            x: 250,
            y: 150,
            w: 100,
            h: 10
        }
    ]

    ground = {
        x: 0,
        y: 450,
        w: 500,
        h: 50,
        color: "#00ff00"
    };
    player = {
        x: 225,
        y: 400,
        w: 50,
        h: 50,
        xspeed: 4,
        yspeed: 0,
        img: loadImage("doodle.png")
    };
}

function moveCamera(){
    translate(0,250-centerFocusY)
    if(player.y < centerFocusY){
        centerFocusY = player.y;
    }
}

function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        left = true;
    } else if (keyCode == RIGHT_ARROW) {
        right = true;
    } else if (keyCode == 32 && playing === false){
        setup();
    }
}

function keyReleased() {
    if (keyCode == LEFT_ARROW) {
        left = false;
    } else if (keyCode == RIGHT_ARROW) {
        right = false;
    }
}

var getTallestPlatform = function() {
    var tallestPlatform = null;
    var tallestHeight = 500;
    for (var platform of platforms) {
        if (platform.y < tallestHeight) {
            tallestPlatform = platform;
            tallestHeight = platform.y;
        }
    }
    return tallestPlatform;
};

function draw() {
    if(playing){
        background(150, 150, 255);
        drawScore()
        moveCamera()
        image(player.img, player.x, player.y, player.w, player.h);
        movePlayer()
        doPlatforms()
    }else{
        drawGameOver();
    }
};

function doPlatforms(){
    fill(ground.color)
    rect(ground.x, ground.y, ground.w, ground.h);
    fill(34,139,34)
    for(var i = 0; i < platforms.length; i++){
        rect(platforms[i].x,platforms[i].y,platforms[i].w,platforms[i].h,50)
    }
    platforms = platforms.filter(
        function(p){
            return p.y <= centerFocusY+250
        }
    )
    var tallestPlatform = getTallestPlatform();
    if(tallestPlatform != null){
        if(tallestPlatform.y > centerFocusY - 250){
            platforms.push({
                x: Math.floor((Math.random()*400+50)),
                y: tallestPlatform.y - Math.floor((Math.random()*50+50)),
                w:100,
                h:10
            })
        }
    }
}

function collision(obj1, obj2) {
    if (obj1.x + obj1.w >= obj2.x &&
        obj1.x <= obj2.x + obj2.w &&
        obj1.y + obj1.h >= obj2.y &&
        obj1.y <= obj2.y + obj2.h) {
        return true;
    } else {
        return false;
    }
};
function feetOn(obj1, obj2){
    return obj1.y + obj1.h < obj2.y + 10 &&
            obj1.y + obj1.h > obj2.y - 10;
}

function movePlayer() {
    player.y += player.yspeed;
    player.yspeed += gravity;
    if (collision(player, ground) && player.yspeed >= 0) {
        player.yspeed = -5;
    }
    for(var i = 0; i < platforms.length; i ++){
    if (collision(player, platforms[i]) && player.yspeed >= 0 && feetOn(player,platforms[i])) {
            player.yspeed = -5;
        }
    }
    if (left && player.x - player.xspeed > 0) {
        player.x -= player.xspeed;
    } else if (right && player.x + player.xspeed < 500 - player.w) {
        player.x += player.xspeed;
    }
    if(player.y > centerFocusY+250){
        playing = false;
    }
}

function drawScore(){
    fill("black")
    textSize(50)
    textAlign(LEFT);
    score = ((Math.floor((ground.y)-(player.y+player.h)) > score) ? Math.floor((ground.y)-(player.y+player.h)) : score);
    text(score, 20, 60)
}
function drawGameOver(){
    fill(0,0,0,10);
    rect(0,0,500,500);    
    textAlign(CENTER);
    textSize(28);
    fill(255);
    text("Game Over",250,150)
    text("Score: "+ score, 250,250);
    text("Press Space to Restart",250,350)
}