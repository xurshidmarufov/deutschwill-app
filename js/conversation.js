const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const DPR = window.devicePixelRatio || 1;

function resizeCanvas(){

    const size = canvas.clientWidth;

    canvas.width = size * DPR;
    canvas.height = size * DPR;

    ctx.setTransform(DPR,0,0,DPR,0,0);

}

window.addEventListener("resize", resizeCanvas);

resizeCanvas();

let time = 0;

const blobs = [

    {
        color:"#7C5CFF",
        
        radius:110
        angle:0,
        speed:0.003
    },

    {
        color:"#6EB8FF",
        radius:105,
        angle:2,
        speed:0.0024
    },

    {
        color:"#C8F1FF",
        radius:90,
        angle:4,
        speed:0.0028
    },

    {
        color:"#5E52E8",
        radius:95,
        angle:5,
        speed:0.0019
    }

];

function draw(){

    time += 1;

    ctx.clearRect(0,0,220,220);

}
function drawBlob(blob,index){

    const x =
        110 +
        Math.cos(time * blob.speed + blob.angle) * 55;

    const y =
        110 +
        Math.sin(time * blob.speed + blob.angle) * 55;

    const gradient = ctx.createRadialGradient(

        x,
        y,
        0,

        x,
        y,
        blob.radius * 1.6

    );

   gradient.addColorStop(0.65, blob.color);
gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.globalCompositeOperation = "lighter";

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(

        x,

        y,

        blob.radius,

        0,

        Math.PI * 2

    );

    ctx.fill();

}
function animate(){

    ctx.clearRect(0,0,220,220);

    blobs.forEach(drawBlob);

    time++;

    requestAnimationFrame(animate);

}

animate();
