import { useState, useEffect } from 'react';
import { Caption } from '../types';
import { CaptionCard } from '../components/CaptionCard';
import { supabase } from '../lib/supabase';
import { getFavorites } from '../lib/favorites';
import { ArrowLeft, Heart } from 'lucide-react';

interface FavoritesViewProps {
  onBack: () => void;
}

export function FavoritesView({ onBack }: FavoritesViewProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const favoriteIds = getFavorites();

    if (favoriteIds.length === 0) {
      setCaptions([]);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('captions')
      .select('*')
      .in('id', favoriteIds);

    if (error) {
      console.error('Error loading favorites:', error);
    } else {
      setCaptions(data || []);
    }
    setLoading(false);
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
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-8 h-8 text-pink-500 fill-current" />
            <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">Your Favorites</h1>
          </div>
          <p className="text-gray-600">{captions.length} saved captions</p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {captions.map((caption) => (
              <CaptionCard
                key={caption.id}
                caption={caption}
                onFavoriteChange={loadFavorites}
                onCategoryChange={loadFavorites}
              />
            ))}

            {captions.length === 0 && (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-purple-200 mx-auto mb-4" />
                <p className="text-gray-500">No favorites yet.</p>
                <p className="text-gray-400 text-sm mt-2">
                  Start adding captions to your favorites by clicking the heart icon.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
