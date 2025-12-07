import { useState, useEffect } from 'react';
import { CategoryCard } from '../components/CategoryCard';
import { SearchBar } from '../components/SearchBar';
import { CATEGORIES } from '../types';
import { supabase } from '../lib/supabase';
import {
  Plane,
  Dumbbell,
  Heart,
  Church,
  Users,
  UtensilsCrossed,
  Shirt,
  Leaf,
  Coffee,
  Sparkles,
  Laugh,
  TrendingUp,
  Film,
  Clapperboard,
  Palette,
  Frown,
  Shuffle,
  Star,
  Upload
} from 'lucide-react';

const categoryIcons: Record<string, any> = {
  'Travel': Plane,
  'Gym/Fitness': Dumbbell,
  'Love/Romantic': Heart,
  'Wedding': Church,
  'Friends': Users,
  'Food': UtensilsCrossed,
  'Fashion': Shirt,
  'Nature': Leaf,
  'Daily Life': Coffee,
  'Aesthetic/Minimal': Sparkles,
  'Funny/Sarcastic': Laugh,
  'Motivational/Quotes': TrendingUp,
  'Bollywood': Film,
  'Hollywood': Clapperboard,
  'Color': Palette,
  'Cringe': Frown
};

interface HomeViewProps {
  onCategorySelect: (category: string) => void;
  onRandomClick: () => void;
  onFavoritesClick: () => void;
  onUploadClick: () => void;
  onSearchChange: (query: string) => void;
  searchQuery: string;
}

export function HomeView({
  onCategorySelect,
  onRandomClick,
  onFavoritesClick,
  onUploadClick,
  onSearchChange,
  searchQuery
}: HomeViewProps) {
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>({});
  const [totalCaptions, setTotalCaptions] = useState(0);

  useEffect(() => {
    loadCategoryCounts();
  }, []);

  const loadCategoryCounts = async () => {
    const { data, error } = await supabase
      .from('captions')
      .select('categories');

    if (error) {
      console.error('Error loading category counts:', error);
      return;
    }

    const counts: Record<string, number> = {};
    const uniqueCaptions = new Set();

    data.forEach((item) => {
      uniqueCaptions.add(item);
      const categories = item.categories || [];
      categories.forEach((cat: string) => {
        counts[cat] = (counts[cat] || 0) + 1;
      });
    });

    setCategoryCounts(counts);
    setTotalCaptions(uniqueCaptions.size);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-3">
              Caption Mate
            </h1>
          </div>
          <p className="text-lg text-gray-700 font-medium">
            {totalCaptions.toLocaleString()} Instagram captions organized just for you
          </p>
        </div>

        <div className="mb-10 max-w-2xl mx-auto">
          <SearchBar
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Search by keyword, tag, or tone..."
          />
        </div>

        <div className="flex gap-4 justify-center mb-12 flex-wrap">
          <button
            onClick={onRandomClick}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold"
          >
            <Shuffle className="w-5 h-5" />
            Random Caption
          </button>

          <button
            onClick={onFavoritesClick}
            className="flex items-center gap-2 px-8 py-4 bg-white text-purple-600 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold border-2 border-purple-200"
          >
            <Star className="w-5 h-5" />
            Favorites
          </button>

          <button
            onClick={onUploadClick}
            className="flex items-center gap-2 px-8 py-4 bg-white text-orange-600 rounded-xl hover:shadow-xl hover:scale-105 transition-all duration-200 font-semibold border-2 border-orange-200"
          >
            <Upload className="w-5 h-5" />
            Upload Captions
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((category) => (
            <CategoryCard
              key={category}
              name={category}
              icon={categoryIcons[category]}
              count={categoryCounts[category] || 0}
              onClick={() => onCategorySelect(category)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
