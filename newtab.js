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
  if (r < 0.08) return "game";
  if (r < 0.16) return "art";
  if (r < 0.24) return "joke";
  if (r < 0.31) return "decide";
  if (r < 0.38) return "fortune";
  if (r < 0.50) return "aiart";
  if (r < 0.55) return "easter";
  if (r < 0.63) return "npc";
  if (r < 0.71) return "absurd";
  if (r < 0.79) return "fakenews";
  if (r < 0.87) return "nottoday";
  return "skill";
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
    npc:    { text: "🤖 离谱对话",   cls: "npc" },
    absurd: { text: "🪐 离谱占卜",   cls: "absurd" },
    fakenews:{ text: "📰 假新闻",    cls: "fakenews" },
    nottoday:{ text: "🚫 今天不适合", cls: "nottoday" },
    skill:  { text: "⚡ 技能解锁",   cls: "skill" },
  };
  const l = labels[mode] || labels.game;
  badge.textContent = l.text;
  badge.className = "mode-badge " + l.cls;

  const renderers = { game: renderGame, art: renderArt, joke: renderJoke, decide: renderDecide, fortune: renderFortune, aiart: renderAiArt, easter: renderEaster, npc: renderNpc, absurd: renderAbsurd, fakenews: renderFakeNews, nottoday: renderNotToday, skill: renderSkill };
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

  let settled = false;
  const timeout = setTimeout(() => {
    if (settled) return;
    settled = true;
    zone.innerHTML = `<div class="aiart-error">画作生成超时，点击刷新试试</div>`;
  }, 15000);

  img.onload = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    loading.style.display = "none";
    img.style.display = "block";
    promptEl.style.display = "block";
  };
  img.onerror = () => {
    if (settled) return;
    settled = true;
    clearTimeout(timeout);
    zone.innerHTML = `<div class="aiart-error">画作生成失败，点击刷新试试</div>`;
  };

  const seed = Math.floor(Math.random() * 999999);
  img.src = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&seed=${seed}&nologo=true`;
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