/* ==========================
        WILL ORB ENGINE
========================== */

const canvas = document.getElementById("orbCanvas");
const ctx = canvas.getContext("2d");

const orb = {

    particles: [],

    rotation: 0,

    tilt: 0.35,

    state: "idle",

    speechLevel: 0,

    targetSpeech: 0

};

const STATE = {

    idle:{
        speed:0.12,
        jitter:0.006,
        radius:1
    },

    listening:{
        speed:0.30,
        jitter:0.018,
        radius:1.05
    },

    thinking:{
        speed:0.55,
        jitter:0.009,
        radius:1
    },

    speaking:{
        speed:0.22,
        jitter:0.012,
        radius:1
    }

};

function resizeCanvas(){

    const size = canvas.clientWidth;

    const dpr = Math.min(window.devicePixelRatio || 1,2);

    canvas.width = size * dpr;
    canvas.height = size * dpr;

    ctx.setTransform(dpr,0,0,dpr,0,0);

}

resizeCanvas();

window.addEventListener("resize",resizeCanvas);
/* ==========================
      PARTICLE CREATION
========================== */

const COLORS = [
"#7C5CFF",
"#3B82F6",
"#2563EB"
];

function createParticles(){

    orb.particles=[];

    const total=260;

    const golden=Math.PI*(3-Math.sqrt(5));

    for(let i=0;i<total;i++){

        const y=1-(i/(total-1))*2;

        const r=Math.sqrt(1-y*y);

        const theta=golden*i;

        orb.particles.push({

            x:Math.cos(theta)*r,

            y:y,

            z:Math.sin(theta)*r,

            phase:Math.random()*Math.PI*2,

            speed:0.6+Math.random()*0.8,

            size:0.7+Math.random()*0.6,

            color:COLORS[
                Math.floor(Math.random()*COLORS.length)
            ]

        });

    }

}

createParticles();
/* ==========================
      PARTICLE ANIMATION
========================== */

function drawOrb(){

    const size = canvas.clientWidth;

    const center = size / 2;

    const cfg = STATE[orb.state];

    orb.rotation += cfg.speed * 0.01;

    ctx.clearRect(0,0,size,size);

    const particles = [];

    for(const p of orb.particles){

        const j =
        1 +
        Math.sin(
            performance.now()*0.001*p.speed +
            p.phase
        ) * cfg.jitter;

        let x = p.x * j;
        let y = p.y * j;
        let z = p.z * j;

        const ry = orb.rotation;

        const x1 =
        x*Math.cos(ry)+
        z*Math.sin(ry);

        const z1 =
        -x*Math.sin(ry)+
        z*Math.cos(ry);

        const rx = orb.tilt;

        const y2 =
        y*Math.cos(rx)-
        z1*Math.sin(rx);

        const z2 =
        y*Math.sin(rx)+
        z1*Math.cos(rx);

        particles.push({

            x:center+x1*90*cfg.radius,

            y:center+y2*90*cfg.radius,

            z:z2,

            size:(1.2+(z2+1)*1.2)*p.size,

            alpha:0.25+(z2+1)*0.35,

            color:p.color

        });

    }

    particles.sort((a,b)=>a.z-b.z);

    ctx.filter="blur(4px)";

    for(const p of particles){

        ctx.globalAlpha=p.alpha*0.35;

        ctx.fillStyle=p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size*2,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

    ctx.filter="none";

    for(const p of particles){

        ctx.globalAlpha=p.alpha;

        ctx.fillStyle=p.color;

        ctx.beginPath();

        ctx.arc(
            p.x,
            p.y,
            p.size,
            0,
            Math.PI*2
        );

        ctx.fill();

    }

    ctx.globalAlpha=1;

    requestAnimationFrame(drawOrb);

}

drawOrb();
/* ==========================
      UI + STATES
========================== */

const micBtn = document.getElementById("micBtn");
const micIcon = document.getElementById("micIcon");

const orbText = document.getElementById("orbText");
const subtitleBox = document.getElementById("subtitleBox");
const orbStage = document.getElementById("orbStage");

const STOP_ICON =
'<rect x="6" y="6" width="12" height="12" rx="2"></rect>';

const MIC_ICON =
'<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>'+
'<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>'+
'<line x1="12" y1="19" x2="12" y2="23"></line>'+
'<line x1="8" y1="23" x2="16" y2="23"></line>';

function setState(state){

    orb.state = state;

    const active = state !== "idle";

    if(orbText)
        orbText.classList.toggle(
            "is-hidden",
            active
        );

    if(subtitleBox)
        subtitleBox.classList.toggle(
            "is-hidden",
            state !== "speaking"
        );

    if(micBtn)
        micBtn.classList.toggle(
            "mic-active",
            state === "listening"
        );

    if(micIcon)
        micIcon.innerHTML =
            state==="listening"
            ?STOP_ICON
            :MIC_ICON;

    if(orbStage){

        orbStage.classList.remove(
            "state-idle",
            "state-listening",
            "state-thinking",
            "state-speaking"
        );

        orbStage.classList.add(
            "state-"+state
        );

    }

}

setState("idle");
/* ==========================
   SPEECH RECOGNITION
========================== */

const SpeechRecognition =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const speech =
SpeechRecognition
?new SpeechRecognition()
:null;

if(speech){

speech.lang="de-DE";
speech.interimResults=false;
speech.maxAlternatives=1;

speech.onstart=()=>{

setState("listening");

};

speech.onresult=(event)=>{

const text=
event.results[0][0].transcript;

console.log("User:",text);

window.userSpeech=text;

setState("thinking");

getAIResponse(text);

};

speech.onerror=()=>{

setState("idle");

};

speech.onend=()=>{

if(orb.state==="listening"){

setState("idle");

}

};

}else{

console.warn("Speech Recognition qo'llab-quvvatlanmaydi.");

}

if(micBtn){

micBtn.addEventListener("click",()=>{

if(!speech) return;

if(orb.state==="listening"){

speech.stop();

setState("idle");

return;

}

speech.start();

});

}
/* ==========================
      AI + TTS
========================== */

async function getAIResponse(userText){

try{

// Hozircha test javobi.
// Keyin OpenAI API bilan almashtiramiz.

await new Promise(resolve=>setTimeout(resolve,900));

const german =
"Das ist interessant. Erzähl mir bitte mehr.";

const uzbek =
"Bu qiziq. Menga yana ko'proq gapirib bering.";

const g =
document.querySelector(".german");

const u =
document.querySelector(".uzbek");

if(g) g.textContent = german;
if(u) u.textContent = uzbek;

setState("speaking");

const voice =
new SpeechSynthesisUtterance(german);

voice.lang = "de-DE";

voice.rate = 1;

voice.pitch = 1;

voice.onend = ()=>{

setState("idle");

};

speechSynthesis.cancel();

speechSynthesis.speak(voice);

}catch(err){

console.error(err);

setState("idle");

}

}
