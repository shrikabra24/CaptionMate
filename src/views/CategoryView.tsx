import { useState, useEffect } from 'react';
import { Caption, CATEGORIES } from '../types';
import { CaptionCard } from '../components/CaptionCard';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Shuffle, Plus } from 'lucide-react';

interface CategoryViewProps {
  category: string;
  onBack: () => void;
}

export function CategoryView({ category, onBack }: CategoryViewProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);
  const [randomCaption, setRandomCaption] = useState<Caption | null>(null);
  const [newCaption, setNewCaption] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    loadCaptions();
  }, [category]);

  const loadCaptions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('captions')
      .select('*')
      .contains('categories', [category])
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading captions:', error);
    } else {
      setCaptions(data || []);
    }
    setLoading(false);
  };

  const getRandomCaption = () => {
    if (captions.length > 0) {
      const random = captions[Math.floor(Math.random() * captions.length)];
      setRandomCaption(random);
    }
  };

  const parseHashtags = (text: string): string[] => {
    const hashtagRegex = /#(\w+)/g;
    const matches = text.match(hashtagRegex);
    if (!matches) return [];

    const tags = matches.map(tag => tag.substring(1).toLowerCase());
    const matchedCategories: string[] = [];

    CATEGORIES.forEach(cat => {
      const catLower = cat.toLowerCase().replace(/\//g, '').replace(/\s+/g, '');
      if (tags.some(tag => catLower.includes(tag) || tag.includes(catLower))) {
        matchedCategories.push(cat);
      }
    });

    return matchedCategories;
  };

  const handleAddCaption = async () => {
    if (!newCaption.trim()) return;

    setAdding(true);

    const categoriesFromHashtags = parseHashtags(newCaption);
    const finalCategories = categoriesFromHashtags.length > 0
      ? categoriesFromHashtags
      : [category];

    const captionText = newCaption.replace(/#\w+/g, '').trim();

    const { error } = await supabase
      .from('captions')
      .insert({
        caption_text: captionText,
        category: finalCategories[0],
        categories: finalCategories,
        tags: [],
        tone: 'casual',
        used_count: 0,
      });

    if (error) {
      console.error('Error adding caption:', error);
      alert('Failed to add caption. Please try again.');
    } else {
      setNewCaption('');
      loadCaptions();
    }

    setAdding(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-900 transition-colors duration-200 font-semibold"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Categories
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-2">{category}</h1>
          <p className="text-gray-700 font-medium">{captions.length} captions available</p>
        </div>

        <div className="mb-6 space-y-4">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-purple-200 p-4">
            <label className="block text-sm font-bold text-purple-700 mb-2">
              Add New Caption to {category}
            </label>
            <p className="text-xs text-gray-600 mb-3">
              Use hashtags like #travel #love to add to multiple categories automatically
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCaption}
                onChange={(e) => setNewCaption(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddCaption()}
                placeholder="Type your caption here... #hashtags"
                className="flex-1 px-4 py-3 border-2 border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
                disabled={adding}
              />
              <button
                onClick={handleAddCaption}
                disabled={adding || !newCaption.trim()}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                {adding ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>

          <button
            onClick={getRandomCaption}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Shuffle className="w-5 h-5" />
            Random from {category}
          </button>
        </div>

        {randomCaption && (
          <div className="mb-6 p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl shadow-lg">
            <p className="text-sm font-bold text-purple-700 mb-3">Random Caption:</p>
            <CaptionCard caption={randomCaption} />
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {captions.map((caption) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
                onCategoryChange={loadCaptions}
              />
            ))}

            {captions.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No captions found in this category yet.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
