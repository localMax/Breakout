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

window.onload = function() {
    document.body.appendChild(canvas);
    animate(step);
};

var step = function() {
    update();
    render();
    animate(step);
};

var update = function(){ 
};

var render = function() {
  context.fillStyle = "#00000";
  context.fillRect(0, 0, width, height);
};

//////////////////////////// All the objects
function Ball(x,y){
    this.x = x;
    this.y = y;
    this.x_speed =0;
    this.y_speed =3;
    this.radius = 5;
}

function Player(){
    this.paddle = new Paddle(175,580,50,10);
}

function Paddle(x,y,width,height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.x_speed = 0;
    this.y_speed = 0;
}

function Brick(){

}
