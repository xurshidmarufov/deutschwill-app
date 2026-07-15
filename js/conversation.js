const PALETTE_STOPS = [
    { pos: 1.0, color: [124, 92, 255] },
    { pos: 0.0, color: [59, 130, 246] },
    { pos: -1.0, color: [37, 99, 235] }
];

function lerpColorAtY(y){

    for(let i=0;i<PALETTE_STOPS.length-1;i++){

        const a=PALETTE_STOPS[i];
        const b=PALETTE_STOPS[i+1];

        if(y<=a.pos && y>=b.pos){

            const t=(a.pos-y)/(a.pos-b.pos);

            const r=Math.round(a.color[0]+(b.color[0]-a.color[0])*t);
            const g=Math.round(a.color[1]+(b.color[1]-a.color[1])*t);
            const bl=Math.round(a.color[2]+(b.color[2]-a.color[2])*t);

            return `rgb(${r},${g},${bl})`;

        }

    }

    return "rgb(124,92,255)";

}

const STATE_PARAMS={

idle:{
rotYSpeed:0.12,
rotXSpeed:0.05,
jitter:0.006,
radiusMul:1
},

listening:{
rotYSpeed:0.30,
rotXSpeed:0.10,
jitter:0.016,
radiusMul:1.05
},

thinking:{
rotYSpeed:0.55,
rotXSpeed:0.05,
jitter:0.008,
radiusMul:1
},

speaking:{
rotYSpeed:0.22,
rotXSpeed:0.07,
jitter:0.010,
radiusMul:1
}

};

