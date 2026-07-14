const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const SIZE = 220;

canvas.width = SIZE;
canvas.height = SIZE;

const CENTER = SIZE / 2;
const ORB_RADIUS = 82;
const PARTICLE_COUNT = 600;

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

        const distance =
            Math.sqrt(Math.random()) * ORB_RADIUS;

        particles.push({

            x: CENTER + Math.cos(angle) * distance,

            y: CENTER + Math.sin(angle) * distance,

            radius: 1.5 + Math.random() * 1.5,

            color:
                COLORS[
                    Math.floor(
                        Math.random() * COLORS.length
                    )
                ]

        });

    }

}
