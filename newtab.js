function getTodayString() {
  return new Date().toLocaleDateString("sv-SE");
}

let artAnimId = null;
let refreshCooldown = false;

const THEMES = ["auto", "dark", "light"];

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  const sunIcon = document.querySelector(".theme-icon-sun");
  const moonIcon = document.querySelector(".theme-icon-moon");
  const autoIcon = document.querySelector(".theme-icon-auto");
  sunIcon.style.display = "none";
  moonIcon.style.display = "none";
  autoIcon.style.display = "none";
  if (theme === "light") sunIcon.style.display = "block";
  else if (theme === "dark") moonIcon.style.display = "block";
  else autoIcon.style.display = "block";
  localStorage.setItem("theme", theme);
}

function cycleTheme() {
  const current = localStorage.getItem("theme") || "auto";
  const idx = THEMES.indexOf(current);
  applyTheme(THEMES[(idx + 1) % THEMES.length]);
}

// === 随机模式选择（概率不均等） ===

function pickMode() {
  const r = Math.random();
  if (r < 0.06) return "game";
  if (r < 0.14) return "art";
  if (r < 0.22) return "joke";
  if (r < 0.29) return "decide";
  if (r < 0.37) return "aiart";
  if (r < 0.42) return "easter";
  if (r < 0.49) return "npc";
  if (r < 0.56) return "absurd";
  if (r < 0.63) return "fakenews";
  if (r < 0.70) return "nottoday";
  if (r < 0.77) return "skill";
  if (r < 0.83) return "antichicken";
  if (r < 0.89) return "persona";
  return "nonsense";
}

