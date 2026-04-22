import { PRESET_APIS } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
  const savedTheme = localStorage.getItem("theme") || "auto";
  document.documentElement.setAttribute("data-theme", savedTheme);

  const providerSelect = document.getElementById("apiProvider");
  PRESET_APIS.forEach(p => {
    const opt = document.createElement("option");
    opt.value = p.url;
    opt.textContent = p.name;
    providerSelect.appendChild(opt);
  });

  const { settings } = await chrome.storage.local.get("settings");
  const current = settings || {};

  const apiUrl = current.apiUrl || "";
  document.getElementById("apiUrl").value = apiUrl;
  document.getElementById("apiKey").value = current.apiKey || "";
  document.getElementById("model").value = current.model || "";

  if (apiUrl) {
    const matched = PRESET_APIS.find(p => p.url === apiUrl);
    providerSelect.value = matched ? apiUrl : "";
  }

  function toggleFields() {
    const isNano = providerSelect.value === "chrome-built-in-ai";
    const urlInput = document.getElementById("apiUrl");
    const keyInput = document.getElementById("apiKey");
    const modelInput = document.getElementById("model");

    urlInput.value = isNano ? "chrome-built-in-ai" : (providerSelect.value || urlInput.value);
    keyInput.parentElement.style.display = isNano ? "none" : "";
    modelInput.parentElement.style.display = isNano ? "none" : "";
  }

  providerSelect.addEventListener("change", () => {
    const url = providerSelect.value;
    if (url && url !== "chrome-built-in-ai") document.getElementById("apiUrl").value = url;
    toggleFields();
  });

  toggleFields();

  document.getElementById("saveBtn").addEventListener("click", saveSettings);
  document.getElementById("testBtn").addEventListener("click", testConnection);
  document.getElementById("clearCacheBtn").addEventListener("click", clearCache);
});

async function saveSettings() {
  const apiUrl = document.getElementById("apiUrl").value.trim();
  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("model").value.trim();

  await chrome.storage.local.set({ settings: { apiUrl, apiKey, model } });

  const status = document.getElementById("saveStatus");
  status.textContent = "已保存 ✓";
  setTimeout(() => status.textContent = "", 2000);
}

async function testConnection() {
  const resultEl = document.getElementById("testResult");
  resultEl.textContent = "正在测试...";
  resultEl.style.color = "";

  const apiUrl = document.getElementById("apiUrl").value.trim();

  // Gemini Nano 测试
  if (apiUrl === "chrome-built-in-ai") {
    try {
      const resp = await chrome.runtime.sendMessage({ action: "checkNano" });
      if (resp.available) {
        resultEl.textContent = "Gemini Nano 可用！本地 AI 已就绪";
        resultEl.style.color = "#4ade80";
      } else {
        resultEl.textContent = "Gemini Nano 不可用，需要 Chrome 127+ 并在 chrome://flags 启用 Optimization Guide on device model";
        resultEl.style.color = "#f87171";
      }
    } catch {
      resultEl.textContent = "检测失败，请确认 Chrome 版本 >= 127";
      resultEl.style.color = "#f87171";
    }
    return;
  }

  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("model").value.trim();

  if (!apiUrl || !apiKey) {
    resultEl.textContent = "请先填写 API 地址和 Key";
    resultEl.style.color = "#f87171";
    return;
  }

  try {
    const body = { messages: [{ role: "user", content: "你好，请回复'连接成功'" }], max_tokens: 20 };
    if (model) body.model = model;

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify(body)
    });

    if (resp.ok) { resultEl.textContent = "连接成功！"; resultEl.style.color = "#4ade80"; }
    else { resultEl.textContent = `连接失败: HTTP ${resp.status}`; resultEl.style.color = "#f87171"; }
  } catch (err) {
    resultEl.textContent = `连接失败: ${err.message}`;
    resultEl.style.color = "#f87171";
  }
}

async function clearCache() {
  await chrome.storage.local.remove("surprise_cache");
  const resultEl = document.getElementById("testResult");
  resultEl.textContent = "缓存已清除，下次打开新标签将重新生成";
  resultEl.style.color = "";
}