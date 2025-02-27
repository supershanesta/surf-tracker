'use client';

import { Bar, BarChart } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer } from '@/components/ui/chart';

const data = [
  { subscription: 240 },
  { subscription: 300 },
  { subscription: 200 },
  { subscription: 278 },
  { subscription: 189 },
  { subscription: 239 },
  { subscription: 278 },
  { subscription: 189 },
];

const chartConfig = {
  subscription: {
    label: 'Subscriptions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SurfSubscriptions() {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-normal">Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+2350</div>
        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
        <ChartContainer config={chartConfig} className="mt-2 h-[80px] w-full">
          <BarChart data={data}>
            <Bar dataKey="subscription" fill="hsl(var(--chart-1))" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