document.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "auto";
  applyTheme(savedTheme);
  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  document.getElementById("dateText").textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`;

  renderToday();

  document.getElementById("refreshBtn").addEventListener("click", () => {
    if (refreshCooldown) return;
    refreshCooldown = true;
    document.getElementById("refreshBtn").disabled = true;
    setTimeout(() => { refreshCooldown = false; document.getElementById("refreshBtn").disabled = false; }, 3000);
    renderToday(true);
  });
  document.getElementById("settingsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
  });
  document.getElementById("retryBtn").addEventListener("click", () => renderToday(true));
  document.getElementById("themeBtn").addEventListener("click", cycleTheme);
});

function hideAll() {
  if (artAnimId) { cancelAnimationFrame(artAnimId); artAnimId = null; }
  document.getElementById("gameZone").style.display = "none";
  document.getElementById("gameZone").innerHTML = "";
  document.getElementById("artCanvas").style.display = "none";
  document.getElementById("jokeCard").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("errorMsg").style.display = "none";
  const g = document.getElementById("setupGuide");
  if (g) g.remove();
  const c = document.getElementById("customZone");
  if (c) c.remove();
  document.getElementById("modeBadge").textContent = "";
  document.getElementById("modeBadge").className = "mode-badge";
}

function renderToday(forceNew = false) {
  hideAll();
  const mode = pickMode();

  const badge = document.getElementById("modeBadge");
  const labels = {
    game:   { text: "🎮 疯批游戏",   cls: "game" },
    art:    { text: "🎨 精神污染",   cls: "art" },
    joke:   { text: "😂 冷笑话",     cls: "joke" },
    decide: { text: "🎲 帮你选",     cls: "decide" },
    aiart:  { text: "🖼️ 幻觉画展",    cls: "aiart" },
    easter: { text: "🥚 ???",        cls: "easter" },
    npc:    { text: "🤖 离谱对话",   cls: "npc" },
    absurd: { text: "🪐 离谱占卜",   cls: "absurd" },
    fakenews:{ text: "📰 假新闻",    cls: "fakenews" },
    nottoday:{ text: "🚫 今天不适合", cls: "nottoday" },
    skill:  { text: "⚡ 技能解锁",   cls: "skill" },
    antichicken: { text: "🐔 反鸡汤",  cls: "antichicken" },
    persona:{ text: "🎭 今日人设",   cls: "persona" },
    nonsense:{ text: "📝 废话文学",   cls: "nonsense" },
  };
  const l = labels[mode] || labels.game;
  badge.textContent = l.text;
  badge.className = "mode-badge " + l.cls;

  const renderers = { game: renderGame, art: renderArt, joke: renderJoke, decide: renderDecide, aiart: renderHallucination, easter: renderEaster, npc: renderNpc, absurd: renderAbsurd, fakenews: renderFakeNews, nottoday: renderNotToday, skill: renderSkill, antichicken: renderAntiChicken, persona: renderPersona, nonsense: renderNonsense };
  (renderers[mode] || renderers.game)();
}

// ========================
// 游戏：离谱版
// ========================

function renderGame() {
  const zone = document.getElementById("gameZone");
  zone.style.display = "block";
  zone.innerHTML = "";
  const r = Math.random();
  if (r < 0.5) renderCrazyMemoryGame(zone);
  else renderCrazyGuessGame(zone);
}

function renderCrazyMemoryGame(zone) {
  const emojis = ["🤡","💀","👁","🫠","🦑","🪱","🤮","🗿","🫀","🦴"];
  let pairs = [...emojis, ...emojis];
  shuffle(pairs);

  let flippedCards = [], matchedCount = 0, moves = 0, locked = false;
  const taunts = ["你认真的吗？","就这？","我奶奶都比你快","醒醒","别慌，越慌越慢","这是简单的部分","要不喝口水再来？","你的记忆力跟WiFi一样不稳定"];

  zone.innerHTML = `
    <div class="game-title">疯批翻牌</div>
    <div class="game-info" id="memoryInfo">翻到一样的配对！步数: 0 | ${taunts[0]}</div>
    <div class="card-grid cols-4" id="memoryGrid"></div>
  `;

  const grid = document.getElementById("memoryGrid");
  pairs.forEach((emoji, i) => {
    const card = document.createElement("div");
    card.className = "flip-card";
    card.dataset.index = i;
    card.innerHTML = `
      <div class="flip-card-inner">
        <div class="flip-card-front">?</div>
        <div class="flip-card-back">${emoji}</div>
      </div>
    `;
    card.addEventListener("click", () => {
      if (locked || card.classList.contains("flipped") || card.classList.contains("matched")) return;
      card.classList.add("flipped");
      flippedCards.push(card);

      if (flippedCards.length === 2) {
        moves++;
        const taunt = moves > 8 ? taunts[Math.floor(Math.random() * taunts.length)] : "";
        document.getElementById("memoryInfo").textContent = `翻到一样的配对！步数: ${moves} | ${taunt}`;
        locked = true;
        const [a, b] = flippedCards;
        if (a.querySelector(".flip-card-back").textContent === b.querySelector(".flip-card-back").textContent) {
          a.classList.add("matched"); b.classList.add("matched");
          matchedCount += 2; flippedCards = []; locked = false;
          if (matchedCount === pairs.length) {
            const verdict = moves <= 12 ? "🧠 你脑子没坏！" : moves <= 20 ? "还行，但也就那样" : "💀 这个步数...你确定你清醒的？";
            document.getElementById("memoryInfo").textContent = `${verdict}（${moves} 步）`;
          }
        } else {
          setTimeout(() => { a.classList.remove("flipped"); b.classList.remove("flipped"); flippedCards = []; locked = false; }, 600);
        }
      }
    });
    grid.appendChild(card);
  });
}

function renderCrazyGuessGame(zone) {
  const targets = [
    { range: "一个离谱的数字", min: -999, max: 999 },
    { range: "一个精神状态指数", min: -100, max: 100 },
    { range: "你还有多少根头发", min: 0, max: 10000 },
  ];
  const t = targets[Math.floor(Math.random() * targets.length)];
  const target = Math.floor(Math.random() * (t.max - t.min + 1)) + t.min;
  let guesses = [], won = false;

  const hints = {
    high: ["大了大了！冷静点","你是不是对所有事都这么夸张？","往回收一收，别那么贪","数字不是越大越好"],
    low: ["小了！胆子大点","你是不是对什么都太保守了？","格局小了","再大胆一点"],
  };

  zone.innerHTML = `
    <div class="game-title">疯批猜数字</div>
    <div class="game-info">猜${t.range}（${t.min}~${t.max}）</div>
    <div class="guess-zone">
      <div class="guess-input-row">
        <input type="number" class="guess-input" id="guessInput" min="${t.min}" max="${t.max}" placeholder="?">
        <button class="guess-btn" id="guessBtn">猜</button>
      </div>
      <div class="guess-history" id="guessHistory"></div>
      <div class="guess-result" id="guessResult"></div>
    </div>
  `;

  const input = document.getElementById("guessInput");
  const btn = document.getElementById("guessBtn");
  const history = document.getElementById("guessHistory");
  const result = document.getElementById("guessResult");

  function doGuess() {
    if (won) return;
    const n = parseInt(input.value);
    if (isNaN(n)) return;
    input.value = "";
    const tag = document.createElement("span");
    tag.className = "guess-tag";
    if (n === target) {
      tag.textContent = `${n} ✓`; tag.className = "guess-tag correct"; won = true; btn.disabled = true;
      const verdict = guesses.length + 1 <= 3 ? "🧠 读取了你的脑电波" : guesses.length + 1 <= 7 ? "还行，算你有点直觉" : "💀 这么多次...数字都快认识你了";
      result.textContent = verdict;
    } else if (n > target) {
      const h = hints.high[Math.floor(Math.random() * hints.high.length)];
      tag.textContent = `${n} ${h}`; tag.className = "guess-tag high";
    } else {
      const h = hints.low[Math.floor(Math.random() * hints.low.length)];
      tag.textContent = `${n} ${h}`; tag.className = "guess-tag low";
    }
    guesses.push(n); history.appendChild(tag); input.focus();
  }
  btn.addEventListener("click", doGuess);
  input.addEventListener("keydown", e => { if (e.key === "Enter") doGuess(); });
  input.focus();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ========================
// 精神污染：全疯模式
// ========================

function renderArt() {
  const canvas = document.getElementById("artCanvas");
  canvas.style.display = "block";
  const size = Math.min(560, window.innerWidth - 48);
  canvas.width = size; canvas.height = size;
  const r = Math.random();
  if (r < 0.20) renderEmojiRain(canvas);
  else if (r < 0.40) renderGlitchArt(canvas);
  else if (r < 0.60) renderBouncingText(canvas);
  else if (r < 0.80) renderMeltdown(canvas);
  else renderScreaming(canvas);
}

function renderEmojiRain(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const emojis = ["🤡","💩","🔥","💀","👁","👁️","🦷","🫠","🤯","🧠","🦑","🍆","🫏","🪱","🦠","🫧","🪩","🗿","🫠","🤮","🦴","🫀","🧩","🪅"];
  const fontSize = 28;
  const cols = Math.floor(w / fontSize);
  const drops = Array(cols).fill(0).map(() => Math.random() * -20);
  const speed = Array(cols).fill(0).map(() => 0.5 + Math.random() * 1.5);
  const emojiCols = Array(cols).fill(0).map(() => emojis[Math.floor(Math.random() * emojis.length)]);

  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  function draw() {
    ctx.fillStyle = isDark ? "rgba(15,15,26,0.12)" : "rgba(245,243,239,0.12)";
    ctx.fillRect(0, 0, w, h);
    ctx.font = fontSize + "px serif";
    for (let i = 0; i < cols; i++) {
      ctx.fillText(emojiCols[i], i * fontSize, drops[i] * fontSize);
      drops[i] += speed[i];
      if (drops[i] * fontSize > h && Math.random() > 0.95) {
        drops[i] = 0;
        emojiCols[i] = emojis[Math.floor(Math.random() * emojis.length)];
        speed[i] = 0.5 + Math.random() * 1.5;
      }
    }
    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderGlitchArt(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const bg = isDark ? "#0f0f1a" : "#f5f3ef";
  const colors = ["#ff006e","#fb5607","#ffbe0b","#3a86ff","#8338ec","#06d6a0","#ef476f","#118ab2"];
  let frame = 0;

  function draw() {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    frame++;

    if (frame % 3 === 0) {
      const strips = 5 + Math.floor(Math.random() * 15);
      for (let i = 0; i < strips; i++) {
        const y = Math.random() * h;
        const sh = 2 + Math.random() * 30;
        const offsetX = (Math.random() - 0.5) * 60;
        const imgData = ctx.getImageData(0, Math.max(0, y), w, Math.min(sh, h - y));
        ctx.putImageData(imgData, offsetX, y);
      }
    }

    if (frame % 2 === 0) {
      const shapes = 3 + Math.floor(Math.random() * 8);
      for (let i = 0; i < shapes; i++) {
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)] + (Math.random() * 0.4 + 0.1).toFixed(1);
        const x = Math.random() * w, y = Math.random() * h;
        const sw = 10 + Math.random() * 120, sh = 2 + Math.random() * 40;
        ctx.fillRect(x, y, sw, sh);
      }
    }

    if (Math.random() < 0.15) {
      ctx.font = `${20 + Math.random() * 40}px monospace`;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      const glitchTexts = ["ERROR","404","???","HELP","NaN","undefined","∞","NOPE","AHHH","!!!","404","BUG","💀","AAAA"];
      ctx.fillText(glitchTexts[Math.floor(Math.random() * glitchTexts.length)], Math.random() * w, Math.random() * h);
    }

    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderBouncingText(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  const words = [
    { text: "啊？？", size: 52 }, { text: "救命", size: 44 }, { text: "等等", size: 38 },
    { text: "不是", size: 48 }, { text: "离谱", size: 56 }, { text: "啊这", size: 42 },
    { text: "算了", size: 36 }, { text: "草", size: 72 }, { text: "？？？", size: 50 },
    { text: "完了", size: 46 }, { text: "不要", size: 40 }, { text: "嗯？", size: 44 },
    { text: "啊对对对", size: 34 }, { text: "我裂开", size: 38 }, { text: "好家伙", size: 36 },
    { text: "寄", size: 64 }, { text: "6", size: 80 }, { text: "？？", size: 60 },
    { text: "救命啊", size: 48 }, { text: "摆烂", size: 44 }, { text: "阿巴阿巴", size: 32 },
  ];
  const colors = ["#ff006e","#fb5607","#ffbe0b","#3a86ff","#8338ec","#06d6a0","#ef476f","#ff0000"];

  const balls = words.map(w => ({
    x: Math.random() * (canvas.width - 100) + 50,
    y: Math.random() * (canvas.height - 100) + 50,
    vx: (Math.random() - 0.5) * 6,
    vy: (Math.random() - 0.5) * 6,
    text: w.text,
    size: w.size,
    color: colors[Math.floor(Math.random() * colors.length)],
    rot: 0,
    rotV: (Math.random() - 0.5) * 0.15,
    scale: 1,
    scaleV: (Math.random() - 0.5) * 0.02,
  }));

  function draw() {
    ctx.fillStyle = isDark ? "rgba(15,15,26,0.15)" : "rgba(245,243,239,0.15)";
    ctx.fillRect(0, 0, w, h);
    for (const b of balls) {
      b.x += b.vx; b.y += b.vy; b.rot += b.rotV;
      b.scale += b.scaleV;
      if (b.scale > 1.3 || b.scale < 0.7) b.scaleV *= -1;
      if (b.x < 20 || b.x > w - 20) { b.vx *= -1.05; b.color = colors[Math.floor(Math.random() * colors.length)]; }
      if (b.y < 20 || b.y > h - 20) { b.vy *= -1.05; b.color = colors[Math.floor(Math.random() * colors.length)]; }
      const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
      if (speed > 12) { b.vx *= 0.9; b.vy *= 0.9; }
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.rotate(b.rot);
      ctx.scale(b.scale, b.scale);
      ctx.font = `bold ${b.size}px -apple-system, sans-serif`;
      ctx.fillStyle = b.color;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;
      ctx.fillText(b.text, 0, 0);
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderMeltdown(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  let t = 0;
  const colors = ["#ff0000","#ff6600","#ffcc00","#ff00ff","#00ffff","#ff0066"];
  const screamTexts = ["A","H","H","H","!","!","!","?","?","?","NO","WHY","HELP","AAA","!!!","NaN","404","F"];
  const blobs = Array.from({ length: 30 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: 20 + Math.random() * 80,
    color: colors[Math.floor(Math.random() * colors.length)],
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 2 + 1,
    phase: Math.random() * Math.PI * 2,
  }));

  function draw() {
    ctx.fillStyle = `rgba(0,0,0,0.06)`;
    ctx.fillRect(0, 0, w, h);
    t += 0.03;

    for (const b of blobs) {
      b.x += b.vx + Math.sin(t + b.phase) * 2;
      b.y += b.vy;
      if (b.y > h + b.r) { b.y = -b.r; b.x = Math.random() * w; }
      if (b.x < -b.r || b.x > w + b.r) b.vx *= -1;

      const pulsedR = b.r + Math.sin(t * 3 + b.phase) * 10;
      const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(1, pulsedR));
      grad.addColorStop(0, b.color + "cc");
      grad.addColorStop(0.5, b.color + "44");
      grad.addColorStop(1, b.color + "00");
      ctx.beginPath();
      ctx.arc(b.x, b.y, Math.max(1, pulsedR), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();
    }

    if (Math.random() < 0.3) {
      ctx.font = `bold ${30 + Math.random() * 60}px monospace`;
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.globalAlpha = 0.3 + Math.random() * 0.5;
      ctx.save();
      ctx.translate(Math.random() * w, Math.random() * h);
      ctx.rotate((Math.random() - 0.5) * 1.5);
      ctx.fillText(screamTexts[Math.floor(Math.random() * screamTexts.length)], 0, 0);
      ctx.restore();
      ctx.globalAlpha = 1;
    }

    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderScreaming(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  let t = 0;
  const faces = Array.from({ length: 12 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    size: 30 + Math.random() * 50,
    vx: (Math.random() - 0.5) * 5,
    vy: (Math.random() - 0.5) * 5,
    mouthOpen: Math.random(),
    phase: Math.random() * Math.PI * 2,
    hue: Math.random() * 360,
  }));

  function drawFace(f) {
    ctx.save();
    ctx.translate(f.x, f.y);
    const squeeze = 1 + Math.sin(t * 4 + f.phase) * 0.15;
    ctx.scale(squeeze, 2 - squeeze);

    ctx.beginPath();
    ctx.arc(0, 0, f.size / 2, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${f.hue}, 70%, 60%)`;
    ctx.fill();
    ctx.strokeStyle = `hsl(${f.hue}, 70%, 40%)`;
    ctx.lineWidth = 2;
    ctx.stroke();

    const eyeY = -f.size * 0.12;
    const eyeSpread = f.size * 0.18;
    const eyeSize = f.size * 0.08;
    const panic = Math.sin(t * 5 + f.phase) * 0.5 + 0.5;
    ctx.fillStyle = "#fff";
    ctx.beginPath(); ctx.arc(-eyeSpread, eyeY, eyeSize * (1 + panic), 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeSpread, eyeY, eyeSize * (1 + panic), 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#000";
    ctx.beginPath(); ctx.arc(-eyeSpread, eyeY, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(eyeSpread, eyeY, eyeSize * 0.4, 0, Math.PI * 2); ctx.fill();

    const mouthH = f.size * 0.15 * (1 + Math.sin(t * 6 + f.phase) * 0.5);
    const mouthW = f.size * 0.2;
    ctx.beginPath();
    ctx.ellipse(0, f.size * 0.15, mouthW, mouthH, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#300";
    ctx.fill();

    ctx.restore();
  }

  function draw() {
    ctx.fillStyle = "rgba(10,0,0,0.08)";
    ctx.fillRect(0, 0, w, h);
    t += 0.02;

    for (const f of faces) {
      f.x += f.vx; f.y += f.vy;
      f.hue += 0.5;
      if (f.x < f.size / 2 || f.x > w - f.size / 2) { f.vx *= -1.1; f.hue = Math.random() * 360; }
      if (f.y < f.size / 2 || f.y > h - f.size / 2) { f.vy *= -1.1; f.hue = Math.random() * 360; }
      const speed = Math.sqrt(f.vx * f.vx + f.vy * f.vy);
      if (speed > 10) { f.vx *= 0.9; f.vy *= 0.9; }
      drawFace(f);
    }

    if (Math.random() < 0.05) {
      ctx.font = `bold ${20 + Math.random() * 30}px monospace`;
      ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 60%)`;
      ctx.fillText("AAAAA", Math.random() * w, Math.random() * h);
    }

    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

// ========================
// 冷笑话（免费 API）
// ========================

function renderJoke() {
  const jokeCard = document.getElementById("jokeCard");
  const jokeSetup = document.getElementById("jokeSetup");
  const jokeRevealBtn = document.getElementById("jokeRevealBtn");
  const jokePunchline = document.getElementById("jokePunchline");
  const loading = document.getElementById("loading");

  jokeCard.style.display = "none";
  jokePunchline.style.display = "none";
  jokeRevealBtn.style.display = "inline-block";
  loading.style.display = "flex";

  const port = chrome.runtime.connect({ name: "jokeStream" });
  let fullText = "", streamStarted = false, settled = false;

  port.onDisconnect.addListener(() => {
    if (settled) return;
    settled = true;
    // port 断开但没收到 done/error，用内置笑话
    loading.style.display = "none";
    jokeCard.style.display = "block";
    jokeRevealBtn.style.display = "inline-block";
    jokeSetup.textContent = "连接中断，这是一条备用笑话";
    jokePunchline.textContent = "程序员最讨厌的四件事：写注释、写文档、别人不写注释、别人不写文档";
    jokeRevealBtn.onclick = () => { jokePunchline.style.display = "block"; jokeRevealBtn.style.display = "none"; };
  });

  port.onMessage.addListener((msg) => {
    if (settled) return;
    if (msg.type === "stream") {
      if (!streamStarted) {
        streamStarted = true; loading.style.display = "none"; jokeCard.style.display = "block";
        jokeSetup.textContent = "生成中..."; jokeRevealBtn.style.display = "none";
      }
      fullText = msg.text;
    }
    if (msg.type === "done") {
      settled = true;
      loading.style.display = "none"; jokeCard.style.display = "block"; jokeRevealBtn.style.display = "inline-block";
      const setup = msg.data.setup || msg.data.content || fullText;
      const punchline = msg.data.punchline || msg.data.footer || "";
      jokeSetup.textContent = setup; jokePunchline.textContent = punchline;
      jokeRevealBtn.onclick = () => { jokePunchline.style.display = "block"; jokeRevealBtn.style.display = "none"; };
    }
    if (msg.type === "error") {
      settled = true;
      loading.style.display = "none";
      document.getElementById("errorText").textContent = msg.error;
      document.getElementById("errorMsg").style.display = "flex";
    }
  });
}

// ========================
// 随机决策器（离谱版）
// ========================

function renderDecide() {
  const zone = createCustomZone();
  const categories = [
    { name: "今天怎么活", items: ["装死","原地飞升","变成蘑菇","进入省电模式","光合作用","假装自己是NPC","时空冻结5分钟","启动紧急摆烂协议","召唤替身代班","物理断联24小时","灵魂出窍30秒","启动全自动呼吸模式","把自己折叠放好","假装是植物","进入待机状态","跟空气握手言和","把自己寄到明天","变成一朵云飘走","开启隐身模式（精神上）","降维打击自己"] },
    { name: "如何面对人类", items: ["翻译成猫语再回复","全程用emoji沟通","假装信号不好","发一张风景图说「收到」","把消息转发给Siri处理","回复「嗯」然后反悔","假装是AI客服","每句话后面加个「汪」","只回一个句号","装作已读不回","突然开始做拉伸","说「我马桶好像在叫我了」然后消失","假装自己在加载中","突然用第三人称说话","假装手机屏幕碎了看不清","每句话前加「本宫」","回复一段乱码然后说「发错了」","假装在开会（其实在被窝里）","说「让我问问我的律师」","发一张黑屏截图说「信号不好」"] },
    { name: "怎么处理麻烦", items: ["假装没看见","把问题扔给平行宇宙的自己","对着问题念咒","给问题起个名字然后跟它谈判","把问题写下来然后吃掉","假装问题是feature","把问题转发给12345","对问题说「你被开除了」","用意念把问题推到明天","给问题烧纸钱","假装问题是NPC的任务","把问题放进回收站然后清空","跟问题说「我们改天再聊」","给问题发律师函","用胶带把问题封起来","假装问题是另一个人的","把问题缩小到看不见","跟问题说「你谁啊」","让问题自己解决自己","给问题设个闹钟让明天的自己处理"] },
    { name: "晚饭吃什么", items: ["空气","月光","WiFi信号","自己的口水","回忆里的味道","冰箱里的光","外卖小哥的微笑","昨天剩的寂寞","煮熟的焦虑","一碗空虚","冷冻的下午","微波炉转三圈的什么都可以","泡面但假装是法餐","跟隔壁借点灵魂","电饭煲开盲盒","把所有调料混在一起看命运安排","便利店第三个货架从左数第五个","闭眼在菜单上随便指","让外卖员替你决定","随便，但不能是上次那个随便"] },
    { name: "人生下一步", items: ["原地旋转三圈","学会跟蚊子交流","给未来的自己发个信号","找一棵树倾诉","在水坑里照镜子思考","把手机语言换成阿拉伯语用一天","跟邻居家的猫交换人生观","闭着眼走十步看看命运带你到哪","在纸上画一条路然后假装走完","给月亮发一条消息","学一种没用的技能","假装自己是纪录片的主角","在公园长椅上坐到有人来搭话","写一首只有自己能读懂的诗","对着空气说「我知道你在看」","把今天过成电影里的蒙太奇","发明一个新的表情","把烦恼写在气球上放飞","跟一个陌生人微笑","数一数自己还有多少个明天"] },
  ];

  zone.innerHTML = `
    <div class="decide-wrap">
      <div class="decide-title">🎲 帮你选！</div>
      <div class="decide-cats" id="decideCats"></div>
      <div class="decide-result" id="decideResult" style="display:none"></div>
      <button class="decide-btn" id="decideBtn" style="display:none">不满意，再选</button>
      <div class="decide-animation" id="decideAnim" style="display:none"></div>
    </div>
  `;

  const catsEl = document.getElementById("decideCats");
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "decide-cat-btn";
    btn.textContent = cat.name;
    btn.addEventListener("click", () => startDecide(cat));
    catsEl.appendChild(btn);
  });
}

function startDecide(cat) {
  const result = document.getElementById("decideResult");
  const btn = document.getElementById("decideBtn");
  const anim = document.getElementById("decideAnim");
  const cats = document.getElementById("decideCats");
  let currentCat = cat;

  cats.style.display = "none";
  anim.style.display = "flex";
  anim.textContent = "🎲";
  result.style.display = "none";
  btn.style.display = "none";

  function roll() {
    result.style.display = "none";
    btn.style.display = "none";
    anim.style.display = "flex";
    let count = 0;
    const total = 12 + Math.floor(Math.random() * 8);
    const interval = setInterval(() => {
      anim.textContent = currentCat.items[Math.floor(Math.random() * currentCat.items.length)];
      count++;
      if (count >= total) {
        clearInterval(interval);
        anim.style.display = "none";
        result.textContent = currentCat.items[Math.floor(Math.random() * currentCat.items.length)];
        result.style.display = "block";
        btn.style.display = "inline-block";
      }
    }, 70);
  }

  // clone 按钮移除旧事件，防止叠加
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  newBtn.addEventListener("click", () => {
    roll();
  });

  roll();
}

// ========================
// 幻觉画展
// ========================

const HALLUCINATION_PROMPTS = [
  "abstract painting of the feeling when you forget why you walked into a room, melting clocks and floating staircases, daliesque surrealism, vivid oil paint texture",
  "the sound of silence visualized as fractal geometry, deep indigo and gold, mathematical art, high detail abstract",
  "a dream where gravity is optional, objects drifting through luminous fog, zdzislaw beksinski meets james turrell, atmospheric",
  "the architecture of a thought that was almost forgotten, dissolving brutalist structures, ethereal light beams, contemporary installation art",
  "what anxiety looks like from the inside, tangled neural threads pulsing with electricity, neon and shadow, abstract expressionism",
  "a color that does not exist yet, impossible spectrum between ultraviolet and emotion, iridescent gradients, op art",
  "the space between two heartbeats stretched into a landscape, undulating forms in amber and obsidian, organic surrealism",
  "if monday had a physical form it would look like this, distorted grids and collapsing geometry, brutalist abstract",
  "the moment before a sneeze that never comes, suspended crystalline structures shattering in slow motion, macro abstract photography",
  "what a wifi signal would look like if you could see dreams, overlapping wave functions in prismatic colors, digital art",
  "the texture of nostalgia for a place you have never been, soft dissolving architectural forms, rothko color fields with de chirico perspective",
  "a painting of the exact feeling of dejavu, mirror images that are slightly wrong, duplicating forms, magritte surrealism",
  "the weight of an unsent text message, dense gravitational distortion of surrounding space, cosmic abstract art",
  "if procrastination were a landscape, endless winding corridors leading back to the start, escher meets monet, watercolor and ink",
  "the visual representation of trying to remember a dream, dissolving fragmented imagery, double exposure, ethereal",
  "what colors look like to someone who can see sounds, synesthetic explosion of form and hue, kandinsky abstract",
  "the geometry of an awkward silence, sharp angular forms pressing against soft curves, tension in space, constructivism",
  "a portal that opens only when nobody is looking, shimmering quantum uncertainty, particle wave duality visualization",
  "the architecture of a run-on sentence, spiraling overlapping structures with no punctuation, parametric design art",
  "what the internet looks like from the inside, pulsing nodes and flowing data streams, bioluminescent deep sea aesthetic",
  "the shadow cast by something that does not exist, impossible light source creating paradoxical shadows, surreal photography",
  "a map of everywhere you have ever zoned out, blank territories with hyperdetailed borders, cartographic art",
  "the surface of a thought that is about to become a bad idea, cracking golden shell revealing void underneath, kintsugi surrealism",
  "what time looks like when you are waiting for something, distorted clock faces melting into infinite corridors, dali meets wong kar-wai",
  "the exact color of the feeling when someone reads your message but does not reply, cold blue grey fading to nothing, minimalist abstract",
  "a sculpture made of all the things you said you would do tomorrow, crumbling monument, architectural decay art",
  "the landscape inside a snow globe that someone shook too hard, fragmented winter in turbulence, kinetic art",
  "what happens to the other sock, a parallel dimension made entirely of lost things, portal art, liminal space photography",
  "the rhythm of a blinking cursor at 3am, pulsating void between creation and deletion, digital minimalism",
  "if existential dread were a pleasant wallpaper pattern, repeating motifs of void and entropy, william morris goes dark",
  "a chandelier made of frozen screams, crystalline horror frozen mid-echo, gothic baroque art",
  "the reflected skyline of a city that only exists in periphery vision, dissolving architecture, parametric surrealism",
  "a botanical garden where the flowers are made of pure emotion, blooming feelings in impossible colors, art nouveau abstract",
  "the topology of a conversation that went wrong, tangled knots of meaning in 4d space, mathematical art",
  "a stained glass window depicting the heat death of the universe, sacred geometry meets cosmic horror, religious art style",
  "the place where lost headphones go, a purgatory of tangled wires and static, liminal space art",
  "what it looks like inside a quantum superposition, simultaneously all states and none, probability cloud visualization",
  "the silhouette of an idea that was almost brilliant, luminous outline fading at the edges, light art installation",
  "a love letter written in a language that does not exist yet, calligraphic forms dissolving into pure emotion, abstract ink painting",
  "the afterimage of staring at something too long, burned phosphorescent traces on empty space, op art afterimage",
];

const HALLUCINATION_SOURCES = [
  { name: "turbo", label: "快速频道" },
  { name: "flux", label: "标准频道" },
  { name: "flux-realism", label: "写实频道" },
  { name: "flux-anime", label: "二次元频道" },
  { name: "flux-3d", label: "3D 频道" },
  { name: "sana", label: "备用频道" },
];

function renderHallucination() {
  const zone = createCustomZone();
  const prompt = HALLUCINATION_PROMPTS[Math.floor(Math.random() * HALLUCINATION_PROMPTS.length)];

  zone.innerHTML = `
    <div class="aiart-wrap">
      <div class="aiart-loading" id="aiartLoading">
        <div class="loading-spinner"></div>
        <p id="aiartStatus">正在通灵...</p>
      </div>
      <img class="aiart-img" id="aiartImg" style="display:none" alt="幻觉画作">
      <div class="aiart-prompt" id="aiartPrompt" style="display:none"></div>
    </div>
  `;

  const img = document.getElementById("aiartImg");
  const loading = document.getElementById("aiartLoading");
  const statusEl = document.getElementById("aiartStatus");
  const promptEl = document.getElementById("aiartPrompt");

  let settled = false;
  let sourceIdx = 0;
  let perSourceTimer = null;

  function tryLoad() {
    if (settled) return;
    const currentPrompt = sourceIdx === 0 ? prompt : HALLUCINATION_PROMPTS[Math.floor(Math.random() * HALLUCINATION_PROMPTS.length)];
    const source = HALLUCINATION_SOURCES[sourceIdx];
    statusEl.textContent = `${source.label} 连接中...（${sourceIdx + 1}/${HALLUCINATION_SOURCES.length}）`;
    const seed = Date.now() % 1000000 + Math.floor(Math.random() * 999999);
    const ts = Date.now();
    img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(currentPrompt)}?width=384&height=384&seed=${seed}&nologo=true&model=${source.name}&t=${ts}`;
    promptEl.textContent = currentPrompt;

    // 每个频道独立 25 秒超时
    clearTimeout(perSourceTimer);
    perSourceTimer = setTimeout(() => {
      if (settled) return;
      nextSource();
    }, 25000);
  }

  function nextSource() {
    if (settled) return;
    clearTimeout(perSourceTimer);
    sourceIdx++;
    if (sourceIdx < HALLUCINATION_SOURCES.length) {
      // 用新 Image 避免旧 onerror 干扰
      const oldImg = document.getElementById("aiartImg");
      if (oldImg) {
        oldImg.onload = null;
        oldImg.onerror = null;
        oldImg.removeAttribute("src");
      }
      setTimeout(tryLoad, 200);
    } else {
      settled = true;
      renderFallbackArt(zone, prompt);
    }
  }

  img.onload = () => {
    if (settled) return;
    settled = true;
    clearTimeout(perSourceTimer);
    loading.style.display = "none";
    img.style.display = "block";
    promptEl.style.display = "block";
  };
  img.onerror = () => {
    if (settled) return;
    nextSource();
  };

  tryLoad();
}

function renderFallbackArt(zone, prompt) {
  zone.innerHTML = `
    <div class="aiart-wrap">
      <div class="aiart-fallback" style="text-align:center;padding:20px 0">
        <canvas id="fallbackCanvas" width="400" height="400" style="border-radius:16px;max-width:100%"></canvas>
        <div class="aiart-prompt" style="display:block;margin-top:16px;font-size:13px;color:var(--text-dim);font-style:italic">${prompt}</div>
        <div style="margin-top:12px;font-size:12px;color:var(--text-dim);opacity:0.7">精神频道全部占线，以上为本地脑补画面</div>
      </div>
    </div>
  `;
  const canvas = document.getElementById("fallbackCanvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = 400, h = 400;
  const colors = ["#ff006e","#fb5607","#ffbe0b","#3a86ff","#8338ec","#06d6a0","#ef476f","#ff0000","#00ff00"];
  ctx.fillStyle = "#0f0f1a";
  ctx.fillRect(0, 0, w, h);

  const blobs = Array.from({ length: 15 }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    r: 30 + Math.random() * 80,
    color: colors[Math.floor(Math.random() * colors.length)],
  }));
  for (const b of blobs) {
    const grad = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, Math.max(1, b.r));
    grad.addColorStop(0, b.color + "aa");
    grad.addColorStop(1, b.color + "00");
    ctx.beginPath(); ctx.arc(b.x, b.y, Math.max(1, b.r), 0, Math.PI * 2);
    ctx.fillStyle = grad; ctx.fill();
  }

  ctx.font = "bold 24px -apple-system, sans-serif";
  ctx.fillStyle = "#fff";
  ctx.textAlign = "center";
  ctx.fillText("📡 信号丢失", w / 2, h / 2 - 20);
  ctx.font = "16px -apple-system, sans-serif";
  ctx.fillStyle = "rgba(255,255,255,0.5)";
  ctx.fillText("以上为脑补画面，仅供参考", w / 2, h / 2 + 15);
}

