import { NextResponse } from "next/server"

export async function GET(req) {
  console.log('Hit the Notion callback route'); // remove this line

  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Authorization code not provided' }, { status: 400 });
  }

  const response = await fetch('https://api.notion.com/v1/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${Buffer.from(`${process.env.NOTION_CLIENT_ID}:${process.env.NOTION_CLIENT_SECRET}`).toString('base64')}`,
    },
    body: JSON.stringify({
      grant_type: 'authorization_code',
      code,
      redirect_uri: 'https://yournewbusinessidea.com/oauth/callback',
    }),
  });

  const data = await response.json();

  if (data.access_token) {
    // const res = NextResponse.redirect(`/analysis?access_token=${data.access_token}`);
    const res = NextResponse.redirect('/analysis');
    res.cookies.set('notion_access_token', data.access_token, { httpOnly: true, secure: true });
    res.cookies.set('client_acess_token', data.access_token, { secure: true });
    return res;
  } else {
    return NextResponse.json({ error: 'Failed to fetch access token' }, { status: 500 });
  }
}