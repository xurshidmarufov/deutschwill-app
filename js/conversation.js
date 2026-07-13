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

function updateBlobs(){

    for(const blob of blobs){

        blob.time += blob.speed;

        blob.x =
            110 +
            Math.cos(blob.time * 1.37) * 42 +
            Math.sin(blob.time * 2.41) * 18;

        blob.y =
            110 +
            Math.sin(blob.time * 1.11) * 46 +
            Math.cos(blob.time * 1.93) * 16;

        blob.r =
            118 +
            Math.sin(blob.time * 2.2) * 10;

    }

}

function animate(){

    updateBlobs();

    render();

    requestAnimationFrame(animate);

}

animate();
