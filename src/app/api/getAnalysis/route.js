import { NextResponse } from 'next/server'
import { getAnalysis } from '@/lib/utils'
import OpenAI from 'openai'

export async function POST(request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    const { bestIdea, nextTopTwoIdeas } = await request.json();
    const analysis = await getAnalysis({ openai, bestIdea, nextTopTwoIdeas });
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Error generating analysis' },
      { status: 500 }
    );
  }
}
