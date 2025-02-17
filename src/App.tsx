import React, { useState } from 'react';
import { Search, Building2, Loader2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

function App() {
  const [url, setUrl] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [companyData, setCompanyData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || !apiKey) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('job_url', url);

      const response = await axios.post('http://localhost:8900/fetch-company-name', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      setCompanyData(response.data);
      toast.success('Data fetched successfully!');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Building2 className="w-16 h-16 mx-auto text-indigo-600 mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Company Data Scraper</h1>
          <p className="text-lg text-gray-600">Enter a URL to analyze company information using AI</p>
        </div>

        <div className="bg-white rounded-xl shadow-xl p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
                Company Website URL
              </label>
              <div className="relative">
                <input
                  type="url"
                  id="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  placeholder="https://example.com"
                  required
                />
                <Search className="absolute right-3 top-3 text-gray-400" size={20} />
              </div>
            </div>

            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
                Gemini API Key
              </label>
              <input
                type="password"
                id="apiKey"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                placeholder="Enter your Gemini API key"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:bg-indigo-400 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Processing...
                </>
              ) : (
                'Analyze Company'
              )}
            </button>
          </form>
        </div>

        {companyData && (
          <div className="bg-white rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
            <pre className="bg-gray-50 p-4 rounded-lg overflow-auto max-h-96">
              {JSON.stringify(companyData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;