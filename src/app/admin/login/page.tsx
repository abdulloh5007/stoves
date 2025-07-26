'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import uz from '@/locales/uz.json';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import Link from 'next/link';

const t = uz.login;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [adminExists, setAdminExists] = useState<boolean | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);

  useEffect(() => {
    // Redirect if already logged in
    if (user) {
      router.push('/admin/requests');
    }
  }, [user, router]);
  
  useEffect(() => {
    const checkAdminExists = async () => {
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('role', '==', 'admin'), limit(1));
      const querySnapshot = await getDocs(q);
      setAdminExists(!querySnapshot.empty);
    };
    checkAdminExists();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const loggedInUser = userCredential.user;

      // Check if user has admin role
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('uid', '==', loggedInUser.uid), where('role', '==', 'admin'), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Sizda administrator huquqi yo'q.");
      }
      
      toast({
        title: t.successTitle,
        description: t.successDescription,
      });
      router.push('/admin/requests');
    } catch (err: any) {
      const errorMessage = 'Notog\'ri email yoki parol';
      setError(errorMessage);
      toast({
        title: t.errorTitle,
        description: err.message || errorMessage,
        variant: 'destructive',
      });
    } finally {
        setLoading(false);
    }
  };

  if (authLoading || adminExists === null) {
      return (
        <div className="flex h-screen items-center justify-center bg-background">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      )
  }

  if (adminExists === false) {
      return (
          <div className="flex min-h-screen items-center justify-center bg-background p-4">
              <Card className="w-full max-w-sm text-center">
                  <CardHeader>
                      <CardTitle>Admin mavjud emas</CardTitle>
                      <CardDescription>
                          Davom etish uchun avval administratorni ro'yxatdan o'tkazing.
                      </CardDescription>
                  </CardHeader>
                  <CardContent>
                      <Button asChild>
                          <Link href="/admin/register">Adminni ro'yxatdan o'tkazish</Link>
                      </Button>
                  </CardContent>
              </Card>
          </div>
      );
  }


  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Admin</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">{t.emailLabel}</Label>
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
              <Label htmlFor="password">{t.passwordLabel}</Label>
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
            {error && <p className="text-sm font-medium text-destructive">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? t.loggingIn : t.loginButton}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
