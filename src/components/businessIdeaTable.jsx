'use client'

import React, { useEffect, useState } from "react"
import { initialIdeas, scoringPresets } from "@/lib/staticData"
import { allNamesFilledOut, descriptionIsFilledOut } from "@/lib/utils"
import { TrashIcon } from "@heroicons/react/20/solid"
import Results from "./results"
import Analysis from "@/app/analysis/page"

export default function BusinessIdeaTable() {
  const [bestIdea, setBestIdea] = useState(null);
  const [nextTopTwoIdeas, setNextTopTwoIdeas] = useState([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [useCustomWeights, setUseCustomWeights] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState('default');
  const [nameFields, setNameFields] = useState(false);
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

  useEffect(() => {
    const savedIdeas = JSON.parse(localStorage.getItem("ideas"));
    if (savedIdeas) {
      setIdeas(savedIdeas);
    }
  }, []);

  useEffect(() => {
    const nameFieldsAreFilledOut = allNamesFilledOut(ideas);
    setNameFields(nameFieldsAreFilledOut);
  }, [ideas]);

  const handleInputChange = (index, field, value) => {
    const updatedIdeas = [...ideas];
    updatedIdeas[index][field] = field === "name" ? value : Number(value);
    setIdeas(updatedIdeas);
  };

  const handleAddDescription = (description) => {
    setBestIdea((prevBestIdea) => ({
      ...prevBestIdea,
      description: description,
    }));
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

  const handleRemoveIdea = (index) => {
    if (ideas.length > 2) {
      const updatedIdeas = ideas.filter((_, i) => i !== index);
      setIdeas(updatedIdeas);
      localStorage.setItem("ideas", JSON.stringify(updatedIdeas));
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
    localStorage.setItem("ideas", JSON.stringify(ideas));
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
    localStorage.removeItem("ideas");
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
          <div className="lg:flex justify-between">
            {/* Custom Wieghts */}
            <div>
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
                <div className="bg-[--pico-modal-overlay-background-color] grid !grid-cols-2 md:!grid-cols-3 !gap-4 p-4 mt-4 mb-2 rounded">
                  {Object.keys(customWeights).map((key) => (
                    <div key={key} className="w-fit">
                      <label>
                        {key.charAt(0).toUpperCase() + key.slice(1)} Weight
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={customWeights[key]}
                        onChange={(e) => setCustomWeights({ ...customWeights, [key]: Number(e.target.value) })}
                        className="!w-20"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Presets */}
            <div>
              <label htmlFor="scoring-preset-select" className="w-fit mt-4 lg:mt-0">Scoring Presets</label>
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
            </div>
          </div>

          <div>
            <div className="overflow-auto">
              {/* Table */}
              <table className="striped">
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
                          <input
                            type='text'
                            value={idea.name}
                            onChange={(e) =>
                              handleInputChange(index, "name", e.target.value)
                            }
                            placeholder='Enter Name *'
                            className="min-w-14"
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
                              className='p-2 min-w-14'
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
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
            <div className='text-center mt-6 flex justify-center items-center md:block'>
              {/* Add Idea Button: Mobile */}
              <button
                onClick={handleAddIdea}
                className="sm:hidden"
              >
                Add
              </button>
              {/* Add Idea Button: Desktop */}
              <button
                onClick={handleAddIdea}
                className="hidden sm:inline-flex"
              >
                Add Idea
              </button>
              {/* Calculate Best Idea Button: Mobile */}
              <button
                onClick={handleCalculate}
                className='contrast ml-4 sm:hidden'
                disabled={!nameFields}
              >
                Calculate
              </button>
              {/* Calculate Best Idea Button: Desktop */}
              <button
                onClick={handleCalculate}
                className='hidden contrast ml-4 sm:inline-flex'
                disabled={!nameFields}
              >
                Calculate Best Idea
              </button>
              {/* Clear Ideas Button: Mobile */}
              <button
                onClick={handleClearIdeas}
                className='outline ml-4 sm:hidden'
              >
                Clear
              </button>
              {/* Clear Ideas Button: Desktop */}
              <button
                onClick={handleClearIdeas}
                className='hidden outline ml-4 sm:inline-flex'
              >
                Clear Ideas
              </button>
            </div>
          </div>

          {/* Results */}
          <Results bestIdea={bestIdea} nextTopTwoIdeas={nextTopTwoIdeas} onDescriptionChange={(e) => handleAddDescription(e.target.value)} />

          {bestIdea && nextTopTwoIdeas.length > 0 && (
            <button
              onClick={handleShowAnalysis}
              className="mt-6"
              disabled={!bestIdea.description || !descriptionIsFilledOut(bestIdea)}
            >
              View Analysis
            </button>
          )}
        </>
      )}
    </>
  );
}