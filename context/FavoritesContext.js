import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(new Set());
  const [images, setImages] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(new Set(JSON.parse(storedFavorites)));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify([...newFavorites]));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const toggleFavorite = (imageId) => {
    setFavorites(prevFavorites => {
      const newFavorites = new Set(prevFavorites);
      if (newFavorites.has(imageId)) {
        newFavorites.delete(imageId);
      } else {
        newFavorites.add(imageId);
      }
      saveFavorites(newFavorites);
      return newFavorites;
    });
  };

  const addImages = (newImages) => {
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, images, toggleFavorite, addImages }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
} 