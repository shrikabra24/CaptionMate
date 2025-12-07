import { useState } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface UploadViewProps {
  onBack: () => void;
}

export function UploadView({ onBack }: UploadViewProps) {
  const [captions, setCaptions] = useState('');
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleUpload = async () => {
    if (!captions.trim()) {
      setResult({ success: false, message: 'Please enter some captions to upload.' });
      return;
    }

    setProcessing(true);
    setResult(null);

    try {
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      const response = await fetch(`${supabaseUrl}/functions/v1/process-captions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({ captions: captions.trim() }),
      });

      const data = await response.json();

      if (response.ok) {
        setResult({
          success: true,
          message: `Successfully processed ${data.processed} captions! ${data.duplicates || 0} duplicates removed.`,
        });
        setCaptions('');
      } else {
        setResult({
          success: false,
          message: data.error || 'Failed to process captions. Please try again.',
        });
      }
    } catch (error) {
      console.error('Upload error:', error);
      setResult({
        success: false,
        message: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-900 font-semibold transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Home
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">Upload Captions</h1>
          <p className="text-gray-600">
            Paste your captions below (one per line). AI will automatically categorize, add tags, and clean them up.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-100 p-6 mb-6">
          <textarea
            value={captions}
            onChange={(e) => setCaptions(e.target.value)}
            placeholder="Paste your captions here, one per line...&#10;&#10;Example:&#10;Living my best life 🌟&#10;Chasing sunsets and dreams&#10;Adventure awaits..."
            className="w-full h-64 p-4 border-2 border-purple-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
            disabled={processing}
          />

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {captions.split('\n').filter(line => line.trim()).length} captions ready
            </p>

            <button
              onClick={handleUpload}
              disabled={processing || !captions.trim()}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {processing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Process & Upload
                </>
              )}
            </button>
          </div>
        </div>

        {result && (
          <div
            className={`p-4 rounded-lg flex items-start gap-3 ${
              result.success
                ? 'bg-green-50 border border-green-200'
                : 'bg-red-50 border border-red-200'
            }`}
          >
            {result.success ? (
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <p
                className={`font-medium ${
                  result.success ? 'text-green-900' : 'text-red-900'
                }`}
              >
                {result.success ? 'Success!' : 'Error'}
              </p>
              <p
                className={`text-sm mt-1 ${
                  result.success ? 'text-green-700' : 'text-red-700'
                }`}
              >
                {result.message}
              </p>
            </div>
          </div>
        )}

        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-md p-4 mt-6">
          <h3 className="font-semibold text-purple-900 mb-2">How it works:</h3>
          <ul className="text-sm text-purple-800 space-y-1">
            <li>• AI analyzes each caption for content and style</li>
            <li>• Automatically assigns categories (Travel, Love, Funny, etc.)</li>
            <li>• Adds relevant tags and tone descriptors</li>
            <li>• Removes duplicate captions</li>
            <li>• Cleans up formatting and emojis</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
