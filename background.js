import { PRESET_APIS } from "./config.js";

const JOKE_PROMPT = `你是「每日惊喜」的冷笑话生成器。每天生成一个让人哭笑不得的冷笑话。

规则：
1. 笑话要好笑但冷，让人忍不住笑又想打人
2. 不要烂大街的笑话，要有新意
3. 严格按以下 JSON 格式输出，不要输出任何其他内容：
{"setup":"笑话的铺垫/问题","punchline":"笑点/答案"}
4. setup 控制在 20-80 字
5. punchline 控制在 10-50 字
6. 可以是谐音梗、脑筋急转弯、荒诞对话等任何形式`;

function getTodayString() {
  return new Date().toLocaleDateString("sv-SE");
}

async function getSettings() {
  const { settings } = await chrome.storage.local.get("settings");
  return settings || {};
}

function parseJokeResponse(raw) {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try { return JSON.parse(match[0]); } catch {}
    }
    return { setup: cleaned, punchline: "" };
  }
}

async function generateJokeStream(port) {
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
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
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
        if (delta) {
          fullText += delta;
          port.postMessage({ type: "stream", text: fullText });
        }
      } catch {}
    }
  }

  const joke = parseJokeResponse(fullText.trim());
  joke.date = getTodayString();
  port.postMessage({ type: "done", data: joke });
}

// 消息处理
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "openOptions") {
    chrome.runtime.openOptionsPage();
    return false;
  }
});

// 流式端口
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === "jokeStream") {
    generateJokeStream(port).catch((err) => {
      port.postMessage({ type: "error", error: err.message });
    });
  }
});

chrome.action.onClicked.addListener(() => {
  chrome.runtime.openOptionsPage();
});