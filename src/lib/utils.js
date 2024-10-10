// Generate a structured analysis based on the provided ideas
export async function getAnalysis({ openai, bestIdea, nextTopTwoIdeas }) {
  const ideas = [bestIdea, ...nextTopTwoIdeas];
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analysis assistant that provides structured analysis of business ideas.',
        },
        {
          role: 'user',
          content: `Please analyze the following business ideas:
          ${ideas.map((idea, index) => `Idea ${index + 1}: Name - ${idea.name}, Score - ${idea.score}, Description - ${idea.description}`).join('\n')}

          The analysis should follow this exact structure:
          1. **Overview & Rankings**:
             - Idea 1: ${ideas[0].name} - Score: ${ideas[0].score}
             - Idea 2: ${ideas[1] ? ideas[1].name : 'N/A'} - Score: ${ideas[1] ? ideas[1].score : 'N/A'}
             - Idea 3: ${ideas[2] ? ideas[2].name : 'N/A'} - Score: ${ideas[2] ? ideas[2].score : 'N/A'}
          
          2. **Why ${bestIdea.name} Wins**:
             - Explain in a few points why the top idea (${bestIdea.name}) scored higher than the others.
          
          3. **Detailed Analysis of ${bestIdea.name}**:
             - **Market Need**: Discuss the market need for this idea.
             - **Strengths**: Highlight the strengths of this idea.
             - **Challenges**: Mention any challenges or potential pitfalls.
          
          4. **Suggestions for Improvement**:
             - **Feature Addition**: Suggest any feature or improvement that could make this idea more appealing.
             - **Marketing Strategy**: Recommend potential marketing strategies.
          
          5. **Conclusion & Next Steps**:
             - Summarize the analysis with actionable next steps, like building a prototype or exploring a specific market.
          
          Make sure the response provides useful, actionable insights. Keep the analysis within 850 tokens.`,
        },
      ],
      max_tokens: 850,
    });

    const analysis = response.choices[0].message.content;
    return analysis;
  } catch (error) {
    if (error instanceof openai.APIError) {
      console.error('Error generating analysis:', error.status, error.message, error.code, error.type);
      return 'There was an error generating the analysis. Please try again later.';
    } else {
      console.error('Unexpected error fetching analysis:', error);
      return 'Unexpected error occurred. Please try again later.';
    }
  }
};

// Format the analysis response for better readability
export const formatAnalysis = (analysis) => {
  if (!analysis || typeof analysis !== 'string') {
    console.error('Invalid analysis input for formatting:', analysis);
    return 'Error: Analysis data is invalid.';
  }

  return analysis
    .replace(/(\*\*Overview & Rankings\*\*)/g, '<h2>$1</h2>')
    .replace(/(\*\*Why [^\*]* Wins\*\*)/g, '<h2>$1</h2>')
    .replace(/(\*\*Detailed Analysis of [^\*]*\*\*)/g, '<h2>$1</h2>')
    .replace(/(\*\*Suggestions for Improvement\*\*)/g, '<h2>$1</h2>')
    .replace(/(\*\*Conclusion & Next Steps\*\*)/g, '<h2>$1</h2>')

    .replace(/(\*\*Market Need\*\*)/g, '<h3>$1</h3>')
    .replace(/(\*\*Strengths\*\*)/g, '<h3>$1</h3>')
    .replace(/(\*\*Challenges\*\*)/g, '<h3>$1</h3>')

    .replace(/- (.+)/g, '<li>$1</li>')
    .replace(/<\/h2>\s*<li>/g, '</h2><ul><li>')
    .replace(/<\/li>(?!<li>)/g, '</li></ul>')

    .replace(/\n/g, '<br/>');
};
