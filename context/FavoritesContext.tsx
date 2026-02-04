"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (slug: string) => void;
  removeFavorite: (slug: string) => void;
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "iamfeeling-favorites";

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load favorites from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      } catch (error) {
        console.error("Error saving favorites:", error);
      }
    }
  }, [favorites, isLoaded]);

  const addFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      if (prev.includes(slug)) return prev;
      return [...prev, slug];
    });
  }, []);

  const removeFavorite = useCallback((slug: string) => {
    setFavorites((prev) => prev.filter((s) => s !== slug));
  }, []);

  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      return [...prev, slug];
    });
  }, []);

  const isFavorite = useCallback(
    (slug: string) => {
      return favorites.includes(slug);
    },
    [favorites],
  );

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        addFavorite,
        removeFavorite,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
