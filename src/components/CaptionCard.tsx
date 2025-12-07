import { Caption, CATEGORIES } from '../types';
import { Copy, Heart, Check, FolderInput, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { isFavorite, addFavorite, removeFavorite } from '../lib/favorites';
import { supabase } from '../lib/supabase';

interface CaptionCardProps {
  caption: Caption;
  onFavoriteChange?: () => void;
  onCategoryChange?: () => void;
}

export function CaptionCard({ caption, onFavoriteChange, onCategoryChange }: CaptionCardProps) {
  const [copied, setCopied] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite(caption.id));
  }, [caption.id]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(caption.caption_text);
    setCopied(true);

    await supabase
      .from('captions')
      .update({ used_count: caption.used_count + 1 })
      .eq('id', caption.id);

    setTimeout(() => setCopied(false), 2000);
  };

  const handleFavorite = () => {
    if (favorite) {
      removeFavorite(caption.id);
      setFavorite(false);
    } else {
      addFavorite(caption.id);
      setFavorite(true);
    }
    onFavoriteChange?.();
  };

  const handleAddCategory = async (category: string) => {
    const currentCategories = caption.categories || [caption.category];
    if (currentCategories.includes(category)) return;

    const newCategories = [...currentCategories, category];
    await supabase
      .from('captions')
      .update({ categories: newCategories })
      .eq('id', caption.id);

    onCategoryChange?.();
  };

  const handleRemoveCategory = async (category: string) => {
    const currentCategories = caption.categories || [caption.category];
    if (currentCategories.length <= 1) return;

    const newCategories = currentCategories.filter(c => c !== category);
    await supabase
      .from('captions')
      .update({ categories: newCategories })
      .eq('id', caption.id);

    onCategoryChange?.();
  };

  const displayCategories = caption.categories || [caption.category];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-purple-100 hover:border-purple-300">
      <p className="text-gray-800 leading-relaxed mb-4 font-medium">{caption.caption_text}</p>

      <div className="flex gap-2 flex-wrap mb-4">
        {displayCategories.map((cat) => (
          <span key={cat} className="inline-flex items-center gap-1 text-xs bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 px-3 py-1.5 rounded-full font-semibold">
            {cat}
            {displayCategories.length > 1 && (
              <button
                onClick={() => handleRemoveCategory(cat)}
                className="hover:bg-blue-200 rounded-full p-0.5"
                title="Remove from this category"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {caption.tone && (
            <span className="text-xs bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-3 py-1.5 rounded-full font-semibold">
              {caption.tone}
            </span>
          )}
          {caption.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-700 px-3 py-1.5 rounded-full font-semibold">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <div className="relative">
            <button
              onClick={() => setShowCategoryMenu(!showCategoryMenu)}
              className="p-2.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all duration-200"
              title="Add to category"
            >
              <FolderInput className="w-5 h-5" />
            </button>
            {showCategoryMenu && (
              <div className="absolute right-0 bottom-full mb-2 bg-white rounded-xl shadow-2xl border-2 border-purple-200 p-2 z-10 max-h-64 overflow-y-auto w-48">
                {CATEGORIES.filter(cat => !displayCategories.includes(cat)).map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      handleAddCategory(category);
                      setShowCategoryMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-purple-50 rounded-lg transition-colors"
                  >
                    {category}
                  </button>
                ))}
                {displayCategories.length === CATEGORIES.length && (
                  <p className="text-xs text-gray-500 text-center py-2">In all categories</p>
                )}
              </div>
            )}
          </div>

          <button
            onClick={handleFavorite}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              favorite
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md hover:shadow-lg'
                : 'bg-purple-50 text-purple-400 hover:bg-purple-100'
            }`}
            title={favorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart className={`w-5 h-5 ${favorite ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={handleCopy}
            className="p-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
            title="Copy caption"
          >
            {copied ? (
              <Check className="w-5 h-5" />
            ) : (
              <Copy className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
