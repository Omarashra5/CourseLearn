'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<User, 'name' | 'avatar'>>) => void;
}

function makeId() {
  return `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email, _password) => {
        await new Promise((r) => setTimeout(r, 400));
        const stored = localStorage.getItem('Courses-users');
        const users: Array<User & { password?: string }> = stored
          ? JSON.parse(stored)
          : [];
        const found = users.find((u) => u.email === email);
        const user: User = found
          ? { id: found.id, name: found.name, email: found.email, avatar: found.avatar, createdAt: found.createdAt }
          : {
              id: makeId(),
              name: email.split('@')[0],
              email,
              createdAt: new Date().toISOString(),
            };
        set({ user, isAuthenticated: true });
        return user;
      },
      register: async (name, email, _password) => {
        await new Promise((r) => setTimeout(r, 400));
        const user: User = {
          id: makeId(),
          name,
          email,
          createdAt: new Date().toISOString(),
        };
        const stored = localStorage.getItem('Courses-users');
        const users = stored ? JSON.parse(stored) : [];
        users.push({ ...user, password: _password });
        localStorage.setItem('Courses-users', JSON.stringify(users));
        set({ user, isAuthenticated: true });
        return user;
      },
      logout: () => set({ user: null, isAuthenticated: false }),
      updateProfile: (data) => {
        const current = get().user;
        if (!current) return;
        const updated = { ...current, ...data };
        set({ user: updated });
        const stored = localStorage.getItem('Courses-users');
        const users = stored ? JSON.parse(stored) : [];
        const idx = users.findIndex((u: User) => u.id === current.id);
        if (idx >= 0) {
          users[idx] = { ...users[idx], ...data };
          localStorage.setItem('Courses-users', JSON.stringify(users));
        }
      },
    }),
    { name: 'Courses-auth' }
  )
);