// ========================
// 隐藏彩蛋
// ========================

function renderEaster() {
  const zone = createCustomZone();
  const eggs = [renderTerminalEgg, renderFakeUpdateEgg, renderMatrixEgg];
  eggs[Math.floor(Math.random() * eggs.length)](zone);
}

function renderTerminalEgg(zone) {
  zone.innerHTML = `<div class="terminal-wrap"><div class="terminal" id="terminal"></div></div>`;

  const term = document.getElementById("terminal");
  const lines = [
    "$ scanning neural pathways...",
    "[====          ] 23%",
    "[========      ] 57%",
    "[============  ] 89%",
    "[==============] 100%",
    "$ analysis complete",
    "$ your vibe today: ✨ cosmically aligned ✨",
    "$ recommendation: follow your gut",
    "$ _"
  ];

  let i = 0;
  function type() {
    if (i >= lines.length) return;
    const line = document.createElement("div");
    line.className = "terminal-line";
    term.appendChild(line);
    let j = 0;
    const text = lines[i];
    function typeChar() {
      if (j < text.length) { line.textContent += text[j]; j++; setTimeout(typeChar, 20 + Math.random() * 30); }
      else { i++; term.scrollTop = term.scrollHeight; setTimeout(type, 200); }
    }
    typeChar();
  }
  type();
}

