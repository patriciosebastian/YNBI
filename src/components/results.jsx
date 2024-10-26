export default function Results({ bestIdea, nextTopTwoIdeas, onDescriptionChange }) {
  return (
    <>
      {bestIdea && (
        <>
          <div className="best-idea-section mt-8 rounded p-7 bg-[--pico-modal-overlay-background-color]">
            <h2>
              Best Idea to Focus On
            </h2>
            <p className="mt-4 text-lg">
              <strong>{bestIdea.name}</strong> is the best idea to pursue based on your input with a rating of{' '}
              {bestIdea.score} out of 10.
            </p>
          </div>
          <textarea
            value={bestIdea.description || ''}
            onChange={onDescriptionChange}
            className="w-full my-2"
            placeholder="* Describe your top idea for the analysis. Detailed descriptions get better results."
            rows={4}
            required
          />
        </>
      )}

      {nextTopTwoIdeas && nextTopTwoIdeas.length > 0 && (
        <div className="next-top-two-ideas-section mt-8 rounded p-7 bg-[--pico-modal-overlay-background-color]">
          <h2>
            Next Top Two Ideas
          </h2>
          {nextTopTwoIdeas.map((idea, index) => (
            <div key={index} className="mt-4 text-lg">
              <p>
                <strong>#{index + 2}: {idea.name}</strong> with a rating of {idea.score} out of 10.
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}