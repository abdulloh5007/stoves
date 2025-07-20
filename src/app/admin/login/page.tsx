'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

const translations = { ru, uz };

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { toast } = useToast();
  const [language] = useState((typeof window !== 'undefined' && localStorage.getItem('language')) || 'ru');
  const t = translations[language as keyof typeof translations].login;

  useEffect(() => {
    // Redirect if already logged in
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
      router.push('/admin');
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Hardcoded credentials
    const adminEmail = 'admin@example.com';
    const adminPassword = 'password123';

    setTimeout(() => {
      if (email === adminEmail && password === adminPassword) {
        sessionStorage.setItem('isLoggedIn', 'true');
        toast({
          title: t.successTitle,
          description: t.successDescription,
        });
        router.push('/admin');
      } else {
        const errorMessage = 'Неверный email или пароль';
        setError(errorMessage);
        toast({
          title: t.errorTitle,
          description: errorMessage,
          variant: 'destructive',
        });
        setLoading(false);
      }
    }, 1000); // Simulate network delay
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">{t.title}</CardTitle>
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
