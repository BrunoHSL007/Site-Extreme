const { google } = require("googleapis");

let cache = [];
let lastFetch = [];

exports.handler = async (event) => {
  try {
    const tab = event.queryStringParameters?.tab || "Eventos";
    const now = Date.now();    

    if (cache[tab] && now - lastFetch[tab] < 60_000) {
      return {
        statusCode: 200,
        headers: {
          "Cache-Control": "public, max-age=300"
        },
        body: JSON.stringify(cache[tab])
      };
    }

    const auth = new google.auth.JWT({
        email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${tab}!A2:Z`,
    });

    cache[tab] = res.data.values || [];
    lastFetch[tab] = now;

    return {
      statusCode: 200,
      headers: {
        "Cache-Control": "public, max-age=300"
      },
      body: JSON.stringify(res.data.values || [])
    };

  } catch (err) {
    console.error("ERRO COMPLETO:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || err }),
    };
  }
};