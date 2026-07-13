const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 200;

canvas.width = SIZE;
canvas.height = SIZE;


let time = 0;


const blobs = [

    {
        color:"#9B8CFF",
        angle:0,
        speed:0.012,
        radius:75,
        distance:28
    },

    {
        color:"#7C5CFF",
        angle:2,
        speed:0.009,
        radius:80,
        distance:35
    },

    {
        color:"#5E7CFF",
        angle:4,
        speed:0.011,
        radius:78,
        distance:32
    },

    {
        color:"#38BDF8",
        angle:5,
        speed:0.008,
        radius:65,
        distance:25
    }

];



function drawBlob(blob){


    const x =
        SIZE / 2 +
        Math.cos(
            time * blob.speed + blob.angle
        )
        *
        blob.distance;



    const y =
        SIZE / 2 +
        Math.sin(
            time * blob.speed + blob.angle
        )
        *
        blob.distance;



    const pulse =
        Math.sin(
            time * 0.025 + blob.angle
        ) * 8;



    const size =
        blob.radius + pulse;



    const gradient =
        ctx.createRadialGradient(
            x,
            y,
            0,
            x,
            y,
            size
        );


    gradient.addColorStop(
        0,
        blob.color
    );


    gradient.addColorStop(
        0.35,
        blob.color + "EE"
    );


    gradient.addColorStop(
        0.7,
        blob.color + "55"
    );


    gradient.addColorStop(
        1,
        "transparent"
    );



    ctx.fillStyle = gradient;



    ctx.beginPath();

    ctx.arc(
        x,
        y,
        size,
        0,
        Math.PI * 2
    );

    ctx.fill();

}




function drawGlow(){


    const glow =
    ctx.createRadialGradient(
        100,
        100,
        10,
        100,
        100,
        120
    );


    glow.addColorStop(
        0,
        "rgba(255,255,255,0.18)"
    );


    glow.addColorStop(
        1,
        "rgba(255,255,255,0)"
    );


    ctx.fillStyle = glow;


    ctx.beginPath();

    ctx.arc(
        100,
        100,
        100,
        0,
        Math.PI * 2
    );

    ctx.fill();


}



function animate(){


    ctx.clearRect(
        0,
        0,
        SIZE,
        SIZE
    );



    // yumshoq aralashish

    ctx.globalCompositeOperation = "screen";



    blobs.forEach(blob=>{

        drawBlob(blob);

    });



    ctx.globalCompositeOperation = "source-over";



    drawGlow();



    time++;


    requestAnimationFrame(animate);


}



animate();
