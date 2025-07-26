'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, limit } from 'firebase/firestore';

export default function RegisterAdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminExists = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'admin'), limit(1));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // Admin already exists, redirect to login
        router.replace('/admin/login');
      } else {
        setCheckingAdmin(false);
      }
    };
    checkAdminExists();
  }, [router]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Add user to 'users' collection with admin role
      await addDoc(collection(db, 'users'), {
        uid: user.uid,
        email: user.email,
        role: 'admin',
        createdAt: new Date(),
      });

      toast({
        title: "Ro'yxatdan o'tish muvaffaqiyatli",
        description: "Admin muvaffaqiyatli yaratildi. Kirish sahifasiga yo'naltirilmoqda.",
      });
      router.push('/admin/login');

    } catch (error: any) {
      console.error(error);
      toast({
        title: "Ro'yxatdan o'tishda xatolik",
        description: error.message,
        variant: 'destructive',
      });
      setLoading(false);
    }
  };

  if (checkingAdmin) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Adminni ro'yxatdan o'tkazish</CardTitle>
          <CardDescription>
            Boshqaruv paneli uchun administrator yarating. Bu amalni faqat bir marta bajarish mumkin.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Elektron pochta</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="grid gap-2 relative">
              <Label htmlFor="password">Parol</Label>
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-7 w-7"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Yaratilmoqda..." : "Adminni yaratish"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
