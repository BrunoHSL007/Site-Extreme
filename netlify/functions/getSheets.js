const { google } = require("googleapis");

exports.handler = async () => {
  try {
    const auth = new google.auth.JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

    const sheets = google.sheets({ version: "v4", auth });

    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: "Eventos!A2:Z",
    });

    return {
      statusCode: 200,
      body: JSON.stringify(res.data.values || []),
    };
  } catch (err) {
    console.error("ERRO COMPLETO:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message || err }),
    };
  }
};