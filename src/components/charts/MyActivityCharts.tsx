import BeachesPieChart from '@/components/charts/beaches/Pie';
import DataFrequencySection from '@/components/charts/frequency/Pie';
import FrequencyDataSection from '@/components/charts/frequency/Data';
import RatingsPieChart from '@/components/charts/ratings/Pie';
import { filters, rawData } from '@/components/charts/types';
import { SurfActivityType } from '@/types/types';
import { Card, Grid } from '@nextui-org/react';
import { SurfPercentage } from '../cards/SurfPercentage';
import { SurfSessions } from '../cards/SurfSessions';
import { SurfSubscriptions } from '../cards/SurfSubscriptions';
import { SurfRatingAmounts } from '../cards/SurfRatingAmounts';

interface SurfChartsProps {
  surfExperiencesData: SurfActivityType[];
  filters: filters;
}

const MyActivityCharts: React.FC<SurfChartsProps> = ({
  surfExperiencesData,
  filters,
}) => {
  const processSurfExperienceData = () => {
    // Process surf experience data to generate chart data

    // Generate surf frequency data
    const surfFrequency: rawData = {};
    surfExperiencesData.forEach((experience) => {
      const date = experience.date;
      if (surfFrequency[date]) {
        surfFrequency[date]++;
      } else {
        surfFrequency[date] = 1;
      }
    });
    const surfFrequencyChartData = Object.entries(surfFrequency).map(
      ([date, frequency]) => ({
        name: date,
        value: frequency,
      })
    );

    // Generate ratings data
    const ratings = [1, 2, 3, 4];
    const ratingsCount: rawData = {};
    ratings.forEach((rating) => {
      ratingsCount[rating] = 0;
    });
    surfExperiencesData.forEach((experience) => {
      const rating = experience.mySurfRating?.rating;
      if (!rating) return;
      ratingsCount[rating]++;
    });
    const ratingsChartData = ratings.map((rating) => ({
      name: rating.toString(),
      value: ratingsCount[rating],
    }));

    // Generate beaches data
    const beaches: rawData = {};
    surfExperiencesData.forEach((experience) => {
      const beach = experience.beach;
      if (beaches[beach.name]) {
        beaches[beach.name]++;
      } else {
        beaches[beach.name] = 1;
      }
    });
    const beachesChartData = Object.entries(beaches).map(([beach, count]) => ({
      text: beach,
      value: count,
    }));

    return { surfFrequencyChartData, ratingsChartData, beachesChartData };
  };

  const { surfFrequencyChartData, ratingsChartData, beachesChartData } =
    processSurfExperienceData();


  return (
    <div className="flex flex-col w-full">
      <Grid.Container gap={2} justify="center">
        <Grid xs={12} md={3}>
          <SurfPercentage data={surfFrequencyChartData} filters={filters} />
        </Grid>
        <Grid xs={12} md={3}>
          <SurfSessions data={surfExperiencesData} filters={filters} />
        </Grid>
        <Grid xs={12} md={3}>
          <BeachesPieChart data={beachesChartData} width={250} height={250} />
        </Grid>
        <Grid xs={12} md={3}>
          <SurfRatingAmounts data={ratingsChartData} />
        </Grid>
      </Grid.Container>
    </div>
  );
};

export default MyActivityCharts;
