'use client';

import { useState, useEffect } from 'react';
import { useSignInWithEmailAndPassword } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuthState } from 'react-firebase-hooks/auth';

const translations = {
  ru: {
    title: 'Вход для администратора',
    description: 'Введите ваши данные для входа в панель управления.',
    emailLabel: 'Электронная почта',
    passwordLabel: 'Пароль',
    loginButton: 'Войти',
    loggingIn: 'Вход...',
    errorTitle: 'Ошибка входа',
    successTitle: 'Вход выполнен',
    successDescription: 'Перенаправление в панель управления...',
  },
  uz: {
    title: 'Administrator uchun kirish',
    description: 'Boshqaruv paneliga kirish uchun ma\'lumotlaringizni kiriting.',
    emailLabel: 'Elektron pochta',
    passwordLabel: 'Parol',
    loginButton: 'Kirish',
    loggingIn: 'Kirilmoqda...',
    errorTitle: 'Kirishda xatolik',
    successTitle: 'Muvaffaqiyatli kirish',
    successDescription: 'Boshqaruv paneliga yo\'naltirilmoqda...',
  },
};

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [signInWithEmailAndPassword, signedInUser, loading, error] = useSignInWithEmailAndPassword(auth);
  const [user, authLoading] = useAuthState(auth);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(email, password);
  };

  useEffect(() => {
    if (error) {
      toast({
        title: translations.ru.errorTitle,
        description: error.message,
        variant: 'destructive',
      });
    }
  }, [error, toast]);
  
  useEffect(() => {
    if (signedInUser || (!authLoading && user)) {
       toast({
        title: translations.ru.successTitle,
        description: translations.ru.successDescription,
      });
      router.push('/admin');
    }
  },[signedInUser, user, authLoading, router, toast]);

  if (authLoading) {
     return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  // Не рендерим форму, если пользователь уже вошел и идет перенаправление
  if (user) {
    return null; 
  }

  const t = translations['ru'];

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
