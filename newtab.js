const MODES = ["game", "art", "joke"];

function getTodayString() {
  return new Date().toLocaleDateString("sv-SE");
}

function getTodayMode() {
  let hash = 0;
  for (const ch of getTodayString()) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return MODES[Math.abs(hash) % MODES.length];
}

let artAnimId = null;
let refreshCooldown = false;

document.addEventListener("DOMContentLoaded", () => {
  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  document.getElementById("dateText").textContent =
    `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日 星期${weekDays[now.getDay()]}`;

  renderToday();

  document.getElementById("refreshBtn").addEventListener("click", () => {
    if (refreshCooldown) return;
    refreshCooldown = true;
    document.getElementById("refreshBtn").disabled = true;
    setTimeout(() => {
      refreshCooldown = false;
      document.getElementById("refreshBtn").disabled = false;
    }, 3000);
    renderToday(true);
  });
  document.getElementById("settingsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
  });
  document.getElementById("retryBtn").addEventListener("click", () => renderToday(true));
});

function hideAll() {
  if (artAnimId) { cancelAnimationFrame(artAnimId); artAnimId = null; }
  document.getElementById("gameZone").style.display = "none";
  document.getElementById("artCanvas").style.display = "none";
  document.getElementById("jokeCard").style.display = "none";
  document.getElementById("loading").style.display = "none";
  document.getElementById("errorMsg").style.display = "none";
  const g = document.getElementById("setupGuide");
  if (g) g.remove();
  document.getElementById("modeBadge").textContent = "";
  document.getElementById("modeBadge").className = "mode-badge";
}

function renderToday(forceNew = false) {
  const mode = getTodayMode();
  hideAll();

  const badge = document.getElementById("modeBadge");
  if (mode === "game") { badge.textContent = "🎮 今日小游戏"; badge.className = "mode-badge game"; }
  if (mode === "art")  { badge.textContent = "🎨 今日生成艺术"; badge.className = "mode-badge art"; }
  if (mode === "joke") { badge.textContent = "😂 今日冷笑话"; badge.className = "mode-badge joke"; }

  if (mode === "game") renderGame(forceNew);
  else if (mode === "art") renderArt(forceNew);
  else renderJoke(forceNew);
}

// ========================
// 游戏：翻牌配对 / 猜数字
// ========================

const GAME_TYPES = ["memory", "guess"];

function getTodayGame() {
  let hash = 0;
  const s = getTodayString() + "game";
  for (const ch of s) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return GAME_TYPES[Math.abs(hash) % GAME_TYPES.length];
}

function renderGame(forceNew) {
  const zone = document.getElementById("gameZone");
  zone.style.display = "block";
  zone.innerHTML = "";

  if (getTodayGame() === "memory") renderMemoryGame(zone, forceNew);
  else renderGuessGame(zone, forceNew);
}

