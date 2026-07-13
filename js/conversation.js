const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 220;

canvas.width = SIZE;
canvas.height = SIZE;

const center = SIZE / 2;
const blobs = [

    {
        x:70,
        y:70,
        r:95,
        color:"#7C5CFF",
        vx:0.28,
        vy:0.22
    },

    {
        x:150,
        y:70,
        r:90,
        color:"#6EB8FF",
        vx:-0.24,
        vy:0.26
    },

    {
        x:150,
        y:150,
        r:85,
        color:"#8A6BFF",
        vx:-0.22,
        vy:-0.20
    },

    {
        x:70,
        y:150,
        r:88,
        color:"#5C8FFF",
        vx:0.25,
        vy:-0.24
    }

];
function drawBlob(blob){

    const gradient = ctx.createRadialGradient(

        blob.x,
        blob.y,
        0,

        blob.x,
        blob.y,
        blob.r

    );

    gradient.addColorStop(0, blob.color);

    gradient.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        blob.x,
        blob.y,
        blob.r,
        0,
        Math.PI * 2
    );

    ctx.fill();

}
function render(){

    ctx.clearRect(0,0,SIZE,SIZE);

    for(const blob of blobs){

        drawBlob(blob);

    }

}

render();

let t = 0;

function updateBlobs(){

    t += 0.008;

    blobs[0].x = 110 + Math.cos(t * 1.0) * 45;
    blobs[0].y = 110 + Math.sin(t * 1.2) * 35;

    blobs[1].x = 110 + Math.cos(t * 0.9 + 2) * 42;
    blobs[1].y = 110 + Math.sin(t * 1.1 + 2) * 40;

    blobs[2].x = 110 + Math.cos(t * 1.1 + 4) * 38;
    blobs[2].y = 110 + Math.sin(t * 0.9 + 4) * 42;

    blobs[3].x = 110 + Math.cos(t * 1.2 + 6) * 40;
    blobs[3].y = 110 + Math.sin(t * 1.0 + 6) * 38;

}

function animate(){

    updateBlobs();

    render();

    requestAnimationFrame(animate);

}

animate();
