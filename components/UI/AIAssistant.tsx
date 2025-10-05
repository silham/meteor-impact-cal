'use client';

import { useState } from 'react';
import { MeteorParameters, ImpactResults } from '@/types/impact.types';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';

interface AIAssistantProps {
  parameters: MeteorParameters;
  results: ImpactResults | null;
  hasLocation: boolean;
}

export default function AIAssistant({ parameters, results, hasLocation }: AIAssistantProps) {
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [expanded, setExpanded] = useState(false);

  const handleGetAnalysis = async () => {
    if (!results || !hasLocation) {
      setError('Please select an impact location first');
      return;
    }

    setLoading(true);
    setError('');
    setExpanded(true);

    try {
      const response = await fetch('/api/impact-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parameters,
          results,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate analysis');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate analysis');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* AI Assistant Button */}
      <button
        type="button"
        onClick={handleGetAnalysis}
        disabled={!hasLocation || !results || loading}
        className="w-full font-semibold py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        style={
          hasLocation && results && !loading
            ? { background: 'linear-gradient(to right, #8b5cf6, #6366f1)', color: '#fff' }
            : { background: 'rgb(30, 30, 48)', color: '#9ca3af', border: '1px solid rgba(255, 255, 255, 0.1)' }
        }
      >
        {loading ? (
          <>
            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
            <span>Analyzing Impact...</span>
          </>
        ) : (
          <>
            <span className="text-xl">🤖</span>
            <span>AI Impact Analysis</span>
          </>
        )}
      </button>

      {/* Error Message */}
      {error && (
        <div className="p-3 rounded-lg border" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
          <p className="text-sm" style={{ color: '#f87171' }}>
            <strong>⚠️ Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Analysis Result */}
      {expanded && analysis && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold" style={{ color: '#e5e5e5' }}>
              Impact Analysis
            </h3>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="text-sm px-3 py-1 rounded transition-colors"
              style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#9ca3af' }}
            >
              Close
            </button>
          </div>
          
          <div 
            className="p-4 rounded-lg overflow-y-auto prose prose-invert prose-sm max-w-none"
            style={{ 
              background: 'rgb(30, 30, 48)', 
              maxHeight: '500px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}
          >
            <ReactMarkdown
              components={{
                h1: ({ children }: { children: React.ReactNode }) => (
                  <h1 className="text-xl font-bold mb-3 mt-4" style={{ color: '#e5e5e5' }}>
                    {children}
                  </h1>
                ),
                h2: ({ children }: { children: React.ReactNode }) => (
                  <h2 className="text-lg font-bold mb-2 mt-3" style={{ color: '#e5e5e5' }}>
                    {children}
                  </h2>
                ),
                h3: ({ children }: { children: React.ReactNode }) => (
                  <h3 className="text-base font-semibold mb-2 mt-2" style={{ color: '#e5e5e5' }}>
                    {children}
                  </h3>
                ),
                p: ({ children }: { children: React.ReactNode }) => (
                  <p className="mb-3 leading-relaxed" style={{ color: '#d1d5db' }}>
                    {children}
                  </p>
                ),
                ul: ({ children }: { children: React.ReactNode }) => (
                  <ul className="list-disc pl-5 mb-3 space-y-1" style={{ color: '#d1d5db' }}>
                    {children}
                  </ul>
                ),
                ol: ({ children }: { children: React.ReactNode }) => (
                  <ol className="list-decimal pl-5 mb-3 space-y-1" style={{ color: '#d1d5db' }}>
                    {children}
                  </ol>
                ),
                li: ({ children }: { children: React.ReactNode }) => (
                  <li className="mb-1" style={{ color: '#d1d5db' }}>
                    {children}
                  </li>
                ),
                strong: ({ children }: { children: React.ReactNode }) => (
                  <strong style={{ color: '#60a5fa', fontWeight: 'bold' }}>
                    {children}
                  </strong>
                ),
                code: ({ children }: { children: React.ReactNode }) => (
                  <code 
                    className="px-1 py-0.5 rounded text-sm"
                    style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#fbbf24' }}
                  >
                    {children}
                  </code>
                ),
                blockquote: ({ children }: { children: React.ReactNode }) => (
                  <blockquote 
                    className="border-l-4 pl-4 my-3 italic"
                    style={{ borderColor: '#8b5cf6', color: '#9ca3af' }}
                  >
                    {children}
                  </blockquote>
                ),
              } as Components}
            >
              {analysis}
            </ReactMarkdown>
          </div>
        </div>
      )}
    </div>
  );
}
