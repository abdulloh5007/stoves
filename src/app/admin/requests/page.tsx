'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ru from '@/locales/ru.json';
import uz from '@/locales/uz.json';

const translations = { ru, uz };

// Mock data for requests
const fakeRequests = [
  { id: 1, boilerName: 'Котел "Теплодар-1"', customerName: 'Иван Иванов', phone: '+998 90 123-45-67', offeredPrice: '145000 UZS', status: 'new' },
  { id: 2, boilerName: 'Котел "Пламя-2"', customerName: 'Алишер Усманов', phone: '+998 91 234-56-78', offeredPrice: '220000 UZS', status: 'contacted' },
  { id: 3, boilerName: 'Котел "Уют-3"', customerName: 'Елена Петрова', phone: '+998 93 345-67-89', offeredPrice: '180000 UZS', status: 'done' },
  { id: 4, boilerName: 'Котел "Гигант-4"', customerName: 'Сардор Камилов', phone: '+998 94 456-78-90', offeredPrice: '300000 UZS', status: 'new' },
  { id: 5, boilerName: 'Котел "Теплодар-1"', customerName: 'Ольга Сидорова', phone: '+998 99 567-89-01', offeredPrice: '150000 UZS', status: 'new' },
];

const statusMap = {
  new: { text: { ru: 'Новая', uz: 'Yangi' }, variant: 'destructive' as const },
  contacted: { text: { ru: 'Связались', uz: 'Aloqaga chiqildi' }, variant: 'secondary' as const },
  done: { text: { ru: 'Завершено', uz: 'Bajarildi' }, variant: 'default' as const },
};


export default function RequestsPage() {
  const [language, setLanguage] = useState('ru');

  useEffect(() => {
    const savedLang = localStorage.getItem('language') || 'ru';
    setLanguage(savedLang);
  }, []);

  const t = translations[language as keyof typeof translations].requests;
  const currentLang = language as keyof typeof translations;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
        <CardDescription>{t.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>{t.boilerName}</TableHead>
              <TableHead>{t.customerName}</TableHead>
              <TableHead>{t.phone}</TableHead>
              <TableHead>{t.price}</TableHead>
              <TableHead>{t.status}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fakeRequests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.boilerName}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>{request.offeredPrice}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[request.status as keyof typeof statusMap].variant}>
                    {statusMap[request.status as keyof typeof statusMap].text[currentLang]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
