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
  if (r < 0.15) return "game";
  if (r < 0.28) return "art";
  if (r < 0.43) return "joke";
  if (r < 0.58) return "decide";
  if (r < 0.72) return "fortune";
  if (r < 0.90) return "aiart";
  return "easter";
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
    game:   { text: "🎮 今日小游戏", cls: "game" },
    art:    { text: "🎨 生成艺术",   cls: "art" },
    joke:   { text: "😂 冷笑话",     cls: "joke" },
    decide: { text: "🎲 帮我选",     cls: "decide" },
    fortune:{ text: "🔮 今日运势",   cls: "fortune" },
    aiart:  { text: "🖼️ AI 画作",    cls: "aiart" },
    easter: { text: "🥚 ???",        cls: "easter" },
  };
  const l = labels[mode] || labels.game;
  badge.textContent = l.text;
  badge.className = "mode-badge " + l.cls;

  const renderers = { game: renderGame, art: renderArt, joke: renderJoke, decide: renderDecide, fortune: renderFortune, aiart: renderAiArt, easter: renderEaster };
  (renderers[mode] || renderers.game)();
}

// ========================
// 游戏：翻牌配对 / 猜数字
// ========================

function renderGame() {
  const zone = document.getElementById("gameZone");
  zone.style.display = "block";
  zone.innerHTML = "";
  if (Math.random() < 0.5) renderMemoryGame(zone);
  else renderGuessGame(zone);
}

function renderMemoryGame(zone) {
  const emojis = ["🎯","🔥","💎","🌈","🚀","🎪","🍕","🎵"];
  let pairs = [...emojis, ...emojis];
  shuffle(pairs);

  let flippedCards = [], matchedCount = 0, moves = 0, locked = false;

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
        if (a.querySelector(".flip-card-back").textContent === b.querySelector(".flip-card-back").textContent) {
          a.classList.add("matched"); b.classList.add("matched");
          matchedCount += 2; flippedCards = []; locked = false;
          if (matchedCount === pairs.length) document.getElementById("memoryInfo").textContent = `🎉 通关！用了 ${moves} 步`;
        } else {
          setTimeout(() => { a.classList.remove("flipped"); b.classList.remove("flipped"); flippedCards = []; locked = false; }, 800);
        }
      }
    });
    grid.appendChild(card);
  });
}

