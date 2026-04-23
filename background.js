import { PRESET_APIS } from "./config.js";

// === 内置笑话池 ===

const JOKE_POOL = [
  { setup: "一只企鹅走进酒吧，对酒保说：你看到我哥了吗？", punchline: "酒保说：什么样的？企鹅说：跟我也差不多，就是穿了件燕尾服" },
  { setup: "为什么自行车不能自己站起来？", punchline: "因为它 two-tired（太累了/两个轮子）" },
  { setup: "一匹马走进了酒吧，酒保问：为什么拉着个长脸？", punchline: "马说：我生来就这样" },
  { setup: "一条鱼撞到了墙上，它说了什么？", punchline: "Dam（水坝/该死）" },
  { setup: "一个三明治走进酒吧，酒保说：我们不接待食物", punchline: "三明治说：没关系，我自己带了饮料" },
  { setup: "为什么程序员分不清万圣节和圣诞节？", punchline: "因为 Oct 31 = Dec 25" },
  { setup: "一个电池走进酒吧，酒保说：我们不接待你这种类型的", punchline: "电池说：别这样，我可以正极也可以负极" },
  { setup: "两个天线结婚了，婚礼怎么样？", punchline: "很差，但婚礼本身信号很强" },
  { setup: "为什么数学书总是很伤心？", punchline: "因为它有太多问题" },
  { setup: "一块奶酪走进酒吧，酒保说：我们不接待你", punchline: "奶酪说：为什么？我很有品质（gouda/好的）啊" },
  { setup: "一个ghost走进酒吧，酒保说：我们不招待你", punchline: "ghost说：没关系，我spirit很高" },
  { setup: "为什么飞行员不能脱发？", punchline: "因为那是飞机的航线" },
  { setup: "一只蜗牛爬上了一棵苹果树，树说：你来干嘛？", punchline: "蜗牛说：苹果不是还在吗？我只是来早了" },
  { setup: "一张照片走进了酒吧，酒保说：怎么这表情？", punchline: "照片说：我被人frame了" },
  { setup: "一个蘑菇走进了酒吧，酒保说：你出去", punchline: "蘑菇说：为什么？我可是fun guy（fungi/真菌）" },
  { setup: "一个CPU走进了酒吧，酒保说：你要什么？", punchline: "CPU说：给我来个指令，我来处理" },
  { setup: "两只牛在吃草，一只对另一只说：你担心疯牛病吗？", punchline: "另一只说：不担心，我是直升机" },
  { setup: "一个人对图书馆员说：我要一份薯条。图书馆员说：这是图书馆", punchline: "他小声说：我要一份薯条" },
  { setup: "为什么6怕7？", punchline: "因为7 8 9（seven ate nine）" },
  { setup: "一个吸血鬼走进酒吧，点了一杯热水", punchline: "酒保问：为什么？吸血鬼掏出一个卫生茶包说：泡茶" },
  { setup: "一个蚊子对另一个蚊子说：走，去血站", punchline: "另一个说：不了，我今天素食" },
  { setup: "为什么洋葱不喜欢社交？", punchline: "因为每次有人靠近它就哭" },
  { setup: "一只鸽子对另一只鸽子说：你有钱吗？", punchline: "另一只说：没有，我只有咕咕（股股）" },
  { setup: "一个程序员去面试，面试官问：你有什么特长？", punchline: "程序员说：我能在任何一个系统里找到bug。面试官说：证明一下。程序员看了一眼公司官网：你们这个招聘页面就是bug" },
  { setup: "一只猫走进了酒吧，酒保说：我们不接待动物", punchline: "猫说：我是来投诉的，你们昨天的鱼不好吃" },
  { setup: "为什么冰箱不会讲笑话？", punchline: "因为它的笑话都冻住了" },
  { setup: "一只蜈蚣去买鞋，店员问：你要几双？", punchline: "蜈蚣说：你有没有团购优惠？" },
  { setup: "为什么筷子总是成对出现？", punchline: "因为单根筷子会抑郁" },
  { setup: "一根香蕉走在路上摔了一跤，变成了什么？", punchline: "泥蕉（你焦）" },
  { setup: "一只章鱼走进酒吧，酒保说：你八条腿怎么走路？", punchline: "章鱼说：四条走，四条扫码" },
  { setup: "为什么牙刷从来不参加聚会？", punchline: "因为它总觉得自己被利用了" },
  { setup: "一只猫打开电脑，另一只猫问：你在干嘛？", punchline: "第一只猫说：我在上网。第二只说：上什么网？第一只说：蜘蛛网" },
  { setup: "为什么云朵不去上班？", punchline: "因为它会自动蒸发" },
  { setup: "一只金鱼从鱼缸里跳出来，它妈妈说：你疯了吗？", punchline: "金鱼说：我只是在思考鱼生" },
  { setup: "一个WiFi信号走进酒吧，酒保说：你信号不太好啊", punchline: "WiFi说：没事，我连一下自己就好了" },
  { setup: "为什么月亮总是跟着你？", punchline: "因为它跟踪技术比你还厉害" },
  { setup: "一匹斑马走进酒吧，酒保说：你穿条纹衣服不能进", punchline: "斑马说：这是我的皮肤！酒保说：不好意思，我还以为是 referees" },
  { setup: "为什么电脑打不了棒球？", punchline: "因为它的鼠标（mouse/老鼠）跑了" },
  { setup: "一个闹钟走进酒吧，酒保说：你为什么这么吵？", punchline: "闹钟说：因为如果我不吵，就没有人理我" },
  { setup: "一只蜥蜴走进酒吧，酒保问：你喝什么？", punchline: "蜥蜴说：水，不要冰，我是冷血动物" },
  { setup: "一个灯泡走进酒吧，酒保说：你脸色不太好", punchline: "灯泡说：我被人关了一整天" },
  { setup: "为什么游泳池永远不会口渴？", punchline: "因为它全身都是水" },
  { setup: "一只蜘蛛走进酒吧，酒保说：我们不接待你", punchline: "蜘蛛说：为什么？我可以帮你织网页（web）" },
  { setup: "一只考拉走进酒吧，点了一杯酒，喝完就走了", punchline: "酒保说：这人怎么回事？旁边的考拉说：别在意，它脑子很慢（koala/慢吞吞）" },
  { setup: "为什么骰子没有朋友？", punchline: "因为人们只在赌博的时候才摸它" },
  { setup: "一条鲨鱼走进酒吧，酒保说：你怎么不游泳了？", punchline: "鲨鱼说：卡奴周（卡奴：被信用卡奴役的人）太多了，我改行上岸了" },
  { setup: "一个镜子走进酒吧，酒保说：你 reflection（反射/反省）过了吗？", punchline: "镜子说：我每天都在 reflect" },
  { setup: "一只蚂蚁走进酒吧，点了一杯啤酒，酒保说：你喝得完吗？", punchline: "蚂蚁说：喝不完，但我可以扛" },
  { setup: "为什么铅笔不开心？", punchline: "因为它总是被指点" },
  { setup: "一个锅走进酒吧，酒保说：你是什么锅？", punchline: "锅说：背锅的" },
  { setup: "两只蚂蚁在路上走，一只突然说：嘘！", punchline: "另一只说：怎么了？第一只说：前面有个anthill（蚂蚁山/悬念）" },
  { setup: "为什么书总是很冷静？", punchline: "因为它有很多 chapter（章节/冷）" },
  { setup: "一个枕头走进酒吧，酒保说：你看起来很累", punchline: "枕头说：我每天都在替别人扛压力" },
  { setup: "一只乌鸦走进酒吧，酒保说：你是什么鸟？", punchline: "乌鸦说：我是参与鸟（参与=掺鸦）" },
  { setup: "为什么洗衣机会转？", punchline: "因为它看不下去了，转过头去" },
  { setup: "一个茶包走进酒吧，酒保说：你泡过了？", punchline: "茶包说：我被人利用了，但现在我很有味道" },
  { setup: "为什么雨伞总是不开心？", punchline: "因为它总是被人撑着，自己却淋不到雨" },
  { setup: "一只蜜蜂走进酒吧，酒保说：你 sting（蛰/坑）过谁？", punchline: "蜜蜂说：只蛰过不听话的。酒保立刻倒了一杯蜂蜜" },
  { setup: "为什么键盘上的空格键最大？", punchline: "因为它需要最多空间" },
  { setup: "一个红绿灯走进酒吧，酒保说：你脸色变来变去的", punchline: "红绿灯说：我情绪不稳定" },
  { setup: "为什么地图从不去医院？", punchline: "因为它有所有的 direction（方向/处方）" },
  { setup: "一只仓鼠走进酒吧，点了一杯水，酒保说：你跑出来了吗？", punchline: "仓鼠说：轮子转太慢了，我出来透透气" },
  { setup: "为什么橡皮总是很开心？", punchline: "因为它能抹掉所有的错误" },
  { setup: "一个钟表走进酒吧，酒保说：你几点了？", punchline: "钟表说：我 time-less（永恒/没时间）" },
  { setup: "一只蚊子走进酒吧，酒保说：你来干嘛？", punchline: "蚊子说：我来吸——饮一下氛围" },
  { setup: "为什么剪刀不开心？", punchline: "因为别人总说它 cut（剪切/伤人）" },
  { setup: "一个汉堡走进酒吧，酒保说：我们只卖饮料", punchline: "汉堡说：没关系，我自带面包" },
  { setup: "为什么蜗牛不去赌场？", punchline: "因为它自带壳（壳=house，庄家）" },
  { setup: "一只骆驼走进酒吧，酒保说：你驼了多少？", punchline: "骆驼说：不多，就两杯。酒保说：那你背上的包是？骆驼说：那是我的外带杯" },
  { setup: "为什么冰箱很自恋？", punchline: "因为它很酷（cool）" },
  { setup: "一个灯泡对另一个灯泡说：你亮了。另一个说：", punchline: "你才亮了，你们全家都亮了" },
  { setup: "为什么火柴不去参加聚会？", punchline: "因为它一激动就烧起来了" },
  { setup: "一只苍蝇走进酒吧，酒保说：你走错地方了", punchline: "苍蝇说：没错，我在找那碗汤" },
  { setup: "为什么数学家不喜欢大自然？", punchline: "因为大自然太 organic（有机/无组织）了" },
  { setup: "一个枕头和一床被子吵架了，谁赢了？", punchline: "没人赢，他们都 cold（冷/酷）了" },
  { setup: "一只壁虎走进酒吧，酒保说：你的尾巴呢？", punchline: "壁虎说：断了，我把它留在上一个酒吧了" },
  { setup: "为什么电脑不喜欢运动？", punchline: "因为它怕 crash（崩溃/撞车）" },
  { setup: "一棵树走进了酒吧，酒保说：你要什么？", punchline: "树说：啤酒，要根。酒保说：你不是已经有很多根了吗？树说：那是脚" },
  { setup: "为什么袜子成对出现？", punchline: "因为单身袜会失踪，这是物理定律" },
  { setup: "一只鸭子走进药店，说：给我来管唇膏。药店问：怎么付款？", punchline: "鸭子说：放我 bill（鸟嘴/账单）上" },
  { setup: "为什么眼镜不去游泳？", punchline: "因为它怕被水 frame（框架/陷害）" },
  { setup: "一只猫和一条鱼住一起，猫说：我们不合适", punchline: "鱼说：为什么？猫说：因为每次我看着你都在想今晚吃什么" },
  { setup: "为什么电梯很谦虚？", punchline: "因为它总是让别人先上" },
  { setup: "一个问号走进酒吧，酒保说：你到底要什么？", punchline: "问号说：我也不知道，所以才弯着的" },
  { setup: "为什么披萨很圆？", punchline: "因为它被生活磨平了棱角" },
  { setup: "一只猫头鹰走进酒吧，酒保说：你怎么白天来了？", punchline: "猫头鹰说：失眠了，想喝点助眠的" },
  { setup: "为什么筷子不吵架？", punchline: "因为它们永远在同一个频道" },
  { setup: "一只鸽子飞进图书馆，管理员说：这里不许飞", punchline: "鸽子说：我是在 book（书/预订）座位" },
  { setup: "为什么太阳不去上学？", punchline: "因为它已经几百万度了（学历太高）" },
  { setup: "一只恐龙走进酒吧，酒保说：你不是灭绝了吗？", punchline: "恐龙说：我只是在闭关，刚出来" },
  { setup: "为什么拖鞋很佛系？", punchline: "因为它随时可以脱（脱=放下）" },
  { setup: "一个句号走进酒吧，酒保说：你怎么这么矮？", punchline: "句号说：因为我结束了" },
];

