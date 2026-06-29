'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '@/lib/types';

interface FavoritesState {
  favorites: Course[];
  isFavorite: (videoId: string) => boolean;
  toggleFavorite: (course: Course) => void;
  removeFavorite: (videoId: string) => void;
  clearFavorites: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isFavorite: (videoId) => get().favorites.some((c) => c.videoId === videoId),
      toggleFavorite: (course) => {
        const exists = get().favorites.some((c) => c.videoId === course.videoId);
        set({
          favorites: exists
            ? get().favorites.filter((c) => c.videoId !== course.videoId)
            : [course, ...get().favorites],
        });
      },
      removeFavorite: (videoId) =>
        set({ favorites: get().favorites.filter((c) => c.videoId !== videoId) }),
      clearFavorites: () => set({ favorites: [] }),
    }),
    { name: 'Courses-favorites' }
  )
);
