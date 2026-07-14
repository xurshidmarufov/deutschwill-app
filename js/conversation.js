
/**
 * settingsBtn hozircha hech narsa qilmaydi - modal keyinroq qo'shiladi.
 */
document.getElementById("settingsBtn").addEventListener("click", () => {
  // TODO: sozlamalar oynasi keyinroq qo'shiladi
});

/* =========================================================
   PARTICLE ORB — sifat oshirildi: yumshoq rang o'tishi (band
   emas, uzluksiz interpolatsiya) + ikki bosqichli chizish
   (yumshoq halo qatlami + aniq zarralar) - "flat" ko'rinish
   o'rniga hajm va chuqurlik hissi beradi.
   ========================================================= */

const PALETTE_STOPS = [
  { pos: 1.0, color: [124, 92, 255] },   // #7C5CFF - yuqori qutb
  { pos: 0.0, color: [59, 130, 246] },   // #3B82F6 - ekvator
  { pos: -1.0, color: [37, 99, 235] },   // #2563EB - pastki qutb
];

function lerpColorAtY(y) {
  // y: -1..1 oralig'ida, PALETTE_STOPS orasida yumshoq interpolatsiya
  for (let i = 0; i < PALETTE_STOPS.length - 1; i++) {
    const a = PALETTE_STOPS[i], b = PALETTE_STOPS[i + 1];
    if (y <= a.pos && y >= b.pos) {
      const localT = (a.pos - y) / (a.pos - b.pos);
      const r = Math.round(a.color[0] + (b.color[0] - a.color[0]) * localT);
      const g = Math.round(a.color[1] + (b.color[1] - a.color[1]) * localT);
      const bl = Math.round(a.color[2] + (b.color[2] - a.color[2]) * localT);
      return `rgb(${r},${g},${bl})`;
    }
  }
  return "rgb(124,92,255)";
}

const STATE_PARAMS = {
  idle:      { rotYSpeed: 0.12, rotXSpeed: 0.05, jitter: 0.006, radiusMul: 1 },
  listening: { rotYSpeed: 0.30, rotXSpeed: 0.10, jitter: 0.016, radiusMul: 1.05 },
  thinking:  { rotYSpeed: 0.55, rotXSpeed: 0.05, jitter: 0.008, radiusMul: 1 },
  speaking:  { rotYSpeed: 0.22, rotXSpeed: 0.07, jitter: 0.010, radiusMul: 1 },
};

class Particle {
  constructor(index, total) {
    const gAngle = Math.PI * (3 - Math.sqrt(5));
    const y = 1 - (index / (total - 1)) * 2;
    const radiusAtY = Math.sqrt(1 - y * y);
    const theta = gAngle * index;

    this.x0 = Math.cos(theta) * radiusAtY;
    this.y0 = y;
    this.z0 = Math.sin(theta) * radiusAtY;

    this.jitterPhase = Math.random() * Math.PI * 2;
    this.jitterFreq = 0.6 + Math.random() * 0.8;
    this.sizeSeed = 0.75 + Math.random() * 0.6;

    this.color = lerpColorAtY(y);
  }

  project(t, cx, cy, R, rotY, rotX, jitterAmp) {
    const jit = 1 + Math.sin(t * this.jitterFreq + this.jitterPhase) * jitterAmp;
    let x = this.x0 * jit, y = this.y0 * jit, z = this.z0 * jit;

    let x1 = x * Math.cos(rotY) + z * Math.sin(rotY);
    let z1 = -x * Math.sin(rotY) + z * Math.cos(rotY);
    let y1 = y;

    let y2 = y1 * Math.cos(rotX) - z1 * Math.sin(rotX);
    let z2 = y1 * Math.sin(rotX) + z1 * Math.cos(rotX);
    let x2 = x1;

    this.sx = cx + x2 * R;
    this.sy = cy + y2 * R;
    this.depth = z2;
  }

