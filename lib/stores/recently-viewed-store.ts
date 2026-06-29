'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Course } from '@/lib/types';

interface RecentlyViewedState {
  recentlyViewed: Course[];
  addViewed: (course: Course) => void;
  clearRecentlyViewed: () => void;
}

const MAX_RECENT = 20;

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addViewed: (course) => {
        const filtered = get().recentlyViewed.filter(
          (c) => c.videoId !== course.videoId
        );
        set({ recentlyViewed: [course, ...filtered].slice(0, MAX_RECENT) });
      },
      clearRecentlyViewed: () => set({ recentlyViewed: [] }),
    }),
    { name: 'Courses-recently-viewed' }
  )
);