let jokeIndex = 0;
let shuffledJokes = [];

function getNextJoke() {
  if (shuffledJokes.length === 0 || jokeIndex >= shuffledJokes.length) {
    shuffledJokes = [...JOKE_POOL];
    for (let i = shuffledJokes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledJokes[i], shuffledJokes[j]] = [shuffledJokes[j], shuffledJokes[i]];
    }
    jokeIndex = 0;
  }
  return shuffledJokes[jokeIndex++];
}

function getTodayString() {
  return new Date().toLocaleDateString("sv-SE");
}

async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return settings || {};
}

// === AI 响应解析 ===

const JOKE_PROMPT = `你是冷笑话生成器。生成一个好笑但冷的笑话。
严格按JSON格式输出：{"setup":"铺垫","punchline":"笑点"}
setup 20-80字，punchline 10-50字`;

function parseAIResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  try { return JSON.parse(cleaned); } catch {}
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (match) { try { return JSON.parse(match[0]); } catch {} }
  return { setup: cleaned, punchline: "" };
}

// === Gemini Nano (Chrome Built-in AI) ===

async function generateNanoStream(port) {
  if (!self.ai || !self.ai.languageModel) {
    throw new Error("NANO_NOT_AVAILABLE");
  }

  const capabilities = await self.ai.languageModel.capabilities();
  if (capabilities.available !== "readily") {
    throw new Error("NANO_NOT_AVAILABLE");
  }

  const session = await self.ai.languageModel.create({ systemPrompt: JOKE_PROMPT });

  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const userPrompt = `今天是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日，星期${weekDays[now.getDay()]}。请生成今天的冷笑话。`;

  const stream = session.promptStreaming(userPrompt);
  let fullText = "";

  for await (const chunk of stream) {
    fullText += chunk;
    port.postMessage({ type: "stream", text: fullText });
  }

  const result = parseAIResponse(fullText.trim());
  port.postMessage({ type: "done", data: result });
  session.destroy();
}

