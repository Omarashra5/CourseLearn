'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Palette, Bell, Globe, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useEffect } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, updateProfile } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useSettingsStore } from '@/lib/stores/settings-store';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function SettingsPage() {
const [user, setUser] = useState<any>(null);
const [name, setName] = useState("");
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (u) => {
    setUser(u);
  });

  return unsubscribe;
}, []);
  const { theme, setTheme, reduceMotion, setReduceMotion, autoplay, setAutoplay, language, setLanguage } = useSettingsStore();
  const router = useRouter();
useEffect(() => {
  const load = async () => {
    if (!user) return;

    setName(user.displayName || ""); // 🔥 ده المهم

    const ref = doc(db, "users", user.uid);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      setName(snap.data().name || user.displayName || "");
    }

    setLoading(false);
  };

  load();
}, [user]);
  const saveProfile = async () => {
    if (!user) return;

    try {
      await updateProfile(user, {
        displayName: name,
      });

      toast.success("Profile updated");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update profile");
    }
  };
  console.log("USER:", user);
 if(loading || !user){
   return (
    <div className="pt-28 container mx-auto px-4 min-h-screen max-w-3xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-2">Settings</h1>
        <p className="text-muted-foreground text-lg mb-10">Manage your account and preferences.</p>

        {/* Profile */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <User className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ''} disabled />
            </div>
            <Button onClick={saveProfile} className="glow">Save changes</Button>
          </div>
        </section>

        {/* Appearance */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Palette className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Appearance</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Theme</p>
                <p className="text-sm text-muted-foreground">Choose light or dark mode</p>
              </div>
              <Select value={theme} onValueChange={(v) => setTheme(v as 'light' | 'dark')}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Dark</SelectItem>
                  <SelectItem value="light">Light</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Reduce motion</p>
                <p className="text-sm text-muted-foreground">Minimize animations</p>
              </div>
              <Switch checked={reduceMotion} onCheckedChange={setReduceMotion} />
            </div>
          </div>
        </section>

        {/* Preferences */}
        <section className="glass-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-5">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="font-display text-xl font-semibold">Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Autoplay</p>
                <p className="text-sm text-muted-foreground">Auto-play course previews</p>
              </div>
              <Switch checked={autoplay} onCheckedChange={setAutoplay} />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> Language</p>
                <p className="text-sm text-muted-foreground">Interface language</p>
              </div>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                  <SelectItem value="fr">Français</SelectItem>
                  <SelectItem value="de">Deutsch</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </section>

        {/* Danger */}
        <section className="glass-card p-6 border-destructive/30">
          <h2 className="font-display text-xl font-semibold mb-4">Account</h2>
          <Button
            variant="outline"
            onClick={async () => {
              await signOut(auth);
              router.push("/");
              toast.success("Signed out");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" /> Sign out
          </Button>
        </section>
      </motion.div>
    </div>
  );
 }
}
