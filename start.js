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

var keysDown = {};

window.addEventListener("keydown", function(event) {
    keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});

var step = function() {
    update();
    render();
    animate(step);
};

var render = function() {

};