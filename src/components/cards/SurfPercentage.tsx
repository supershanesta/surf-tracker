'use client';

import { TrendingUp } from 'lucide-react';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { useEffect, useState } from 'react';

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
import { ChartProps } from '@/components/charts/types';
import { getDatesInRange } from '@/components/charts/utils';

const chartConfig = {
  surfed: {
    label: 'Days Surfed',
    color: 'hsl(var(--chart-1))',
  },
  skipped: {
    label: 'Days Skipped',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function SurfPercentage({ data, filters }: ChartProps) {
  const [chartData, setChartData] = useState<
    Array<{ surfed: number; skipped: number }>
  >([]);
  const [surfPercentage, setSurfPercentage] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [surfed, setSurfed] = useState<number>(0);

  useEffect(() => {
    const totalDays = getDatesInRange(
      filters.startDate,
      filters.endDate
    ).length;
    const surfedDays = data.length;
    const skippedDays = totalDays - surfedDays;
    const percentage = Math.round((surfedDays / totalDays) * 100);

    setTotal(totalDays);
    setSurfed(surfedDays);
    setSurfPercentage(percentage);
    setChartData([
      {
        surfed: surfedDays,
        skipped: skippedDays,
      },
    ]);
  }, [data, filters.startDate, filters.endDate]);

  return (
    <Card className="flex flex-col w-full">
      <CardHeader className="items-center pb-0">
        <CardTitle>Surf Frequency</CardTitle>
        <CardDescription>Selected Period</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        {chartData.length > 0 && (
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-[2/1] w-full max-w-[250px]"
          >
            <RadialBarChart
              data={chartData}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
              startAngle={0}
              cy="90%"
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className="fill-foreground text-2xl font-bold"
                          >
                            {surfPercentage}%
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className="fill-muted-foreground"
                          >
                            Days Surfed
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                dataKey="surfed"
                stackId="a"
                cornerRadius={5}
                fill="hsl(var(--chart-1))"
                className="stroke-transparent stroke-2"
              />
              <RadialBar
                dataKey="skipped"
                stackId="a"
                cornerRadius={5}
                fill="hsl(var(--chart-2))"
                className="stroke-transparent stroke-2"
              />
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {surfed} days surfed this period <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Out of {total} total days
        </div>
      </CardFooter>
    </Card>
  );
}
