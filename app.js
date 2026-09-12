const data = {
  servers: [
    {name:"F Gaming #1",map:"de_mirage",players:10,max:13,ping:12},
    {name:"F Gaming #2",map:"de_anubis",players:9,max:13,ping:14},
    {name:"F Gaming #3",map:"de_nuke",players:10,max:13,ping:11}
  ],

  skins: [
{weapon:"AK-47",name:"Neon Rider",type:"rifle",rarity:"Covert",icon:"🔫",image:"https://www.csgodatabase.com/wp-content/uploads/2020/03/AK-47-Neon-Rider.png"},
    {weapon:"AWP",name:"Dragon Lore",type:"rifle",rarity:"Covert",icon:"🎯"},
    {weapon:"M4A1-S",name:"Printstream",type:"rifle",rarity:"Covert",icon:"🔫"},
    {weapon:"Glock-18",name:"Fade",type:"pistol",rarity:"Covert",icon:"🔫"},
    {weapon:"USP-S",name:"Kill Confirmed",type:"pistol",rarity:"Covert",icon:"🔫"},
    {weapon:"Desert Eagle",name:"Blaze",type:"pistol",rarity:"Restricted",icon:"🔫"},
    {weapon:"Karambit",name:"Doppler",type:"knife",rarity:"Extraordinary",icon:"🔪"},
    {weapon:"Butterfly Knife",name:"Fade",type:"knife",rarity:"Extraordinary",icon:"🔪"}
  ]
};

const steamId = new URLSearchParams(location.search).get("steamId");

if (steamId) {
  const login = document.querySelector(".login");

  if (login) {
    login.textContent = "Steam ✓";
    login.removeAttribute("href");
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

function renderSkins(filter = "all") {
  const grid = document.querySelector("#skinGrid");
  if (!grid) return;

  const selected = localStorage.getItem("selectedSkin");

  const skins = filter === "all"
    ? data.skins
    : data.skins.filter(s => s.type === filter);

  grid.innerHTML = skins.map(s => {
    const isEquipped = selected === s.name;

    return `
      <div class="skin-card ${isEquipped ? "equipped" : ""}">
        <div class="skin-image">
          <span>${s.icon}</span>
        </div>

        <h3>${s.weapon} | ${s.name}</h3>
        <p>${s.rarity} · CS2</p>

        <button
          class="${isEquipped ? "equipped-btn" : ""}"
          onclick="equip('${s.name}')">
          ${isEquipped ? "✓ EQUIPPED" : "EQUIP"}
        </button>
      </div>
    `;
  }).join("");
}

function connect(addr) {
  alert("CS2 connect: " + addr);
}

function equip(name) {
  localStorage.setItem("selectedSkin", name);
  renderSkins();
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
      if (langData[key]) el.textContent = langData[key];
    });
  };
}

const total = data.servers.reduce((a, s) => a + s.players, 0);

const online = document.querySelector("#online");
if (online) online.textContent = total;

const serverCount = document.querySelector("#serverCount");
if (serverCount) serverCount.textContent = data.servers.length;

renderServers();
renderSkins();
