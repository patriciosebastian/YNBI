export default function Results({ bestIdea, nextTopTwoIdeas,}) {
  return (
    <>
      {bestIdea && (
        // Best Idea
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            Best Idea to Focus On
          </h2>
          <p className="mt-4 text-lg text-gray-800 dark:text-gray-400">
            <strong>{bestIdea.name}</strong> is the best idea to pursue based on your input with a rating of{' '}
            {bestIdea.score} out of 10.
          </p>
        </div>
      )}

      {nextTopTwoIdeas && nextTopTwoIdeas.length > 0 && (
        <div className="mt-8 bg-gray-50 dark:bg-gray-900 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            Next Top Two Ideas
          </h2>
          {nextTopTwoIdeas.map((idea, index) => (
            <div key={index} className="mt-4 text-lg text-gray-800 dark:text-gray-400">
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