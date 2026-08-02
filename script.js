/* ===== سارة ❤️ — التفاعلات ===== */

/* ---------- إعدادات سريعة تقدر تغيّرها ---------- */
const CONFIG = {
  // تاريخ أول يوم عرفتها فيه (سنة، شهر-1، يوم)
  startDate: new Date(2024, 0, 1, 0, 0, 0),
};

/* ---------- خلفية القلوب ---------- */
const HEART_CHARS = ['❤', '💕', '💗', '🌹', '✨'];

function spawnHeart() {
  const bg = document.getElementById('heartsBg');
  if (!bg) return;
  const h = document.createElement('span');
  h.className = 'float-heart';
  h.textContent = HEART_CHARS[Math.floor(Math.random() * HEART_CHARS.length)];
  h.style.left = 2 + Math.random() * 92 + 'vw';
  h.style.fontSize = 14 + Math.random() * 26 + 'px';
  h.style.animationDuration = 9 + Math.random() * 9 + 's';
  bg.appendChild(h);
  setTimeout(() => h.remove(), 19000);
}
setInterval(spawnHeart, 700);
for (let i = 0; i < 8; i++) setTimeout(spawnHeart, i * 250);

/* ---------- بتلات الورد ---------- */
(function petals() {
  const box = document.getElementById('petals');
  if (!box) return;
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('i');
    p.className = 'petal';
    p.style.left = Math.random() * 94 + 'vw';
    p.style.animationDuration = 8 + Math.random() * 10 + 's';
    p.style.animationDelay = -Math.random() * 14 + 's';
    p.style.opacity = 0.25 + Math.random() * 0.4;
    box.appendChild(p);
  }
})();

/* ---------- فتح الجواب ---------- */
const envelope = document.getElementById('envelope');
const intro = document.getElementById('intro');
const content = document.getElementById('content');
let opened = false;

function openLetter() {
  if (opened) return;
  opened = true;
  envelope.classList.add('open');
  playMusic();
  setTimeout(() => {
    intro.classList.add('hide');
    content.hidden = false;
    initReveal();
    setTimeout(() => intro.remove(), 800);
  }, 1400);
}
envelope.addEventListener('click', openLetter);
document.querySelector('.tap-hint')?.addEventListener('click', openLetter);

/* ---------- ظهور الأقسام عند السكرول ---------- */
function initReveal() {
  const items = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => io.observe(el));
}

/* ---------- العداد ---------- */
function tick() {
  const diff = Date.now() - CONFIG.startDate.getTime();
  if (diff < 0) return;
  const s = Math.floor(diff / 1000);
  const set = (id, v) => {
    const el = document.getElementById(id);
    if (el) el.textContent = v.toLocaleString('ar-EG');
  };
  set('cDays', Math.floor(s / 86400));
  set('cHours', Math.floor(s / 3600) % 24);
  set('cMins', Math.floor(s / 60) % 60);
  set('cSecs', s % 60);
}
setInterval(tick, 1000);
tick();

/* ---------- زرار "لأ" الهرب ---------- */
const noBtn = document.getElementById('noBtn');
const noMsg = document.getElementById('noMsg');
const NO_TEXTS = [
  'أيوة 🙂',
  'فكري تاني 😄',
  'متأكدة؟ 🥺',
  'الزرار ده مش شغال 😅',
  'حاولي تاني 🏃',
  'عمرو دياب مش هيرضى 🎶',
  'ماشي… بس لأ 😂',
  'خلاص اضغطي أيوة ❤️',
];
let noCount = 0;

