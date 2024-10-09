import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function getAnalysis({ bestIdea, nextTopTwoIdeas }) {
  const ideas = [bestIdea, ...nextTopTwoIdeas];
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a business expert assistant that provides analysis of business ideas.',
        },
        {
          role: 'user',
          content: `Please analyze the following business ideas:
          ${ideas.map((idea, index) => `Idea ${index + 1}: Name - ${idea.name}, Score - ${idea.score}, Description - ${idea.description}`).join('\n')}
          The analysis should include a short explanation of why the top idea (${bestIdea.name}) won over the others (${nextTopTwoIdeas.map(idea => idea.name).join(', ')}). Then provide a second, more full and detailed analysis of the best idea itself.`,
        },
      ],
      max_tokens: 750,
    });

    return response.choices[0].message.content;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      console.error('Error generating analysis:', error.status, error.message, error.code, error.type);
      return 'There was an error generating the analysis. Please try again later.';
    } else {
      console.error('Unexpected error fetching analysis:', error);
      return 'Unexpected error occurred. Please try again later.';
    }
  }
}
