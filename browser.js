const frame = document.getElementById("browser-frame");
const addressBar = document.getElementById("address");
const tabsContainer = document.getElementById("tabs");

let tabs = [];
let currentTab = null;

// Tabs
function addTab(url = null) {
  const id = Date.now();
  const tab = { id, history: [], index: -1 };
  tabs.push(tab);
  switchTab(id);
  renderTabs();
  if (url) loadURL(url);
}

function switchTab(id) {
  currentTab = tabs.find(t => t.id === id);
  renderTabs();
}

function closeTab(id) {
  tabs = tabs.filter(t => t.id !== id);
  if (tabs.length === 0) addTab();
  else switchTab(tabs[0].id);
  renderTabs();
}

function renderTabs() {
  tabsContainer.innerHTML = "";
  tabs.forEach(tab => {
    const div = document.createElement("div");
    div.className = "tab" + (tab === currentTab ? " active" : "");
    div.innerHTML = `Tab <span class="close-tab" onclick="event.stopPropagation();closeTab(${tab.id})">✕</span>`;
    div.onclick = () => switchTab(tab.id);
    tabsContainer.appendChild(div);
  });
}

// Navigation
function navigate() {
  let url = addressBar.value.trim();
  if (!url) return;

  // YouTube embeds
  if (url.includes("youtube.com/watch")) {
    const id = new URL(url).searchParams.get("v");
    if (id) {
      frame.srcdoc = `<html style="margin:0;background:black">
        <iframe src="https://www.youtube.com/embed/${id}" style="width:100vw;height:100vh;border:none" allowfullscreen></iframe>
      </html>`;
      return;
    }
  }

  // TikTok embeds
  if (url.includes("tiktok.com")) {
    frame.srcdoc = `<html style="margin:0;background:black">
      <iframe src="${url}" style="width:100vw;height:100vh;border:none" allowfullscreen></iframe>
    </html>`;
    return;
  }

  // Normal URLs
  if (!url.startsWith("http")) {
    if (url.includes(".")) url = "https://" + url;
  }

  loadURL(url);
}

function loadURL(url) {
  if (!currentTab) return;
  currentTab.history = currentTab.history.slice(0, currentTab.index + 1);
  currentTab.history.push(url);
  currentTab.index++;
  frame.src = "/.netlify/functions/proxy?url=" + encodeURIComponent(url);
  addressBar.value = url;
}

function goBack() {
  if (currentTab.index > 0) {
    currentTab.index--;
    frame.src = "/.netlify/functions/proxy?url=" + encodeURIComponent(currentTab.history[currentTab.index]);
  }
}

function goForward() {
  if (currentTab.index < currentTab.history.length - 1) {
    currentTab.index++;
    frame.src = "/.netlify/functions/proxy?url=" + encodeURIComponent(currentTab.history[currentTab.index]);
  }
}

function refresh() { frame.src = frame.src; }

function bookmark() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks.push(addressBar.value);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  alert("Bookmarked!");
}

function toggleFullscreen() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
}

function panic() { window.location.href = "https://classroom.google.com"; }

// Force new tabs to open inside the proxy iframe
window.open = function(url) {
  addTab(url);
  return null;
};

// Initialize
addTab();
