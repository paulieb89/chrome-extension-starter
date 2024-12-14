import { useState } from "react";
import "../global.css";

type AnalysisType = 'summarize' | 'extract' | 'automate';
type AnalysisResult = {
  success: boolean;
  data?: {
    summary?: string;
    extractedInfo?: Record<string, any>;
    suggestions?: string[];
  };
  error?: string;
};

export const Popup = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType>('summarize');
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const response = await chrome.runtime.sendMessage({
        action: 'analyzePage',
        analysisType
      });
      setResult(response);
    } catch (error) {
      setResult({ 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderResult = () => {
    if (!result) return null;
    if (!result.success) {
      return (
        <div className="p-3 bg-red-50 text-red-700 rounded-md">
          Error: {result.error}
        </div>
      );
    }

    const { data } = result;
    return (
      <div className="mt-4 p-3 bg-gray-50 rounded-md">
        <h2 className="font-medium mb-2">Results:</h2>
        {data?.summary && (
          <div className="mb-2">
            <p className="text-sm">{data.summary}</p>
          </div>
        )}
        {data?.extractedInfo && (
          <div className="mb-2">
            <h3 className="font-medium text-sm mb-1">Extracted Information:</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded">
              {JSON.stringify(data.extractedInfo, null, 2)}
            </pre>
          </div>
        )}
        {data?.suggestions && (
          <div>
            <h3 className="font-medium text-sm mb-1">Suggested Automations:</h3>
            <ul className="text-sm list-disc list-inside">
              {data.suggestions.map((suggestion, i) => (
                <li key={i}>{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-96 p-4 bg-white">
      <h1 className="text-2xl font-bold mb-4">Page Assistant</h1>
      
      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="font-medium">Analysis Type</label>
          <select 
            className="p-2 border rounded-md"
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value as AnalysisType)}
          >
            <option value="summarize">Summarize Page</option>
            <option value="extract">Extract Information</option>
            <option value="automate">Suggest Automations</option>
          </select>
        </div>

        <button
          className={`w-full p-2 rounded-md text-white ${
            isAnalyzing 
              ? 'bg-gray-400' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
          onClick={handleAnalyze}
          disabled={isAnalyzing}
        >
          {isAnalyzing ? 'Analyzing...' : 'Analyze Page'}
        </button>

        {renderResult()}
      </div>
    </div>
  );
};
