'use client'

import React, { useState } from "react"
import Results from "./results"
import Analysis from "@/app/analysis/page"

export default function BusinessIdeaTable() {
  const [bestIdea, setBestIdea] = useState(null);
  const [nextTopTwoIdeas, setNextTopTwoIdeas] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [ideas, setIdeas] = useState([{
    name: "",
    description: "",
    effort: 0,
    knowledge: 0,
    interest: 0,
    fun: 0,
    time: 0,
    difficulty: 0,
    showDescription: false,
  }]);
  const [customWeights, setCustomWeights] = useState({
    effort: 1,
    knowledge: 1.2,
    interest: 2,
    fun: 1.5,
    time: 1,
    difficulty: 1,
  });

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

      const ratingOutOfTen = (weightedScore * 10).toFixed(1);
      return { ...idea, score: ratingOutOfTen };
    });

    // Sort the ideas by their scores in descending order
    const topIdeas = scores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

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
        <>
          {/* Custom Wieghts */}
          <div className="mt-4">
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
                    <label>
                      {key.charAt(0).toUpperCase() + key.slice(1)} Weight
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={customWeights[key]}
                      onChange={(e) => setCustomWeights({ ...customWeights, [key]: Number(e.target.value) })}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div>
              {/* Table */}
              <table>
                <thead>
                  <tr>
                    <th>
                      Idea Name
                    </th>
                    <th>
                      Effort
                    </th>
                    <th>
                      Knowledge
                    </th>
                    <th>
                      Interest
                    </th>
                    <th>
                      Fun
                    </th>
                    <th>
                      Time
                    </th>
                    <th>
                      Difficulty
                    </th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {ideas.map((idea, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <td className='p-4 flex items-center'>
                          <button
                            onClick={() => handleToggleDescription(index)}
                            className='mr-2 bg-transparent border-none focus:outline-none focus:ring-0 active:ring-0 focus:border-none'
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
                              className='p-2 text-center'
                            />
                          </td>
                        ))}
                        <td className='p-4 text-center'>
                          {ideas.length > 1 && (
                            <button
                              onClick={() => handleRemoveIdea(index)}
                              className="outline"
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
                              className="w-full my-2"
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
            <div className='text-center mt-6 flex justify-center items-center md:block'>
              {/* Add Idea Button */}
              <button
                onClick={handleAddIdea}
              >
                Add Another Idea
              </button>
              {/* Calculate Best Idea Button */}
              <button
                onClick={!ideas.length > 1 ? '' : handleCalculate}
                className='contrast ml-4'
                disabled={ideas.length <= 1}
              >
                Calculate Best Idea
              </button>
              {/* Clear Ideas Button */}
              <button
                onClick={handleClearIdeas}
                className='outline ml-4'
              >
                Clear Ideas
              </button>
            </div>
          </div>

          {/* Results */}
          <Results bestIdea={bestIdea} nextTopTwoIdeas={nextTopTwoIdeas} />

          {bestIdea && nextTopTwoIdeas.length > 0 && (
            // View Analysis Button
            <button
              onClick={handleShowAnalysis}
              className="mt-6"
            >
              View Analysis
            </button>
          )}
        </>
      )}
    </>
  );
}