window.$ = window.jQuery = require('jquery');

const FPS = 60;
const speed = 0.15;
const sineY = 10;
const amplitude = 25;

var canvas = document.getElementById("footer");
var width = canvas.offsetWidth;
var height = canvas.offsetHeight;

var lastFrameTime = Date.now();

var phase = 0;

function getLinearGradient(context, color) {
    var grdient = context.createLinearGradient(0, height - (sineY + 2 * amplitude), 0, height);

    grdient.addColorStop(0, "rgba(" + [color.r, color.g, color.b, 0.7].join(",") + ")");
    grdient.addColorStop(1, "rgba(" + [color.r, color.g, color.b, 0].join(",") + ")");

    return grdient;
}

function drawPolygon(points, context, color) {
    context.fillStyle = getLinearGradient(context, color);

    context.beginPath();

    context.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        context.lineTo(points[i].x, points[i].y);
    }

    context.closePath();
    context.fill();
}

function getSine(phase, numberOfPoints, relativeFrequency){
    var points = [numberOfPoints + 2];

    var i;
    for(i = 0 ; i < numberOfPoints ; i += width / numberOfPoints){
        var yVal =
            amplitude * Math.sin(
                2 * Math.PI * relativeFrequency * i / width
                - speed * phase / (2 * Math.PI)
            )
            + height - (amplitude + sineY);
        yVal = yVal * (0.1 * Math.sin(2 * Math.PI * i / width + speed * (relativeFrequency / 10) * phase / (2 * Math.PI)) + 1);
        points[i] = {x: i, y: yVal};
    }
    points[i++] = {x: width, y: height};
    points[i] = {x: 0, y: height};

    return points;
}

function draw() {
    if(Date.now() - lastFrameTime < 1000 / FPS){
        window.requestAnimationFrame(draw);
        return;
    }

    lastFrameTime = Date.now();

    var context = canvas.getContext("2d");
    context.clearRect(0, 0, width, height);

    drawPolygon(getSine(phase, width, 3), context, {r: 255, g: 59, b: 48});
    drawPolygon(getSine(phase + width / 3, width, 5), context, {r: 66, g: 134, b: 244});
    drawPolygon(getSine(phase + 2 * width / 3, width, 7), context, {r: 0, g: 150, b: 131});
    phase++;

    window.requestAnimationFrame(draw);
}

$(document).ready(function () {
    window.requestAnimationFrame(draw);
});

function mouseOver(element) { // Called by index.html
    element.focus();
}

var textField = document.getElementById("text-field");
// Execute a function when the user releases a key on the keyboard
textField.addEventListener("keyup", function(event) {
    if (event.key == 'Enter') {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        // TODO: check Domain name
        window.location.href = 'not-supported.html' // TODO: implement DNS scan
    }
});
