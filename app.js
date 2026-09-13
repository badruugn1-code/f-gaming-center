const API =
  "https://raw.githubusercontent.com/ByMykel/CSGO-API/main/public/api/en";

const data = {
  skins: [],
  agents: []
};


/* =========================
   STEAM LOGIN
========================= */

function loadSteamProfile() {

  const params = new URLSearchParams(location.search);

  const steamId = params.get("steamId");
  const avatar = params.get("avatar");
  const steamName = params.get("steamName");

  if (steamId) {
    localStorage.setItem("steamId", steamId);
  }

  if (avatar) {
    localStorage.setItem("steamAvatar", avatar);
  }

  if (steamName) {
    localStorage.setItem("steamName", steamName);
  }

  const savedId = localStorage.getItem("steamId");
  const savedAvatar = localStorage.getItem("steamAvatar");
  const savedName = localStorage.getItem("steamName");

  if (!savedId) return;

  const loginText =
    document.querySelector("#steamLoginText");

  if (loginText) {
    loginText.textContent = "STEAM CONNECTED";
  }

  const steamMenu =
    document.querySelector(
      'a[href*="/auth/steam"]'
    );

  if (!steamMenu) return;


  /* Steam avatar */

  let avatarImg =
    steamMenu.querySelector(".steam-avatar");

  if (!avatarImg) {

    avatarImg =
      document.createElement("img");

    avatarImg.className =
      "steam-avatar";

    avatarImg.style.width = "32px";
    avatarImg.style.height = "32px";
    avatarImg.style.borderRadius = "50%";
    avatarImg.style.objectFit = "cover";
    avatarImg.style.marginRight = "10px";

    steamMenu.prepend(avatarImg);
  }

  if (savedAvatar) {
    avatarImg.src = savedAvatar;
  }


  /* Steam name */

  let nameElement =
    steamMenu.querySelector(".steam-name");

  if (!nameElement) {

    nameElement =
      document.createElement("span");

    nameElement.className =
      "steam-name";

    nameElement.style.marginLeft =
      "8px";

    nameElement.style.fontWeight =
      "700";

    steamMenu.appendChild(nameElement);
  }

  nameElement.textContent =
    savedName || "STEAM CONNECTED";


  /* remove old login icon */

  const oldIcon =
    steamMenu.querySelector("span:first-child");

  if (
    oldIcon &&
    !oldIcon.classList.contains("steam-avatar")
  ) {
    oldIcon.style.display = "none";
  }


  /* remove ?steamId... from URL */

  if (
    params.has("steamId") ||
    params.has("avatar") ||
    params.has("steamName")
  ) {

    history.replaceState(
      {},
      document.title,
      location.pathname
    );
  }
}


/* =========================
   SKIN CATEGORY
========================= */

function getCategory(skin) {

  const category =
    skin.weapon?.category
      ?.name
      ?.toLowerCase() || "";

  if (category.includes("pistol"))
    return "pistol";

  if (category.includes("rifle"))
    return "rifle";

  if (category.includes("smg"))
    return "smg";

  if (category.includes("shotgun"))
    return "shotgun";

  if (category.includes("machine"))
    return "machinegun";

  if (category.includes("sniper"))
    return "sniper";

  if (category.includes("knife"))
    return "knife";


  const weaponName =
    skin.weapon?.name
      ?.toLowerCase() || "";

  if (weaponName.includes("knife"))
    return "knife";

  return "other";
}


/* =========================
   RARITY
========================= */

function rarityColor(item) {

  return (
    item.rarity?.color ||
    "#b0c3d9"
  );
}


/* =========================
   IMAGE
========================= */

function safeImage(image) {

  return image || "";
}


/* =========================
   RENDER SKINS
========================= */

