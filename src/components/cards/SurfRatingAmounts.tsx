'use client';

import { TrendingUp } from 'lucide-react';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface SurfRatingAmountsProps {
  data: { name: string; value: number }[];
}

const chartConfig = {
  poor: {
    label: 'Poor',
    color: 'hsl(var(--chart-1))',
  },
  fair: {
    label: 'Fair',
    color: 'hsl(var(--chart-2))',
  },
  good: {
    label: 'Good',
    color: 'hsl(var(--chart-3))',
  },
  epic: {
    label: 'Epic',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

export function SurfRatingAmounts({ data }: SurfRatingAmountsProps) {
  const chartData = [
    {
      rating: 'poor',
      count: data.find((d) => d.name === '1')?.value || 0,
      fill: 'hsl(var(--chart-1))',
    },
    {
      rating: 'fair',
      count: data.find((d) => d.name === '2')?.value || 0,
      fill: 'hsl(var(--chart-2))',
    },
    {
      rating: 'good',
      count: data.find((d) => d.name === '3')?.value || 0,
      fill: 'hsl(var(--chart-3))',
    },
    {
      rating: 'epic',
      count: data.find((d) => d.name === '4')?.value || 0,
      fill: 'hsl(var(--chart-4))',
    },
  ];

  const totalSessions = chartData.reduce((sum, item) => sum + item.count, 0);
  const averageRating =
    totalSessions > 0
      ? chartData.reduce(
          (sum, item, index) => sum + item.count * (index + 1),
          0
        ) / totalSessions
      : 0;

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Surf Rating Distribution</CardTitle>
        <CardDescription>Selected Period</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{
              left: 0,
            }}
          >
            <YAxis
              dataKey="rating"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label
              }
            />
            <XAxis dataKey="count" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent nameKey="count" hideLabel />}
            />
            <Bar dataKey="count" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Average rating: {averageRating.toFixed(2)}{' '}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Based on {totalSessions} rated sessions
        </div>
      </CardFooter>
    </Card>
  );
}
