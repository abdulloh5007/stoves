'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

const translations = { ru, uz };

export default function CreateBoilerPage() {
  const [language, setLanguage] = useState('ru');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
  }, []);

  const t = translations[language as keyof typeof translations].createBoiler;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: t.successTitle,
        description: t.successDescription,
      });
      // Here you would typically reset the form
    }, 1500);
  };


  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{t.title}</CardTitle>
          <CardDescription>{t.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="name_ru">{t.name_ru}</Label>
                    <Input id="name_ru" placeholder={t.name_ru_placeholder} disabled={isLoading} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="name_uz">{t.name_uz}</Label>
                    <Input id="name_uz" placeholder={t.name_uz_placeholder} disabled={isLoading} />
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="grid gap-2">
                    <Label htmlFor="description_ru">{t.description_ru}</Label>
                    <Textarea id="description_ru" placeholder={t.description_ru_placeholder} disabled={isLoading} />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="description_uz">{t.description_uz}</Label>
                    <Textarea id="description_uz" placeholder={t.description_uz_placeholder} disabled={isLoading} />
                </div>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="price">{t.price}</Label>
                <Input id="price" type="number" placeholder="250000" disabled={isLoading}/>
            </div>
             <div className="grid gap-2">
                <Label htmlFor="image">{t.image}</Label>
                <Input id="image" type="file" disabled={isLoading}/>
            </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="ml-auto" disabled={isLoading}>
             {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t.submitButton}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
