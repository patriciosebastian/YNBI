'use client'

import React, { useEffect, useState } from "react"
import { initialIdeas, scoringPresets } from "@/lib/staticData"
import { isSufficientAnalysisData } from "@/lib/utils"
import { TrashIcon } from "@heroicons/react/20/solid"
import Results from "./results"
import Analysis from "@/app/analysis/page"

export default function BusinessIdeaTable() {
  const [bestIdea, setBestIdea] = useState(null);
  const [nextTopTwoIdeas, setNextTopTwoIdeas] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [sufficientAnalysisData, setSufficientAnalysisData] = useState(false);
  const [ideas, setIdeas] = useState(initialIdeas);
  const [customWeights, setCustomWeights] = useState({
    effort: 1,
    knowledge: 1.2,
    interest: 2,
    fun: 1.5,
    time: 1,
    difficulty: 1,
  });

  useEffect(() => {
    const savedPreset = localStorage.getItem("selectedPreset");
    if (savedPreset) {
      setSelectedPreset(savedPreset);
    } else {
      setSelectedPreset('default');
    }
  }, []);

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
        description: "",
        effort: 1,
        knowledge: 1,
        interest: 1,
        fun: 1,
        time: 1,
        difficulty: 1,
      },
    ]);
  };

  const handleToggleDescription = (index) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index].showDescription = !updatedIdeas[index].showDescription;
    setIdeas(updatedIdeas);
  };

  const handleRemoveIdea = (index) => {
    if (ideas.length > 2) {
      const updatedIdeas = ideas.filter((_, i) => i !== index);
      setIdeas(updatedIdeas);
      if (updatedIdeas.length === 0) {
        setBestIdea(null);
      }
    }
  };

  const handleCalculate = () => {
    const scores = ideas.map((idea) => {
      const weights = useCustomWeights ? customWeights : scoringPresets[selectedPreset];

      const totalFactors =
        idea.effort * weights.effort +
        idea.knowledge * weights.knowledge +
        idea.interest * weights.interest +
        idea.fun * weights.fun +
        idea.time * weights.time +
        idea.difficulty * weights.difficulty;

      const positiveFactors =
        (idea.interest * weights.interest) +
        (idea.fun * weights.fun) +
        (idea.knowledge * weights.knowledge);

      const negativeFactors =
        (idea.effort * weights.effort) +
        (idea.difficulty * weights.difficulty) +
        (idea.time * weights.time);

      const weightedScore = (positiveFactors - negativeFactors) / totalFactors;

      const ratingOutOfTen = (weightedScore * 10).toFixed(1);
      return { ...idea, score: ratingOutOfTen };
    });

    // Sort the ideas by their scores in descending order
    const topIdeas = scores.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));

    setBestIdea(topIdeas[0]);
    setNextTopTwoIdeas(topIdeas.slice(1, 3));
    setSufficientAnalysisData(isSufficientAnalysisData(topIdeas));
  };

  const handleClearIdeas = () => {
    setIdeas([{
      name: "",
      description: "",
      effort: 1,
      knowledge: 1,
      interest: 1,
      fun: 1,
      time: 1,
      difficulty: 1,
      showDescription: false,
    },
    {
      name: "",
      description: "",
      effort: 1,
      knowledge: 1,
      interest: 1,
      fun: 1,
      time: 1,
      difficulty: 1,
      showDescription: false,
    }]);
    setBestIdea(null);
    setNextTopTwoIdeas([]);
  };

  const handleShowAnalysis = () => {
    setShowAnalysis(true);
  };

  const handlePresetChange = (e) => {
    const presetKey = e.target.value;
    setSelectedPreset(presetKey);
    localStorage.setItem("selectedPreset", presetKey);
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
              Use Custom Scoring
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

          {/* Presets */}
          <label htmlFor="scoring-preset-select" className="mt-4">Scoring Presets</label>
          <select
            name="scoringPreset"
            id="scoring-preset-select"
            aria-label="Scoring Preset Options"
            value={selectedPreset}
            onChange={handlePresetChange}
            className="w-fit"
            disabled={useCustomWeights}
          >
            <option value="default">Default</option>
            <option value="timeCritical">Time-Critical</option>
            <option value="passionDriven">Passion-Driven</option>
            <option value="effortOptimized">Effort-Optimized</option>
          </select>

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
                            className='mr-2 text-black bg-transparent border-none focus:outline-none focus:ring-0 active:ring-0 focus:border-none'
                            aria-label="Toggle Description"
                          >
                            {idea.showDescription ? <span>&#9660;</span> : <span>&#9658;</span>}
                          </button>
                          <input
                            type='text'
                            value={idea.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            placeholder='Enter Name *'
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
                              disabled={ideas.length <= 2}
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
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
                              placeholder="Enter a description of the idea *"
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
                Add Idea
              </button>
              {/* Calculate Best Idea Button */}
              <button
                onClick={handleCalculate}
                className='contrast ml-4'
                disabled={ideas.length <= 1 || !sufficientAnalysisData}
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
            <>
              {!sufficientAnalysisData && (
                <p className="text-red-500 mt-4">
                  Please provide a name, description, and category scores for at least one idea to generate analysis.
                </p>
              )}

              {/* View Analysis Button */}
              <button
                onClick={handleShowAnalysis}
                className="mt-6"
                disabled={!sufficientAnalysisData}
              >
                View Analysis
              </button>
            </>
          )}
        </>
      )}
    </>
  );
}