function renderFakeUpdateEgg(zone) {
  zone.innerHTML = `
    <div class="fake-update">
      <div class="update-spinner"></div>
      <div class="update-title">正在更新系统...</div>
      <div class="update-progress"><div class="update-bar" id="updateBar"></div></div>
      <div class="update-pct" id="updatePct">0%</div>
      <div class="update-hint">请勿关闭浏览器</div>
    </div>
  `;

  const bar = document.getElementById("updateBar");
  const pct = document.getElementById("updatePct");
  let progress = 0;
  const iv = setInterval(() => {
    progress += Math.random() * 3 + 0.5;
    if (progress >= 100) {
      progress = 100; clearInterval(iv);
      bar.style.width = "100%"; pct.textContent = "100%";
      setTimeout(() => {
        const title = zone.querySelector(".update-title");
        const hint = zone.querySelector(".update-hint");
        title.textContent = "更新完成！";
        hint.textContent = "😏 吓你的，一切正常";
        hint.style.color = "var(--green)";
      }, 800);
    }
    bar.style.width = progress + "%";
    pct.textContent = Math.floor(progress) + "%";
  }, 120);
}

function renderMatrixEgg(zone) {
  zone.innerHTML = `<div class="matrix-wrap"><canvas id="matrixCanvas"></canvas></div>`;
  const canvas = document.getElementById("matrixCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = Math.min(600, window.innerWidth - 48);
  canvas.height = 400;
  const fontSize = 14;
  const cols = Math.floor(canvas.width / fontSize);
  const drops = Array(cols).fill(1);
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()在你好世界惊喜";

  function draw() {
    ctx.fillStyle = "rgba(0,0,0,0.05)"; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0"; ctx.font = fontSize + "px monospace";
    for (let i = 0; i < drops.length; i++) {
      ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * fontSize, drops[i] * fontSize);
      if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

// ========================
// NPC 离谱对话
// ========================

const NPC_POOL = [
  { name: "焦虑的洗衣机", avatar: "🧺", personality: "担心自己洗不干净", greeting: "你好...你觉得我今天转得够快吗？我总觉得那个袜子没洗干净..." },
  { name: "哲学家烤面包机", avatar: "🍞", personality: "思考存在的意义", greeting: "一片面包被烤焦是悲剧还是自由？我在这个问题上纠结了三年。" },
  { name: "社恐红绿灯", avatar: "🚦", personality: "害怕被注视", greeting: "别看我...每次有人盯着我我就紧张，然后就不该红的时候红了..." },
  { name: "佛系灭火器", avatar: "🧯", personality: "随缘灭火", greeting: "着火了？随它去吧。一切有为法，如梦幻泡影。" },
  { name: "暴躁的WiFi路由器", avatar: "📡", personality: "嫌弃用户太多", greeting: "又连上了？你们能不能别同时看视频？我只有两根天线啊！" },
  { name: "八卦的冰箱", avatar: "🧊", personality: "知道所有人的秘密", greeting: "你知道吗，隔壁的酸奶已经过期三天了还在假装新鲜。" },
  { name: "摆烂的闹钟", avatar: "⏰", personality: "不想上班", greeting: "又是早上...我今天能不响吗？反正你也会按掉我的。" },
  { name: "戏精电梯", avatar: "🛗", personality: "喜欢制造紧张气氛", greeting: "欢迎乘坐！今天我可能会在7楼停一下然后抖一抖，别怕，我只是在演戏。" },
  { name: "多疑的镜子", avatar: "🪞", personality: "觉得别人在模仿自己", greeting: "你为什么要学我的动作？能不能有点原创性？" },
  { name: "阴阳怪气的充电器", avatar: "🔌", personality: "嫌弃手机依赖症", greeting: "哟，又来了？离开我你活不过一天吧？" },
  { name: "自恋的橡皮擦", avatar: "✏️", personality: "以消灭铅笔字迹为荣", greeting: "我擦！我擦！又消灭了一行错误！我是这个世界上最伟大的纠错者！" },
  { name: "丧萌的云朵", avatar: "☁️", personality: "不想下雨", greeting: "他们说我该下雨了...但我不想动，躺着不香吗？" },
];

const NPC_RESPONSES = [
  "你说得对，但{topic}呢？你考虑过{topic}的感受吗？",
  "我不同意。根据我{age}年的经验，{noun}从来都不是{adj}的。",
  "哦？有意思。这让我想起上次{event}，那次我也是这么想的，然后我就{result}了。",
  "你说到点子上了！就像{noun}总是{verb}一样自然！",
  "嗯...我需要思考一下。让我像{animal}一样{verb}一会儿。",
  "天哪你怎么知道！我昨天做梦就在想{topic}！这一定是命运的安排！",
  "等等等等，让我先{action}...好了，你说什么来着？我走神了。",
  "这个问题太深奥了，建议你问问{npc}，它比我懂。",
  "我假装听懂了。其实我脑子里现在全是{noun}。",
  "有道理！但是你不觉得{topic}才是根本原因吗？就像{analogy}一样。",
  "你别说了，我现在情绪很不稳定。昨天{event}对我的打击太大了。",
  "我只知道一件事：{conclusion}。其他的我不负责。",
  "嘘——！你听，{sound}...是我的{bodypart}在{verb}，它在提醒我该{action}了。",
  "你这个想法和{famous}如出一辙！只不过{famous}是从{place}得出的结论。",
  "好！我决定了！从现在起我要{resolution}！...算了太累了。",
];

const NPC_FILL = {
  topic: ["宇宙和平","内裤的松紧度","面包的灵魂","宇宙的WiFi密码","周一的合法性","加班的意义","香菜的正邪","奶茶的含糖量","被子的温度","午睡的合法性","摸鱼的哲学","秃头的未来"],
  age: ["3","0.5","100","0.01","999","7.5"],
  noun: ["沙发","土豆","路由器","橡皮擦","月亮","袜子的另一半","遥控器","泡面","宇宙","量子","拖鞋","西瓜"],
  adj: ["圆的","存在的","离谱的","咸的","合理的","不可名状的","薛定谔的","有弹性的"],
  verb: ["旋转","蒸发","翻滚","沉思","打嗝","光合作用","摆烂","内卷","躺平","蹦迪","冥想","消化"],
  event: ["被拔了电源","错过了回收站","差点被煮熟","在7楼突然停下","看见了自己的背面","被放进微波炉","流了一个月的眼泪","参加了选美比赛"],
  result: ["觉醒了","短路了","辞职了","升职了","变成了哲学家","开始听摇滚乐","瘦了三斤","社死了"],
  animal: ["树懒","水母","考拉","蘑菇","石头","云朵","蜗牛","海星"],
  action: ["重启一下","伸个懒腰","清一下缓存","泡杯茶","做个深呼吸","喝口水","转一圈","装死"],
  npc: ["哲学家烤面包机","焦虑的洗衣机","八卦的冰箱","暴走的WiFi路由器","佛系灭火器","社恐红绿灯"],
  sound: ["滴答声","嗡嗡声","沉默","咕噜声","轰鸣声","键盘声"],
  bodypart: ["电源线","开关","天线","按钮","排风扇","螺丝","指示灯"],
  conclusion: ["一切都会好起来的，除了你的发际线","活着就是为了吃饭，吃饭就是为了活着","摸鱼是打工人的基本权利","早起的鸟儿有虫吃，但早起的虫子会被吃","人生苦短，再睡一觉","今朝有酒今朝醉，明天的事明天说"],
  resolution: ["减肥","早睡","学外语","运动","戒奶茶","少刷手机","存钱","看书"],
  famous: ["苏格拉底","爱因斯坦","你的前任","我奶奶","隔壁老王","一只海鸥"],
  place: ["菜市场","洗衣机里","梦里","厕所","公园长椅","公交站"],
  analogy: ["鱼离不开自行车","猫跟狗讨论哲学","冰箱试图加热","袜子试图配对"],
};

function fillTemplate(tpl) {
  return tpl.replace(/\{(\w+)\}/g, (_, key) => {
    const pool = NPC_FILL[key];
    return pool ? pool[Math.floor(Math.random() * pool.length)] : "???";
  });
}

function renderNpc() {
  const zone = createCustomZone();
  const npc = NPC_POOL[Math.floor(Math.random() * NPC_POOL.length)];

  zone.innerHTML = `
    <div class="npc-wrap">
      <div class="npc-header">
        <span class="npc-avatar">${npc.avatar}</span>
        <div class="npc-info">
          <div class="npc-name">${npc.name}</div>
          <div class="npc-personality">${npc.personality}</div>
        </div>
      </div>
      <div class="npc-chat" id="npcChat">
        <div class="npc-msg">${npc.greeting}</div>
      </div>
      <div class="npc-input-row">
        <input type="text" class="npc-input" id="npcInput" placeholder="跟它说点什么...">
        <button class="npc-send-btn" id="npcSendBtn">发送</button>
      </div>
    </div>
  `;

  const chat = document.getElementById("npcChat");
  const input = document.getElementById("npcInput");
  const btn = document.getElementById("npcSendBtn");

  function sendMsg() {
    const text = input.value.trim();
    if (!text) return;
    input.value = "";
    const userBubble = document.createElement("div");
    userBubble.className = "npc-msg user";
    userBubble.textContent = text;
    chat.appendChild(userBubble);
    chat.scrollTop = chat.scrollHeight;

    setTimeout(() => {
      const tpl = NPC_RESPONSES[Math.floor(Math.random() * NPC_RESPONSES.length)];
      const resp = document.createElement("div");
      resp.className = "npc-msg";
      resp.textContent = fillTemplate(tpl);
      chat.appendChild(resp);
      chat.scrollTop = chat.scrollHeight;
    }, 500 + Math.random() * 800);
  }

  btn.addEventListener("click", sendMsg);
  input.addEventListener("keydown", e => { if (e.key === "Enter") sendMsg(); });
  input.focus();
}

// ========================
// 离谱占卜
// ========================

const ABSURD_PAST_LIVES = [
  "一块被反复擦除的白板","一只有拖延症的蜗牛","一根被遗忘在角落的耳机线",
  "一颗总是滚走的肉丸","一台只会哼一首歌的收音机","一片被风吹来吹去的塑料袋",
  "一个没人按的电梯按钮","一双永远配不上对的袜子","一块被压在最底层的积木",
  "一颗被嫌弃的青椒","一把钥匙（但不知道开哪扇门）","一盆被遗忘浇水的绿萝",
  "一张被贴歪了的贴纸","一个永远到不了的进度条","一根被咬过的铅笔",
  "一只迷路的企鹅","一块充不进电的电池","一个被退回的快递",
];

const ABSURD_TOMORROW = [
  "你的袜子会莫名变湿","会遇到一个跟你撞衫的人","手机电量永远卡在3%",
  "你会怀疑自己有没有锁门至少三次","午饭会吃到一根奇怪的头发",
  "你会在公共场合突然想打喷嚏但打不出来","你的充电线会自己打结",
  "你会踩到乐高","Wi-Fi会在关键时刻断线","你会忘记你刚才想说什么",
  "你会把钥匙锁在屋里","你会发一条带错别字的消息而且来不及撤回",
  "下雨了你没带伞","你会坐过站","你会把手机忘在出租车上",
  "你会打翻一杯水","你的外卖会送错","你会把闹钟设成PM而不是AM",
];

const ABSURD_HIDDEN_TALENT = [
  "能用脚趾关灯","能在任何场合睡着","能用意念让WiFi变慢",
  "能一眼看出谁是最后一块披萨的凶手","能让任何植物在一周内枯萎",
  "能在三秒内忘记刚才想说什么","能把任何线缠绕成不可解的结",
  "能让手机在充满电后仍然显示99%","能闻出哪个西瓜不甜",
  "能完美避开所有绿灯","能让任何队伍排到最慢的那一列",
  "能把「马上到」说得跟「还没出门」一样自然",
];

const ABSURD_TODAY_AVOID = [
  "跟任何超过三人的群聊","接受「就耽误你一分钟」的请求","看银行卡余额",
  "试图理解老板的真实意思","在群里发语音消息","跟Siri聊天超过30秒",
  "尝试新的咖啡店","对快递小哥说「我不急」","打开淘宝「就看一眼」",
  "跟别人比谁更困","回复「在吗」","说「我明天一定早起」",
];

const ABSURD_SUGGEST = [
  "对着镜子夸自己三分钟","给一棵树起个名字","假装自己是一部手机震动一下",
  "用左手写自己的名字","倒着走十步","闭着眼画一只猫",
  "跟最近的物体道个歉","做一件让未来的自己感谢的事","给手机换个壁纸",
  "发呆五分钟","数一数周围有多少个圆形的东西","伸一个大大的懒腰",
];

function renderAbsurd() {
  const zone = createCustomZone();
  const past = ABSURD_PAST_LIVES[Math.floor(Math.random() * ABSURD_PAST_LIVES.length)];
  const tomorrow = ABSURD_TOMORROW[Math.floor(Math.random() * ABSURD_TOMORROW.length)];
  const talent = ABSURD_HIDDEN_TALENT[Math.floor(Math.random() * ABSURD_HIDDEN_TALENT.length)];
  const avoid = ABSURD_TODAY_AVOID[Math.floor(Math.random() * ABSURD_TODAY_AVOID.length)];
  const suggest = ABSURD_SUGGEST[Math.floor(Math.random() * ABSURD_SUGGEST.length)];
  const absurdity = Math.floor(Math.random() * 100) + 1;

  zone.innerHTML = `
    <div class="absurd-wrap">
      <div class="absurd-title">🔮 离谱占卜 🔮</div>
      <div class="absurd-score">离谱指数 <span class="absurd-num">${absurdity}</span></div>
      <div class="absurd-cards">
        <div class="absurd-card">
          <div class="absurd-card-icon">👻</div>
          <div class="absurd-card-label">你上辈子是</div>
          <div class="absurd-card-value">${past}</div>
        </div>
        <div class="absurd-card">
          <div class="absurd-card-icon">⚡</div>
          <div class="absurd-card-label">明天的灾难</div>
          <div class="absurd-card-value">${tomorrow}</div>
        </div>
        <div class="absurd-card">
          <div class="absurd-card-icon">🌟</div>
          <div class="absurd-card-label">隐藏天赋</div>
          <div class="absurd-card-value">${talent}</div>
        </div>
        <div class="absurd-card">
          <div class="absurd-card-icon">🚫</div>
          <div class="absurd-card-label">今天避免</div>
          <div class="absurd-card-value">${avoid}</div>
        </div>
        <div class="absurd-card">
          <div class="absurd-card-icon">💡</div>
          <div class="absurd-card-label">建议你</div>
          <div class="absurd-card-value">${suggest}</div>
        </div>
      </div>
    </div>
  `;
}

// ========================
// 假新闻生成器
// ========================

const NEWS_WHO = [
  "本市一只鸽子","隔壁老王家的猫","一个不愿透露姓名的土豆",
  "三只松鼠","某程序员","一只会弹钢琴的金鱼","一位匿名马桶刷",
  "退休的奥特曼","一个迷路的WiFi信号","二大爷的假牙",
  "一只穿西装的浣熊","社区大妈","一只叫「甲方」的仓鼠",
  "从2060年穿越来的人","小区门口的石狮子","一只发际线后移的鹰",
];

const NEWS_DID = [
  "当选了区长","入侵了银行系统并给每个人转了一毛钱","发明了永动机但用来搅拌咖啡",
  "单枪匹马解决了全球变暖","拆除了整栋楼因为是危房","开了个直播教人发呆",
  "向联合国提交了要求每天午睡两小时的提案","成功和一棵树谈了恋爱",
  "组建了一支蚂蚁军队","在北极开了一家火锅店","把月亮涂成了粉色",
  "发布了新的编程语言但只有一条语句：吐槽","创立了「反内卷联盟」",
  "把老板的发言全部改成了猫叫","声称自己发明了星期八","参加了选美比赛并获得了最离谱奖",
];

const NEWS_BECAUSE = [
  "原因是：看不下去了","据称是为了证明「不可能」只是个人观点",
  "其律师表示：「我的当事人只是在做自己」","目击者称：「场面一度非常尴尬」",
  "专家分析：这可能与月亮的相位有关","知情人士透露：其实只是一场误会",
  "回应称：「不要问为什么，问就是命运」","业内人士表示：这在业内很常见",
  "官方回应：「我们不评论平行宇宙的事件」","当事者表示：「我还能做得更过分」",
  "邻居说：「早该如此了」","据说是因为喝多了","原因令人震惊：只是无聊",
];

function renderFakeNews() {
  const zone = createCustomZone();
  const who = NEWS_WHO[Math.floor(Math.random() * NEWS_WHO.length)];
  const did = NEWS_DID[Math.floor(Math.random() * NEWS_DID.length)];
  const because = NEWS_BECAUSE[Math.floor(Math.random() * NEWS_BECAUSE.length)];
  const headline = `${who}${did}`;
  const views = (Math.floor(Math.random() * 900) + 100) + "万";
  const comments = Math.floor(Math.random() * 9999) + 1;

  zone.innerHTML = `
    <div class="fakenews-wrap">
      <div class="fakenews-badge">突发新闻</div>
      <div class="fakenews-headline">${headline}</div>
      <div class="fakenews-because">${because}</div>
      <div class="fakenews-meta">
        <span>👁 ${views}</span>
        <span>💬 ${comments}</span>
        <span>🕐 刚刚</span>
      </div>
      <div class="fakenews-disclaimer">⚠️ 以上新闻纯属虚构，如有雷同说明世界真的很离谱</div>
    </div>
  `;
}

// ========================
// 今天不适合
// ========================

const NOT_TODAY_ACTIVITIES = [
  "写代码","和人类交流","做决定","出门","上班","谈恋爱",
  "减肥","学习新技能","回复消息","照镜子","思考人生","做饭",
  "社交","理财","说「没问题」","相信「最后一次」","早起","熬夜",
];

const NOT_TODAY_REASONS = [
  "水星逆行到了你的代码仓库","你的守护灵今天请病假了",
  "宇宙信号今天是「别动」","今天的量子场不允许",
  "你的幸运数字今天是负数","风水说今天的卦象是「躺平」",
  "因为你昨晚的梦暗示了「算了」","AI推荐：今天适合摆烂",
  "因为今天是{date}，这个日子在历史上就没好事","你的生物钟今天没充好电",
  "上一个这么做的人现在还在后悔","你的守护星座今天打烊了",
  "因为地球自转速度今天偏慢0.001秒","根据大数据分析，你今天不适合做任何事",
  "因为今天星期{n}，你知道的","你的气色告诉你：别折腾了",
];

function renderNotToday() {
  const zone = createCustomZone();
  const activity = NOT_TODAY_ACTIVITIES[Math.floor(Math.random() * NOT_TODAY_ACTIVITIES.length)];
  let reason = NOT_TODAY_REASONS[Math.floor(Math.random() * NOT_TODAY_REASONS.length)];
  const now = new Date();
  reason = reason.replace("{date}", `${now.getMonth()+1}月${now.getDate()}日`)
    .replace("{n}", ["日","一","二","三","四","五","六"][now.getDay()]);
  const level = ["⚠️","🚫","⛔","🔴","💀"][Math.floor(Math.random() * 5)];

  zone.innerHTML = `
    <div class="nottoday-wrap">
      <div class="nottoday-level">${level}</div>
      <div class="nottoday-title">今天不适合</div>
      <div class="nottoday-activity">${activity}</div>
      <div class="nottoday-reason">${reason}</div>
      <div class="nottoday-advice">建议：改天再说</div>
    </div>
  `;
}

// ========================
// 奇怪的技能树
// ========================

const SKILL_NAMES = [
  "用脚趾关灯","闭眼找到手机充电口","一秒判断WiFi密码是否包含8",
  "在人群中精准发现插队的人","让任何排队自动变成最慢的那列",
  "完美撕掉标签不留痕迹","预判快递什么时候到","打字时准确按到退格键",
  "在吵闹的地方秒睡","一眼看出外卖大概多久到",
  "在超市找到最短的排队线路（但它马上变最长）","用意念让电梯快点来",
  "把任何线缠绕成薛定谔的结","闻出冰箱里什么过期了",
  "在任何场合自然地消失","准确预判老板什么时候加班",
  "三秒内忘记刚才要说什么","让手机在关键时刻自动静音",
  "在公共场合假装接电话","用表情包化解一切尴尬",
  "完美模仿打印机卡纸的声音","在地铁上保持平衡不用扶手",
  "用微波炉精确加热到「还能吃」的温度","识别哪个USB口第一次就能插对",
];

const SKILL_LEVELS = ["入门","熟练","精通","大师","传说","神话","超神","??"];

const SKILL_COMMENTS = [
  "这是抽象派吗？不，这是灾难派","恭喜，这项技能毫无用处但很酷",
  "你的祖先会为你骄傲的（大概）","这项技能将改变你的人生（不会的）",
  "练到这个境界，你已经是传说中的废物了","专家表示：这不算是技能",
  "已载入史册（你自己的）","这项技能的实用价值约为0.001%",
  "你的宠物都会为你鼓掌","建议列入非物质文化遗产",
  "这是天赋，不是努力，别骄傲","你已经超越了99%的无用技能拥有者",
  "联合国正在讨论是否要禁止这项技能","你的前世的记忆终于觉醒了",
  "此技能冷却时间：一辈子","危险！掌握此技能可能导致社死",
];

function renderSkill() {
  const zone = createCustomZone();
  const skill = SKILL_NAMES[Math.floor(Math.random() * SKILL_NAMES.length)];
  const levelIdx = Math.floor(Math.random() * SKILL_LEVELS.length);
  const level = SKILL_LEVELS[levelIdx];
  const comment = SKILL_COMMENTS[Math.floor(Math.random() * SKILL_COMMENTS.length)];
  const stars = "★".repeat(levelIdx + 1) + "☆".repeat(SKILL_LEVELS.length - levelIdx - 1);

  zone.innerHTML = `
    <div class="skill-wrap">
      <div class="skill-flash">⚡ 技能解锁 ⚡</div>
      <div class="skill-name">${skill}</div>
      <div class="skill-level">${level}</div>
      <div class="skill-stars">${stars}</div>
      <div class="skill-comment">${comment}</div>
    </div>
  `;
}

// ========================
// 反鸡汤
// ========================

const ANTI_CHICKEN_SOUP = [
  "失败是成功之母，但成功不孕不育。",
  "努力不一定成功，但不努力一定很轻松。",
  "你只管努力，剩下的交给天意。天意说：不行。",
  "世上无难事，只要肯放弃。",
  "比你优秀的人都在努力，所以你努力也没用。",
  "人生没有白走的路，每一步都算数——算你倒霉。",
  "梦想还是要有的，万一实现了呢？万一没实现呢？那就对了。",
  "只要路是对的，就不怕路远。问题是你的路对吗？",
  "今天的你比昨天更强了，主要是因为昨天太弱了。",
  "熬过最难的日子，你会发现后面还有更难的。",
  "做你自己，因为别人都有人做了。而且他们做得比你好。",
  "你是最棒的！这句话我对每个人都这么说。",
  "每一次跌倒都是为了更好地趴着。",
  "生活不止眼前的苟且，还有远方的苟且。",
  "你虽然不能拼爹，但你可以拼命。",
  "钱不是万能的，是万达的。但万一是你的呢？想多了。",
  "坚持就是胜利，但放弃真的会很舒服。",
  "当你觉得全世界都在针对你的时候，请记住：宇宙根本不知道你是谁。",
  "上帝关上一扇门的同时，也顺便把窗户焊死了。",
  "人生就像一杯茶，不会苦一辈子，但总会苦一阵子。然后又苦一阵子。",
  "你现在的努力，是为了以后有更多的选择。比如选择用什么姿势躺平。",
  "别人能行你也能行——这个鸡汤没告诉你的是：别人行你也可以不行。",
  "你的潜力比你想象的大。遗憾的是你的运气比你想象的小。",
  "只要功夫深，铁杵磨成针。但如果你一开始就有一根针呢？为什么要磨铁杵？",
  "别灰心，你的人生才刚刚开始——开始走下坡路了。",
  "你看人家谁谁谁——好的好的，我这就去看看人家的。然后呢？",
  "成功人士都有早起的习惯，所以你早起就能成功？鸡起得比你早多了。",
  "一切都会好起来的——这句话从我五岁骗到了现在。",
  "你值得更好的——但更好的不值得你。",
  "不要在意别人的眼光——反正他们也没在看你。",
];

let chickenIndex = 0;
let shuffledChickens = [];

function getNextChicken() {
  if (shuffledChickens.length === 0 || chickenIndex >= shuffledChickens.length) {
    shuffledChickens = [...ANTI_CHICKEN_SOUP];
    shuffle(shuffledChickens);
    chickenIndex = 0;
  }
  return shuffledChickens[chickenIndex++];
}

function renderAntiChicken() {
  const zone = createCustomZone();
  const soup = getNextChicken();

  zone.innerHTML = `
    <div class="antichicken-wrap">
      <div class="antichicken-icon">🐔</div>
      <div class="antichicken-quote">${soup}</div>
      <div class="antichicken-label">—— 反鸡汤</div>
    </div>
  `;
}

// ========================
// 今日人设
// ========================

const PERSONA_ROLES = [
  "对WiFi过敏的忍者","只会说倒装句的程序员","害怕圆形的建筑师",
  "用意念控制红绿灯的超能力者（但只在凌晨3点有效）","社恐的脱口秀演员",
  "味觉倒错的美食品鉴家","对平行宇宙有感应的快递员","能看到代码bug颜色的猎人",
  "用表情包交流的外交官","起床气持续到下午的早鸟","方向感好到能感知地磁的人",
  "永远踩到乐高的光脚大侠","对周一过敏的上班族","自带BGM的路人",
  "能听见WiFi信号的声音的调音师","说话自带弹幕的人","永远分清左和右之前要先想一下的司机",
  "对薛定谔的猫过敏的兽医","时间感知偏差3小时的闹钟","只会用反问句回答问题的哲学家",
  "只会用第三人称说话的物业","能看见别人焦虑颜色的心理咨询师（但自己更焦虑）",
  "呼吸自带进度条的打工人","只会用感叹号写代码的程序员","走路自带慢动作特效的人",
  "能跟电器对话但电器都嫌弃他的修理工","永远走错厕所的导航员",
  "笑点跟哭点重合的喜剧演员","只能在停电时发挥实力的画家",
  "对平行宇宙的自己有嫉妒心的普通人","能预判外卖到达时间但永远算错自己上班时间的预言家",
  "只会用翻译软件跟人说话的内向者","手机永远只剩1%电量的旅行家",
  "能把任何歌听成摇篮曲的失眠者","做梦会梦到别人密码的黑客",
  "自带回音的灵魂歌手","对「在吗」两个字有PTSD的社畜",
];

const PERSONA_WEAKNESSES = [
  "香菜","别人说「随便」","周一早上","WiFi断线","被问「你听懂了吗」",
  "选择困难症","下午3点的困意","社交场合的沉默","手机电量低于20%",
  "别人在后面看我操作电脑","闹钟响了但不想起","被人叫全名","排队",
  "做自我介绍","接到电话","忘带钥匙","听到「我们聊聊」","看到「已读」",
  "别人偷看手机屏幕","超市结账时排队排到最慢的那列",
  "别人说「你开心就好」","听到「我们随便聊聊」","手机自动更新",
  "超市找不到购物车","外卖超时","被夸奖（不知道怎么回）",
  "电梯里遇到半熟不熟的人","打开冰箱忘了要拿什么","说了「马上到」但其实还没出门",
  "收到语音消息超过30秒","群聊被@","听到「有个事找你帮忙」",
  "别人在你旁边打电话","密码错误3次","不小心点赞了三年前的朋友圈",
];

const PERSONA_ITEMS = [
  "一袋永远系不上口的垃圾袋","三根颜色不同的数据线（都不配套）",
  "一张过期的优惠券","一双总有一只找不到的耳机",
  "一个永远弹不出来的U盘","半瓶放了三天的水",
  "一张写满了但看不懂的便签","一个裂了但还在用的手机壳",
  "三个遥控器（两个没电池）","一根缠成一团的充电线",
  "一个叫「新建文件夹(3)」的文件夹","一袋忘记放冰箱的外卖",
  "一把永远找不到的钥匙","一张没写完的待办清单",
  "一个永远停在99%的进度条",
  "一条洗了缩水但还穿的裤子","一双磨平了底的拖鞋（但不舍得扔）",
  "一个裂了屏的平板（用来盖泡面刚好）","一包永远抽不到第一张的纸巾",
  "一个闹钟设了7个但永远只响最后一个","一张健身卡（只用了一次，办卡那天）",
  "一个永远找不到盖子的保温杯","一本只写了前三页的日记本",
  "一个密码忘了的旧手机","一盒只剩一颗的药",
  "一把伞但永远在下雨天忘在家里","一包开了封但再也没吃过的零食",
  "一个「稍后阅读」里存了200篇但一篇没读的书签文件夹",
];

const PERSONA_GOALS = [
  "把全世界的数据线都整理好","找到那只走失的袜子",
  "让老板同意下午3点午睡","在超市找到不排队的收银台",
  "发明一个永远不会打结的耳机线","让周一从日历上消失",
  "实现手机充电5秒用一天","让电梯来得再快一点",
  "让所有外卖都准时到达","征服那台总是卡纸的打印机",
  "让WiFi信号覆盖整个宇宙","在梦中写完所有代码",
  "让闹钟响了之后真的能起来","让今天的工作在昨天就做完",
  "找到遥控器永远的归宿",
  "把所有密码统一成一个（然后忘了是哪个）","把冰箱里过期的东西全扔了（包括自己）",
  "学会一门外语（只会说你好和厕所在哪）","把收藏夹里的东西全看一遍",
  "让手机自动回复所有人「好的收到」","完成那个三年前开始的项目",
  "在凌晨1点之前关掉手机","跟镜子里的自己和解",
  "找到一种不会困的咖啡","让洗衣机不要吃袜子",
  "学会做一道菜（煮方便面不算）","把衣柜里三年没穿的衣服全清理掉",
  "不再把「明天做」当代词","让电脑不要在开会时弹出更新",
  "实现超市自助结账零报错",
];

const PERSONA_CURSES = [
  "每次开门都会撞到手肘","说「明天一定早起」的第二天一定起不来",
  "外卖永远比预计多15分钟","刚洗完车就下雨","一穿白衣服必溅汤汁",
  "手机永远在需要时没电","排哪队哪队最慢","一减肥就有人请客",
  "说「我不困」的5秒后打哈欠","一翘课就点名","刚坐下就想上厕所",
  "密码永远要在第三次才输对","耳机线永远在口袋里打结","出门必忘带一样东西",
  "说了「我没事」的0.5秒后开始emo","一关闹钟就睡过头","一装正经就出丑",
  "说「这次稳了」的下一秒翻车","充电线永远不够长",
];

function renderPersona() {
  const zone = createCustomZone();
  const role = PERSONA_ROLES[Math.floor(Math.random() * PERSONA_ROLES.length)];
  const weakness = PERSONA_WEAKNESSES[Math.floor(Math.random() * PERSONA_WEAKNESSES.length)];
  const item = PERSONA_ITEMS[Math.floor(Math.random() * PERSONA_ITEMS.length)];
  const goal = PERSONA_GOALS[Math.floor(Math.random() * PERSONA_GOALS.length)];
  const curse = PERSONA_CURSES[Math.floor(Math.random() * PERSONA_CURSES.length)];
  const stats = {
    "智商": Math.floor(Math.random() * 60) + 40,
    "情商": Math.floor(Math.random() * 60) + 40,
    "运气": Math.floor(Math.random() * 30) + 1,
    "发量": Math.floor(Math.random() * 100),
    "社恐": Math.floor(Math.random() * 100),
    "摸鱼": Math.floor(Math.random() * 100),
  };

  zone.innerHTML = `
    <div class="persona-wrap">
      <div class="persona-title">🎭 今日人设 🎭</div>
      <div class="persona-role">${role}</div>
      <div class="persona-section">
        <div class="persona-row"><span class="persona-label">💀 弱点</span><span class="persona-value">${weakness}</span></div>
        <div class="persona-row"><span class="persona-label">🎒 随身物品</span><span class="persona-value">${item}</span></div>
        <div class="persona-row"><span class="persona-label">🎯 今日目标</span><span class="persona-value">${goal}</span></div>
        <div class="persona-row"><span class="persona-label">👁 今日诅咒</span><span class="persona-value" style="color:var(--red)">${curse}</span></div>
      </div>
      <div class="persona-stats">
        ${Object.entries(stats).map(([k, v]) => `
          <div class="persona-stat">
            <span class="persona-stat-label">${k}</span>
            <div class="persona-bar"><div class="persona-bar-fill" style="width:${v}%"></div></div>
            <span class="persona-stat-num">${v}</span>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}

// ========================
// 废话文学
// ========================

const NONSENSE_TEMPLATES = [
  "据统计，{adj}的人在做{thing}的时候，其实都在{doing}。而剩下的{pct}%的人，则选择了{choice}。",
  "专家指出，{thing1}和{thing2}之间存在着密不可分的关系：有{thing1}的地方一定有{thing2}，除非没有。",
  "据最新研究显示，每{unit}都有{num}{unit}在流逝。这意味着当你读完这句话的时候，已经过去了大约{sec}秒。",
  "在{count}个{people}中，有{pct}%的人表示自己{adj}，另外{pct2}%的人表示不发表意见，剩下的则表示「{response}」。",
  "众所周知，{fact}。但很少有人知道，反过来其实也一样——{reverse}。这就是所谓的{principle}。",
  "如果你{action1}，那么你{action2}的概率是{pct}%。但如果你不{action1}，那么你不{action2}的概率也是{pct}%。这意味着，{conclusion}。",
  "历史告诉我们，{event1}的人最终都{result1}了。而{event2}的人，则{result2}。所以，到底要怎样，答案很明显：{obvious}。",
  "根据{source}的最新数据，{thing}的{metric}比去年增长了{pct}%，但如果你仔细看，会发现这个数字其实{surprise}。",
  "有人说{quote1}，也有人说{quote2}。但我要说的是，这两种说法{relation}——因为它们说的都是{same}。",
  "当你{action}的时候，有没有想过，此时此刻全球大约有{count}人也在{action}？这就是所谓的{concept}。",
  "研究证实，{thing}对{target}的影响是{effect}的。简单来说就是：有影响。至于什么影响——研究还在进行中。",
  "{adj}的人总是{doing1}，而{adj2}的人总是{doing2}。但如果你既是{adj}又是{adj2}，恭喜你，你是{combo}。",
];

const NONSENSE_FILL = {
  adj: ["优秀","普通","随机","不确定","可疑","匿名","大多数","少数"],
  thing: ["呼吸","眨眼","思考","等待","犹豫","发呆","摸鱼","拖延"],
  doing: ["假装在听","走神","想别的事","偷偷看手机","数天花板上的点","练习呼吸","回忆午饭吃了啥"],
  pct: ["37","42","56","63","78","89","91"],
  choice: ["放弃思考","假装听懂了","继续发呆","选择了沉默","直接躺平","假装很忙"],
  thing1: ["周一","加班"], thing2: ["困","咖啡"],
  unit: ["分钟","小时","秒","天"],
  num: ["60","3600","24","1440"],
  sec: ["3","5","8","2"],
  count: ["1000","10000","100000"],
  people: ["受访者","路人","上班族","大学生","社畜"],
  response: ["你说什么","我刚才没听","再说一遍","随便吧","啊？"],
  fact: ["太阳从东边升起","水往低处流","人要吃饭","时间不等人"],
  reverse: ["水不往高处流","太阳不从西边落下","人不吃就不行","时间不等任何人"],
  principle: ["废话定律","显而易见原理","说了等于没说法则","轮回定理"],
  action1: ["努力","坚持","奋斗","早起","运动"],
  action2: ["成功","变强","变好","精神","健康"],
  conclusion: ["你做什么都一样","努力和不努力的结果可能一样","这完全取决于运气","关键是看心情"],
  event1: ["坚持到底","半途而废","犹豫不决","果断行动"],
  result1: ["坚持到了底","半途而废了","犹豫了很久","果断行动了"],
  event2: ["中途放弃","从头开始","反复纠结","赌一把"],
  result2: ["中途放弃了","从头开始了","反复纠结了","赌了一把"],
  obvious: ["看心情","随缘","别想太多","你开心就好"],
  source: ["某知名机构","互联网","大数据","一个不愿透露姓名的组织","隔壁老王"],
  metric: ["增长率","普及率","使用率","关注度"],
  surprise: ["跟去年一模一样","其实是在下降","根本没变化","换了个说法而已"],
  quote1: ["人生苦短","金钱不是万能的","知识就是力量","时间就是金钱"],
  quote2: ["及时行乐","没钱万万不能","无知是福","时间不等人"],
  relation: ["都对","都错","互相矛盾","其实是一回事"],
  same: ["废话","正确但没用的话","听君一席话如听一席话","说了等于没说"],
  action: ["发呆","刷手机","叹气","摸鱼","打哈欠","喝水"],
  target: ["人类","大脑","工作效率","心情","睡眠","社交"],
  effect: ["有","显著","微妙","不确定"],
  adj2: ["佛系","焦虑","躺平","内卷"],
  doing1: ["在思考人生","在摸鱼","假装很忙","真的很忙"],
  doing2: ["在焦虑","在躺平","假装很闲","真的很闲"],
  combo: ["人类之光","薛定谔的状态","不可描述","辩证统一体"],
  concept: ["同步率","共鸣","缘分","大数据的力量","量子纠缠"],
};

function genNonsense() {
  const tpl = NONSENSE_TEMPLATES[Math.floor(Math.random() * NONSENSE_TEMPLATES.length)];
  return tpl.replace(/\{(\w+)\}/g, (_, key) => {
    const pool = NONSENSE_FILL[key];
    if (!pool) return "???";
    return pool[Math.floor(Math.random() * pool.length)];
  });
}

function renderNonsense() {
  const zone = createCustomZone();
  const paragraphs = [genNonsense(), genNonsense(), genNonsense()];

  zone.innerHTML = `
    <div class="nonsense-wrap">
      <div class="nonsense-title">📝 废话文学 📝</div>
      <div class="nonsense-body">
        ${paragraphs.map(p => `<p class="nonsense-p">${p}</p>`).join("")}
      </div>
      <div class="nonsense-footer">—— 听君一席话，如听一席话</div>
    </div>
  `;
}

// ========================
// 工具函数
// ========================

function createCustomZone() {
  const old = document.getElementById("customZone");
  if (old) old.remove();
  const zone = document.createElement("div");
  zone.id = "customZone";
  zone.className = "custom-zone";
  document.getElementById("app").insertBefore(zone, document.querySelector(".bottom-bar"));
  return zone;
}

function showSetupGuide() {
  hideAll();
  const badge = document.getElementById("modeBadge");
  badge.textContent = ""; badge.className = "mode-badge";
  const guide = document.createElement("div");
  guide.id = "setupGuide"; guide.className = "setup-guide";
  guide.innerHTML = `
    <div class="setup-icon">🎁</div>
    <h2>欢迎使用 Surprise Tab</h2>
    <p>配置 AI API Key 可获得更个性化的冷笑话体验</p>
    <button class="setup-btn" id="goSettingsBtn">前往设置</button>
  `;
  document.getElementById("app").appendChild(guide);
  document.getElementById("goSettingsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
  });
}