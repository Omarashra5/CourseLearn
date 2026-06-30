'use client';

import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Sparkles, Heart, Clock, LayoutDashboard, LogOut, Settings as SettingsIcon, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { signOut, onAuthStateChanged, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useSettingsStore } from '@/lib/stores/settings-store';
import { cn } from '@/lib/utils';
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/courses', label: 'Courses' },
  { href: '/categories', label: 'Categories' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut(auth);
  };
  const { theme, toggleTheme } = useSettingsStore();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
  }, [pathname]);
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery('');
      setSearchOpen(false);
    }
  };

  return (
    <header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-500',
        scrolled ? 'py-2' : 'py-4'
      )}
    >
      <div className="container mx-auto px-4">
        <nav
          className={cn(
            'w-full flex items-center justify-between rounded-2xl px-4 md:px-6 h-16 transition-all duration-500',
            scrolled
              ? 'glass-strong shadow-xl shadow-black/5'
              : 'bg-transparent'
          )}
        >
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-xl font-bold tracking-tight">
              Courses
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative px-4 py-2 text-sm font-medium rounded-lg transition-colors',
                  pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.div
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-lg bg-primary/10 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <form onSubmit={submitSearch} className="hidden md:flex items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search courses…"
                  className="w-48 lg:w-64 pl-9 h-9 glass"
                  aria-label="Search courses"
                />
              </div>
            </form>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-9 w-9"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {isAuthenticated ? (
              <div className="hidden md:flex items-center gap-1">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-1" />
                    Dashboard
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                  <Link href="/favorites" aria-label="Favorites">
                    <Heart className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                  <Link href="/settings" aria-label="Settings">
                    <SettingsIcon className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild size="sm" className="glow">
                  <Link href="/register">Get Started</Link>
                </Button>
              </div>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="md:hidden mt-2 glass-strong rounded-2xl overflow-hidden"
            >
              <div className="p-4 space-y-3">
                <form onSubmit={submitSearch} className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search courses…"
                    className="pl-9"
                  />
                </form>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="block px-3 py-2 rounded-lg text-sm font-medium hover:bg-primary/10"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="h-px bg-border" />
                {isAuthenticated ? (
                  <>
                    <Link href="/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                    <Link href="/favorites" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10">
                      <Heart className="h-4 w-4" /> Favorites
                    </Link>
                    <Link href="/recently-viewed" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10">
                      <Clock className="h-4 w-4" /> Recently Viewed
                    </Link>
                    <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-primary/10">
                      <SettingsIcon className="h-4 w-4" /> Settings
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        logout();
                        router.push('/');
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" /> Logout
                    </Button>
                  </>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline">
                      <Link href="/login">Login</Link>
                    </Button>
                    <Button asChild className="glow">
                      <Link href="/register">Get Started</Link>
                    </Button>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
