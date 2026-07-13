const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d", { alpha: true });

const SIZE = 200;
const DPR = window.devicePixelRatio || 1;

function resizeCanvas() {

    canvas.width = SIZE * DPR;
    canvas.height = SIZE * DPR;

    canvas.style.width = SIZE + "px";
    canvas.style.height = SIZE + "px";

    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

}

resizeCanvas();

const CONFIG = {

    size: SIZE,
    center: SIZE / 2,
    fps: 60,

    blobCount: 8,

    minRadius: 88,
    maxRadius: 110,

    orbitRadius: 24

};

let time = 0;

