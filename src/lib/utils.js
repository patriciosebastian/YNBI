// Generate a structured analysis based on the provided ideas
export async function getAnalysis({ openai, bestIdea, nextTopTwoIdeas }) {
  const ideas = [bestIdea, ...nextTopTwoIdeas];
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert business analysis assistant that provides structured analysis of business ideas. Do not hesitate to point out if any idea is fundamentally flawed or unrealistic.',
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
          
          Ensure that if any red flags or serious potential flaws are detected, they are clearly highlighted. Make sure the response provides useful, actionable insights. Keep the analysis within 1000 tokens.`,
        },
      ],
      max_tokens: 1000,
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

// Check if sufficient analysis data is provided
export const isSufficientAnalysisData = (ideas) => {
  const isNameFilled = ideas.every((idea) => idea.name.trim() !== '');
  const isDescriptionFilled = ideas.every((idea) => idea.description.trim() !== '');

  return isNameFilled && isDescriptionFilled;
};
