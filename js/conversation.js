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

];
function drawBlob(blob){

    const gradient = ctx.createRadialGradient(

        blob.x,
        blob.y,
        blob.r * 0.15,

        blob.x,
        blob.y,
        blob.r

    );

    gradient.addColorStop(0.00, blob.color);
    gradient.addColorStop(0.40, blob.color);
    gradient.addColorStop(0.75, blob.color + "66");
    gradient.addColorStop(1.00, "rgba(0,0,0,0)");

    ctx.save();

    ctx.globalCompositeOperation = "screen";

    ctx.translate(blob.x, blob.y);

    const scaleX = 1 + Math.sin(blob.time * 2.1) * 0.08;
    const scaleY = 1 + Math.cos(blob.time * 1.8) * 0.08;

    ctx.scale(scaleX, scaleY);

    ctx.fillStyle = gradient;

    ctx.beginPath();

    ctx.arc(
        0,
        0,
        blob.r,
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

render();

function updateBlobs(){

    for(const blob of blobs){

        blob.time += blob.speed;

        const n1 = Math.sin(blob.time * 2.3);
        const n2 = Math.cos(blob.time * 1.7);
        const n3 = Math.sin(blob.time * 0.9);

        blob.x =
            110 +
            Math.cos(blob.time * 1.2) * 40 +
            n1 * 18 +
            n2 * 8;

        blob.y =
            110 +
            Math.sin(blob.time * 1.1) * 42 +
            n2 * 16 +
            n3 * 10;

        blob.r =
            118 +
            Math.sin(blob.time * 2.1) * 10 +
            Math.cos(blob.time * 1.4) * 6;

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
