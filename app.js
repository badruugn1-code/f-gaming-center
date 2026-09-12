const data={
servers:[
 {name:"F Gaming #1",map:"de_mirage",players:10,max:13,ping:12},
 {name:"F Gaming #2",map:"de_anubis",players:9,max:13,ping:14},
 {name:"F Gaming #3",map:"de_nuke",players:10,max:13,ping:11}
],
skins:[
 {weapon:"AK-47",name:"Neon Rider",type:"rifle",rarity:"Covert",icon:"🔫"},
 {weapon:"AWP",name:"Dragon Lore",type:"rifle",rarity:"Covert",icon:"🎯"},
 {weapon:"M4A1-S",name:"Printstream",type:"rifle",rarity:"Covert",icon:"🔫"},
 {weapon:"Glock-18",name:"Fade",type:"pistol",rarity:"Covert",icon:"🔫"},
 {weapon:"USP-S",name:"Kill Confirmed",type:"pistol",rarity:"Covert",icon:"🔫"},
 {weapon:"Desert Eagle",name:"Blaze",type:"pistol",rarity:"Restricted",icon:"🔫"},
 {weapon:"Karambit",name:"Doppler",type:"knife",rarity:"Extraordinary",icon:"🔪"},
 {weapon:"Butterfly Knife",name:"Fade",type:"knife",rarity:"Extraordinary",icon:"🔪"}
]};
const t={mn:{servers:"Servers",skins:"Skinchanger",players:"Players",login:"Login",hero:"CS2 community servers, live players болон cosmetic loadout.",play:"ТОГЛОХ",ourServers:"Манай серверүүд",choose:"Map сонгоод серверт орно уу.",skinTitle:"Skinchanger",skinSub:"Өөрийн skin-ээ сонгоно уу.",topPlayers:"Шилдэг тоглогчид"},en:{servers:"Servers",skins:"Skinchanger",players:"Players",login:"Login",hero:"CS2 community servers, live players and your cosmetic loadout.",play:"PLAY NOW",ourServers:"Our Servers",choose:"Choose a map and connect.",skinTitle:"Skinchanger",skinSub:"Select your cosmetic loadout.",topPlayers:"Top Players"},ru:{servers:"Серверы",skins:"Skinchanger",players:"Игроки",login:"Войти",hero:"CS2 community servers, live players and cosmetic loadout.",play:"ИГРАТЬ",ourServers:"Наши серверы",choose:"Выберите карту и подключитесь.",skinTitle:"Skinchanger",skinSub:"Выберите свой скин.",topPlayers:"Лучшие игроки"}};
function renderServers(){const g=document.querySelector("#serverGrid");g.innerHTML=data.servers.map(s=>`<article class="server"><div class="map ${s.map.slice(3)}">${s.map.replace("de_","").toUpperCase()}</div><div class="server-body"><strong>${s.name}</strong><br><small>● LIVE · ${s.map}</small><div class="server-row"><span>👥 ${s.players}/${s.max}</span><span>⚡ ${s.ping} ms</span></div><button class="join" onclick="connect('${s.address||"127.0.0.1:27015"}')">CONNECT</button></div></article>`).join("");}
function renderSkins(filter="all"){document.querySelector("#skinGrid").innerHTML=data.skins.filter(x=>filter==="all"||x.type===filter).map((s,i)=>`<article class="skin"><div class="skin-img">${s.icon}</div><h3>${s.weapon} | ${s.name}</h3><p>${s.rarity} · CS2</p><button class="equip" onclick="equip('${s.weapon} | ${s.name}')">EQUIP</button></article>`).join("");}
function connect(addr){alert("CS2 connect: "+addr+"\\nProduction server дээр Steam connect URL/launcher холбоно.");}
function equip(name){
  localStorage.setItem("selectedSkin", name);
  alert("✅ Equipped: " + name);
}
document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");renderSkins(b.dataset.filter)});
document.querySelector("#lang").onchange=e=>{const x=t[e.target.value];document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(x[k])el.textContent=x[k]})};
const total=data.servers.reduce((a,s)=>a+s.players,0), slots=data.servers.reduce((a,s)=>a+s.max,0);
document.querySelector("#online").textContent=total;document.querySelector("#serverCount").textContent=data.servers.length;document.querySelector("#totalPlayers").textContent=total;document.querySelector("#totalSlots").textContent=slots;
renderServers();renderSkins();
