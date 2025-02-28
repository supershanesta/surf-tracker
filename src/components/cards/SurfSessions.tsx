import { Line, LineChart, XAxis, YAxis } from 'recharts';
import { SurfActivityType } from '@/types/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ChartConfig } from '@/components/ui/chart';
import { ResponsiveContainer } from 'recharts';

interface SurfSessionsProps {
  data: SurfActivityType[];
  filters: {
    startDate: string;
    endDate: string;
  };
}

const chartConfig = {
  sessions: {
    label: 'Sessions',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

export function SurfSessions({ data, filters }: SurfSessionsProps) {
  // Get total sessions
  const totalSessions = data.length;

  // Create an array of all dates in the range
  const getDatesInRange = (startDate: string, endDate: string) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);

    while (currentDate <= end) {
      dates.push(currentDate.toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // Create chart data with daily cumulative totals
  const chartData = getDatesInRange(filters.startDate, filters.endDate).map(
    (date) => {
      const sessionsUpToDate = data.filter(
        (session) => new Date(session.date) <= new Date(date)
      ).length;

      return {
        date,
        sessions: sessionsUpToDate,
      };
    }
  );

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>Total Surfing Sessions</CardTitle>
      </CardHeader>
      <CardContent className="pb-4">
        <div className="text-2xl font-bold">{totalSessions}</div>
        <p className="text-xs text-muted-foreground">All time sessions</p>
        <div className="h-[80px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 10,
                left: 10,
                bottom: 0,
              }}
            >
              <XAxis dataKey="date" hide interval="preserveStartEnd" />
              <YAxis hide />
              <Line
                type="natural"
                strokeWidth={2}
                dataKey="sessions"
                stroke="hsl(var(--chart-1))"
                dot={false}
                activeDot={{
                  r: 6,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
