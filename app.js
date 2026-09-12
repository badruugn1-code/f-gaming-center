const API = "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en";

const data = {
  servers: [
    {name:"F Gaming #1",map:"de_mirage",players:10,max:13,ping:12},
    {name:"F Gaming #2",map:"de_anubis",players:9,max:13,ping:14},
    {name:"F Gaming #3",map:"de_nuke",players:10,max:13,ping:11}
  ],

  skins: [],
  agents: []
};

const params = new URLSearchParams(location.search);

const steamId = params.get("steamId");
const avatar = params.get("avatar");

if (steamId) {
  const steamAvatar = document.querySelector("#steamAvatar");
  const steamName = document.querySelector("#steamName");

  if (steamAvatar && avatar) {
    steamAvatar.src = avatar;
  }

  if (steamName) {
    steamName.textContent = "Steam ✓";
  }
}

const t = {
  mn: {
    servers:"Servers",
    skins:"Skinchanger",
    players:"Players",
    login:"Login",
    hero:"CS2 GAMING CENTER"
  },
  en: {
    servers:"Servers",
    skins:"Skinchanger",
    players:"Players",
    login:"Login",
    hero:"CS2 GAMING CENTER"
  },
  ru: {
    servers:"Сервера",
    skins:"Скинченджер",
    players:"Игроки",
    login:"Войти",
    hero:"CS2 GAMING CENTER"
  }
};

function renderServers() {
  const el = document.querySelector("#serverGrid");
  if (!el) return;

  el.innerHTML = data.servers.map(s => `
    <div class="server-card">
      <div>
        <h3>${s.name}</h3>
        <p>${s.map} · ${s.players}/${s.max} players · ${s.ping}ms</p>
      </div>
      <button onclick="connect('${s.name}')">CONNECT</button>
    </div>
  `).join("");
}

function getCategory(skin) {
  const category = skin.weapon?.category?.name?.toLowerCase() || "";

  if (category.includes("pistol")) return "pistol";
  if (category.includes("rifle")) return "rifle";
  if (category.includes("smg")) return "smg";
  if (category.includes("shotgun")) return "shotgun";
  if (category.includes("machine")) return "machinegun";
  if (category.includes("sniper")) return "sniper";
  if (category.includes("knife")) return "knife";

  const weaponName = skin.weapon?.name?.toLowerCase() || "";

  if (weaponName.includes("knife")) return "knife";

  return "other";
}

function rarityColor(item) {
  return item.rarity?.color || "#b0c3d9";
}

function safeImage(image) {
  return image || "";
}

function renderSkins(filter = "all") {
  const grid = document.querySelector("#skinGrid");
  if (!grid) return;

  let items = [];

  if (filter === "agents") {
    items = data.agents.map(a => ({
      ...a,
      isAgent: true,
      category: "agents"
    }));
  }

  else if (filter === "terrorist") {
    items = data.agents
      .filter(a =>
        a.team?.id === "terrorists" ||
        a.team?.name?.toLowerCase().includes("terrorist")
      )
      .map(a => ({
        ...a,
        isAgent: true,
        category: "terrorist"
      }));
  }

  else if (filter === "counter") {
    items = data.agents
      .filter(a =>
        a.team?.id === "counter_terrorists" ||
        a.team?.id === "counter-terrorists" ||
        a.team?.name?.toLowerCase().includes("counter")
      )
      .map(a => ({
        ...a,
        isAgent: true,
        category: "counter"
      }));
  }

  else {
    items = filter === "all"
      ? data.skins
      : data.skins.filter(s => getCategory(s) === filter);
  }

  if (!items.length) {
    grid.innerHTML = `
      <div style="padding:30px;text-align:center;">
        Loading...
      </div>
    `;
    return;
  }

  grid.innerHTML = items.map(item => {

    const selected = localStorage.getItem("selectedSkin");
    const isEquipped = selected === item.id;

    const title = item.isAgent
      ? item.name
      : item.name;

    const rarity = item.rarity?.name || "Standard";
    const color = rarityColor(item);
    const image = safeImage(item.image);

    return `
      <div class="skin-card ${isEquipped ? "equipped" : ""}"
           style="border-color:${isEquipped ? color : "rgba(255,255,255,.08)"}">

        <div class="skin-image"
             style="
               background:
                 radial-gradient(circle at center,
                 ${color}22,
                 transparent 65%);
             ">

          ${
            image
              ? `<img
                   src="${image}"
                   alt="${title}"
                   loading="lazy"
                   style="width:100%;height:100%;object-fit:contain;"
                 >`
              : `<span>🔫</span>`
          }

        </div>

        <h3>${title}</h3>

        <p style="color:${color};font-weight:600;">
          ${rarity}
        </p>

        ${
          item.isAgent
            ? `<small>${item.team?.name || "Agent"}</small>`
            : `<small>${item.weapon?.name || "CS2 Weapon"}</small>`
        }

        <button
          class="${isEquipped ? "equipped-btn" : ""}"
          onclick="equip('${item.id}')">

          ${isEquipped ? "✓ EQUIPPED" : "EQUIP"}

        </button>

      </div>
    `;
  }).join("");
}

