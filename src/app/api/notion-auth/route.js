import { NextResponse } from "next/server"

export async function GET(req) {
  console.log('Hit the Notion Auth GET route'); // remove this line

  const notionAuthURL = process.env.NOTION_AUTH_URL;

  return NextResponse.redirect(notionAuthURL);
}