'use client'

import { useEffect, useState } from "react"
import Skeleton from "@/components/ui/skeleton"
import parse from "html-react-parser"
import html2pdf from "html2pdf.js"

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
        setFormattedAnalysis(data.formattedContent);
      } catch (error) {
        console.error('Error fetching analysis:', error);
        setFormattedAnalysis('Error generating analysis. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [bestIdea, nextTopTwoIdeas]);

  const exportToPDF = () => {
    const element = document.querySelector('.ai-analysis-content');
    const options = {
      margin: 0.25,
      filename: 'Business_Idea_Analysis.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
    };

    html2pdf().from(element).set(options).save();
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Analysis</h1>
      <button
        onClick={onBack}
        className="mb-4"
      >
        Back to Calculator
      </button>
      <button
        onClick={exportToPDF}
        className="ml-4 mb-4"
      >
        Export to PDF
      </button>

      {loading ? (
        <Skeleton />
      ) : (
        <div className="analysis-container p-4 rounded">
          <div className="ai-analysis-content text-lg">
            {parse(formattedAnalysis)}
          </div>
        </div>
      )}
    </main>
  );
}