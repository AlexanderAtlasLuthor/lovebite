import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SEED } from '../data/seed';

const STORAGE_KEY = '@lovebite/reviews/v1';

const ReviewsContext = createContext(null);

export function ReviewsProvider({ children }) {
  const [reviews, setReviews] = useState(SEED);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setReviews(JSON.parse(raw));
      } catch {}
      setHydrated(true);
    })();
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reviews)).catch(() => {});
  }, [reviews, hydrated]);

  const addReview = (r) => setReviews((prev) => [{ ...r, id: Date.now() }, ...prev]);
  const removeReview = (id) => setReviews((prev) => prev.filter((r) => r.id !== id));

  return (
    <ReviewsContext.Provider value={{ reviews, addReview, removeReview, hydrated }}>
      {children}
    </ReviewsContext.Provider>
  );
}

export const useReviews = () => {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error('useReviews must be used inside ReviewsProvider');
  return ctx;
};
