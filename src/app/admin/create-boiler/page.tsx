
'use client';

import { useState, useRef } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import uz from '@/locales/uz.json';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import Image from 'next/image';

const t = uz.createBoiler;
const MAX_IMAGES = 4;

const formatPrice = (price: number | string) => {
  const num = typeof price === 'string' ? parseFloat(price.replace(/\s/g, '')) : price;
  if (isNaN(num)) return '';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

interface ImageFile {
  file: File;
  previewUrl: string;
}

export default function CreateBoilerPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFiles, setImageFiles] = useState<ImageFile[]>([]);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setImageFiles([]);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\s/g, '');
    if (/^\d*$/.test(rawValue)) {
      setPrice(formatPrice(rawValue));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles: ImageFile[] = Array.from(files).map(file => ({
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      if (imageFiles.length + newFiles.length > MAX_IMAGES) {
        toast({
          title: "Xatolik",
          description: `Maksimum ${MAX_IMAGES} ta rasm yuklash mumkin.`,
          variant: 'destructive',
        });
        return;
      }
      
      setImageFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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
        description: `Rasm yuklanmadi: ${file.name}.`,
        variant: "destructive",
      });
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description || !price || imageFiles.length === 0) {
        toast({
            title: "Xatolik",
            description: "Iltimos, barcha maydonlarni to'ldiring va kamida bitta rasm tanlang.",
            variant: "destructive"
        });
        return;
    }
    
    setIsLoading(true);

    const uploadPromises = imageFiles.map(imageFile => uploadImage(imageFile.file));
    const imageUrls = (await Promise.all(uploadPromises)).filter((url): url is string => url !== null);
    
    if (imageUrls.length !== imageFiles.length) {
        toast({
            title: "Xatolik",
            description: "Ba'zi rasmlar yuklanmadi. Iltimos qayta urinib ko'ring.",
            variant: "destructive",
        });
        setIsLoading(false);
        return;
    }

    try {
        await addDoc(collection(db, 'boilers'), {
            name: name,
            description: description,
            price: Number(price.replace(/\s/g, '')),
            imageUrls: imageUrls,
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
                <Label htmlFor="image-upload">{t.image} (Maks. {MAX_IMAGES})</Label>
                 <Input 
                    id="image-upload"
                    ref={fileInputRef}
                    type="file" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                    disabled={isLoading || imageFiles.length >= MAX_IMAGES} 
                    className="hidden" 
                />
                 <Button asChild variant="outline" type="button" disabled={isLoading || imageFiles.length >= MAX_IMAGES}>
                    <Label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="mr-2 h-4 w-4" />
                        Rasm tanlang
                    </Label>
                </Button>
              </div>
               {imageFiles.length > 0 && (
                <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                  {imageFiles.map((imageFile, index) => (
                    <div key={index} className="relative aspect-square w-full rounded-md overflow-hidden border group">
                       <Image 
                           src={imageFile.previewUrl} 
                           alt={`Preview ${index + 1}`}
                           fill={true}
                           style={{objectFit: "cover"}}
                       />
                       <Button 
                         variant="destructive" 
                         size="icon" 
                         className="absolute top-1 right-1 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                         onClick={() => removeImage(index)}
                         type="button"
                       >
                         <X className="h-4 w-4" />
                       </Button>
                    </div>
                  ))}
                  {Array.from({ length: MAX_IMAGES - imageFiles.length }).map((_, index) => (
                      <div key={`placeholder-${index}`} 
                           className="aspect-square w-full rounded-md border-2 border-dashed flex items-center justify-center bg-muted cursor-pointer"
                           onClick={() => fileInputRef.current?.click()}>
                           <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                  ))}
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
