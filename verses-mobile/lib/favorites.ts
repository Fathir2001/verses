// Favorites storage using AsyncStorage
// AsyncStorage = like localStorage in web, but for mobile apps
// It persists data even when the app is closed

import AsyncStorage from "@react-native-async-storage/async-storage";

const FAVORITES_KEY = "verses_favorites";

// ---------- Listener system ----------
// Allows the tab bar badge (and anything else) to react instantly
// when a favorite is toggled from ANY screen.
type FavoritesListener = (count: number) => void;
const listeners = new Set<FavoritesListener>();

/** Subscribe to favorites count changes. Returns an unsubscribe function. */
export function onFavoritesChange(listener: FavoritesListener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function notifyListeners(favorites: string[]) {
  listeners.forEach((fn) => fn(favorites.length));
}

// Get all favorite slugs
export async function getFavorites(): Promise<string[]> {
  try {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// Toggle a feeling as favorite
export async function toggleFavorite(slug: string): Promise<boolean> {
  const favorites = await getFavorites();
  const index = favorites.indexOf(slug);

  if (index > -1) {
    // Remove from favorites
    favorites.splice(index, 1);
  } else {
    // Add to favorites
    favorites.push(slug);
  }

  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  notifyListeners(favorites); // Notify all listeners immediately
  return index === -1; // returns true if added, false if removed
}

// Check if a feeling is favorited
export async function isFavorite(slug: string): Promise<boolean> {
  const favorites = await getFavorites();
  return favorites.includes(slug);
}