function runAway() {
  noCount++;
  noBtn.classList.add('runaway');

  const pad = 14;
  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxL = Math.max(pad, window.innerWidth - w - pad);
  const maxT = Math.max(pad, window.innerHeight - h - pad);

  noBtn.style.left = pad + Math.random() * (maxL - pad) + 'px';
  noBtn.style.top = pad + Math.random() * (maxT - pad) + 'px';

  // الزرار بيصغّر وبيبهت شوية كل مرة
  const scale = Math.max(0.55, 1 - noCount * 0.06);
  noBtn.style.transform = `scale(${scale})`;
  noBtn.style.opacity = Math.max(0.35, 1 - noCount * 0.07);

  noMsg.textContent = NO_TEXTS[Math.min(noCount - 1, NO_TEXTS.length - 1)];

  // زرار "أيوة" بيكبر
  const yes = document.getElementById('yesBtn');
  yes.style.transform = `scale(${Math.min(1.6, 1 + noCount * 0.08)})`;

  if (noCount >= 8) {
    noBtn.style.pointerEvents = 'none';
    noBtn.style.opacity = '0';
    noMsg.textContent = 'خلاص… اختفى 😄 مفيش غير أيوة ❤️';
  }
}
noBtn.addEventListener('mouseenter', runAway);
noBtn.addEventListener('click', (e) => { e.preventDefault(); runAway(); });
noBtn.addEventListener('touchstart', (e) => { e.preventDefault(); runAway(); }, { passive: false });

/* ---------- أيوة! ---------- */
const celebrate = document.getElementById('celebrate');
document.getElementById('yesBtn').addEventListener('click', () => {
  celebrate.hidden = false;
  startConfetti();
  burstHearts();
  playMusic();
});
document.getElementById('againBtn').addEventListener('click', () => {
  celebrate.hidden = true;
  stopConfetti();
});

function burstHearts() {
  for (let i = 0; i < 40; i++) setTimeout(spawnHeart, i * 60);
}

/* ---------- الكونفيتي ---------- */
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');
let pieces = [];
let confettiRAF = null;
const COLORS = ['#e0568a', '#a8285c', '#d9a441', '#ff9fbc', '#fff', '#f0d9a8'];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);

function startConfetti() {
  resizeCanvas();
  pieces = Array.from({ length: 160 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 6 + Math.random() * 8,
    h: 8 + Math.random() * 12,
    c: COLORS[Math.floor(Math.random() * COLORS.length)],
    vy: 1.5 + Math.random() * 3.5,
    vx: -1 + Math.random() * 2,
    rot: Math.random() * Math.PI * 2,
    vr: -0.1 + Math.random() * 0.2,
  }));
  if (!confettiRAF) drawConfetti();
}

function drawConfetti() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pieces.forEach((p) => {
    p.y += p.vy;
    p.x += p.vx;
    p.rot += p.vr;
    if (p.y > canvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.c;
    ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
    ctx.restore();
  });
  confettiRAF = requestAnimationFrame(drawConfetti);
}

function stopConfetti() {
  if (confettiRAF) cancelAnimationFrame(confettiRAF);
  confettiRAF = null;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

/* ---------- الموسيقى (لحن رومانسي مولّد بالكود — من غير أي ملف) ---------- */
let audioCtx = null;
let musicOn = false;
let melodyTimer = null;
const musicBtn = document.getElementById('musicBtn');

// لحن هادي بسيط (ترددات بالهرتز)
const MELODY = [
  [523.25, 0.4], [587.33, 0.4], [659.25, 0.6], [587.33, 0.4],
  [523.25, 0.6], [440.0, 0.8], [493.88, 0.4], [523.25, 1.0],
  [659.25, 0.4], [698.46, 0.4], [783.99, 0.6], [698.46, 0.4],
  [659.25, 0.8], [587.33, 1.0],
];

function playNote(freq, dur, startAt) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0, startAt);
  gain.gain.linearRampToValueAtTime(0.12, startAt + 0.06);
  gain.gain.exponentialRampToValueAtTime(0.001, startAt + dur);
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(startAt);
  osc.stop(startAt + dur + 0.1);
}

function scheduleMelody() {
  let t = audioCtx.currentTime + 0.1;
  MELODY.forEach(([f, d]) => {
    playNote(f, d, t);
    t += d;
  });
  const total = MELODY.reduce((a, [, d]) => a + d, 0);
  melodyTimer = setTimeout(scheduleMelody, total * 1000);
}

function playMusic() {
  if (musicOn) return;
  try {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    musicOn = true;
    musicBtn.classList.add('playing');
    scheduleMelody();
  } catch (e) {
    /* المتصفح مش سامح بالصوت — عادي */
  }
}

function stopMusic() {
  musicOn = false;
  musicBtn.classList.remove('playing');
  clearTimeout(melodyTimer);
  if (audioCtx) audioCtx.suspend();
}

musicBtn.addEventListener('click', () => (musicOn ? stopMusic() : playMusic()));
