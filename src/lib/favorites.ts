const FAVORITES_KEY = 'caption_favorites';

export const getFavorites = (): string[] => {
  const stored = localStorage.getItem(FAVORITES_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const addFavorite = (captionId: string): void => {
  const favorites = getFavorites();
  if (!favorites.includes(captionId)) {
    favorites.push(captionId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
};

export const removeFavorite = (captionId: string): void => {
  const favorites = getFavorites();
  const updated = favorites.filter(id => id !== captionId);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
};

export const isFavorite = (captionId: string): boolean => {
  return getFavorites().includes(captionId);
};
