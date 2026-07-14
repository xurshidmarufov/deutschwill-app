const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 220;

canvas.width = SIZE;
canvas.height = SIZE;

const CENTER = SIZE / 2;

const PARTICLE_COUNT = 700;

const ORB_RADIUS = 90;

const COLORS = [
    "#7C5CFF",
    "#3B82F6",
    "#2563EB"
];

const particles = [];
function createParticles() {

    particles.length = 0;

    for (let i = 0; i < PARTICLE_COUNT; i++) {

        const angle = Math.random() * Math.PI * 2;

        // Markazga yaqin zarralar ko'proq,
        // chetlarga borgani sari kamayadi.
        const distance =
            Math.sqrt(Math.random()) * ORB_RADIUS;

        particles.push({

            angle: angle,

            distance: distance,

            x:
                CENTER +
                Math.cos(angle) * distance,

            y:
                CENTER +
                Math.sin(angle) * distance,

            radius:
                1.8 +
                Math.random() * 1.6,

            color:
                COLORS[
                    Math.floor(
                        Math.random() * COLORS.length
                    )
                ]

        });

    }

}
function render() {

    ctx.clearRect(0, 0, SIZE, SIZE);

    for (const particle of particles) {

        ctx.beginPath();

        ctx.fillStyle = particle.color;

        ctx.globalAlpha = 0.85;

        ctx.arc(

            particle.x,
            particle.y,
            particle.radius,
            0,
            Math.PI * 2

        );

        ctx.fill();

    }

    ctx.globalAlpha = 1;

}

createParticles();

render();
