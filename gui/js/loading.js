window.$ = window.jQuery = require('jquery');

const FPS = 60;
const speed = 0.25;
const amplitude = 7;
const baseRadius = 50;

var canvas = document.getElementById("loading");
canvas.setAttribute('width', '300');
canvas.setAttribute('height', '300');
var width = canvas.width;
var height = canvas.height;

var lastFrameTime = Date.now();

var phase = 0;
var running = true;

function getGradient(context, color) {
    var gradient = context.createRadialGradient(
        width / 2, height / 2, baseRadius - amplitude -15,
        width / 2, height / 2, baseRadius + amplitude
    );

    gradient.addColorStop(0, "rgba(" + [color.r, color.g, color.b, 0].join(",") + ")");
    gradient.addColorStop(1, "rgba(" + [color.r, color.g, color.b, 0.7].join(",") + ")");

    return gradient;
}

function drawPolygon(points, context, color) {
    context.fillStyle = getGradient(context, color);

    context.beginPath();

    context.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.closePath();
    context.fill();
}

function radialToCarthesian(theta, r){
    return {
        x: r * Math.cos(2 * Math.PI * theta / 360) + width / 2,
        y: r * Math.sin(2 * Math.PI * theta / 360) + height / 2
    };
}

function getSine(phase, relativeFrequency){
    var points = [360];

    var theta;
    for(theta = 0 ; theta < 360 ; theta++){
        var r = baseRadius + amplitude * Math.sin(
            2 * Math.PI * relativeFrequency * theta / 360
            - speed * phase / (2 * Math.PI)
        );
        r = r * (1 + 0.1 * Math.sin(2 * Math.PI * theta / 360 + speed * (relativeFrequency / 10) * phase / (2 * Math.PI)));

        points[theta] = radialToCarthesian(theta, r);
    }

    return points;
}

function draw() {
    if(!running){
        var context = canvas.getContext("2d");
        context.clearRect(0, 0, width, height);
        return;
    }

    if(Date.now() - lastFrameTime < 1000 / FPS){
        window.requestAnimationFrame(draw);
        return;
    }

    lastFrameTime = Date.now();

    var context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    drawPolygon(getSine(phase, 3), context, {r: 255, g: 59, b: 48});
    drawPolygon(getSine(phase + width / 3, 5), context, {r: 66, g: 134, b: 244});
    drawPolygon(getSine(phase + 2 * width / 3, 7), context, {r: 0, g: 150, b: 131});
    phase++;

    window.requestAnimationFrame(draw);
}

$(document).ready(function () {
    window.requestAnimationFrame(draw);
});

function stop() {
    running = false;
}
