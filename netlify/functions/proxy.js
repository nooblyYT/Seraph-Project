const frame = document.getElementById("browser-frame");
const addressBar = document.getElementById("address");
const tabsContainer = document.getElementById("tabs");

let tabs = [];
let currentTab = null;

function createHomePage() {
  return `
    <html>
    <body style="background:#0f0f14;color:white;font-family:sans-serif;text-align:center;padding-top:100px;">
      <h1>Seraph Browser</h1>
      <form onsubmit="parent.searchDuckDuckGo(event)">
        <input style="padding:10px;width:300px;border-radius:8px;border:none;" 
               placeholder="Search DuckDuckGo">
      </form>
    </body>
    </html>
  `;
}

function searchDuckDuckGo(e) {
  e.preventDefault();
  const input = e.target.querySelector("input").value;
  loadURL("https://duckduckgo.com/?q=" + encodeURIComponent(input));
}
window.searchDuckDuckGo = searchDuckDuckGo;

function addTab(url = null) {
  const id = Date.now();
  const tab = { id, history: [], index: -1 };
  tabs.push(tab);
  switchTab(id);
  renderTabs();

  if (url) {
    loadURL(url);
  } else {
    frame.srcdoc = createHomePage();
  }
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
    div.innerHTML = `
      Tab
      <span class="close-tab" onclick="event.stopPropagation();closeTab(${tab.id})">✕</span>
    `;
    div.onclick = () => switchTab(tab.id);
    tabsContainer.appendChild(div);
  });
}

function navigate() {
  let input = addressBar.value.trim();

  if (!input.startsWith("http")) {
    if (input.includes(".")) {
      input = "https://" + input;
    } else {
      input = "https://duckduckgo.com/?q=" + encodeURIComponent(input);
    }
  }

  loadURL(input);
}

function loadURL(url) {
  if (!currentTab) return;

  currentTab.history = currentTab.history.slice(0, currentTab.index + 1);
  currentTab.history.push(url);
  currentTab.index++;

  frame.src = "/.netlify/functions/proxy?url=" + encodeURIComponent(url);
  addressBar.value = url;

  saveHistory(url);
}

function goBack() {
  if (currentTab.index > 0) {
    currentTab.index--;
    frame.src = "/.netlify/functions/proxy?url=" +
      encodeURIComponent(currentTab.history[currentTab.index]);
  }
}

function goForward() {
  if (currentTab.index < currentTab.history.length - 1) {
    currentTab.index++;
    frame.src = "/.netlify/functions/proxy?url=" +
      encodeURIComponent(currentTab.history[currentTab.index]);
  }
}

function refresh() {
  frame.src = frame.src;
}

function bookmark() {
  const bookmarks = JSON.parse(localStorage.getItem("bookmarks") || "[]");
  bookmarks.push(addressBar.value);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  alert("Bookmarked!");
}

function saveHistory(url) {
  const history = JSON.parse(localStorage.getItem("history") || "[]");
  history.push(url);
  localStorage.setItem("history", JSON.stringify(history));
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function panic() {
  window.location.href = "https://classroom.google.com";
}

addTab();
