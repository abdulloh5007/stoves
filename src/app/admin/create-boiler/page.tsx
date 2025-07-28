
'use client';

import { useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, AlertCircle } from 'lucide-react';
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

export default function CreateBoilerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageFile(null);
    setPreviewUrl(null);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) {
      setPrice(formatPrice(rawValue));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!apiKey) {
      toast({
        title: "Xatolik",
        description: "IMGBB API kaliti topilmadi. .env.local faylini tekshiring.",
        variant: "destructive",
      });
      return null;
    }

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await axios.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData);
      if (response.data.success) {
        return response.data.data.url;
      } else {
        throw new Error(response.data.error.message);
      }
    } catch (error) {
      console.error("Error uploading image: ", error);
      toast({
        title: "Rasm yuklashda xatolik",
        description: "Rasm imgbb'ga yuklanmadi.",
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || !imageFile) {
        toast({
            title: "Xatolik",
            description: "Iltimos, barcha maydonlarni to'ldiring va rasm tanlang.",
            variant: "destructive"
        });
        return;
    }
    
    setIsLoading(true);

    const imageUrl = await uploadImage(imageFile);
    
    if (!imageUrl) {
        setIsLoading(false);
        return;
    }

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
                <Label htmlFor="image-upload">{t.image}</Label>
                <Input id="image-upload" type="file" accept="image/*" onChange={handleFileChange} disabled={isLoading} className="hidden" />
                <Button asChild variant="outline" type="button" disabled={isLoading}>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Rasm tanlang
                    </Label>
                </Button>
              </div>
              {previewUrl && (
                <div className="grid gap-2">
                    <Label>Rasm oldindan ko'rinishi</Label>
                    <div className="relative aspect-video w-full max-w-sm rounded-md overflow-hidden border flex items-center justify-center bg-muted">
                        <Image 
                           src={previewUrl} 
                           alt="Image preview" 
                           fill={true}
                           style={{objectFit: "contain"}}
                        />
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
