const http = require("http");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;

function steamLoginUrl(baseUrl) {
  const url = new URL("https://steamcommunity.com/openid/login");

  url.searchParams.set("openid.ns", "http://specs.openid.net/auth/2.0");
  url.searchParams.set("openid.mode", "checkid_setup");
  url.searchParams.set("openid.return_to", `${baseUrl}/auth/steam/callback`);
  url.searchParams.set("openid.realm", baseUrl);
  url.searchParams.set(
    "openid.identity",
"http://specs.openid.net/auth/2.0/identifier_select"
  );
  url.searchParams.set(
    "openid.claimed_id",
    "http://specs.openid.net/auth/2.0/identifier_select"
  );

  return url.toString();
}

async function verifySteam(params) {
  const verifyData = new URLSearchParams(params);
  verifyData.set("openid.mode", "check_authentication");

  const response = await fetch("https://steamcommunity.com/openid/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: verifyData.toString()
  });

  const text = await response.text();

if (!/is_valid\s*:\s*true/i.test(text)) {
    throw new Error("Steam authentication failed");
  }

  const claimedId = params["openid.claimed_id"];

  const match = claimedId.match(
    /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d+)$/
  );

  if (!match) {
    throw new Error("SteamID not found");
  }

  return match[1];
}

const server = http.createServer(async (req, res) => {
  try {
    const host = req.headers.host;
    const baseUrl = `https://${host}`;
    const url = new URL(req.url, baseUrl);

    if (url.pathname === "/") {
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });

      res.end(`
        <h1>🔥 F Gaming Center Backend</h1>
        <p>Steam Login Backend ажиллаж байна.</p>
        <a href="/auth/steam">Login with Steam</a>
      `);

      return;
    }

    if (url.pathname === "/auth/steam") {
      res.writeHead(302, {
        Location: steamLoginUrl(baseUrl)
      });

      res.end();
      return;
    }

    if (url.pathname === "/auth/steam/callback") {
      const params = Object.fromEntries(url.searchParams.entries());

      const steamId = await verifySteam(params);



res.writeHead(302, {
  Location: "https://badruugn1-code.github.io/f-gaming-center/"
});
res.end();

      return;
    }

    res.writeHead(404);
    res.end("Not Found");

  } catch (error) {
    console.error(error);

    res.writeHead(500, {
      "Content-Type": "text/html; charset=utf-8"
    });

    res.end(`
      <h1>❌ Steam Login Error</h1>
      <p>${error.message}</p>
    `);
  }
});

server.listen(PORT, "0.0.0.0", () => {
  console.log(`F Gaming Center backend running on port ${PORT}`);
});
