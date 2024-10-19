'use client'

import { useEffect, useState } from "react"
import Skeleton from "@/components/ui/skeleton"
import parse from "html-react-parser"
import { fetchUserNotionPages, getCookieValue } from "@/lib/utils";

export default function Analysis ({ bestIdea, nextTopTwoIdeas, onBack }) {
  const [loading, setLoading] = useState(false);
  const [formattedAnalysis, setFormattedAnalysis] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [userNotionPages, setUserNotionPages] = useState([]);
  const [selectedPageId, setSelectedPageId] = useState('');

  useEffect(() => {
    const notionAccessToken = localStorage.getItem('notion_access_token') || getCookieValue('notion_access_token');

    if (notionAccessToken) {
      localStorage.setItem('notion_access_token', notionAccessToken);
    } else {
      console.error('No access token found.');
    }
  }, []);

  useEffect(() => {
    const fetchAnalysis = async () => {
      setLoading(true);
      setFormattedAnalysis('');

      // if user session has notion_access_token cookie, fetch the list of pages or databases in the user's workspace using the access token
      const notionAccessToken = getCookieValue('notion_access_token');

      if (notionAccessToken) {
        try {
          const pages = await fetchUserNotionPages(notionAccessToken);
          setUserNotionPages(pages);
        } catch (error) {
          console.error('Error fetching user Notion pages:', error);
        }
      }

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

  useEffect(() => {
    const notionAccessToken = localStorage.getItem('notion_access_token');

    if (notionAccessToken) {
      const fetchPages = async () => {
        try {
          const pages = await fetchUserNotionPages(notionAccessToken);
          setUserNotionPages(pages);
        } catch (error) {
          console.error('Error fetching user Notion pages:', error);
        }
      };

      fetchPages();
    }
  }, []);

  const handleExportToNotion = () => {
    const accessToken = localStorage.getItem('notion_access_token');
    if (!accessToken) {
      window.location.href = '/api/notion-auth';
    } else {
      exportToNotion(selectedPageId);
    }
  };

  const exportToNotion = async (selectedPageId) => {
    setIsExporting(true);
    setExportSuccess(false);

    console.log('Starting export to Notion...'); // remove this line
    const accessToken = getCookie('notion_access_token');
    const notionAccessToken = localStorage.getItem('notion_access_token') || getCookieValue('notion_access_token');
    const clientAccessToken = getCookieValue('client_access_token');
    console.log('Client Access Token:', clientAccessToken); // remove this line
    console.log('Access Token:', accessToken); // remove this line
    console.log('Access Token 2:', notionAccessToken); // remove this line

    if (!notionAccessToken) {
      console.error('No access token available. User needs to authenticate.');
      return;
    }

    const plainTextAnalysis = formattedAnalysis.replace(/<[^>]*>/g, '');

    try {
      const response = await fetch('/api/exportToNotion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysisContent: plainTextAnalysis,
          pageId: selectedPageId,
          accessToken: notionAccessToken,
        }),
      });

      const data = await response.json();
      console.log('Export response:', data); // remove this line
      if (data.success) {
        setExportSuccess(true);
      } else {
        console.error('Error exporting to Notion:', data.error);
      }
    } catch (error) {
      console.error('Error exporting to Notion:', error);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-4">Analysis</h1>
      <button
        onClick={onBack}
        className="mb-4"
      >
        Back to Calculator
      </button>
      <button
        onClick={() => handleExportToNotion(selectedPageId)}
        disabled={isExporting}
        className={`${isExporting ? 'animate-pulse' : ''}`}
      >
        {isExporting ? 'Exporting...' : 'Export To Notion'}
      </button>
      {exportSuccess && <p>Nicely done! Exported to Notion.</p>}

      {userNotionPages?.length > 0 && (
        <select name="notionPages" id="notion-page-select" onChange={(e) => setSelectedPageId(e.target.value)}>
          <option value="">Select Notion Page</option>
          {userNotionPages.map((page) => (
            <option key={page.id} value={page.id}>
              {page.title[0]?.plain_text || 'Untitled Page'}
            </option>
          ))}
        </select>
      )}

      {loading ? (
        <Skeleton />
      ) : (
        <div className="bg-slate-800 p-8 rounded">
          <div className="ai-analysis-content text-lg">
            {parse(formattedAnalysis)}
          </div>
        </div>
      )}
    </div>
  );
}