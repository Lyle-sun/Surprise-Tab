import { PRESET_APIS } from "./config.js";

document.addEventListener("DOMContentLoaded", async () => {
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

  providerSelect.addEventListener("change", () => {
    const url = providerSelect.value;
    if (url) document.getElementById("apiUrl").value = url;
  });

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
  const apiKey = document.getElementById("apiKey").value.trim();
  const model = document.getElementById("model").value.trim();

  if (!apiUrl || !apiKey) {
    resultEl.textContent = "请先填写 API 地址和 Key";
    resultEl.style.color = "#ff6b6b";
    return;
  }

  try {
    const body = {
      messages: [{ role: "user", content: "你好，请回复'连接成功'" }],
      max_tokens: 20
    };
    if (model) body.model = model;

    const resp = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (resp.ok) {
      resultEl.textContent = "连接成功！";
      resultEl.style.color = "#6bcb77";
    } else {
      resultEl.textContent = `连接失败: HTTP ${resp.status}`;
      resultEl.style.color = "#ff6b6b";
    }
  } catch (err) {
    resultEl.textContent = `连接失败: ${err.message}`;
    resultEl.style.color = "#ff6b6b";
  }
}

async function clearCache() {
  await chrome.storage.local.remove("surprise_cache");
  const resultEl = document.getElementById("testResult");
  resultEl.textContent = "缓存已清除，下次打开新标签将重新生成";
  resultEl.style.color = "";
}