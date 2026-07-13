const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 200;

canvas.width = SIZE;
canvas.height = SIZE;

const CENTER = SIZE / 2;

let time = 0;

const blobs = [

    {
        color:"#7C5CFF",
        x:CENTER,
        y:CENTER,
        radius:105,
        angle:0,
        speed:0.0035
    },

    {
        color:"#3B82F6",
        x:CENTER,
        y:CENTER,
        radius:100,
        angle:1.7,
        speed:0.0042
    },

    {
        color:"#8B5CF6",
        x:CENTER,
        y:CENTER,
        radius:95,
        angle:3.3,
        speed:0.0038
    },

    {
        color:"#2563EB",
        x:CENTER,
        y:CENTER,
        radius:102,
        angle:5.1,
        speed:0.0045
    }

];