// === 远程 AI 流式生成 ===

async function generateAIStream(port) {
  const settings = await getSettings();
  const apiKey = settings.apiKey;
  const apiUrl = settings.apiUrl;
  const model = settings.model;

  if (!apiKey) throw new Error("NO_API_KEY");
  if (!apiUrl) throw new Error("NO_API_URL");

  const now = new Date();
  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];
  const userPrompt = `今天是${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日，星期${weekDays[now.getDay()]}。请生成今天的冷笑话。`;

  const body = {
    messages: [
      { role: "system", content: JOKE_PROMPT },
      { role: "user", content: userPrompt }
    ],
    temperature: 1.0,
    max_tokens: 400,
    stream: true
  };
  if (model) body.model = model;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    if (response.status === 401) throw new Error("API Key 无效，请在设置中检查你的 Key");
    if (response.status === 429) throw new Error("请求过于频繁，请稍后再试");
    throw new Error(`API 请求失败: ${response.status}`);
  }

  let fullText = "";
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop();
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith("data:")) continue;
      const data = trimmed.slice(5).trim();
      if (data === "[DONE]") break;
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) { fullText += delta; port.postMessage({ type: "stream", text: fullText }); }
      } catch {}
    }
  }

  const result = parseAIResponse(fullText.trim());
  port.postMessage({ type: "done", data: result });
}