function renderMemoryGame(zone, forceNew) {
  const emojis = ["🎯","🔥","💎","🌈","🚀","🎪","🍕","🎵"];
  let pairs = [...emojis, ...emojis];

  // 如果有缓存且不强制刷新，用缓存顺序
  const cacheKey = "game_memory_" + getTodayString();
  if (!forceNew) {
    const cached = localStorage.getItem(cacheKey);
    if (cached) {
      try { pairs = JSON.parse(cached); } catch {}
    } else {
      shuffle(pairs);
      localStorage.setItem(cacheKey, JSON.stringify(pairs));
    }
  } else {
    shuffle(pairs);
    localStorage.setItem(cacheKey, JSON.stringify(pairs));
  }

  let flippedCards = [];
  let matchedCount = 0;
  let moves = 0;
  let locked = false;

  zone.innerHTML = `
    <div class="game-title">翻牌配对</div>
    <div class="game-info" id="memoryInfo">翻开卡片找到相同的配对！步数: 0</div>
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
        document.getElementById("memoryInfo").textContent = `翻开卡片找到相同的配对！步数: ${moves}`;
        locked = true;

        const [a, b] = flippedCards;
        const emojiA = a.querySelector(".flip-card-back").textContent;
        const emojiB = b.querySelector(".flip-card-back").textContent;

        if (emojiA === emojiB) {
          a.classList.add("matched");
          b.classList.add("matched");
          matchedCount += 2;
          flippedCards = [];
          locked = false;

          if (matchedCount === pairs.length) {
            document.getElementById("memoryInfo").textContent = `🎉 恭喜通关！用了 ${moves} 步`;
          }
        } else {
          setTimeout(() => {
            a.classList.remove("flipped");
            b.classList.remove("flipped");
            flippedCards = [];
            locked = false;
          }, 800);
        }
      }
    });
    grid.appendChild(card);
  });
}

function renderGuessGame(zone, forceNew) {
  const cacheKey = "game_guess_" + getTodayString();
  let target;
  if (!forceNew && localStorage.getItem(cacheKey)) {
    target = parseInt(localStorage.getItem(cacheKey));
  } else {
    target = Math.floor(Math.random() * 100) + 1;
    localStorage.setItem(cacheKey, target);
  }

  let guesses = [];
  let won = false;

  zone.innerHTML = `
    <div class="game-title">猜数字</div>
    <div class="game-info">我想了一个 1~100 之间的数字，猜猜看！</div>
    <div class="guess-zone">
      <div class="guess-input-row">
        <input type="number" class="guess-input" id="guessInput" min="1" max="100" placeholder="?">
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
    if (isNaN(n) || n < 1 || n > 100) return;

    input.value = "";
    const tag = document.createElement("span");
    tag.className = "guess-tag";

    if (n === target) {
      tag.textContent = `${n} ✓`;
      tag.className = "guess-tag correct";
      won = true;
      btn.disabled = true;
      result.textContent = `🎉 猜对了！答案就是 ${target}，用了 ${guesses.length + 1} 次`;
    } else if (n > target) {
      tag.textContent = `${n} 太大了`;
      tag.className = "guess-tag high";
    } else {
      tag.textContent = `${n} 太小了`;
      tag.className = "guess-tag low";
    }
    guesses.push(n);
    history.appendChild(tag);
    input.focus();
  }

  btn.addEventListener("click", doGuess);
  input.addEventListener("keydown", (e) => { if (e.key === "Enter") doGuess(); });
  input.focus();
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

// ========================
// 生成艺术：粒子 / 万花筒
// ========================

const ART_TYPES = ["particles", "kaleidoscope"];

function getTodayArt() {
  let hash = 0;
  const s = getTodayString() + "art";
  for (const ch of s) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  return ART_TYPES[Math.abs(hash) % ART_TYPES.length];
}

function renderArt() {
  const canvas = document.getElementById("artCanvas");
  canvas.style.display = "block";

  const size = Math.min(560, window.innerWidth - 48);
  canvas.width = size;
  canvas.height = size;

  if (getTodayArt() === "particles") renderParticles(canvas);
  else renderKaleidoscope(canvas);
}

function renderParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const count = 60;
  const maxDist = 100;
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dotColor = isDark ? "rgba(244,132,95," : "rgba(232,115,74,";
  const lineColor = isDark ? "rgba(244,132,95," : "rgba(232,115,74,";

  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8,
    vy: (Math.random() - 0.5) * 0.8,
    r: Math.random() * 2 + 1.5,
  }));

  function draw() {
    ctx.clearRect(0, 0, w, h);

    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = dotColor + "0.8)";
      ctx.fill();

      for (let j = i + 1; j < count; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = lineColor + (0.2 * (1 - dist / maxDist)).toFixed(2) + ")";
          ctx.stroke();
        }
      }
    }

    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderKaleidoscope(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const cx = w / 2;
  const cy = h / 2;
  const segments = 8;
  const angleStep = (Math.PI * 2) / segments;
  let t = 0;
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  const colors = isDark
    ? ["#f4845f", "#c3aed6", "#5ee0d8", "#ffd97a", "#ff9090"]
    : ["#e8734a", "#845ec2", "#4ecdc4", "#ffc75f", "#ff6b6b"];

  function draw() {
    ctx.fillStyle = isDark ? "rgba(26,26,46,0.15)" : "rgba(248,246,241,0.15)";
    ctx.fillRect(0, 0, w, h);

    for (let s = 0; s < segments; s++) {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s * angleStep + t * 0.3);
      if (s % 2 === 1) ctx.scale(1, -1);

      for (let i = 0; i < 4; i++) {
        const r = 40 + i * 30 + Math.sin(t + i) * 20;
        const x = r * Math.cos(t * 0.5 + i);
        const y = r * Math.sin(t * 0.7 + i);
        const size = 8 + Math.sin(t * 1.2 + i * 2) * 5;

        ctx.beginPath();
        ctx.arc(x, y, Math.max(1, size), 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length] + "aa";
    ctx.fill();
      }

      // 连接线
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const r = 40 + i * 30 + Math.sin(t + i) * 20;
        const x = r * Math.cos(t * 0.5 + i);
        const y = r * Math.sin(t * 0.7 + i);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[0] + "44";
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.restore();
    }

    t += 0.015;
    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

// ========================
// 冷笑话（AI 生成）
// ========================

function renderJoke(forceNew) {
  const jokeCard = document.getElementById("jokeCard");
  const jokeSetup = document.getElementById("jokeSetup");
  const jokeRevealBtn = document.getElementById("jokeRevealBtn");
  const jokePunchline = document.getElementById("jokePunchline");
  const loading = document.getElementById("loading");

  jokeCard.style.display = "none";
  jokePunchline.style.display = "none";
  jokeRevealBtn.style.display = "inline-block";

  // 检查缓存
  const cacheKey = "joke_" + getTodayString();
  if (!forceNew && localStorage.getItem(cacheKey)) {
    try {
      const cached = JSON.parse(localStorage.getItem(cacheKey));
      jokeSetup.textContent = cached.setup;
      jokePunchline.textContent = cached.punchline;
      jokeCard.style.display = "block";
      jokeRevealBtn.onclick = () => {
        jokePunchline.style.display = "block";
        jokeRevealBtn.style.display = "none";
      };
      return;
    } catch {}
  }

  // 调 AI 生成
  loading.style.display = "flex";

  const port = chrome.runtime.connect({ name: "jokeStream" });

  let fullText = "";
  let streamStarted = false;

  port.onMessage.addListener((msg) => {
    if (msg.type === "stream") {
      if (!streamStarted) {
        streamStarted = true;
        loading.style.display = "none";
        jokeCard.style.display = "block";
        jokeSetup.textContent = "生成中...";
        jokeRevealBtn.style.display = "none";
      }
      fullText = msg.text;
    }

    if (msg.type === "done") {
      loading.style.display = "none";
      jokeCard.style.display = "block";
      jokeRevealBtn.style.display = "inline-block";

      const setup = msg.data.setup || msg.data.content || fullText;
      const punchline = msg.data.punchline || msg.data.footer || "";

      jokeSetup.textContent = setup;
      jokePunchline.textContent = punchline;

      localStorage.setItem(cacheKey, JSON.stringify({ setup, punchline }));

      jokeRevealBtn.onclick = () => {
        jokePunchline.style.display = "block";
        jokeRevealBtn.style.display = "none";
      };
    }

    if (msg.type === "error") {
      loading.style.display = "none";
      if (msg.error === "NO_API_KEY" || msg.error === "NO_API_URL") {
        showSetupGuide();
      } else {
        document.getElementById("errorText").textContent = msg.error;
        document.getElementById("errorMsg").style.display = "flex";
      }
    }
  });
}

// ========================
// 设置引导
// ========================

function showSetupGuide() {
  hideAll();
  const badge = document.getElementById("modeBadge");
  badge.textContent = "";
  badge.className = "mode-badge";

  const guide = document.createElement("div");
  guide.id = "setupGuide";
  guide.className = "setup-guide";
  guide.innerHTML = `
    <div class="setup-icon">🎁</div>
    <h2>欢迎使用每日惊喜</h2>
    <p>冷笑话需要配置 API Key 才能使用</p>
    <ol>
      <li>选择一个 AI 提供商（智谱、DeepSeek、OpenAI 等）</li>
      <li>填入你的 API Key</li>
      <li>点击下方按钮前往设置</li>
    </ol>
    <button class="setup-btn" id="goSettingsBtn">前往设置</button>
  `;
  document.getElementById("app").appendChild(guide);
  document.getElementById("goSettingsBtn").addEventListener("click", () => {
    chrome.runtime.sendMessage({ action: "openOptions" });
  });
}