  paintGlow(ctx) {
    const depthNorm = (this.depth + 1) / 2;
    const size = (2.2 + depthNorm * 3.4) * this.sizeSeed;
    ctx.globalAlpha = (0.08 + depthNorm * 0.18);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.sx, this.sy, size, 0, Math.PI * 2);
    ctx.fill();
  }

  paintCore(ctx) {
    const depthNorm = (this.depth + 1) / 2;
    const size = (1.1 + depthNorm * 2.0) * this.sizeSeed;
    ctx.globalAlpha = 0.35 + depthNorm * 0.65;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.sx, this.sy, size, 0, Math.PI * 2);
    ctx.fill();
  }
}

class ParticleOrb {
  constructor(canvasEl, count = 260) {
    this.canvas = canvasEl;
    this.ctx = canvasEl.getContext("2d");
    this.t = 0;
    this.rotY = 0;
    this.rotX = 0.35;

    this.state = "idle";
    this._curParams = { ...STATE_PARAMS.idle };
    this._targetParams = STATE_PARAMS.idle;

    this.speechAmplitude = 0;
    this._ampTarget = 0;
    this._nextAmpChangeAt = 0;

    this.particles = Array.from({ length: count }, (_, i) => new Particle(i, count));

    this._resize();
    window.addEventListener("resize", () => this._resize());
  }

  _resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.dim = rect.width || 220;
    this.mid = this.dim / 2;
    this.canvas.width = this.dim * dpr;
    this.canvas.height = this.dim * dpr;
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  setState(state) {
    if (!STATE_PARAMS[state]) return;
    this.state = state;
    this._targetParams = STATE_PARAMS[state];
  }

  /** Real TTS audio hajmidan (0..1) chaqiriladi - haqiqiy amplituda. */
  setAudioLevel(level) {
    this._ampTarget = Math.max(0, Math.min(1, level));
  }

  setSubtitle(german, uzbek) {
    const g = document.querySelector(".subtitle-box .german");
    const u = document.querySelector(".subtitle-box .uzbek");
    if (g) g.textContent = german || "";
    if (u) u.textContent = uzbek || "";
  }

  _updateSpeechAmplitude(dt) {
    if (this.state !== "speaking") {
      this.speechAmplitude += (0 - this.speechAmplitude) * 0.08;
      return;
    }
    // Agar setAudioLevel() haqiqiy ovozdan chaqirilmasa, tabiiy
    // simulyatsiya bilan davom etadi (fallback)
    this._nextAmpChangeAt -= dt;
    if (this._nextAmpChangeAt <= 0 && !this._usingRealAudio) {
      this._ampTarget = 0.3 + Math.random() * 0.7;
      this._nextAmpChangeAt = 0.12 + Math.random() * 0.15;
    }
    this.speechAmplitude += (this._ampTarget - this.speechAmplitude) * 0.2;
  }

  frame(now) {
    const dt = this._lastTime ? Math.min((now - this._lastTime) / 1000, 0.05) : 0.016;
    this._lastTime = now;

    for (const key of Object.keys(this._curParams)) {
      this._curParams[key] += (this._targetParams[key] - this._curParams[key]) * 0.05;
    }
    this._updateSpeechAmplitude(dt);

    this.t += dt;
    this.rotY += this._curParams.rotYSpeed * dt;
    this.rotX = 0.35 + Math.sin(this.t * this._curParams.rotXSpeed) * 0.12;

    const breathe = 1 + Math.sin(this.t * 1.4) * 0.035;
    let radiusMul = this._curParams.radiusMul * breathe;
    if (this.state === "speaking") {
      radiusMul *= 0.92 + this.speechAmplitude * 0.2;
    }
    const R = this.mid * 0.82 * radiusMul;

    this.ctx.clearRect(0, 0, this.dim, this.dim);

    for (const p of this.particles) {
      p.project(this.t, this.mid, this.mid, R, this.rotY, this.rotX, this._curParams.jitter);
    }
    this.particles.sort((a, b) => a.depth - b.depth);

    // 1-bosqich: yumshoq halo (blur) - hajm va nur hissi beradi
    this.ctx.filter = "blur(5px)";
    for (const p of this.particles) p.paintGlow(this.ctx);
    this.ctx.filter = "none";

    // 2-bosqich: aniq, keskin zarralar - shakl va detalni beradi
    for (const p of this.particles) p.paintCore(this.ctx);
    this.ctx.globalAlpha = 1;

    requestAnimationFrame((t) => this.frame(t));
  }
}

