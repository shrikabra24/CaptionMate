import { useState, useEffect } from 'react';
import { Caption } from '../types';
import { CaptionCard } from '../components/CaptionCard';
import { SearchBar } from '../components/SearchBar';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface SearchViewProps {
  initialQuery: string;
  onBack: () => void;
  onQueryChange: (query: string) => void;
}

export function SearchView({ initialQuery, onBack, onQueryChange }: SearchViewProps) {
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchCaptions(searchQuery);
    } else {
      setCaptions([]);
    }
  }, [searchQuery]);

  const searchCaptions = async (query: string) => {
    setLoading(true);
    const lowerQuery = query.toLowerCase();

    const { data, error } = await supabase
      .from('captions')
      .select('*')
      .or(`caption_text.ilike.%${query}%,tags.cs.{${lowerQuery}},tone.ilike.%${query}%`)
      .order('used_count', { ascending: false });

    if (error) {
      console.error('Error searching captions:', error);
    } else {
      setCaptions(data || []);
    }
    setLoading(false);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onQueryChange(value);
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
          <h1 className="text-4xl font-black bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent mb-4">Search Captions</h1>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search by keyword, tag, or tone..."
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {searchQuery.trim() && (
              <p className="text-gray-600 mb-4">
                Found {captions.length} caption{captions.length !== 1 ? 's' : ''}
              </p>
            )}

            <div className="space-y-4">
              {captions.map((caption) => (
                <CaptionCard key={caption.id} caption={caption} onCategoryChange={() => searchCaptions(searchQuery)} />
              ))}

              {searchQuery.trim() && captions.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  No captions found matching your search.
                </div>
              )}

              {!searchQuery.trim() && (
                <div className="text-center py-12 text-gray-500">
                  Enter a search term to find captions.
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
