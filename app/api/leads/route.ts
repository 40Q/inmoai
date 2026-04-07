import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { name, surname, phone } = await req.json();

  if (!name || !surname || !phone) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const credentials = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY!);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.GOOGLE_SHEET_ID!,
    range: "Sheet1!A:D",
    valueInputOption: "RAW",
    requestBody: {
      values: [[name, surname, phone, new Date().toISOString()]],
    },
  });

  return NextResponse.json({ ok: true });
}
