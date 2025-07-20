'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ApplicationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Заявки</h1>
      <Card>
        <CardHeader>
          <CardTitle>Список заявок</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Здесь будет таблица с заявками.</p>
        </CardContent>
      </Card>
    </div>
  );
}
