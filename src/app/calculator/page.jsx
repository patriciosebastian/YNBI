"use client"

import Analysis from "../analysis/page"
import React, { useState } from "react"

export default function Calculator() {
  const [ideas, setIdeas] = useState([
    {
      name: "",
      description: "",
      effort: 0,
      knowledge: 0,
      interest: 0,
      fun: 0,
      time: 0,
      difficulty: 0,
      showDescription: false,
    },
  ]);
  
  const [customWeights, setCustomWeights] = useState({
    effort: 1,
    knowledge: 1.2,
    interest: 2,
    fun: 1.5,
    time: 1,
    difficulty: 1,
  });

  const [bestIdea, setBestIdea] = useState(null);
  const [nextTopTwoIdeas, setNextTopTwoIdeas] = useState([]);
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleInputChange = (index, field, value) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index][field] = field === "name" || field === "description" ? value : Number(value);
    setIdeas(updatedIdeas);
  };

  const handleAddIdea = () => {
    setIdeas([
      ...ideas,
      {
        name: "",
        effort: 0,
        knowledge: 0,
        interest: 0,
        fun: 0,
        time: 0,
        difficulty: 0,
      },
    ]);
  };

  const handleToggleDescription = (index) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index].showDescription = !updatedIdeas[index].showDescription;
    setIdeas(updatedIdeas);
  };

  const handleRemoveIdea = (index) => {
    if (ideas.length > 1) {
      const updatedIdeas = ideas.filter((_, i) => i !== index);
      setIdeas(updatedIdeas);
      if (updatedIdeas.length === 0) {
        setBestIdea(null);
      }
    }
  };

  const handleCalculate = () => {
    const scores = ideas.map((idea) => {
      const weights = useCustomWeights ? customWeights : {
        effort: 1,
        knowledge: 1.2,
        interest: 2,
        fun: 1.5,
        time: 1,
        difficulty: 1,
      };

      const totalFactors =
        idea.effort * weights.effort +
        idea.knowledge * weights.knowledge +
        idea.interest * weights.interest +
        idea.fun * weights.fun +
        idea.time * weights.time +
        idea.difficulty * weights.difficulty;

      const weightedScore =
        ((idea.interest * weights.interest) +
          (idea.fun * weights.fun) -
          (idea.effort * weights.effort) -
          (idea.difficulty * weights.difficulty) +
          (idea.knowledge * weights.knowledge)) /
        totalFactors;

      const ratingOutOfTen = (weightedScore * 10).toFixed(1); // Convert to "out of 10" scale
      return { ...idea, score: ratingOutOfTen };
    });

    // Sort the ideas by their scores in descending order
    const topIdeas = scores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    // Set the best idea and the next top two ideas separately
    setBestIdea(topIdeas[0]);
    setNextTopTwoIdeas(topIdeas.slice(1, 3));
  };

  const handleClearIdeas = () => {
    setIdeas([{ name: '', description: '', effort: 0, knowledge: 0, interest: 0, fun: 0, time: 0, difficulty: 0, showDescription: false }]);
    setBestIdea(null);
    setNextTopTwoIdeas([]);
  };

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
  };

  return (
    <>
      {showAnalysis ? (
        <Analysis bestIdea={bestIdea} nextTopTwoIdeas={nextTopTwoIdeas} onBack={() => setShowAnalysis(false)} />
      ) : (
        <div className='max-w-5xl mx-auto p-6'>
          <h1 className='text-4xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200'>
            Your Next Business Idea
          </h1>
          <div className="mt-4 pl-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={useCustomWeights}
                onChange={(e) => setUseCustomWeights(e.target.checked)}
                className="mr-2"
              />
              Use Custom Weights
            </label>
            {useCustomWeights && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {Object.keys(customWeights).map((key) => (
                  <div key={key}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {key.charAt(0).toUpperCase() + key.slice(1)} Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customWeights[key]}
                      onChange={(e) => setCustomWeights({ ...customWeights, [key]: Number(e.target.value) })}
                      className="mt-1 p-2 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow p-6'>
            <div className='overflow-hidden rounded-lg border border-gray-300 dark:border-gray-600'>
              <table className='min-w-full bg-white dark:bg-gray-800'>
                <thead className='bg-gray-100 dark:bg-gray-700'>
                  <tr>
                    <th className='text-left p-4 text-gray-800 dark:text-gray-300'>
                      Idea Name
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Effort
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Knowledge
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Interest
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Fun
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Time
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'>
                      Difficulty
                    </th>
                    <th className='text-center p-4 text-gray-800 dark:text-gray-300'></th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-200 dark:divide-gray-700'>
                  {ideas.map((idea, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className='p-4 flex items-center'>
                          <button
                            onClick={() => handleToggleDescription(index)}
                            className='mr-2 focus:outline-none transition-all ease-in-out'
                            aria-label="Toggle Description"
                          >
                            {idea.showDescription ? '▼' : '▶'}
                          </button>
                          <input
                            type='text'
                            value={idea.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            className='w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500'
                            placeholder='Enter idea name'
                          />
                        </td>
                        {[
                          "effort",
                          "knowledge",
                          "interest",
                          "fun",
                          "time",
                          "difficulty",
                        ].map((field) => (
                          <td key={field} className='p-4 text-center'>
                            <input
                              type='number'
                              min='1'
                              max='10'
                              value={idea[field]}
                              onChange={(e) =>
                                handleInputChange(index, field, e.target.value)
                              }
                              className='w-16 p-2 border border-gray-300 dark:border-gray-600 rounded-md text-center dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500'
                            />
                          </td>
                        ))}
                        <td className='p-4 text-center'>
                          {ideas.length > 1 && (
                            <button
                              onClick={() => handleRemoveIdea(index)}
                              className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-300"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                      {idea.showDescription && (
                        <tr key={`${index}-description`}>
                          <td colSpan={8} className="p-4">
                            <textarea
                              value={idea.description}
                              onChange={(e) => handleInputChange(index, "description", e.target.value)}
                              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-gray-200 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter a description of the idea"
                              rows={3}
                            />
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='text-center mt-6'>
              <button
                onClick={handleAddIdea}
                className='px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300'
              >
                Add Another Idea
              </button>
              <button
                onClick={!ideas.length > 1 ? '' : handleCalculate}
                className={`ml-4 px-6 py-3 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-300 ${ideas.length > 1 ? '' : 'cursor-default opacity-70 bg-gray-300 text-gray-500 hover:bg-gray-300'}`}
                disabled={ideas.length <= 1}
              >
                Calculate Best Idea
              </button>
              <button
                onClick={handleClearIdeas}
                className="ml-4 px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 dark:focus:ring-red-300"
              >
                Clear Ideas
              </button>
            </div>
          </div>

          {bestIdea && (
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
            <>
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
              <button
                onClick={handleShowAnalysis}
                className="mt-6 px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300"
              >
                View Analysis
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
