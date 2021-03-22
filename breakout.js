var animate = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback) {window.setTimeout(callback, 1000/60)};

var canvas = document.createElement('canvas');
var width = 1024;
var height = 768;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');
var player;
var ball;
var bricks;
var score;
var lives;
var state = "prelaod";
var btn;
var colors;
var level;
var brickCount;

window.onload = function() {
    document.body.appendChild(canvas);
    init();
    animate(step);
};

var step = function() {
    update();
    render();
    animate(step);
};

var update = function() {
    player.update();
    ball.update(player.paddle,bricks);
};

var render = function() {
    if(state == "end"){
        return;
    }
    context.fillStyle = "#00000";
    context.fillRect(0, 0, width, height);
    player.render();
    ball.render();
    for(var i = 0; i<16; i++){
        for(var j =0; j<16; j++){
            var brick = bricks[i][j];
            if(brick == null){
                continue;
            } 
            else{
                bricks[i][j].render();
            }
            context.fillStyle = "#000000"
        }
    }
    //alert(score + " , " + (width-context.measureText(score).width) + " , " + (height- 20));
    context.fillStyle = "#153e97"
    context.font = 'bold 48px Courier New';
    context.fillText(score,width-context.measureText(score).width,height-5);
    context.fillText(lives,5,height-5);
    context.fillText(level, width/2 - context.measureText(level).width/2, height-5);
    context.fillStyle = "#000000"
};

function endScreen(){
    //alert(width + " , " + height);
    context.fillStyle = "#323232";
    context.fillRect(100,100,824,568);
    var message = "You Scored: " + score;
    context.fillStyle = "#153e97"
    context.fillText(message,width/2-context.measureText(message).width/2,height/2);
    btn = document.createElement("BUTTON");
    btn.innerHTML = "Play Again";
    document.body.appendChild(btn);
    btn.addEventListener("click", onClick);
    btn.style="position:absolute; left:" + (width/2 + 50) + "px; top:" + (height/2 +100) + "px;";
}

function init(){
    player = new Player();
    ball = new Ball(512,600);
    bricks = new Array(16);
    for(i = 0; i< 16; i++){
        bricks[i] = new Array(16);
        for(j=0; j< 16; j++){
            var num = Math.floor((Math.random() * 50));
            if(num >= 5){
                num = 0;
            }
            bricks[i][j] = new Brick(i*64,j*24, num);
        }
    }
    brickCount = bricks.length * bricks[0].length;
    score = 0;
    lives = 5;
    level = 1;
    colors = new Array(5);
    colors[0] = '#6495ED';
    colors[1] = '#DC143C';
    colors[2] = '#7FFF00';
    colors[3] = '#8A2BE2';
    colors[4] = '#8B008B';
    state = "game";
}

function nextLevel(){
    bricks = new Array(16);
    for(i = 0; i< 16; i++){
        bricks[i] = new Array(16);
        for(j=0; j< 16; j++){
            bricks[i][j] = new Brick(i*64,j*24, Math.floor((Math.random() * 5)));
        }
    }
    brickCount = bricks.length * bricks[0].length;
    lives = 6 - level;
    level += 1;
}

function onClick(){
    btn.remove();
    init();
}

function endGame(score){
    state = "end";
    endScreen();
    //alert("Your score was: " + score);
}
//////////////////////////// Player input
var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});

//////////////////////////// All the objects
function Ball(x,y,aType){
    this.type = aType;
    this.x = x;
    this.y = y;
    this.x_speed =0;
    this.y_speed =3;
    this.radius = 5;
}
Ball.prototype.update = function(paddle,brickArray){
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x = this.x - 5;
    var top_y = this.y - 5;
    var bottom_x = this.x + 5;
    var bottom_y = this.y + 5;

    if(this.x - 5 < 0) { // hitting the left wall
      this.x = 5;
      this.x_speed = -this.x_speed;
    } else if(this.x + 5 > 1024) { // hitting the right wall
      this.x = 1024-5;
      this.x_speed = -this.x_speed;
    }
  
    if(this.y > 768 ) { // a point was scored
      //alert("point scored" + this.y);
      this.x_speed = 0;
      this.y_speed = 3;
      this.x = 512;
      this.y = 384;
      lives -= 1;
      if(lives == 0){
          endGame(score);
        }
    }

    if(this.y < 0) {
        this.y_speed = 3;
    }

    if(this.y <400){
        for(var i = brickArray.length-1; i>=0; i--){
            for(var j = 0; j<brickArray[i].length; j++){
                var brick = brickArray[i][j];
                if(brick == null){
                    continue;
                }
                else if(this.checkBounds(brick.x,brick.y,brick.width,brick.height)){
                    //alert("hit a brick: " + brick.x+" , "+brick.y + ";" + this.x + " , " + this.y);
                    this.onCollision(brickArray[i][j],player);
                    brickArray[i][j] = null;
                    brickCount -= 1;
                    if(brickCount == 0){
                        if(level == 5){
                            endGame(score);
                        }
                        else{
                            nextLevel();
                        }
                    }
                }
            }
        }
    }
    else if(this.y > 695){
        if(this.checkBounds(paddle.x,paddle.y,paddle.width,paddle.height)){
            this.y_speed = -3;
            this.x_speed += (paddle.x_speed/2);
            this.y += this.y_speed;
            flag = true;
        }
    }
};

