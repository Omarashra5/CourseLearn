'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  theme: 'light' | 'dark';
  reduceMotion: boolean;
  autoplay: boolean;
  language: string;
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  setReduceMotion: (v: boolean) => void;
  setAutoplay: (v: boolean) => void;
  setLanguage: (l: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      reduceMotion: false,
      autoplay: true,
      language: 'en',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setAutoplay: (autoplay) => set({ autoplay }),
      setLanguage: (language) => set({ language }),
    }),
    { name: 'Courses-settings' }
  )
);