function renderSkins(filter = "all") {

  const grid =
    document.querySelector("#skinGrid");

  if (!grid) return;


  let items = [];


  /* Agents */

  if (filter === "agents") {

    items =
      data.agents.map(a => ({
        ...a,
        isAgent: true,
        category: "agents"
      }));

  }


  /* Terrorist */

  else if (filter === "terrorist") {

    items =
      data.agents
        .filter(a =>
          a.team?.id === "terrorists" ||
          a.team?.name
            ?.toLowerCase()
            .includes("terrorist")
        )
        .map(a => ({
          ...a,
          isAgent: true,
          category: "terrorist"
        }));

  }


  /* Counter Terrorist */

  else if (filter === "counter") {

    items =
      data.agents
        .filter(a =>
          a.team?.id === "counter_terrorists" ||
          a.team?.id === "counter-terrorists" ||
          a.team?.name
            ?.toLowerCase()
            .includes("counter")
        )
        .map(a => ({
          ...a,
          isAgent: true,
          category: "counter"
        }));

  }


  /* Normal skins */

  else {

    items =
      filter === "all"
        ? data.skins
        : data.skins.filter(
            s => getCategory(s) === filter
          );

  }


  if (!items.length) {

    grid.innerHTML = `
      <div style="
        padding:40px;
        text-align:center;
        color:#777;
      ">
        Loading...
      </div>
    `;

    return;
  }


  grid.innerHTML =
    items.map(item => {

      const selected =
        localStorage.getItem(
          "selectedSkin"
        );

      const isEquipped =
        selected === item.id;


      const title =
        item.isAgent
          ? item.name
          : item.name;


      const rarity =
        item.rarity?.name ||
        "Standard";


      const color =
        rarityColor(item);


      const image =
        safeImage(item.image);


      return `

        <div
          class="skin-card ${
            isEquipped
              ? "equipped"
              : ""
          }"
          style="
            border-color:
              ${color};
            ${
              isEquipped
                ? "box-shadow:0 0 20px rgba(255,255,255,.08);"
                : ""
            }
          "
        >

          <div
            class="skin-image"
            style="
              background:
              radial-gradient(
                circle at center,
                ${color}22,
                transparent 65%
              );
            "
          >

            ${
              image
                ? `
                  <img
                    src="${image}"
                    alt="${title}"
                    loading="lazy"
                    style="
                      width:100%;
                      height:100%;
                      object-fit:contain;
                    "
                  >
                `
                : `
                  <span>🔫</span>
                `
            }

          </div>


          <h3>
            ${title}
          </h3>


          <p
            style="
              color:${color};
              font-weight:600;
            "
          >
            ${rarity}
          </p>


          ${
            item.isAgent
              ? `
                <small>
                  ${item.team?.name || "Agent"}
                </small>
              `
              : `
                <small>
                  ${
                    item.weapon?.name ||
                    "CS2 Weapon"
                  }
                </small>
              `
          }


          <button
            class="${
              isEquipped
                ? "equipped-btn"
                : ""
            }"
            onclick="equip('${item.id}')"
          >
            ${
              isEquipped
                ? "✓ EQUIPPED"
                : "EQUIP"
            }
          </button>

        </div>

      `;

    }).join("");
}


/* =========================
   EQUIP
========================= */

function equip(id) {

  localStorage.setItem(
    "selectedSkin",
    id
  );

  const active =
    document.querySelector(
      ".filter.active"
    )?.dataset.filter ||
    "all";

  renderSkins(active);
}


/* =========================
   EXTRA FILTERS
========================= */

function createExtraFilters() {

  const firstFilter =
    document.querySelector(
      ".filter"
    );

  if (!firstFilter) return;


  const container =
    firstFilter.parentElement;

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


  filters.forEach(
    ([value, text]) => {

      if (
        container.querySelector(
          `[data-filter="${value}"]`
        )
      ) {
        return;
      }


      const btn =
        document.createElement(
          "button"
        );

      btn.className =
        "filter";

      btn.dataset.filter =
        value;

      btn.textContent =
        text;


      container.appendChild(
        btn
      );

    }
  );


  container
    .querySelectorAll(".filter")
    .forEach(btn => {

      btn.onclick = () => {

        container
          .querySelectorAll(
            ".filter"
          )
          .forEach(b =>
            b.classList.remove(
              "active"
            )
          );


        btn.classList.add(
          "active"
        );


        renderSkins(
          btn.dataset.filter ||
          "all"
        );

      };

    });
}


/* =========================
   LOAD CS2 DATA
========================= */

async function loadCS2Data() {

  const grid =
    document.querySelector(
      "#skinGrid"
    );

  if (grid) {

    grid.innerHTML = `
      <div
        style="
          padding:40px;
          text-align:center;
        "
      >
        🔄 Loading CS2 skins...
      </div>
    `;

  }


  try {

    const [
      skinsResponse,
      agentsResponse
    ] = await Promise.all([

      fetch(
        `${API}/skins.json`
      ),

      fetch(
        `${API}/agents.json`
      )

    ]);


    if (!skinsResponse.ok) {

      throw new Error(
        "Skins API failed"
      );

    }


    if (!agentsResponse.ok) {

      throw new Error(
        "Agents API failed"
      );

    }


    data.skins =
      await skinsResponse.json();


    data.agents =
      await agentsResponse.json();


    console.log(
      "CS2 skins:",
      data.skins.length
    );


    console.log(
      "CS2 agents:",
      data.agents.length
    );


    createExtraFilters();

    renderSkins("all");

  }


  catch (error) {

    console.error(error);


    if (grid) {

      grid.innerHTML = `
        <div
          style="
            padding:30px;
            text-align:center;
          "
        >

          ❌ CS2 data loading failed.

          <br><br>

          Please refresh the page.

        </div>
      `;

    }

  }

}


/* =========================
   MENU
========================= */

function setupMenu() {

  const menuBtn =
    document.querySelector(
      "#menuBtn"
    );

  const menu =
    document.querySelector(
      "#menu"
    );

  const closeMenu =
    document.querySelector(
      "#closeMenu"
    );


  if (menuBtn && menu) {

    menuBtn.onclick = () => {

      menu.classList.add(
        "open"
      );

    };

  }


  if (closeMenu && menu) {

    closeMenu.onclick = () => {

      menu.classList.remove(
        "open"
      );

    };

  }


  document
    .querySelectorAll(
      ".menu-item"
    )
    .forEach(item => {

      item.onclick = () => {

        if (menu) {

          menu.classList.remove(
            "open"
          );

        }

      };

    });

}


/* =========================
   START
========================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    loadSteamProfile();

    setupMenu();

    loadCS2Data();

  }
);
