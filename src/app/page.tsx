'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import { Loader2, Moon, Sun, UserCog } from 'lucide-react';
import uz from '@/locales/uz.json';

const t = uz.home;

// Boiler type definition
interface Boiler {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

// Mock data for boilers
const fakeBoilers: Boiler[] = [
  {
    id: 'boiler-1',
    name: '"Teplodar-1" qozoni',
    price: 150000,
    description: 'Uyingiz uchun ishonchli va samarali ko\'mirli qozon.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-2',
    name: '"Plamya-2" qozoni',
    price: 220000,
    description: 'Yuqori samaradorlik va avtomatikaga ega zamonaviy gaz qozoni.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-3',
    name: '"Uyut-3" qozoni',
    price: 185000,
    description: 'Kichik xonalar uchun ideal bo\'lgan ixcham elektr qozon.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
  {
    id: 'boiler-4',
    name: '"Gigant-4" qozoni',
    price: 310000,
    description: 'Katta maydonlarni isitish uchun kuchli sanoat qozoni.',
    imageUrl: 'https://placehold.co/600x400.png',
  },
];

// Helper to format numbers with spaces
const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

export default function Home() {
  const [selectedBoiler, setSelectedBoiler] = useState<Boiler | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [offeredPrice, setOfferedPrice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') || 'dark' : 'dark';
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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, '');
    let formatted = '+998 ';
    
    if (rawValue.length > 3) {
      formatted += `(${rawValue.substring(3, 5)}`;
    }
    if (rawValue.length >= 6) {
      formatted += `) ${rawValue.substring(5, 8)}`;
    }
    if (rawValue.length >= 9) {
      formatted += `-${rawValue.substring(8, 10)}`;
    }
     if (rawValue.length >= 11) {
      formatted += `-${rawValue.substring(10, 12)}`;
    }

    // Prevent user from deleting the prefix
    if (e.target.value.length < 5) {
       setPhone('+998 ');
       return;
    }

    setPhone(formatted.slice(0, 19)); // Max length for +998 (xx) xxx-xx-xx
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) { // only allow digits
      setOfferedPrice(formatPrice(rawValue));
    }
  };


  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Implement Firestore submission here
    console.log({
      boilerId: selectedBoiler?.id,
      name,
      phone,
      offeredPrice: offeredPrice.replace(/\s/g, ''), // Send raw number
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
    setPhone('+998 ');
    setOfferedPrice('');
  };

  return (
    <div className="bg-background min-h-screen">
      <header className="container mx-auto py-4 px-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">{t.siteTitle}</h1>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          <Link href="/admin/login" passHref>
             <Button variant="outline" size="sm">
                <UserCog className="mr-2 h-4 w-4" />
                {t.adminLogin}
             </Button>
          </Link>
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
                    alt={boiler.name}
                    width={600}
                    height={400}
                    className="object-cover w-full h-48"
                    data-ai-hint="boiler heater"
                  />
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-xl mb-2">{boiler.name}</CardTitle>
                  <CardDescription className="text-base text-muted-foreground">
                    {boiler.description}
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
                <DialogTitle>{t.requestTitle} {selectedBoiler.name}</DialogTitle>
                <DialogDescription>
                  {t.requestDescription}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleFormSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name">
                      {t.nameLabel}
                    </Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="phone">
                      {t.phoneLabel}
                    </Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={handlePhoneChange}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="offeredPrice">
                      {t.priceLabel}
                    </Label>
                    <Input
                      id="offeredPrice"
                      value={offeredPrice}
                      onChange={handlePriceChange}
                      required
                      type="text"
                      inputMode="numeric"
                      disabled={isLoading}
                      placeholder='100 000'
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
