'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  const t = {
    home: 'Главная',
    applications: 'Заявки',
    boilers: 'Котлы'
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">{t.home}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t.applications}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.boilers}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">0</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
