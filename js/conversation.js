const particlesContainer = document.querySelector(".orb-particles");

for(let i = 0; i < 20; i++){

    const particle = document.createElement("span");

    particle.classList.add("particle");

    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    particlesContainer.appendChild(particle);

}