function connect(addr) {
  alert("CS2 connect: " + addr);
}

function equip(id) {
  localStorage.setItem("selectedSkin", id);

  const active =
    document.querySelector(".filter.active")?.dataset.filter || "all";

  renderSkins(active);
}

function createExtraFilters() {
  const firstFilter = document.querySelector(".filter");

  if (!firstFilter) return;

  const container = firstFilter.parentElement;

  if (!container) return;

  const filters = [
    ["smg", "SMG"],
    ["shotgun", "Shotgun"],
    ["machinegun", "Machine Gun"],
    ["sniper", "Sniper"],
    ["agents", "Agents"],
    ["terrorist", "Terrorist"],
    ["counter", "Counter-Terrorist"]
  ];

  filters.forEach(([value, text]) => {

    if (container.querySelector(`[data-filter="${value}"]`)) {
      return;
    }

    const btn = document.createElement("button");

    btn.className = "filter";
    btn.dataset.filter = value;
    btn.textContent = text;

    container.appendChild(btn);
  });

  container.querySelectorAll(".filter").forEach(btn => {

    btn.onclick = () => {

      container.querySelectorAll(".filter").forEach(b => {
        b.classList.remove("active");
      });

      btn.classList.add("active");

      renderSkins(btn.dataset.filter || "all");
    };

  });
}

async function loadCS2Data() {

  const grid = document.querySelector("#skinGrid");

  if (grid) {
    grid.innerHTML = `
      <div style="padding:40px;text-align:center;">
        🔄 Loading CS2 skins...
      </div>
    `;
  }

  try {

    const [skinsResponse, agentsResponse] = await Promise.all([
      fetch(`${API}/skins.json`),
      fetch(`${API}/agents.json`)
    ]);

    if (!skinsResponse.ok) {
      throw new Error("Skins API failed");
    }

    if (!agentsResponse.ok) {
      throw new Error("Agents API failed");
    }

    data.skins = await skinsResponse.json();
    data.agents = await agentsResponse.json();

    console.log("CS2 skins:", data.skins.length);
    console.log("CS2 agents:", data.agents.length);

    createExtraFilters();
    renderSkins("all");

  } catch (error) {

    console.error(error);

    if (grid) {
      grid.innerHTML = `
        <div style="padding:30px;text-align:center;">
          ❌ CS2 data loading failed
          <br><br>
          Please refresh the page.
        </div>
      `;
    }

  }
}

document.querySelectorAll(".filter").forEach(btn => {

  btn.onclick = () => {

    document.querySelectorAll(".filter").forEach(b => {
      b.classList.remove("active");
    });

    btn.classList.add("active");

    renderSkins(btn.dataset.filter || "all");
  };

});

const lang = document.querySelector("#lang");

if (lang) {

  lang.onchange = e => {

    const langData = t[e.target.value];

    if (!langData) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {

      const key = el.dataset.i18n;

      if (langData[key]) {
        el.textContent = langData[key];
      }

    });

  };

}

const total = data.servers.reduce(
  (a, s) => a + s.players,
  0
);

const online = document.querySelector("#online");

if (online) {
  online.textContent = total;
}

const serverCount = document.querySelector("#serverCount");

if (serverCount) {
  serverCount.textContent = data.servers.length;
}

renderServers();
loadCS2Data();
