import { NextResponse } from 'next/server'
import { getAnalysis } from '@/lib/utils'
import { marked } from 'marked'
import OpenAI from 'openai'

export async function POST(request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { bestIdea, nextTopTwoIdeas } = await request.json();
    const analysis = await getAnalysis({ openai, bestIdea, nextTopTwoIdeas });
    const formattedContent = marked(analysis, {
      breaks: true,
      gfm: true,
    });
    return NextResponse.json({ formattedContent });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Error generating analysis' },
      { status: 500 }
    );
  }
}