'use client'

import { formatAnalysis } from "@/lib/utils"
import { useEffect, useState } from "react"

export default function Analysis ({ bestIdea, nextTopTwoIdeas, onBack }) {
  const [loading, setLoading] = useState(false);
  const [formattedAnalysis, setFormattedAnalysis] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setFormattedAnalysis('');

      try {
        const response = await fetch('/api/getAnalysis', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bestIdea, nextTopTwoIdeas }),
        });

        const data = await response.json();
        setFormattedAnalysis(formatAnalysis(data.analysis));
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setFormattedAnalysis('Error generating analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [bestIdea, nextTopTwoIdeas]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Analysis</h1>
      <button
        onClick={onBack}
        className="mb-4 px-6 py-3 bg-gray-500 text-white rounded-lg shadow hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-300"
      >
        Back to Calculator
      </button>
      {loading ? (
        <p>Loading analysis...</p>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <div className="ai-analysis-content text-lg text-gray-700 dark:text-gray-300">
            {formattedAnalysis}
          </div>
        </div>
      )}
    </div>
  );
}