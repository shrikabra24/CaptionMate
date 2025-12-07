import { useState, useEffect } from 'react';
import { Caption, CATEGORIES } from '../types';
import { CaptionCard } from '../components/CaptionCard';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Shuffle } from 'lucide-react';

interface RandomViewProps {
  onBack: () => void;
}

export function RandomView({ onBack }: RandomViewProps) {
  const [caption, setCaption] = useState<Caption | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getRandomCaption();
  }, []);

  const getRandomCaption = async () => {
    setLoading(true);

    let query = supabase.from('captions').select('*');

    if (selectedCategory !== 'all') {
      query = query.contains('categories', [selectedCategory]);
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error loading random caption:', error);
      setLoading(false);
      return;
    }

    if (data && data.length > 0) {
      const randomIndex = Math.floor(Math.random() * data.length);
      setCaption(data[randomIndex]);
    }

    setLoading(false);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleShuffle = () => {
    getRandomCaption();
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
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">Random Caption</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label className="text-gray-700 font-medium">Category:</label>
            <select
              value={selectedCategory}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="px-4 py-2 bg-white border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <button
              onClick={handleShuffle}
              disabled={loading}
              className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50"
            >
              <Shuffle className="w-5 h-5" />
              Shuffle
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : caption ? (
          <div className="max-w-2xl">
            <CaptionCard caption={caption} onCategoryChange={getRandomCaption} />
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No captions available in the selected category.
          </div>
        )}
      </div>
    </div>
  );
}