Ball.prototype.onCollision = function(brick,player){
    if(brick.type == 0){
        this.y_speed = 3;
        this.x_speed = this.x_speed*-1/2 + Math.floor((Math.random()*5)-3);
        score += brick.value + this.x_speed + this.y_speed;
        score = parseInt(score);
    }
    else if(brick.type == 1){
        this.y_speed = 3;
        this.x_speed = 0;
        score += brick.value + this.x_speed + this.y_speed;
        score = parseInt(score);
    }
    else if(brick.type == 2){
        this.y_speed = 6;
        this.x_speed = this.x_speed*-1/2 + Math.floor((Math.random()*5)-3);
        score += brick.value + this.x_speed + this.y_speed;
        score = parseInt(score);
    }
    else if(brick.type == 3){
        this.y_speed = 3;
        this.x_speed = this.x_speed*-1/2 + Math.floor((Math.random()*5)-3);
        score += brick.value + this.x_speed + this.y_speed;
        score = parseInt(score);
        player.paddle.width += 5;
    }
    else if(brick.type == 4){
        this.y_speed = 3;
        this.x_speed = this.x_speed*-1/2 + Math.floor((Math.random()*5)-3);
        score += brick.value + this.x_speed + this.y_speed + 1000;
        score = parseInt(score);
    }
    else if(brick.type == 5){
        this.y_speed = 3;
        this.x_speed = this.x_speed*-1/2 + Math.floor((Math.random()*5)-3);
        score += brick.value + this.x_speed*2 + this.y_speed;
        score = parseInt(score);
        player.paddle.x_speed += 5;
    }
};

Ball.prototype.render = function() {
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle = "#FF0000";
    context.fill();
};

Ball.prototype.checkBounds = function(xPos,yPos,boxWidth,boxHeight){
    if(this.x+this.radius <= xPos){
        //alert(1);
        return false;
    }
    else if(this.x >= xPos+boxWidth){
        //alert(2);
        return false;
    }
    else if(this.y >= yPos + boxHeight){
        //alert(3);
        return false;
    }
    else if(this.y + this.radius  <= yPos){
        //alert(4);
        return false;
    }
    else{
        //alert("true");
        return true;
    }
};

function Player(){
    this.paddle = new Paddle(512,700,75,10);
}

Player.prototype.render = function() {
    this.paddle.render();
};

Player.prototype.update = function() {
    for(var key in keysDown) {
      var value = Number(key);
      if(value == 37) { // left arrow
        this.paddle.move(-7, 0);
      } else if (value == 39) { // right arrow
        this.paddle.move(7, 0);
      } else {
        this.paddle.move(0, 0);
      }
    }
  };

function Paddle(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

Paddle.prototype.render = function() {
    context.fillStyle = "#0000FF";
    context.fillRect(this.x,this.y,this.width,this.height);
};

Paddle.prototype.move = function(x, y) {
    this.x += x;
    this.y += y;
    this.x_speed = x;
    this.y_speed = y;
    if(this.x < 0) { // all the way to the left
      this.x = 0;
      this.x_speed = 0;
    } else if (this.x + this.width > 1024) { // all the way to the right
      this.x = 1024 - this.width;
      this.x_speed = 0;
    }
  }

function Brick(x,y,brickType){
    this.type = brickType
    this.x = x;
    this.y = y;
    this.width = 64;
    this.height = 24;
    this.value = 10;
}

Brick.prototype.render = function(){
    context.fillStyle = colors[this.type];
    context.fillRect(this.x,this.y,this.width,this.height);
    context.fillStyle = "#000000"
    context.strokeStyle = "#FFD700";
    context.strokeRect(this.x,this.y,this.width,this.height);
};
