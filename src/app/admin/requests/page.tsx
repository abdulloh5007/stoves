'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import uz from '@/locales/uz.json';
import { List, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const t = uz.requests;

// Mock data for requests
export const fakeRequests = [
  { id: 1, boilerName: 'Котел "Теплодар-1"', customerName: 'Иван Иванов', phone: '+998 90 123-45-67', offeredPrice: '145000', status: 'new', date: '2024-07-28T10:00:00Z', address: '' },
  { id: 2, boilerName: 'Котел "Пламя-2"', customerName: 'Алишер Усманов', phone: '+998 91 234-56-78', offeredPrice: '220000', status: 'contacted', date: '2024-07-28T11:30:00Z', address: 'Toshkent, Amir Temur ko\'chasi, 1' },
  { id: 3, boilerName: 'Котел "Уют-3"', customerName: 'Елена Петрова', phone: '+998 93 345-67-89', offeredPrice: '180000', status: 'done', date: '2024-07-27T15:00:00Z', address: '' },
  { id: 4, boilerName: 'Котел "Гигант-4"', customerName: 'Сардор Камилов', phone: '+998 94 456-78-90', offeredPrice: '300000', status: 'new', date: '2024-07-26T09:00:00Z', address: '' },
  { id: 5, boilerName: 'Котел "Теплодар-1"', customerName: 'Ольга Сидорова', phone: '+998 99 567-89-01', offeredPrice: '150000', status: 'new', date: '2024-07-25T18:45:00Z', address: '' },
];

export const statusMap = {
  new: { text: 'Yangi', variant: 'destructive' as const, className: 'bg-red-500 text-white' },
  contacted: { text: 'Aloqaga chiqildi', variant: 'secondary' as const, className: 'bg-yellow-500 text-white' },
  done: { text: 'Bajarildi', variant: 'default' as const, className: 'bg-green-500 text-white' },
};

// Helper to format numbers with spaces
const formatPrice = (priceString: string) => {
    const numberPart = parseInt(priceString, 10);
    if (isNaN(numberPart)) return priceString;
    const formattedNumber = numberPart.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedNumber} UZS`;
};


type ViewMode = 'table' | 'card';

export default function RequestsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const router = useRouter();

  const handleRowClick = (id: number) => {
      router.push(`/admin/requests/${id}`);
  };

  const TableView = () => (
    <Card className="hidden md:block">
      <CardContent className="p-0">
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
              <TableRow key={request.id} onClick={() => handleRowClick(request.id)} className="cursor-pointer">
                <TableCell>{request.id}</TableCell>
                <TableCell>{request.boilerName}</TableCell>
                <TableCell>{request.customerName}</TableCell>
                <TableCell>{request.phone}</TableCell>
                <TableCell>{formatPrice(request.offeredPrice)}</TableCell>
                <TableCell>
                  <Badge variant={statusMap[request.status as keyof typeof statusMap].variant}>
                    {statusMap[request.status as keyof typeof statusMap].text}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );

  const MobileTableView = () => (
     <Card className="md:hidden">
        <CardContent className="p-0">
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
                    <TableRow key={request.id} onClick={() => handleRowClick(request.id)} className="cursor-pointer">
                        <TableCell>{request.id}</TableCell>
                        <TableCell>{request.boilerName}</TableCell>
                        <TableCell>{request.customerName}</TableCell>
                        <TableCell>{request.phone}</TableCell>
                        <TableCell>{formatPrice(request.offeredPrice)}</TableCell>
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
        </CardContent>
     </Card>
  );

  const CardView = () => (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {fakeRequests.map((request) => (
            <Link href={`/admin/requests/${request.id}`} key={request.id} passHref>
              <Card className="cursor-pointer hover:shadow-lg transition-shadow">
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
                          <span>{formatPrice(request.offeredPrice)}</span>
                      </div>
                  </CardContent>
              </Card>
            </Link>
        ))}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{t.title}</h1>
                <p className="text-muted-foreground">{t.description}</p>
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
        </div>

        <div>
            {viewMode === 'table' ? (
                <>
                    <TableView />
                    <MobileTableView />
                </>
            ) : (
                <CardView />
            )}
        </div>
    </div>
  );
}
