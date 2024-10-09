import { NextResponse } from 'next/server'
import { getAnalysis } from '@/lib/utils'

export async function POST(request) {
  try {
    const { bestIdea, nextTopTwoIdeas } = await request.json();
    const analysis = await getAnalysis({ bestIdea, nextTopTwoIdeas });
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error generating analysis:', error);
    return NextResponse.json(
      { error: 'Error generating analysis' },
      { status: 500 }
    );
  }
}
