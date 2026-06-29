'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';

import {
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';import { toast } from 'sonner';
import Link from 'next/link';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});
type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const onSubmit = async (data: FormData) => {
  setLoading(true);

  try {
    console.log("1");
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      data.email,
      data.password
    );
    console.log("2");
    await updateProfile(userCredential.user, {
      displayName: data.name,
    });console.log("2"); 
    await sendEmailVerification(userCredential.user);
    console.log("4");
    // await setDoc(doc(db, "users", userCredential.user.uid), {
    //   uid: userCredential.user.uid,
    //   name: data.name,
    //   email: data.email,
    //   createdAt: serverTimestamp(),
    // });
    console.log("5");
    toast.success(
      "Account created successfully. Please verify your email."
    );

    router.push("/login");
  } catch (error: any) {
    switch (error.code) {
      case "auth/email-already-in-use":
        toast.error("This email is already in use.");
        break;

      case "auth/weak-password":
        toast.error("Password must be at least 6 characters.");
        break;

      case "auth/invalid-email":
        toast.error("Invalid email address.");
        break;

      default:
        toast.error(error.message);
    }
  } finally {
    setLoading(false);
  }
};
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });
  return (
    <div className="pt-28 container mx-auto px-4 min-h-screen flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold tracking-tight">Create account</h1>
            <p className="text-muted-foreground mt-2">Start learning in seconds</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="name" placeholder="Omar Ashraf" className="pl-10" {...register('name')} />
              </div>
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="email" type="email" placeholder="Your Email" className="pl-10" {...register('email')} />
              </div>
              {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" placeholder="••••••••" className="pl-10" {...register('password')} />
              </div>
              {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
            </div>

            <Button type="submit" className="w-full glow" size="lg" disabled={loading}>
              {loading ? 'Please Wait…' : 'Create Account'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