// === 消息处理 ===

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "openOptions") {
    chrome.runtime.openOptionsPage();
    return false;
  }
  if (msg.action === "checkNano") {
    (async () => {
      const available = !!(self.ai && self.ai.languageModel);
      if (available) {
        const cap = await self.ai.languageModel.capabilities();
        sendResponse({ available: cap.available === "readily" });
      } else {
        sendResponse({ available: false });
      }
    })();
    return true;
  }
});

// 流式端口
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "jokeStream") {
    (async () => {
      const settings = await getSettings();

      // 1. 用户选了 Gemini Nano
      if (settings.apiUrl === "chrome-built-in-ai") {
        try { await generateNanoStream(port); return; }
        catch (err) { if (err.message !== "NANO_NOT_AVAILABLE") { port.postMessage({ type: "error", error: err.message }); return; } }
      }

      // 2. 用户配了远程 API
      if (settings.apiKey && settings.apiUrl && settings.apiUrl !== "chrome-built-in-ai") {
        try { await generateAIStream(port); return; }
        catch (err) { /* 远程 API 失败，fallback 到内置笑话池 */ }
      }

      // 3. 先试 Nano
      try {
        if (self.ai && self.ai.languageModel) {
          const cap = await self.ai.languageModel.capabilities();
          if (cap.available === "readily") { await generateNanoStream(port); return; }
        }
      } catch {}

      // 4. 内置笑话池
      const joke = getNextJoke();
      try { port.postMessage({ type: "done", data: joke }); } catch {}
    })();
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});