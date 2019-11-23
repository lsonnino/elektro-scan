window.$ = window.jQuery = require('jquery');

const FPS = 60;
const speed = 0.25;
const amplitude = 7;
const baseRadius = 50;

class Loading {
    constructor(){
        this.canvas = document.getElementById("loading");
        this.canvas.setAttribute('width', '300');
        this.canvas.setAttribute('height', '300');

        this.width = this.canvas.width;
        this.height = this.canvas.height;

        this.lastFrameTime = Date.now();

        this.phase = 0;
        this.running = false;
    }

    start(){
        this.canvas.style.display = "block";
        this.running = true;

        window.requestAnimationFrame(this.draw.bind(this));
    }

    stop() {
        this.running = false;
        this.canvas.style.display = "none";
    }

    getGradient(context, color) {
        var gradient = context.createRadialGradient(
            this.width / 2, this.height / 2, baseRadius - amplitude -15,
            this.width / 2, this.height / 2, baseRadius + amplitude
        );

        gradient.addColorStop(0, "rgba(" + [color.r, color.g, color.b, 0].join(",") + ")");
        gradient.addColorStop(1, "rgba(" + [color.r, color.g, color.b, 0.7].join(",") + ")");

        return gradient;
    }

    drawSine(points, context, color) {
        context.fillStyle = this.getGradient(context, color);
        context.strokeStyle = "rgba(" + [color.r, color.g, color.b, 0.9].join(",") + ")";

        context.beginPath();

        context.moveTo(points[0].x, points[0].y);
        for (var i = 1; i < points.length; i++) {
            context.lineTo(points[i].x, points[i].y);
        }

        context.closePath();
        context.stroke();
        context.fill();
    }

    radialToCarthesian(theta, r){
        return {
            x: r * Math.cos(2 * Math.PI * theta / 360) + this.width / 2,
            y: r * Math.sin(2 * Math.PI * theta / 360) + this.height / 2
        };
    }

    getSine(phase, relativeFrequency){
        var points = [360];

        var theta;
        for(theta = 0 ; theta < 360 ; theta++){
            var r = baseRadius + amplitude * Math.sin(
                2 * Math.PI * relativeFrequency * theta / 360
                - speed * phase / (2 * Math.PI)
            );
            r = r * (1 + 0.1 * Math.sin(2 * Math.PI * theta / 360 + speed * (relativeFrequency / 10) * phase / (2 * Math.PI)));

            points[theta] = this.radialToCarthesian(theta, r);
        }

        return points;
    }

    draw() {
        if(!this.running){
            var context = this.canvas.getContext("2d");
            context.clearRect(0, 0, this.width, this.height);
            return;
        }

        if(Date.now() - this.lastFrameTime < 1000 / FPS){
            window.requestAnimationFrame(this.draw.bind(this));
            return;
        }

        this.lastFrameTime = Date.now();

        var context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.width, this.height);

        this.drawSine(this.getSine(this.phase, 3), context, {r: 255, g: 59, b: 48});
        this.drawSine(this.getSine(this.phase + this.width / 3, 4), context, {r: 66, g: 134, b: 244});
        this.drawSine(this.getSine(this.phase + 2 * this.width / 3, 5), context, {r: 0, g: 150, b: 131});
        this.phase++;

        window.requestAnimationFrame(this.draw.bind(this));
    }
}

module.exports = Loading;
