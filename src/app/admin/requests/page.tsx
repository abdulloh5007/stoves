'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import uz from '@/locales/uz.json';
import { List, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

const t = uz.requests;

// Mock data for requests
const fakeRequests = [
  { id: 1, boilerName: 'Котел "Теплодар-1"', customerName: 'Иван Иванов', phone: '+998 90 123-45-67', offeredPrice: '145000 UZS', status: 'new' },
  { id: 2, boilerName: 'Котел "Пламя-2"', customerName: 'Алишер Усманов', phone: '+998 91 234-56-78', offeredPrice: '220000 UZS', status: 'contacted' },
  { id: 3, boilerName: 'Котел "Уют-3"', customerName: 'Елена Петрова', phone: '+998 93 345-67-89', offeredPrice: '180000 UZS', status: 'done' },
  { id: 4, boilerName: 'Котел "Гигант-4"', customerName: 'Сардор Камилов', phone: '+998 94 456-78-90', offeredPrice: '300000 UZS', status: 'new' },
  { id: 5, boilerName: 'Котел "Теплодар-1"', customerName: 'Ольга Сидорова', phone: '+998 99 567-89-01', offeredPrice: '150000 UZS', status: 'new' },
];

const statusMap = {
  new: { text: 'Yangi', variant: 'destructive' as const },
  contacted: { text: 'Aloqaga chiqildi', variant: 'secondary' as const },
  done: { text: 'Bajarildi', variant: 'default' as const },
};

type ViewMode = 'table' | 'card';

export default function RequestsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
            <CardTitle>{t.title}</CardTitle>
            <CardDescription>{t.description}</CardDescription>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-muted p-1">
             <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('table')}
                className={cn("h-8 w-8", {
                    "bg-primary text-primary-foreground hover:bg-primary/90": viewMode === 'table'
                })}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'card' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => setViewMode('card')}
                className={cn("h-8 w-8", {
                    "bg-primary text-primary-foreground hover:bg-primary/90": viewMode === 'card'
                })}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'table' ? (
          <div className="hidden md:block">
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
                        {statusMap[request.status as keyof typeof statusMap].text}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}

        { /* Common container for both table scroll on mobile and card view */ }
        <div className={cn({ "md:hidden": viewMode === 'table' })}>
            {viewMode === 'table' ? (
                 <div className="w-full overflow-x-auto">
                    <Table className="min-w-[600px]">
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
                                {statusMap[request.status as keyof typeof statusMap].text}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                 </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {fakeRequests.map((request) => (
                        <Card key={request.id}>
                            <CardHeader>
                                <CardTitle className="text-base flex justify-between items-center">
                                    <span>{request.boilerName}</span>
                                    <Badge variant={statusMap[request.status as keyof typeof statusMap].variant}>
                                        {statusMap[request.status as keyof typeof statusMap].text}
                                    </Badge>
                                </CardTitle>
                                <CardDescription>{request.customerName}</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.phone}</span>
                                    <span>{request.phone}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">{t.price}</span>
                                    <span>{request.offeredPrice}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