function renderGuessGame(zone) {
  const target = Math.floor(Math.random() * 100) + 1;
  let guesses = [], won = false;

  zone.innerHTML = `
    <div class="game-title">猜数字</div>
    <div class="game-info">我想了一个 1~100 之间的数字</div>
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
      tag.textContent = `${n} ✓`; tag.className = "guess-tag correct"; won = true; btn.disabled = true;
      result.textContent = `🎉 猜对了！用了 ${guesses.length + 1} 次`;
    } else if (n > target) { tag.textContent = `${n} 太大了`; tag.className = "guess-tag high"; }
    else { tag.textContent = `${n} 太小了`; tag.className = "guess-tag low"; }
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
// 生成艺术：粒子 / 万花筒
// ========================

function renderArt() {
  const canvas = document.getElementById("artCanvas");
  canvas.style.display = "block";
  const size = Math.min(560, window.innerWidth - 48);
  canvas.width = size; canvas.height = size;
  if (Math.random() < 0.5) renderParticles(canvas);
  else renderKaleidoscope(canvas);
}

function renderParticles(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height;
  const count = 60, maxDist = 100;
  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const c = isDark ? "244,132,95" : "91,82,238";
  const particles = Array.from({ length: count }, () => ({
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8,
    r: Math.random() * 2 + 1.5,
  }));
  function draw() {
    ctx.clearRect(0, 0, w, h);
    for (let i = 0; i < count; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c},0.8)`; ctx.fill();
      for (let j = i + 1; j < count; j++) {
        const q = particles[j], dx = p.x - q.x, dy = p.y - q.y, dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.strokeStyle = `rgba(${c},${(0.2 * (1 - dist / maxDist)).toFixed(2)})`; ctx.stroke(); }
      }
    }
    artAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function renderKaleidoscope(canvas) {
  const ctx = canvas.getContext("2d");
  const w = canvas.width, h = canvas.height, cx = w / 2, cy = h / 2;
  const segments = 8, angleStep = (Math.PI * 2) / segments;
  let t = 0;
  const theme = document.documentElement.getAttribute("data-theme");
  const isDark = theme === "dark" || (theme !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  const colors = isDark ? ["#f4845f","#c3aed6","#5ee0d8","#ffd97a","#ff9090"] : ["#5b52ee","#845ec2","#4ecdc4","#ffc75f","#f472b6"];
  function draw() {
    ctx.fillStyle = isDark ? "rgba(15,15,26,0.15)" : "rgba(245,243,239,0.15)";
    ctx.fillRect(0, 0, w, h);
    for (let s = 0; s < segments; s++) {
      ctx.save(); ctx.translate(cx, cy); ctx.rotate(s * angleStep + t * 0.3);
      if (s % 2 === 1) ctx.scale(1, -1);
      for (let i = 0; i < 4; i++) {
        const r = 40 + i * 30 + Math.sin(t + i) * 20;
        const x = r * Math.cos(t * 0.5 + i), y = r * Math.sin(t * 0.7 + i);
        const sz = 8 + Math.sin(t * 1.2 + i * 2) * 5;
        ctx.beginPath(); ctx.arc(x, y, Math.max(1, sz), 0, Math.PI * 2);
        ctx.fillStyle = colors[i % colors.length] + "aa"; ctx.fill();
      }
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const r = 40 + i * 30 + Math.sin(t + i) * 20;
        const x = r * Math.cos(t * 0.5 + i), y = r * Math.sin(t * 0.7 + i);
        if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = colors[0] + "44"; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.restore();
    }
    t += 0.015; artAnimId = requestAnimationFrame(draw);
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
// 随机决策器
// ========================

function renderDecide() {
  const zone = createCustomZone();
  const categories = [
    { name: "今天吃什么", items: ["火锅","烤肉","寿司","螺蛳粉","沙拉","披萨","麻辣烫","汉堡","粥","炒菜","拉面","饺子","轻食","煲仔饭","炸鸡"] },
    { name: "看什么电影", items: ["科幻片","喜剧片","悬疑片","动作片","动画片","纪录片","爱情片","恐怖片","剧情片"] },
    { name: "做什么运动", items: ["跑步","游泳","瑜伽","骑车","跳绳","散步","健身","打球","跳舞"] },
    { name: "听什么音乐", items: ["流行","摇滚","古典","爵士","电子","民谣","R&B","说唱","轻音乐"] },
  ];

  zone.innerHTML = `
    <div class="decide-wrap">
      <div class="decide-title">🎲 帮你选！</div>
      <div class="decide-cats" id="decideCats"></div>
      <div class="decide-result" id="decideResult" style="display:none"></div>
      <button class="decide-btn" id="decideBtn" style="display:none">就它了！</button>
      <div class="decide-animation" id="decideAnim" style="display:none"></div>
    </div>
  `;

  const catsEl = document.getElementById("decideCats");
  categories.forEach(cat => {
    const btn = document.createElement("button");
    btn.className = "decide-cat-btn";
    btn.textContent = cat.name;
    btn.addEventListener("click", () => startDecide(cat, zone));
    catsEl.appendChild(btn);
  });
}

function startDecide(cat, zone) {
  const result = document.getElementById("decideResult");
  const btn = document.getElementById("decideBtn");
  const anim = document.getElementById("decideAnim");
  const cats = document.getElementById("decideCats");

  cats.style.display = "none";
  anim.style.display = "flex";
  anim.textContent = "🎲";
  result.style.display = "none";
  btn.style.display = "none";

  let count = 0;
  const total = 15 + Math.floor(Math.random() * 10);
  const interval = setInterval(() => {
    anim.textContent = cat.items[Math.floor(Math.random() * cat.items.length)];
    count++;
    if (count >= total) {
      clearInterval(interval);
      const chosen = cat.items[Math.floor(Math.random() * cat.items.length)];
      anim.style.display = "none";
      result.textContent = chosen;
      result.style.display = "block";
      btn.style.display = "inline-block";
      btn.addEventListener("click", () => {
        result.style.animation = "none"; result.offsetHeight;
        result.style.animation = "fadeUp 0.4s ease-out";
      });
    }
  }, 80);
}

// ========================
// 今日运势
// ========================

function renderFortune() {
  const zone = createCustomZone();
  const seed = getTodayString() + navigator.userAgent;
  let hash = 0;
  for (const ch of seed) hash = ((hash << 5) - hash + ch.charCodeAt(0)) | 0;
  const idx = Math.abs(hash);

  const luckLevels = ["大吉","中吉","小吉","吉","末吉","凶","大凶"];
  const luck = luckLevels[idx % luckLevels.length];

  const aspects = [
    { name: "事业", pool: ["今天适合推进重要项目","开会时大胆发言会有意外收获","别急着做决定，再想想","适合跟领导提加薪","摸鱼一天也不会被发现","你的方案会被认可","低调做事，高调出结果"] },
    { name: "爱情", pool: ["有人正在想你","今天可能收到一条意想不到的消息","主动一点，故事就开始了","独处也挺好的","记得回那个人的消息","适合表白","今天桃花运不错"] },
    { name: "财运", pool: ["意外之财在路上","今天别乱花钱","投资需谨慎","省下的就是赚到的","出门可能捡到钱","奶茶买一送一就是今天的财运","你的钱包在颤抖"] },
    { name: "健康", pool: ["今天精力充沛","早点休息","多喝水","适合运动","别熬夜","注意肩颈","散步有助于思考"] },
  ];

  const luckyNum = (idx % 99) + 1;
  const luckyColor = ["红色","橙色","金色","绿色","蓝色","紫色","粉色","白色","黑色"][idx % 9];
  const luckyDir = ["东","南","西","北","东北","东南","西北","西南"][idx % 8];

  let html = `
    <div class="fortune-wrap">
      <div class="fortune-luck luck-${luck}">${luck}</div>
      <div class="fortune-details">
  `;

  aspects.forEach(a => {
    html += `<div class="fortune-row"><span class="fortune-label">${a.name}</span><span class="fortune-value">${a.pool[idx % a.pool.length]}</span></div>`;
  });

  html += `
      </div>
      <div class="fortune-extras">
        <span>幸运数字 <b>${luckyNum}</b></span>
        <span>幸运色 <b>${luckyColor}</b></span>
        <span>幸运方位 <b>${luckyDir}</b></span>
      </div>
    </div>
  `;

  zone.innerHTML = html;
}

// ========================
// AI 画作（pollinations.ai 免费生成）
// ========================

const AI_ART_PROMPTS = [
  "a spaghetti monster fighting a toaster in a bathtub filled with clocks, surrealism, chaotic",
  "a business meeting where everyone is a different vegetable, corporate horror, oil painting",
  "a giraffe wearing sneakers breakdancing on the moon while penguins judge, absurdist art",
  "a traffic jam inside someone's stomach, cars driving through intestines, weird art",
  "a cat giving a TED talk to an audience of rubber ducks, surrealist painting",
  "a staircase that leads to a giant eye in the sky, MC Escher meets Salvador Dali",
  "a whale flying over a city made entirely of jello, bizarre, vivid colors",
  "a potato running for president, campaign rally with tiny vegetables holding signs, satirical art",
  "a man whose head is a fishbowl and the fish inside is wearing a tiny hat, surreal portrait",
  "a tornado made of old socks destroying a Lego city, absurd, dramatic lighting",
  "an octopus playing 8 pianos simultaneously, each tentacle on a different piano, chaotic concert",
  "a city where all buildings are made of cheese, mice in suits walking on cheese streets",
  "a snail racing a cheetah and winning, the cheetah is crying, sports photography style",
  "a meditation retreat where everyone is screaming, peaceful nature background, ironic",
  "a grand piano falling from the sky into a bowl of soup, slow motion, dramatic",
  "a dragon allergic to fire sneezing bubbles onto a medieval village, watercolor",
  "a penguin barista making coffee for a polar bear, cozy cafe in Antarctica",
  "a cloud that refuses to rain because it's having a bad day, emotional weather art",
  "a warehouse full of spare body parts having a party, grotesque surrealism",
  "a dog driving a tiny car through a car wash that is also a therapy session",
  "a mountain that is actually a sleeping giant, trees growing on its face, fantasy art",
  "a submarine floating in the sky dropping clouds instead of torpedoes, absurd military art",
  "a bee the size of a building collecting pollen from a flower skyscraper, macro scale art",
  "a chess game where the pieces are alive and arguing about their next moves, renaissance style",
  "a toilet that is a portal to another dimension where everything is backwards, psychedelic",
  "a grandma arm wrestling a robot and winning easily, the robot is crying oil, hyperrealistic",
  "a library where all the books are screaming, a person calmly reading one anyway, dark humor",
  "a fish driving a forklift in an underwater warehouse, corporate absurdism",
  "a cake that is also a volcano, candles erupting like lava, birthday apocalypse",
  "a mirror that reflects a completely different room with a different you staring back, horror surrealism",
  "a group of crows in trench coats pretending to be a human at a job interview, noir style",
  "a sink drain that leads to a beautiful paradise, someone reaching in to pull the plug",
  "a roomba that has achieved sentience and is now painting murals on the floor, abstract expressionism",
  "a vending machine in the middle of a desert, only sells existential crises, moody lighting",
  "a tiny civilization living inside a snow globe arguing about climate change, meta humor",
];

function renderAiArt() {
  const zone = createCustomZone();
  const prompt = AI_ART_PROMPTS[Math.floor(Math.random() * AI_ART_PROMPTS.length)];

  zone.innerHTML = `
    <div class="aiart-wrap">
      <div class="aiart-loading" id="aiartLoading">
        <div class="loading-spinner"></div>
        <p>AI 正在作画...</p>
      </div>
      <img class="aiart-img" id="aiartImg" style="display:none" alt="AI 生成画作">
      <div class="aiart-prompt" id="aiartPrompt" style="display:none"></div>
    </div>
  `;

  const img = document.getElementById("aiartImg");
  const loading = document.getElementById("aiartLoading");
  const promptEl = document.getElementById("aiartPrompt");

  const seed = Math.floor(Math.random() * 999999);
  const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=768&height=768&seed=${seed}&nologo=true`;

  img.onload = () => {
    loading.style.display = "none";
    img.style.display = "block";
    promptEl.style.display = "block";
  };
  img.onerror = () => {
    loading.style.display = "none";
    zone.innerHTML = `<div class="aiart-error">画作生成失败，点击刷新试试</div>`;
  };
  img.src = url;

  promptEl.textContent = prompt;
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