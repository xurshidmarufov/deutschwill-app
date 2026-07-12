const particlesContainer = document.querySelector(".orb-particles");
for(let i = 0; i < 20; i++){

    const particle = document.createElement("span");

    particle.classList.add("particle");

    particlesContainer.appendChild(particle);

}
