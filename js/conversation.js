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
        r:120,
        color:"#7C5CFF",
        time:12.4,
        speed:0.0052
    },

    {
        x:150,
        y:70,
        r:115,
        color:"#3B82F6",
        time:36.8,
        speed:0.0044
    },

    {
        x:150,
        y:150,
        r:118,
        color:"#8A6BFF",
        time:71.2,
        speed:0.0061
    },

    {
        x:70,
        y:150,
        r:122,
        color:"#2563EB",
        time:103.7,
        speed:0.0048
    }
{
    x:110,
    y:50,
    r:105,
    color:"#6B5CFF",
    time:145,
    speed:0.0042
},

{
    x:170,
    y:110,
    r:95,
    color:"#3B82F6",
    time:210,
    speed:0.0051
},

{
    x:110,
    y:170,
    r:100,
    color:"#8B5CFF",
    time:78,
    speed:0.0048
},

{
    x:50,
    y:110,
    r:98,
    color:"#2563EB",
    time:320,
    speed:0.0054
}
];
function drawBlob(blob){

    const gradient = ctx.createRadialGradient(

        blob.x,
        blob.y,
        blob.r * 0.15,

        blob.x,
        blob.y,
        blob.r * 1.45

    );

  gradient.addColorStop(0.00, blob.color);
gradient.addColorStop(0.60, blob.color);
gradient.addColorStop(0.90, blob.color + "44");
gradient.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.save();
ctx.filter = "none";
    ctx.globalCompositeOperation = "lighter";

    ctx.translate(blob.x, blob.y);

    const scaleX = 1 + Math.sin(blob.time * 2.1) * 0.08;
    const scaleY = 1 + Math.cos(blob.time * 1.8) * 0.08;

    ctx.scale(scaleX, scaleY);

    ctx.fillStyle = gradient;

    ctx.beginPath();

for(let i = 0; i <= 360; i += 8){

    const a = i * Math.PI / 180;

    const offset =
        Math.sin(blob.time * 2 + a * 5) * 5 +
        Math.cos(blob.time * 3 + a * 3) * 3;

    const r = blob.r + offset;

    const px = Math.cos(a) * r;
    const py = Math.sin(a) * r;

if(i === 0){

    ctx.moveTo(px, py);

}else{

    const prevA = (i - 8) * Math.PI / 180;

    const prevOffset =
        Math.sin(blob.time * 2 + prevA * 5) * 5 +
        Math.cos(blob.time * 3 + prevA * 3) * 3;

    const prevR = blob.r + prevOffset;

    const prevX = Math.cos(prevA) * prevR;
    const prevY = Math.sin(prevA) * prevR;

    ctx.quadraticCurveTo(

        prevX,
        prevY,

        (prevX + px) / 2,
        (prevY + py) / 2

    );

}

ctx.closePath();

ctx.fill();
ctx.filter = "none";
    ctx.restore();

}
function render(){

    ctx.clearRect(0,0,SIZE,SIZE);

    ctx.globalAlpha = 0.92;

    for(const blob of blobs){

        drawBlob(blob);

    }

    ctx.globalAlpha = 1;

}

render();

function updateBlobs(){

    for(const blob of blobs){

        blob.time += blob.speed;

        const a = blob.time;

        blob.x =
            110 +
            Math.cos(a * 1.1) * 28 +
            Math.sin(a * 2.3) * 14;

        blob.y =
            110 +
            Math.sin(a * 1.3) * 28 +
            Math.cos(a * 2.1) * 14;

        blob.r =
            105 +
            Math.sin(a * 1.7) * 18;

    }

}
function animate(){

    updateBlobs();

    ctx.filter = "blur(18px)";

    render();

    ctx.filter = "none";

    requestAnimationFrame(animate);

}

animate();
