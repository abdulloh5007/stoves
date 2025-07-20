'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Moon, Sun } from 'lucide-react';

// Boiler type definition
interface Boiler {
  id: string;
  name: { [key: string]: string };
  description: { [key: string]: string };
  price: number;
  imageUrl: string;
}

// Mock data for boilers with translations
const fakeBoilers: Boiler[] = [
  {
    id: 'boiler-1',
    name: {
      ru: 'Котел "Теплодар-1"',
      uz: '"Teplodar-1" qozoni',
    },
    price: 150000,
    description: {
      ru: 'Надежный и эффективный угольный котел для вашего дома.',
      uz: 'Uyingiz uchun ishonchli va samarali ko\'mirli qozon.',
    },
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-2',
    name: {
      ru: 'Котел "Пламя-2"',
      uz: '"Plamya-2" qozoni',
    },
    price: 220000,
    description: {
      ru: 'Современный газовый котел с высоким КПД и автоматикой.',
      uz: 'Yuqori samaradorlik va avtomatikaga ega zamonaviy gaz qozoni.',
    },
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-3',
    name: {
      ru: 'Котел "Уют-3"',
      uz: '"Uyut-3" qozoni',
    },
    price: 185000,
    description: {
      ru: 'Компактный электрический котел, идеален для небольших помещений.',
      uz: 'Kichik xonalar uchun ideal bo\'lgan ixcham elektr qozon.',
    },
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-4',
    name: {
      ru: 'Котел "Гигант-4"',
      uz: '"Gigant-4" qozoni',
    },
    price: 310000,
    description: {
      ru: 'Мощный промышленный котел для отопления больших площадей.',
      uz: 'Katta maydonlarni isitish uchun kuchli sanoat qozoni.',
    },
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

// Helper to format numbers with spaces
const formatPrice = (price: number) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Translations
const translations = {
  ru: {
    siteTitle: 'Продажа котлов',
    siteDescription: 'Выберите лучший котел для вашего дома',
    buyButton: 'Купить',
    requestTitle: 'Заявка на',
    requestDescription: 'Заполните форму ниже, чтобы отправить заявку.',
    nameLabel: 'Имя',
    phoneLabel: 'Телефон',
    priceLabel: 'Сумма',
    cancelButton: 'Отмена',
    submitButton: 'Отправить',
    successToastTitle: 'Успешно!',
    successToastDescription: 'Ваша заявка отправлена!',
  },
  uz: {
    siteTitle: 'Qozonlar savdosi',
    siteDescription: 'Uyingiz uchun eng yaxshi qozonni tanlang',
    buyButton: 'Sotib olish',
    requestTitle: 'Buyurtma',
    requestDescription: 'Buyurtma yuborish uchun quyidagi shaklni to\'ldiring.',
    nameLabel: 'Ism',
    phoneLabel: 'Telefon',
    priceLabel: 'Narx',
    cancelButton: 'Bekor qilish',
    submitButton: 'Yuborish',
    successToastTitle: 'Muvaffaqiyatli!',
    successToastDescription: 'Sizning arizangiz yuborildi!',
  },
};

export default function Home() {
  const [selectedBoiler, setSelectedBoiler] = useState<Boiler | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('ru');

  const t = translations[language as keyof typeof translations];

  useEffect(() => {
    // Check for saved theme in localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const handleBuyClick = (boiler: Boiler) => {
    setSelectedBoiler(boiler);
    setIsDialogOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Firestore submission here
    console.log({
      boilerId: selectedBoiler?.id,
      name,
      phone,
      offeredPrice,
    });

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsLoading(false);
    toast({
      title: t.successToastTitle,
      description: t.successToastDescription,
    });
    setIsDialogOpen(false); // Close dialog on success
    // Reset form fields
    setName('');
    setPhone('');
    setOfferedPrice('');
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{t.siteTitle}</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
            <Button
              variant={language === 'ru' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('ru')}
              className="px-3"
            >
              RU
            </Button>
            <Button
              variant={language === 'uz' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setLanguage('uz')}
              className="px-3"
            >
              UZ
            </Button>
          </div>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <p className="text-lg text-muted-foreground mt-2 mb-8">{t.siteDescription}</p>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {fakeBoilers.map((boiler) => (
              <Card key={boiler.id} className="flex flex-col overflow-hidden">
                <CardHeader className="p-0">
                  <Image
                    src={boiler.imageUrl}
                    alt={boiler.name[language]}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                    data-ai-hint="boiler heater"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-xl mb-2">{boiler.name[language]}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {boiler.description[language]}
                  </CardDescription>
                </CardContent>
                <CardFooter className="p-4 flex justify-between items-center">
                  <p className="text-2xl font-semibold text-primary">
                    {formatPrice(boiler.price)} UZS
                  </p>
                  <DialogTrigger asChild>
                    <Button onClick={() => handleBuyClick(boiler)}>{t.buyButton}</Button>
                  </DialogTrigger>
                </CardFooter>
              </Card>
            ))}
          </div>

          {selectedBoiler && (
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>{t.requestTitle} {selectedBoiler.name[language]}</DialogTitle>
                <DialogDescription>
                  {t.requestDescription}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      {t.nameLabel}
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="col-span-3"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phone" className="text-right">
                      {t.phoneLabel}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+998 (xx) xxx-xx-xx"
                      className="col-span-3"
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="offeredPrice" className="text-right">
                      {t.priceLabel}
                    </Label>
                    <Input
                      id="offeredPrice"
                      value={offeredPrice}
                      onChange={(e) => setOfferedPrice(e.target.value)}
                      className="col-span-3"
                      required
                      type="number"
                      disabled={isLoading}
                    />
                  </div>
                </div>
                <DialogFooter>
                   <DialogClose asChild>
                     <Button type="button" variant="secondary" disabled={isLoading}>
                      {t.cancelButton}
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {t.submitButton}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          )}
        </Dialog>
      </main>
    </div>
  );
}