/* =========================================================
   HAQIQIY OVOZ ULANISHI (Web Speech API)
   ---------------------------------------------------------
   - Mikrofon bosilganda -> browser SpeechRecognition ishga tushadi
     -> orb "listening" holatiga o'tadi (HAQIQIY tinglash, demo emas)
   - Foydalanuvchi gapirib bo'lgach -> matn olinadi -> "thinking"
   - AI javobi (hozircha PLACEHOLDER funksiya) olinib,
     SpeechSynthesis orqali ovozga aylantiriladi -> "speaking"
   - Javob tugagach -> "idle"

   MUHIM: getWillResponse() hozircha soxta javob qaytaradi.
   Buni o'z AI backend/API chaqiruvingiz bilan almashtiring.
   ========================================================= */

async function getWillResponse(userText) {
  // TODO: bu yerga o'zingizning AI so'rovingizni ulang, masalan:
  // const res = await fetch('/api/will-chat', { method:'POST', body: JSON.stringify({ text: userText }) });
  // const data = await res.json();
  // return { german: data.germanReply, uzbek: data.uzbekReply };

  await new Promise((r) => setTimeout(r, 900)); // "o'ylash" kechikishi (demo)
  return {
    german: "Das ist interessant! Erzähl mir mehr.",
    uzbek: "Bu qiziq! Menga ko'proq gapirib bering.",
  };
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

  const orb = new ParticleOrb(canvas, 260);
  orb.frame(performance.now());

  const STOP_ICON = '<rect x="6" y="6" width="12" height="12" rx="2"></rect>';
  const MIC_ICON =
    '<path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>' +
    '<path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>' +
    '<line x1="12" y1="19" x2="12" y2="23"></line>' +
    '<line x1="8" y1="23" x2="16" y2="23"></line>';

  function applyState(state) {
    orb.setState(state);
    const active = state !== "idle";

    if (orbText) orbText.classList.toggle("is-hidden", active);
    if (subtitleBox) subtitleBox.classList.toggle("is-hidden", state !== "speaking");

    if (micBtn) micBtn.classList.toggle("mic-active", state === "listening");
    if (micIcon) micIcon.innerHTML = state === "listening" ? STOP_ICON : MIC_ICON;

    if (orbStage) {
      orbStage.classList.remove("state-listening", "state-thinking", "state-speaking");
      if (state !== "idle") orbStage.classList.add("state-" + state);
    }
  }

  // --- Speech Recognition (haqiqiy mikrofon) ---
  const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
  const synth = window.speechSynthesis;

  if (!SpeechRecognitionAPI || !synth) {
    if (browserWarning) browserWarning.classList.add("is-visible");
    if (micBtn) micBtn.disabled = true;
    return;
  }

  const recognition = new SpeechRecognitionAPI();
  recognition.lang = "de-DE";       // Will nemis tilida gapiradi
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isBusy = false; // listening/thinking/speaking jarayonida qayta bosishni oldini oladi

  recognition.onstart = () => applyState("listening");

  recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    applyState("thinking");

    const reply = await getWillResponse(transcript);
    orb.setSubtitle(reply.german, reply.uzbek);

    const utterance = new SpeechSynthesisUtterance(reply.german);
    utterance.lang = "de-DE";

    utterance.onstart = () => applyState("speaking");
    utterance.onend = () => { applyState("idle"); isBusy = false; };
    utterance.onerror = () => { applyState("idle"); isBusy = false; };

    synth.speak(utterance);
  };

  recognition.onerror = () => { applyState("idle"); isBusy = false; };
  recognition.onend = () => {
    // Agar hali javob kutilmasa (masalan hech narsa eshitilmadi), tinch holatga qaytaramiz
    if (orb.state === "listening") { applyState("idle"); isBusy = false; }
  };

  micBtn.addEventListener("click", () => {
    if (isBusy) {
      // Foydalanuvchi jarayonni bekor qilmoqchi
      recognition.stop();
      synth.cancel();
      applyState("idle");
      isBusy = false;
      return;
    }
    isBusy = true;
    try {
      recognition.start();
    } catch (e) {
      isBusy = false;
    }
  });
});