class Particle{

constructor(index,total){

const golden=Math.PI*(3-Math.sqrt(5));

const y=1-(index/(total-1))*2;

const radius=Math.sqrt(1-y*y);

const theta=golden*index;

this.x0=Math.cos(theta)*radius;
this.y0=y;
this.z0=Math.sin(theta)*radius;

this.phase=Math.random()*Math.PI*2;
this.freq=0.6+Math.random()*0.8;

this.seed=0.75+Math.random()*0.6;

this.color=lerpColorAtY(y);

}

project(time,cx,cy,R,rotY,rotX,jitter){

const live=1+Math.sin(time*this.freq+this.phase)*jitter;

let x=this.x0*live;
let y=this.y0*live;
let z=this.z0*live;

let x1=x*Math.cos(rotY)+z*Math.sin(rotY);
let z1=-x*Math.sin(rotY)+z*Math.cos(rotY);

let y2=y*Math.cos(rotX)-z1*Math.sin(rotX);
let z2=y*Math.sin(rotX)+z1*Math.cos(rotX);

this.sx=cx+x1*R;
this.sy=cy+y2*R;
this.depth=z2;

}

drawGlow(ctx){

const d=(this.depth+1)/2;

const size=(2.2+d*3.4)*this.seed;

ctx.globalAlpha=0.08+d*0.18;

ctx.fillStyle=this.color;

ctx.beginPath();
ctx.arc(this.sx,this.sy,size,0,Math.PI*2);
ctx.fill();

}

drawCore(ctx){

const d=(this.depth+1)/2;

const size=(1.1+d*2.0)*this.seed;

ctx.globalAlpha=0.35+d*0.65;

ctx.fillStyle=this.color;

ctx.beginPath();
ctx.arc(this.sx,this.sy,size,0,Math.PI*2);
ctx.fill();

}

}
class ParticleOrb{

constructor(canvasEl,count=260){

this.canvas=canvasEl;
this.ctx=canvasEl.getContext("2d");

this.t=0;

this.rotY=0;
this.rotX=0.35;

this.state="idle";

this._curParams={...STATE_PARAMS.idle};
this._targetParams=STATE_PARAMS.idle;

this.speechAmplitude=0;
this._ampTarget=0;
this._nextAmpChangeAt=0;

this.particles=Array.from(
{length:count},
(_,i)=>new Particle(i,count)
);

this.resize();

window.addEventListener(
"resize",
()=>this.resize()
);

}

resize(){

const rect=this.canvas.getBoundingClientRect();

const dpr=Math.min(
window.devicePixelRatio||1,
2
);

this.size=rect.width||220;

this.center=this.size/2;

this.canvas.width=this.size*dpr;
this.canvas.height=this.size*dpr;

this.ctx.setTransform(
dpr,
0,
0,
dpr,
0,
0
);

}

setState(state){

if(!STATE_PARAMS[state]) return;

this.state=state;

this._targetParams=STATE_PARAMS[state];

}

setSubtitle(german,uzbek){

const g=document.querySelector(".german");
const u=document.querySelector(".uzbek");

if(g) g.textContent=german||"";
if(u) u.textContent=uzbek||"";

}

setAudioLevel(level){

this._ampTarget=Math.max(
0,
Math.min(level,1)
);

}

updateAmplitude(dt){

if(this.state!=="speaking"){

this.speechAmplitude+=
(0-this.speechAmplitude)*0.08;

return;

}

this._nextAmpChangeAt-=dt;

if(this._nextAmpChangeAt<=0){

this._ampTarget=
0.3+Math.random()*0.7;

this._nextAmpChangeAt=
0.12+Math.random()*0.15;

}

this.speechAmplitude+=
(this._ampTarget-this.speechAmplitude)
*0.2;

}
  frame(now){

const dt=this.lastTime
?Math.min((now-this.lastTime)/1000,0.05)
:0.016;

this.lastTime=now;

for(const key of Object.keys(this._curParams)){

this._curParams[key]+=
(this._targetParams[key]-this._curParams[key])*0.05;

}

this.updateAmplitude(dt);

this.t+=dt;

this.rotY+=this._curParams.rotYSpeed*dt;

this.rotX=
0.35+
Math.sin(this.t*this._curParams.rotXSpeed)*0.12;

const breathe=
1+
Math.sin(this.t*1.4)*0.035;

let radiusMul=
this._curParams.radiusMul*breathe;

if(this.state==="speaking"){

radiusMul*=
0.92+
this.speechAmplitude*0.20;

}

const R=
this.center*
0.82*
radiusMul;

this.ctx.clearRect(
0,
0,
this.size,
this.size
);

for(const p of this.particles){

p.project(
this.t,
this.center,
this.center,
R,
this.rotY,
this.rotX,
this._curParams.jitter
);

}

this.particles.sort(
(a,b)=>a.depth-b.depth
);

this.ctx.filter="blur(5px)";

for(const p of this.particles){

p.drawGlow(this.ctx);

}

this.ctx.filter="none";

for(const p of this.particles){

p.drawCore(this.ctx);

}

this.ctx.globalAlpha=1;

requestAnimationFrame(
t=>this.frame(t)
);

}

}
document.addEventListener("DOMContentLoaded", () => {

const canvas = document.getElementById("orbCanvas");
const micBtn = document.getElementById("micBtn");
const micIcon = document.getElementById("micIcon");
const orbText = document.getElementById("orbText");
const subtitleBox = document.getElementById("subtitleBox");
const orbStage = document.getElementById("orbStage");
const browserWarning = document.getElementById("browserWarning");

if (!canvas) return;

const orb = new ParticleOrb(canvas,260);
orb.frame(performance.now());

const STOP_ICON =
'<rect x="6" y="6" width="12" height="12" rx="2"></rect>';

const MIC_ICON =
'<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>'+
'<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>'+
'<line x1="12" y1="19" x2="12" y2="23"></line>'+
'<line x1="8" y1="23" x2="16" y2="23"></line>';

function applyState(state){

orb.setState(state);

const active = state !== "idle";

orbText.classList.toggle("is-hidden",active);

subtitleBox.classList.toggle(
"is-hidden",
state !== "speaking"
);

micBtn.classList.toggle(
"mic-active",
state === "listening"
);

micIcon.innerHTML =
state==="listening"
?STOP_ICON
:MIC_ICON;

orbStage.classList.remove(
"state-listening",
"state-thinking",
"state-speaking"
);

if(state!=="idle"){
orbStage.classList.add("state-"+state);
}

}

const SpeechRecognitionAPI =
window.SpeechRecognition ||
window.webkitSpeechRecognition;

const synth =
window.speechSynthesis;

if(!SpeechRecognitionAPI || !synth){

browserWarning.classList.add("is-visible");

micBtn.disabled=true;

return;

}

const recognition =
new SpeechRecognitionAPI();

recognition.lang="de-DE";
recognition.interimResults=false;
recognition.maxAlternatives=1;

let isBusy=false;
  async function getWillResponse(userText){

// Bu vaqtinchalik.
// Keyin OpenAI API bilan almashtiriladi.

await new Promise(r=>setTimeout(r,800));

return{

german:"Das ist interessant! Erzähl mir mehr.",
uzbek:"Bu qiziq! Menga yana gapirib bering."

};

}

recognition.onstart=()=>{

applyState("listening");

};

recognition.onresult=async(event)=>{

const transcript=
event.results[0][0].transcript;

applyState("thinking");

const reply=
await getWillResponse(transcript);

orb.setSubtitle(
reply.german,
reply.uzbek
);

const utterance=
new SpeechSynthesisUtterance(
reply.german
);

utterance.lang="de-DE";

utterance.onstart=()=>{

applyState("speaking");

};

utterance.onend=()=>{

applyState("idle");

isBusy=false;

};

utterance.onerror=()=>{

applyState("idle");

isBusy=false;

};

synth.speak(utterance);

};

recognition.onerror=()=>{

applyState("idle");

isBusy=false;

};

recognition.onend=()=>{

if(orb.state==="listening"){

applyState("idle");

isBusy=false;

}

};

micBtn.addEventListener("click",()=>{

if(isBusy){

recognition.stop();

synth.cancel();

applyState("idle");

isBusy=false;

return;

}

isBusy=true;

try{

recognition.start();

}catch(e){

isBusy=false;

}

});

});
