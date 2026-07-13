document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("orbCanvas");

    // Canvas bo'lmasa JS hech narsani buzmaydi
    if (!canvas) return;


    const ctx = canvas.getContext("2d");


    const SIZE = 200;

    canvas.width = SIZE;
    canvas.height = SIZE;



    let time = 0;



    const blobs = [

        {
            color:"#9B8CFF",
            angle:0,
            speed:0.010,
            distance:25,
            radius:105
        },

        {
            color:"#7C5CFF",
            angle:2,
            speed:0.008,
            distance:30,
            radius:110
        },

        {
            color:"#5E7CFF",
            angle:4,
            speed:0.009,
            distance:25,
            radius:105
        },

        {
            color:"#38BDF8",
            angle:5,
            speed:0.007,
            distance:20,
            radius:95
        }

    ];



    function drawBlob(blob){


        const x =
            SIZE / 2 +
            Math.cos(
                time * blob.speed + blob.angle
            ) *
            blob.distance;



        const y =
            SIZE / 2 +
            Math.sin(
                time * blob.speed + blob.angle
            ) *
            blob.distance;



        const pulse =
            Math.sin(time * 0.03 + blob.angle) * 8;



        const radius =
            blob.radius + pulse;



        const gradient =
            ctx.createRadialGradient(
                x,
                y,
                0,
                x,
                y,
                radius
            );



        gradient.addColorStop(
            0,
            blob.color
        );


        gradient.addColorStop(
            0.55,
            blob.color + "DD"
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
            radius,
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


        ctx.globalCompositeOperation = "screen";


        blobs.forEach(drawBlob);



        ctx.globalCompositeOperation = "source-over";


        time++;


        requestAnimationFrame(animate);


    }



    animate();


});
