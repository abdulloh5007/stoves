'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import uz from '@/locales/uz.json';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';

const t = uz.createBoiler;

const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

// Simple URL validation
const isValidUrl = (url: string) => {
    try {
        new URL(url);
        return true;
    } catch (e) {
        return false;
    }
};

export default function CreateBoilerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageError, setImageError] = useState(false);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageUrl('');
    setImageError(false);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) {
      setPrice(formatPrice(rawValue));
    }
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url === '' || isValidUrl(url)) {
      setImageError(false);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageUrl) {
        toast({
            title: "Xatolik",
            description: "Iltimos, barcha maydonlarni to'ldiring.",
            variant: "destructive"
        });
        return;
    }
    if (!isValidUrl(imageUrl)) {
        toast({
            title: "Xatolik",
            description: "Rasm uchun URL noto'g'ri kiritilgan.",
            variant: "destructive"
        });
        return;
    }
    setIsLoading(true);

    try {
        await addDoc(collection(db, 'boilers'), {
            name: name,
            description: description,
            price: Number(price.replace(/\s/g, '')),
            imageUrl: imageUrl,
        });
        
        toast({
            title: t.successTitle,
            description: t.successDescription,
        });
        resetForm();
    } catch (error) {
        console.error("Error adding document: ", error);
        toast({
            title: "Xatolik",
            description: "Qozon yaratishda xatolik yuz berdi.",
            variant: "destructive",
        });
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="flex justify-center">
      <form onSubmit={handleSubmit} className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
              <div className="grid gap-2">
                  <Label htmlFor="name_uz">{t.name_uz}</Label>
                  <Input id="name_uz" placeholder={t.name_uz_placeholder} disabled={isLoading} value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="description_uz">{t.description_uz}</Label>
                  <Textarea id="description_uz" placeholder={t.description_uz_placeholder} disabled={isLoading} value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="price">{t.price}</Label>
                  <Input id="price" type="text" inputMode="numeric" placeholder="250 000" disabled={isLoading} value={price} onChange={handlePriceChange} />
              </div>
              <div className="grid gap-2">
                  <Label htmlFor="image">{t.image}</Label>
                  <Input id="image" type="url" placeholder="https://example.com/image.png" disabled={isLoading} value={imageUrl} onChange={handleImageUrlChange} />
              </div>
              {imageUrl && (
                <div className="grid gap-2">
                    <Label>Rasm oldindan ko'rinishi</Label>
                    <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border flex items-center justify-center bg-muted">
                        {isValidUrl(imageUrl) && !imageError ? (
                             <Image 
                                src={imageUrl} 
                                alt="Image preview" 
                                fill={true}
                                style={{objectFit: "contain"}}
                                onError={() => setImageError(true)}
                             />
                        ) : (
                             <div className="text-center text-destructive p-4">Noto'g'ri URL</div>
                        )}
                    </div>
                </div>
              )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t.submitButton}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}
