const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

const SIZE = 200;
const DPR = window.devicePixelRatio || 1;

function resizeCanvas(){

    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;

    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";

    ctx.setTransform(DPR,0,0,DPR,0,0);

}

resizeCanvas();

const CONFIG = {

    size: SIZE,
    center: SIZE / 2,

    blobCount: 8,

    minRadius: 88,
    maxRadius: 110,

    orbitRadius: 24

};

let time = 0;

class Blob{

    constructor(color,angle,speed,radius){

        this.color = color;

        this.angle = angle;

        this.speed = speed;

        this.baseRadius = radius;

        this.radius = radius;

        this.x = CONFIG.center;
        this.y = CONFIG.center;

        this.seed = Math.random() * Math.PI * 2;

    }

    update(time){

        const orbit =
            CONFIG.orbitRadius +
            Math.sin(time * 0.012 + this.seed) * 8;

        this.x =
            CONFIG.center +
            Math.cos(time * this.speed + this.angle) * orbit;

        this.y =
            CONFIG.center +
            Math.sin(time * this.speed * 1.15 + this.angle) * orbit;

        const breath =
            (Math.sin(time * 0.02 + this.seed) + 1) * 0.5;

        this.radius =
            this.baseRadius +
            breath * 8;

    }

}

const blobs = [

    new Blob("#7C5CFF",0.0,0.0038,102),
    new Blob("#3B82F6",0.9,0.0042,98),
    new Blob("#8B5CF6",1.8,0.0035,104),
    new Blob("#2563EB",2.7,0.0045,100),

    new Blob("#6D5CFF",3.6,0.0039,96),
    new Blob("#4F8CFF",4.5,0.0041,103),
    new Blob("#7B68FF",5.4,0.0036,99),
    new Blob("#2F6BFF",6.2,0.0044,101)

];
