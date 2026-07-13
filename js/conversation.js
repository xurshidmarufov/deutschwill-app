document.addEventListener("DOMContentLoaded", () => {

    const canvas = document.getElementById("orbCanvas");

    console.log("Canvas:", canvas);

    if (!canvas) {
        console.log("Canvas topilmadi");
        return;
    }

    const ctx = canvas.getContext("2d");

    canvas.width = 200;
    canvas.height = 200;


    ctx.fillStyle = "#7C5CFF";

    ctx.beginPath();

    ctx.arc(
        100,
        100,
        80,
        0,
        Math.PI * 2
    );

    ctx.fill();


});
