canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 200;

canvas.width = SIZE;
canvas.height = SIZE;

const CENTER = SIZE / 2;

const blobs = [

    {
        color:"#7C5CFF",
        x:70,
        y:70,
        radius:120,
        angle:0,
        speed:0.0038
    },

    {
        color:"#3B82F6",
        x:150,
        y:70,
        radius:115,
        angle:1.8,
        speed:0.0045
    },

    {
        color:"#8B5CF6",
        x:150,
        y:150,
        radius:118,
        angle:3.7,
        speed:0.0032
    },

    {
        color:"#2563EB",
        x:70,
        y:150,
        radius:120,
        angle:5.4,
        speed:0.0041
    }

];

let time = 0;
function drawBlob(blob){

    const gradient = ctx.createRadialGradient(

        blob.x,
        blob.y,
        blob.radius * 0.15,

        blob.x,
        blob.y,
        blob.radius * 1.4

    );

    gradient.addColorStop(0.00, blob.color);
    gradient.addColorStop(0.54, blob.color);
    gradient.addColorStop(0.75, blob.color + "99");
    gradient.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.save();

    ctx.translate(blob.x, blob.y);

    const sx = 1 + Math.sin(time * 0.02 + blob.angle) * 0.08;
    const sy = 1 + Math.cos(time * 0.02 + blob.angle) * 0.08;

    ctx.scale(sx, sy);

    ctx.fillStyle = gradient;

    ctx.beginPath();
    ctx.arc(
        0,
        0,
        blob.radius,
        0,
        Math.PI * 2
    );
    ctx.fill();

    ctx.restore();

}

function render(){

    ctx.clearRect(0,0,SIZE,SIZE);

    for(const blob of blobs){

        drawBlob(blob);

    }

}
function updateBlobs(){

    time++;

    const breath = (Math.sin(time * 0.02) + 1) / 2;

    blobs.forEach((blob,index)=>{

        const orbit =
            22 +
            Math.sin(time * 0.015 + index) * 10;

        blob.x =
            CENTER +
            Math.cos(time * blob.speed + blob.angle) * orbit +
            Math.sin(time * blob.speed * 2.3 + index) * 12;

        blob.y =
            CENTER +
            Math.sin(time * blob.speed * 1.4 + blob.angle) * orbit +
            Math.cos(time * blob.speed * 1.8 + index) * 12;

        const targetRadius =
            105 +
            breath * 18 +
            Math.sin(time * 0.03 + blob.angle) * 8 +
            Math.cos(time * 0.02 + index) * 4;

        blob.radius +=
            (targetRadius - blob.radius) * 0.08;

    });

}
 
