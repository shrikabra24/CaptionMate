import { useState } from 'react';
import { HomeView } from './views/HomeView';
import { CategoryView } from './views/CategoryView';
import { SearchView } from './views/SearchView';
import { FavoritesView } from './views/FavoritesView';
import { RandomView } from './views/RandomView';
import { UploadView } from './views/UploadView';

type View = 'home' | 'category' | 'search' | 'favorites' | 'random' | 'upload';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setCurrentView('category');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      setCurrentView('search');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    setSearchQuery('');
  };

  return (
    <>
      {currentView === 'home' && (
        <HomeView
          onCategorySelect={handleCategorySelect}
          onRandomClick={() => setCurrentView('random')}
          onFavoritesClick={() => setCurrentView('favorites')}
          onUploadClick={() => setCurrentView('upload')}
          onSearchChange={handleSearchChange}
          searchQuery={searchQuery}
        />
      )}

      {currentView === 'category' && (
        <CategoryView
          category={selectedCategory}
          onBack={handleBackToHome}
        />
      )}

      {currentView === 'search' && (
        <SearchView
          initialQuery={searchQuery}
          onBack={handleBackToHome}
          onQueryChange={setSearchQuery}
        />
      )}

      {currentView === 'favorites' && (
        <FavoritesView onBack={handleBackToHome} />
      )}

      {currentView === 'random' && (
        <RandomView onBack={handleBackToHome} />
      )}

      {currentView === 'upload' && (
        <UploadView onBack={handleBackToHome} />
      )}
    </>
  );
}

export default App;
